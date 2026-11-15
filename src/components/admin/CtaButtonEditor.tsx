"use client";

import { AlertTriangle } from "lucide-react";
import {
  CTA_TARGET_TYPES,
  HOME_SECTION_OPTIONS,
  PUBLIC_PAGE_OPTIONS,
  type CtaTargetType,
  type HeroCtaButton,
} from "@/lib/site-content/hero-cta";
import { getWhatsAppHref } from "@/lib/whatsapp";

const TARGET_TYPE_LABELS: Record<CtaTargetType, string> = {
  section: "Bagian di halaman beranda",
  page: "Halaman situs",
  whatsapp: "Konsultasi WhatsApp",
  shopee: "Toko Resmi Shopee",
  external: "Tautan eksternal (https://)",
};

interface CtaButtonEditorProps {
  idPrefix: string;
  heading: string;
  value: HeroCtaButton;
  onChange: (next: HeroCtaButton) => void;
  allowDisable?: boolean;
  whatsappNumber: string | null;
  shopeeStoreUrl: string;
  labelError?: string;
  targetError?: string;
  enabledError?: string;
  hint?: string;
}

export function CtaButtonEditor({
  idPrefix,
  heading,
  value,
  onChange,
  allowDisable = true,
  whatsappNumber,
  shopeeStoreUrl,
  labelError,
  targetError,
  enabledError,
  hint = "Tampil di: Beranda, bagian hero",
}: CtaButtonEditorProps) {
  const waHref = getWhatsAppHref(whatsappNumber);

  const handleTypeChange = (nextType: CtaTargetType) => {
    let nextValue = "";
    if (nextType === "section") {
      nextValue = HOME_SECTION_OPTIONS[1]?.id ?? "produk";
    } else if (nextType === "page") {
      nextValue = PUBLIC_PAGE_OPTIONS[0]?.path ?? "/";
    } else if (nextType === "external") {
      nextValue = value.target.type === "external" ? value.target.value : "";
    }
    onChange({
      ...value,
      target: { type: nextType, value: nextValue },
    });
  };

  let destinationPreview = "";
  if (!value.enabled) {
    destinationPreview = "Tombol disembunyikan (tidak tampil di beranda)";
  } else if (value.target.type === "section") {
    destinationPreview = `/#${value.target.value}`;
  } else if (value.target.type === "page") {
    destinationPreview = value.target.value;
  } else if (value.target.type === "whatsapp") {
    destinationPreview = waHref ?? "[ISI: nomor WhatsApp] (belum ada nomor valid)";
  } else if (value.target.type === "shopee") {
    destinationPreview = shopeeStoreUrl || "(URL Shopee belum diatur)";
  } else {
    destinationPreview = value.target.value.trim() || "(masukkan URL https://)";
  }

  return (
    <div className="space-y-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-bold text-[#0F1F17]">{heading}</p>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#143D29]">
          <input
            type="checkbox"
            checked={value.enabled}
            disabled={!allowDisable}
            onChange={(e) =>
              onChange({ ...value, enabled: e.target.checked })
            }
            className="h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29] disabled:cursor-not-allowed disabled:opacity-60"
          />
          <span>Tampilkan tombol</span>
        </label>
      </div>
      {!allowDisable && (
        <p className="text-[11px] text-[#43594D]">
          Tombol utama harus tetap aktif agar hero selalu memiliki aksi utama.
        </p>
      )}
      {enabledError && (
        <p role="alert" className="text-xs font-medium text-[#B91C1C]">
          {enabledError}
        </p>
      )}

      <div>
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor={`${idPrefix}-label`}
            className="block text-xs font-semibold text-[#143D29]"
          >
            Teks Tombol {value.enabled && <span className="text-[#B91C1C]">*</span>}
          </label>
          <span
            className={`text-xs font-semibold ${
              value.label.length > 60 ? "text-[#B91C1C]" : "text-[#43594D]"
            }`}
          >
            {value.label.length}/60
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#43594D]">{hint}</p>
        <input
          id={`${idPrefix}-label`}
          type="text"
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
        />
        {labelError && (
          <p role="alert" className="mt-1 text-xs font-medium text-[#B91C1C]">
            {labelError}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${idPrefix}-type`}
            className="block text-xs font-semibold text-[#143D29]"
          >
            Tujuan tombol
          </label>
          <select
            id={`${idPrefix}-type`}
            value={value.target.type}
            onChange={(e) => handleTypeChange(e.target.value as CtaTargetType)}
            className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
          >
            {CTA_TARGET_TYPES.map((t) => (
              <option key={t} value={t}>
                {TARGET_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          {value.target.type === "section" && (
            <>
              <label
                htmlFor={`${idPrefix}-section`}
                className="block text-xs font-semibold text-[#143D29]"
              >
                Pilih bagian beranda
              </label>
              <select
                id={`${idPrefix}-section`}
                value={value.target.value}
                onChange={(e) =>
                  onChange({
                    ...value,
                    target: { type: "section", value: e.target.value },
                  })
                }
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
              >
                {HOME_SECTION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {value.target.type === "page" && (
            <>
              <label
                htmlFor={`${idPrefix}-page`}
                className="block text-xs font-semibold text-[#143D29]"
              >
                Pilih halaman situs
              </label>
              <select
                id={`${idPrefix}-page`}
                value={
                  PUBLIC_PAGE_OPTIONS.some((o) => o.path === value.target.value)
                    ? value.target.value
                    : "__custom__"
                }
                onChange={(e) => {
                  const chosen = e.target.value;
                  onChange({
                    ...value,
                    target: {
                      type: "page",
                      value:
                        chosen === "__custom__"
                          ? value.target.value.startsWith("/artikel/")
                            ? value.target.value
                            : "/artikel/"
                          : chosen,
                    },
                  });
                }}
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm text-[#0F1F17]"
              >
                {PUBLIC_PAGE_OPTIONS.map((opt) => (
                  <option key={opt.path} value={opt.path}>
                    {opt.label}
                  </option>
                ))}
                <option value="__custom__">
                  Halaman artikel tertentu (/artikel/...)
                </option>
              </select>
              {!PUBLIC_PAGE_OPTIONS.some(
                (o) => o.path === value.target.value
              ) && (
                <input
                  type="text"
                  aria-label="Jalur halaman artikel"
                  value={value.target.value}
                  placeholder="/artikel/slug-artikel"
                  onChange={(e) =>
                    onChange({
                      ...value,
                      target: { type: "page", value: e.target.value },
                    })
                  }
                  className="mt-2 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 font-mono text-xs"
                />
              )}
            </>
          )}

          {value.target.type === "external" && (
            <>
              <label
                htmlFor={`${idPrefix}-url`}
                className="block text-xs font-semibold text-[#143D29]"
              >
                URL tujuan (https://) <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id={`${idPrefix}-url`}
                type="url"
                value={value.target.value}
                placeholder="https://contoh.com"
                onChange={(e) =>
                  onChange({
                    ...value,
                    target: { type: "external", value: e.target.value },
                  })
                }
                className="mt-1 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 font-mono text-xs"
              />
            </>
          )}

          {value.target.type === "whatsapp" && (
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-[#143D29]">
                Nomor WhatsApp perusahaan
              </span>
              <p className="rounded-xl border border-[#DCE8DF] bg-white px-3 py-2 font-mono text-xs text-[#143D29] break-all">
                {waHref ?? "Belum diatur"}
              </p>
              {!waHref && (
                <p className="flex items-start gap-1.5 text-xs font-medium text-[#8A5A00]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Nomor WhatsApp perusahaan belum valid; atur di Identitas Perusahaan &amp; Kontak.
                  </span>
                </p>
              )}
            </div>
          )}

          {value.target.type === "shopee" && (
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-[#143D29]">
                URL Toko Shopee perusahaan
              </span>
              <p className="rounded-xl border border-[#DCE8DF] bg-white px-3 py-2 font-mono text-xs text-[#143D29] break-all">
                {shopeeStoreUrl || "Belum diatur"}
              </p>
              {!shopeeStoreUrl && (
                <p className="flex items-start gap-1.5 text-xs font-medium text-[#8A5A00]">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    URL Toko Shopee belum diisi; atur di Identitas Perusahaan &amp; Kontak.
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {targetError && (
        <p role="alert" className="text-xs font-medium text-[#B91C1C]">
          {targetError}
        </p>
      )}

      <p className="text-xs text-[#33473D]">
        Tombol akan menuju:{" "}
        <span className="font-mono font-semibold text-[#143D29] break-all">
          {destinationPreview}
        </span>
      </p>
    </div>
  );
}
