import type { Metadata } from "next";
import Link from "next/link";
import { ADMIN_BASE_PATH, adminPath } from "@/lib/admin-path";
import {
  ChevronLeft,
  ChevronRight,
  Film,
  ListPlus,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VideoListActions } from "@/components/admin/VideoListActions";
import {
  getEffectiveVideoThumbnail,
  type TikTokPlayMode,
  type VideoPlatform,
  type VideoStatus,
} from "@/lib/videos/url-parser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daftar Video",
};

const PAGE_SIZE = 20;

interface AdminVideoRow {
  id: string;
  platform: VideoPlatform;
  url: string;
  video_id: string | null;
  title: string;
  thumbnail_src: string | null;
  status: VideoStatus;
  play_mode?: TikTokPlayMode | null;
  is_featured: boolean;
  show_on_home: boolean;
  sort_order: number;
  updated_at: string;
}

interface AdminVideoListPageProps {
  searchParams: Promise<{
    q?: string;
    platform?: string;
    status?: string;
    page?: string;
  }>;
}

function formatDateId(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminVideoListPage({
  searchParams,
}: AdminVideoListPageProps) {
  const { supabase, user } = await requireAdminPage();
  const sp = await searchParams;

  const searchQuery = (sp.q ?? "").trim();
  const platformFilter =
    sp.platform === "youtube" || sp.platform === "tiktok"
      ? sp.platform
      : "all";
  const statusFilter =
    sp.status === "published" || sp.status === "draft" ? sp.status : "all";
  const currentPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("videos")
    .select("*", { count: "exact" })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (platformFilter !== "all") {
    query = query.eq("platform", platformFilter);
  }
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const [{ data, count, error }, { data: allOrderRows }] = await Promise.all([
    query.range(from, to),
    supabase
      .from("videos")
      .select("id")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const rows = (data ?? []) as AdminVideoRow[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const firstGlobalId = allOrderRows?.[0]?.id as string | undefined;
  const lastGlobalId = allOrderRows?.[allOrderRows.length - 1]?.id as
    | string
    | undefined;

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();
    if (platformFilter !== "all") params.set("platform", platformFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (searchQuery) params.set("q", searchQuery);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? adminPath(`/video?${qs}`) : adminPath("/video");
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: ADMIN_BASE_PATH },
            { label: "Daftar Video" },
          ]}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
              Daftar Video
            </h1>
            <p className="mt-1 text-sm text-[#33473D]">
              Kelola tautan video YouTube dan TikTok, urutan tampil, status,
              serta video unggulan (maks. 300 video).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={adminPath("/video/banyak")}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#CBD8D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#143D29] shadow-xs hover:bg-[#EAF3EE]"
            >
              <ListPlus className="h-4 w-4" aria-hidden="true" />
              <span>Tempel Banyak URL</span>
            </Link>
            <Link
              href={adminPath("/video/baru")}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#143D29] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#0E2B1D]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Video</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter */}
        <form
          method="get"
          action={adminPath("/video")}
          className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#CBD8D0] bg-white p-4 shadow-xs sm:grid-cols-12"
        >
          <div className="relative sm:col-span-5">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#43594D]"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cari judul video..."
              aria-label="Cari judul video"
              className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] pl-9 pr-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              name="platform"
              defaultValue={platformFilter}
              aria-label="Filter platform"
              className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
            >
              <option value="all">Semua Platform</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              name="status"
              defaultValue={statusFilter}
              aria-label="Filter status"
              className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="published">Terbit</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              className="min-h-[42px] flex-1 cursor-pointer rounded-xl bg-[#143D29] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
            >
              Terapkan
            </button>
          </div>
        </form>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-[#E5B8B8] bg-[#FDF2F2] p-4 text-sm font-medium text-[#7F1D1D]"
          >
            Gagal memuat daftar video. Pastikan migrasi{" "}
            <span className="font-mono">0006_videos.sql</span> sudah dijalankan
            di Supabase.
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#CBD8D0] bg-white p-10 text-center shadow-xs">
            <Film
              className="mx-auto h-10 w-10 text-[#6F8476]"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-base font-bold text-[#0F1F17]">
              Belum ada video
            </p>
            <p className="mt-1 text-sm text-[#43594D]">
              Tambahkan video YouTube atau TikTok pertama Anda melalui tombol
              Tambah Video atau Tempel Banyak URL.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#CBD8D0] bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#DCE8DF] bg-[#F8FBF9] text-xs font-semibold text-[#43594D]">
                    <th className="px-4 py-3">Thumbnail</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Beranda</th>
                    <th className="px-4 py-3">Unggulan</th>
                    <th className="px-4 py-3">Diperbarui</th>
                    <th className="px-4 py-3 text-right">Aksi &amp; Urutan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF4F0]">
                  {rows.map((row) => {
                    const thumb = getEffectiveVideoThumbnail(
                      row.platform,
                      row.video_id,
                      row.thumbnail_src
                    );

                    return (
                      <tr key={row.id} className="hover:bg-[#FAFDFB]">
                        <td className="px-4 py-3">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={row.title}
                              className="h-12 w-20 rounded-lg border border-[#CBD8D0] object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-[#CBD8D0] bg-[#EAF3EE] text-[#143D29]">
                              <Film className="h-5 w-5" aria-hidden="true" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 max-w-[260px]">
                          <Link
                            href={adminPath(`/video/${row.id}`)}
                            className="line-clamp-2 font-semibold text-[#0F1F17] hover:text-[#15803D] hover:underline"
                          >
                            {row.title}
                          </Link>
                          {row.platform === "tiktok" && !row.thumbnail_src ? (
                            <span className="mt-1 inline-block rounded-full border border-[#F59E0B]/40 bg-[#FFFBEB] px-2 py-0.5 text-[11px] font-medium text-[#92400E]">
                              Belum ada sampul
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                                row.platform === "youtube"
                                  ? "bg-[#FEE2E2] text-[#991B1B]"
                                  : "bg-[#E0F2FE] text-[#075985]"
                              }`}
                            >
                              {row.platform}
                            </span>
                            {row.platform === "tiktok" && (
                              <span className="inline-block rounded-full border border-[#CBD8D0] bg-[#F4FAF6] px-2 py-0.5 text-[11px] font-medium text-[#143D29]">
                                {row.play_mode === "embed" ? "Embed" : "Tautan"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              row.status === "published"
                                ? "bg-[#D9F0E3] text-[#143D29]"
                                : "bg-[#F3F4F6] text-[#374151]"
                            }`}
                          >
                            {row.status === "published" ? "Terbit" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-[#33473D]">
                          {row.show_on_home ? "Ya" : "Tidak"}
                        </td>
                        <td className="px-4 py-3">
                          {row.is_featured ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-xs font-semibold text-[#92400E]">
                              <Star
                                className="h-3 w-3 fill-[#D97706] text-[#D97706]"
                                aria-hidden="true"
                              />
                              <span>Unggulan</span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#6B7280]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#43594D]">
                          {formatDateId(row.updated_at)}
                        </td>
                        <td className="px-4 py-3">
                          <VideoListActions
                            id={row.id}
                            title={row.title}
                            isFirstGlobal={row.id === firstGlobalId}
                            isLastGlobal={row.id === lastGlobalId}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#DCE8DF] bg-[#F8FBF9] px-4 py-3 text-xs text-[#33473D]">
                <span>
                  Halaman {currentPage} dari {totalPages} ({totalCount} video)
                </span>
                <div className="flex items-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildPageHref(currentPage - 1)}
                      className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-[#CBD8D0] bg-white px-3 py-1 font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Sebelumnya</span>
                    </Link>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={buildPageHref(currentPage + 1)}
                      className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-[#CBD8D0] bg-white px-3 py-1 font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
