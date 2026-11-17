import type { Metadata } from "next";
import { requireAdminPage } from "@/lib/supabase/admin";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CategoriesManagerClient } from "@/components/admin/CategoriesManagerClient";
import type { AdminCategoryRow } from "@/app/(admin)/admin/kategori/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategori Produk",
};

export default async function AdminKategoriPage() {
  const { supabase, user } = await requireAdminPage();

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, slug, name, description, image_src, image_alt, external_url, sort_order, updated_at"
    )
    .order("sort_order", { ascending: true });

  const categories = (data ?? []) as AdminCategoryRow[];

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Konten Situs", href: adminPath("/konten") },
            { label: "Beranda" },
            { label: "Kategori Produk" },
          ]}
          backHref={adminPath("/konten")}
          backLabel="Konten Situs"
        />
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
          >
            Gagal memuat daftar kategori dari Supabase.
          </div>
        ) : (
          <CategoriesManagerClient initialCategories={categories} />
        )}
      </main>
    </div>
  );
}
