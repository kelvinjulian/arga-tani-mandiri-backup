import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/supabase/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ArticleEditorForm,
  type ArticleEditorInitialData,
} from "@/components/admin/ArticleEditorForm";
import { isValidUuid } from "@/lib/articles/admin-validation";
import type { ArticleSection } from "@/data/articles";
import { getArticleCategories, type ContentArticleStatus } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ubah Artikel",
};

interface AdminArtikelEditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminArtikelEditPage({
  params,
  searchParams,
}: AdminArtikelEditPageProps) {
  const { supabase, user } = await requireAdminPage();
  const { id } = await params;
  const sp = await searchParams;

  if (!isValidUuid(id)) {
    notFound();
  }

  const [{ data: row, error }, articleCategories] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    getArticleCategories(),
  ]);

  if (error || !row) {
    notFound();
  }

  const category = typeof row.category === "string" ? row.category : "";
  const filterCategory =
    typeof row.filter_category === "string" ? row.filter_category : "";

  const initialData: ArticleEditorInitialData = {
    id: row.id,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    title: row.title ?? "",
    slug: row.slug ?? "",
    category,
    filter_category: filterCategory,
    reading_time: row.reading_time ?? "1 Menit Baca",
    is_featured: Boolean(row.is_featured),
    seo_title: row.seo_title ?? "",
    meta_description: row.meta_description ?? "",
    excerpt: row.excerpt ?? "",
    intro: row.intro ?? "",
    body: Array.isArray(row.body) ? (row.body as ArticleSection[]) : [],
    takeaways: Array.isArray(row.takeaways) ? row.takeaways : [""],
    tags: Array.isArray(row.tags) ? row.tags : [],
    image_src: row.image_src ?? "",
    image_alt: row.image_alt ?? "",
    status: (row.status as ContentArticleStatus) ?? "draft",
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Artikel", href: adminPath("/artikel") },
            { label: initialData.title || "Ubah Artikel" },
          ]}
        />
        <ArticleEditorForm
          initialData={initialData}
          articleCategories={articleCategories}
          justSaved={sp.saved === "1"}
        />
      </main>
    </div>
  );
}
