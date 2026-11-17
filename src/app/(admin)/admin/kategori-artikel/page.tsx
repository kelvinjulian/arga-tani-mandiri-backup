import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  articleMatchesCategory,
  type ArticleCategoryItem,
} from "@/lib/article-categories";
import {
  ArticleCategoriesManagerClient,
  type ArticleCategoryWithCount,
} from "@/components/admin/ArticleCategoriesManagerClient";
import { mergeFilterChipsConfig } from "@/lib/site-content/filter-chips";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategori Artikel",
};

export default async function AdminArticleCategoriesPage() {
  const { supabase, user } = await requireAdminPage();

  const [
    { data: catRows, error: catError },
    { data: articleRows },
    { data: contentRows },
  ] = await Promise.all([
    supabase
      .from("article_categories")
      .select("id, slug, name, filter_label, sort_order, updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("articles").select("id, category, filter_category"),
    supabase
      .from("site_content")
      .select("key, value")
      .in("key", ["article_hub", "article_page"]),
  ]);

  const byKey = new Map<string, Record<string, unknown>>();
  if (Array.isArray(contentRows)) {
    for (const row of contentRows) {
      if (row && typeof row.key === "string" && row.value && typeof row.value === "object") {
        byKey.set(row.key, row.value as Record<string, unknown>);
      }
    }
  }
  const hubMaxVisibleChips = mergeFilterChipsConfig(
    byKey.get("article_hub") ?? {}
  ).maxVisibleChips;
  const pageMaxVisibleChips = mergeFilterChipsConfig(
    byKey.get("article_page") ?? {}
  ).maxVisibleChips;

  const articles = Array.isArray(articleRows)
    ? articleRows.map((r) => ({
        categoryLabel: typeof r.category === "string" ? r.category : "",
        filterCategory:
          typeof r.filter_category === "string" ? r.filter_category : "",
      }))
    : [];

  const categories: ArticleCategoryWithCount[] = Array.isArray(catRows)
    ? catRows.map((row, idx) => {
        const item: ArticleCategoryItem = {
          id: row.id,
          slug: row.slug,
          name: row.name,
          filterLabel:
            typeof row.filter_label === "string" && row.filter_label.trim()
              ? row.filter_label.trim()
              : row.name,
          sortOrder: typeof row.sort_order === "number" ? row.sort_order : idx,
          updatedAt: row.updated_at,
        };
        const count = articles.filter((a) =>
          articleMatchesCategory(a, item)
        ).length;
        return { ...item, articleCount: count };
      })
    : [];

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Konten Situs", href: adminPath("/konten") },
            { label: "Halaman Artikel" },
            { label: "Kategori Artikel" },
          ]}
          backHref={adminPath("/konten")}
          backLabel="Konten Situs"
        />
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
            Kategori Artikel Edukasi
          </h1>
          <p className="mt-1 text-sm text-[#33473D]">
            Kelola kategori filter untuk artikel di beranda dan halaman pusat
            artikel. Mengubah nama atau slug akan otomatis memperbarui artikel
            yang memakai kategori tersebut.
          </p>
        </div>

        <ArticleCategoriesManagerClient
          initialCategories={categories}
          tableMissing={Boolean(catError)}
          hubMaxVisibleChips={hubMaxVisibleChips}
          pageMaxVisibleChips={pageMaxVisibleChips}
        />
      </main>
    </div>
  );
}
