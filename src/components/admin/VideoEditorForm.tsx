"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Film,
  RefreshCw,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  getEffectiveVideoThumbnail,
  parseVideoUrl,
  type VideoStatus,
} from "@/lib/videos/url-parser";
import {
  deleteVideoAction,
  saveVideoAction,
} from "@/app/(admin)/admin/video/actions";
import type { VideoFieldErrors } from "@/lib/videos/validation";

export interface VideoEditorInitialData {
  id?: string;
  updatedAt?: string;
  url: string;
  title: string;
  description: string;
  duration: string;
  thumbnail_src: string;
  status: VideoStatus;
  is_featured: boolean;
  show_on_home: boolean;
}

interface VideoEditorFormProps {
  initialData: VideoEditorInitialData;
  justSaved?: boolean;
}

export function VideoEditorForm({
  initialData,
  justSaved = false,
}: VideoEditorFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData.id);

  const [url, setUrl] = useState(initialData.url);
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [duration, setDuration] = useState(initialData.duration);
  const [thumbnailSrc, setThumbnailSrc] = useState(initialData.thumbnail_src);
  const [status, setStatus] = useState<VideoStatus>(initialData.status);
  const [isFeatured, setIsFeatured] = useState(initialData.is_featured);
  const [showOnHome, setShowOnHome] = useState(initialData.show_on_home);
  const [updatedAt, setUpdatedAt] = useState<string | null>(
    initialData.updatedAt ?? null
  );

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<VideoFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicateVideoId, setDuplicateVideoId] = useState<string | null>(null);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    justSaved ? "Video baru berhasil disimpan." : null
  );

  useEffect(() => {
    if (!isDirty) {
      window.__adminIsDirty = false;
      return;
    }
    window.__adminIsDirty = true;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.__adminIsDirty = false;
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isDirty]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    setSuccessMessage(null);
  };

  const liveParsed = useMemo(() => {
    if (!url.trim()) return null;
    return parseVideoUrl(url);
  }, [url]);

  const effectiveThumb = useMemo(() => {
    if (thumbnailSrc.trim()) return thumbnailSrc.trim();
    if (liveParsed?.ok) {
      return getEffectiveVideoThumbnail(
        liveParsed.platform,
        liveParsed.videoId,
        null
      );
    }
    return null;
  }, [thumbnailSrc, liveParsed]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setFormError(null);
    const res = await uploadArticleImage(file);
    setIsUploading(false);

    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    setThumbnailSrc(res.publicUrl);
    markDirty();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFieldErrors({});
    setFormError(null);
    setDuplicateVideoId(null);
    setConcurrencyError(null);
    setSuccessMessage(null);

    const res = await saveVideoAction({
      id: initialData.id,
      originalUpdatedAt: updatedAt,
      url,
      title,
      description,
      duration,
      thumbnail_src: thumbnailSrc,
      status,
      is_featured: isFeatured,
      show_on_home: showOnHome,
    });

    setIsSaving(false);

    if (!res.ok) {
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
      if (res.concurrencyError) setConcurrencyError(res.concurrencyError);
      if (res.duplicateVideoId) setDuplicateVideoId(res.duplicateVideoId);
      setFormError(res.formError ?? null);
      return;
    }

    setIsDirty(false);
    window.__adminIsDirty = false;

    if (!isEdit && res.id) {
      router.push(`/admin/video/${res.id}?saved=1`);
      return;
    }

    if (res.updatedAt) setUpdatedAt(res.updatedAt);
    setSuccessMessage("Perubahan video berhasil disimpan.");
    router.refresh();
  };

  const handleDelete = async () => {
    if (!initialData.id) return;
    const confirmed = window.confirm(
      `Hapus video "${title || "ini"}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const res = await deleteVideoAction(initialData.id);
    setIsDeleting(false);

    if (!res.ok) {
      setFormError(res.error ?? "Gagal menghapus video.");
      return;
    }

    setIsDirty(false);
    window.__adminIsDirty = false;
    router.push("/admin/video");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
            {isEdit ? "Ubah Video" : "Tambah Video"}
          </h1>
          <p className="mt-1 text-sm text-[#33473D]">
            Tempel tautan YouTube atau TikTok, lengkapi judul, dan atur status
            tampilannya.
          </p>
        </div>

        {isEdit && (
          <button
            type="button"
            disabled={isDeleting || isSaving}
            onClick={handleDelete}
            className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5B8B8] bg-white px-4 py-2 text-xs font-semibold text-[#991B1B] hover:bg-[#FDF2F2] disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>{isDeleting ? "Menghapus..." : "Hapus Video"}</span>
          </button>
        )}
      </div>

      {concurrencyError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F59E0B] bg-[#FFFBEB] p-4 text-sm text-[#78350F]"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
            <p className="font-medium">{concurrencyError}</p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Muat Ulang</span>
          </button>
        </div>
      )}

      {formError && !concurrencyError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5B8B8] bg-[#FDF2F2] p-4 text-sm font-medium text-[#7F1D1D]"
        >
          <span>{formError}</span>
          {duplicateVideoId && (
            <Link
              href={`/admin/video/${duplicateVideoId}`}
              className="inline-flex min-h-[36px] items-center rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-bold text-[#143D29] hover:bg-[#EAF3EE]"
            >
              Lihat video yang sudah ada →
            </Link>
          )}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-2xl border border-[#B4DEC6] bg-[#EAF3EE] p-4 text-sm font-semibold text-[#143D29]"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#15803D]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* URL & Live Detection */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <div>
          <label
            htmlFor="video-url"
            className="block text-sm font-semibold text-[#143D29]"
          >
            Tautan Video (YouTube / TikTok){" "}
            <span className="text-[#B91C1C]">*</span>
          </label>
          <p className="mt-0.5 text-xs text-[#43594D]">
            Tempel tautan video TikTok, atau kode embed dari TikTok. Tautan
            pendek (vm.tiktok.com) hanya bisa dibuka di TikTok, tidak diputar di
            situs. Untuk YouTube, mendukung watch, shorts, embed, dan youtu.be.
          </p>
          <input
            id="video-url"
            type="text"
            value={url}
            placeholder="https://www.youtube.com/watch?v=... atau kode <iframe ...> TikTok"
            onChange={(e) => {
              setUrl(e.target.value);
              markDirty();
            }}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 font-mono text-sm"
          />
          {fieldErrors.url && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.url}
            </p>
          )}
        </div>

        {liveParsed && (
          <div
            className={`rounded-xl border p-3.5 text-xs ${
              liveParsed.ok
                ? "border-[#CDE2D4] bg-[#F4FAF6] text-[#143D29]"
                : "border-[#E5B8B8] bg-[#FDF2F2] text-[#7F1D1D]"
            }`}
          >
            {liveParsed.ok ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#143D29] px-2.5 py-0.5 font-bold uppercase text-white">
                  {liveParsed.platform}
                </span>
                <span>
                  ID Video:{" "}
                  <span className="font-mono font-semibold">
                    {liveParsed.videoId ?? "(tautan pendek / tanpa ID)"}
                  </span>
                </span>
                <span className="text-[#43594D] break-all">
                  • {liveParsed.normalizedUrl}
                </span>
              </div>
            ) : (
              <p className="font-medium">{liveParsed.error}</p>
            )}
          </div>
        )}

        {/* Title */}
        <div>
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="video-title"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Judul Video <span className="text-[#B91C1C]">*</span>
            </label>
            <span
              className={`text-xs font-semibold ${
                title.length > 120 ? "text-[#B91C1C]" : "text-[#43594D]"
              }`}
            >
              {title.length}/120
            </span>
          </div>
          <input
            id="video-title"
            type="text"
            value={title}
            placeholder="mis. Cara Aplikasi Pupuk Dasar pada Lahan Cabai"
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
          />
          {fieldErrors.title && (
            <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.title}
            </p>
          )}
        </div>

        {/* Description & Duration */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="video-desc"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Deskripsi Singkat (Opsional)
              </label>
              <span
                className={`text-xs font-semibold ${
                  description.length > 300 ? "text-[#B91C1C]" : "text-[#43594D]"
                }`}
              >
                {description.length}/300
              </span>
            </div>
            <textarea
              id="video-desc"
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                markDirty();
              }}
              className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
            {fieldErrors.description && (
              <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="video-duration"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Durasi (Opsional)
              </label>
              <span
                className={`text-xs font-semibold ${
                  duration.length > 10 ? "text-[#B91C1C]" : "text-[#43594D]"
                }`}
              >
                {duration.length}/10
              </span>
            </div>
            <input
              id="video-duration"
              type="text"
              placeholder="mis. 03:45"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                markDirty();
              }}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 font-mono text-sm"
            />
            {fieldErrors.duration && (
              <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                {fieldErrors.duration}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail & Display Settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-base font-bold text-[#0F1F17]">
            Thumbnail Video (Opsional)
          </h2>
          <p className="text-xs text-[#43594D]">
            Untuk YouTube, thumbnail otomatis digunakan jika tidak mengunggah
            gambar khusus. TikTok memakai gambar khusus atau tampilan bawaan.
          </p>
          {liveParsed?.ok && liveParsed.platform === "tiktok" && (
            <p className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] px-3 py-2 text-xs font-medium text-[#143D29]">
              TikTok tidak menyediakan thumbnail otomatis. Unggah gambar sampul
              agar kartu lebih menarik.
            </p>
          )}

          <div className="flex items-center gap-4">
            {effectiveThumb ? (
              <img
                src={effectiveThumb}
                alt={title || "Pratinjau thumbnail video"}
                className="h-24 w-40 rounded-xl border border-[#CBD8D0] object-cover"
              />
            ) : (
              <div className="flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] text-[#143D29]">
                <Film className="h-6 w-6" aria-hidden="true" />
                <span className="text-[11px] font-semibold">
                  Thumbnail Bawaan
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#9DB5A7] bg-[#F8FBF9] px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:border-[#143D29]">
                <UploadCloud className="h-4 w-4 text-[#15803D]" />
                <span>
                  {isUploading
                    ? "Mengunggah..."
                    : thumbnailSrc
                      ? "Ganti Thumbnail"
                      : "Unggah Thumbnail (maks 2 MB)"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handleUpload}
                  className="sr-only"
                />
              </label>

              {thumbnailSrc && (
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailSrc("");
                    markDirty();
                  }}
                  className="inline-flex min-h-[36px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-3 py-1.5 text-xs font-semibold text-[#7F1D1D] hover:bg-[#FCE8E8]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Hapus gambar</span>
                </button>
              )}
            </div>
          </div>
          {fieldErrors.thumbnail_src && (
            <p role="alert" className="text-xs font-medium text-[#B91C1C]">
              {fieldErrors.thumbnail_src}
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-base font-bold text-[#0F1F17]">
            Status &amp; Penempatan
          </h2>

          <div>
            <label
              htmlFor="video-status"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Status Publikasi
            </label>
            <select
              id="video-status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as VideoStatus);
                markDirty();
              }}
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
            >
              <option value="published">Terbit (Tampil di publik)</option>
              <option value="draft">Draft (Hanya admin)</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#0F1F17]">
            <input
              type="checkbox"
              checked={showOnHome}
              onChange={(e) => {
                setShowOnHome(e.target.checked);
                markDirty();
              }}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">Tampilkan di beranda</span>
              <span className="block text-xs text-[#43594D]">
                Video ini dapat muncul di bagian video halaman beranda.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#0F1F17]">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => {
                setIsFeatured(e.target.checked);
                markDirty();
              }}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <Star className="h-3.5 w-3.5 text-[#15803D]" />
                <span>Jadikan unggulan</span>
              </span>
              <span className="block text-xs text-[#43594D]">
                Hanya satu video unggulan aktif pada satu waktu; mengaktifkan
                ini otomatis menggantikan video unggulan sebelumnya.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#143D29] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#0E2B1D] disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          <span>
            {isSaving
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Simpan Video"}
          </span>
        </button>
      </div>
    </form>
  );
}
