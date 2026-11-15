import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  ArticleEditorForm,
  type ArticleEditorInitialData,
} from "@/components/admin/ArticleEditorForm";
import {
  ARTICLE_CATEGORY_OPTIONS,
  ARTICLE_FILTER_CATEGORIES,
} from "@/lib/articles/admin-validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buat Artikel",
};

const EMPTY_ARTICLE: ArticleEditorInitialData = {
  title: "",
  slug: "",
  category: ARTICLE_CATEGORY_OPTIONS[0],
  filter_category: ARTICLE_FILTER_CATEGORIES[0],
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

export default async function AdminArtikelNewPage() {
  const { user } = await requireAdminPage();

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader
        userEmail={user.email ?? "Admin"}
        backHref="/admin/artikel"
        backLabel="Daftar Artikel"
      />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <ArticleEditorForm initialData={EMPTY_ARTICLE} />
      </main>
    </div>
  );
}
