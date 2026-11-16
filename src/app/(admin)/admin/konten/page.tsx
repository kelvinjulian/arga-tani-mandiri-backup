import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Film,
  FolderKanban,
  LayoutTemplate,
  Tags,
} from "lucide-react";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  SITE_CONTENT_BLOCKS,
  type SiteContentBlockMeta,
  type SiteContentKey,
} from "@/lib/site-content/validation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Konten Situs",
};

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

const HOME_KEYS: ReadonlyArray<SiteContentKey> = [
  "hero",
  "category_showcase",
  "about",
  "testimonials",
  "video_section",
  "article_hub",
  "whatsapp_band",
];

const ARTICLE_KEYS: ReadonlyArray<SiteContentKey> = [
  "article_page",
  "article_detail",
];

const VIDEO_KEYS: ReadonlyArray<SiteContentKey> = ["video_page"];

const SITEWIDE_KEYS: ReadonlyArray<SiteContentKey> = ["company", "footer"];

function pickBlocks(
  keys: ReadonlyArray<SiteContentKey>
): SiteContentBlockMeta[] {
  const byKey = new Map(SITE_CONTENT_BLOCKS.map((b) => [b.key, b]));
  return keys
    .map((k) => byKey.get(k))
    .filter((b): b is SiteContentBlockMeta => Boolean(b));
}

export default async function AdminKontenListPage() {
  const { supabase, user } = await requireAdminPage();

  const { data, error } = await supabase
    .from("site_content")
    .select("key, updated_at");

  const updatedMap = new Map<string, string>();
  if (Array.isArray(data)) {
    for (const row of data) {
      if (typeof row.key === "string" && typeof row.updated_at === "string") {
        updatedMap.set(row.key, row.updated_at);
      }
    }
  }

  const homeBlocks = pickBlocks(HOME_KEYS);
  const articleBlocks = pickBlocks(ARTICLE_KEYS);
  const videoBlocks = pickBlocks(VIDEO_KEYS);
  const sitewideBlocks = pickBlocks(SITEWIDE_KEYS);

  const renderBlockCard = (block: SiteContentBlockMeta) => {
    const updatedAt = updatedMap.get(block.key);
    return (
      <Link
        key={block.key}
        href={`/admin/konten/${block.key}`}
        className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
              <LayoutTemplate className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EE] px-2.5 py-1 text-xs font-bold text-[#143D29]">
              <span>Ubah</span>
              <ArrowRight
                className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
          <h3 className="mt-3.5 font-display text-base font-bold text-[#0F1F17]">
            {block.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[#33473D]">
            {block.description}
          </p>
        </div>

        <p className="mt-4 border-t border-[#E6EEE9] pt-3 text-[11px] font-medium text-[#43594D]">
          {updatedAt
            ? `Diperbarui: ${formatDateId(updatedAt)}`
            : "Belum tersimpan (pakai teks awal)"}
        </p>
      </Link>
    );
  };

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 space-y-10">
        <div>
          <AdminBreadcrumb
            crumbs={[
              { label: "Dashboard", href: "/admin" },
              { label: "Konten Situs" },
            ]}
          />
          <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
            Konten Situs
          </h1>
          <p className="mt-1 text-sm text-[#33473D]">
            Pilih bagian yang ingin diubah, dikelompokkan sesuai halaman tempat
            tampilnya.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
          >
            Gagal memuat daftar bagian konten dari Supabase.
          </div>
        )}

        {/* Section 1: Beranda */}
        <section aria-labelledby="group-beranda-heading">
          <div>
            <h2
              id="group-beranda-heading"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Beranda
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D] sm:text-sm">
              Bagian-bagian yang tampil di halaman utama (/) situs.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeBlocks.map(renderBlockCard)}

            <Link
              href="/admin/kategori"
              className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                    <FolderKanban className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EE] px-2.5 py-1 text-xs font-bold text-[#143D29]">
                    <span>Kelola</span>
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold text-[#0F1F17]">
                  Kategori Produk (etalase)
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#33473D]">
                  Atur urutan, gambar, deskripsi, dan tautan Shopee kartu
                  kategori produk di Beranda.
                </p>
              </div>
              <p className="mt-4 border-t border-[#E6EEE9] pt-3 text-[11px] font-medium text-[#43594D]">
                Pengelolaan etalase produk
              </p>
            </Link>
          </div>
        </section>

        {/* Section 2: Halaman Artikel */}
        <section aria-labelledby="group-artikel-heading">
          <div>
            <h2
              id="group-artikel-heading"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Halaman Artikel
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D] sm:text-sm">
              Mengelola daftar artikel, kategori filter, serta tampilan tetap di
              halaman /artikel dan /artikel/[slug].
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articleBlocks.map(renderBlockCard)}

            <Link
              href="/admin/artikel"
              className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EE] px-2.5 py-1 text-xs font-bold text-[#143D29]">
                    <span>Kelola</span>
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold text-[#0F1F17]">
                  Artikel
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#33473D]">
                  Buat, ubah, pratinjau, terbitkan, atau hapus isi artikel
                  edukasi.
                </p>
              </div>
              <p className="mt-4 border-t border-[#E6EEE9] pt-3 text-[11px] font-medium text-[#43594D]">
                Pengelolaan daftar artikel
              </p>
            </Link>

            <Link
              href="/admin/kategori-artikel"
              className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                    <Tags className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EE] px-2.5 py-1 text-xs font-bold text-[#143D29]">
                    <span>Kelola</span>
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold text-[#0F1F17]">
                  Kategori Artikel
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#33473D]">
                  Tambah, ubah nama, atur urutan, atau hapus kategori filter
                  artikel.
                </p>
              </div>
              <p className="mt-4 border-t border-[#E6EEE9] pt-3 text-[11px] font-medium text-[#43594D]">
                Pengelolaan kategori &amp; filter chip
              </p>
            </Link>
          </div>
        </section>

        {/* Section 3: Halaman Video */}
        <section aria-labelledby="group-video-heading">
          <div>
            <h2
              id="group-video-heading"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Halaman Video
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D] sm:text-sm">
              Mengelola tampilan halaman galeri /video dan daftar video YouTube
              serta TikTok.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videoBlocks.map(renderBlockCard)}

            <Link
              href="/admin/video"
              className="group flex flex-col justify-between rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs transition-all hover:border-[#15803D] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F0E3] text-[#143D29]">
                    <Film className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EE] px-2.5 py-1 text-xs font-bold text-[#143D29]">
                    <span>Kelola</span>
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <h3 className="mt-3.5 font-display text-base font-bold text-[#0F1F17]">
                  Daftar Video
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#33473D]">
                  Tambah, tempel banyak URL, urutkan, atau hapus video YouTube
                  dan TikTok.
                </p>
              </div>
              <p className="mt-4 border-t border-[#E6EEE9] pt-3 text-[11px] font-medium text-[#43594D]">
                Pengelolaan daftar video
              </p>
            </Link>
          </div>
        </section>

        {/* Section 4: Seluruh Situs */}
        <section aria-labelledby="group-seluruh-situs-heading">
          <div>
            <h2
              id="group-seluruh-situs-heading"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Seluruh Situs
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D] sm:text-sm">
              Tampil di semua halaman — identitas perusahaan, kontak resmi, dan
              footer situs.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sitewideBlocks.map(renderBlockCard)}
          </div>
        </section>
      </main>
    </div>
  );
}
