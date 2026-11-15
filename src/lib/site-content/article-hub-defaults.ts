import type { HeroCtaButton } from "@/lib/site-content/hero-cta";
import type { ChipOverflowMode } from "@/lib/site-content/filter-chips";

export interface ArticleHubData {
  eyebrow: string;
  headingMain: string;
  headingPill: string;
  headingAccent: string;
  description: string;
  allArticlesCta: HeroCtaButton;
  allTopicsLabel: string;
  maxVisibleChips: number;
  overflowMode: ChipOverflowMode;
  moreLabel: string;
  showArticleCounts: boolean;
  featuredBadgePrefix: string;
  featuredReadMoreLabel: string;
  secondaryReadMoreLabel: string;
  maxSecondaryArticles: number;
  emptyStateText: string;
  bannerEyebrow: string;
  bannerHeading: string;
  bannerDescription: string;
  whatsappCardTitle: string;
  whatsappCardSubtitle: string;
  shopeeCardTitle: string;
  shopeeCardSubtitle: string;
  bannerImageSrc: string;
  bannerImageAlt: string;
}

export const DEFAULT_ARTICLE_HUB_ALL_CTA: HeroCtaButton = {
  label: "Lihat Semua Artikel",
  enabled: true,
  target: { type: "page", value: "/artikel" },
};

export const DEFAULT_ARTICLE_HUB: ArticleHubData = {
  eyebrow: "Pusat Edukasi & Panduan Tani",
  headingMain: "Wawasan Budidaya &",
  headingPill: "Panduan Aplikasi",
  headingAccent: "Sarana Pertanian",
  description:
    "Panduan praktis memahami dosis label kemasan, manajemen nutrisi musim tanam, serta pemulihan kesuburan tanah.",
  allArticlesCta: {
    label: DEFAULT_ARTICLE_HUB_ALL_CTA.label,
    enabled: DEFAULT_ARTICLE_HUB_ALL_CTA.enabled,
    target: { ...DEFAULT_ARTICLE_HUB_ALL_CTA.target },
  },
  allTopicsLabel: "Semua Topik",
  maxVisibleChips: 6,
  overflowMode: "menu",
  moreLabel: "Lainnya",
  showArticleCounts: false,
  featuredBadgePrefix: "Panduan Utama",
  featuredReadMoreLabel: "Baca Panduan Lengkap",
  secondaryReadMoreLabel: "Baca Panduan",
  maxSecondaryArticles: 3,
  emptyStateText: "",
  bannerEyebrow: "Butuh Solusi Spesifik?",
  bannerHeading: "Ingin Rekomendasi Produk yang Tepat untuk Lahan Anda?",
  bannerDescription:
    "Konsultasikan kebutuhan budidaya Anda atau temukan produk unggulan kami di marketplace resmi Tani InD® Indonesia.",
  whatsappCardTitle: "Konsultasi via WhatsApp",
  whatsappCardSubtitle: "Tanya dosis & solusi lahan",
  shopeeCardTitle: "Kunjungi Toko di Shopee",
  shopeeCardSubtitle: "Official Store Tani InD®",
  bannerImageSrc: "",
  bannerImageAlt: "",
};
