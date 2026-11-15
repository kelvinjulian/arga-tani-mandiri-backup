"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { isShopeeHost } from "@/lib/site-content/validation";
import { slugifyText } from "@/lib/articles/admin-validation";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  deleteCategoryAction,
  reorderCategoriesAction,
  resetCategoriesAction,
  saveCategoryAction,
  type AdminCategoryRow,
} from "@/app/(admin)/admin/kategori/actions";

interface CategoriesManagerClientProps {
  initialCategories: AdminCategoryRow[];
}

interface EditorDraft {
  id?: string;
  originalUpdatedAt?: string;
  name: string;
  slug: string;
  slugTouched: boolean;
  description: string;
  image_src: string;
  image_alt: string;
  external_url: string;
}

export function CategoriesManagerClient({
  initialCategories,
}: CategoriesManagerClientProps) {
  const router = useRouter();
  const [categories, setCategories] =
    useState<AdminCategoryRow[]>(initialCategories);
  const [editor, setEditor] = useState<EditorDraft | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminCategoryRow | null>(
    null
  );
  const [showResetModal, setShowResetModal] = useState(false);

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

  const openNew = () => {
    setFieldErrors({});
    setFormError(null);
    setUploadError(null);
    setEditor({
      name: "",
      slug: "",
      slugTouched: false,
      description: "",
      image_src: "",
      image_alt: "",
      external_url: "https://id.shp.ee/fCveyX1e",
    });
    setIsDirty(false);
  };

  const openEdit = (row: AdminCategoryRow) => {
    setFieldErrors({});
    setFormError(null);
    setUploadError(null);
    setEditor({
      id: row.id,
      originalUpdatedAt: row.updated_at,
      name: row.name,
      slug: row.slug,
      slugTouched: true,
      description: row.description,
      image_src: row.image_src,
      image_alt: row.image_alt,
      external_url: row.external_url,
    });
    setIsDirty(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setUploadError(null);
    setIsUploading(true);
    const res = await uploadArticleImage(file);
    setIsUploading(false);
    if (!res.ok) {
      setUploadError(res.error);
      return;
    }
    setEditor((prev) => (prev ? { ...prev, image_src: res.publicUrl } : null));
    setIsDirty(true);
  };

  const handleSaveEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || isBusy || isUploading) return;
    setIsBusy(true);
    setFieldErrors({});
    setFormError(null);
    setConcurrencyError(null);
    setSuccessMessage(null);

    const res = await saveCategoryAction({
      ...(editor.id ? { id: editor.id } : {}),
      ...(editor.originalUpdatedAt
        ? { originalUpdatedAt: editor.originalUpdatedAt }
        : {}),
      name: editor.name,
      slug: editor.slug,
      description: editor.description,
      image_src: editor.image_src,
      image_alt: editor.image_alt,
      external_url: editor.external_url,
    });

    setIsBusy(false);

    if (!res.ok) {
      if (res.concurrencyError) {
        setConcurrencyError(res.concurrencyError);
      } else {
        setFieldErrors(res.fieldErrors ?? {});
        setFormError(res.formError ?? "Gagal menyimpan kategori.");
      }
      return;
    }

    if (res.categories) setCategories(res.categories);
    setEditor(null);
    setIsDirty(false);
    setSuccessMessage("Kategori produk berhasil disimpan.");
    router.refresh();
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    if (isBusy) return;
    const target = idx + dir;
    if (target < 0 || target >= categories.length) return;
    const next = [...categories];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);

    setIsBusy(true);
    setConcurrencyError(null);
    setFormError(null);
    setSuccessMessage(null);

    const res = await reorderCategoriesAction(
      next.map((c) => ({ id: c.id, updatedAt: c.updated_at }))
    );
    setIsBusy(false);

    if (!res.ok) {
      if (res.concurrencyError) setConcurrencyError(res.concurrencyError);
      else setFormError(res.formError ?? "Gagal mengubah urutan.");
      return;
    }

    if (res.categories) setCategories(res.categories);
    setSuccessMessage("Urutan kategori berhasil diperbarui.");
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || isBusy) return;
    setIsBusy(true);
    setConcurrencyError(null);
    setFormError(null);
    setSuccessMessage(null);

    const res = await deleteCategoryAction(
      deleteTarget.id,
      deleteTarget.updated_at
    );
    setIsBusy(false);
    setDeleteTarget(null);

    if (!res.ok) {
      if (res.concurrencyError) setConcurrencyError(res.concurrencyError);
      else setFormError(res.formError ?? "Gagal menghapus kategori.");
      return;
    }

    if (res.categories) setCategories(res.categories);
    setSuccessMessage("Kategori berhasil dihapus.");
    router.refresh();
  };

  const handleResetAll = async () => {
    if (isBusy) return;
    setIsBusy(true);
    setConcurrencyError(null);
    setFormError(null);
    setSuccessMessage(null);

    const res = await resetCategoriesAction();
    setIsBusy(false);
    setShowResetModal(false);

    if (!res.ok) {
      setFormError(res.formError ?? "Gagal mengembalikan kategori awal.");
      return;
    }

    if (res.categories) setCategories(res.categories);
    setEditor(null);
    setIsDirty(false);
    setSuccessMessage("Kategori dikembalikan ke 4 kategori awal bawaan.");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0F1F17]">
            Kategori Produk
          </h1>
          <p className="mt-1 text-xs text-[#43594D]">
            Kelola 1–8 kategori produk yang tampil di beranda, navigasi, dan
            footer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setShowResetModal(true)}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kembalikan ke teks awal</span>
          </button>
          <button
            type="button"
            disabled={isBusy || categories.length >= 8}
            onClick={openNew}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D] disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-xl border border-[#9FD6B4] bg-[#DCF3E5] px-4 py-3 text-sm font-medium text-[#0E3A22]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {concurrencyError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm text-[#7F1D1D] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-medium">{concurrencyError}</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-[#7F1D1D]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#7F1D1D]"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Muat Ulang</span>
          </button>
        </div>
      )}

      {formError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      {/* Editor Panel */}
      {editor && (
        <form
          onSubmit={handleSaveEditor}
          noValidate
          className="rounded-2xl border-2 border-[#143D29] bg-white p-5 shadow-md sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-2 border-b border-[#E3ECE6] pb-3">
            <h2 className="font-display text-lg font-bold text-[#0F1F17]">
              {editor.id ? "Ubah Kategori" : "Tambah Kategori Baru"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditor(null);
                setIsDirty(false);
              }}
              className="cursor-pointer text-xs font-semibold text-[#43594D] hover:text-[#0F1F17]"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cat-name" className="block text-sm font-semibold text-[#143D29]">
                Nama Kategori <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                value={editor.name}
                onChange={(e) => {
                  const nextName = e.target.value;
                  setEditor((prev) =>
                    prev
                      ? {
                          ...prev,
                          name: nextName,
                          slug: prev.slugTouched
                            ? prev.slug
                            : slugifyText(nextName),
                        }
                      : null
                  );
                  setIsDirty(true);
                }}
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
              />
              {fieldErrors.name && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cat-slug" className="block text-sm font-semibold text-[#143D29]">
                Slug (unik) <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="cat-slug"
                type="text"
                value={editor.slug}
                onChange={(e) => {
                  setEditor((prev) =>
                    prev
                      ? {
                          ...prev,
                          slug: e.target.value.toLowerCase(),
                          slugTouched: true,
                        }
                      : null
                  );
                  setIsDirty(true);
                }}
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 font-mono text-sm"
              />
              {fieldErrors.slug && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.slug}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cat-desc" className="block text-sm font-semibold text-[#143D29]">
                Deskripsi Singkat <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                id="cat-desc"
                rows={2}
                value={editor.description}
                onChange={(e) => {
                  setEditor((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  );
                  setIsDirty(true);
                }}
                className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
              />
              {fieldErrors.description && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cat-url" className="block text-sm font-semibold text-[#143D29]">
                URL Tujuan (https://) <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="cat-url"
                type="url"
                value={editor.external_url}
                onChange={(e) => {
                  setEditor((prev) =>
                    prev ? { ...prev, external_url: e.target.value } : null
                  );
                  setIsDirty(true);
                }}
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
              />
              {fieldErrors.external_url && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.external_url}
                </p>
              )}
              {editor.external_url && !isShopeeHost(editor.external_url) && (
                <p className="mt-1 text-xs font-medium text-[#8A5A00]">
                  Catatan: Host URL ini bukan domain Shopee standar (shopee.co.id
                  / shp.ee / id.shp.ee).
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#9DB5A7] bg-[#F8FBF9] p-3 text-center hover:border-[#143D29]">
                <UploadCloud className="h-5 w-5 text-[#15803D]" aria-hidden="true" />
                <span className="text-xs font-semibold text-[#143D29]">
                  {isUploading
                    ? "Mengunggah..."
                    : "Unggah Gambar Kategori (JPG/PNG/WebP, maks 2 MB)"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
              {uploadError && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {uploadError}
                </p>
              )}
              <div>
                <label htmlFor="cat-img" className="block text-xs font-semibold text-[#143D29]">
                  URL / Path Gambar <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="cat-img"
                  type="text"
                  value={editor.image_src}
                  onChange={(e) => {
                    setEditor((prev) =>
                      prev ? { ...prev, image_src: e.target.value } : null
                    );
                    setIsDirty(true);
                  }}
                  className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-xs"
                />
                {fieldErrors.image_src && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {fieldErrors.image_src}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cat-alt" className="block text-xs font-semibold text-[#143D29]">
                  Teks Alternatif (Alt) Gambar{" "}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="cat-alt"
                  type="text"
                  value={editor.image_alt}
                  onChange={(e) => {
                    setEditor((prev) =>
                      prev ? { ...prev, image_alt: e.target.value } : null
                    );
                    setIsDirty(true);
                  }}
                  className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
                />
                {fieldErrors.image_alt && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {fieldErrors.image_alt}
                  </p>
                )}
              </div>
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl border border-[#CBD8D0] bg-[#EEF3EF]">
              {editor.image_src && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={editor.image_src}
                  alt={editor.image_alt || "Pratinjau kategori"}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditor(null);
                setIsDirty(false);
              }}
              className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isBusy || isUploading}
              className="inline-flex min-h-[42px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D] disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>{isBusy ? "Menyimpan..." : "Simpan Kategori"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Category List */}
      <ul className="space-y-3">
        {categories.map((row, idx) => (
          <li
            key={row.id}
            className="flex flex-col gap-4 rounded-2xl border border-[#CBD8D0] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-[#DCE8DF] bg-[#EEF3EF]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={row.image_src}
                  alt={row.image_alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#EAF3EE] px-2 py-0.5 text-[11px] font-bold text-[#15803D]">
                    #{idx + 1}
                  </span>
                  <h2 className="font-display text-base font-bold text-[#0F1F17]">
                    {row.name}
                  </h2>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-[#33473D]">
                  {row.description}
                </p>
                <p className="mt-1 truncate font-mono text-[11px] text-[#43594D]">
                  {row.external_url}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={isBusy || idx === 0}
                onClick={() => handleMove(idx, -1)}
                aria-label={`Naikkan urutan ${row.name}`}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={isBusy || idx === categories.length - 1}
                onClick={() => handleMove(idx, 1)}
                aria-label={`Turunkan urutan ${row.name}`}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:opacity-40"
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => openEdit(row)}
                className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Ubah</span>
              </button>
              <button
                type="button"
                disabled={isBusy || categories.length <= 1}
                onClick={() => setDeleteTarget(row)}
                aria-label={`Hapus ${row.name}`}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2] disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-cat-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E5B8B8] bg-white p-6 shadow-xl">
            <h3 id="del-cat-title" className="font-display text-lg font-bold text-[#7F1D1D]">
              Hapus Kategori?
            </h3>
            <p className="mt-2 text-sm text-[#33473D]">
              Kategori <strong>{deleteTarget.name}</strong> akan dihapus dari
              daftar produk. Tindakan ini tidak menghapus gambar di Storage.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D]"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-cat-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl">
            <h3 id="reset-cat-title" className="font-display text-lg font-bold text-[#0F1F17]">
              Kembalikan Kategori ke Awal?
            </h3>
            <p className="mt-2 text-sm text-[#33473D]">
              Daftar kategori akan dikembalikan ke 4 kategori bawaan awal situs.
              Kategori tambahan yang Anda buat akan dihapus.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex min-h-[40px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D]"
              >
                Ya, Kembalikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
