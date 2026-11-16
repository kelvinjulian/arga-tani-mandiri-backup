"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Plus,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { uploadArticleImage } from "@/lib/supabase/media-upload";
import {
  DEFAULT_TESTIMONIALS,
  TESTIMONIALS_MAX_ITEMS,
  TESTIMONIALS_STATS_MAX,
  type TestimonialItem,
  type TestimonialStat,
} from "@/lib/site-content/testimonials-defaults";

interface TestimonialsEditorProps {
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

export function TestimonialsEditor({
  formVal,
  updateField,
  fieldErrors,
}: TestimonialsEditorProps) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const enabled = getBool(formVal, "enabled", DEFAULT_TESTIMONIALS.enabled);
  const showSampleLabel = getBool(
    formVal,
    "showSampleLabel",
    DEFAULT_TESTIMONIALS.showSampleLabel
  );
  const showRatings = getBool(
    formVal,
    "showRatings",
    DEFAULT_TESTIMONIALS.showRatings
  );
  const eyebrow = getStr(formVal, "eyebrow");
  const heading = getStr(formVal, "heading");
  const headingAccent = getStr(formVal, "headingAccent");
  const description = getStr(formVal, "description");
  const featuredId =
    typeof formVal.featuredId === "string" ? formVal.featuredId : null;

  const items: TestimonialItem[] = Array.isArray(formVal.items)
    ? formVal.items.map((raw, idx) => {
        const obj =
          raw && typeof raw === "object" && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {};
        return {
          id:
            typeof obj.id === "string" && obj.id.trim()
              ? obj.id
              : `testimoni-${idx + 1}`,
          quote: typeof obj.quote === "string" ? obj.quote : "",
          name: typeof obj.name === "string" ? obj.name : "",
          role: typeof obj.role === "string" ? obj.role : "",
          location: typeof obj.location === "string" ? obj.location : "",
          tag: typeof obj.tag === "string" ? obj.tag : "",
          rating: typeof obj.rating === "number" ? obj.rating : null,
          photoSrc: typeof obj.photoSrc === "string" ? obj.photoSrc : "",
          photoAlt: typeof obj.photoAlt === "string" ? obj.photoAlt : "",
          isSample: typeof obj.isSample === "boolean" ? obj.isSample : false,
        };
      })
    : [];

  const hasSampleItems = items.some((item) => item.isSample);

  const showStats = getBool(formVal, "showStats", DEFAULT_TESTIMONIALS.showStats);
  const statsAreSample = getBool(
    formVal,
    "statsAreSample",
    DEFAULT_TESTIMONIALS.statsAreSample
  );
  const stats: TestimonialStat[] = Array.isArray(formVal.stats)
    ? formVal.stats.map((raw, idx) => {
        const obj =
          raw && typeof raw === "object" && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : {};
        return {
          id:
            typeof obj.id === "string" && obj.id.trim()
              ? obj.id
              : `stat-${idx + 1}`,
          value: typeof obj.value === "string" ? obj.value : "",
          label: typeof obj.label === "string" ? obj.label : "",
        };
      })
    : [];

  const hasAnySample =
    hasSampleItems || (showStats && statsAreSample && stats.length > 0);

  const setStats = (nextStats: TestimonialStat[]) => {
    updateField("stats", nextStats);
  };

  const updateStat = (idx: number, patch: Partial<TestimonialStat>) => {
    setStats(stats.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addStat = () => {
    if (stats.length >= TESTIMONIALS_STATS_MAX) return;
    setStats([
      ...stats,
      { id: `stat-${crypto.randomUUID().slice(0, 8)}`, value: "", label: "" },
    ]);
  };

  const removeStat = (idx: number) => {
    setStats(stats.filter((_, i) => i !== idx));
  };

  const moveStat = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= stats.length) return;
    const next = [...stats];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setStats(next);
  };

  const setItems = (nextItems: TestimonialItem[], nextFeaturedId?: string | null) => {
    updateField("items", nextItems);
    if (nextFeaturedId !== undefined) {
      updateField("featuredId", nextFeaturedId);
    }
  };

  const updateItem = (idx: number, patch: Partial<TestimonialItem>) => {
    const next = items.map((item, i) => (i === idx ? { ...item, ...patch } : item));
    setItems(next);
  };

  const addItem = () => {
    if (items.length >= TESTIMONIALS_MAX_ITEMS) return;
    const newId = `testimoni-${crypto.randomUUID().slice(0, 8)}`;
    const nextItem: TestimonialItem = {
      id: newId,
      quote: "",
      name: "",
      role: "",
      location: "",
      tag: "",
      rating: null,
      photoSrc: "",
      photoAlt: "",
      isSample: false,
    };
    setItems([...items, nextItem], featuredId ?? newId);
  };

  const removeItem = (idx: number) => {
    const removed = items[idx];
    const next = items.filter((_, i) => i !== idx);
    const nextFeatured =
      removed && featuredId === removed.id
        ? (next[0]?.id ?? null)
        : featuredId;
    setItems(next, nextFeatured);
  };

  const moveItem = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    setItems(next);
  };

  const handlePhotoUpload = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingIdx(idx);
    setUploadError(null);
    const res = await uploadArticleImage(file);
    setUploadingIdx(null);

    if (!res.ok) {
      setUploadError(res.error);
      return;
    }

    const currentAlt = items[idx]?.photoAlt?.trim();
    const fallbackName = items[idx]?.name?.trim();
    updateItem(idx, {
      photoSrc: res.publicUrl,
      photoAlt: currentAlt || (fallbackName ? `Foto ${fallbackName}` : ""),
    });
  };

  return (
    <div className="space-y-6">
      {hasAnySample && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-4 text-sm text-[#78350F]"
        >
          <AlertTriangle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold">
              Masih ada data contoh (testimoni dan/atau angka ringkasan). Ganti
              dengan data asli sebelum situs diluncurkan.
            </p>
            <p className="text-xs text-[#92400E]">
              Contoh tampilan: ganti dengan testimoni pelanggan asli sebelum
              rilis.
            </p>
          </div>
        </div>
      )}

      {/* Bagian Pengaturan & Judul */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <h2 className="font-display text-base font-bold text-[#0F1F17]">
          Judul &amp; Pengaturan Bagian
        </h2>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 sm:grid-cols-3">
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
                Tampil di: Beranda, bagian Testimoni, visibilitas bagian
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={showSampleLabel}
              onChange={(e) => updateField("showSampleLabel", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">
                Tampilkan label Contoh
              </span>
              <span className="block text-xs text-[#43594D]">
                Tampil di: Beranda, bagian Testimoni, lencana kartu contoh
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={showRatings}
              onChange={(e) => updateField("showRatings", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">Tampilkan rating</span>
              <span className="block text-xs text-[#43594D]">
                Tampil di: Beranda, bagian Testimoni, bintang pada kartu
              </span>
            </span>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <CounterHeader
              htmlFor="testi-eyebrow"
              label="Label Kecil (Eyebrow)"
              value={eyebrow}
              max={60}
              required
              hint="Tampil di: Beranda, bagian Testimoni, pill di atas judul."
            />
            <input
              id="testi-eyebrow"
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
                htmlFor="testi-heading"
                label="Judul Utama"
                value={heading}
                max={80}
                required
                hint="Tampil di: Beranda, bagian Testimoni, baris pertama judul."
              />
              <input
                id="testi-heading"
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
                htmlFor="testi-accent"
                label="Aksen Judul (Hijau)"
                value={headingAccent}
                max={80}
                hint="Tampil di: Beranda, bagian Testimoni, baris kedua judul."
              />
              <input
                id="testi-accent"
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
              htmlFor="testi-desc"
              label="Deskripsi Bagian"
              value={description}
              max={280}
              hint="Tampil di: Beranda, bagian Testimoni, paragraf di bawah judul."
            />
            <textarea
              id="testi-desc"
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
      </div>

      {/* Strip Angka Ringkasan */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0F1F17]">
              Strip Angka Ringkasan ({stats.length}/{TESTIMONIALS_STATS_MAX})
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D]">
              Tampil di: Beranda, bagian Testimoni, strip ringkasan di atas
              kartu testimoni.
            </p>
          </div>
          <button
            type="button"
            disabled={stats.length >= TESTIMONIALS_STATS_MAX}
            onClick={addStat}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tambah Angka</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-4 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => updateField("showStats", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">
                Tampilkan strip ringkasan
              </span>
              <span className="block text-xs text-[#43594D]">
                Tampil di: Beranda, bagian Testimoni, strip ringkasan
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm font-medium text-[#0F1F17]">
            <input
              type="checkbox"
              checked={statsAreSample}
              onChange={(e) => updateField("statsAreSample", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#CBD8D0] accent-[#143D29]"
            />
            <span>
              <span className="block font-semibold">
                Tandai angka sebagai contoh
              </span>
              <span className="block text-xs text-[#43594D]">
                Menampilkan pengingat contoh jika label Contoh aktif
              </span>
            </span>
          </label>
        </div>

        {fieldErrors.stats && (
          <p role="alert" className="text-xs font-medium text-[#B91C1C]">
            {fieldErrors.stats}
          </p>
        )}

        {stats.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#CBD8D0] bg-[#F8FBF9] p-4 text-center text-xs text-[#43594D]">
            Belum ada angka ringkasan. Strip tidak akan ditampilkan di beranda.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.map((stat, idx) => (
              <div
                key={stat.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-[#DCE8DF] bg-[#F8FBF9] p-3.5 sm:grid-cols-12 sm:items-end"
              >
                <div className="sm:col-span-4">
                  <CounterHeader
                    htmlFor={`stat-val-${idx}`}
                    label="Nilai / Angka"
                    value={stat.value}
                    max={12}
                    required
                    hint="Tampil di: Beranda, bagian Testimoni, strip ringkasan."
                  />
                  <input
                    id={`stat-val-${idx}`}
                    type="text"
                    placeholder="mis. 4,9/5"
                    value={stat.value}
                    onChange={(e) => updateStat(idx, { value: e.target.value })}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                  />
                  {fieldErrors[`stats.${idx}.value`] && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-medium text-[#B91C1C]"
                    >
                      {fieldErrors[`stats.${idx}.value`]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-5">
                  <CounterHeader
                    htmlFor={`stat-lbl-${idx}`}
                    label="Label Keterangan"
                    value={stat.label}
                    max={40}
                    required
                    hint="Tampil di: Beranda, bagian Testimoni, strip ringkasan."
                  />
                  <input
                    id={`stat-lbl-${idx}`}
                    type="text"
                    placeholder="mis. Rata-rata ulasan"
                    value={stat.label}
                    onChange={(e) => updateStat(idx, { label: e.target.value })}
                    className="mt-1 min-h-[40px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-1.5 text-sm"
                  />
                  {fieldErrors[`stats.${idx}.label`] && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-medium text-[#B91C1C]"
                    >
                      {fieldErrors[`stats.${idx}.label`]}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1.5 sm:col-span-3">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveStat(idx, -1)}
                    aria-label={`Pindahkan angka ${idx + 1} ke atas`}
                    className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === stats.length - 1}
                    onClick={() => moveStat(idx, 1)}
                    aria-label={`Pindahkan angka ${idx + 1} ke bawah`}
                    className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStat(idx)}
                    aria-label={`Hapus angka ${idx + 1}`}
                    className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#E5B8B8] bg-white text-[#991B1B] hover:bg-[#FDF2F2]"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daftar Testimoni */}
      <div className="space-y-4 rounded-2xl border border-[#CBD8D0] bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0F1F17]">
              Daftar Testimoni ({items.length}/{TESTIMONIALS_MAX_ITEMS})
            </h2>
            <p className="mt-0.5 text-xs text-[#43594D]">
              Tampil di: Beranda, bagian Testimoni, kartu sorotan &amp; daftar
              kartu.
            </p>
          </div>
          <button
            type="button"
            disabled={items.length >= TESTIMONIALS_MAX_ITEMS}
            onClick={addItem}
            className="inline-flex min-h-[40px] cursor-pointer items-center gap-1.5 rounded-xl bg-[#143D29] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0E2B1D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tambah Testimoni</span>
          </button>
        </div>

        {fieldErrors.items && (
          <p role="alert" className="text-xs font-medium text-[#B91C1C]">
            {fieldErrors.items}
          </p>
        )}
        {uploadError && (
          <p role="alert" className="text-xs font-medium text-[#B91C1C]">
            {uploadError}
          </p>
        )}

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD8D0] bg-[#F8FBF9] p-6 text-center text-sm text-[#43594D]">
            Belum ada testimoni. Bagian Testimoni tidak akan tampil di beranda
            selama daftar masih kosong.
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((item, idx) => {
              const isFeatured =
                featuredId === item.id || (!featuredId && idx === 0);

              return (
                <div
                  key={item.id}
                  className={`space-y-4 rounded-2xl border p-4 sm:p-5 ${
                    isFeatured
                      ? "border-[#15803D] bg-[#F4FAF6]"
                      : "border-[#DCE8DF] bg-[#F8FBF9]"
                  }`}
                >
                  {/* Item Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE8DF] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#0F1F17] border border-[#CBD8D0]">
                        Testimoni #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateField("featuredId", item.id)}
                        className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                          isFeatured
                            ? "bg-[#143D29] text-white"
                            : "border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE]"
                        }`}
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            isFeatured ? "fill-[#86EFAC] text-[#86EFAC]" : ""
                          }`}
                          aria-hidden="true"
                        />
                        <span>
                          {isFeatured ? "Sorotan Utama" : "Jadikan sorotan"}
                        </span>
                      </button>

                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#CBD8D0] bg-white px-2.5 py-1 text-xs font-semibold text-[#143D29]">
                        <input
                          type="checkbox"
                          checked={item.isSample}
                          onChange={(e) =>
                            updateItem(idx, { isSample: e.target.checked })
                          }
                          className="h-3.5 w-3.5 rounded border-[#CBD8D0] accent-[#143D29]"
                        />
                        <span>Tandai sebagai contoh</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, -1)}
                        aria-label={`Pindahkan Testimoni ${idx + 1} ke atas`}
                        className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => moveItem(idx, 1)}
                        aria-label={`Pindahkan Testimoni ${idx + 1} ke bawah`}
                        className="inline-flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-lg border border-[#CBD8D0] bg-white text-[#143D29] hover:bg-[#EAF3EE] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        aria-label={`Hapus Testimoni ${idx + 1}`}
                        className="inline-flex min-h-[36px] cursor-pointer items-center gap-1 rounded-lg border border-[#E5B8B8] bg-white px-2.5 py-1 text-xs font-semibold text-[#991B1B] hover:bg-[#FDF2F2]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  <div>
                    <CounterHeader
                      htmlFor={`testi-quote-${idx}`}
                      label="Kutipan Testimoni (30–280 karakter)"
                      value={item.quote}
                      max={280}
                      required
                      hint="Tampil di: Beranda, bagian Testimoni, isi kutipan pada kartu."
                    />
                    <textarea
                      id={`testi-quote-${idx}`}
                      rows={3}
                      value={item.quote}
                      onChange={(e) =>
                        updateItem(idx, { quote: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#CBD8D0] bg-white px-3.5 py-2 text-sm"
                    />
                    {fieldErrors[`items.${idx}.quote`] && (
                      <p
                        role="alert"
                        className="mt-1 text-xs font-medium text-[#B91C1C]"
                      >
                        {fieldErrors[`items.${idx}.quote`]}
                      </p>
                    )}
                  </div>

                  {/* Name, Role, Location */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <CounterHeader
                        htmlFor={`testi-name-${idx}`}
                        label="Nama Pelanggan"
                        value={item.name}
                        max={60}
                        required
                        hint="Tampil di: Beranda, bagian Testimoni, nama penulis."
                      />
                      <input
                        id={`testi-name-${idx}`}
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(idx, { name: e.target.value })
                        }
                        className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {fieldErrors[`items.${idx}.name`] && (
                        <p
                          role="alert"
                          className="mt-1 text-xs font-medium text-[#B91C1C]"
                        >
                          {fieldErrors[`items.${idx}.name`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <CounterHeader
                        htmlFor={`testi-role-${idx}`}
                        label="Peran / Komoditas"
                        value={item.role}
                        max={60}
                        hint="Tampil di: Beranda, bagian Testimoni, keterangan di bawah nama."
                      />
                      <input
                        id={`testi-role-${idx}`}
                        type="text"
                        placeholder="mis. Petani cabai"
                        value={item.role}
                        onChange={(e) =>
                          updateItem(idx, { role: e.target.value })
                        }
                        className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {fieldErrors[`items.${idx}.role`] && (
                        <p
                          role="alert"
                          className="mt-1 text-xs font-medium text-[#B91C1C]"
                        >
                          {fieldErrors[`items.${idx}.role`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <CounterHeader
                        htmlFor={`testi-loc-${idx}`}
                        label="Lokasi"
                        value={item.location}
                        max={60}
                        hint="Tampil di: Beranda, bagian Testimoni, kota/daerah di samping peran."
                      />
                      <input
                        id={`testi-loc-${idx}`}
                        type="text"
                        placeholder="mis. Kediri"
                        value={item.location}
                        onChange={(e) =>
                          updateItem(idx, { location: e.target.value })
                        }
                        className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {fieldErrors[`items.${idx}.location`] && (
                        <p
                          role="alert"
                          className="mt-1 text-xs font-medium text-[#B91C1C]"
                        >
                          {fieldErrors[`items.${idx}.location`]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tag & Rating */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <CounterHeader
                        htmlFor={`testi-tag-${idx}`}
                        label="Tag Produk / Layanan"
                        value={item.tag}
                        max={40}
                        hint="Tampil di: Beranda, bagian Testimoni, label pill di atas kutipan."
                      />
                      <input
                        id={`testi-tag-${idx}`}
                        type="text"
                        value={item.tag}
                        onChange={(e) =>
                          updateItem(idx, { tag: e.target.value })
                        }
                        className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      />
                      {fieldErrors[`items.${idx}.tag`] && (
                        <p
                          role="alert"
                          className="mt-1 text-xs font-medium text-[#B91C1C]"
                        >
                          {fieldErrors[`items.${idx}.tag`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor={`testi-rating-${idx}`}
                        className="block text-sm font-semibold text-[#143D29]"
                      >
                        Rating Bintang (Opsional)
                      </label>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Testimoni, jika opsi
                        Tampilkan rating aktif.
                      </p>
                      <select
                        id={`testi-rating-${idx}`}
                        value={item.rating === null ? "" : String(item.rating)}
                        onChange={(e) =>
                          updateItem(idx, {
                            rating:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                        className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Tanpa rating</option>
                        <option value="5">5 Bintang</option>
                        <option value="4">4 Bintang</option>
                        <option value="3">3 Bintang</option>
                        <option value="2">2 Bintang</option>
                        <option value="1">1 Bintang</option>
                      </select>
                      {fieldErrors[`items.${idx}.rating`] && (
                        <p
                          role="alert"
                          className="mt-1 text-xs font-medium text-[#B91C1C]"
                        >
                          {fieldErrors[`items.${idx}.rating`]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Photo Upload with Remove */}
                  <div className="space-y-3 rounded-xl border border-[#DCE8DF] bg-white p-4">
                    <div>
                      <p className="text-sm font-semibold text-[#143D29]">
                        Foto Pelanggan (Opsional)
                      </p>
                      <p className="mt-0.5 text-xs text-[#43594D]">
                        Tampil di: Beranda, bagian Testimoni, avatar bulat pada
                        kartu (jika kosong, tampil inisial nama).
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {item.photoSrc ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={item.photoSrc}
                            alt={item.photoAlt || item.name || "Pratinjau foto"}
                            className="h-14 w-14 rounded-full border border-[#CBD8D0] object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateItem(idx, { photoSrc: "", photoAlt: "" })
                            }
                            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-xl border border-[#E5B8B8] bg-[#FDF2F2] px-3 py-1.5 text-xs font-semibold text-[#7F1D1D] hover:bg-[#FCE8E8]"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Hapus foto</span>
                          </button>
                        </div>
                      ) : null}

                      <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#9DB5A7] bg-[#F8FBF9] px-3.5 py-2 text-xs font-semibold text-[#143D29] hover:border-[#143D29]">
                        <UploadCloud className="h-4 w-4 text-[#15803D]" aria-hidden="true" />
                        <span>
                          {uploadingIdx === idx
                            ? "Mengunggah..."
                            : item.photoSrc
                              ? "Ganti Foto"
                              : "Unggah Foto (JPG/PNG/WebP, maks 2 MB)"}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={uploadingIdx === idx}
                          onChange={(e) => handlePhotoUpload(idx, e)}
                          className="sr-only"
                        />
                      </label>
                    </div>

                    {fieldErrors[`items.${idx}.photoSrc`] && (
                      <p
                        role="alert"
                        className="text-xs font-medium text-[#B91C1C]"
                      >
                        {fieldErrors[`items.${idx}.photoSrc`]}
                      </p>
                    )}

                    {item.photoSrc ? (
                      <div>
                        <CounterHeader
                          htmlFor={`testi-alt-${idx}`}
                          label="Teks Alternatif Foto"
                          value={item.photoAlt}
                          max={160}
                          required
                          hint="Tampil di: Beranda, bagian Testimoni, atribut alt pada foto avatar."
                        />
                        <input
                          id={`testi-alt-${idx}`}
                          type="text"
                          value={item.photoAlt}
                          onChange={(e) =>
                            updateItem(idx, { photoAlt: e.target.value })
                          }
                          className="mt-1.5 min-h-[42px] w-full rounded-xl border border-[#CBD8D0] bg-white px-3 py-2 text-sm"
                        />
                        {fieldErrors[`items.${idx}.photoAlt`] && (
                          <p
                            role="alert"
                            className="mt-1 text-xs font-medium text-[#B91C1C]"
                          >
                            {fieldErrors[`items.${idx}.photoAlt`]}
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
