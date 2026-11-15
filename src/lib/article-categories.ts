export interface ArticleCategoryItem {
  id: string;
  slug: string;
  name: string;
  filterLabel: string;
  sortOrder: number;
  updatedAt?: string;
}

export interface ArticleFilterOption {
  slug: string;
  label: string;
  name: string;
  filterLabel: string;
}

export const DEFAULT_ARTICLE_CATEGORIES: ArticleCategoryItem[] = [
  {
    id: "default-panduan-label",
    slug: "panduan-label",
    name: "Panduan Label Kemasan",
    filterLabel: "Panduan Label",
    sortOrder: 0,
  },
  {
    id: "default-manajemen-budidaya",
    slug: "manajemen-budidaya",
    name: "Manajemen Budidaya",
    filterLabel: "Manajemen Budidaya",
    sortOrder: 1,
  },
  {
    id: "default-pembenah-tanah",
    slug: "pembenah-tanah",
    name: "Pembenah Tanah",
    filterLabel: "Pembenah Tanah",
    sortOrder: 2,
  },
  {
    id: "default-penyimpanan-gudang",
    slug: "penyimpanan-gudang",
    name: "Penyimpanan & Distribusi",
    filterLabel: "Penyimpanan & Gudang",
    sortOrder: 3,
  },
];

export const ARTICLE_CATEGORY_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyCategoryName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
    .slice(0, 60);
}

export function articleMatchesCategory(
  article: { filterCategory: string; categoryLabel: string },
  category: { name: string; filterLabel: string }
): boolean {
  const f = article.filterCategory.trim();
  const c = article.categoryLabel.trim();
  return c === category.name.trim() || f === category.filterLabel.trim();
}

export function buildVisibleArticleCategoryFilters(
  categories: ArticleCategoryItem[],
  articles: Array<{ filterCategory: string; categoryLabel: string }>
): ArticleFilterOption[] {
  const ordered = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return ordered
    .filter((cat) =>
      articles.some((article) => articleMatchesCategory(article, cat))
    )
    .map((cat) => ({
      slug: cat.slug,
      label: cat.filterLabel,
      name: cat.name,
      filterLabel: cat.filterLabel,
    }));
}
