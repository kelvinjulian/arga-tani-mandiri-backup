import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ArticleEditorForm,
  type ArticleEditorInitialData,
} from "@/components/admin/ArticleEditorForm";
import {
  DEFAULT_ARTICLE_CATEGORIES,
} from "@/lib/article-categories";
import { getArticleCategories } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buat Artikel",
};

export default async function AdminArtikelNewPage() {
  const [{ user }, articleCategories] = await Promise.all([
    requireAdminPage(),
    getArticleCategories(),
  ]);
  const firstCat = articleCategories[0] ?? DEFAULT_ARTICLE_CATEGORIES[0];

  const emptyArticle: ArticleEditorInitialData = {
    title: "",
    slug: "",
    category: firstCat.name,
    filter_category: firstCat.filterLabel,
    reading_time: "1 Menit Baca",
    is_featured: false,
    seo_title: "",
    meta_description: "",
    excerpt: "",
    intro: "",
    body: [],
    takeaways: [""],
    tags: [],
    image_src: "",
    image_alt: "",
    status: "draft",
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Daftar Artikel", href: "/admin/artikel" },
            { label: "Buat Artikel" },
          ]}
        />
        <ArticleEditorForm
          initialData={emptyArticle}
          articleCategories={articleCategories}
        />
      </main>
    </div>
  );
}
