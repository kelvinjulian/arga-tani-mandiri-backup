"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Plus,
  RotateCcw,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  HOME_SECTION_OPTIONS,
  PUBLIC_PAGE_OPTIONS,
  isValidExternalHttpsUrl,
} from "@/lib/site-content/hero-cta";
import {
  DEFAULT_NAVBAR_BRAND_SUBTITLE,
  DEFAULT_NAVBAR_BRAND_TITLE,
  DEFAULT_NAVBAR_LOGO_ALT,
  DEFAULT_NAVBAR_LOGO_SRC,
  NAVBAR_BRAND_SUBTITLE_MAX,
  NAVBAR_BRAND_TITLE_MAX,
  NAVBAR_LABEL_MAX,
  NAVBAR_MAX_ITEMS,
  NAVBAR_MIN_ITEMS,
  cloneNavbarDefaults,
  type NavbarItem,
  type NavbarItemStyle,
} from "@/lib/site-content/navbar-defaults";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import { getWhatsAppHref, isDummyWhatsAppNumber } from "@/lib/whatsapp";

const STYLE_LABELS: Record<NavbarItemStyle, string> = {
  link: "Tautan",
  "button-primary": "Tombol utama",
  "button-outline": "Tombol garis tepi",
};

interface NavbarContentEditorProps {
  formVal: Record<string, unknown>;
  updateField: (field: string, value: unknown) => void;
  setItems: (nextItems: NavbarItem[]) => void;
  fieldErrors: Record<string, string>;
  whatsappNumber: string | null;
}

function getItemsFromForm(formVal: Record<string, unknown>): NavbarItem[] {
  const raw = formVal.items;
  if (Array.isArray(raw)) {
    return raw as NavbarItem[];
  }
  return cloneNavbarDefaults().items;
}

function getGroupedSelectValue(item: NavbarItem): string {
  if (item.target.type === "section") return `section:${item.target.value}`;
  if (item.target.type === "page") return `page:${item.target.value}`;
  if (item.target.type === "whatsapp") return "whatsapp:";
  return "external:";
}

function generateUniqueItemId(existing: NavbarItem[]): string {
  const used = new Set(existing.map((i) => i.id));
  let idx = existing.length + 1;
  while (used.has(`menu-${idx}`)) {
    idx += 1;
  }
  return `menu-${idx}`;
}

export function NavbarContentEditor({
  formVal,
  updateField,
  setItems,
  fieldErrors,
  whatsappNumber,
}: NavbarContentEditorProps) {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);

  const logoSrc =
    typeof formVal.logoSrc === "string" && formVal.logoSrc.trim()
      ? formVal.logoSrc.trim()
      : DEFAULT_NAVBAR_LOGO_SRC;
  const logoAlt =
    typeof formVal.logoAlt === "string"
      ? formVal.logoAlt
      : DEFAULT_NAVBAR_LOGO_ALT;
  const brandTitle =
    typeof formVal.brandTitle === "string"
      ? formVal.brandTitle
      : DEFAULT_NAVBAR_BRAND_TITLE;
  const brandSubtitle =
    typeof formVal.brandSubtitle === "string"
      ? formVal.brandSubtitle
      : DEFAULT_NAVBAR_BRAND_SUBTITLE;

  const items = getItemsFromForm(formVal);
  const enabledItems = items.filter((item) => item.enabled);
  const enabledLinks = enabledItems.filter((item) => item.style === "link");
  const enabledButtons = enabledItems.filter((item) => item.style !== "link");
  const waHref = getWhatsAppHref(whatsappNumber);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setIsUploadingLogo(true);
    setLogoUploadError(null);
    const res = await uploadArticleImage(file);
    setIsUploadingLogo(false);
    if (!res.ok) {
      setLogoUploadError(res.error);
      return;
    }
    updateField("logoSrc", res.publicUrl);
  };

  const updateItem = (idx: number, patch: Partial<NavbarItem>) => {
    const next = items.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setItems(next);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(targetIdx, 0, moved);
    setItems(next);
  };

  const removeItem = (idx: number) => {
    if (items.length <= NAVBAR_MIN_ITEMS) return;
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
  };

  const addItem = () => {
    if (items.length >= NAVBAR_MAX_ITEMS) return;
    const nextItem: NavbarItem = {
      id: generateUniqueItemId(items),
      label: "Menu Baru",
      enabled: true,
      target: { type: "page", value: "/video" },
      style: "link",
      openInNewTab: false,
    };
    setItems([...items, nextItem]);
  };

  return (
    <div className="space-y-5">
      {/* Brand Identity & Logo */}
      <div className="rounded-2xl border border-[#CBD8D0] bg-white p-4 sm:p-5">
        <h3 className="font-display text-sm font-bold text-[#0F1F17]">
          Identitas Brand &amp; Logo (Kiri Navbar)
        </h3>
        <p className="mt-0.5 text-xs text-[#43594D]">
          Mengatur logo, nama brand, dan tagline yang tampil di sisi kiri
          navbar.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#CDE2D4] bg-[#EAF3EE] p-1.5">
              <img
                src={logoSrc}
                alt={logoAlt || brandTitle || "Logo navbar"}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#F4FAF6]">
                <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {isUploadingLogo ? "Mengunggah..." : "Unggah Logo"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                  className="sr-only"
                />
              </label>
              {logoSrc !== DEFAULT_NAVBAR_LOGO_SRC && (
                <button
                  type="button"
                  onClick={() => updateField("logoSrc", DEFAULT_NAVBAR_LOGO_SRC)}
                  className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 rounded-lg border border-[#E2EAE4] bg-[#F8FBF9] px-2.5 py-1 text-[11px] font-semibold text-[#33473D] hover:bg-[#EEF4F0]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Gunakan logo bawaan</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="navbar-brand-title"
                  className="text-xs font-semibold text-[#143D29]"
                >
                  Nama Brand <span className="text-[#B91C1C]">*</span>
                </label>
                <span
                  className={`text-[11px] font-medium ${
                    brandTitle.length > NAVBAR_BRAND_TITLE_MAX
                      ? "text-[#B91C1C]"
                      : "text-[#43594D]"
                  }`}
                >
                  {brandTitle.length}/{NAVBAR_BRAND_TITLE_MAX}
                </span>
              </div>
              <input
                id="navbar-brand-title"
                type="text"
                value={brandTitle}
                maxLength={NAVBAR_BRAND_TITLE_MAX + 10}
                onChange={(e) => updateField("brandTitle", e.target.value)}
                className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
              />
              {fieldErrors.brandTitle && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.brandTitle}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="navbar-brand-subtitle"
                  className="text-xs font-semibold text-[#143D29]"
                >
                  Tagline / Subjudul
                </label>
                <span
                  className={`text-[11px] font-medium ${
                    brandSubtitle.length > NAVBAR_BRAND_SUBTITLE_MAX
                      ? "text-[#B91C1C]"
                      : "text-[#43594D]"
                  }`}
                >
                  {brandSubtitle.length}/{NAVBAR_BRAND_SUBTITLE_MAX}
                </span>
              </div>
              <input
                id="navbar-brand-subtitle"
                type="text"
                value={brandSubtitle}
                maxLength={NAVBAR_BRAND_SUBTITLE_MAX + 10}
                placeholder="Kosongkan jika tidak ingin ditampilkan"
                onChange={(e) => updateField("brandSubtitle", e.target.value)}
                className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
              />
              {fieldErrors.brandSubtitle && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.brandSubtitle}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="navbar-logo-alt"
                className="block text-xs font-semibold text-[#143D29]"
              >
                Teks Alternatif Logo (opsional)
              </label>
              <input
                id="navbar-logo-alt"
                type="text"
                value={logoAlt}
                maxLength={120}
                placeholder="Biarkan kosong jika logo hanya dekoratif di samping nama brand"
                onChange={(e) => updateField("logoAlt", e.target.value)}
                className="mt-1 min-h-[38px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-xs"
              />
              {fieldErrors.logoAlt && (
                <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                  {fieldErrors.logoAlt}
                </p>
              )}
            </div>
          </div>
        </div>

        {(logoUploadError || fieldErrors.logoSrc) && (
          <p role="alert" className="mt-2 text-xs font-medium text-[#B91C1C]">
            {logoUploadError ?? fieldErrors.logoSrc}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#143D29]">
            Daftar Menu Navbar ({items.length}/{NAVBAR_MAX_ITEMS} item)
          </p>
          <p className="mt-0.5 text-xs text-[#43594D]">
            Tampil di: Navbar (bagian atas seluruh halaman publik &amp; menu
            seluler).
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          disabled={items.length >= NAVBAR_MAX_ITEMS}
          className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#143D29] hover:bg-[#F4FAF6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {fieldErrors.items && (
        <p role="alert" className="text-xs font-medium text-[#B91C1C]">
          {fieldErrors.items}
        </p>
      )}

      {enabledItems.length > 7 && (
        <div className="flex items-start gap-2 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-3 text-xs text-[#92400E]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Terlalu banyak menu bisa membuat navbar sempit di layar kecil.
          </span>
        </div>
      )}

      {/* Live Preview Bar */}
      <div className="rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-3.5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#43594D]">
          Pratinjau Baris Navbar ({enabledItems.length} aktif)
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#DCE8DF] bg-white px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#CDE2D4] bg-[#EAF3EE] p-1">
              <img
                src={logoSrc}
                alt=""
                className="h-full w-full object-contain"
              />
            </span>
            <div className="leading-tight">
              <p className="font-display text-xs font-bold text-[#0E291B]">
                {brandTitle.trim() || DEFAULT_NAVBAR_BRAND_TITLE}
              </p>
              {brandSubtitle.trim() && (
                <p className="text-[10px] text-[#526458]">
                  {brandSubtitle.trim()}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-full border border-[#DCE8DF] bg-[#F0F6F2] p-1">
            {enabledLinks.length > 0 ? (
              enabledLinks.map((item, idx) => (
                <span
                  key={item.id}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    idx === 0
                      ? "bg-[#0E2F1D] text-white"
                      : "text-[#384E40]"
                  }`}
                >
                  {item.label || "(tanpa label)"}
                </span>
              ))
            ) : (
              <span className="px-3 py-1 text-xs text-[#6B7F74]">
                Belum ada tautan aktif
              </span>
            )}
          </div>

          {enabledButtons.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {enabledButtons.map((item) => (
                <span
                  key={item.id}
                  className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                    item.style === "button-primary"
                      ? "bg-[#C84B28] text-white"
                      : "border border-[#C5E3CE] bg-[#EAF3EE] text-[#0E2F1D]"
                  }`}
                >
                  <span>{item.label || "(tanpa label)"}</span>
                  {item.openInNewTab && (
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Cards */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const labelErr = fieldErrors[`items.${idx}.label`];
          const targetErr = fieldErrors[`items.${idx}.target`];
          const styleErr = fieldErrors[`items.${idx}.style`];
          const idErr = fieldErrors[`items.${idx}.id`];

          let targetWarning: string | null = null;
          if (item.target.type === "external") {
            const val = item.target.value.trim();
            if (!val) {
              targetWarning = "URL eksternal belum diisi.";
            } else if (!isValidExternalHttpsUrl(val)) {
              targetWarning = "URL harus diawali https:// yang valid.";
            }
          } else if (item.target.type === "whatsapp") {
            if (!waHref || isDummyWhatsAppNumber(whatsappNumber)) {
              targetWarning =
                "Nomor WhatsApp perusahaan belum diisi atau masih contoh — atur di Identitas Perusahaan.";
            }
          } else if (!item.target.value.trim()) {
            targetWarning = "Tujuan tautan belum dipilih.";
          }

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-colors ${
                item.enabled
                  ? "border-[#CBD8D0] bg-white"
                  : "border-[#E2EAE4] bg-[#F7FAF8] opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF4F0] pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#EAF3EE] px-2 py-0.5 font-mono text-[11px] font-bold text-[#143D29]">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-bold text-[#0F1F17]">
                    {item.label.trim() || "(Belum diberi label)"}
                  </span>
                  <span className="rounded-full border border-[#DCE8DF] bg-[#F8FBF9] px-2 py-0.5 text-[11px] font-medium text-[#43594D]">
                    {STYLE_LABELS[item.style]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <label className="mr-2 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#143D29]">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        updateItem(idx, { enabled: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
                    />
                    <span>Tampilkan</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    aria-label={`Pindahkan ${item.label || `menu ${idx + 1}`} ke atas`}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#F4FAF6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    aria-label={`Pindahkan ${item.label || `menu ${idx + 1}`} ke bawah`}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#F4FAF6] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= NAVBAR_MIN_ITEMS}
                    aria-label={`Hapus ${item.label || `menu ${idx + 1}`}`}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-[#FDF2F2] text-[#991B1B] hover:bg-[#FCE8E8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {idErr && (
                <p role="alert" className="mt-2 text-xs font-medium text-[#B91C1C]">
                  {idErr}
                </p>
              )}

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* Label */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`nav-label-${idx}`}
                      className="text-xs font-semibold text-[#143D29]"
                    >
                      Label Menu <span className="text-[#B91C1C]">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-medium ${
                        item.label.length > NAVBAR_LABEL_MAX
                          ? "text-[#B91C1C]"
                          : "text-[#43594D]"
                      }`}
                    >
                      {item.label.length}/{NAVBAR_LABEL_MAX}
                    </span>
                  </div>
                  <input
                    id={`nav-label-${idx}`}
                    type="text"
                    value={item.label}
                    maxLength={NAVBAR_LABEL_MAX + 6}
                    onChange={(e) =>
                      updateItem(idx, { label: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 text-sm"
                  />
                  {labelErr && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                      {labelErr}
                    </p>
                  )}
                </div>

                {/* Tujuan (grouped dropdown) */}
                <div>
                  <label
                    htmlFor={`nav-target-${idx}`}
                    className="block text-xs font-semibold text-[#143D29]"
                  >
                    Tujuan <span className="text-[#B91C1C]">*</span>
                  </label>
                  <select
                    id={`nav-target-${idx}`}
                    value={getGroupedSelectValue(item)}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const colonIdx = raw.indexOf(":");
                      const type = raw.slice(0, colonIdx) as NavbarItem["target"]["type"];
                      const val = raw.slice(colonIdx + 1);
                      updateItem(idx, {
                        target: {
                          type,
                          value:
                            type === "external"
                              ? item.target.type === "external"
                                ? item.target.value
                                : ""
                              : val,
                        },
                        openInNewTab: type === "external",
                      });
                    }}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                  >
                    <optgroup label="Bagian beranda">
                      {HOME_SECTION_OPTIONS.map((opt) => (
                        <option key={opt.id} value={`section:${opt.id}`}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Halaman">
                      {PUBLIC_PAGE_OPTIONS.map((opt) => (
                        <option key={opt.path} value={`page:${opt.path}`}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Tautan luar">
                      <option value="external:">Tautan luar (https://)</option>
                    </optgroup>
                    <optgroup label="WhatsApp">
                      <option value="whatsapp:">
                        WhatsApp perusahaan (otomatis)
                      </option>
                    </optgroup>
                  </select>
                  {targetErr && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                      {targetErr}
                    </p>
                  )}
                </div>

                {/* Style */}
                <div>
                  <label
                    htmlFor={`nav-style-${idx}`}
                    className="block text-xs font-semibold text-[#143D29]"
                  >
                    Gaya Tampilan
                  </label>
                  <select
                    id={`nav-style-${idx}`}
                    value={item.style}
                    onChange={(e) =>
                      updateItem(idx, {
                        style: e.target.value as NavbarItemStyle,
                      })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                  >
                    <option value="link">Tautan</option>
                    <option value="button-primary">Tombol utama</option>
                    <option value="button-outline">Tombol garis tepi</option>
                  </select>
                  {styleErr && (
                    <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
                      {styleErr}
                    </p>
                  )}
                </div>
              </div>

              {/* External URL input + Open in new tab toggle */}
              <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                {item.target.type === "external" ? (
                  <div className="flex-1">
                    <label
                      htmlFor={`nav-ext-url-${idx}`}
                      className="sr-only"
                    >
                      URL eksternal untuk {item.label || `menu ${idx + 1}`}
                    </label>
                    <input
                      id={`nav-ext-url-${idx}`}
                      type="url"
                      value={item.target.value}
                      placeholder="https://..."
                      onChange={(e) =>
                        updateItem(idx, {
                          target: { type: "external", value: e.target.value },
                        })
                      }
                      className="min-h-[38px] w-full rounded-xl border border-[#CBD8D0] px-3 py-1.5 font-mono text-xs"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-[#43594D]">
                    Tujuan:{" "}
                    <span className="font-mono font-semibold text-[#143D29]">
                      {item.target.type === "section"
                        ? item.target.value === "beranda"
                          ? "/"
                          : `/#${item.target.value}`
                        : item.target.type === "page"
                          ? item.target.value
                          : waHref ?? "Nomor WhatsApp perusahaan"}
                    </span>
                  </p>
                )}

                <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-xs font-medium text-[#33473D]">
                  <input
                    type="checkbox"
                    checked={item.openInNewTab}
                    onChange={(e) =>
                      updateItem(idx, { openInNewTab: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
                  />
                  <span>Buka di tab baru</span>
                </label>
              </div>

              {targetWarning && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#92400E]">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{targetWarning}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
