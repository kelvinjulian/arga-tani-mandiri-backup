"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  slugifyCategoryName,
  type ArticleCategoryItem,
} from "@/lib/article-categories";
import {
  createArticleCategoryAction,
  deleteArticleCategoryAction,
  renameArticleCategoryAction,
  reorderArticleCategoriesAction,
} from "@/app/(admin)/admin/kategori-artikel/actions";

export interface ArticleCategoryWithCount extends ArticleCategoryItem {
  articleCount: number;
}

interface ArticleCategoriesManagerClientProps {
  initialCategories: ArticleCategoryWithCount[];
  tableMissing?: boolean;
  hubMaxVisibleChips?: number;
  pageMaxVisibleChips?: number;
}

export function ArticleCategoriesManagerClient({
  initialCategories,
  tableMissing = false,
  hubMaxVisibleChips = 6,
  pageMaxVisibleChips = 6,
}: ArticleCategoriesManagerClientProps) {
  const router = useRouter();
  const [items, setItems] =
    useState<ArticleCategoryWithCount[]>(initialCategories);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Add form state
  const [newName, setNewName] = useState("");
  const [newFilterLabel, setNewFilterLabel] = useState("");
  const [filterManuallyEdited, setFilterManuallyEdited] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit row state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editFilterLabel, setEditFilterLabel] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] =
    useState<ArticleCategoryWithCount | null>(null);

  const handleNewNameChange = (val: string) => {
    setNewName(val);
    if (!filterManuallyEdited) {
      setNewFilterLabel(val);
    }
    if (!slugManuallyEdited) {
      setNewSlug(slugifyCategoryName(val));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsCreating(true);

    const res = await createArticleCategoryAction(
      newName,
      newFilterLabel,
      newSlug
    );
    setIsCreating(false);

    if (!res.ok || !res.category) {
      setErrorMsg(res.error ?? "Gagal menambah kategori artikel.");
      return;
    }

    setItems((prev) => [...prev, { ...res.category!, articleCount: 0 }]);
    setNewName("");
    setNewFilterLabel("");
    setFilterManuallyEdited(false);
    setNewSlug("");
    setSlugManuallyEdited(false);
    setSuccessMsg(`Kategori "${res.category.name}" berhasil ditambahkan.`);
    router.refresh();
  };

  const startEdit = (item: ArticleCategoryWithCount) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditFilterLabel(item.filterLabel);
    setEditSlug(item.slug);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSaveEdit = async (item: ArticleCategoryWithCount) => {
    if (busyId) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setBusyId(item.id);

    const res = await renameArticleCategoryAction(
      item.id,
      editName,
      editFilterLabel,
      editSlug,
      item.updatedAt
    );
    setBusyId(null);

    if (!res.ok || !res.category) {
      setErrorMsg(
        res.concurrencyError ?? res.error ?? "Gagal memperbarui kategori."
      );
      return;
    }

    setItems((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? { ...res.category!, articleCount: c.articleCount }
          : c
      )
    );
    setEditingId(null);
    setSuccessMsg(
      `Kategori "${res.category.name}" diperbarui dan artikel terkait disinkronkan.`
    );
    router.refresh();
  };

  const handleMove = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length || busyId) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    const reordered = next.map((c, i) => ({ ...c, sortOrder: i }));
    setItems(reordered);

    setBusyId(moved.id);
    const res = await reorderArticleCategoriesAction(
      reordered.map((c) => c.id)
    );
    setBusyId(null);

    if (!res.ok) {
      setItems(items);
      setErrorMsg(res.error ?? "Gagal mengubah urutan kategori.");
      return;
    }

    setSuccessMsg("Urutan kategori artikel disimpan.");
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || busyId) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setBusyId(deleteTarget.id);

    const res = await deleteArticleCategoryAction(deleteTarget.id);
    setBusyId(null);
    setDeleteTarget(null);

    if (!res.ok) {
      setErrorMsg(res.error ?? "Gagal menghapus kategori artikel.");
      return;
    }

    setItems((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setSuccessMsg(`Kategori "${deleteTarget.name}" telah dihapus.`);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {tableMissing && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-[#E8C87A] bg-[#FEF6DF] px-4 py-3 text-sm text-[#6B4806]"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Tabel <code>public.article_categories</code> belum tersedia di
            database. Jalankan migrasi{" "}
            <code>supabase/migrations/0004_article_categories.sql</code> di
            Supabase SQL Editor terlebih dahulu.
          </span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-2xl border border-[#9FD6B4] bg-[#DCF3E5] px-4 py-3 text-sm font-medium text-[#0E3A22]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add new category form */}
      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4"
      >
        <h2 className="font-display text-lg font-bold text-[#0F1F17]">
          Tambah Kategori Artikel
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-4">
            <label
              htmlFor="newCatName"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Nama Kategori <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              id="newCatName"
              type="text"
              required
              minLength={2}
              maxLength={40}
              value={newName}
              onChange={(e) => handleNewNameChange(e.target.value)}
              placeholder="Contoh: Pemupukan Organik"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="newCatFilterLabel"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Label Filter <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              id="newCatFilterLabel"
              type="text"
              required
              minLength={2}
              maxLength={40}
              value={newFilterLabel}
              onChange={(e) => {
                setFilterManuallyEdited(true);
                setNewFilterLabel(e.target.value);
              }}
              placeholder="Pemupukan Organik"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="newCatSlug"
              className="block text-sm font-semibold text-[#143D29]"
            >
              Slug Internal <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              id="newCatSlug"
              type="text"
              required
              minLength={2}
              maxLength={60}
              value={newSlug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setNewSlug(e.target.value.toLowerCase());
              }}
              placeholder="pemupukan-organik"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 font-mono text-xs sm:text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isCreating || tableMissing}
              className="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#15803D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14532D] disabled:opacity-60"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>{isCreating ? "Menyimpan..." : "Tambah"}</span>
            </button>
          </div>
        </div>
        <p className="text-xs text-[#43594D]">
          Nama kategori tampil pada lencana kartu artikel; Label Filter tampil
          pada tombol filter publik; Slug hanya boleh berisi huruf kecil,
          angka, dan tanda hubung.
        </p>
      </form>

      {/* Categories list */}
      <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0F1F17]">
          Daftar Kategori ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#CBD8D0] bg-[#F8FBF9] p-5 text-sm text-[#43594D]">
            Belum ada kategori artikel terdaftar.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const isEditing = editingId === item.id;
              const isBusy = busyId === item.id;
              const dividerLimit = Math.min(
                hubMaxVisibleChips,
                pageMaxVisibleChips
              );
              const showOverflowDivider = idx === dividerLimit;
              return (
                <div key={item.id}>
                  {showOverflowDivider && (
                    <div className="my-3 flex items-center gap-3">
                      <div className="h-px flex-1 bg-[#CBD8D0]" />
                      <span className="rounded-full border border-[#E8C87A] bg-[#FEF6DF] px-3 py-1 text-[11px] font-bold text-[#6B4806]">
                        Batas chip langsung (Beranda: {hubMaxVisibleChips},
                        Halaman Artikel: {pageMaxVisibleChips}) &mdash; di
                        bawah ini masuk menu &ldquo;Lainnya&rdquo;
                      </span>
                      <div className="h-px flex-1 bg-[#CBD8D0]" />
                    </div>
                  )}
                  <div className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Nama Kategori (2–40 karakter)
                          </label>
                          <input
                            type="text"
                            value={editName}
                            maxLength={40}
                            onChange={(e) => setEditName(e.target.value)}
                            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Label Filter (2–40 karakter)
                          </label>
                          <input
                            type="text"
                            value={editFilterLabel}
                            maxLength={40}
                            onChange={(e) => setEditFilterLabel(e.target.value)}
                            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Slug Internal
                          </label>
                          <input
                            type="text"
                            value={editSlug}
                            maxLength={60}
                            onChange={(e) =>
                              setEditSlug(e.target.value.toLowerCase())
                            }
                            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 font-mono text-xs sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29]"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Batal</span>
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleSaveEdit(item)}
                          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-xl bg-[#15803D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#14532D] disabled:opacity-60"
                        >
                          <Save className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{isBusy ? "Menyimpan..." : "Simpan"}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-base font-bold text-[#0F1F17]">
                            {item.name}
                          </span>
                          <span className="rounded-full bg-[#EAF3EE] px-2.5 py-0.5 text-xs font-semibold text-[#14532D]">
                            {item.articleCount} artikel
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#43594D]">
                          filter: <span className="font-semibold">{item.filterLabel}</span>{" "}
                          <span className="mx-1">•</span>{" "}
                          <span className="font-mono">slug: {item.slug}</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          disabled={idx === 0 || Boolean(busyId)}
                          onClick={() => handleMove(idx, -1)}
                          aria-label={`Geser ${item.name} ke atas`}
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === items.length - 1 || Boolean(busyId)}
                          onClick={() => handleMove(idx, 1)}
                          aria-label={`Geser ${item.name} ke bawah`}
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(busyId)}
                          onClick={() => startEdit(item)}
                          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Ubah</span>
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(busyId)}
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex min-h-[40px] cursor-pointer items-center gap-1 rounded-xl border border-[#E5B8B8] bg-white px-3 py-1.5 text-xs font-semibold text-[#991B1B] hover:bg-[#FDF2F2]"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-art-cat-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl">
            <h3
              id="delete-art-cat-title"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Hapus Kategori Artikel?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
              Kategori <strong>{deleteTarget.name}</strong> akan dihapus
              permanen. Jika masih digunakan oleh artikel, penghapusan akan
              dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(busyId)}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D]"
              >
                {busyId ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
