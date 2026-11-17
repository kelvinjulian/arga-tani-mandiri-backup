import { SHOPEE_STORE_URL, productCategories } from "@/data/categories";
import {
  DEFAULT_NAVBAR_DATA,
  type NavbarData,
} from "@/lib/site-content/navbar-defaults";
import {
  DEFAULT_PRIMARY_CTA,
  DEFAULT_SECONDARY_CTA,
  type HeroCtaButton,
} from "@/lib/site-content/hero-cta";
import {
  DEFAULT_ARTICLE_HUB,
  type ArticleHubData,
} from "@/lib/site-content/article-hub-defaults";
import {
  type ArticleDetailData,
  type ArticlePageData,
} from "@/lib/site-content/article-pages-defaults";
import {
  cloneFooterDefaults,
  type FooterData,
} from "@/lib/site-content/footer-defaults";
import {
  cloneTestimonialsDefaults,
  type TestimonialsData,
} from "@/lib/site-content/testimonials-defaults";
import {
  cloneVideoPageDefaults,
  cloneVideoSectionDefaults,
  type VideoPageData,
  type VideoSectionData,
} from "@/lib/site-content/video-defaults";
import {
  DEFAULT_ABOUT_COMMITMENT_CARDS,
  DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS,
  DEFAULT_ABOUT_EYEBROW,
  DEFAULT_ABOUT_HEADING_ACCENT,
  DEFAULT_ABOUT_HEADING_MAIN,
  DEFAULT_ABOUT_HISTORY_STEPS,
  DEFAULT_ABOUT_HISTORY_TAB_LABEL,
  DEFAULT_ABOUT_IMAGE_ALT,
  DEFAULT_ABOUT_IMAGE_BADGE,
  DEFAULT_ABOUT_IMAGE_SRC,
  DEFAULT_ABOUT_MISI_HEADING,
  DEFAULT_ABOUT_PROFILE_TAB_LABEL,
  DEFAULT_ABOUT_SUBHEADING,
  DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL,
  DEFAULT_ABOUT_VISI_HEADING,
  DEFAULT_ABOUT_WHY_CTA_LABEL,
  DEFAULT_ABOUT_WHY_EYEBROW,
  type AboutCommitmentCard,
  type AboutHistoryStep,
  type AboutImageBadge,
} from "@/lib/site-content/about-defaults";

export interface HeroTrustItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface HeroInfoItem {
  id: string;
  label: string;
  sublabel: string;
  ctaLabel: string;
  href: string;
  isExternal?: boolean;
  isPlaceholder: boolean;
}

export interface ProductCategoryItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  isPlaceholder: boolean;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  isPlaceholder: boolean;
}

export interface SiteData {
  companyName: string;
  companyLegalNote: string;
  fieldDescription: string;
  templateBannerText: string;
  officialStore: {
    name: string;
    platform: string;
    url: string;
    verificationNote: string;
  };
  whatsappNumber: string | null;
  whatsappPlaceholderLabel: string;
  navbar?: NavbarData;
  contact: {
    address: string | null;
    addressPlaceholder: string;
    phone: string | null;
    phonePlaceholder: string;
    email: string | null;
    emailPlaceholder: string;
    operatingHours: string | null;
    operatingHoursPlaceholder: string;
  };
  hero: {
    eyebrow: string;
    headlineMain: string;
    headlineAccent: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    primaryCta?: HeroCtaButton;
    secondaryCta?: HeroCtaButton;
    imageSrc: string;
    imageAlt: string;
    trustItems: [HeroTrustItem, HeroTrustItem, HeroTrustItem, HeroTrustItem];
    overlayBadgeLeft: {
      title: string;
      description: string;
    };
    overlayBadgeRight: {
      title: string;
      description: string;
    };
    infoStrip: [HeroInfoItem, HeroInfoItem, HeroInfoItem, HeroInfoItem];
  };
  categoryShowcase: {
    pill: string;
    heading: string;
    description: string;
    ctaLabel: string;
    items: [
      ProductCategoryItem,
      ProductCategoryItem,
      ProductCategoryItem,
      ProductCategoryItem,
    ];
  };
  about: {
    sectionEyebrow: string;
    heading: string;
    introParagraphs: string[];
    imagePlaceholderLabel: string;
    eyebrow?: string;
    headingMain?: string;
    headingAccent?: string;
    subheading?: string;
    imageSrc?: string;
    imageAlt?: string;
    imageBadge?: AboutImageBadge;
    profileTabLabel?: string;
    commitmentParagraphs?: string[];
    commitmentCards?: AboutCommitmentCard[];
    visionMissionTabLabel?: string;
    visiHeading?: string;
    visi: string | null;
    visiPlaceholder: string;
    misiHeading?: string;
    misi: string[];
    historyTabLabel?: string;
    historySteps?: AboutHistoryStep[];
    whyChooseUsEyebrow?: string;
    whyChooseUsTitle: string;
    whyChooseUsCtaLabel?: string;
    whyChooseUs: [
      WhyChooseUsItem,
      WhyChooseUsItem,
      WhyChooseUsItem,
      WhyChooseUsItem,
    ];
  };
  articleHub?: ArticleHubData;
  testimonials?: TestimonialsData;
  videoSection?: VideoSectionData;
  videoPage?: VideoPageData;
  articlePage?: ArticlePageData;
  articleDetail?: ArticleDetailData;
  whatsappBand: {
    heading: string;
    description: string;
    buttonLabel: string;
    disabledHint: string;
  };
  footer: FooterData;
}

export const WHATSAPP_NUMBER: string | null = "6281234567890";
export const ADDRESS: string | null =
  "Layanan Distribusi & Pengiriman Nasional (Mitra Penyalur & Marketplace Resmi Tani InD® Indonesia)";
export const PHONE: string | null =
  "Konsultasi Budidaya & Layanan Mitra via WhatsApp Resmi";
export const EMAIL: string | null = "Layanan Pelanggan Tani InD® Indonesia";

export const SITE_DATA: SiteData = {
  companyName: "Arga Tani Mandiri",
  companyLegalNote:
    "Distribusi Resmi Sarana Produksi Pertanian & Agensia Hayati Indonesia",
  fieldDescription:
    "Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi tanaman berkualitas untuk mendukung produktivitas dan keberlanjutan pertanian Indonesia.",
  templateBannerText: "Distribusi Resmi Tani InD® Indonesia",
  officialStore: {
    name: "Tani InD® Indonesia",
    platform: "Shopee",
    url: SHOPEE_STORE_URL,
    verificationNote: "Toko resmi di Shopee",
  },
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappPlaceholderLabel: "Layanan Konsultasi WhatsApp",
  contact: {
    address: ADDRESS,
    addressPlaceholder:
      "Layanan Distribusi & Pengiriman Nasional (Mitra Penyalur & Marketplace Resmi Tani InD® Indonesia)",
    phone: PHONE,
    phonePlaceholder: "Layanan Konsultasi Teknis via WhatsApp",
    email: EMAIL,
    emailPlaceholder: "Layanan Resmi Tani InD® Indonesia",
    operatingHours: "Senin - Sabtu (08.00 - 17.00 WIB)",
    operatingHoursPlaceholder: "Senin - Sabtu (08.00 - 17.00 WIB)",
  },
  hero: {
    eyebrow: "Inovasi Nyata untuk Pertanian Indonesia",
    headlineMain: "Sarana Produksi Pertanian untuk Budidaya Optimal ",
    headlineAccent: "dan Hasil Panen Maksimal",
    subheadline:
      "Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi tanaman berkualitas untuk mendukung produktivitas dan keberlanjutan pertanian Indonesia.",
    primaryCtaLabel: DEFAULT_PRIMARY_CTA.label,
    secondaryCtaLabel: DEFAULT_SECONDARY_CTA.label,
    primaryCta: DEFAULT_PRIMARY_CTA,
    secondaryCta: DEFAULT_SECONDARY_CTA,
    imageSrc: "/images/hero-agriculture.jpg",
    imageAlt:
      "Petani merawat barisan tanaman pertanian hijau bersama sarana produksi Arga Tani Mandiri",
    trustItems: [
      {
        id: "trust-1",
        title: "Kualitas Terjamin",
        subtitle: "Sesuai spesifikasi kemasan",
      },
      {
        id: "trust-2",
        title: "Ramah Lingkungan",
        subtitle: "Aplikasi sesuai takaran",
      },
      {
        id: "trust-3",
        title: "Dukungan Informasi",
        subtitle: "Panduan budidaya & dosis",
      },
      {
        id: "trust-4",
        title: "Distribusi Marketplace",
        subtitle: "Tersedia di Shopee resmi",
      },
    ],
    overlayBadgeLeft: {
      title: "Terdaftar Resmi & Terpercaya",
      description:
        "Produk dilengkapi informasi kemasan resmi untuk kebutuhan budidaya pertanian Indonesia.",
    },
    overlayBadgeRight: {
      title: "Tani InD® Indonesia",
      description:
        "Temukan semua produk kami di toko resmi Tani InD® Indonesia di Shopee.",
    },
    infoStrip: [
      {
        id: "info-1",
        label: "Toko Resmi di Shopee",
        sublabel: "Tani InD® Indonesia. Belanja aman di toko resmi kami.",
        ctaLabel: "Kunjungi Toko Shopee",
        href: SHOPEE_STORE_URL,
        isExternal: true,
        isPlaceholder: false,
      },
      {
        id: "info-2",
        label: "Konsultasi via WhatsApp",
        sublabel:
          "Tim kami siap membantu informasi kebutuhan pertanian Anda.",
        ctaLabel: "Chat WhatsApp",
        href: "#konsultasi-whatsapp",
        isExternal: false,
        isPlaceholder: false,
      },
      {
        id: "info-3",
        label: "Informasi Layanan",
        sublabel:
          "Layanan penyediaan sarana pertanian dan pengiriman ke berbagai daerah.",
        ctaLabel: "Selengkapnya",
        href: "#tentang-kami",
        isExternal: false,
        isPlaceholder: false,
      },
      {
        id: "info-4",
        label: "Ketersediaan Kemasan",
        sublabel:
          "Tersedia pilihan ukuran kemasan 500 gr dan 1 kg sesuai kebutuhan.",
        ctaLabel: "Lihat Katalog",
        href: "/#produk",
        isExternal: false,
        isPlaceholder: false,
      },
    ],
  },
  categoryShowcase: {
    pill: "Kategori Produk Kami",
    heading: "Produk Berkualitas untuk Berbagai Kebutuhan Pertanian",
    description:
      "Rangkaian sarana produksi pertanian yang disiapkan untuk mendukung kesuburan tanah, nutrisi tanaman, serta perawatan budidaya di lapangan.",
    ctaLabel: "Lihat Semua Produk",
    items: [
      {
        id: "cat-1",
        title: productCategories[0].name,
        description: productCategories[0].description,
        imageSrc: productCategories[0].image,
        imageAlt: productCategories[0].alt,
        href: SHOPEE_STORE_URL,
        isPlaceholder: false,
      },
      {
        id: "cat-2",
        title: productCategories[1].name,
        description: productCategories[1].description,
        imageSrc: productCategories[1].image,
        imageAlt: productCategories[1].alt,
        href: SHOPEE_STORE_URL,
        isPlaceholder: false,
      },
      {
        id: "cat-3",
        title: productCategories[2].name,
        description: productCategories[2].description,
        imageSrc: productCategories[2].image,
        imageAlt: productCategories[2].alt,
        href: SHOPEE_STORE_URL,
        isPlaceholder: false,
      },
      {
        id: "cat-4",
        title: productCategories[3].name,
        description: productCategories[3].description,
        imageSrc: productCategories[3].image,
        imageAlt: productCategories[3].alt,
        href: SHOPEE_STORE_URL,
        isPlaceholder: false,
      },
    ],
  },
  about: {
    sectionEyebrow: "Tentang Kami",
    heading: "Profil Perusahaan Arga Tani Mandiri",
    introParagraphs: [
      "Arga Tani Mandiri bergerak di bidang penyediaan sarana produksi pertanian yang mencakup pupuk, pestisida, dan nutrisi tanaman bagi petani serta mitra penyalur.",
      "Seluruh spesifikasi teknis, petunjuk penggunaan, dan peringatan keselamatan produk merujuk langsung pada informasi resmi di kemasan serta etalase Shopee kami.",
    ],
    imagePlaceholderLabel:
      "Dokumentasi budidaya dan sarana produksi Arga Tani Mandiri",
    eyebrow: DEFAULT_ABOUT_EYEBROW,
    headingMain: DEFAULT_ABOUT_HEADING_MAIN,
    headingAccent: DEFAULT_ABOUT_HEADING_ACCENT,
    subheading: DEFAULT_ABOUT_SUBHEADING,
    imageSrc: DEFAULT_ABOUT_IMAGE_SRC,
    imageAlt: DEFAULT_ABOUT_IMAGE_ALT,
    imageBadge: DEFAULT_ABOUT_IMAGE_BADGE,
    profileTabLabel: DEFAULT_ABOUT_PROFILE_TAB_LABEL,
    commitmentParagraphs: DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS,
    commitmentCards: DEFAULT_ABOUT_COMMITMENT_CARDS,
    visionMissionTabLabel: DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL,
    visiHeading: DEFAULT_ABOUT_VISI_HEADING,
    visi: "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
    visiPlaceholder:
      "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
    misiHeading: DEFAULT_ABOUT_MISI_HEADING,
    misi: [
      "Menyediakan produk pupuk, pembenah tanah, dan nutrisi tanaman dengan komposisi terukur.",
      "Memudahkan akses produk resmi bagi petani di berbagai daerah melalui jaringan distribusi digital dan toko Shopee Tani InD®.",
      "Menghadirkan edukasi budidaya dan panduan pemakaian yang tepat guna.",
    ],
    historyTabLabel: DEFAULT_ABOUT_HISTORY_TAB_LABEL,
    historySteps: DEFAULT_ABOUT_HISTORY_STEPS,
    whyChooseUsEyebrow: DEFAULT_ABOUT_WHY_EYEBROW,
    whyChooseUsTitle: "Alasan Memilih Produk Kami",
    whyChooseUsCtaLabel: DEFAULT_ABOUT_WHY_CTA_LABEL,
    whyChooseUs: [
      {
        id: "why-1",
        title: "Formulasi Tepat Guna",
        description:
          "Menggabungkan pembenah tanah (Asam Humat) dan agensia hayati (Trichoderma) untuk merawat kesuburan sekaligus mencegah penyakit akar.",
        isPlaceholder: false,
      },
      {
        id: "why-2",
        title: "Informasi Kemasan Transparan",
        description:
          "Spesifikasi komposisi, takaran penggunaan, serta kemasan 500 gr dan 1 kg yang tertera jelas pada label produk.",
        isPlaceholder: false,
      },
      {
        id: "why-3",
        title: "Akses Pembelian Mudah di Shopee",
        description:
          "Tersedia secara resmi di Shopee (Tani InD® Indonesia) untuk memudahkan pemesanan eceran maupun rutin dari berbagai wilayah.",
        isPlaceholder: false,
      },
      {
        id: "why-4",
        title: "Dukungan Panduan Budidaya",
        description:
          "Didukung artikel edukasi pertanian dan layanan konsultasi cepat via WhatsApp untuk membantu mengoptimalkan hasil panen.",
        isPlaceholder: false,
      },
    ],
  },
  articleHub: DEFAULT_ARTICLE_HUB,
  testimonials: cloneTestimonialsDefaults(),
  videoSection: cloneVideoSectionDefaults(),
  videoPage: cloneVideoPageDefaults(),
  whatsappBand: {
    heading: "Chat Tim Konsultasi Budidaya Arga Tani Mandiri",
    description:
      "Tanyakan rekomendasi dosis pemakaian, ketersediaan kemasan 500 gr & 1 kg, atau informasi pemesanan untuk kebutuhan pertanian dan mitra penyalur.",
    buttonLabel: "Chat Tim Konsultasi Budidaya",
    disabledHint: "Layanan konsultasi aktif melalui WhatsApp resmi",
  },
  footer: cloneFooterDefaults(),
  navbar: {
    items: DEFAULT_NAVBAR_DATA.items.map((item) => ({
      ...item,
      target: { ...item.target },
    })),
  },
};
