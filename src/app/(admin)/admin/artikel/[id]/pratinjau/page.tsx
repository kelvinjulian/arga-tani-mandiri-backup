import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { requireAdminPage } from "@/lib/supabase/admin";
import { isValidUuid } from "@/lib/articles/admin-validation";
import {
  getArticles,
  getSiteContent,
  type ContentArticleItem,
  type ContentArticleStatus,
} from "@/lib/content";
import { ArticleDetailView } from "@/components/ArticleDetailView";
import type { ArticleSection } from "@/data/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pratinjau Artikel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

interface AdminArtikelPreviewPageProps {
  params: Promise<{ id: string }>;
}

function statusLabel(status: ContentArticleStatus): string {
  if (status === "published") return "Terbit";
  if (status === "review") return "Review (DRAFT Publik)";
  return "Draft (Hanya Admin)";
}

export default async function AdminArtikelPreviewPage({
  params,
}: AdminArtikelPreviewPageProps) {
  const { supabase } = await requireAdminPage();
  const { id } = await params;

  if (!isValidUuid(id)) {
    notFound();
  }

  const [{ data: row, error }, allArticles, siteData] = await Promise.all([
    supabase.from("articles").select("*").eq("id", id).maybeSingle(),
    getArticles(),
    getSiteContent(),
  ]);

  if (error || !row) {
    notFound();
  }

  const rawTakeaways = Array.isArray(row.takeaways)
    ? row.takeaways.filter((t: unknown): t is string => typeof t === "string")
    : [];

  const article: ContentArticleItem = {
    id: row.id,
    slug: row.slug,
    status: row.status as ContentArticleStatus,
    categoryLabel: row.category,
    filterCategory: row.filter_category,
    readingTime: row.reading_time,
    isFeatured: Boolean(row.is_featured),
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
    takeaways: [
      rawTakeaways[0] ?? "",
      rawTakeaways[1] ?? "",
      rawTakeaways[2] ?? "",
    ],
    tags: Array.isArray(row.tags) ? row.tags : [],
    sections: Array.isArray(row.body) ? (row.body as ArticleSection[]) : [],
  };

  const relatedArticles = allArticles.filter((item) => item.id !== article.id);

  return (
    <div className="min-h-dvh w-full bg-[#F8FBF9]">
      {/* Admin Preview Bar */}
      <div className="sticky top-0 z-40 border-b border-[#CBD8D0] bg-[#0F1F17] text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <Eye className="h-4 w-4 text-emerald-300" aria-hidden="true" />
            <span className="font-semibold">Mode Pratinjau Admin</span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-bold text-emerald-200">
              Status: {statusLabel(article.status)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={adminPath(`/artikel/${article.id}`)}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#D9F0E3] px-3 py-1.5 text-xs font-bold text-[#0F1F17] hover:bg-white"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kembali ke Editor</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Artikel", href: adminPath("/artikel") },
            { label: "Pratinjau Artikel" },
          ]}
          className="mb-0"
        />
      </div>

      {/* Reused Public Article Rendering Component */}
      <ArticleDetailView
        article={article}
        relatedArticles={relatedArticles}
        officialStoreName={siteData.officialStore.name}
        shopeeStoreUrl={siteData.officialStore.url}
        whatsappNumber={siteData.whatsappNumber}
      />
    </div>
  );
}
