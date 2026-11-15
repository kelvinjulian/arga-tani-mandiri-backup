export type ChipOverflowMode = "menu" | "scroll";

export interface FilterChipsConfig {
  maxVisibleChips: number;
  overflowMode: ChipOverflowMode;
  allTopicsLabel: string;
  moreLabel: string;
  showArticleCounts: boolean;
}

export const DEFAULT_FILTER_CHIPS_CONFIG: FilterChipsConfig = {
  maxVisibleChips: 6,
  overflowMode: "menu",
  allTopicsLabel: "Semua Topik",
  moreLabel: "Lainnya",
  showArticleCounts: false,
};

export function mergeFilterChipsConfig(
  raw: Record<string, unknown>,
  fallback: FilterChipsConfig = DEFAULT_FILTER_CHIPS_CONFIG
): FilterChipsConfig {
  const maxVisibleRaw =
    typeof raw.maxVisibleChips === "number" &&
    Number.isFinite(raw.maxVisibleChips)
      ? Math.round(raw.maxVisibleChips)
      : fallback.maxVisibleChips;

  const maxVisibleChips =
    maxVisibleRaw >= 3 && maxVisibleRaw <= 12
      ? maxVisibleRaw
      : fallback.maxVisibleChips;

  const overflowMode: ChipOverflowMode =
    raw.overflowMode === "scroll" || raw.overflowMode === "menu"
      ? raw.overflowMode
      : fallback.overflowMode;

  const allTopicsLabel =
    typeof raw.allTopicsLabel === "string" && raw.allTopicsLabel.trim()
      ? raw.allTopicsLabel.trim()
      : fallback.allTopicsLabel;

  const moreLabel =
    typeof raw.moreLabel === "string" && raw.moreLabel.trim()
      ? raw.moreLabel.trim()
      : fallback.moreLabel;

  const showArticleCounts =
    typeof raw.showArticleCounts === "boolean"
      ? raw.showArticleCounts
      : fallback.showArticleCounts;

  return {
    maxVisibleChips,
    overflowMode,
    allTopicsLabel,
    moreLabel,
    showArticleCounts,
  };
}

export function validateFilterChipsInput(
  input: Record<string, unknown>,
  fieldErrors: Record<string, string>,
  fallback: FilterChipsConfig = DEFAULT_FILTER_CHIPS_CONFIG
): FilterChipsConfig {
  const rawMax =
    typeof input.maxVisibleChips === "number"
      ? input.maxVisibleChips
      : typeof input.maxVisibleChips === "string"
        ? Number(input.maxVisibleChips)
        : fallback.maxVisibleChips;

  let maxVisibleChips = fallback.maxVisibleChips;
  if (!Number.isInteger(rawMax) || rawMax < 3 || rawMax > 12) {
    fieldErrors.maxVisibleChips =
      "Jumlah maksimal chip terlihat harus antara 3 hingga 12.";
  } else {
    maxVisibleChips = rawMax;
  }

  const rawMode = input.overflowMode;
  let overflowMode: ChipOverflowMode = fallback.overflowMode;
  if (rawMode !== undefined) {
    if (rawMode !== "menu" && rawMode !== "scroll") {
      fieldErrors.overflowMode = "Mode luapan kategori tidak valid.";
    } else {
      overflowMode = rawMode;
    }
  }

  const allTopicsRaw =
    typeof input.allTopicsLabel === "string" ? input.allTopicsLabel.trim() : "";
  if (!allTopicsRaw) {
    fieldErrors.allTopicsLabel = "Label tombol Semua Topik wajib diisi.";
  } else if (allTopicsRaw.length > 40) {
    fieldErrors.allTopicsLabel = "Label Semua Topik maksimal 40 karakter.";
  }

  const moreRaw =
    typeof input.moreLabel === "string"
      ? input.moreLabel.trim()
      : fallback.moreLabel;
  if (!moreRaw) {
    fieldErrors.moreLabel = "Label tombol Lainnya wajib diisi.";
  } else if (moreRaw.length > 30) {
    fieldErrors.moreLabel = "Label tombol Lainnya maksimal 30 karakter.";
  }

  const showArticleCounts =
    typeof input.showArticleCounts === "boolean"
      ? input.showArticleCounts
      : fallback.showArticleCounts;

  return {
    maxVisibleChips,
    overflowMode,
    allTopicsLabel: allTopicsRaw || fallback.allTopicsLabel,
    moreLabel: moreRaw || fallback.moreLabel,
    showArticleCounts,
  };
}
