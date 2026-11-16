import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";

export const HOME_SECTION_IDS = {
  BERANDA: "beranda",
  PRODUK: "produk",
  TENTANG_KAMI: "tentang-kami",
  TESTIMONI: "testimoni",
  VIDEO: "video",
  ARTIKEL_EDUKASI: "artikel-edukasi",
  KONSULTASI_WHATSAPP: "konsultasi-whatsapp",
  KONTAK: "kontak",
} as const;

export type HomeSectionId =
  (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export const HOME_SECTION_OPTIONS: ReadonlyArray<{
  id: HomeSectionId;
  label: string;
}> = [
  { id: HOME_SECTION_IDS.BERANDA, label: "Beranda (Atas halaman)" },
  { id: HOME_SECTION_IDS.PRODUK, label: "Kategori Produk (#produk)" },
  { id: HOME_SECTION_IDS.TENTANG_KAMI, label: "Tentang Kami (#tentang-kami)" },
  { id: HOME_SECTION_IDS.TESTIMONI, label: "Testimoni (#testimoni)" },
  { id: HOME_SECTION_IDS.VIDEO, label: "Video Edukasi (#video)" },
  {
    id: HOME_SECTION_IDS.ARTIKEL_EDUKASI,
    label: "Artikel Edukasi (#artikel-edukasi)",
  },
  {
    id: HOME_SECTION_IDS.KONSULTASI_WHATSAPP,
    label: "Konsultasi WhatsApp (#konsultasi-whatsapp)",
  },
  { id: HOME_SECTION_IDS.KONTAK, label: "Kontak & Footer (#kontak)" },
];

export const PUBLIC_PAGE_OPTIONS: ReadonlyArray<{
  path: "/" | "/artikel";
  label: string;
}> = [
  { path: "/", label: "Beranda (/)" },
  { path: "/artikel", label: "Artikel Edukasi (/artikel)" },
];

export const CTA_TARGET_TYPES = [
  "section",
  "page",
  "whatsapp",
  "shopee",
  "external",
] as const;

export type CtaTargetType = (typeof CTA_TARGET_TYPES)[number];

export const CTA_ICON_OPTIONS = ["auto", "arrow-right", "arrow-down"] as const;

export type CtaIconOption = (typeof CTA_ICON_OPTIONS)[number];

export interface CtaTarget {
  type: CtaTargetType;
  value: string;
}

export interface HeroCtaButton {
  label: string;
  enabled: boolean;
  target: CtaTarget;
  icon?: CtaIconOption;
}

export const DEFAULT_PRIMARY_CTA: HeroCtaButton = {
  label: "Tentang Arga Tani Mandiri",
  enabled: true,
  target: { type: "section", value: HOME_SECTION_IDS.TENTANG_KAMI },
  icon: "arrow-down",
};

export const DEFAULT_SECONDARY_CTA: HeroCtaButton = {
  label: "Kunjungi Tani InD® di Shopee",
  enabled: true,
  target: { type: "shopee", value: "" },
};

const SECTION_ID_SET = new Set<string>(HOME_SECTION_OPTIONS.map((o) => o.id));
const PUBLIC_PAGE_SET = new Set<string>(
  PUBLIC_PAGE_OPTIONS.map((o) => o.path)
);

export function isCtaIconOption(value: unknown): value is CtaIconOption {
  return (
    typeof value === "string" &&
    (CTA_ICON_OPTIONS as readonly string[]).includes(value)
  );
}

export function resolveHeroCtaIcon(
  cta: Pick<HeroCtaButton, "icon" | "target">
): "arrow-right" | "arrow-down" {
  const icon = cta.icon ?? "auto";
  if (icon === "arrow-right" || icon === "arrow-down") {
    return icon;
  }
  return cta.target.type === "section" ? "arrow-down" : "arrow-right";
}

export function isCtaTargetType(value: unknown): value is CtaTargetType {
  return (
    typeof value === "string" &&
    (CTA_TARGET_TYPES as readonly string[]).includes(value)
  );
}

export function isValidHomeSectionId(value: unknown): value is HomeSectionId {
  return typeof value === "string" && SECTION_ID_SET.has(value);
}

export function isValidPublicPagePath(value: unknown): boolean {
  return (
    typeof value === "string" &&
    (PUBLIC_PAGE_SET.has(value) || /^\/artikel\/[a-z0-9-]+$/.test(value))
  );
}

export function isValidExternalHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export type ResolvedHeroCta =
  | { kind: "disabled" }
  | { kind: "whatsapp-placeholder"; text: string }
  | { kind: "link"; href: string; isExternal: boolean };

export function resolveHeroCta(
  cta: HeroCtaButton,
  company: { whatsappNumber: string | null; shopeeStoreUrl: string },
  fallback: HeroCtaButton
): ResolvedHeroCta {
  if (!cta.enabled) {
    return { kind: "disabled" };
  }

  const target = cta.target;

  if (target.type === "section") {
    if (isValidHomeSectionId(target.value)) {
      return { kind: "link", href: `/#${target.value}`, isExternal: false };
    }
  } else if (target.type === "page") {
    if (isValidPublicPagePath(target.value)) {
      return { kind: "link", href: target.value, isExternal: false };
    }
  } else if (target.type === "whatsapp") {
    const waHref = getWhatsAppHref(company.whatsappNumber);
    if (!waHref) {
      return { kind: "whatsapp-placeholder", text: WHATSAPP_PLACEHOLDER_TEXT };
    }
    return { kind: "link", href: waHref, isExternal: true };
  } else if (target.type === "shopee") {
    if (isValidExternalHttpsUrl(company.shopeeStoreUrl)) {
      return { kind: "link", href: company.shopeeStoreUrl, isExternal: true };
    }
  } else if (target.type === "external") {
    if (isValidExternalHttpsUrl(target.value)) {
      return { kind: "link", href: target.value, isExternal: true };
    }
  }

  // Safety net: fall back to static default if target is invalid/missing
  if (fallback.target.type === "shopee") {
    return { kind: "link", href: company.shopeeStoreUrl, isExternal: true };
  }
  return {
    kind: "link",
    href: `/#${HOME_SECTION_IDS.PRODUK}`,
    isExternal: false,
  };
}
