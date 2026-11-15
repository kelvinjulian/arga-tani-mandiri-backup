import { ARTICLES, type ArticleItem, type ArticleSection } from "@/data/articles";
import {
  productCategories,
  SHOPEE_STORE_URL,
  type ProductCategory,
} from "@/data/categories";
import { SITE_DATA, type SiteData } from "@/data/site";
import { getSupabaseClient } from "@/lib/supabase";
import {
  isValidHttpsUrl,
  isValidImageSrc,
  mergeSiteContentWithDefaults,
} from "@/lib/site-content/validation";
import {
  DEFAULT_ARTICLE_CATEGORIES,
  type ArticleCategoryItem,
} from "@/lib/article-categories";

export type ContentArticleStatus = "draft" | "review" | "published";

export interface ContentArticleItem extends Omit<ArticleItem, "status"> {
  status: ContentArticleStatus;
}

export interface ContentCategoryItem extends ProductCategory {
  id: string;
  slug: string;
  href: string;
}

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  seo_title: string;
  short_title: string | null;
  meta_description: string;
  excerpt: string;
  intro: string;
  body: unknown;
  category: string;
  filter_category: string;
  reading_time: string;
  is_featured: boolean;
  status: ContentArticleStatus;
  image_src: string;
  image_alt: string;
  takeaways: string[] | null;
  tags: string[] | null;
  published_at: string | null;
  updated_at: string | null;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_src: string;
  image_alt: string;
  external_url: string;
  sort_order: number;
}

interface SiteContentRow {
  key: string;
  value: Record<string, unknown>;
}

const FALLBACK_ARTICLES: ContentArticleItem[] = ARTICLES.map((item) => ({
  ...item,
  // Static preview articles marked "draft" correspond to "review" in the 3-state workflow
  status: item.status === "published" ? "published" : "review",
}));

const FALLBACK_CATEGORIES: ContentCategoryItem[] = productCategories.map(
  (cat, index) => ({
    ...cat,
    id: SITE_DATA.categoryShowcase.items[index]?.id ?? `cat-${index + 1}`,
    slug: cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    href: SITE_DATA.categoryShowcase.items[index]?.href ?? SHOPEE_STORE_URL,
  })
);

function warnDev(message: string, error?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[content] ${message}`, error ?? "");
  }
}

function normalizeTakeaways(raw: string[] | null | undefined): [string, string, string] {
  const list = Array.isArray(raw) ? raw.filter((item) => typeof item === "string") : [];
  return [list[0] ?? "", list[1] ?? "", list[2] ?? ""];
}

function normalizeSections(raw: unknown): ArticleSection[] {
  if (!Array.isArray(raw)) return [];
  return raw as ArticleSection[];
}

function mapArticleRow(row: ArticleRow): ContentArticleItem {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    categoryLabel: row.category,
    filterCategory: row.filter_category,
    readingTime: row.reading_time,
    isFeatured: row.is_featured,
    title: row.title,
    seoTitle: row.seo_title,
    ...(row.short_title ? { shortTitle: row.short_title } : {}),
    metaDescription: row.meta_description,
    ...(row.published_at ? { datePublished: row.published_at } : {}),
    ...(row.updated_at ? { dateModified: row.updated_at } : {}),
    imageSrc: row.image_src,
    imageAlt: row.image_alt,
    excerpt: row.excerpt,
    intro: row.intro,
    takeaways: normalizeTakeaways(row.takeaways),
    tags: Array.isArray(row.tags) ? row.tags : [],
    sections: normalizeSections(row.body),
  };
}

/**
 * Fetches publicly visible articles ('review' and 'published') from Supabase.
 * Falls back to static ARTICLES if Supabase is unconfigured, unreachable, or empty.
 */
export async function getArticles(): Promise<ContentArticleItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return FALLBACK_ARTICLES;
  }

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .in("status", ["review", "published"])
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: true });

    if (error) {
      warnDev("Gagal mengambil articles dari Supabase; menggunakan fallback statis.", error);
      return FALLBACK_ARTICLES;
    }

    if (!data || data.length === 0) {
      warnDev("Tabel articles kosong; menggunakan fallback statis.");
      return FALLBACK_ARTICLES;
    }

    return (data as ArticleRow[]).map(mapArticleRow);
  } catch (err) {
    warnDev("Terjadi kesalahan saat query articles; menggunakan fallback statis.", err);
    return FALLBACK_ARTICLES;
  }
}

/**
 * Fetches a single publicly visible article by slug ('review' or 'published').
 */
export async function getArticleBySlug(
  slug: string
): Promise<ContentArticleItem | undefined> {
  const articles = await getArticles();
  return articles.find((item) => item.slug === slug);
}

/**
 * Fetches product categories from Supabase ordered by sort_order.
 * Falls back to static productCategories if Supabase is unconfigured, unreachable, or empty.
 */
export async function getCategories(): Promise<ContentCategoryItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return FALLBACK_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      warnDev("Gagal mengambil categories dari Supabase; menggunakan fallback statis.", error);
      return FALLBACK_CATEGORIES;
    }

    if (!data || data.length === 0) {
      warnDev("Tabel categories kosong; menggunakan fallback statis.");
      return FALLBACK_CATEGORIES;
    }

    return (data as CategoryRow[]).map((row, idx) => {
      const def = FALLBACK_CATEGORIES[idx] ?? FALLBACK_CATEGORIES[0];
      const name =
        typeof row.name === "string" && row.name.trim()
          ? row.name.trim()
          : def.name;
      const description =
        typeof row.description === "string" && row.description.trim()
          ? row.description.trim()
          : def.description;
      const image =
        typeof row.image_src === "string" && isValidImageSrc(row.image_src.trim())
          ? row.image_src.trim()
          : def.image;
      const alt =
        typeof row.image_alt === "string" && row.image_alt.trim()
          ? row.image_alt.trim()
          : def.alt;
      const href =
        typeof row.external_url === "string" &&
        isValidHttpsUrl(row.external_url.trim())
          ? row.external_url.trim()
          : def.href;
      return {
        id: row.id,
        slug: row.slug,
        name,
        description,
        image,
        alt,
        href,
      };
    });
  } catch (err) {
    warnDev("Terjadi kesalahan saat query categories; menggunakan fallback statis.", err);
    return FALLBACK_CATEGORIES;
  }
}

/**
 * Fetches site_content JSONB blocks and merges them with static SITE_DATA defaults.
 */
export async function getSiteContent(): Promise<SiteData> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return SITE_DATA;
  }

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value");

    if (error) {
      warnDev("Gagal mengambil site_content dari Supabase; menggunakan fallback statis.", error);
      return SITE_DATA;
    }

    if (!data || data.length === 0) {
      warnDev("Tabel site_content kosong; menggunakan fallback statis.");
      return SITE_DATA;
    }

    const byKey = new Map<string, Record<string, unknown>>();
    for (const row of data as SiteContentRow[]) {
      if (row.key && row.value && typeof row.value === "object") {
        byKey.set(row.key, row.value);
      }
    }

    return mergeSiteContentWithDefaults(byKey);
  } catch (err) {
    warnDev("Terjadi kesalahan saat query site_content; menggunakan fallback statis.", err);
    return SITE_DATA;
  }
}

interface ArticleCategoryRow {
  id: string;
  slug: string;
  name: string;
  filter_label: string;
  sort_order: number;
  updated_at?: string;
}

/**
 * Fetches article categories ordered by sort_order.
 * Falls back to static defaults if the table is missing, empty, or unreachable.
 */
export async function getArticleCategories(): Promise<ArticleCategoryItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return DEFAULT_ARTICLE_CATEGORIES;
  }

  try {
    const { data, error } = await supabase
      .from("article_categories")
      .select("id, slug, name, filter_label, sort_order, updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        warnDev("Gagal mengambil article_categories; menggunakan fallback statis.", error);
      }
      return DEFAULT_ARTICLE_CATEGORIES;
    }

    return (data as ArticleCategoryRow[]).map((row, idx) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      filterLabel:
        typeof row.filter_label === "string" && row.filter_label.trim()
          ? row.filter_label.trim()
          : row.name,
      sortOrder: typeof row.sort_order === "number" ? row.sort_order : idx,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    warnDev("Terjadi kesalahan saat query article_categories; menggunakan fallback statis.", err);
    return DEFAULT_ARTICLE_CATEGORIES;
  }
}
