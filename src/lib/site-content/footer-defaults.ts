import type { SupportedIconName } from "@/lib/site-content/icons";
import type { CtaTarget } from "@/lib/site-content/hero-cta";

export interface FooterHighlightItem {
  icon: SupportedIconName;
  title: string;
  subtitle: string;
}

export interface FooterFlagshipCard {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  linkLabel: string;
  target: CtaTarget;
}

export interface FooterNavLink {
  label: string;
  target: CtaTarget;
}

export interface FooterLinkColumn {
  heading: string;
  links: FooterNavLink[];
}

export interface FooterSocialLink {
  platform: string;
  url: string;
}

export interface FooterData {
  highlights: FooterHighlightItem[];
  logoSrc: string;
  logoAlt: string;
  brandSubtitle: string;
  blurb: string;
  flagshipCard: FooterFlagshipCard;
  linkColumns: FooterLinkColumn[];
  productCategoriesHeading: string;
  featuredArticlesHeading: string;
  channelsHeading: string;
  storeCardBadge: string;
  storeCardBadgeRight: string;
  storeCardTitle: string;
  storeCardDescription: string;
  storeButtonLabel: string;
  whatsappCardTitle: string;
  whatsappCardDescription: string;
  whatsappButtonLabel: string;
  contactHeading: string;
  socialLinks: FooterSocialLink[];
  copyrightText: string;
  legalBadges: string[];
}

export const DEFAULT_FOOTER_LOGO_SRC = "/brand/logo-mark-light.png";

export const DEFAULT_FOOTER_DATA: FooterData = {
  highlights: [
    {
      icon: "ShieldCheck",
      title: "Standar Mutu Terjaga",
      subtitle: "Spesifikasi komposisi & takaran jelas pada label kemasan resmi",
    },
    {
      icon: "Package",
      title: "Kemasan 500 gr & 1 kg",
      subtitle: "Ukuran praktis untuk uji lahan maupun pemakaian rutin musim tanam",
    },
    {
      icon: "MapPin",
      title: "Distribusi Nasional",
      subtitle: "Pengiriman ke berbagai wilayah via mitra & marketplace resmi",
    },
  ],
  logoSrc: "",
  logoAlt: "",
  brandSubtitle: "Sarana Produksi Pertanian",
  blurb:
    "Mitra penyedia sarana produksi pertanian, pupuk, pembenah tanah, dan nutrisi tanaman. Pemesanan daring resmi dilayani melalui toko Tani InD® Indonesia di Shopee.",
  flagshipCard: {
    enabled: true,
    eyebrow: "Lini Unggulan Arga Tani Mandiri",
    title: "Tamatric: Asam Humat & Trichoderma",
    description:
      "Sinergi pembenah tanah organik dan agensia hayati pelindung perakaran tanaman.",
    linkLabel: "Pelajari Cara Kerja & Manfaat",
    target: {
      type: "page",
      value:
        "/artikel/manfaat-trichoderma-dan-asam-humat-dalam-mengembalikan-kesuburan-tanah",
    },
  },
  linkColumns: [
    {
      heading: "Menu Utama",
      links: [
        { label: "Beranda", target: { type: "page", value: "/" } },
        {
          label: "Kategori Produk",
          target: { type: "section", value: "produk" },
        },
        {
          label: "Tentang Kami",
          target: { type: "section", value: "tentang-kami" },
        },
        {
          label: "Artikel Edukasi",
          target: { type: "section", value: "artikel-edukasi" },
        },
        {
          label: "Pusat Panduan Tani",
          target: { type: "page", value: "/artikel" },
        },
      ],
    },
  ],
  productCategoriesHeading: "Lini Produk",
  featuredArticlesHeading: "Panduan Budidaya Pilihan",
  channelsHeading: "Akses & Saluran Resmi",
  storeCardBadge: "Marketplace Resmi",
  storeCardBadgeRight: "Shopee Official",
  storeCardTitle: "Toko Resmi Marketplace",
  storeCardDescription:
    "Kunjungi toko resmi Tani InD® Indonesia di Shopee untuk melihat etalase produk yang tersedia.",
  storeButtonLabel: "Kunjungi Tani InD® di Shopee",
  whatsappCardTitle: "Pendampingan Petani & Mitra",
  whatsappCardDescription:
    "Hubungi tim kami untuk informasi dosis pemakaian dan ketersediaan stok kemasan.",
  whatsappButtonLabel: "WhatsApp Layanan Resmi",
  contactHeading: "Informasi Kontak",
  socialLinks: [],
  copyrightText:
    "Hak Cipta © {tahun} {perusahaan}. Seluruh hak cipta dilindungi.",
  legalBadges: [
    "Sarana Produksi Pertanian Indonesia",
    "Tani InD® Official Store",
  ],
};

export function cloneFooterDefaults(): FooterData {
  return {
    ...DEFAULT_FOOTER_DATA,
    highlights: DEFAULT_FOOTER_DATA.highlights.map((h) => ({ ...h })),
    flagshipCard: {
      ...DEFAULT_FOOTER_DATA.flagshipCard,
      target: { ...DEFAULT_FOOTER_DATA.flagshipCard.target },
    },
    linkColumns: DEFAULT_FOOTER_DATA.linkColumns.map((col) => ({
      heading: col.heading,
      links: col.links.map((lnk) => ({
        label: lnk.label,
        target: { ...lnk.target },
      })),
    })),
    socialLinks: [],
    legalBadges: [...DEFAULT_FOOTER_DATA.legalBadges],
  };
}
