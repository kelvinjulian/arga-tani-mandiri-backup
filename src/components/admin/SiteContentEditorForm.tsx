"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@/lib/admin-path";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { SITE_DATA } from "@/data/site";
import {
  isShopeeHost,
  type SiteContentKey,
} from "@/lib/site-content/validation";
import {
  SUPPORTED_ICON_OPTIONS,
  SupportedIcon,
  type SupportedIconName,
} from "@/lib/site-content/icons";
import {
  getWhatsAppHref,
  isDummyWhatsAppNumber,
} from "@/lib/whatsapp";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  DEFAULT_PRIMARY_CTA,
  DEFAULT_SECONDARY_CTA,
  type HeroCtaButton,
} from "@/lib/site-content/hero-cta";
import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { NavbarContentEditor } from "@/components/admin/NavbarContentEditor";
import {
  VideoPageEditor,
  VideoSectionEditor,
} from "@/components/admin/VideoContentEditors";
import {
  DEFAULT_ABOUT_IMAGE_ALT,
  DEFAULT_ABOUT_IMAGE_BADGE,
  DEFAULT_ABOUT_IMAGE_SRC,
} from "@/lib/site-content/about-defaults";
import {
  DEFAULT_ARTICLE_HUB,
  DEFAULT_ARTICLE_HUB_ALL_CTA,
} from "@/lib/site-content/article-hub-defaults";
import {
  DEFAULT_ARTICLE_PAGE_OG_ALT,
  DEFAULT_ARTICLE_PAGE_OG_IMAGE,
} from "@/lib/site-content/article-pages-defaults";
import {
  DEFAULT_FOOTER_DATA,
  DEFAULT_FOOTER_LOGO_SRC,
  type FooterHighlightItem,
  type FooterLinkColumn,
  type FooterSocialLink,
} from "@/lib/site-content/footer-defaults";
import { CtaButtonEditor } from "@/components/admin/CtaButtonEditor";
import {
  resetSiteContentAction,
  saveSiteContentAction,
} from "@/app/(admin)/admin/konten/actions";

interface SiteContentEditorFormProps {
  blockKey: SiteContentKey;
  blockGroup?: string;
  blockTitle: string;
  blockDescription: string;
  publicHref: string;
  companyContext?: {
    companyName?: string;
    whatsappNumber: string | null;
    shopeeStoreUrl: string;
    contact?: {
      address?: string | null;
      phone?: string | null;
      email?: string | null;
      operatingHours?: string | null;
    };
  };
  initialValue: Record<string, unknown>;
  initialUpdatedAt: string | null;
}

function getStr(obj: Record<string, unknown>, key: string, fallback = ""): string {
  const val = obj[key];
  return typeof val === "string" ? val : fallback;
}

function getObj(obj: Record<string, unknown>, key: string): Record<string, unknown> {
  const val = obj[key];
  return val && typeof val === "object" && !Array.isArray(val)
    ? (val as Record<string, unknown>)
    : {};
}

function getArr<T>(obj: Record<string, unknown>, key: string): T[] {
  const val = obj[key];
  return Array.isArray(val) ? (val as T[]) : [];
}

function FieldCounter({
  label,
  value,
  max,
  htmlFor,
  required = true,
  hint,
}: {
  label: string;
  value: string;
  max: number;
  htmlFor: string;
  required?: boolean;
  hint?: string;
}) {
  const over = value.length > max;
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#143D29]">
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
      {hint && <p className="mt-0.5 text-xs text-[#43594D]">{hint}</p>}
    </div>
  );
}

function ImageUploadControl({
  isUploading,
  onFileChange,
  hasCustomImage,
  allowRemove = false,
  onRequestRemove,
}: {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasCustomImage: boolean;
  allowRemove?: boolean;
  onRequestRemove?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      <label className="flex min-h-[100px] flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[#9DB5A7] bg-[#F8FBF9] p-4 text-center hover:border-[#143D29]">
        <UploadCloud className="h-5 w-5 text-[#15803D]" aria-hidden="true" />
        <span className="text-xs font-semibold text-[#143D29]">
          {isUploading
            ? "Mengunggah..."
            : hasCustomImage
              ? "Ganti Gambar Hero (JPG/PNG/WebP, maks 2 MB)"
              : "Unggah Gambar Hero (JPG/PNG/WebP, maks 2 MB)"}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploading}
          onChange={onFileChange}
          className="sr-only"
        />
      </label>
      {allowRemove && hasCustomImage && onRequestRemove && (
        <button
          type="button"
          onClick={onRequestRemove}
          disabled={isUploading}
          className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border border-[#E5B8B8] bg-[#FDF2F2] px-4 py-2 text-xs font-semibold text-[#991B1B] hover:bg-[#FCE4E4] disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>Hapus gambar</span>
        </button>
      )}
    </div>
  );
}

function IconSelectField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: SupportedIconName) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[#143D29]">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] text-[#143D29]">
          <SupportedIcon name={value} className="h-4 w-4" />
        </span>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as SupportedIconName)}
          className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 text-xs text-[#0F1F17] focus:border-[#143D29] focus:outline-2 focus:outline-[#143D29]"
        >
          {SUPPORTED_ICON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function SiteContentEditorForm({
  blockKey,
  blockGroup,
  blockTitle,
  blockDescription,
  publicHref,
  companyContext,
  initialValue,
  initialUpdatedAt,
}: SiteContentEditorFormProps) {
  const router = useRouter();
  const [formVal, setFormVal] = useState<Record<string, unknown>>(initialValue);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRemoveImageModal, setShowRemoveImageModal] = useState(false);

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

  const updateField = (key: string, value: unknown) => {
    setFormVal((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSuccessMessage(null);
  };

  const updateNestedField = (parent: string, child: string, value: unknown) => {
    setFormVal((prev) => ({
      ...prev,
      [parent]: { ...getObj(prev, parent), [child]: value },
    }));
    setIsDirty(true);
    setSuccessMessage(null);
  };

  const moveItem = <T,>(arrKey: string, idx: number, dir: -1 | 1) => {
    const list = [...getArr<T>(formVal, arrKey)];
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    const [moved] = list.splice(idx, 1);
    list.splice(target, 0, moved);
    updateField(arrKey, list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || isUploading) return;
    setIsSaving(true);
    setFieldErrors({});
    setFormError(null);
    setConcurrencyError(null);
    setSuccessMessage(null);

    const res = await saveSiteContentAction(blockKey, formVal, updatedAt);
    setIsSaving(false);

    if (!res.ok) {
      if (res.concurrencyError) {
        setConcurrencyError(res.concurrencyError);
      } else {
        setFieldErrors(res.fieldErrors ?? {});
        setFormError(res.formError ?? "Gagal menyimpan perubahan.");
      }
      return;
    }

    if (res.value) setFormVal(res.value);
    if (res.updatedAt) setUpdatedAt(res.updatedAt);
    setIsDirty(false);
    setSuccessMessage("Perubahan berhasil disimpan dan langsung aktif di situs.");
    router.refresh();
  };

  const handleResetToDefault = async () => {
    if (isResetting) return;
    setIsResetting(true);
    setConcurrencyError(null);
    setFormError(null);
    setFieldErrors({});

    const res = await resetSiteContentAction(blockKey, updatedAt);
    setIsResetting(false);
    setShowResetModal(false);

    if (!res.ok) {
      if (res.concurrencyError) {
        setConcurrencyError(res.concurrencyError);
      } else {
        setFormError(res.formError ?? "Gagal mengembalikan ke teks awal.");
      }
      return;
    }

    if (res.value) setFormVal(res.value);
    if (res.updatedAt) setUpdatedAt(res.updatedAt);
    setIsDirty(false);
    setSuccessMessage("Bagian ini telah dikembalikan ke teks awal bawaan.");
    router.refresh();
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    const res = await uploadArticleImage(file);
    setIsUploading(false);
    if (!res.ok) {
      setUploadError(res.error);
      return;
    }
    updateField("imageSrc", res.publicUrl);
  };

  const handleBannerImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    const res = await uploadArticleImage(file);
    setIsUploading(false);
    if (!res.ok) {
      setUploadError(res.error);
      return;
    }
    updateField("bannerImageSrc", res.publicUrl);
  };

  const handleFieldImageUpload =
    (targetField: string) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setUploadError(null);
      setIsUploading(true);
      const res = await uploadArticleImage(file);
      setIsUploading(false);
      if (!res.ok) {
        setUploadError(res.error);
        return;
      }
      updateField(targetField, res.publicUrl);
    };

  const renderError = (key: string) =>
    fieldErrors[key] ? (
      <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
        {fieldErrors[key]}
      </p>
    ) : null;

  return (
    <>
      <form onSubmit={handleSave} noValidate className="space-y-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            {blockGroup && (
              <p className="text-xs font-semibold text-[#15803D]">
                {blockGroup} &gt; {blockTitle}
              </p>
            )}
            <h1 className="font-display text-xl font-bold text-[#0F1F17] sm:text-2xl">
              {blockTitle}
            </h1>
            <p className="mt-1 text-xs text-[#43594D]">{blockDescription}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
            >
              <span>Lihat di situs</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kembalikan ke teks awal</span>
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-[#143D29] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0E2B1D] disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</span>
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

        {/* COMPANY BLOCK */}
        {blockKey === "company" && (() => {
          const store = getObj(formVal, "officialStore");
          const contact = getObj(formVal, "contact");
          const waVal = getStr(formVal, "whatsappNumber");
          const waHref = getWhatsAppHref(waVal);
          const storeUrl = getStr(store, "url");

          return (
            <div className="space-y-6">
              {isDummyWhatsAppNumber(waVal) && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-2xl border border-[#E8C87A] bg-[#FEF6DF] p-4 text-sm text-[#6B4806]"
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-bold">
                      Nomor WhatsApp masih menggunakan nomor contoh (6281234567890)
                    </p>
                    <p className="mt-0.5 text-xs">
                      Ganti dengan nomor WhatsApp resmi perusahaan sebelum
                      dipublikasikan agar pelanggan tidak menghubungi nomor
                      dummy.
                    </p>
                  </div>
                </div>
              )}

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Identitas Perusahaan
                </h2>
                <div>
                  <FieldCounter
                    label="Nama Perusahaan"
                    value={getStr(formVal, "companyName")}
                    max={100}
                    htmlFor="companyName"
                    hint="Tampil di: Navbar, Footer, metadata halaman, dan data terstruktur situs."
                  />
                  <input
                    id="companyName"
                    type="text"
                    value={getStr(formVal, "companyName")}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("companyName")}
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Bidang Usaha"
                    value={getStr(formVal, "fieldDescription")}
                    max={400}
                    htmlFor="fieldDescription"
                    hint="Tampil di: Deskripsi metadata SEO halaman beranda dan tag Open Graph."
                  />
                  <textarea
                    id="fieldDescription"
                    rows={3}
                    value={getStr(formVal, "fieldDescription")}
                    onChange={(e) =>
                      updateField("fieldDescription", e.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("fieldDescription")}
                </div>
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Toko Resmi Marketplace
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Nama Toko"
                      value={getStr(store, "name")}
                      max={80}
                      htmlFor="storeName"
                      hint="Tampil di: Kartu toko resmi pada pita WhatsApp halaman Artikel & detail artikel."
                    />
                    <input
                      id="storeName"
                      type="text"
                      value={getStr(store, "name")}
                      onChange={(e) =>
                        updateNestedField("officialStore", "name", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("officialStore.name")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Platform"
                      value={getStr(store, "platform")}
                      max={40}
                      htmlFor="storePlatform"
                      hint="Tampil di: Judul kartu toko resmi pada pita WhatsApp halaman Artikel."
                    />
                    <input
                      id="storePlatform"
                      type="text"
                      value={getStr(store, "platform")}
                      onChange={(e) =>
                        updateNestedField(
                          "officialStore",
                          "platform",
                          e.target.value
                        )
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("officialStore.platform")}
                  </div>
                  <div className="sm:col-span-2">
                    <FieldCounter
                      label="URL Toko Resmi (https://)"
                      value={storeUrl}
                      max={300}
                      htmlFor="storeUrl"
                      hint="Tampil di: Seluruh tombol Toko Shopee di Navbar, Beranda, Tentang Kami, Artikel, dan Footer."
                    />
                    <input
                      id="storeUrl"
                      type="url"
                      value={storeUrl}
                      onChange={(e) =>
                        updateNestedField("officialStore", "url", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("officialStore.url")}
                    {storeUrl && !isShopeeHost(storeUrl) && (
                      <p className="mt-1 text-xs font-medium text-[#8A5A00]">
                        Catatan: Host URL ini bukan domain Shopee standar
                        (shopee.co.id / shp.ee / id.shp.ee).
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Nomor WhatsApp &amp; Kontak
                </h2>
                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-semibold text-[#143D29]"
                  >
                    Nomor WhatsApp (hanya angka, format internasional tanpa +)
                  </label>
                  <p className="mt-0.5 text-xs text-[#43594D]">
                    Tampil di: Tombol melayang WhatsApp, Footer, dan semua tombol konsultasi WhatsApp.
                  </p>
                  <input
                    id="whatsappNumber"
                    type="text"
                    inputMode="numeric"
                    value={waVal}
                    onChange={(e) =>
                      updateField("whatsappNumber", e.target.value)
                    }
                    placeholder="Contoh: 6281234567890"
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 font-mono text-sm"
                  />
                  {renderError("whatsappNumber")}
                  <p className="mt-1.5 text-xs text-[#43594D]">
                    Pratinjau tautan:{" "}
                    {waHref ? (
                      <span className="font-mono font-semibold text-[#15803D]">
                        {waHref}
                      </span>
                    ) : (
                      <span className="font-semibold text-[#8A5A00]">
                        Tombol WhatsApp akan tampil sebagai placeholder &quot;[ISI:
                        nomor WhatsApp]&quot; tanpa tautan.
                      </span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Alamat / Wilayah Layanan"
                      value={getStr(contact, "address")}
                      max={250}
                      htmlFor="contactAddress"
                      required={false}
                      hint="Tampil di: Footer, bagian kontak (kosongkan jika tidak ingin ditampilkan)."
                    />
                    <input
                      id="contactAddress"
                      type="text"
                      value={getStr(contact, "address")}
                      onChange={(e) =>
                        updateNestedField("contact", "address", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("contact.address")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Keterangan Layanan Telepon"
                      value={getStr(contact, "phone")}
                      max={120}
                      htmlFor="contactPhone"
                      required={false}
                      hint="Tampil di: Footer, bagian kontak (kosongkan jika tidak ingin ditampilkan)."
                    />
                    <input
                      id="contactPhone"
                      type="text"
                      value={getStr(contact, "phone")}
                      onChange={(e) =>
                        updateNestedField("contact", "phone", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("contact.phone")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Keterangan Email / Layanan"
                      value={getStr(contact, "email")}
                      max={120}
                      htmlFor="contactEmail"
                      required={false}
                      hint="Tampil di: Footer, bagian kontak (kosongkan jika tidak ingin ditampilkan)."
                    />
                    <input
                      id="contactEmail"
                      type="text"
                      value={getStr(contact, "email")}
                      onChange={(e) =>
                        updateNestedField("contact", "email", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("contact.email")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Jam Operasional"
                      value={getStr(contact, "operatingHours")}
                      max={100}
                      htmlFor="contactHours"
                      required={false}
                      hint="Tampil di: Footer, bagian kontak (kosongkan jika tidak ingin ditampilkan)."
                    />
                    <input
                      id="contactHours"
                      type="text"
                      value={getStr(contact, "operatingHours")}
                      onChange={(e) =>
                        updateNestedField(
                          "contact",
                          "operatingHours",
                          e.target.value
                        )
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("contact.operatingHours")}
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

        {/* HERO BLOCK */}
        {blockKey === "hero" && (() => {
          const badgeLeft = getObj(formVal, "overlayBadgeLeft");
          const badgeRight = getObj(formVal, "overlayBadgeRight");
          const heroImg = getStr(formVal, "imageSrc");

          return (
            <div className="space-y-6">
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Teks Utama Hero
                </h2>
                <div>
                  <FieldCounter
                    label="Eyebrow (Teks kecil di atas judul)"
                    value={getStr(formVal, "eyebrow")}
                    max={100}
                    htmlFor="heroEyebrow"
                    hint="Tampil di: Hero beranda, label pill di atas judul utama."
                  />
                  <input
                    id="heroEyebrow"
                    type="text"
                    value={getStr(formVal, "eyebrow")}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("eyebrow")}
                </div>
                <div>
                  <FieldCounter
                    label="Judul Utama (Sorotan Hijau)"
                    value={getStr(formVal, "headlineAccent")}
                    max={100}
                    htmlFor="headlineAccent"
                    hint="Tampil di: Hero beranda, baris terakhir judul utama H1 bergaris bawah hijau."
                  />
                  <input
                    id="headlineAccent"
                    type="text"
                    value={getStr(formVal, "headlineAccent")}
                    onChange={(e) =>
                      updateField("headlineAccent", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("headlineAccent")}
                </div>
                <div>
                  <FieldCounter
                    label="Subjudul"
                    value={getStr(formVal, "subheadline")}
                    max={350}
                    htmlFor="subheadline"
                    hint="Tampil di: Hero beranda, paragraf pengantar di bawah judul H1."
                  />
                  <textarea
                    id="subheadline"
                    rows={3}
                    value={getStr(formVal, "subheadline")}
                    onChange={(e) => updateField("subheadline", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("subheadline")}
                </div>
                {(() => {
                  const primaryCtaVal: HeroCtaButton =
                    formVal.primaryCta &&
                    typeof formVal.primaryCta === "object" &&
                    !Array.isArray(formVal.primaryCta)
                      ? (formVal.primaryCta as HeroCtaButton)
                      : {
                          ...DEFAULT_PRIMARY_CTA,
                          label:
                            getStr(formVal, "primaryCtaLabel") ||
                            DEFAULT_PRIMARY_CTA.label,
                        };
                  const secondaryCtaVal: HeroCtaButton =
                    formVal.secondaryCta &&
                    typeof formVal.secondaryCta === "object" &&
                    !Array.isArray(formVal.secondaryCta)
                      ? (formVal.secondaryCta as HeroCtaButton)
                      : {
                          ...DEFAULT_SECONDARY_CTA,
                          label:
                            getStr(formVal, "secondaryCtaLabel") ||
                            DEFAULT_SECONDARY_CTA.label,
                        };
                  const waNum =
                    companyContext?.whatsappNumber ?? SITE_DATA.whatsappNumber;
                  const shopeeUrl =
                    companyContext?.shopeeStoreUrl ??
                    SITE_DATA.officialStore.url;

                  return (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <CtaButtonEditor
                        idPrefix="hero-primary-cta"
                        heading="Tombol Utama (Hijau)"
                        value={primaryCtaVal}
                        allowDisable={false}
                        whatsappNumber={waNum}
                        shopeeStoreUrl={shopeeUrl}
                        labelError={fieldErrors["primaryCta.label"]}
                        targetError={fieldErrors["primaryCta.target"]}
                        enabledError={fieldErrors["primaryCta.enabled"]}
                        iconError={fieldErrors["primaryCta.icon"]}
                        onChange={(next) => {
                          setFormVal((prev) => ({
                            ...prev,
                            primaryCta: next,
                            primaryCtaLabel: next.label,
                          }));
                          setIsDirty(true);
                          setSuccessMessage(null);
                        }}
                      />
                      <CtaButtonEditor
                        idPrefix="hero-secondary-cta"
                        heading="Tombol Kedua (Oranye)"
                        value={secondaryCtaVal}
                        allowDisable
                        whatsappNumber={waNum}
                        shopeeStoreUrl={shopeeUrl}
                        labelError={fieldErrors["secondaryCta.label"]}
                        targetError={fieldErrors["secondaryCta.target"]}
                        enabledError={fieldErrors["secondaryCta.enabled"]}
                        iconError={fieldErrors["secondaryCta.icon"]}
                        onChange={(next) => {
                          setFormVal((prev) => ({
                            ...prev,
                            secondaryCta: next,
                            secondaryCtaLabel: next.label,
                          }));
                          setIsDirty(true);
                          setSuccessMessage(null);
                        }}
                      />
                    </div>
                  );
                })()}
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Gambar Hero
                </h2>
                {(() => {
                  const trimmedHeroImg = heroImg.trim();
                  const hasCustomImage =
                    trimmedHeroImg.length > 0 &&
                    trimmedHeroImg !== SITE_DATA.hero.imageSrc;
                  const previewSrc =
                    trimmedHeroImg.length > 0
                      ? trimmedHeroImg
                      : SITE_DATA.hero.imageSrc;
                  const previewAlt =
                    getStr(formVal, "imageAlt").trim() ||
                    SITE_DATA.hero.imageAlt;

                  return (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="space-y-3">
                        <ImageUploadControl
                          isUploading={isUploading}
                          onFileChange={handleHeroImageUpload}
                          hasCustomImage={hasCustomImage}
                          allowRemove
                          onRequestRemove={() => setShowRemoveImageModal(true)}
                        />
                        {uploadError && (
                          <p
                            role="alert"
                            className="text-xs font-medium text-[#B91C1C]"
                          >
                            {uploadError}
                          </p>
                        )}
                        <div>
                          <label
                            htmlFor="heroImageSrc"
                            className="block text-xs font-semibold text-[#143D29]"
                          >
                            URL / Path Gambar{" "}
                            {hasCustomImage && (
                              <span className="text-[#B91C1C]">*</span>
                            )}
                          </label>
                          <p className="mt-0.5 text-xs text-[#43594D]">
                            Tampil di: Hero beranda, foto utama sisi kanan
                            (desktop) &amp; atas (mobile), serta gambar Open
                            Graph. Kosongkan untuk memakai gambar bawaan.
                          </p>
                          <input
                            id="heroImageSrc"
                            type="text"
                            value={heroImg}
                            onChange={(e) =>
                              updateField("imageSrc", e.target.value)
                            }
                            placeholder={SITE_DATA.hero.imageSrc}
                            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-xs"
                          />
                          {renderError("imageSrc")}
                        </div>
                        <div>
                          <FieldCounter
                            label="Teks Alternatif (Alt) Gambar"
                            value={getStr(formVal, "imageAlt")}
                            max={250}
                            htmlFor="heroImageAlt"
                            required={trimmedHeroImg.length > 0}
                            hint={
                              trimmedHeroImg.length > 0
                                ? "Tampil di: Atribut alt foto hero untuk aksesibilitas dan SEO."
                                : "Kosongkan untuk memakai teks alternatif bawaan."
                            }
                          />
                          <input
                            id="heroImageAlt"
                            type="text"
                            value={getStr(formVal, "imageAlt")}
                            onChange={(e) =>
                              updateField("imageAlt", e.target.value)
                            }
                            placeholder={SITE_DATA.hero.imageAlt}
                            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                          />
                          {renderError("imageAlt")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#CBD8D0] bg-[#EEF3EF]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewSrc}
                            alt={previewAlt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {!hasCustomImage && (
                          <span className="inline-flex items-center rounded-full border border-[#BFE3CC] bg-[#E8F3EC] px-3 py-1 text-xs font-semibold text-[#14532D]">
                            Memakai gambar bawaan
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  Lencana Gelap di Sudut Gambar Hero
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4">
                    <p className="text-xs font-bold text-[#143D29]">Lencana Kiri</p>
                    <FieldCounter
                      label="Judul"
                      value={getStr(badgeLeft, "title")}
                      max={80}
                      htmlFor="blTitle"
                      hint="Tampil di: Hero beranda, kolom kiri kartu gelap pada foto."
                    />
                    <input
                      id="blTitle"
                      type="text"
                      value={getStr(badgeLeft, "title")}
                      onChange={(e) =>
                        updateNestedField("overlayBadgeLeft", "title", e.target.value)
                      }
                      className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    />
                    {renderError("overlayBadgeLeft.title")}
                    <FieldCounter
                      label="Deskripsi"
                      value={getStr(badgeLeft, "description")}
                      max={200}
                      htmlFor="blDesc"
                      hint="Tampil di: Hero beranda, keterangan kolom kiri kartu gelap."
                    />
                    <textarea
                      id="blDesc"
                      rows={2}
                      value={getStr(badgeLeft, "description")}
                      onChange={(e) =>
                        updateNestedField(
                          "overlayBadgeLeft",
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    />
                    {renderError("overlayBadgeLeft.description")}
                  </div>

                  <div className="space-y-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4">
                    <p className="text-xs font-bold text-[#143D29]">Lencana Kanan</p>
                    <FieldCounter
                      label="Judul"
                      value={getStr(badgeRight, "title")}
                      max={80}
                      htmlFor="brTitle"
                      hint="Tampil di: Hero beranda, kolom kanan kartu gelap pada foto."
                    />
                    <input
                      id="brTitle"
                      type="text"
                      value={getStr(badgeRight, "title")}
                      onChange={(e) =>
                        updateNestedField("overlayBadgeRight", "title", e.target.value)
                      }
                      className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    />
                    {renderError("overlayBadgeRight.title")}
                    <FieldCounter
                      label="Deskripsi"
                      value={getStr(badgeRight, "description")}
                      max={200}
                      htmlFor="brDesc"
                      hint="Tampil di: Hero beranda, keterangan kolom kanan kartu gelap."
                    />
                    <textarea
                      id="brDesc"
                      rows={2}
                      value={getStr(badgeRight, "description")}
                      onChange={(e) =>
                        updateNestedField(
                          "overlayBadgeRight",
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    />
                    {renderError("overlayBadgeRight.description")}
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

        {/* CATEGORY SHOWCASE BLOCK */}
        {blockKey === "category_showcase" && (
          <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
            <div>
              <FieldCounter
                label="Label Pill"
                value={getStr(formVal, "pill")}
                max={60}
                htmlFor="csPill"
                hint="Tampil di: Bagian Kategori Produk (#produk), label pill di kolom kiri."
              />
              <input
                id="csPill"
                type="text"
                value={getStr(formVal, "pill")}
                onChange={(e) => updateField("pill", e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
              {renderError("pill")}
            </div>
            <div>
              <FieldCounter
                label="Judul Bagian"
                value={getStr(formVal, "heading")}
                max={140}
                htmlFor="csHeading"
                hint="Tampil di: Bagian Kategori Produk (#produk), judul H2 di kolom kiri."
              />
              <input
                id="csHeading"
                type="text"
                value={getStr(formVal, "heading")}
                onChange={(e) => updateField("heading", e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
              {renderError("heading")}
            </div>
            <div>
              <FieldCounter
                label="Deskripsi Pengantar"
                value={getStr(formVal, "description")}
                max={350}
                htmlFor="csDesc"
                hint="Tampil di: Bagian Kategori Produk (#produk), teks pengantar di bawah judul."
              />
              <textarea
                id="csDesc"
                rows={3}
                value={getStr(formVal, "description")}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
              />
              {renderError("description")}
            </div>
            <div>
              <FieldCounter
                label="Label Tautan Semua Produk"
                value={getStr(formVal, "ctaLabel")}
                max={60}
                htmlFor="csCta"
                hint="Tampil di: Bagian Kategori Produk (#produk), tautan menuju Toko Shopee."
              />
              <input
                id="csCta"
                type="text"
                value={getStr(formVal, "ctaLabel")}
                onChange={(e) => updateField("ctaLabel", e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
              {renderError("ctaLabel")}
            </div>
          </section>
        )}

        {/* ABOUT BLOCK */}
        {blockKey === "about" && (() => {
          const aboutImg = getStr(formVal, "imageSrc");
          const trimmedAboutImg = aboutImg.trim();
          const hasCustomAboutImage =
            trimmedAboutImg.length > 0 &&
            trimmedAboutImg !== DEFAULT_ABOUT_IMAGE_SRC;
          const previewAboutSrc =
            trimmedAboutImg.length > 0
              ? trimmedAboutImg
              : DEFAULT_ABOUT_IMAGE_SRC;
          const previewAboutAlt =
            getStr(formVal, "imageAlt").trim() || DEFAULT_ABOUT_IMAGE_ALT;

          const imageBadge = getObj(formVal, "imageBadge");
          const badgeEnabled = imageBadge.enabled !== false;

          const commitParagraphs = getArr<string>(
            formVal,
            "commitmentParagraphs"
          );
          const commitCards = getArr<Record<string, unknown>>(
            formVal,
            "commitmentCards"
          );
          const misiList = getArr<string>(formVal, "misi");
          const historyList = getArr<Record<string, unknown>>(
            formVal,
            "historySteps"
          );
          const whyList = getArr<Record<string, unknown>>(
            formVal,
            "whyChooseUs"
          );

          return (
            <div className="space-y-6">
              {/* 1. Judul Bagian */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  1. Judul Bagian
                </h2>
                <div>
                  <FieldCounter
                    label="Label Bagian (Eyebrow)"
                    value={getStr(formVal, "eyebrow")}
                    max={60}
                    htmlFor="aboutEyebrow"
                    hint="Tampil di: Beranda, bagian Tentang Kami, label pill kecil di atas judul utama."
                  />
                  <input
                    id="aboutEyebrow"
                    type="text"
                    value={getStr(formVal, "eyebrow")}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("eyebrow")}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Judul Utama (Teks Biasa)"
                      value={getStr(formVal, "headingMain")}
                      max={80}
                      htmlFor="aboutHeadingMain"
                      hint="Tampil di: Beranda, bagian Tentang Kami, bagian awal judul utama H2."
                    />
                    <input
                      id="aboutHeadingMain"
                      type="text"
                      value={getStr(formVal, "headingMain")}
                      onChange={(e) =>
                        updateField("headingMain", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("headingMain")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Utama (Teks Beraksen Hijau)"
                      value={getStr(formVal, "headingAccent")}
                      max={80}
                      htmlFor="aboutHeadingAccent"
                      hint="Tampil di: Beranda, bagian Tentang Kami, teks hijau bergaris bawah di akhir judul utama H2."
                    />
                    <input
                      id="aboutHeadingAccent"
                      type="text"
                      value={getStr(formVal, "headingAccent")}
                      onChange={(e) =>
                        updateField("headingAccent", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("headingAccent")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Subjudul / Ringkasan Bagian"
                    value={getStr(formVal, "subheading")}
                    max={350}
                    htmlFor="aboutSubheading"
                    hint="Tampil di: Beranda, bagian Tentang Kami, paragraf pengantar di bawah judul utama."
                  />
                  <textarea
                    id="aboutSubheading"
                    rows={3}
                    value={getStr(formVal, "subheading")}
                    onChange={(e) => updateField("subheading", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("subheading")}
                </div>
              </section>

              {/* 2. Gambar dan Kartu di Atas Gambar */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  2. Gambar &amp; Kartu di Atas Gambar
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <ImageUploadControl
                      isUploading={isUploading}
                      onFileChange={handleHeroImageUpload}
                      hasCustomImage={hasCustomAboutImage}
                      allowRemove
                      onRequestRemove={() => setShowRemoveImageModal(true)}
                    />
                    {uploadError && (
                      <p
                        role="alert"
                        className="text-xs font-medium text-[#B91C1C]"
                      >
                        {uploadError}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="aboutImageSrc"
                        className="block text-xs font-semibold text-[#143D29]"
                      >
                        URL / Path Gambar{" "}
                        {hasCustomAboutImage && (
                          <span className="text-[#B91C1C]">*</span>
                        )}
                      </label>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Tentang Kami, foto kolase di
                        sisi kiri bagian atas. Kosongkan untuk memakai gambar
                        bawaan.
                      </p>
                      <input
                        id="aboutImageSrc"
                        type="text"
                        value={aboutImg}
                        onChange={(e) =>
                          updateField("imageSrc", e.target.value)
                        }
                        placeholder={DEFAULT_ABOUT_IMAGE_SRC}
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-xs"
                      />
                      {renderError("imageSrc")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Teks Alternatif (Alt) Gambar"
                        value={getStr(formVal, "imageAlt")}
                        max={250}
                        htmlFor="aboutImageAlt"
                        required={trimmedAboutImg.length > 0}
                        hint={
                          trimmedAboutImg.length > 0
                            ? "Tampil di: Beranda, bagian Tentang Kami, atribut alt foto kolase untuk aksesibilitas."
                            : "Tampil di: Beranda, bagian Tentang Kami, atribut alt foto kolase (kosongkan untuk memakai bawaan)."
                        }
                      />
                      <input
                        id="aboutImageAlt"
                        type="text"
                        value={getStr(formVal, "imageAlt")}
                        onChange={(e) =>
                          updateField("imageAlt", e.target.value)
                        }
                        placeholder={DEFAULT_ABOUT_IMAGE_ALT}
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("imageAlt")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#CBD8D0] bg-[#EEF3EF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewAboutSrc}
                        alt={previewAboutAlt}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    {!hasCustomAboutImage && (
                      <span className="inline-flex items-center rounded-full border border-[#BFE3CC] bg-[#E8F3EC] px-3 py-1 text-xs font-semibold text-[#14532D]">
                        Memakai gambar bawaan
                      </span>
                    )}
                  </div>
                </div>

                {/* Overlay badge card */}
                <div className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F1F17]">
                        Kartu Gelap di Sudut Gambar
                      </h3>
                      <p className="text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Tentang Kami, kartu hijau
                        gelap mengambang di pojok kiri bawah gambar.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#143D29]">
                      <input
                        type="checkbox"
                        checked={badgeEnabled}
                        onChange={(e) =>
                          updateNestedField(
                            "imageBadge",
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-[#CBD8D0] accent-[#15803D]"
                      />
                      <span>Tampilkan kartu di atas gambar</span>
                    </label>
                  </div>
                  {badgeEnabled && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <FieldCounter
                          label="Judul Kartu"
                          value={getStr(
                            imageBadge,
                            "title",
                            DEFAULT_ABOUT_IMAGE_BADGE.title
                          )}
                          max={80}
                          htmlFor="aboutBadgeTitle"
                          hint="Tampil di: Beranda, bagian Tentang Kami, judul kartu gelap di sudut gambar."
                        />
                        <input
                          id="aboutBadgeTitle"
                          type="text"
                          value={getStr(imageBadge, "title")}
                          onChange={(e) =>
                            updateNestedField(
                              "imageBadge",
                              "title",
                              e.target.value
                            )
                          }
                          className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                        />
                        {renderError("imageBadge.title")}
                      </div>
                      <IconSelectField
                        id="aboutBadgeIcon"
                        label="Ikon Kartu"
                        value={getStr(
                          imageBadge,
                          "icon",
                          DEFAULT_ABOUT_IMAGE_BADGE.icon
                        )}
                        onChange={(val) =>
                          updateNestedField("imageBadge", "icon", val)
                        }
                      />
                      <div className="sm:col-span-2">
                        <FieldCounter
                          label="Deskripsi Kartu"
                          value={getStr(imageBadge, "description")}
                          max={200}
                          htmlFor="aboutBadgeDesc"
                          hint="Tampil di: Beranda, bagian Tentang Kami, teks ringkas kartu gelap di sudut gambar."
                        />
                        <textarea
                          id="aboutBadgeDesc"
                          rows={2}
                          value={getStr(imageBadge, "description")}
                          onChange={(e) =>
                            updateNestedField(
                              "imageBadge",
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                        />
                        {renderError("imageBadge.description")}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 3. Profil dan Komitmen */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  3. Tab Profil &amp; Komitmen
                </h2>
                <div>
                  <FieldCounter
                    label="Label Tab Profil & Komitmen"
                    value={getStr(formVal, "profileTabLabel")}
                    max={40}
                    htmlFor="aboutProfileTabLabel"
                    hint="Tampil di: Beranda, bagian Tentang Kami, tombol tab pertama."
                  />
                  <input
                    id="aboutProfileTabLabel"
                    type="text"
                    value={getStr(formVal, "profileTabLabel")}
                    onChange={(e) =>
                      updateField("profileTabLabel", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("profileTabLabel")}
                </div>

                {/* Commitment Paragraphs (0-3) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-[#143D29]">
                        Paragraf Komitmen (0–3)
                      </span>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Tentang Kami, paragraf isi di
                        dalam tab Profil &amp; Komitmen. Kosongkan jika ingin
                        disembunyikan.
                      </p>
                    </div>
                    {commitParagraphs.length < 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("commitmentParagraphs", [
                            ...commitParagraphs,
                            "",
                          ])
                        }
                        className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                      >
                        + Tambah Paragraf
                      </button>
                    )}
                  </div>
                  {renderError("commitmentParagraphs")}
                  {commitParagraphs.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <textarea
                        rows={3}
                        aria-label={`Paragraf komitmen ${idx + 1}`}
                        value={p}
                        onChange={(e) => {
                          const next = [...commitParagraphs];
                          next[idx] = e.target.value;
                          updateField("commitmentParagraphs", next);
                        }}
                        className="w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() =>
                            moveItem("commitmentParagraphs", idx, -1)
                          }
                          aria-label={`Geser paragraf ${idx + 1} ke atas`}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === commitParagraphs.length - 1}
                          onClick={() =>
                            moveItem("commitmentParagraphs", idx, 1)
                          }
                          aria-label={`Geser paragraf ${idx + 1} ke bawah`}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowDown
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "commitmentParagraphs",
                              commitParagraphs.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Hapus paragraf ${idx + 1}`}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] text-[#991B1B]"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Commitment Cards (0-2) */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-[#143D29]">
                        Kartu Komitmen (0–2 kartu)
                      </span>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Tentang Kami, 2 kartu putih
                        di bawah paragraf tab Profil &amp; Komitmen.
                      </p>
                    </div>
                    {commitCards.length < 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("commitmentCards", [
                            ...commitCards,
                            {
                              id: `commit-${Date.now()}`,
                              badge: "",
                              title: "",
                              description: "",
                              icon: "CheckCircle2",
                            },
                          ])
                        }
                        className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-3 py-1.5 text-xs font-semibold text-[#143D29]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Tambah Kartu</span>
                      </button>
                    )}
                  </div>
                  {renderError("commitmentCards")}
                  {commitCards.map((card, idx) => (
                    <div
                      key={String(card.id ?? idx)}
                      className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#15803D]">
                          Kartu Komitmen #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() =>
                              moveItem("commitmentCards", idx, -1)
                            }
                            aria-label={`Geser kartu komitmen ${idx + 1} ke atas`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowUp
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            disabled={idx === commitCards.length - 1}
                            onClick={() =>
                              moveItem("commitmentCards", idx, 1)
                            }
                            aria-label={`Geser kartu komitmen ${idx + 1} ke bawah`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowDown
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "commitmentCards",
                                commitCards.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label={`Hapus kartu komitmen ${idx + 1}`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-white text-[#991B1B]"
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Label Pill Kecil (opsional)
                          </label>
                          <input
                            type="text"
                            value={getStr(card, "badge")}
                            onChange={(e) => {
                              const next = [...commitCards];
                              next[idx] = { ...card, badge: e.target.value };
                              updateField("commitmentCards", next);
                            }}
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                        </div>
                        <IconSelectField
                          id={`commit-icon-${idx}`}
                          label="Ikon"
                          value={getStr(card, "icon", "CheckCircle2")}
                          onChange={(iconVal) => {
                            const next = [...commitCards];
                            next[idx] = { ...card, icon: iconVal };
                            updateField("commitmentCards", next);
                          }}
                        />
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Judul Kartu
                          </label>
                          <input
                            type="text"
                            value={getStr(card, "title")}
                            onChange={(e) => {
                              const next = [...commitCards];
                              next[idx] = { ...card, title: e.target.value };
                              updateField("commitmentCards", next);
                            }}
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Deskripsi Kartu
                          </label>
                          <textarea
                            rows={2}
                            value={getStr(card, "description")}
                            onChange={(e) => {
                              const next = [...commitCards];
                              next[idx] = {
                                ...card,
                                description: e.target.value,
                              };
                              updateField("commitmentCards", next);
                            }}
                            className="mt-1 w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Visi dan Misi */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  4. Tab Visi &amp; Misi
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <FieldCounter
                      label="Label Tab Visi & Misi"
                      value={getStr(formVal, "visionMissionTabLabel")}
                      max={40}
                      htmlFor="aboutVmTabLabel"
                      hint="Tampil di: Beranda, bagian Tentang Kami, tombol tab kedua."
                    />
                    <input
                      id="aboutVmTabLabel"
                      type="text"
                      value={getStr(formVal, "visionMissionTabLabel")}
                      onChange={(e) =>
                        updateField("visionMissionTabLabel", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("visionMissionTabLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kotak Visi"
                      value={getStr(formVal, "visiHeading")}
                      max={40}
                      htmlFor="aboutVisiHeading"
                      hint="Tampil di: Beranda, bagian Tentang Kami, judul kecil di kotak Visi."
                    />
                    <input
                      id="aboutVisiHeading"
                      type="text"
                      value={getStr(formVal, "visiHeading")}
                      onChange={(e) =>
                        updateField("visiHeading", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("visiHeading")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kotak Misi"
                      value={getStr(formVal, "misiHeading")}
                      max={40}
                      htmlFor="aboutMisiHeading"
                      hint="Tampil di: Beranda, bagian Tentang Kami, judul kecil di kotak Misi."
                    />
                    <input
                      id="aboutMisiHeading"
                      type="text"
                      value={getStr(formVal, "misiHeading")}
                      onChange={(e) =>
                        updateField("misiHeading", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("misiHeading")}
                  </div>
                </div>

                {/* Visi (optional) */}
                <div>
                  <FieldCounter
                    label="Visi Perusahaan (opsional)"
                    value={getStr(formVal, "visi")}
                    max={400}
                    htmlFor="aboutVisi"
                    required={false}
                    hint="Tampil di: Beranda, bagian Tentang Kami, isi kotak Visi pada tab Visi & Misi. Kosongkan untuk menyembunyikan kotak Visi."
                  />
                  <textarea
                    id="aboutVisi"
                    rows={3}
                    value={getStr(formVal, "visi")}
                    onChange={(e) => updateField("visi", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("visi")}
                </div>

                {/* Misi (0-6) */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-[#143D29]">
                        Poin Misi (0–6)
                      </span>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Tentang Kami, daftar misi pada
                        tab Visi &amp; Misi. Kosongkan semua untuk
                        menyembunyikan kotak Misi.
                      </p>
                    </div>
                    {misiList.length < 6 && (
                      <button
                        type="button"
                        onClick={() => updateField("misi", [...misiList, ""])}
                        className="cursor-pointer text-xs font-semibold text-[#15803D] hover:underline"
                      >
                        + Tambah Misi
                      </button>
                    )}
                  </div>
                  {renderError("misi")}
                  <div className="mt-2 space-y-2">
                    {misiList.map((m, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          aria-label={`Misi ${idx + 1}`}
                          value={m}
                          onChange={(e) => {
                            const next = [...misiList];
                            next[idx] = e.target.value;
                            updateField("misi", next);
                          }}
                          className="min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveItem("misi", idx, -1)}
                          aria-label={`Geser misi ${idx + 1} ke atas`}
                          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === misiList.length - 1}
                          onClick={() => moveItem("misi", idx, 1)}
                          aria-label={`Geser misi ${idx + 1} ke bawah`}
                          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#CBD8D0] bg-white disabled:opacity-40"
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Hapus misi ${idx + 1}`}
                          onClick={() =>
                            updateField(
                              "misi",
                              misiList.filter((_, i) => i !== idx)
                            )
                          }
                          className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#E5B8B8] text-[#991B1B]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. Sejarah Perusahaan */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                      5. Tab Sejarah Perusahaan (0–4 tahap)
                    </h2>
                    <p className="mt-0.5 text-xs text-[#43594D]">
                      Tampil di: Beranda, bagian Tentang Kami, linimasa tahap
                      perkembangan pada tab Sejarah Perusahaan. Kosongkan semua
                      untuk menyembunyikan tab ini.
                    </p>
                  </div>
                  {historyList.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField("historySteps", [
                          ...historyList,
                          {
                            id: `hist-${Date.now()}`,
                            step: String(historyList.length + 1).padStart(
                              2,
                              "0"
                            ),
                            title: "",
                            description: "",
                          },
                        ])
                      }
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-3 py-1.5 text-xs font-semibold text-[#143D29]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tambah Tahap</span>
                    </button>
                  )}
                </div>
                <div>
                  <FieldCounter
                    label="Label Tab Sejarah"
                    value={getStr(formVal, "historyTabLabel")}
                    max={40}
                    htmlFor="aboutHistoryTabLabel"
                    hint="Tampil di: Beranda, bagian Tentang Kami, tombol tab ketiga."
                  />
                  <input
                    id="aboutHistoryTabLabel"
                    type="text"
                    value={getStr(formVal, "historyTabLabel")}
                    onChange={(e) =>
                      updateField("historyTabLabel", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("historyTabLabel")}
                </div>
                {renderError("historySteps")}
                <div className="space-y-3">
                  {historyList.map((item, idx) => (
                    <div
                      key={String(item.id ?? idx)}
                      className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#15803D]">
                          Tahap Sejarah #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveItem("historySteps", idx, -1)}
                            aria-label={`Geser tahap ${idx + 1} ke atas`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowUp
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            disabled={idx === historyList.length - 1}
                            onClick={() => moveItem("historySteps", idx, 1)}
                            aria-label={`Geser tahap ${idx + 1} ke bawah`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowDown
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "historySteps",
                                historyList.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label={`Hapus tahap ${idx + 1}`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-white text-[#991B1B]"
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Nomor / Kode
                          </label>
                          <input
                            type="text"
                            value={getStr(item, "step")}
                            onChange={(e) => {
                              const next = [...historyList];
                              next[idx] = { ...item, step: e.target.value };
                              updateField("historySteps", next);
                            }}
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Judul Tahap
                          </label>
                          <input
                            type="text"
                            value={getStr(item, "title")}
                            onChange={(e) => {
                              const next = [...historyList];
                              next[idx] = { ...item, title: e.target.value };
                              updateField("historySteps", next);
                            }}
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Deskripsi Tahap
                          </label>
                          <textarea
                            rows={2}
                            value={getStr(item, "description")}
                            onChange={(e) => {
                              const next = [...historyList];
                              next[idx] = {
                                ...item,
                                description: e.target.value,
                              };
                              updateField("historySteps", next);
                            }}
                            className="mt-1 w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Kartu Keunggulan */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                    6. Kartu Keunggulan (1–4 kartu)
                  </h2>
                  {whyList.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField("whyChooseUs", [
                          ...whyList,
                          {
                            id: `why-${Date.now()}`,
                            title: "",
                            description: "",
                            icon: "FlaskConical",
                          },
                        ])
                      }
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#EAF3EE] px-3 py-1.5 text-xs font-semibold text-[#143D29]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tambah Kartu</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Kecil Atas Keunggulan"
                      value={getStr(formVal, "whyChooseUsEyebrow")}
                      max={40}
                      htmlFor="whyEyebrow"
                      hint="Tampil di: Beranda, bagian Tentang Kami, label pill di atas judul blok hijau gelap."
                    />
                    <input
                      id="whyEyebrow"
                      type="text"
                      value={getStr(formVal, "whyChooseUsEyebrow")}
                      onChange={(e) =>
                        updateField("whyChooseUsEyebrow", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("whyChooseUsEyebrow")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Tombol Toko Shopee"
                      value={getStr(formVal, "whyChooseUsCtaLabel")}
                      max={50}
                      htmlFor="whyCtaLabel"
                      hint="Tampil di: Beranda, bagian Tentang Kami, tombol kanan atas di blok hijau gelap (tautan mengikuti URL Shopee di Identitas Perusahaan)."
                    />
                    <input
                      id="whyCtaLabel"
                      type="text"
                      value={getStr(formVal, "whyChooseUsCtaLabel")}
                      onChange={(e) =>
                        updateField("whyChooseUsCtaLabel", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("whyChooseUsCtaLabel")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Judul Bagian Keunggulan"
                    value={getStr(formVal, "whyChooseUsTitle")}
                    max={100}
                    htmlFor="whyTitle"
                    hint="Tampil di: Beranda, bagian Tentang Kami, judul blok hijau gelap Alasan Memilih Produk Kami."
                  />
                  <input
                    id="whyTitle"
                    type="text"
                    value={getStr(formVal, "whyChooseUsTitle")}
                    onChange={(e) =>
                      updateField("whyChooseUsTitle", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("whyChooseUsTitle")}
                </div>
                <p className="text-xs text-[#43594D]">
                  Tampil di: Beranda, bagian Tentang Kami, kartu keunggulan di
                  bawah judul blok hijau gelap.
                </p>
                {renderError("whyChooseUs")}
                <div className="space-y-3">
                  {whyList.map((item, idx) => (
                    <div
                      key={String(item.id ?? idx)}
                      className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#15803D]">
                          Keunggulan #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveItem("whyChooseUs", idx, -1)}
                            aria-label={`Geser keunggulan ${idx + 1} ke atas`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowUp
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            disabled={idx === whyList.length - 1}
                            onClick={() => moveItem("whyChooseUs", idx, 1)}
                            aria-label={`Geser keunggulan ${idx + 1} ke bawah`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white disabled:opacity-40"
                          >
                            <ArrowDown
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                          <button
                            type="button"
                            disabled={whyList.length <= 1}
                            onClick={() =>
                              updateField(
                                "whyChooseUs",
                                whyList.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label={`Hapus keunggulan ${idx + 1}`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-white text-[#991B1B] disabled:opacity-40"
                          >
                            <Trash2
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Judul
                          </label>
                          <input
                            type="text"
                            value={getStr(item, "title")}
                            onChange={(e) => {
                              const next = [...whyList];
                              next[idx] = { ...item, title: e.target.value };
                              updateField("whyChooseUs", next);
                            }}
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                        </div>
                        <IconSelectField
                          id={`why-icon-${idx}`}
                          label="Ikon"
                          value={getStr(item, "icon", "FlaskConical")}
                          onChange={(iconVal) => {
                            const next = [...whyList];
                            next[idx] = { ...item, icon: iconVal };
                            updateField("whyChooseUs", next);
                          }}
                        />
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-[#143D29]">
                            Deskripsi
                          </label>
                          <textarea
                            rows={2}
                            value={getStr(item, "description")}
                            onChange={(e) => {
                              const next = [...whyList];
                              next[idx] = {
                                ...item,
                                description: e.target.value,
                              };
                              updateField("whyChooseUs", next);
                            }}
                            className="mt-1 w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );
        })()}

        {/* TESTIMONIALS BLOCK */}
        {blockKey === "testimonials" && (
          <TestimonialsEditor
            formVal={formVal}
            updateField={updateField}
            fieldErrors={fieldErrors}
          />
        )}

        {/* NAVBAR BLOCK */}
        {blockKey === "navbar" && (
          <NavbarContentEditor
            formVal={formVal}
            updateField={updateField}
            setItems={(nextItems) => {
              setFormVal((prev) => ({ ...prev, items: nextItems }));
              setIsDirty(true);
            }}
            fieldErrors={fieldErrors}
            whatsappNumber={companyContext?.whatsappNumber ?? null}
          />
        )}

        {/* VIDEO SECTION BLOCK */}
        {blockKey === "video_section" && (
          <VideoSectionEditor
            formVal={formVal}
            updateField={updateField}
            fieldErrors={fieldErrors}
          />
        )}

        {/* VIDEO PAGE BLOCK */}
        {blockKey === "video_page" && (
          <VideoPageEditor
            formVal={formVal}
            updateField={updateField}
            fieldErrors={fieldErrors}
          />
        )}

        {/* ARTICLE HUB BLOCK */}
        {blockKey === "article_hub" && (() => {
          const allCtaRaw = getObj(formVal, "allArticlesCta");
          const allCtaVal: HeroCtaButton = {
            label: getStr(
              allCtaRaw,
              "label",
              DEFAULT_ARTICLE_HUB_ALL_CTA.label
            ),
            enabled:
              typeof allCtaRaw.enabled === "boolean"
                ? allCtaRaw.enabled
                : DEFAULT_ARTICLE_HUB_ALL_CTA.enabled,
            target:
              allCtaRaw.target &&
              typeof allCtaRaw.target === "object" &&
              typeof (allCtaRaw.target as { type?: unknown }).type ===
                "string" &&
              typeof (allCtaRaw.target as { value?: unknown }).value ===
                "string"
                ? (allCtaRaw.target as HeroCtaButton["target"])
                : { ...DEFAULT_ARTICLE_HUB_ALL_CTA.target },
          };
          const bannerImg = getStr(formVal, "bannerImageSrc");
          const hasBannerImg = bannerImg.trim().length > 0;
          const maxSec =
            typeof formVal.maxSecondaryArticles === "number"
              ? formVal.maxSecondaryArticles
              : DEFAULT_ARTICLE_HUB.maxSecondaryArticles;
          const waNum = companyContext?.whatsappNumber ?? null;
          const shopeeUrl =
            companyContext?.shopeeStoreUrl ?? SITE_DATA.officialStore.url;

          return (
            <div className="space-y-6">
              {/* 1. Judul Bagian */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  1. Judul Bagian
                </h2>
                <div>
                  <FieldCounter
                    label="Label Bagian (Eyebrow)"
                    value={getStr(formVal, "eyebrow")}
                    max={60}
                    htmlFor="ahEyebrow"
                    hint="Tampil di: Beranda, bagian Artikel Edukasi, label pill kecil di atas judul utama."
                  />
                  <input
                    id="ahEyebrow"
                    type="text"
                    value={getStr(formVal, "eyebrow")}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("eyebrow")}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <FieldCounter
                      label="Judul (Teks Awal)"
                      value={getStr(formVal, "headingMain")}
                      max={80}
                      htmlFor="ahHeadingMain"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, teks awal judul utama H2."
                    />
                    <input
                      id="ahHeadingMain"
                      type="text"
                      value={getStr(formVal, "headingMain")}
                      onChange={(e) =>
                        updateField("headingMain", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("headingMain")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul (Kotak Sorotan)"
                      value={getStr(formVal, "headingPill")}
                      max={60}
                      htmlFor="ahHeadingPill"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, teks dalam kotak hijau muda pada judul utama."
                    />
                    <input
                      id="ahHeadingPill"
                      type="text"
                      value={getStr(formVal, "headingPill")}
                      onChange={(e) =>
                        updateField("headingPill", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("headingPill")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul (Baris Hijau)"
                      value={getStr(formVal, "headingAccent")}
                      max={80}
                      htmlFor="ahHeadingAccent"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, baris kedua judul utama bergaris bawah hijau."
                    />
                    <input
                      id="ahHeadingAccent"
                      type="text"
                      value={getStr(formVal, "headingAccent")}
                      onChange={(e) =>
                        updateField("headingAccent", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("headingAccent")}
                  </div>
                </div>
              </section>

              {/* 2. Deskripsi */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  2. Deskripsi Bagian
                </h2>
                <div>
                  <FieldCounter
                    label="Deskripsi Singkat"
                    value={getStr(formVal, "description")}
                    max={300}
                    htmlFor="ahDesc"
                    hint="Tampil di: Beranda, bagian Artikel Edukasi, paragraf ringkas di bawah judul utama."
                  />
                  <textarea
                    id="ahDesc"
                    rows={3}
                    value={getStr(formVal, "description")}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("description")}
                </div>
              </section>

              {/* 3. Tombol dan Tautan */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-5">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  3. Tombol &amp; Pita Konsultasi
                </h2>
                <p className="text-xs text-[#43594D]">
                  Tampil di: Beranda, bagian Artikel Edukasi, tombol kanan atas
                  dan pita konsultasi bagian bawah.
                </p>
                <CtaButtonEditor
                  idPrefix="ah-all-cta"
                  heading="Tombol Lihat Semua Artikel (Kanan Atas)"
                  value={allCtaVal}
                  allowDisable
                  whatsappNumber={waNum}
                  shopeeStoreUrl={shopeeUrl}
                  labelError={fieldErrors["allArticlesCta.label"]}
                  targetError={fieldErrors["allArticlesCta.target"]}
                  enabledError={fieldErrors["allArticlesCta.enabled"]}
                  onChange={(next) => updateField("allArticlesCta", next)}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Pill Pita Konsultasi"
                      value={getStr(formVal, "bannerEyebrow")}
                      max={60}
                      htmlFor="ahBannerEyebrow"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, label pill hijau di atas judul pita konsultasi."
                    />
                    <input
                      id="ahBannerEyebrow"
                      type="text"
                      value={getStr(formVal, "bannerEyebrow")}
                      onChange={(e) =>
                        updateField("bannerEyebrow", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("bannerEyebrow")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Pita Konsultasi"
                      value={getStr(formVal, "bannerHeading")}
                      max={120}
                      htmlFor="ahBannerHeading"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, judul utama pita hijau gelap bagian bawah."
                    />
                    <input
                      id="ahBannerHeading"
                      type="text"
                      value={getStr(formVal, "bannerHeading")}
                      onChange={(e) =>
                        updateField("bannerHeading", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("bannerHeading")}
                  </div>
                  <div className="sm:col-span-2">
                    <FieldCounter
                      label="Deskripsi Pita Konsultasi"
                      value={getStr(formVal, "bannerDescription")}
                      max={240}
                      htmlFor="ahBannerDesc"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, paragraf di bawah judul pita konsultasi."
                    />
                    <textarea
                      id="ahBannerDesc"
                      rows={2}
                      value={getStr(formVal, "bannerDescription")}
                      onChange={(e) =>
                        updateField("bannerDescription", e.target.value)
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("bannerDescription")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kartu WhatsApp"
                      value={getStr(formVal, "whatsappCardTitle")}
                      max={60}
                      htmlFor="ahWaTitle"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, judul tombol kartu putih WhatsApp."
                    />
                    <input
                      id="ahWaTitle"
                      type="text"
                      value={getStr(formVal, "whatsappCardTitle")}
                      onChange={(e) =>
                        updateField("whatsappCardTitle", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("whatsappCardTitle")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Subjudul Kartu WhatsApp"
                      value={getStr(formVal, "whatsappCardSubtitle")}
                      max={80}
                      htmlFor="ahWaSub"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, teks kecil di bawah judul kartu WhatsApp."
                    />
                    <input
                      id="ahWaSub"
                      type="text"
                      value={getStr(formVal, "whatsappCardSubtitle")}
                      onChange={(e) =>
                        updateField("whatsappCardSubtitle", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("whatsappCardSubtitle")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kartu Shopee"
                      value={getStr(formVal, "shopeeCardTitle")}
                      max={60}
                      htmlFor="ahShopeeTitle"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, judul tombol kartu oranye Shopee."
                    />
                    <input
                      id="ahShopeeTitle"
                      type="text"
                      value={getStr(formVal, "shopeeCardTitle")}
                      onChange={(e) =>
                        updateField("shopeeCardTitle", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("shopeeCardTitle")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Subjudul Kartu Shopee"
                      value={getStr(formVal, "shopeeCardSubtitle")}
                      max={80}
                      htmlFor="ahShopeeSub"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, teks kecil di bawah judul kartu Shopee."
                    />
                    <input
                      id="ahShopeeSub"
                      type="text"
                      value={getStr(formVal, "shopeeCardSubtitle")}
                      onChange={(e) =>
                        updateField("shopeeCardSubtitle", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("shopeeCardSubtitle")}
                  </div>
                </div>
              </section>

              {/* 4. Label Kartu & Tampilan Daftar */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  4. Label Kartu &amp; Filter Kategori Artikel
                </h2>
                <div className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#0F1F17]">
                        Pengaturan Chip Filter Kategori
                      </p>
                      <p className="text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Artikel Edukasi, kapsul filter
                        topik di kanan deskripsi.
                      </p>
                    </div>
                    <Link
                      href={adminPath("/kategori-artikel")}
                      className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#143D29] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                    >
                      <span>Kelola Urutan &amp; Label Kategori</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FieldCounter
                        label="Label Filter Semua Topik"
                        value={getStr(formVal, "allTopicsLabel")}
                        max={40}
                        htmlFor="ahAllTopics"
                        hint="Tampil di: Beranda, tombol filter pertama pada kapsul topik."
                      />
                      <input
                        id="ahAllTopics"
                        type="text"
                        value={getStr(formVal, "allTopicsLabel")}
                        onChange={(e) =>
                          updateField("allTopicsLabel", e.target.value)
                        }
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                      />
                      {renderError("allTopicsLabel")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Label Tombol Luapan (Lainnya)"
                        value={getStr(formVal, "moreLabel", "Lainnya")}
                        max={30}
                        htmlFor="ahMoreLabel"
                        hint="Tampil di: Beranda, tombol menu dropdown bila kategori melebihi batas chip terlihat."
                      />
                      <input
                        id="ahMoreLabel"
                        type="text"
                        value={getStr(formVal, "moreLabel", "Lainnya")}
                        onChange={(e) =>
                          updateField("moreLabel", e.target.value)
                        }
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                      />
                      {renderError("moreLabel")}
                    </div>
                    <div>
                      <label
                        htmlFor="ahMaxChips"
                        className="block text-sm font-semibold text-[#143D29]"
                      >
                        Maksimal Chip Terlihat (3–12)
                      </label>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda (tablet/desktop), jumlah kategori
                        pertama sebelum masuk menu Lainnya.
                      </p>
                      <input
                        id="ahMaxChips"
                        type="number"
                        min={3}
                        max={12}
                        value={
                          typeof formVal.maxVisibleChips === "number"
                            ? formVal.maxVisibleChips
                            : 6
                        }
                        onChange={(e) =>
                          updateField(
                            "maxVisibleChips",
                            Number(e.target.value) || 6
                          )
                        }
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                      />
                      {renderError("maxVisibleChips")}
                    </div>
                    <div>
                      <label
                        htmlFor="ahOverflowMode"
                        className="block text-sm font-semibold text-[#143D29]"
                      >
                        Mode Luapan Kategori (Desktop/Tablet)
                      </label>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, perilaku filter bila jumlah kategori
                        melebihi batas.
                      </p>
                      <select
                        id="ahOverflowMode"
                        value={getStr(formVal, "overflowMode", "menu")}
                        onChange={(e) =>
                          updateField("overflowMode", e.target.value)
                        }
                        className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                      >
                        <option value="menu">
                          Menu &ldquo;Lainnya (N)&rdquo; (Direkomendasikan)
                        </option>
                        <option value="scroll">
                          Gulir mendatar satu baris
                        </option>
                      </select>
                      {renderError("overflowMode")}
                    </div>
                  </div>

                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#143D29]">
                    <input
                      type="checkbox"
                      checked={Boolean(formVal.showArticleCounts)}
                      onChange={(e) =>
                        updateField("showArticleCounts", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
                    />
                    <span>
                      Tampilkan jumlah artikel di setiap chip kategori (contoh:
                      Pembenah Tanah (2))
                    </span>
                  </label>

                  <p className="rounded-lg border border-[#C5E3CE] bg-white px-3 py-2 text-xs text-[#143D29]">
                    Menampilkan maksimal{" "}
                    <strong>
                      {typeof formVal.maxVisibleChips === "number"
                        ? formVal.maxVisibleChips
                        : 6}
                    </strong>{" "}
                    kategori pertama sebagai chip langsung; sisanya{" "}
                    {getStr(formVal, "overflowMode", "menu") === "menu"
                      ? `masuk menu "${getStr(formVal, "moreLabel", "Lainnya")}"`
                      : "dapat digulir mendatar dalam satu baris"}{" "}
                    (di layar HP selalu gulir mendatar satu baris).
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Lencana Artikel Utama"
                      value={getStr(formVal, "featuredBadgePrefix")}
                      max={40}
                      htmlFor="ahFeaturedPrefix"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, teks sebelum waktu baca pada kartu besar kiri."
                    />
                    <input
                      id="ahFeaturedPrefix"
                      type="text"
                      value={getStr(formVal, "featuredBadgePrefix")}
                      onChange={(e) =>
                        updateField("featuredBadgePrefix", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("featuredBadgePrefix")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Tautan Kartu Utama"
                      value={getStr(formVal, "featuredReadMoreLabel")}
                      max={50}
                      htmlFor="ahFeatRead"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, tautan baca di bagian bawah kartu besar kiri."
                    />
                    <input
                      id="ahFeatRead"
                      type="text"
                      value={getStr(formVal, "featuredReadMoreLabel")}
                      onChange={(e) =>
                        updateField("featuredReadMoreLabel", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("featuredReadMoreLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Tautan Kartu Samping"
                      value={getStr(formVal, "secondaryReadMoreLabel")}
                      max={50}
                      htmlFor="ahSecRead"
                      hint="Tampil di: Beranda, bagian Artikel Edukasi, tautan baca pada kartu artikel di kolom kanan."
                    />
                    <input
                      id="ahSecRead"
                      type="text"
                      value={getStr(formVal, "secondaryReadMoreLabel")}
                      onChange={(e) =>
                        updateField("secondaryReadMoreLabel", e.target.value)
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                    />
                    {renderError("secondaryReadMoreLabel")}
                  </div>
                  <div>
                    <label
                      htmlFor="ahMaxSec"
                      className="block text-sm font-semibold text-[#143D29]"
                    >
                      Jumlah Kartu Artikel Samping (1–3)
                    </label>
                    <p className="mt-0.5 text-xs text-[#43594D]">
                      Tampil di: Beranda, bagian Artikel Edukasi, jumlah kartu
                      artikel di kolom kanan (di luar kartu utama kiri).
                    </p>
                    <select
                      id="ahMaxSec"
                      value={maxSec}
                      onChange={(e) =>
                        updateField(
                          "maxSecondaryArticles",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                    >
                      <option value={1}>1 kartu samping</option>
                      <option value={2}>2 kartu samping</option>
                      <option value={3}>3 kartu samping (bawaan)</option>
                    </select>
                    {renderError("maxSecondaryArticles")}
                  </div>
                </div>
              </section>

              {/* 5. Teks Kosong / Hint */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  5. Teks Kondisi Kosong (Opsional)
                </h2>
                <div>
                  <FieldCounter
                    label="Pesan Saat Tidak Ada Artikel (opsional)"
                    value={getStr(formVal, "emptyStateText")}
                    max={240}
                    htmlFor="ahEmptyText"
                    required={false}
                    hint="Tampil di: Beranda, bagian Artikel Edukasi, hanya saat tidak ada artikel yang cocok atau tersedia (kosongkan agar tidak tampil)."
                  />
                  <input
                    id="ahEmptyText"
                    type="text"
                    value={getStr(formVal, "emptyStateText")}
                    onChange={(e) =>
                      updateField("emptyStateText", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("emptyStateText")}
                </div>
              </section>

              {/* 6. Gambar Tambahan (Opsional) */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  6. Gambar Dekoratif Pita Konsultasi (Opsional)
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <ImageUploadControl
                      isUploading={isUploading}
                      onFileChange={handleBannerImageUpload}
                      hasCustomImage={hasBannerImg}
                      allowRemove
                      onRequestRemove={() => setShowRemoveImageModal(true)}
                    />
                    {uploadError && (
                      <p
                        role="alert"
                        className="text-xs font-medium text-[#B91C1C]"
                      >
                        {uploadError}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="ahBannerImg"
                        className="block text-xs font-semibold text-[#143D29]"
                      >
                        URL / Path Gambar{" "}
                        {hasBannerImg && (
                          <span className="text-[#B91C1C]">*</span>
                        )}
                      </label>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Artikel Edukasi, gambar
                        aksen halus di latar pita konsultasi bawah (kosongkan
                        untuk memakai tampilan bawaan tanpa gambar).
                      </p>
                      <input
                        id="ahBannerImg"
                        type="text"
                        value={bannerImg}
                        onChange={(e) =>
                          updateField("bannerImageSrc", e.target.value)
                        }
                        placeholder="Kosongkan jika tanpa gambar tambahan"
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-xs"
                      />
                      {renderError("bannerImageSrc")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Teks Alternatif (Alt) Gambar"
                        value={getStr(formVal, "bannerImageAlt")}
                        max={250}
                        htmlFor="ahBannerAlt"
                        required={hasBannerImg}
                        hint="Tampil di: Beranda, bagian Artikel Edukasi, atribut alt gambar tambahan pita konsultasi."
                      />
                      <input
                        id="ahBannerAlt"
                        type="text"
                        value={getStr(formVal, "bannerImageAlt")}
                        onChange={(e) =>
                          updateField("bannerImageAlt", e.target.value)
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("bannerImageAlt")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {hasBannerImg ? (
                      <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#CBD8D0] bg-[#EEF3EF]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={bannerImg}
                          alt={
                            getStr(formVal, "bannerImageAlt").trim() ||
                            "Pratinjau gambar pita konsultasi"
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-[#CBD8D0] bg-[#F8FBF9] p-4 text-center text-xs text-[#43594D]">
                        Memakai tampilan bawaan (tanpa gambar tambahan).
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

        {/* ARTICLE PAGE (/artikel) BLOCK */}
        {blockKey === "article_page" && (() => {
          const ogImg = getStr(formVal, "ogImageSrc");
          const hasCustomOg = ogImg.trim().length > 0;
          const ogPreview = hasCustomOg ? ogImg : DEFAULT_ARTICLE_PAGE_OG_IMAGE;
          const promoPoints = getArr<string>(formVal, "sidebarPromoPoints");
          const sidebarTopics = getArr<string>(formVal, "sidebarTopics");

          return (
            <div className="space-y-6">
              {/* 1. SEO & OG */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  1. Metadata SEO &amp; Open Graph (/artikel)
                </h2>
                <div>
                  <FieldCounter
                    label="Judul SEO Halaman"
                    value={getStr(formVal, "seoTitle")}
                    max={60}
                    htmlFor="apSeoTitle"
                    hint="Tampil di: Halaman Artikel (/artikel), judul tab browser & hasil pencarian Google."
                  />
                  <input
                    id="apSeoTitle"
                    type="text"
                    value={getStr(formVal, "seoTitle")}
                    onChange={(e) => updateField("seoTitle", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("seoTitle")}
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Meta SEO"
                    value={getStr(formVal, "metaDescription")}
                    max={155}
                    htmlFor="apMetaDesc"
                    hint="Tampil di: Halaman Artikel (/artikel), cuplikan deskripsi di hasil pencarian & pratinjau tautan."
                  />
                  <textarea
                    id="apMetaDesc"
                    rows={2}
                    value={getStr(formVal, "metaDescription")}
                    onChange={(e) =>
                      updateField("metaDescription", e.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("metaDescription")}
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <ImageUploadControl
                      isUploading={isUploading}
                      onFileChange={handleFieldImageUpload("ogImageSrc")}
                      hasCustomImage={hasCustomOg}
                      allowRemove
                      onRequestRemove={() => setShowRemoveImageModal(true)}
                    />
                    {uploadError && (
                      <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                        {uploadError}
                      </p>
                    )}
                    <div>
                      <FieldCounter
                        label="URL Gambar Open Graph (Opsional)"
                        value={ogImg}
                        max={500}
                        required={false}
                        htmlFor="apOgSrc"
                        hint="Tampil di: Pratinjau saat tautan /artikel dibagikan (WhatsApp/media sosial). Kosongkan untuk gambar bawaan."
                      />
                      <input
                        id="apOgSrc"
                        type="text"
                        value={ogImg}
                        placeholder={DEFAULT_ARTICLE_PAGE_OG_IMAGE}
                        onChange={(e) =>
                          updateField("ogImageSrc", e.target.value)
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-xs"
                      />
                      {renderError("ogImageSrc")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Teks Alternatif Gambar OG"
                        value={getStr(formVal, "ogImageAlt")}
                        max={200}
                        required={hasCustomOg}
                        htmlFor="apOgAlt"
                        hint="Tampil di: Metadata Open Graph gambar halaman /artikel."
                      />
                      <input
                        id="apOgAlt"
                        type="text"
                        value={getStr(formVal, "ogImageAlt")}
                        placeholder={DEFAULT_ARTICLE_PAGE_OG_ALT}
                        onChange={(e) =>
                          updateField("ogImageAlt", e.target.value)
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("ogImageAlt")}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-[#143D29]">
                      Pratinjau Gambar Open Graph
                    </p>
                    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-[#CBD8D0] bg-[#EAF3EE]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ogPreview}
                        alt={getStr(formVal, "ogImageAlt") || DEFAULT_ARTICLE_PAGE_OG_ALT}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Breadcrumb & Page Hero */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  2. Breadcrumb &amp; Tajuk Halaman (/artikel)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Breadcrumb Beranda"
                      value={getStr(formVal, "breadcrumbHomeLabel")}
                      max={40}
                      htmlFor="apBreadHome"
                      hint="Tampil di: Halaman Artikel (/artikel), tautan pertama pada navigasi jejak."
                    />
                    <input
                      id="apBreadHome"
                      type="text"
                      value={getStr(formVal, "breadcrumbHomeLabel")}
                      onChange={(e) =>
                        updateField("breadcrumbHomeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("breadcrumbHomeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Breadcrumb Halaman Ini"
                      value={getStr(formVal, "breadcrumbCurrentLabel")}
                      max={50}
                      htmlFor="apBreadCur"
                      hint="Tampil di: Halaman Artikel (/artikel), teks aktif paling kanan pada navigasi jejak."
                    />
                    <input
                      id="apBreadCur"
                      type="text"
                      value={getStr(formVal, "breadcrumbCurrentLabel")}
                      onChange={(e) =>
                        updateField("breadcrumbCurrentLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("breadcrumbCurrentLabel")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Label Kecil Atas (Eyebrow)"
                    value={getStr(formVal, "eyebrow")}
                    max={60}
                    htmlFor="apEyebrow"
                    hint="Tampil di: Halaman Artikel (/artikel), lencana pil hijau di atas judul H1."
                  />
                  <input
                    id="apEyebrow"
                    type="text"
                    value={getStr(formVal, "eyebrow")}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("eyebrow")}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <FieldCounter
                      label="Judul Utama"
                      value={getStr(formVal, "headingMain")}
                      max={80}
                      htmlFor="apHeadMain"
                      hint="Tampil di: Halaman Artikel (/artikel), bagian awal H1."
                    />
                    <input
                      id="apHeadMain"
                      type="text"
                      value={getStr(formVal, "headingMain")}
                      onChange={(e) =>
                        updateField("headingMain", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("headingMain")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Sorotan Judul (Kotak)"
                      value={getStr(formVal, "headingPill")}
                      max={50}
                      htmlFor="apHeadPill"
                      hint="Tampil di: Halaman Artikel (/artikel), teks dalam kotak hijau muda."
                    />
                    <input
                      id="apHeadPill"
                      type="text"
                      value={getStr(formVal, "headingPill")}
                      onChange={(e) =>
                        updateField("headingPill", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("headingPill")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Baris Aksen Judul"
                      value={getStr(formVal, "headingAccent")}
                      max={60}
                      htmlFor="apHeadAcc"
                      hint="Tampil di: Halaman Artikel (/artikel), baris hijau dengan garis bawah."
                    />
                    <input
                      id="apHeadAcc"
                      type="text"
                      value={getStr(formVal, "headingAccent")}
                      onChange={(e) =>
                        updateField("headingAccent", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("headingAccent")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Pengantar Halaman"
                    value={getStr(formVal, "description")}
                    max={350}
                    htmlFor="apDesc"
                    hint="Tampil di: Halaman Artikel (/artikel), paragraf di bawah judul H1."
                  />
                  <textarea
                    id="apDesc"
                    rows={3}
                    value={getStr(formVal, "description")}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("description")}
                </div>
              </section>

              {/* 3. Search & Filter Chips */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                    3. Pencarian &amp; Filter Kategori (/artikel)
                  </h2>
                  <Link
                    href={adminPath("/kategori-artikel")}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-[#143D29] bg-[#F8FBF9] px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                  >
                    <span>Kelola Urutan &amp; Label Kategori</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div>
                  <FieldCounter
                    label="Placeholder Kolom Pencarian"
                    value={getStr(formVal, "searchPlaceholder")}
                    max={120}
                    htmlFor="apSearchPh"
                    hint="Tampil di: Halaman Artikel (/artikel), teks panduan di dalam kotak pencarian."
                  />
                  <input
                    id="apSearchPh"
                    type="text"
                    value={getStr(formVal, "searchPlaceholder")}
                    onChange={(e) =>
                      updateField("searchPlaceholder", e.target.value)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("searchPlaceholder")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Filter Semua Topik"
                      value={getStr(formVal, "allTopicsLabel")}
                      max={40}
                      htmlFor="apAllTopics"
                      hint="Tampil di: Halaman Artikel (/artikel), chip filter pertama."
                    />
                    <input
                      id="apAllTopics"
                      type="text"
                      value={getStr(formVal, "allTopicsLabel")}
                      onChange={(e) =>
                        updateField("allTopicsLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("allTopicsLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Tombol Luapan (Lainnya)"
                      value={getStr(formVal, "moreLabel", "Lainnya")}
                      max={30}
                      htmlFor="apMoreLabel"
                      hint="Tampil di: Halaman Artikel (/artikel), tombol dropdown bila kategori melebihi batas."
                    />
                    <input
                      id="apMoreLabel"
                      type="text"
                      value={getStr(formVal, "moreLabel", "Lainnya")}
                      onChange={(e) => updateField("moreLabel", e.target.value)}
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("moreLabel")}
                  </div>
                  <div>
                    <label
                      htmlFor="apMaxChips"
                      className="block text-sm font-semibold text-[#143D29]"
                    >
                      Maksimal Chip Terlihat (3–12)
                    </label>
                    <p className="mt-0.5 text-xs text-[#43594D]">
                      Tampil di: Halaman Artikel (/artikel), jumlah kategori
                      pertama di dock filter.
                    </p>
                    <input
                      id="apMaxChips"
                      type="number"
                      min={3}
                      max={12}
                      value={
                        typeof formVal.maxVisibleChips === "number"
                          ? formVal.maxVisibleChips
                          : 6
                      }
                      onChange={(e) =>
                        updateField(
                          "maxVisibleChips",
                          Number(e.target.value) || 6
                        )
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("maxVisibleChips")}
                  </div>
                  <div>
                    <label
                      htmlFor="apOverflowMode"
                      className="block text-sm font-semibold text-[#143D29]"
                    >
                      Mode Luapan Kategori (Desktop/Tablet)
                    </label>
                    <p className="mt-0.5 text-xs text-[#43594D]">
                      Tampil di: Halaman Artikel (/artikel), perilaku chip saat
                      kategori banyak.
                    </p>
                    <select
                      id="apOverflowMode"
                      value={getStr(formVal, "overflowMode", "menu")}
                      onChange={(e) =>
                        updateField("overflowMode", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    >
                      <option value="menu">
                        Menu &ldquo;Lainnya (N)&rdquo; (Direkomendasikan)
                      </option>
                      <option value="scroll">Gulir mendatar satu baris</option>
                    </select>
                    {renderError("overflowMode")}
                  </div>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#143D29]">
                  <input
                    type="checkbox"
                    checked={Boolean(formVal.showArticleCounts)}
                    onChange={(e) =>
                      updateField("showArticleCounts", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
                  />
                  <span>
                    Tampilkan jumlah artikel di setiap chip kategori
                  </span>
                </label>
                <p className="rounded-lg border border-[#C5E3CE] bg-[#F8FBF9] px-3 py-2 text-xs text-[#143D29]">
                  Menampilkan maksimal{" "}
                  <strong>
                    {typeof formVal.maxVisibleChips === "number"
                      ? formVal.maxVisibleChips
                      : 6}
                  </strong>{" "}
                  kategori pertama sebagai chip langsung; sisanya{" "}
                  {getStr(formVal, "overflowMode", "menu") === "menu"
                    ? `masuk menu "${getStr(formVal, "moreLabel", "Lainnya")}"`
                    : "dapat digulir mendatar dalam satu baris"}{" "}
                  (di layar HP selalu gulir mendatar satu baris).
                </p>
              </section>

              {/* 4. Cards & Empty State */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  4. Label Kartu Artikel &amp; Kondisi Kosong
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Lencana Kartu Pilihan"
                      value={getStr(formVal, "featuredBadgeLabel")}
                      max={40}
                      htmlFor="apFeatBadge"
                      hint="Tampil di: Halaman Artikel (/artikel), pil di pojok kiri atas foto artikel sorotan."
                    />
                    <input
                      id="apFeatBadge"
                      type="text"
                      value={getStr(formVal, "featuredBadgeLabel")}
                      onChange={(e) =>
                        updateField("featuredBadgeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("featuredBadgeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Tombol Baca Artikel Pilihan"
                      value={getStr(formVal, "featuredReadMoreLabel")}
                      max={50}
                      htmlFor="apFeatRead"
                      hint="Tampil di: Halaman Artikel (/artikel), tombol hijau di kartu sorotan utama."
                    />
                    <input
                      id="apFeatRead"
                      type="text"
                      value={getStr(formVal, "featuredReadMoreLabel")}
                      onChange={(e) =>
                        updateField("featuredReadMoreLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("featuredReadMoreLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Lencana Draft/Review"
                      value={getStr(formVal, "draftBadgeLabel")}
                      max={50}
                      htmlFor="apDraftBadge"
                      hint="Tampil di: Halaman Artikel (/artikel), lencana kuning untuk artikel berstatus review."
                    />
                    <input
                      id="apDraftBadge"
                      type="text"
                      value={getStr(formVal, "draftBadgeLabel")}
                      onChange={(e) =>
                        updateField("draftBadgeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("draftBadgeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Tautan Baca Kartu Artikel"
                      value={getStr(formVal, "cardReadMoreLabel")}
                      max={50}
                      htmlFor="apCardRead"
                      hint="Tampil di: Halaman Artikel (/artikel), tautan bawah di setiap kartu grid artikel."
                    />
                    <input
                      id="apCardRead"
                      type="text"
                      value={getStr(formVal, "cardReadMoreLabel")}
                      onChange={(e) =>
                        updateField("cardReadMoreLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("cardReadMoreLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Saat Filter Kosong"
                      value={getStr(formVal, "emptyTitle")}
                      max={100}
                      htmlFor="apEmptyTitle"
                      hint="Tampil di: Halaman Artikel (/artikel), judul kotak saat pencarian tidak cocok."
                    />
                    <input
                      id="apEmptyTitle"
                      type="text"
                      value={getStr(formVal, "emptyTitle")}
                      onChange={(e) =>
                        updateField("emptyTitle", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("emptyTitle")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Tombol Reset Pencarian"
                      value={getStr(formVal, "emptyResetLabel")}
                      max={60}
                      htmlFor="apEmptyReset"
                      hint="Tampil di: Halaman Artikel (/artikel), tombol reset di kotak filter kosong."
                    />
                    <input
                      id="apEmptyReset"
                      type="text"
                      value={getStr(formVal, "emptyResetLabel")}
                      onChange={(e) =>
                        updateField("emptyResetLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("emptyResetLabel")}
                  </div>
                </div>
              </section>

              {/* 5. Sidebar Cards */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  5. Bilah Samping Kanan (/artikel)
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Lencana Kartu Promo"
                      value={getStr(formVal, "sidebarPromoBadge")}
                      max={50}
                      htmlFor="apPromoBadge"
                      hint="Tampil di: Halaman Artikel (/artikel), pil atas kartu hijau gelap sisi kanan."
                    />
                    <input
                      id="apPromoBadge"
                      type="text"
                      value={getStr(formVal, "sidebarPromoBadge")}
                      onChange={(e) =>
                        updateField("sidebarPromoBadge", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sidebarPromoBadge")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kartu Promo"
                      value={getStr(formVal, "sidebarPromoTitle")}
                      max={100}
                      htmlFor="apPromoTitle"
                      hint="Tampil di: Halaman Artikel (/artikel), judul kartu hijau gelap sisi kanan."
                    />
                    <input
                      id="apPromoTitle"
                      type="text"
                      value={getStr(formVal, "sidebarPromoTitle")}
                      onChange={(e) =>
                        updateField("sidebarPromoTitle", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sidebarPromoTitle")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Kartu Promo"
                    value={getStr(formVal, "sidebarPromoDescription")}
                    max={240}
                    htmlFor="apPromoDesc"
                    hint="Tampil di: Halaman Artikel (/artikel), teks deskripsi kartu hijau gelap sisi kanan."
                  />
                  <textarea
                    id="apPromoDesc"
                    rows={2}
                    value={getStr(formVal, "sidebarPromoDescription")}
                    onChange={(e) =>
                      updateField("sidebarPromoDescription", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("sidebarPromoDescription")}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#143D29]">
                      Poin Keunggulan Kartu Promo (1–5 baris)
                    </span>
                    {promoPoints.length < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("sidebarPromoPoints", [...promoPoints, ""])
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#143D29] bg-[#EAF3EE] px-2.5 py-1 text-xs font-semibold text-[#143D29]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Tambah Poin</span>
                      </button>
                    )}
                  </div>
                  {renderError("sidebarPromoPoints")}
                  {promoPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) =>
                          updateField(
                            "sidebarPromoPoints",
                            promoPoints.map((old, i) =>
                              i === idx ? e.target.value : old
                            )
                          )
                        }
                        className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
                      />
                      {promoPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "sidebarPromoPoints",
                              promoPoints.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Hapus poin #${idx + 1}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FECACA] text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <FieldCounter
                    label="Label Tombol Shopee Kartu Promo"
                    value={getStr(formVal, "sidebarPromoButtonLabel")}
                    max={60}
                    htmlFor="apPromoBtn"
                    hint="Tampil di: Halaman Artikel (/artikel), tombol oranye di kartu promo sisi kanan."
                  />
                  <input
                    id="apPromoBtn"
                    type="text"
                    value={getStr(formVal, "sidebarPromoButtonLabel")}
                    onChange={(e) =>
                      updateField("sidebarPromoButtonLabel", e.target.value)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("sidebarPromoButtonLabel")}
                </div>

                <div className="border-t border-[#EBF2ED] pt-4 space-y-4">
                  <div>
                    <FieldCounter
                      label="Judul Kartu Topik Populer"
                      value={getStr(formVal, "sidebarTopicsTitle")}
                      max={80}
                      htmlFor="apTopicsTitle"
                      hint="Tampil di: Halaman Artikel (/artikel), kartu kedua bilah samping kanan."
                    />
                    <input
                      id="apTopicsTitle"
                      type="text"
                      value={getStr(formVal, "sidebarTopicsTitle")}
                      onChange={(e) =>
                        updateField("sidebarTopicsTitle", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sidebarTopicsTitle")}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#143D29]">
                        Daftar Tag Populer (maks 10)
                      </span>
                      {sidebarTopics.length < 10 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField("sidebarTopics", [...sidebarTopics, ""])
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-[#143D29] bg-[#EAF3EE] px-2.5 py-1 text-xs font-semibold text-[#143D29]"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Tambah Tag</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sidebarTopics.map((tag, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) =>
                              updateField(
                                "sidebarTopics",
                                sidebarTopics.map((old, i) =>
                                  i === idx ? e.target.value : old
                                )
                              )
                            }
                            className="min-h-[38px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateField(
                                "sidebarTopics",
                                sidebarTopics.filter((_, i) => i !== idx)
                              )
                            }
                            aria-label={`Hapus tag #${idx + 1}`}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#FECACA] text-[#B91C1C]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <FieldCounter
                        label="Teks Ajakan Konsultasi"
                        value={getStr(formVal, "sidebarConsultPrompt")}
                        max={120}
                        htmlFor="apConsultPrompt"
                        hint="Tampil di: Halaman Artikel (/artikel), di atas tombol WhatsApp sisi kanan."
                      />
                      <input
                        id="apConsultPrompt"
                        type="text"
                        value={getStr(formVal, "sidebarConsultPrompt")}
                        onChange={(e) =>
                          updateField("sidebarConsultPrompt", e.target.value)
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("sidebarConsultPrompt")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Label Tombol Konsultasi WhatsApp"
                        value={getStr(formVal, "sidebarConsultButtonLabel")}
                        max={60}
                        htmlFor="apConsultBtn"
                        hint="Tampil di: Halaman Artikel (/artikel), tombol WhatsApp di kartu topik populer."
                      />
                      <input
                        id="apConsultBtn"
                        type="text"
                        value={getStr(formVal, "sidebarConsultButtonLabel")}
                        onChange={(e) =>
                          updateField("sidebarConsultButtonLabel", e.target.value)
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("sidebarConsultButtonLabel")}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

        {/* ARTICLE DETAIL (/artikel/[slug]) BLOCK */}
        {blockKey === "article_detail" && (() => {
          const promoPoints = getArr<string>(formVal, "sidebarPromoPoints");
          return (
            <div className="space-y-6">
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  1. Navigasi &amp; Label Struktur Artikel (/artikel/[slug])
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Breadcrumb Beranda"
                      value={getStr(formVal, "breadcrumbHomeLabel")}
                      max={40}
                      htmlFor="adBreadHome"
                      hint="Tampil di: Halaman Baca Artikel, tautan pertama breadcrumb."
                    />
                    <input
                      id="adBreadHome"
                      type="text"
                      value={getStr(formVal, "breadcrumbHomeLabel")}
                      onChange={(e) =>
                        updateField("breadcrumbHomeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("breadcrumbHomeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Breadcrumb Pusat Artikel"
                      value={getStr(formVal, "breadcrumbHubLabel")}
                      max={50}
                      htmlFor="adBreadHub"
                      hint="Tampil di: Halaman Baca Artikel, tautan kedua breadcrumb."
                    />
                    <input
                      id="adBreadHub"
                      type="text"
                      value={getStr(formVal, "breadcrumbHubLabel")}
                      onChange={(e) =>
                        updateField("breadcrumbHubLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("breadcrumbHubLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Tombol Kembali ke Pusat Artikel"
                      value={getStr(formVal, "backToHubLabel")}
                      max={60}
                      htmlFor="adBackBtn"
                      hint="Tampil di: Halaman Baca Artikel, tombol kembali di bawah breadcrumb."
                    />
                    <input
                      id="adBackBtn"
                      type="text"
                      value={getStr(formVal, "backToHubLabel")}
                      onChange={(e) =>
                        updateField("backToHubLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("backToHubLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Lencana Draft/Review"
                      value={getStr(formVal, "draftBadgeLabel")}
                      max={50}
                      htmlFor="adDraftBadge"
                      hint="Tampil di: Halaman Baca Artikel, lencana kuning di baris kategori untuk artikel status review."
                    />
                    <input
                      id="adDraftBadge"
                      type="text"
                      value={getStr(formVal, "draftBadgeLabel")}
                      onChange={(e) =>
                        updateField("draftBadgeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("draftBadgeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Kecil Tiap Bagian Pembahasan"
                      value={getStr(formVal, "sectionEyebrow")}
                      max={60}
                      htmlFor="adSecEye"
                      hint="Tampil di: Halaman Baca Artikel, label di samping nomor 01, 02 pada setiap kartu bagian."
                    />
                    <input
                      id="adSecEye"
                      type="text"
                      value={getStr(formVal, "sectionEyebrow")}
                      onChange={(e) =>
                        updateField("sectionEyebrow", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sectionEyebrow")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kotak Poin Penting"
                      value={getStr(formVal, "sectionBulletsHeading")}
                      max={80}
                      htmlFor="adSecBullets"
                      hint="Tampil di: Halaman Baca Artikel, judul di atas daftar poin centang pada bagian."
                    />
                    <input
                      id="adSecBullets"
                      type="text"
                      value={getStr(formVal, "sectionBulletsHeading")}
                      onChange={(e) =>
                        updateField("sectionBulletsHeading", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sectionBulletsHeading")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kotak Daftar Isi"
                      value={getStr(formVal, "tocHeading")}
                      max={60}
                      htmlFor="adToc"
                      hint="Tampil di: Halaman Baca Artikel, judul kotak Daftar Isi di sisi kanan."
                    />
                    <input
                      id="adToc"
                      type="text"
                      value={getStr(formVal, "tocHeading")}
                      onChange={(e) => updateField("tocHeading", e.target.value)}
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("tocHeading")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Panduan Terkait"
                      value={getStr(formVal, "relatedHeading")}
                      max={60}
                      htmlFor="adRelated"
                      hint="Tampil di: Halaman Baca Artikel, judul daftar artikel terkait di bawah Daftar Isi."
                    />
                    <input
                      id="adRelated"
                      type="text"
                      value={getStr(formVal, "relatedHeading")}
                      onChange={(e) =>
                        updateField("relatedHeading", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("relatedHeading")}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  2. Banner CTA Bawah Artikel
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Lencana Banner CTA"
                      value={getStr(formVal, "bottomCtaBadge")}
                      max={60}
                      htmlFor="adCtaBadge"
                      hint="Tampil di: Halaman Baca Artikel, pil atas banner hijau di akhir artikel."
                    />
                    <input
                      id="adCtaBadge"
                      type="text"
                      value={getStr(formVal, "bottomCtaBadge")}
                      onChange={(e) =>
                        updateField("bottomCtaBadge", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("bottomCtaBadge")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Banner CTA (gunakan {toko})"
                      value={getStr(formVal, "bottomCtaHeadingTemplate")}
                      max={120}
                      htmlFor="adCtaHead"
                      hint="Tampil di: Halaman Baca Artikel, judul banner akhir artikel. {toko} diganti otomatis dengan nama toko resmi."
                    />
                    <input
                      id="adCtaHead"
                      type="text"
                      value={getStr(formVal, "bottomCtaHeadingTemplate")}
                      onChange={(e) =>
                        updateField("bottomCtaHeadingTemplate", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("bottomCtaHeadingTemplate")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Banner CTA"
                    value={getStr(formVal, "bottomCtaDescription")}
                    max={280}
                    htmlFor="adCtaDesc"
                    hint="Tampil di: Halaman Baca Artikel, paragraf banner akhir artikel."
                  />
                  <textarea
                    id="adCtaDesc"
                    rows={2}
                    value={getStr(formVal, "bottomCtaDescription")}
                    onChange={(e) =>
                      updateField("bottomCtaDescription", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("bottomCtaDescription")}
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Tombol Shopee Banner Bawah"
                      value={getStr(formVal, "bottomCtaShopeeLabel")}
                      max={60}
                      htmlFor="adCtaShopee"
                      hint="Tampil di: Halaman Baca Artikel, tombol oranye pada banner akhir artikel."
                    />
                    <input
                      id="adCtaShopee"
                      type="text"
                      value={getStr(formVal, "bottomCtaShopeeLabel")}
                      onChange={(e) =>
                        updateField("bottomCtaShopeeLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("bottomCtaShopeeLabel")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Tombol WhatsApp Banner Bawah"
                      value={getStr(formVal, "bottomCtaWhatsappLabel")}
                      max={60}
                      htmlFor="adCtaWa"
                      hint="Tampil di: Halaman Baca Artikel, tombol WhatsApp pada banner akhir artikel."
                    />
                    <input
                      id="adCtaWa"
                      type="text"
                      value={getStr(formVal, "bottomCtaWhatsappLabel")}
                      onChange={(e) =>
                        updateField("bottomCtaWhatsappLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("bottomCtaWhatsappLabel")}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-lg font-bold text-[#0F1F17]">
                  3. Kartu Promo Sisi Kanan (/artikel/[slug])
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Lencana Kartu Promo"
                      value={getStr(formVal, "sidebarPromoBadge")}
                      max={50}
                      htmlFor="adPromoBadge"
                      hint="Tampil di: Halaman Baca Artikel, pil atas kartu hijau gelap sisi kanan."
                    />
                    <input
                      id="adPromoBadge"
                      type="text"
                      value={getStr(formVal, "sidebarPromoBadge")}
                      onChange={(e) =>
                        updateField("sidebarPromoBadge", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sidebarPromoBadge")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kartu Promo"
                      value={getStr(formVal, "sidebarPromoTitle")}
                      max={100}
                      htmlFor="adPromoTitle"
                      hint="Tampil di: Halaman Baca Artikel, judul kartu promo sisi kanan."
                    />
                    <input
                      id="adPromoTitle"
                      type="text"
                      value={getStr(formVal, "sidebarPromoTitle")}
                      onChange={(e) =>
                        updateField("sidebarPromoTitle", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("sidebarPromoTitle")}
                  </div>
                </div>
                <div>
                  <FieldCounter
                    label="Deskripsi Kartu Promo"
                    value={getStr(formVal, "sidebarPromoDescription")}
                    max={240}
                    htmlFor="adPromoDesc"
                    hint="Tampil di: Halaman Baca Artikel, deskripsi kartu promo sisi kanan."
                  />
                  <textarea
                    id="adPromoDesc"
                    rows={2}
                    value={getStr(formVal, "sidebarPromoDescription")}
                    onChange={(e) =>
                      updateField("sidebarPromoDescription", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("sidebarPromoDescription")}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#143D29]">
                      Poin Keunggulan Kartu Promo (1–5 baris)
                    </span>
                    {promoPoints.length < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("sidebarPromoPoints", [...promoPoints, ""])
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#143D29] bg-[#EAF3EE] px-2.5 py-1 text-xs font-semibold text-[#143D29]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Tambah Poin</span>
                      </button>
                    )}
                  </div>
                  {renderError("sidebarPromoPoints")}
                  {promoPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) =>
                          updateField(
                            "sidebarPromoPoints",
                            promoPoints.map((old, i) =>
                              i === idx ? e.target.value : old
                            )
                          )
                        }
                        className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
                      />
                      {promoPoints.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "sidebarPromoPoints",
                              promoPoints.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Hapus poin #${idx + 1}`}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FECACA] text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <FieldCounter
                    label="Label Tombol Shopee Kartu Promo"
                    value={getStr(formVal, "sidebarPromoButtonLabel")}
                    max={60}
                    htmlFor="adPromoBtn"
                    hint="Tampil di: Halaman Baca Artikel, tombol oranye di kartu promo sisi kanan."
                  />
                  <input
                    id="adPromoBtn"
                    type="text"
                    value={getStr(formVal, "sidebarPromoButtonLabel")}
                    onChange={(e) =>
                      updateField("sidebarPromoButtonLabel", e.target.value)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("sidebarPromoButtonLabel")}
                </div>
              </section>
            </div>
          );
        })()}

        {/* WHATSAPP BAND BLOCK */}
        {blockKey === "whatsapp_band" && (
          <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
            <div>
              <FieldCounter
                label="Judul Pita WhatsApp"
                value={getStr(formVal, "heading")}
                max={120}
                htmlFor="waHeading"
                hint="Tampil di: Halaman Artikel (/artikel), judul pita konsultasi WhatsApp bagian bawah."
              />
              <input
                id="waHeading"
                type="text"
                value={getStr(formVal, "heading")}
                onChange={(e) => updateField("heading", e.target.value)}
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
              />
              {renderError("heading")}
            </div>
            <div>
              <FieldCounter
                label="Deskripsi"
                value={getStr(formVal, "description")}
                max={300}
                htmlFor="waDesc"
                hint="Tampil di: Halaman Artikel (/artikel), paragraf deskripsi pita konsultasi WhatsApp."
              />
              <textarea
                id="waDesc"
                rows={3}
                value={getStr(formVal, "description")}
                onChange={(e) => updateField("description", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
              />
              {renderError("description")}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FieldCounter
                  label="Label Tombol Konsultasi"
                  value={getStr(formVal, "buttonLabel")}
                  max={60}
                  htmlFor="waBtn"
                  hint="Tampil di: Halaman Artikel (/artikel), judul kartu tombol WhatsApp saat nomor aktif."
                />
                <input
                  id="waBtn"
                  type="text"
                  value={getStr(formVal, "buttonLabel")}
                  onChange={(e) => updateField("buttonLabel", e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                />
                {renderError("buttonLabel")}
              </div>
              <div>
                <FieldCounter
                  label="Keterangan Tambahan"
                  value={getStr(formVal, "disabledHint")}
                  max={150}
                  htmlFor="waHint"
                  hint="Tampil di: Halaman Artikel (/artikel), subteks di bawah label kartu tombol WhatsApp."
                />
                <input
                  id="waHint"
                  type="text"
                  value={getStr(formVal, "disabledHint")}
                  onChange={(e) => updateField("disabledHint", e.target.value)}
                  className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                />
                {renderError("disabledHint")}
              </div>
            </div>
          </section>
        )}

        {/* FOOTER BLOCK */}
        {blockKey === "footer" && (() => {
          const highlights = getArr<FooterHighlightItem>(formVal, "highlights");
          const flagship = getObj(formVal, "flagshipCard");
          const linkColumns = getArr<FooterLinkColumn>(formVal, "linkColumns");
          const socialLinks = getArr<FooterSocialLink>(formVal, "socialLinks");
          const legalBadges = getArr<string>(formVal, "legalBadges");
          const logoSrc = getStr(formVal, "logoSrc");
          const hasCustomLogo = logoSrc.trim().length > 0;
          const logoPreviewSrc = hasCustomLogo ? logoSrc : DEFAULT_FOOTER_LOGO_SRC;
          const flagshipTarget = getObj(flagship, "target");
          const flagshipCta: HeroCtaButton = {
            enabled:
              typeof flagship.enabled === "boolean" ? flagship.enabled : true,
            label: getStr(
              flagship,
              "linkLabel",
              DEFAULT_FOOTER_DATA.flagshipCard.linkLabel
            ),
            target: {
              type:
                (flagshipTarget.type as HeroCtaButton["target"]["type"]) ||
                "page",
              value: getStr(
                flagshipTarget,
                "value",
                DEFAULT_FOOTER_DATA.flagshipCard.target.value
              ),
            },
          };

          const updateHighlight = (
            idx: number,
            patch: Partial<FooterHighlightItem>
          ) => {
            const next = highlights.map((item, i) =>
              i === idx ? { ...item, ...patch } : item
            );
            updateField("highlights", next);
          };

          const moveHighlight = (idx: number, dir: -1 | 1) => {
            const to = idx + dir;
            if (to < 0 || to >= highlights.length) return;
            const next = [...highlights];
            const [moved] = next.splice(idx, 1);
            next.splice(to, 0, moved);
            updateField("highlights", next);
          };

          const updateColumn = (
            colIdx: number,
            patch: Partial<FooterLinkColumn>
          ) => {
            const next = linkColumns.map((col, i) =>
              i === colIdx ? { ...col, ...patch } : col
            );
            updateField("linkColumns", next);
          };

          return (
            <div className="space-y-6">
              {/* 0. Read-only company context notice */}
              <section className="rounded-2xl border border-[#DCE8DF] bg-[#F8FBF9] p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0F1F17]">
                      Data Perusahaan &amp; Kontak di Footer (Otomatis)
                    </h2>
                    <p className="text-xs text-[#43594D]">
                      Nama perusahaan, tautan Shopee, WhatsApp, dan alamat/jam
                      layanan di footer diambil dari halaman Identitas
                      Perusahaan &amp; Kontak.
                    </p>
                  </div>
                  <Link
                    href={adminPath("/konten/company")}
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-[#143D29] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE]"
                  >
                    <span>Ubah di Identitas Perusahaan</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-[#33473D] sm:grid-cols-2">
                  <p>
                    <strong className="text-[#0F1F17]">Nama:</strong>{" "}
                    {companyContext?.companyName || SITE_DATA.companyName}
                  </p>
                  <p>
                    <strong className="text-[#0F1F17]">WhatsApp:</strong>{" "}
                    {companyContext?.whatsappNumber || "(belum diatur)"}
                  </p>
                  <p className="sm:col-span-2 break-all">
                    <strong className="text-[#0F1F17]">Shopee:</strong>{" "}
                    {companyContext?.shopeeStoreUrl ||
                      SITE_DATA.officialStore.url}
                  </p>
                  {companyContext?.contact?.address && (
                    <p className="sm:col-span-2">
                      <strong className="text-[#0F1F17]">Alamat:</strong>{" "}
                      {companyContext.contact.address}
                    </p>
                  )}
                </div>
              </section>

              {/* 1. Tier 1 Highlights */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0F1F17]">
                      Strip Jaminan Atas Footer (1–4 Kartu)
                    </h2>
                    <p className="text-xs text-[#43594D]">
                      Tampil di: Footer (#kontak), baris 3 kartu paling atas di
                      dalam footer hijau gelap.
                    </p>
                  </div>
                  {highlights.length < 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField("highlights", [
                          ...highlights,
                          {
                            icon: "ShieldCheck",
                            title: "Layanan Resmi",
                            subtitle: "Keterangan jaminan layanan",
                          },
                        ])
                      }
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#143D29] bg-[#EAF3EE] px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#D9F0E3]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tambah Kartu</span>
                    </button>
                  )}
                </div>
                {renderError("highlights")}
                <div className="space-y-4">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#143D29]">
                          Kartu Jaminan #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveHighlight(idx, -1)}
                            aria-label={`Geser kartu jaminan #${idx + 1} ke atas`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] disabled:opacity-40"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === highlights.length - 1}
                            onClick={() => moveHighlight(idx, 1)}
                            aria-label={`Geser kartu jaminan #${idx + 1} ke bawah`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] disabled:opacity-40"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          {highlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateField(
                                  "highlights",
                                  highlights.filter((_, i) => i !== idx)
                                )
                              }
                              aria-label={`Hapus kartu jaminan #${idx + 1}`}
                              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#FECACA] bg-white text-[#B91C1C] hover:bg-[#FEF2F2]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label
                            htmlFor={`footerHighlightIcon-${idx}`}
                            className="block text-xs font-semibold text-[#143D29]"
                          >
                            Ikon
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#CBD8D0] bg-white text-[#143D29]">
                              <SupportedIcon
                                name={item.icon as SupportedIconName}
                                className="h-5 w-5"
                              />
                            </span>
                            <select
                              id={`footerHighlightIcon-${idx}`}
                              value={item.icon}
                              onChange={(e) =>
                                updateHighlight(idx, {
                                  icon: e.target.value as SupportedIconName,
                                })
                              }
                              className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs"
                            >
                              {SUPPORTED_ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {renderError(`highlights.${idx}.icon`)}
                        </div>
                        <div>
                          <FieldCounter
                            label="Judul Kartu"
                            value={item.title}
                            max={80}
                            htmlFor={`footerHighlightTitle-${idx}`}
                            hint="Tampil di: Footer (#kontak), judul kartu strip jaminan."
                          />
                          <input
                            id={`footerHighlightTitle-${idx}`}
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateHighlight(idx, { title: e.target.value })
                            }
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                          {renderError(`highlights.${idx}.title`)}
                        </div>
                        <div>
                          <FieldCounter
                            label="Keterangan Kartu"
                            value={item.subtitle}
                            max={140}
                            htmlFor={`footerHighlightSub-${idx}`}
                            hint="Tampil di: Footer (#kontak), teks di bawah judul kartu."
                          />
                          <input
                            id={`footerHighlightSub-${idx}`}
                            type="text"
                            value={item.subtitle}
                            onChange={(e) =>
                              updateHighlight(idx, { subtitle: e.target.value })
                            }
                            className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                          />
                          {renderError(`highlights.${idx}.subtitle`)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Brand, Logo & Flagship Card */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-5">
                <h2 className="font-display text-base font-bold text-[#0F1F17]">
                  Kolom Kiri: Logo, Identitas &amp; Kartu Lini Unggulan
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-3">
                    <ImageUploadControl
                      isUploading={isUploading}
                      onFileChange={handleFieldImageUpload("logoSrc")}
                      hasCustomImage={hasCustomLogo}
                      allowRemove
                      onRequestRemove={() => setShowRemoveImageModal(true)}
                    />
                    {uploadError && (
                      <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                        {uploadError}
                      </p>
                    )}
                    <div>
                      <FieldCounter
                        label="URL / Path Logo Footer (Opsional)"
                        value={logoSrc}
                        max={250}
                        required={false}
                        htmlFor="footerLogoSrc"
                        hint="Tampil di: Footer (#kontak), logo kiri atas. Kosongkan untuk memakai logo bawaan."
                      />
                      <input
                        id="footerLogoSrc"
                        type="text"
                        value={logoSrc}
                        placeholder={DEFAULT_FOOTER_LOGO_SRC}
                        onChange={(e) => updateField("logoSrc", e.target.value)}
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-xs"
                      />
                      {renderError("logoSrc")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Teks Alternatif Logo (Opsional)"
                        value={getStr(formVal, "logoAlt")}
                        max={120}
                        required={false}
                        htmlFor="footerLogoAlt"
                        hint="Tampil di: Footer (#kontak), atribut alt gambar logo."
                      />
                      <input
                        id="footerLogoAlt"
                        type="text"
                        value={getStr(formVal, "logoAlt")}
                        onChange={(e) => updateField("logoAlt", e.target.value)}
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                      />
                      {renderError("logoAlt")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#143D29]">
                      Pratinjau Logo Footer
                    </p>
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-[#CBD8D0] bg-[#0D2B1C] p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoPreviewSrc}
                        alt={getStr(formVal, "logoAlt") || "Pratinjau logo footer"}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <FieldCounter
                    label="Subjudul Merek di Bawah Nama Perusahaan"
                    value={getStr(formVal, "brandSubtitle")}
                    max={80}
                    htmlFor="footerBrandSub"
                    hint="Tampil di: Footer (#kontak), teks kecil hijau di bawah nama perusahaan."
                  />
                  <input
                    id="footerBrandSub"
                    type="text"
                    value={getStr(formVal, "brandSubtitle")}
                    onChange={(e) => updateField("brandSubtitle", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("brandSubtitle")}
                </div>

                <div>
                  <FieldCounter
                    label="Ringkasan Perusahaan di Footer"
                    value={getStr(formVal, "blurb")}
                    max={350}
                    htmlFor="footerBlurb"
                    hint="Tampil di: Footer (#kontak), kolom kiri di bawah logo perusahaan."
                  />
                  <textarea
                    id="footerBlurb"
                    rows={3}
                    value={getStr(formVal, "blurb")}
                    onChange={(e) => updateField("blurb", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("blurb")}
                </div>

                <div className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#0F1F17]">
                      Kartu Sorotan Lini Unggulan
                    </p>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#143D29]">
                      <input
                        type="checkbox"
                        checked={flagshipCta.enabled}
                        onChange={(e) =>
                          updateField("flagshipCard", {
                            ...flagship,
                            enabled: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
                      />
                      <span>Tampilkan kartu di footer</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <FieldCounter
                        label="Label Kecil Atas"
                        value={getStr(flagship, "eyebrow")}
                        max={80}
                        required={flagshipCta.enabled}
                        htmlFor="footerFlagEyebrow"
                        hint="Tampil di: Footer (#kontak), baris atas kartu lini unggulan."
                      />
                      <input
                        id="footerFlagEyebrow"
                        type="text"
                        value={getStr(flagship, "eyebrow")}
                        onChange={(e) =>
                          updateField("flagshipCard", {
                            ...flagship,
                            eyebrow: e.target.value,
                          })
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {renderError("flagshipCard.eyebrow")}
                    </div>
                    <div>
                      <FieldCounter
                        label="Judul Kartu Unggulan"
                        value={getStr(flagship, "title")}
                        max={100}
                        required={flagshipCta.enabled}
                        htmlFor="footerFlagTitle"
                        hint="Tampil di: Footer (#kontak), judul kartu lini unggulan."
                      />
                      <input
                        id="footerFlagTitle"
                        type="text"
                        value={getStr(flagship, "title")}
                        onChange={(e) =>
                          updateField("flagshipCard", {
                            ...flagship,
                            title: e.target.value,
                          })
                        }
                        className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {renderError("flagshipCard.title")}
                    </div>
                  </div>
                  <div>
                    <FieldCounter
                      label="Deskripsi Kartu Unggulan"
                      value={getStr(flagship, "description")}
                      max={220}
                      required={flagshipCta.enabled}
                      htmlFor="footerFlagDesc"
                      hint="Tampil di: Footer (#kontak), deskripsi singkat di kartu lini unggulan."
                    />
                    <textarea
                      id="footerFlagDesc"
                      rows={2}
                      value={getStr(flagship, "description")}
                      onChange={(e) =>
                        updateField("flagshipCard", {
                          ...flagship,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                    />
                    {renderError("flagshipCard.description")}
                  </div>
                  <CtaButtonEditor
                    idPrefix="footer-flagship"
                    heading="Tautan Kartu Lini Unggulan"
                    value={flagshipCta}
                    allowDisable={false}
                    onChange={(next) =>
                      updateField("flagshipCard", {
                        ...flagship,
                        linkLabel: next.label,
                        target: next.target,
                      })
                    }
                    whatsappNumber={companyContext?.whatsappNumber ?? null}
                    shopeeStoreUrl={
                      companyContext?.shopeeStoreUrl ??
                      SITE_DATA.officialStore.url
                    }
                    labelError={fieldErrors["flagshipCard.label"]}
                    targetError={fieldErrors["flagshipCard.target"]}
                    hint="Tampil di: Footer (#kontak), tautan bawah kartu lini unggulan."
                  />
                </div>
              </section>

              {/* 3. Navigation Link Columns & Automatic Headings */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-display text-base font-bold text-[#0F1F17]">
                      Kolom Tautan Navigasi (1–3 Kolom)
                    </h2>
                    <p className="text-xs text-[#43594D]">
                      Tampil di: Footer (#kontak), kolom kedua di bawah judul
                      menu.
                    </p>
                  </div>
                  {linkColumns.length < 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        updateField("linkColumns", [
                          ...linkColumns,
                          {
                            heading: "Tautan Tambahan",
                            links: [
                              {
                                label: "Beranda",
                                target: { type: "page", value: "/" },
                              },
                            ],
                          },
                        ])
                      }
                      className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#143D29] bg-[#EAF3EE] px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#D9F0E3]"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Tambah Kolom</span>
                    </button>
                  )}
                </div>
                {renderError("linkColumns")}

                <div className="space-y-4">
                  {linkColumns.map((col, colIdx) => (
                    <div
                      key={colIdx}
                      className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#143D29]">
                          Kolom Tautan #{colIdx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {col.links.length < 8 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateColumn(colIdx, {
                                  links: [
                                    ...col.links,
                                    {
                                      label: "Beranda",
                                      target: { type: "page", value: "/" },
                                    },
                                  ],
                                })
                              }
                              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-lg border border-[#143D29] bg-white px-2.5 py-1 text-xs font-semibold text-[#143D29]"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Tambah Tautan</span>
                            </button>
                          )}
                          {linkColumns.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                updateField(
                                  "linkColumns",
                                  linkColumns.filter((_, i) => i !== colIdx)
                                )
                              }
                              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-lg border border-[#FECACA] bg-white px-2.5 py-1 text-xs font-semibold text-[#B91C1C]"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus Kolom</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <FieldCounter
                          label="Judul Kolom"
                          value={col.heading}
                          max={60}
                          htmlFor={`footerColHeading-${colIdx}`}
                          hint="Tampil di: Footer (#kontak), judul di atas daftar tautan."
                        />
                        <input
                          id={`footerColHeading-${colIdx}`}
                          type="text"
                          value={col.heading}
                          onChange={(e) =>
                            updateColumn(colIdx, { heading: e.target.value })
                          }
                          className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                        />
                        {renderError(`linkColumns.${colIdx}.heading`)}
                      </div>
                      {renderError(`linkColumns.${colIdx}.links`)}

                      <div className="space-y-3">
                        {col.links.map((lnk, lnkIdx) => (
                          <div
                            key={lnkIdx}
                            className="rounded-xl border border-[#CBD8D0] bg-white p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#33473D]">
                                Tautan #{lnkIdx + 1}
                              </span>
                              {col.links.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateColumn(colIdx, {
                                      links: col.links.filter(
                                        (_, i) => i !== lnkIdx
                                      ),
                                    })
                                  }
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#B91C1C] hover:underline"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>Hapus</span>
                                </button>
                              )}
                            </div>
                            <CtaButtonEditor
                              idPrefix={`footer-col-${colIdx}-lnk-${lnkIdx}`}
                              heading={`Tautan #${lnkIdx + 1}`}
                              value={{
                                enabled: true,
                                label: lnk.label,
                                target: lnk.target,
                              }}
                              allowDisable={false}
                              onChange={(next) =>
                                updateColumn(colIdx, {
                                  links: col.links.map((old, i) =>
                                    i === lnkIdx
                                      ? { label: next.label, target: next.target }
                                      : old
                                  ),
                                })
                              }
                              whatsappNumber={
                                companyContext?.whatsappNumber ?? null
                              }
                              shopeeStoreUrl={
                                companyContext?.shopeeStoreUrl ??
                                SITE_DATA.officialStore.url
                              }
                              labelError={
                                fieldErrors[
                                  `linkColumns.${colIdx}.links.${lnkIdx}.label`
                                ]
                              }
                              targetError={
                                fieldErrors[
                                  `linkColumns.${colIdx}.links.${lnkIdx}.target`
                                ]
                              }
                              hint="Tampil di: Footer (#kontak), item daftar navigasi."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-[#EBF2ED] pt-4 md:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Judul Blok Lini Produk"
                      value={getStr(formVal, "productCategoriesHeading")}
                      max={60}
                      htmlFor="footerProdHeading"
                      hint="Tampil di: Footer (#kontak), daftar kategori diambil otomatis dari Kategori Produk."
                    />
                    <input
                      id="footerProdHeading"
                      type="text"
                      value={getStr(formVal, "productCategoriesHeading")}
                      onChange={(e) =>
                        updateField("productCategoriesHeading", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("productCategoriesHeading")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Judul Kolom Panduan Pilihan"
                      value={getStr(formVal, "featuredArticlesHeading")}
                      max={60}
                      htmlFor="footerArtHeading"
                      hint="Tampil di: Footer (#kontak), daftar artikel diambil otomatis dari Artikel Edukasi."
                    />
                    <input
                      id="footerArtHeading"
                      type="text"
                      value={getStr(formVal, "featuredArticlesHeading")}
                      onChange={(e) =>
                        updateField("featuredArticlesHeading", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("featuredArticlesHeading")}
                  </div>
                </div>
              </section>

              {/* 4. Official Channels Column */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-base font-bold text-[#0F1F17]">
                  Kolom Kanan: Saluran Resmi, Shopee, WhatsApp &amp; Media Sosial
                </h2>

                <div>
                  <FieldCounter
                    label="Judul Kolom Saluran Resmi"
                    value={getStr(formVal, "channelsHeading")}
                    max={60}
                    htmlFor="footerChannelsHeading"
                    hint="Tampil di: Footer (#kontak), judul kolom paling kanan."
                  />
                  <input
                    id="footerChannelsHeading"
                    type="text"
                    value={getStr(formVal, "channelsHeading")}
                    onChange={(e) =>
                      updateField("channelsHeading", e.target.value)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("channelsHeading")}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Label Atas Kartu Toko"
                      value={getStr(formVal, "storeCardBadge")}
                      max={50}
                      htmlFor="footerStoreBadge"
                      hint="Tampil di: Footer (#kontak), teks kecil kiri di atas judul kartu toko."
                    />
                    <input
                      id="footerStoreBadge"
                      type="text"
                      value={getStr(formVal, "storeCardBadge")}
                      onChange={(e) =>
                        updateField("storeCardBadge", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("storeCardBadge")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Lencana Kanan Kartu Toko"
                      value={getStr(formVal, "storeCardBadgeRight")}
                      max={40}
                      htmlFor="footerStoreBadgeRight"
                      hint="Tampil di: Footer (#kontak), pil kecil kanan di atas kartu toko."
                    />
                    <input
                      id="footerStoreBadgeRight"
                      type="text"
                      value={getStr(formVal, "storeCardBadgeRight")}
                      onChange={(e) =>
                        updateField("storeCardBadgeRight", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("storeCardBadgeRight")}
                  </div>
                </div>

                <div>
                  <FieldCounter
                    label="Judul Kartu Toko Resmi"
                    value={getStr(formVal, "storeCardTitle")}
                    max={80}
                    htmlFor="footerStoreTitle"
                    hint="Tampil di: Footer (#kontak), kolom kanan pada kartu Marketplace Resmi."
                  />
                  <input
                    id="footerStoreTitle"
                    type="text"
                    value={getStr(formVal, "storeCardTitle")}
                    onChange={(e) => updateField("storeCardTitle", e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("storeCardTitle")}
                </div>

                <div>
                  <FieldCounter
                    label="Deskripsi Kartu Toko Resmi"
                    value={getStr(formVal, "storeCardDescription")}
                    max={250}
                    htmlFor="footerStoreDesc"
                    hint="Tampil di: Footer (#kontak), keterangan di bawah judul kartu toko resmi."
                  />
                  <textarea
                    id="footerStoreDesc"
                    rows={2}
                    value={getStr(formVal, "storeCardDescription")}
                    onChange={(e) =>
                      updateField("storeCardDescription", e.target.value)
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2.5 text-sm"
                  />
                  {renderError("storeCardDescription")}
                </div>

                <div>
                  <FieldCounter
                    label="Label Tombol Toko Resmi"
                    value={getStr(formVal, "storeButtonLabel")}
                    max={60}
                    htmlFor="footerStoreBtn"
                    hint="Tampil di: Footer (#kontak), teks tombol menuju Toko Shopee."
                  />
                  <input
                    id="footerStoreBtn"
                    type="text"
                    value={getStr(formVal, "storeButtonLabel")}
                    onChange={(e) =>
                      updateField("storeButtonLabel", e.target.value)
                    }
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[#CBD8D0] px-3.5 py-2 text-sm"
                  />
                  {renderError("storeButtonLabel")}
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-[#EBF2ED] pt-4 md:grid-cols-2">
                  <div>
                    <FieldCounter
                      label="Judul Blok WhatsApp"
                      value={getStr(formVal, "whatsappCardTitle")}
                      max={80}
                      htmlFor="footerWaTitle"
                      hint="Tampil di: Footer (#kontak), subjudul blok konsultasi WhatsApp."
                    />
                    <input
                      id="footerWaTitle"
                      type="text"
                      value={getStr(formVal, "whatsappCardTitle")}
                      onChange={(e) =>
                        updateField("whatsappCardTitle", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("whatsappCardTitle")}
                  </div>
                  <div>
                    <FieldCounter
                      label="Label Tombol WhatsApp"
                      value={getStr(formVal, "whatsappButtonLabel")}
                      max={60}
                      htmlFor="footerWaBtn"
                      hint="Tampil di: Footer (#kontak), teks tombol WhatsApp resmi."
                    />
                    <input
                      id="footerWaBtn"
                      type="text"
                      value={getStr(formVal, "whatsappButtonLabel")}
                      onChange={(e) =>
                        updateField("whatsappButtonLabel", e.target.value)
                      }
                      className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                    />
                    {renderError("whatsappButtonLabel")}
                  </div>
                </div>

                <div>
                  <FieldCounter
                    label="Deskripsi Blok WhatsApp"
                    value={getStr(formVal, "whatsappCardDescription")}
                    max={220}
                    htmlFor="footerWaDesc"
                    hint="Tampil di: Footer (#kontak), keterangan di atas tombol WhatsApp."
                  />
                  <textarea
                    id="footerWaDesc"
                    rows={2}
                    value={getStr(formVal, "whatsappCardDescription")}
                    onChange={(e) =>
                      updateField("whatsappCardDescription", e.target.value)
                    }
                    className="mt-1 w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("whatsappCardDescription")}
                </div>

                <div>
                  <FieldCounter
                    label="Judul Blok Informasi Kontak"
                    value={getStr(formVal, "contactHeading")}
                    max={60}
                    htmlFor="footerContactHeading"
                    hint="Tampil di: Footer (#kontak), judul di atas alamat/telepon/email/jam layanan."
                  />
                  <input
                    id="footerContactHeading"
                    type="text"
                    value={getStr(formVal, "contactHeading")}
                    onChange={(e) =>
                      updateField("contactHeading", e.target.value)
                    }
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("contactHeading")}
                </div>

                {/* Social Links (optional) */}
                <div className="border-t border-[#EBF2ED] pt-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#0F1F17]">
                        Tautan Media Sosial (Opsional)
                      </p>
                      <p className="text-xs text-[#43594D]">
                        Tampil di: Footer (#kontak), di bawah kontak. Jika
                        kosong, bagian ini disembunyikan.
                      </p>
                    </div>
                    {socialLinks.length < 6 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("socialLinks", [
                            ...socialLinks,
                            { platform: "", url: "" },
                          ])
                        }
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-xl border border-[#143D29] bg-[#EAF3EE] px-3 py-1 text-xs font-semibold text-[#143D29]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Tambah Media Sosial</span>
                      </button>
                    )}
                  </div>
                  {renderError("socialLinks")}
                  {socialLinks.map((soc, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-3 md:grid-cols-12"
                    >
                      <div className="md:col-span-4">
                        <label
                          htmlFor={`footerSocPlat-${idx}`}
                          className="block text-xs font-semibold text-[#143D29]"
                        >
                          Platform
                        </label>
                        <input
                          id={`footerSocPlat-${idx}`}
                          type="text"
                          value={soc.platform}
                          placeholder="Instagram / YouTube"
                          onChange={(e) =>
                            updateField(
                              "socialLinks",
                              socialLinks.map((old, i) =>
                                i === idx
                                  ? { ...old, platform: e.target.value }
                                  : old
                              )
                            )
                          }
                          className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                        />
                        {renderError(`socialLinks.${idx}.platform`)}
                      </div>
                      <div className="md:col-span-7">
                        <label
                          htmlFor={`footerSocUrl-${idx}`}
                          className="block text-xs font-semibold text-[#143D29]"
                        >
                          URL (https://)
                        </label>
                        <input
                          id={`footerSocUrl-${idx}`}
                          type="url"
                          value={soc.url}
                          placeholder="https://instagram.com/..."
                          onChange={(e) =>
                            updateField(
                              "socialLinks",
                              socialLinks.map((old, i) =>
                                i === idx ? { ...old, url: e.target.value } : old
                              )
                            )
                          }
                          className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 font-mono text-xs"
                        />
                        {renderError(`socialLinks.${idx}.url`)}
                      </div>
                      <div className="flex items-end md:col-span-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "socialLinks",
                              socialLinks.filter((_, i) => i !== idx)
                            )
                          }
                          aria-label={`Hapus media sosial #${idx + 1}`}
                          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#FECACA] bg-white text-[#B91C1C]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Bottom bar: Copyright & Legal Badges */}
              <section className="rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6 space-y-4">
                <h2 className="font-display text-base font-bold text-[#0F1F17]">
                  Baris Paling Bawah: Hak Cipta &amp; Lencana
                </h2>
                <div>
                  <FieldCounter
                    label="Teks Hak Cipta"
                    value={getStr(formVal, "copyrightText")}
                    max={180}
                    htmlFor="footerCopyright"
                    hint="Tampil di: Footer (#kontak), baris paling bawah kiri. Gunakan {tahun} untuk tahun otomatis dan {perusahaan} untuk nama perusahaan."
                  />
                  <input
                    id="footerCopyright"
                    type="text"
                    value={getStr(formVal, "copyrightText")}
                    onChange={(e) => updateField("copyrightText", e.target.value)}
                    className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] px-3 py-2 text-sm"
                  />
                  {renderError("copyrightText")}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-[#0F1F17]">
                        Lencana Bawah Kanan (0–4 Pil)
                      </p>
                      <p className="text-xs text-[#43594D]">
                        Tampil di: Footer (#kontak), baris paling bawah kanan.
                        Kosongkan semua jika ingin disembunyikan.
                      </p>
                    </div>
                    {legalBadges.length < 4 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateField("legalBadges", [...legalBadges, ""])
                        }
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-xl border border-[#143D29] bg-[#EAF3EE] px-3 py-1 text-xs font-semibold text-[#143D29]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Tambah Lencana</span>
                      </button>
                    )}
                  </div>
                  {renderError("legalBadges")}
                  {legalBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        aria-label={`Lencana bawah #${idx + 1}`}
                        value={badge}
                        onChange={(e) =>
                          updateField(
                            "legalBadges",
                            legalBadges.map((old, i) =>
                              i === idx ? e.target.value : old
                            )
                          )
                        }
                        className="min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            "legalBadges",
                            legalBadges.filter((_, i) => i !== idx)
                          )
                        }
                        aria-label={`Hapus lencana #${idx + 1}`}
                        className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#FECACA] bg-white text-[#B91C1C]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          );
        })()}
      </form>

      {showRemoveImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-hero-image-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl">
            <h3
              id="remove-hero-image-title"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Hapus Gambar Hero?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
              Hapus gambar ini? Situs akan memakai gambar bawaan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRemoveImageModal(false)}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormVal((prev) =>
                    blockKey === "article_hub"
                      ? { ...prev, bannerImageSrc: "", bannerImageAlt: "" }
                      : blockKey === "footer"
                        ? { ...prev, logoSrc: "", logoAlt: "" }
                        : blockKey === "article_page"
                          ? { ...prev, ogImageSrc: "", ogImageAlt: "" }
                          : { ...prev, imageSrc: "", imageAlt: "" }
                  );
                  setIsDirty(true);
                  setShowRemoveImageModal(false);
                }}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D]"
              >
                Ya, Hapus Gambar
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-block-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#CBD8D0] bg-white p-6 shadow-xl">
            <h3
              id="reset-block-title"
              className="font-display text-lg font-bold text-[#0F1F17]"
            >
              Kembalikan ke Teks Awal?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#33473D]">
              Semua perubahan pada bagian <strong>{blockTitle}</strong> akan
              diganti dengan teks bawaan awal situs. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl border border-[#CBD8D0] bg-white px-4 py-2 text-xs font-semibold text-[#143D29]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={isResetting}
                className="inline-flex min-h-[42px] cursor-pointer items-center rounded-xl bg-[#991B1B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#7F1D1D]"
              >
                {isResetting ? "Mengembalikan..." : "Ya, Kembalikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
