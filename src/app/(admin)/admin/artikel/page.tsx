import type { Metadata } from "next";
import Link from "next/link";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import {
  Eye,
  FilePlus2,
  Pencil,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import type { ContentArticleStatus } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kelola Artikel",
};

const PAGE_SIZE = 10;

interface AdminArticleListRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: ContentArticleStatus;
  is_featured: boolean;
  updated_at: string;
}

interface AdminArtikelListPageProps {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
    deleted?: string;
  }>;
}

function getStatusBadge(status: ContentArticleStatus) {
  switch (status) {
    case "published":
      return {
        label: "Terbit",
        className: "border-[#9FD6B4] bg-[#DCF3E5] text-[#0E3A22]",
      };
    case "review":
      return {
        label: "Review",
        className: "border-[#F0D594] bg-[#FEF6DF] text-[#6B4806]",
      };
    default:
      return {
        label: "Draft",
        className: "border-[#CBD8D0] bg-[#EEF3EF] text-[#33473D]",
      };
  }
}

function formatDateId(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminArtikelListPage({
  searchParams,
}: AdminArtikelListPageProps) {
  const { supabase, user } = await requireAdminPage();
  const params = await searchParams;

  const statusFilter =
    params.status === "draft" ||
    params.status === "review" ||
    params.status === "published"
      ? params.status
      : "all";
  const searchQuery = typeof params.q === "string" ? params.q.trim() : "";
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("articles")
    .select("id, slug, title, category, status, is_featured, updated_at", {
      count: "exact",
    })
    .order("updated_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, count, error } = await query.range(from, to);
  const rows = (data ?? []) as AdminArticleListRow[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const buildPageHref = (page: number) => {
    const sp = new URLSearchParams();
    if (statusFilter !== "all") sp.set("status", statusFilter);
    if (searchQuery) sp.set("q", searchQuery);
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return qs ? adminPath(`/artikel?${qs}`) : adminPath("/artikel");
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Artikel" },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
              Daftar Artikel
            </h1>
            <p className="mt-1 text-sm text-[#33473D]">
              Kelola artikel edukasi, status tinjauan, dan publikasi ke situs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={adminPath("/kategori-artikel")}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#CBD8D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#143D29] shadow-xs transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <span>Kelola kategori</span>
            </Link>
            <Link
              href={adminPath("/artikel/baru")}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#143D29] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <FilePlus2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Buat Artikel</span>
            </Link>
          </div>
        </div>

        {params.deleted === "1" && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-[#9FD6B4] bg-[#DCF3E5] px-4 py-3 text-sm font-medium text-[#0E3A22]"
          >
            Artikel berhasil dihapus.
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
          >
            Gagal memuat daftar artikel dari Supabase. Muat ulang halaman untuk
            mencoba lagi.
          </div>
        )}

        {/* Filter & Search Bar */}
        <form
          method="get"
          action={adminPath("/artikel")}
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#CBD8D0] bg-white p-4 shadow-xs sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <label
              htmlFor="admin-article-search"
              className="block text-xs font-semibold text-[#143D29]"
            >
              Cari judul artikel
            </label>
            <div className="relative mt-1.5">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#43594D]"
                aria-hidden="true"
              />
              <input
                id="admin-article-search"
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Ketik kata kunci judul..."
                className="min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white pr-3 pl-9 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-offset-0 focus:outline-[#143D29]"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <label
              htmlFor="admin-article-status"
              className="block text-xs font-semibold text-[#143D29]"
            >
              Filter status
            </label>
            <select
              id="admin-article-status"
              name="status"
              defaultValue={statusFilter}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-offset-0 focus:outline-[#143D29]"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Terbit</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="inline-flex min-h-[44px] flex-1 cursor-pointer items-center justify-center rounded-xl bg-[#143D29] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] sm:flex-none"
            >
              Terapkan
            </button>
            {(statusFilter !== "all" || searchQuery) && (
              <Link
                href={adminPath("/artikel")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm font-semibold text-[#143D29] transition-colors hover:bg-[#EAF3EE]"
              >
                Reset
              </Link>
            )}
          </div>
        </form>

        {/* Article List */}
        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#9DB5A7] bg-white p-8 text-center">
            <p className="font-display text-base font-bold text-[#0F1F17]">
              Belum ada artikel yang sesuai
            </p>
            <p className="mt-1 text-sm text-[#43594D]">
              {searchQuery || statusFilter !== "all"
                ? "Coba ubah kata kunci pencarian atau filter status."
                : "Mulai dengan membuat artikel edukasi pertama."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View (< md) */}
            <ul className="mt-6 space-y-3 md:hidden">
              {rows.map((row) => {
                const badge = getStatusBadge(row.status);
                return (
                  <li
                    key={row.id}
                    className="rounded-2xl border border-[#CBD8D0] bg-white p-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {row.is_featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#F0D594] bg-[#FEF6DF] px-2.5 py-0.5 text-xs font-semibold text-[#6B4806]">
                          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                          <span>Utama</span>
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2.5 font-display text-base font-bold text-[#0F1F17]">
                      {row.title}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#33473D]">
                      {row.category}
                    </p>
                    <p className="mt-1 text-xs text-[#43594D]">
                      Diperbarui: {formatDateId(row.updated_at)}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={adminPath(`/artikel/${row.id}`)}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#143D29] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Ubah</span>
                      </Link>
                      <Link
                        href={adminPath(`/artikel/${row.id}/pratinjau`)}
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Lihat</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop Table View (md+) */}
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#CBD8D0] bg-white shadow-xs md:block">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#CBD8D0] bg-[#F4F7F4] text-xs font-bold uppercase tracking-wider text-[#33473D]">
                    <th scope="col" className="px-5 py-3.5">
                      Judul
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Kategori
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Diperbarui
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECE6]">
                  {rows.map((row) => {
                    const badge = getStatusBadge(row.status);
                    return (
                      <tr key={row.id} className="hover:bg-[#F9FBFA]">
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#0F1F17]">
                              {row.title}
                            </span>
                            {row.is_featured && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#F0D594] bg-[#FEF6DF] px-2 py-0.5 text-[11px] font-semibold text-[#6B4806]">
                                <Star
                                  className="h-3 w-3 fill-current"
                                  aria-hidden="true"
                                />
                                <span>Utama</span>
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#43594D]">
                            /artikel/{row.slug}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium text-[#33473D]">
                          {row.category}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-[#43594D] whitespace-nowrap">
                          {formatDateId(row.updated_at)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Link
                              href={adminPath(`/artikel/${row.id}`)}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#143D29] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Ubah</span>
                            </Link>
                            <Link
                              href={adminPath(`/artikel/${row.id}/pratinjau`)}
                              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29] transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Lihat</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#33473D]">
              <p>
                Menampilkan {from + 1}–{Math.min(from + rows.length, totalCount)}{" "}
                dari {totalCount} artikel
              </p>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Sebelumnya</span>
                  </Link>
                ) : (
                  <span className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E2EAE5] bg-[#F4F7F4] px-3 py-1.5 font-semibold text-[#6F8278]">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Sebelumnya</span>
                  </span>
                )}
                <span className="px-2 font-semibold">
                  Hal. {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E2EAE5] bg-[#F4F7F4] px-3 py-1.5 font-semibold text-[#6F8278]">
                    <span>Berikutnya</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
