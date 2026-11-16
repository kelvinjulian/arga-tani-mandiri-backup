import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  VideoEditorForm,
  type VideoEditorInitialData,
} from "@/components/admin/VideoEditorForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tambah Video",
};

export default async function AdminVideoNewPage() {
  const { user } = await requireAdminPage();

  const initialData: VideoEditorInitialData = {
    url: "",
    title: "",
    description: "",
    duration: "",
    thumbnail_src: "",
    status: "published",
    is_featured: false,
    show_on_home: true,
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Daftar Video", href: "/admin/video" },
            { label: "Tambah Video" },
          ]}
        />
        <VideoEditorForm initialData={initialData} />
      </main>
    </div>
  );
}
