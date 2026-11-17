"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Trash2, UploadCloud } from "lucide-react";
import { adminPath } from "@/lib/admin-path";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  DEFAULT_VIDEO_PAGE,
  DEFAULT_VIDEO_SECTION,
} from "@/lib/site-content/video-defaults";

interface EditorProps {
  formVal: Record<string, unknown>;
  updateField: (key: string, value: unknown) => void;
  fieldErrors: Record<string, string>;
}

function getStr(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  return typeof v === "string" ? v : "";
}

function getBool(
  obj: Record<string, unknown>,
  key: string,
  fallback: boolean
): boolean {
  const v = obj[key];
  return typeof v === "boolean" ? v : fallback;
}

function CounterHeader({
  htmlFor,
  label,
  value,
  max,
  required,
  hint,
}: {
  htmlFor: string;
  label: string;
  value: string;
  max: number;
  required?: boolean;
  hint: string;
}) {
  const over = value.length > max;
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-[#143D29]"
        >
          {label} {required && <span className="text-[#B91C1C]">*</span>}
        </label>
        <span
          className={`text-xs font-semibold ${
            over ? "text-[#B91C1C]" : "text-[#43594D]"
          }`}
        >
          {value.length}/{max}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-[#43594D]">{hint}</p>
    </div>
  );
}

function ManageVideosBanner() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#CDE2D4] bg-[#F4FAF6] p-4">
      <div className="flex items-center gap-2.5 text-sm text-[#143D29]">
        <Film className="h-5 w-5 shrink-0 text-[#15803D]" aria-hidden="true" />
        <span className="font-medium">
          Ingin menambah, mengurutkan, atau menghapus video YouTube &amp; TikTok?
        </span>
      </div>
      <Link
        href={adminPath("/video")}
        className="inline-flex min-h-[38px] items-center rounded-xl bg-[#143D29] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
      >
        Kelola Daftar Video →
      </Link>
    </div>
  );
}

export function VideoSectionEditor({
  formVal,
  updateField,
  fieldErrors,
}: EditorProps) {
  const enabled = getBool(formVal, "enabled", DEFAULT_VIDEO_SECTION.enabled);
  const showSamples = getBool(
    formVal,
    "showSamples",
    DEFAULT_VIDEO_SECTION.showSamples
  );
  const eyebrow = getStr(formVal, "eyebrow");
  const heading = getStr(formVal, "heading");
  const headingAccent = getStr(formVal, "headingAccent");
  const description = getStr(formVal, "description");
  const ctaLabel = getStr(formVal, "ctaLabel");
  const homeCount =
    typeof formVal.homeCount === "number"
      ? formVal.homeCount
      : DEFAULT_VIDEO_SECTION.homeCount;

  return (
    <div className="space-y-6">
      <ManageVideosBanner />

      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => updateField("enabled", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">Tampilkan bagian ini</span>
              <span className="block text-xs text-[#43594D]">
                Tampil di: Beranda, bagian Video, visibilitas bagian
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={showSamples}
              onChange={(e) => updateField("showSamples", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">
                Tampilkan kartu contoh saat video kosong
              </span>
              <span className="block text-xs text-[#43594D]">
                Tampil di: Beranda, bagian Video (otomatis hilang jika sudah ada
                video terbit)
              </span>
            </span>
          </label>
        </div>

        <div>
          <CounterHeader
            htmlFor="vs-eyebrow"
            label="Label Kecil (Eyebrow)"
            value={eyebrow}
            max={60}
            required
            hint="Tampil di: Beranda, bagian Video, pill di atas judul."
          />
          <input
            id="vs-eyebrow"
            type="text"
            value={eyebrow}
            onChange={(e) => updateField("eyebrow", e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.eyebrow && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.eyebrow}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <CounterHeader
              htmlFor="vs-heading"
              label="Judul Utama"
              value={heading}
              max={80}
              required
              hint="Tampil di: Beranda, bagian Video, baris pertama judul."
            />
            <input
              id="vs-heading"
              type="text"
              value={heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.heading && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.heading}
              </p>
            )}
          </div>

          <div>
            <CounterHeader
              htmlFor="vs-accent"
              label="Aksen Judul (Hijau)"
              value={headingAccent}
              max={80}
              hint="Tampil di: Beranda, bagian Video, baris kedua judul."
            />
            <input
              id="vs-accent"
              type="text"
              value={headingAccent}
              onChange={(e) => updateField("headingAccent", e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.headingAccent && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.headingAccent}
              </p>
            )}
          </div>
        </div>

        <div>
          <CounterHeader
            htmlFor="vs-desc"
            label="Deskripsi Bagian"
            value={description}
            max={280}
            hint="Tampil di: Beranda, bagian Video, paragraf di bawah judul."
          />
          <textarea
            id="vs-desc"
            rows={2}
            value={description}
            onChange={(e) => updateField("description", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.description && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="vs-count"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Jumlah Video di Beranda (3–12)
            </label>
            <p className="mt-0.5 text-xs text-[#43594D]">
              Tampil di: Beranda, bagian Video (jumlah total video yang dimuat;
              1 sorotan + hingga 4 kartu daftar tampil sekaligus).
            </p>
            <input
              id="vs-count"
              type="number"
              min={3}
              max={12}
              value={homeCount}
              onChange={(e) =>
                updateField("homeCount", Number(e.target.value) || 5)
              }
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.homeCount && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.homeCount}
              </p>
            )}
          </div>

          <div>
            <CounterHeader
              htmlFor="vs-cta"
              label="Label Tombol Lihat Semua"
              value={ctaLabel}
              max={60}
              required
              hint="Tampil di: Beranda, bagian Video, tombol menuju /video."
            />
            <input
              id="vs-cta"
              type="text"
              value={ctaLabel}
              onChange={(e) => updateField("ctaLabel", e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.ctaLabel && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.ctaLabel}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoPageEditor({
  formVal,
  updateField,
  fieldErrors,
}: EditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const eyebrow = getStr(formVal, "eyebrow");
  const heading = getStr(formVal, "heading");
  const headingAccent = getStr(formVal, "headingAccent");
  const description = getStr(formVal, "description");
  const searchPlaceholder = getStr(formVal, "searchPlaceholder");
  const allLabel = getStr(formVal, "allLabel");
  const emptyTitle = getStr(formVal, "emptyTitle");
  const emptyText = getStr(formVal, "emptyText");
  const loadMoreLabel = getStr(formVal, "loadMoreLabel");
  const seoTitle = getStr(formVal, "seoTitle");
  const metaDescription = getStr(formVal, "metaDescription");
  const ogImageSrc = getStr(formVal, "ogImageSrc");
  const ogImageAlt = getStr(formVal, "ogImageAlt");

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    const res = await uploadArticleImage(file);
    setIsUploading(false);

    if (!res.ok) {
      setUploadError(res.error);
      return;
    }
    updateField("ogImageSrc", res.publicUrl);
    if (!ogImageAlt.trim()) {
      updateField("ogImageAlt", seoTitle || DEFAULT_VIDEO_PAGE.seoTitle);
    }
  };

  return (
    <div className="space-y-6">
      <ManageVideosBanner />

      {/* Tajuk Halaman */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <h2 className="font-display text-base font-bold text-[#0F1F17]">
          Tajuk Halaman Galeri Video (/video)
        </h2>

        <div>
          <CounterHeader
            htmlFor="vp-eyebrow"
            label="Label Kecil (Eyebrow)"
            value={eyebrow}
            max={60}
            required
            hint="Tampil di: Halaman /video, pill di atas judul."
          />
          <input
            id="vp-eyebrow"
            type="text"
            value={eyebrow}
            onChange={(e) => updateField("eyebrow", e.target.value)}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.eyebrow && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.eyebrow}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <CounterHeader
              htmlFor="vp-heading"
              label="Judul Utama"
              value={heading}
              max={80}
              required
              hint="Tampil di: Halaman /video, baris pertama H1."
            />
            <input
              id="vp-heading"
              type="text"
              value={heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.heading && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.heading}
              </p>
            )}
          </div>

          <div>
            <CounterHeader
              htmlFor="vp-accent"
              label="Aksen Judul (Hijau)"
              value={headingAccent}
              max={80}
              hint="Tampil di: Halaman /video, baris kedua H1."
            />
            <input
              id="vp-accent"
              type="text"
              value={headingAccent}
              onChange={(e) => updateField("headingAccent", e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.headingAccent && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.headingAccent}
              </p>
            )}
          </div>
        </div>

        <div>
          <CounterHeader
            htmlFor="vp-desc"
            label="Deskripsi Halaman"
            value={description}
            max={280}
            hint="Tampil di: Halaman /video, paragraf di bawah judul."
          />
          <textarea
            id="vp-desc"
            rows={2}
            value={description}
            onChange={(e) => updateField("description", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.description && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.description}
            </p>
          )}
        </div>
      </div>

      {/* Filter, Pencarian & Keadaan Kosong */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <h2 className="font-display text-base font-bold text-[#0F1F17]">
          Label Filter, Pencarian &amp; Keadaan Kosong
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <CounterHeader
              htmlFor="vp-search"
              label="Placeholder Pencarian"
              value={searchPlaceholder}
              max={80}
              required
              hint="Tampil di: Halaman /video, kotak cari judul."
            />
            <input
              id="vp-search"
              type="text"
              value={searchPlaceholder}
              onChange={(e) => updateField("searchPlaceholder", e.target.value)}
              className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
            />
            {fieldErrors.searchPlaceholder && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.searchPlaceholder}
              </p>
            )}
          </div>

          <div>
            <CounterHeader
              htmlFor="vp-all"
              label="Label Filter Semua"
              value={allLabel}
              max={30}
              required
              hint="Tampil di: Halaman /video, chip filter pertama."
            />
            <input
              id="vp-all"
              type="text"
              value={allLabel}
              onChange={(e) => updateField("allLabel", e.target.value)}
              className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
            />
            {fieldErrors.allLabel && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.allLabel}
              </p>
            )}
          </div>

          <div>
            <CounterHeader
              htmlFor="vp-more"
              label="Label Muat Lebih Banyak"
              value={loadMoreLabel}
              max={50}
              required
              hint="Tampil di: Halaman /video, label navigasi daftar."
            />
            <input
              id="vp-more"
              type="text"
              value={loadMoreLabel}
              onChange={(e) => updateField("loadMoreLabel", e.target.value)}
              className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
            />
            {fieldErrors.loadMoreLabel && (
              <p
                role="alert"
                className="mt-1 text-xs font-medium text-[#B91C1C]"
              >
                {fieldErrors.loadMoreLabel}
              </p>
            )}
          </div>
        </div>

        <div>
          <CounterHeader
            htmlFor="vp-empty-title"
            label="Judul Keadaan Kosong"
            value={emptyTitle}
            max={100}
            required
            hint="Tampil di: Halaman /video, saat belum ada video terbit."
          />
          <input
            id="vp-empty-title"
            type="text"
            value={emptyTitle}
            onChange={(e) => updateField("emptyTitle", e.target.value)}
            className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
          />
          {fieldErrors.emptyTitle && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.emptyTitle}
            </p>
          )}
        </div>

        <div>
          <CounterHeader
            htmlFor="vp-empty-text"
            label="Teks Keadaan Kosong"
            value={emptyText}
            max={260}
            required
            hint="Tampil di: Halaman /video, penjelasan di bawah judul kosong."
          />
          <textarea
            id="vp-empty-text"
            rows={2}
            value={emptyText}
            onChange={(e) => updateField("emptyText", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.emptyText && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.emptyText}
            </p>
          )}
        </div>
      </div>

      {/* SEO & Social Image */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <h2 className="font-display text-base font-bold text-[#0F1F17]">
          Metadata SEO &amp; Gambar Berbagi Sosial
        </h2>

        <div>
          <CounterHeader
            htmlFor="vp-seo-title"
            label="Judul SEO (maks. 60)"
            value={seoTitle}
            max={60}
            required
            hint="Tampil di: Tab browser & hasil pencarian untuk /video."
          />
          <input
            id="vp-seo-title"
            type="text"
            value={seoTitle}
            onChange={(e) => updateField("seoTitle", e.target.value)}
            className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
          />
          {fieldErrors.seoTitle && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.seoTitle}
            </p>
          )}
        </div>

        <div>
          <CounterHeader
            htmlFor="vp-seo-desc"
            label="Deskripsi Meta SEO (maks. 155)"
            value={metaDescription}
            max={155}
            required
            hint="Tampil di: Tag meta description & Open Graph /video."
          />
          <textarea
            id="vp-seo-desc"
            rows={2}
            value={metaDescription}
            onChange={(e) => updateField("metaDescription", e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.metaDescription && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.metaDescription}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4">
          <p className="text-sm font-semibold text-[#143D29]">
            Gambar Open Graph (Opsional)
          </p>
          <p className="text-xs text-[#43594D]">
            Tampil di: Pratinjau tautan /video saat dibagikan di media sosial
            (jika kosong, memakai gambar bawaan situs).
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {ogImageSrc ? (
              <div className="flex items-center gap-3">
                <img
                  src={ogImageSrc}
                  alt={ogImageAlt || "Pratinjau OG /video"}
                  className="h-16 w-28 rounded-xl border border-[#CBD8D0] object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    updateField("ogImageSrc", "");
                    updateField("ogImageAlt", "");
                  }}
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-3 py-1.5 text-xs font-semibold text-[#7F1D1D] hover:bg-[#FCE8E8]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hapus gambar</span>
                </button>
              </div>
            ) : null}

            <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#9DB5A7] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:border-[#143D29]">
              <UploadCloud className="h-4 w-4 text-[#15803D]" />
              <span>
                {isUploading
                  ? "Mengunggah..."
                  : ogImageSrc
                    ? "Ganti Gambar OG"
                    : "Unggah Gambar OG"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
                onChange={handleOgUpload}
                className="sr-only"
              />
            </label>
          </div>

          {uploadError && (
            <p role="alert" className="text-xs font-medium text-[#B91C1C]">
              {uploadError}
            </p>
          )}
          {fieldErrors.ogImageSrc && (
            <p role="alert" className="text-xs font-medium text-[#B91C1C]">
              {fieldErrors.ogImageSrc}
            </p>
          )}

          {ogImageSrc ? (
            <div>
              <CounterHeader
                htmlFor="vp-og-alt"
                label="Teks Alternatif Gambar OG"
                value={ogImageAlt}
                max={200}
                required
                hint="Tampil di: Atribut alt tag Open Graph /video."
              />
              <input
                id="vp-og-alt"
                type="text"
                value={ogImageAlt}
                onChange={(e) => updateField("ogImageAlt", e.target.value)}
                className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
              />
              {fieldErrors.ogImageAlt && (
                <p
                  role="alert"
                  className="mt-1 text-xs font-medium text-[#B91C1C]"
                >
                  {fieldErrors.ogImageAlt}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
