import type { ArticleSection } from "@/data/articles";
import type { ContentArticleStatus } from "@/lib/content";

export const SEO_TITLE_MAX = 60;
export const META_DESCRIPTION_MAX = 155;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB bucket limit

export const ARTICLE_FILTER_CATEGORIES = [
  "Panduan Label",
  "Manajemen Budidaya",
  "Pembenah Tanah",
  "Penyimpanan & Gudang",
] as const;

export type ArticleFilterCategory = (typeof ARTICLE_FILTER_CATEGORIES)[number];

export const ARTICLE_CATEGORY_OPTIONS = [
  "Panduan Label Kemasan",
  "Manajemen Budidaya",
  "Pembenah Tanah",
  "Penyimpanan & Gudang",
] as const;

export const ARTICLE_STATUS_OPTIONS: ReadonlyArray<{
  value: ContentArticleStatus;
  label: string;
  description: string;
}> = [
  {
    value: "draft",
    label: "Draft",
    description: "Hanya terlihat oleh admin di panel ini; tidak dapat diakses publik.",
  },
  {
    value: "review",
    label: "Review",
    description:
      "Dapat dibuka lewat tautan publik dengan label DRAFT, tetapi tidak diindeks mesin pencari.",
  },
  {
    value: "published",
    label: "Terbit",
    description:
      "Terbit untuk publik dan dapat diindeks mesin pencari saat pengindeksan situs aktif.",
  },
];

export interface ArticleEditorPayload {
  id?: string;
  originalUpdatedAt?: string;
  title: string;
  slug: string;
  category: string;
  filter_category: string;
  reading_time: string;
  is_featured: boolean;
  seo_title: string;
  meta_description: string;
  excerpt: string;
  intro: string;
  body: ArticleSection[];
  takeaways: string[];
  tags: string[];
  image_src: string;
  image_alt: string;
  status: ContentArticleStatus;
}

export interface ValidatedArticleData {
  title: string;
  slug: string;
  category: string;
  filter_category: ArticleFilterCategory;
  reading_time: string;
  is_featured: boolean;
  seo_title: string;
  meta_description: string;
  excerpt: string;
  intro: string;
  body: ArticleSection[];
  takeaways: string[];
  tags: string[];
  image_src: string;
  image_alt: string;
  status: ContentArticleStatus;
}

export type ArticleFieldErrors = Partial<
  Record<
    | "title"
    | "slug"
    | "category"
    | "filter_category"
    | "reading_time"
    | "seo_title"
    | "meta_description"
    | "excerpt"
    | "intro"
    | "body"
    | "takeaways"
    | "tags"
    | "image_src"
    | "image_alt"
    | "status",
    string
  >
>;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 120);
}

export function estimateReadingTime(
  intro: string,
  sections: ArticleSection[]
): string {
  const chunks: string[] = [intro];
  for (const sec of sections) {
    chunks.push(sec.heading);
    chunks.push(...sec.paragraphs);
    if (sec.bullets) chunks.push(...sec.bullets);
    if (sec.callout) {
      chunks.push(sec.callout.title, sec.callout.text);
    }
  }
  const words = chunks
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} Menit Baca`;
}

function isValidImageSrc(value: string): boolean {
  if (value.startsWith("/")) {
    return value.length > 1 && !value.startsWith("//");
  }
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function normalizeArticleBodySections(
  rawBody: unknown
): {
  sections: ArticleSection[];
  error?: string;
} {
  if (!Array.isArray(rawBody)) {
    return {
      sections: [],
      error: "Artikel harus memiliki minimal 1 bagian pembahasan.",
    };
  }

  const cleanSections: ArticleSection[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < rawBody.length; i++) {
    const sec = rawBody[i] as Record<string, unknown> | null;
    if (!sec || typeof sec !== "object") {
      return {
        sections: [],
        error: `Bagian ke-${i + 1} tidak valid.`,
      };
    }

    const heading = typeof sec.heading === "string" ? sec.heading.trim() : "";
    const paragraphs = Array.isArray(sec.paragraphs)
      ? sec.paragraphs
          .filter((p): p is string => typeof p === "string")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
    const bullets = Array.isArray(sec.bullets)
      ? sec.bullets
          .filter((b): b is string => typeof b === "string")
          .map((b) => b.trim())
          .filter(Boolean)
      : [];

    let callout: { title: string; text: string } | undefined;
    if (sec.callout && typeof sec.callout === "object") {
      const c = sec.callout as Record<string, unknown>;
      const cTitle = typeof c.title === "string" ? c.title.trim() : "";
      const cText = typeof c.text === "string" ? c.text.trim() : "";
      if (cTitle && cText) {
        callout = { title: cTitle, text: cText };
      } else if (cTitle || cText) {
        return {
          sections: [],
          error: `Kotak sorotan pada bagian ke-${i + 1} harus mengisi judul dan isi, atau dikosongkan keduanya.`,
        };
      }
      // If both cTitle and cText are empty, drop the empty callout
    }

    // Drop sections with no heading and no content
    if (
      !heading &&
      paragraphs.length === 0 &&
      bullets.length === 0 &&
      !callout
    ) {
      continue;
    }

    if (!heading) {
      return {
        sections: [],
        error: `Judul bagian ke-${cleanSections.length + 1} wajib diisi.`,
      };
    }

    if (paragraphs.length === 0) {
      return {
        sections: [],
        error: `Bagian ke-${cleanSections.length + 1} ("${heading}") harus memiliki minimal 1 paragraf.`,
      };
    }

    const rawId = typeof sec.id === "string" ? sec.id.trim() : "";
    let sectionId =
      slugifyText(rawId || heading) || `bagian-${cleanSections.length + 1}`;
    if (usedIds.has(sectionId)) {
      sectionId = `${sectionId}-${cleanSections.length + 1}`;
    }
    usedIds.add(sectionId);

    cleanSections.push({
      id: sectionId,
      heading,
      paragraphs,
      ...(bullets.length > 0 ? { bullets } : {}),
      ...(callout ? { callout } : {}),
    });
  }

  if (cleanSections.length === 0) {
    return {
      sections: [],
      error: "Artikel harus memiliki minimal 1 bagian pembahasan.",
    };
  }

  return { sections: cleanSections };
}

export function normalizeStringList(raw: unknown, deduplicate = false): string[] {
  if (!Array.isArray(raw)) return [];
  const trimmed = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  return deduplicate ? Array.from(new Set(trimmed)) : trimmed;
}

export function validateArticlePayload(raw: unknown): {
  ok: true;
  data: ValidatedArticleData;
} | {
  ok: false;
  fieldErrors: ArticleFieldErrors;
  formError: string;
} {
  if (!raw || typeof raw !== "object") {
    return {
      ok: false,
      fieldErrors: {},
      formError: "Data artikel tidak valid.",
    };
  }

  const input = raw as Record<string, unknown>;
  const fieldErrors: ArticleFieldErrors = {};

  const str = (key: string) =>
    typeof input[key] === "string" ? (input[key] as string).trim() : "";

  const title = str("title");
  if (!title) {
    fieldErrors.title = "Judul artikel wajib diisi.";
  } else if (title.length > 200) {
    fieldErrors.title = "Judul artikel maksimal 200 karakter.";
  }

  const slug = str("slug");
  if (!slug) {
    fieldErrors.slug = "Slug URL wajib diisi.";
  } else if (!SLUG_REGEX.test(slug)) {
    fieldErrors.slug =
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).";
  } else if (slug.length > 140) {
    fieldErrors.slug = "Slug maksimal 140 karakter.";
  }

  const category = str("category");
  if (
    !ARTICLE_CATEGORY_OPTIONS.includes(
      category as (typeof ARTICLE_CATEGORY_OPTIONS)[number]
    )
  ) {
    fieldErrors.category = "Pilih kategori tampilan yang valid.";
  }

  const filterCategory = str("filter_category");
  if (
    !ARTICLE_FILTER_CATEGORIES.includes(
      filterCategory as ArticleFilterCategory
    )
  ) {
    fieldErrors.filter_category =
      "Pilih kategori filter yang didukung halaman publik.";
  }

  const readingTime = str("reading_time");
  if (!readingTime) {
    fieldErrors.reading_time = "Estimasi waktu baca wajib diisi.";
  } else if (readingTime.length > 40) {
    fieldErrors.reading_time = "Waktu baca maksimal 40 karakter.";
  }

  const seoTitle = str("seo_title");
  if (!seoTitle) {
    fieldErrors.seo_title = "Judul SEO wajib diisi.";
  } else if (seoTitle.length > SEO_TITLE_MAX) {
    fieldErrors.seo_title = `Judul SEO maksimal ${SEO_TITLE_MAX} karakter.`;
  }

  const metaDescription = str("meta_description");
  if (!metaDescription) {
    fieldErrors.meta_description = "Deskripsi meta wajib diisi.";
  } else if (metaDescription.length > META_DESCRIPTION_MAX) {
    fieldErrors.meta_description = `Deskripsi meta maksimal ${META_DESCRIPTION_MAX} karakter.`;
  }

  const excerpt = str("excerpt");
  if (!excerpt) {
    fieldErrors.excerpt = "Ringkasan singkat (excerpt) wajib diisi.";
  } else if (excerpt.length > 500) {
    fieldErrors.excerpt = "Ringkasan singkat maksimal 500 karakter.";
  }

  const intro = str("intro");
  if (!intro) {
    fieldErrors.intro = "Paragraf pembuka (intro) wajib diisi.";
  } else if (intro.length > 1500) {
    fieldErrors.intro = "Paragraf pembuka maksimal 1500 karakter.";
  }

  const imageSrc = str("image_src");
  if (!imageSrc) {
    fieldErrors.image_src = "Gambar utama artikel wajib diunggah atau diisi.";
  } else if (!isValidImageSrc(imageSrc)) {
    fieldErrors.image_src = "URL gambar tidak valid.";
  }

  const imageAlt = str("image_alt");
  if (!imageAlt) {
    fieldErrors.image_alt = "Teks alternatif (alt) gambar wajib diisi.";
  } else if (imageAlt.length > 250) {
    fieldErrors.image_alt = "Teks alternatif gambar maksimal 250 karakter.";
  }

  const statusRaw = str("status");
  if (
    statusRaw !== "draft" &&
    statusRaw !== "review" &&
    statusRaw !== "published"
  ) {
    fieldErrors.status = "Status artikel tidak valid.";
  }

  const { sections: cleanSections, error: bodyError } =
    normalizeArticleBodySections(input.body);
  if (bodyError) {
    fieldErrors.body = bodyError;
  }

  const takeaways = normalizeStringList(input.takeaways);
  if (takeaways.length === 0) {
    fieldErrors.takeaways = "Tambahkan minimal 1 poin penting artikel.";
  }

  const tags = normalizeStringList(input.tags, true);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      category,
      filter_category: filterCategory as ArticleFilterCategory,
      reading_time: readingTime,
      is_featured: Boolean(input.is_featured),
      seo_title: seoTitle,
      meta_description: metaDescription,
      excerpt,
      intro,
      body: cleanSections,
      takeaways,
      tags,
      image_src: imageSrc,
      image_alt: imageAlt,
      status: statusRaw as ContentArticleStatus,
    },
  };
}
