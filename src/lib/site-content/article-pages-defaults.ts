import {
  DEFAULT_FILTER_CHIPS_CONFIG,
  type FilterChipsConfig,
} from "@/lib/site-content/filter-chips";

export const DEFAULT_ARTICLE_PAGE_OG_IMAGE = "/images/hero-agriculture.jpg";
export const DEFAULT_ARTICLE_PAGE_OG_ALT =
  "Aktivitas pertanian di lahan budidaya";

export interface ArticlePageData extends FilterChipsConfig {
  seoTitle: string;
  metaDescription: string;
  ogImageSrc: string;
  ogImageAlt: string;
  breadcrumbHomeLabel: string;
  breadcrumbCurrentLabel: string;
  eyebrow: string;
  headingMain: string;
  headingPill: string;
  headingAccent: string;
  description: string;
  searchPlaceholder: string;
  featuredBadgeLabel: string;
  featuredReadMoreLabel: string;
  draftBadgeLabel: string;
  cardReadMoreLabel: string;
  emptyTitle: string;
  emptyResetLabel: string;
  sidebarPromoBadge: string;
  sidebarPromoTitle: string;
  sidebarPromoDescription: string;
  sidebarPromoPoints: string[];
  sidebarPromoButtonLabel: string;
  sidebarTopicsTitle: string;
  sidebarTopics: string[];
  sidebarConsultPrompt: string;
  sidebarConsultButtonLabel: string;
}

export const DEFAULT_ARTICLE_PAGE: ArticlePageData = {
  seoTitle: "Pusat Edukasi & Panduan Tani",
  metaDescription:
    "Panduan praktis pembacaan dosis label kemasan, manajemen nutrisi musim tanam, pemulihan kesuburan tanah, dan penyimpanan sarana produksi pertanian.",
  ogImageSrc: "",
  ogImageAlt: "",
  breadcrumbHomeLabel: "Beranda",
  breadcrumbCurrentLabel: "Artikel Edukasi",
  eyebrow: "Pusat Edukasi & Panduan Tani",
  headingMain: "Pusat Wawasan Budidaya &",
  headingPill: "Panduan Aplikasi",
  headingAccent: "Sarana Pertanian",
  description:
    "Temukan panduan praktis seputar pembacaan dosis label kemasan, manajemen nutrisi per musim tanam, pemulihan kesuburan tanah dengan Asam Humat dan Trichoderma, hingga standar penyimpanan sarana produksi pertanian.",
  searchPlaceholder:
    "Cari topik budidaya, nutrisi tanaman, atau dosis aplikasi...",
  ...DEFAULT_FILTER_CHIPS_CONFIG,
  featuredBadgeLabel: "Artikel Pilihan",
  featuredReadMoreLabel: "Baca Panduan Lengkap",
  draftBadgeLabel: "DRAFT: perlu ditinjau",
  cardReadMoreLabel: "Baca Selengkapnya",
  emptyTitle: "Belum Ada Panduan yang Sesuai Filter",
  emptyResetLabel: "Reset Pencarian & Filter",
  sidebarPromoBadge: "Solusi Unggulan",
  sidebarPromoTitle: "Tamatric: Asam Humat & Trichoderma",
  sidebarPromoDescription:
    "Pembenah tanah organik & agensia hayati untuk mencegah layu Fusarium serta mengoptimalkan serapan nutrisi akar.",
  sidebarPromoPoints: [
    "Memperbaiki struktur & pH tanah",
    "Melindungi akar dari jamur patogen",
    "Tersedia kemasan 500gr & 1kg",
  ],
  sidebarPromoButtonLabel: "Beli di Shopee Tani InD®",
  sidebarTopicsTitle: "Topik Populer & Konsultasi Cepat",
  sidebarTopics: [
    "Panduan Label",
    "Pembenah Tanah",
    "Asam Humat",
    "Trichoderma",
    "Manajemen Gudang",
    "Dosis Pupuk",
  ],
  sidebarConsultPrompt: "Punya kendala spesifik di lahan Anda?",
  sidebarConsultButtonLabel: "Konsultasi via WhatsApp",
};

export interface ArticleDetailData {
  breadcrumbHomeLabel: string;
  breadcrumbHubLabel: string;
  backToHubLabel: string;
  draftBadgeLabel: string;
  sectionEyebrow: string;
  sectionBulletsHeading: string;
  tocHeading: string;
  relatedHeading: string;
  bottomCtaBadge: string;
  bottomCtaHeadingTemplate: string;
  bottomCtaDescription: string;
  bottomCtaShopeeLabel: string;
  bottomCtaWhatsappLabel: string;
  sidebarPromoBadge: string;
  sidebarPromoTitle: string;
  sidebarPromoDescription: string;
  sidebarPromoPoints: string[];
  sidebarPromoButtonLabel: string;
}

export const DEFAULT_ARTICLE_DETAIL: ArticleDetailData = {
  breadcrumbHomeLabel: "Beranda",
  breadcrumbHubLabel: "Artikel Edukasi",
  backToHubLabel: "Kembali ke Pusat Artikel",
  draftBadgeLabel: "DRAFT: perlu ditinjau",
  sectionEyebrow: "Pembahasan Utama",
  sectionBulletsHeading: "Langkah & Poin Penting di Lapangan:",
  tocHeading: "Daftar Isi Panduan",
  relatedHeading: "Panduan Terkait Lainnya",
  bottomCtaBadge: "Solusi Sarana Pertanian Resmi",
  bottomCtaHeadingTemplate: "Dapatkan Produk Resmi Melalui {toko}",
  bottomCtaDescription:
    "Temukan lini produk pupuk, pembenah tanah Tamatric (Asam Humat & Trichoderma), dan nutrisi tanaman dalam kemasan 500 gr maupun 1 kg di toko resmi Shopee kami.",
  bottomCtaShopeeLabel: "Kunjungi Tani InD® di Shopee",
  bottomCtaWhatsappLabel: "Konsultasi via WhatsApp",
  sidebarPromoBadge: "Solusi Unggulan",
  sidebarPromoTitle: "Tamatric: Asam Humat & Trichoderma",
  sidebarPromoDescription:
    "Pembenah tanah organik & agensia hayati untuk mencegah layu Fusarium serta mengoptimalkan serapan nutrisi akar.",
  sidebarPromoPoints: [
    "Memperbaiki struktur & pH tanah",
    "Melindungi akar dari jamur patogen",
    "Tersedia kemasan 500gr & 1kg",
  ],
  sidebarPromoButtonLabel: "Beli di Shopee Tani InD®",
};

export function cloneArticlePageDefaults(): ArticlePageData {
  return {
    ...DEFAULT_ARTICLE_PAGE,
    sidebarPromoPoints: [...DEFAULT_ARTICLE_PAGE.sidebarPromoPoints],
    sidebarTopics: [...DEFAULT_ARTICLE_PAGE.sidebarTopics],
  };
}

export function cloneArticleDetailDefaults(): ArticleDetailData {
  return {
    ...DEFAULT_ARTICLE_DETAIL,
    sidebarPromoPoints: [...DEFAULT_ARTICLE_DETAIL.sidebarPromoPoints],
  };
}
