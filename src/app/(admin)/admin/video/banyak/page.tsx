import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VideoBulkForm } from "@/components/admin/VideoBulkForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tempel Banyak URL Video",
};

export default async function AdminVideoBulkPage() {
  const { supabase, user } = await requireAdminPage();

  const { data } = await supabase
    .from("videos")
    .select("platform, video_id")
    .not("video_id", "is", null);

  const existingKeys = (data ?? []).map(
    (r) => `${r.platform as string}:${r.video_id as string}`
  );

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Video", href: adminPath("/video") },
            { label: "Tempel Banyak URL" },
          ]}
        />
        <VideoBulkForm existingKeys={existingKeys} />
      </main>
    </div>
  );
}
