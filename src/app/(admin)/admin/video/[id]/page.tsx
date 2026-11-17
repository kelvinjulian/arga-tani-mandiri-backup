import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/supabase/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  VideoEditorForm,
  type VideoEditorInitialData,
} from "@/components/admin/VideoEditorForm";
import { isValidUuid } from "@/lib/articles/admin-validation";
import type { TikTokPlayMode, VideoStatus } from "@/lib/videos/url-parser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ubah Video",
};

interface AdminVideoEditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export default async function AdminVideoEditPage({
  params,
  searchParams,
}: AdminVideoEditPageProps) {
  const { supabase, user } = await requireAdminPage();
  const { id } = await params;
  const sp = await searchParams;

  if (!isValidUuid(id)) {
    notFound();
  }

  const { data: row, error } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const initialData: VideoEditorInitialData = {
    id: row.id as string,
    updatedAt: row.updated_at as string,
    url: (row.url as string) ?? "",
    title: (row.title as string) ?? "",
    description: (row.description as string) ?? "",
    duration: (row.duration as string) ?? "",
    thumbnail_src: (row.thumbnail_src as string) ?? "",
    status: ((row.status as VideoStatus) ?? "published") as VideoStatus,
    play_mode: (row.play_mode === "embed" ? "embed" : "link") as TikTokPlayMode,
    is_featured: Boolean(row.is_featured),
    show_on_home: Boolean(row.show_on_home),
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Video", href: adminPath("/video") },
            { label: initialData.title || "Ubah Video" },
          ]}
        />
        <VideoEditorForm
          initialData={initialData}
          justSaved={sp.saved === "1"}
        />
      </main>
    </div>
  );
}
