import { SHOPEE_STORE_URL } from "@/data/categories";
import { HOME_SECTION_IDS } from "@/lib/site-content/hero-cta";

export const NAVBAR_MIN_ITEMS = 1;
export const NAVBAR_MAX_ITEMS = 8;
export const NAVBAR_LABEL_MAX = 24;
export const NAVBAR_BRAND_TITLE_MAX = 40;
export const NAVBAR_BRAND_SUBTITLE_MAX = 48;

export const DEFAULT_NAVBAR_LOGO_SRC = "/brand/logo-mark.png";
export const DEFAULT_NAVBAR_LOGO_ALT = "";
export const DEFAULT_NAVBAR_BRAND_TITLE = "Arga Tani Mandiri";
export const DEFAULT_NAVBAR_BRAND_SUBTITLE = "Sarana Produksi Pertanian";

export const NAVBAR_ITEM_STYLES = [
  "link",
  "button-primary",
  "button-outline",
] as const;

export type NavbarItemStyle = (typeof NAVBAR_ITEM_STYLES)[number];

export const NAVBAR_TARGET_TYPES = [
  "section",
  "page",
  "external",
  "whatsapp",
] as const;

export type NavbarTargetType = (typeof NAVBAR_TARGET_TYPES)[number];

export interface NavbarTarget {
  type: NavbarTargetType;
  value: string;
}

export interface NavbarItem {
  id: string;
  label: string;
  enabled: boolean;
  target: NavbarTarget;
  style: NavbarItemStyle;
  openInNewTab: boolean;
}

export interface NavbarData {
  logoSrc?: string;
  logoAlt?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  items: NavbarItem[];
}

export const DEFAULT_NAVBAR_ITEMS: ReadonlyArray<NavbarItem> = [
  {
    id: "beranda",
    label: "Beranda",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.BERANDA },
    style: "link",
    openInNewTab: false,
  },
  {
    id: "produk",
    label: "Produk",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.PRODUK },
    style: "link",
    openInNewTab: false,
  },
  {
    id: "tentang-kami",
    label: "Tentang Kami",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.TENTANG_KAMI },
    style: "link",
    openInNewTab: false,
  },
  {
    id: "artikel-edukasi",
    label: "Artikel Edukasi",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.ARTIKEL_EDUKASI },
    style: "link",
    openInNewTab: false,
  },
  {
    id: "kontak",
    label: "Kontak",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.KONTAK },
    style: "link",
    openInNewTab: false,
  },
  {
    id: "chat-wa",
    label: "Chat WA",
    enabled: true,
    target: { type: "section", value: HOME_SECTION_IDS.KONSULTASI_WHATSAPP },
    style: "button-outline",
    openInNewTab: false,
  },
  {
    id: "toko-shopee",
    label: "Toko Shopee",
    enabled: true,
    target: { type: "external", value: SHOPEE_STORE_URL },
    style: "button-primary",
    openInNewTab: true,
  },
];

export const DEFAULT_NAVBAR_DATA: NavbarData = {
  logoSrc: DEFAULT_NAVBAR_LOGO_SRC,
  logoAlt: DEFAULT_NAVBAR_LOGO_ALT,
  brandTitle: DEFAULT_NAVBAR_BRAND_TITLE,
  brandSubtitle: DEFAULT_NAVBAR_BRAND_SUBTITLE,
  items: DEFAULT_NAVBAR_ITEMS.map((item) => ({
    ...item,
    target: { ...item.target },
  })),
};

export function cloneNavbarDefaults(): NavbarData {
  return {
    logoSrc: DEFAULT_NAVBAR_LOGO_SRC,
    logoAlt: DEFAULT_NAVBAR_LOGO_ALT,
    brandTitle: DEFAULT_NAVBAR_BRAND_TITLE,
    brandSubtitle: DEFAULT_NAVBAR_BRAND_SUBTITLE,
    items: DEFAULT_NAVBAR_ITEMS.map((item) => ({
      ...item,
      target: { ...item.target },
    })),
  };
}

export function isNavbarItemStyle(value: unknown): value is NavbarItemStyle {
  return (
    typeof value === "string" &&
    (NAVBAR_ITEM_STYLES as readonly string[]).includes(value)
  );
}

export function isNavbarTargetType(value: unknown): value is NavbarTargetType {
  return (
    typeof value === "string" &&
    (NAVBAR_TARGET_TYPES as readonly string[]).includes(value)
  );
}
