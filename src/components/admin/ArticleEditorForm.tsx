"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@/lib/admin-path";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  ImagePlus,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { ArticleSection } from "@/data/articles";
import type { ContentArticleStatus } from "@/lib/content";
import {
  ARTICLE_STATUS_OPTIONS,
  META_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  estimateReadingTime,
  normalizeArticleBodySections,
  normalizeStringList,
  slugifyText,
  type ArticleFieldErrors,
} from "@/lib/articles/admin-validation";
import {
  DEFAULT_ARTICLE_CATEGORIES,
  slugifyCategoryName,
  type ArticleCategoryItem,
} from "@/lib/article-categories";
import { createArticleCategoryAction } from "@/app/(admin)/admin/kategori-artikel/actions";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  deleteArticleAction,
  saveArticleAction,
} from "@/app/(admin)/admin/artikel/actions";

export interface ArticleEditorInitialData {
  id?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  title: string;
  slug: string;
  category: string;
  filter_category: string;
  reading_time: string;
  is_featured: boolean;
  seo_title: string;
  meta_description: string;
  excerpt: string;
  intro: string;
  body: ArticleSection[];
  takeaways: string[];
  tags: string[];
  image_src: string;
  image_alt: string;
  status: ContentArticleStatus;
}

interface ArticleEditorFormProps {
  initialData: ArticleEditorInitialData;
  articleCategories?: ArticleCategoryItem[];
  justSaved?: boolean;
}

function createEmptySection(): ArticleSection {
  const rand =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return {
    id: `bagian-${rand}`,
    heading: "",
    paragraphs: [""],
    bullets: [],
  };
}

export function ArticleEditorForm({
  initialData,
  articleCategories = DEFAULT_ARTICLE_CATEGORIES,
  justSaved = false,
}: ArticleEditorFormProps) {
  const router = useRouter();
  const formErrorId = useId();
  const isEdit = Boolean(initialData.id);

  const [categories, setCategories] =
    useState<ArticleCategoryItem[]>(articleCategories);
  const [showNewCatModal, setShowNewCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatFilterLabel, setNewCatFilterLabel] = useState("");
  const [newCatFilterEdited, setNewCatFilterEdited] = useState(false);
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatSlugEdited, setNewCatSlugEdited] = useState(false);
  const [newCatError, setNewCatError] = useState<string | null>(null);
  const [isCreatingCat, setIsCreatingCat] = useState(false);

  const [originalUpdatedAt, setOriginalUpdatedAt] = useState(
    initialData.updatedAt ?? ""
  );
  const [savedSlug, setSavedSlug] = useState(initialData.slug);
  const [title, setTitle] = useState(initialData.title);
  const [slug, setSlug] = useState(initialData.slug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [category, setCategory] = useState(initialData.category);
  const [filterCategory, setFilterCategory] = useState(
    initialData.filter_category
  );
  const [readingTime, setReadingTime] = useState(initialData.reading_time);
  const [readingTimeTouched, setReadingTimeTouched] = useState(isEdit);
  const [isFeatured, setIsFeatured] = useState(initialData.is_featured);
  const [seoTitle, setSeoTitle] = useState(initialData.seo_title);
  const [metaDescription, setMetaDescription] = useState(
    initialData.meta_description
  );
  const [excerpt, setExcerpt] = useState(initialData.excerpt);
  const [intro, setIntro] = useState(initialData.intro);
  const [sections, setSections] = useState<ArticleSection[]>(
    initialData.body.length > 0 ? initialData.body : [createEmptySection()]
  );
  const [takeaways, setTakeaways] = useState<string[]>(
    initialData.takeaways.length > 0 ? initialData.takeaways : [""]
  );
  const [tags, setTags] = useState<string[]>(initialData.tags);
  const [newTagInput, setNewTagInput] = useState("");
  const [imageSrc, setImageSrc] = useState(initialData.image_src);
  const [imageAlt, setImageAlt] = useState(initialData.image_alt);
  const [status, setStatus] = useState<ContentArticleStatus>(initialData.status);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<ArticleFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    justSaved ? "Artikel berhasil disimpan." : null
  );

  // Publish confirmation modal
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSlugInput, setDeleteSlugInput] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const computedReadingTime = useMemo(
    () => estimateReadingTime(intro, sections),
    [intro, sections]
  );
  const effectiveReadingTime = readingTimeTouched
    ? readingTime
    : computedReadingTime;

  useEffect(() => {
    if (!isDirty) {
      window.__adminIsDirty = false;
      return;
    }
    window.__adminIsDirty = true;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.__adminIsDirty = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
    if (successMessage) setSuccessMessage(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugifyText(val));
    }
    markDirty();
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadError(null);
    setUploadNotice(null);
    setIsUploading(true);

    const result = await uploadArticleImage(file);
    setIsUploading(false);

    if (!result.ok) {
      setUploadError(result.error);
      return;
    }

    setImageSrc(result.publicUrl);
    setUploadNotice(
      result.resized
        ? "Gambar diperkecil otomatis ke WebP dan berhasil diunggah."
        : "Gambar berhasil diunggah."
    );
    setFieldErrors((prev) => ({ ...prev, image_src: undefined }));
    markDirty();
  };

  const executeSave = async () => {
    setIsSaving(true);
    setFieldErrors({});
    setFormError(null);
    setConcurrencyError(null);
    setSuccessMessage(null);

    const result = await saveArticleAction({
      ...(initialData.id ? { id: initialData.id } : {}),
      ...(isEdit ? { originalUpdatedAt } : {}),
      title,
      slug,
      category,
      filter_category: filterCategory,
      reading_time: effectiveReadingTime,
      is_featured: isFeatured,
      seo_title: seoTitle,
      meta_description: metaDescription,
      excerpt,
      intro,
      body: sections,
      takeaways,
      tags,
      image_src: imageSrc,
      image_alt: imageAlt,
      status,
    });

    setIsSaving(false);

    if (!result.ok) {
      if (result.concurrencyError) {
        setConcurrencyError(result.concurrencyError);
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(
          result.formError ?? "Gagal menyimpan artikel. Periksa kembali isian."
        );
      }
      return;
    }

    setIsDirty(false);
    if (result.updatedAt) setOriginalUpdatedAt(result.updatedAt);
    if (result.slug) setSavedSlug(result.slug);

    const normalizedBody = normalizeArticleBodySections(sections);
    if (!normalizedBody.error && normalizedBody.sections.length > 0) {
      setSections(normalizedBody.sections);
    }
    const cleanedTakeaways = normalizeStringList(takeaways);
    if (cleanedTakeaways.length > 0) {
      setTakeaways(cleanedTakeaways);
    }
    setTags(normalizeStringList(tags, true));

    if (!isEdit && result.id) {
      router.push(adminPath(`/artikel/${result.id}?saved=1`));
      return;
    }

    setSuccessMessage("Perubahan artikel berhasil disimpan dan dipublikasikan ke cache situs.");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving || isUploading) return;

    if (
      status === "published" &&
      (!isEdit || initialData.status !== "published")
    ) {
      setShowPublishConfirm(true);
      return;
    }

    await executeSave();
  };

  const handleDeleteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData.id || isDeleting) return;
    setDeleteError(null);
    setIsDeleting(true);

    const res = await deleteArticleAction(initialData.id, deleteSlugInput);
    // deleteArticleAction redirects on success; if it returns, an error occurred
    setIsDeleting(false);
    if (res && !res.ok) {
      setDeleteError(res.error ?? "Gagal menghapus artikel.");
    }
  };

  // Section helpers
  const updateSection = (idx: number, patch: Partial<ArticleSection>) => {
    setSections((prev) =>
      prev.map((sec, i) => (i === idx ? { ...sec, ...patch } : sec))
    );
    markDirty();
  };

  const moveSection = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= sections.length) return;
    setSections((prev) => {
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(target, 0, item);
      return next;
    });
    markDirty();
  };

  const removeSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((_, i) => i !== idx));
    markDirty();
  };

  const addTagFromInput = () => {
    const clean = newTagInput.trim();
    if (!clean) return;
    if (!tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTags((prev) => [...prev, clean]);
      markDirty();
    }
    setNewTagInput("");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-describedby={formError ? formErrorId : undefined}
        className="space-y-6"
      >
        {/* Top Action Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#CBD8D0] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-[#0F1F17] sm:text-2xl">
              {isEdit ? "Ubah Artikel" : "Buat Artikel Baru"}
            </h1>
            <p className="mt-0.5 text-xs text-[#43594D]">
              Semua isian berupa teks polos (tanpa HTML atau Markdown).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isEdit && initialData.id && (
              <Link
                href={adminPath(`/artikel/${initialData.id}/pratinjau`)}
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span>Pratinjau</span>
              </Link>
            )}
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#143D29] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0E2B1D] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
            >
              <Save className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Artikel"}</span>
            </button>
          </div>
        </div>

        {/* Status / Error Banners */}
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
              className="inline-flex min-h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#7F1D1D]/30 bg-white px-3 py-1.5 text-xs font-semibold text-[#7F1D1D] hover:bg-[#FCE8E8]"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Muat Ulang</span>
            </button>
          </div>
        )}

        {formError && (
          <div
            id={formErrorId}
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-3 text-sm font-medium text-[#7F1D1D]"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Dasar */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            1. Informasi Dasar
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="field-title"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Judul Artikel <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="field-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.title && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.title}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="field-slug"
                  className="block text-sm font-semibold text-[#143D29]"
                >
                  Slug URL <span className="text-[#B91C1C]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(slugifyText(title));
                    setSlugTouched(true);
                    markDirty();
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Buat dari judul</span>
                </button>
              </div>
              <input
                id="field-slug"
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value.toLowerCase());
                  markDirty();
                }}
                placeholder="contoh-judul-artikel"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 font-mono text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              <p className="mt-1 text-xs text-[#43594D]">
                Hanya huruf kecil (a–z), angka, dan tanda hubung (-). URL:
                /artikel/{slug || "..."}
              </p>
              {fieldErrors.slug && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.slug}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              {(() => {
                const matchedCat = categories.find(
                  (c) => c.name === category || c.filterLabel === filterCategory
                );
                const selectVal = matchedCat ? matchedCat.slug : "__unregistered__";
                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="field-category"
                        className="block text-sm font-semibold text-[#143D29]"
                      >
                        Kategori Artikel <span className="text-[#B91C1C]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCatName("");
                          setNewCatFilterLabel("");
                          setNewCatFilterEdited(false);
                          setNewCatSlug("");
                          setNewCatSlugEdited(false);
                          setNewCatError(null);
                          setShowNewCatModal(true);
                        }}
                        className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                      >
                        + Kategori baru
                      </button>
                    </div>
                    <select
                      id="field-category"
                      value={selectVal}
                      onChange={(e) => {
                        const chosen = categories.find(
                          (c) => c.slug === e.target.value
                        );
                        if (chosen) {
                          setCategory(chosen.name);
                          setFilterCategory(chosen.filterLabel);
                          markDirty();
                        }
                      }}
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
                    >
                      {!matchedCat && (
                        <option value="__unregistered__">
                          {(category || filterCategory || "Kategori lama") +
                            " (tidak terdaftar)"}
                        </option>
                      )}
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-[#43594D]">
                      {matchedCat
                        ? `Label filter publik: ${matchedCat.filterLabel}`
                        : "Kategori artikel ini belum terdaftar di daftar kategori. Pilih kategori terdaftar atau buat kategori baru."}
                    </p>
                    {(fieldErrors.category || fieldErrors.filter_category) && (
                      <p
                        role="alert"
                        className="mt-1 text-xs font-medium text-[#B91C1C]"
                      >
                        {fieldErrors.category ?? fieldErrors.filter_category}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="field-reading-time"
                  className="block text-sm font-semibold text-[#143D29]"
                >
                  Estimasi Waktu Baca <span className="text-[#B91C1C]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setReadingTime(computedReadingTime);
                    setReadingTimeTouched(false);
                    markDirty();
                  }}
                  className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                >
                  Hitung otomatis ({computedReadingTime})
                </button>
              </div>
              <input
                id="field-reading-time"
                type="text"
                value={effectiveReadingTime}
                onChange={(e) => {
                  setReadingTimeTouched(true);
                  setReadingTime(e.target.value);
                  markDirty();
                }}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.reading_time && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.reading_time}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#DCE8DF] bg-[#F7FAF8] p-3.5">
              <input
                id="field-is-featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  setIsFeatured(e.target.checked);
                  markDirty();
                }}
                className="mt-1 h-4 w-4 rounded border-[#CBD8D0] text-[#143D29] focus:ring-[#143D29]"
              />
              <div>
                <label
                  htmlFor="field-is-featured"
                  className="block text-sm font-semibold text-[#0F1F17]"
                >
                  Jadikan Artikel Utama (Featured)
                </label>
                <p className="mt-0.5 text-xs leading-relaxed text-[#43594D]">
                  Halaman pusat artikel hanya menampilkan satu Artikel Utama.
                  Mengaktifkan ini akan otomatis menonaktifkan status Utama pada
                  artikel lain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: SEO */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            2. Pengaturan SEO
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="field-seo-title"
                  className="block text-sm font-semibold text-[#143D29]"
                >
                  Judul SEO <span className="text-[#B91C1C]">*</span>
                </label>
                <span
                  className={`text-xs font-semibold ${
                    seoTitle.length > SEO_TITLE_MAX
                      ? "text-[#B91C1C]"
                      : "text-[#43594D]"
                  }`}
                >
                  {seoTitle.length}/{SEO_TITLE_MAX}
                </span>
              </div>
              <input
                id="field-seo-title"
                type="text"
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  markDirty();
                }}
                maxLength={SEO_TITLE_MAX + 20}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.seo_title && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.seo_title}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="field-meta-description"
                  className="block text-sm font-semibold text-[#143D29]"
                >
                  Deskripsi Meta <span className="text-[#B91C1C]">*</span>
                </label>
                <span
                  className={`text-xs font-semibold ${
                    metaDescription.length > META_DESCRIPTION_MAX
                      ? "text-[#B91C1C]"
                      : "text-[#43594D]"
                  }`}
                >
                  {metaDescription.length}/{META_DESCRIPTION_MAX}
                </span>
              </div>
              <textarea
                id="field-meta-description"
                rows={3}
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  markDirty();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2.5 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.meta_description && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.meta_description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 3: Ringkasan */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            3. Ringkasan &amp; Pembuka
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="field-excerpt"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Ringkasan Kartu (Excerpt) <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                id="field-excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  markDirty();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2.5 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.excerpt && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.excerpt}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="field-intro"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Paragraf Pembuka (Intro) <span className="text-[#B91C1C]">*</span>
              </label>
              <textarea
                id="field-intro"
                rows={4}
                value={intro}
                onChange={(e) => {
                  setIntro(e.target.value);
                  markDirty();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2.5 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
              />
              {fieldErrors.intro && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.intro}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Isi Terstruktur */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                4. Isi Artikel Terstruktur
              </h2>
              <p className="mt-0.5 text-xs text-[#43594D]">
                Susun pembahasan per subjudul (H2). Urutan bagian dapat digeser.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSections((prev) => [...prev, createEmptySection()]);
                markDirty();
              }}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#D9F0E3]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Tambah Bagian</span>
            </button>
          </div>

          {fieldErrors.body && (
            <p role="alert" className="mt-3 text-xs font-medium text-[#B91C1C]">
              {fieldErrors.body}
            </p>
          )}

          <div className="mt-4 space-y-5">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="rounded-2xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3ECE6] pb-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#15803D]">
                    Bagian {sIdx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveSection(sIdx, -1)}
                      disabled={sIdx === 0}
                      aria-label={`Geser bagian ${sIdx + 1} ke atas`}
                      className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(sIdx, 1)}
                      disabled={sIdx === sections.length - 1}
                      aria-label={`Geser bagian ${sIdx + 1} ke bawah`}
                      className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sIdx)}
                      disabled={sections.length <= 1}
                      aria-label={`Hapus bagian ${sIdx + 1}`}
                      className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-4">
                  <div>
                    <label
                      htmlFor={`sec-heading-${section.id}`}
                      className="block text-xs font-semibold text-[#143D29]"
                    >
                      Subjudul Bagian <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id={`sec-heading-${section.id}`}
                      type="text"
                      value={section.heading}
                      onChange={(e) =>
                        updateSection(sIdx, { heading: e.target.value })
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
                    />
                  </div>

                  {/* Paragraphs */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#143D29]">
                        Paragraf <span className="text-[#B91C1C]">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection(sIdx, {
                            paragraphs: [...section.paragraphs, ""],
                          })
                        }
                        className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                      >
                        + Tambah Paragraf
                      </button>
                    </div>
                    <div className="mt-1.5 space-y-2">
                      {section.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <textarea
                            aria-label={`Bagian ${sIdx + 1} paragraf ${pIdx + 1}`}
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const next = [...section.paragraphs];
                              next[pIdx] = e.target.value;
                              updateSection(sIdx, { paragraphs: next });
                            }}
                            className="w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
                          />
                          {section.paragraphs.length > 1 && (
                            <button
                              type="button"
                              aria-label={`Hapus paragraf ${pIdx + 1}`}
                              onClick={() => {
                                updateSection(sIdx, {
                                  paragraphs: section.paragraphs.filter(
                                    (_, idx) => idx !== pIdx
                                  ),
                                });
                              }}
                              className="inline-flex min-h-[40px] min-w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2]"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Optional Bullets */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#143D29]">
                        Daftar Poin Lapangan (Opsional)
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection(sIdx, {
                            bullets: [...(section.bullets ?? []), ""],
                          })
                        }
                        className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                      >
                        + Tambah Poin
                      </button>
                    </div>
                    {(section.bullets?.length ?? 0) > 0 && (
                      <div className="mt-1.5 space-y-2">
                        {section.bullets?.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              aria-label={`Bagian ${sIdx + 1} poin ${bIdx + 1}`}
                              value={b}
                              onChange={(e) => {
                                const next = [...(section.bullets ?? [])];
                                next[bIdx] = e.target.value;
                                updateSection(sIdx, { bullets: next });
                              }}
                              className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
                            />
                            <button
                              type="button"
                              aria-label={`Hapus poin ${bIdx + 1}`}
                              onClick={() => {
                                updateSection(sIdx, {
                                  bullets: (section.bullets ?? []).filter(
                                    (_, idx) => idx !== bIdx
                                  ),
                                });
                              }}
                              className="inline-flex min-h-[40px] min-w-[40px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2]"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Optional Callout */}
                  <div className="rounded-xl border border-[#DCE8DF] bg-white p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#143D29]">
                        Kotak Sorotan / Tips (Opsional)
                      </span>
                      {section.callout ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(sIdx, { callout: undefined })
                          }
                          className="cursor-pointer text-xs font-semibold text-[#991B1B] hover:underline"
                        >
                          Hapus Sorotan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection(sIdx, {
                              callout: { title: "", text: "" },
                            })
                          }
                          className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                        >
                          + Tambah Sorotan
                        </button>
                      )}
                    </div>

                    {section.callout && (
                      <div className="mt-2.5 space-y-2">
                        <input
                          type="text"
                          aria-label={`Judul sorotan bagian ${sIdx + 1}`}
                          placeholder="Judul sorotan, misal: Tips Praktis di Lahan"
                          value={section.callout.title}
                          onChange={(e) =>
                            updateSection(sIdx, {
                              callout: {
                                title: e.target.value,
                                text: section.callout?.text ?? "",
                              },
                            })
                          }
                          className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm text-[#0F1F17]"
                        />
                        <textarea
                          rows={2}
                          aria-label={`Isi sorotan bagian ${sIdx + 1}`}
                          placeholder="Isi pesan sorotan..."
                          value={section.callout.text}
                          onChange={(e) =>
                            updateSection(sIdx, {
                              callout: {
                                title: section.callout?.title ?? "",
                                text: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Poin Penting & Tag */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            5. Poin Penting &amp; Tag Topik
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[#143D29]">
                  Poin Penting (Takeaways) <span className="text-[#B91C1C]">*</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTakeaways((prev) => [...prev, ""]);
                    markDirty();
                  }}
                  className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                >
                  + Tambah Poin
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {takeaways.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      aria-label={`Poin penting ${idx + 1}`}
                      value={item}
                      onChange={(e) => {
                        const next = [...takeaways];
                        next[idx] = e.target.value;
                        setTakeaways(next);
                        markDirty();
                      }}
                      placeholder="Contoh: Identitas Bahan Aktif"
                      className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
                    />
                    {takeaways.length > 1 && (
                      <button
                        type="button"
                        aria-label={`Hapus poin penting ${idx + 1}`}
                        onClick={() => {
                          setTakeaways((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                          markDirty();
                        }}
                        className="inline-flex min-h-[42px] min-w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2]"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {fieldErrors.takeaways && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.takeaways}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="field-new-tag"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Tag Pencarian
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="field-new-tag"
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  placeholder="Ketik tag lalu tekan Tambah..."
                  className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
                />
                <button
                  type="button"
                  onClick={addTagFromInput}
                  className="inline-flex min-h-[42px] shrink-0 cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#D9F0E3]"
                >
                  Tambah
                </button>
              </div>
              {tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD8D0] bg-[#F4F7F4] px-3 py-1 text-xs font-semibold text-[#143D29]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        aria-label={`Hapus tag ${tag}`}
                        onClick={() => {
                          setTags((prev) => prev.filter((t) => t !== tag));
                          markDirty();
                        }}
                        className="cursor-pointer rounded-full px-1 text-[#7F1D1D] hover:bg-[#FCE8E8]"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Section 6: Gambar */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            6. Gambar Utama Artikel
          </h2>
          <p className="mt-1 text-xs text-[#43594D]">
            Format yang didukung: JPG, PNG, atau WebP (maks. 2 MB). Rekomendasi
            rasio lanskap <strong>16:9</strong> atau <strong>16:10</strong>{" "}
            agar serasi dengan kartu artikel dan header.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#9DB5A7] bg-[#F8FBF9] p-4 text-center transition-colors hover:border-[#143D29] hover:bg-[#EAF3EE]">
                <UploadCloud
                  className="h-6 w-6 text-[#15803D]"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-[#143D29]">
                  {isUploading
                    ? "Mengunggah gambar..."
                    : "Pilih gambar untuk diunggah ke Storage"}
                </span>
                <span className="text-[11px] text-[#43594D]">
                  Jika di atas 2 MB, sistem akan otomatis memperkecil ke WebP.
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploading}
                  onChange={handleImageFileChange}
                  className="sr-only"
                />
              </label>

              {uploadNotice && (
                <p role="status" className="text-xs font-medium text-[#15803D]">
                  {uploadNotice}
                </p>
              )}
              {uploadError && (
                <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                  {uploadError}
                </p>
              )}

              <div>
                <label
                  htmlFor="field-image-src"
                  className="block text-xs font-semibold text-[#143D29]"
                >
                  URL / Path Gambar <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-image-src"
                  type="text"
                  value={imageSrc}
                  onChange={(e) => {
                    setImageSrc(e.target.value);
                    markDirty();
                  }}
                  placeholder="https://... atau /images/..."
                  className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-xs text-[#0F1F17]"
                />
                {fieldErrors.image_src && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {fieldErrors.image_src}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-image-alt"
                  className="block text-xs font-semibold text-[#143D29]"
                >
                  Teks Alternatif (Alt) Gambar{" "}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="field-image-alt"
                  type="text"
                  value={imageAlt}
                  onChange={(e) => {
                    setImageAlt(e.target.value);
                    markDirty();
                  }}
                  placeholder="Jelaskan isi gambar untuk aksesibilitas dan SEO"
                  className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
                />
                {fieldErrors.image_alt && (
                  <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {fieldErrors.image_alt}
                  </p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#143D29]">
                Pratinjau Gambar
              </span>
              <div className="mt-1.5 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-[#CBD8D0] bg-[#EEF3EF]">
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt={imageAlt || "Pratinjau gambar artikel"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-[#43594D]">
                    <ImagePlus className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs">Belum ada gambar dipilih</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Status Publikasi */}
        <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
          <h2 className="font-display text-lg font-bold text-[#0F1F17]">
            7. Status Publikasi
          </h2>
          <fieldset className="mt-4 space-y-2.5">
            <legend className="sr-only">Pilih status publikasi artikel</legend>
            {ARTICLE_STATUS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                  status === opt.value
                    ? "border-[#143D29] bg-[#EAF3EE]"
                    : "border-[#DCE8DF] bg-white hover:bg-[#F7FAF8]"
                }`}
              >
                <input
                  type="radio"
                  name="article-status"
                  value={opt.value}
                  checked={status === opt.value}
                  onChange={() => {
                    setStatus(opt.value);
                    markDirty();
                  }}
                  className="mt-1 h-4 w-4 text-[#143D29] focus:ring-[#143D29]"
                />
                <div>
                  <span className="block text-sm font-bold text-[#0F1F17]">
                    {opt.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#33473D]">
                    {opt.description}
                  </span>
                </div>
              </label>
            ))}
          </fieldset>
        </section>

        {/* Bottom Save + Danger Zone */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {isEdit && initialData.id ? (
            <button
              type="button"
              onClick={() => {
                setDeleteSlugInput("");
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5B8B8] bg-white px-4 py-2 text-xs font-semibold text-[#991B1B] hover:bg-[#FDF2F2]"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>Hapus Artikel</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#143D29] px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0E2B1D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Artikel"}</span>
          </button>
        </div>
      </form>

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl">
            <h3
              id="publish-confirm-title"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Konfirmasi Terbitkan Artikel
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
              Artikel dengan status <strong>Terbit</strong> akan langsung tampil
              di halaman publik dan masuk ke daftar sitemap. Lanjutkan
              menyimpan?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPublishConfirm(false)}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPublishConfirm(false);
                  void executeSave();
                }}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#143D29] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D]"
              >
                Ya, Terbitkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <form
            onSubmit={handleDeleteSubmit}
            className="w-full max-w-md rounded-2xl border border-[#E5B8B8] bg-white p-6 shadow-xl"
          >
            <h3
              id="delete-confirm-title"
              className="font-display text-lg font-bold text-[#7F1D1D]"
            >
              Hapus Artikel Permanen
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
              Tindakan ini akan menghapus artikel dari database (file gambar di
              Storage tetap dipertahankan). Untuk konfirmasi, ketik slug berikut:
            </p>
            <p className="mt-2 rounded-lg bg-[#F4F7F4] px-3 py-2 font-mono text-xs font-bold text-[#0F1F17] break-all">
              {savedSlug}
            </p>

            <label
              htmlFor="delete-slug-confirm"
              className="mt-3 block text-xs font-semibold text-[#143D29]"
            >
              Ketik ulang slug artikel
            </label>
            <input
              id="delete-slug-confirm"
              type="text"
              value={deleteSlugInput}
              onChange={(e) => setDeleteSlugInput(e.target.value)}
              className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 font-mono text-xs text-[#0F1F17]"
              required
            />

            {deleteError && (
              <p role="alert" className="mt-2 text-xs font-medium text-[#B91C1C]">
                {deleteError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isDeleting || deleteSlugInput.trim() !== savedSlug}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus Artikel"}
              </button>
            </div>
          </form>
        </div>
      )}
      {showNewCatModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inline-new-cat-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (isCreatingCat) return;
              setNewCatError(null);
              setIsCreatingCat(true);
              const res = await createArticleCategoryAction(
                newCatName,
                newCatFilterLabel,
                newCatSlug
              );
              setIsCreatingCat(false);
              if (!res.ok || !res.category) {
                setNewCatError(res.error ?? "Gagal menambah kategori baru.");
                return;
              }
              setCategories((prev) => [...prev, res.category!]);
              setCategory(res.category.name);
              setFilterCategory(res.category.filterLabel);
              markDirty();
              setShowNewCatModal(false);
            }}
            className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl space-y-4"
          >
            <h3
              id="inline-new-cat-title"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Tambah Kategori Artikel Baru
            </h3>
            <div>
              <label
                htmlFor="inline-cat-name"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Nama Kategori (2–40 karakter){" "}
                <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="inline-cat-name"
                type="text"
                required
                minLength={2}
                maxLength={40}
                value={newCatName}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewCatName(val);
                  if (!newCatFilterEdited) {
                    setNewCatFilterLabel(val);
                  }
                  if (!newCatSlugEdited) {
                    setNewCatSlug(slugifyCategoryName(val));
                  }
                }}
                placeholder="Contoh: Pemupukan Organik"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="inline-cat-filter-label"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Label Filter Publik (2–40 karakter){" "}
                <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="inline-cat-filter-label"
                type="text"
                required
                minLength={2}
                maxLength={40}
                value={newCatFilterLabel}
                onChange={(e) => {
                  setNewCatFilterEdited(true);
                  setNewCatFilterLabel(e.target.value);
                }}
                placeholder="Pemupukan Organik"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="inline-cat-slug"
                className="block text-sm font-semibold text-[#143D29]"
              >
                Slug Internal <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="inline-cat-slug"
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={newCatSlug}
                onChange={(e) => {
                  setNewCatSlugEdited(true);
                  setNewCatSlug(e.target.value.toLowerCase());
                }}
                placeholder="pemupukan-organik"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 font-mono text-xs sm:text-sm"
              />
            </div>
            {newCatError && (
              <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                {newCatError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewCatModal(false)}
                disabled={isCreatingCat}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isCreatingCat}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#15803D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#14532D] disabled:opacity-60"
              >
                {isCreatingCat ? "Menyimpan..." : "Simpan & Pilih"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
