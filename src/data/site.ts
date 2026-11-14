import { SHOPEE_STORE_URL, productCategories } from "@/data/categories";

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
    visi: string | null;
    visiPlaceholder: string;
    misi: string[];
    whyChooseUsTitle: string;
    whyChooseUs: [
      WhyChooseUsItem,
      WhyChooseUsItem,
      WhyChooseUsItem,
      WhyChooseUsItem,
    ];
  };
  whatsappBand: {
    heading: string;
    description: string;
    buttonLabel: string;
    disabledHint: string;
  };
  footer: {
    blurb: string;
    storeCardTitle: string;
    storeCardDescription: string;
    storeButtonLabel: string;
  };
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
    primaryCtaLabel: "Lihat Katalog Produk",
    secondaryCtaLabel: "Kunjungi Tani InD® di Shopee",
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
    visi: "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
    visiPlaceholder:
      "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
    misi: [
      "Menyediakan produk pupuk, pembenah tanah, dan nutrisi tanaman dengan komposisi terukur.",
      "Memudahkan akses produk resmi bagi petani di berbagai daerah melalui jaringan distribusi digital dan toko Shopee Tani InD®.",
      "Menghadirkan edukasi budidaya dan panduan pemakaian yang tepat guna.",
    ],
    whyChooseUsTitle: "Alasan Memilih Produk Kami",
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
  whatsappBand: {
    heading: "Chat Tim Konsultasi Budidaya Arga Tani Mandiri",
    description:
      "Tanyakan rekomendasi dosis pemakaian, ketersediaan kemasan 500 gr & 1 kg, atau informasi pemesanan untuk kebutuhan pertanian dan mitra penyalur.",
    buttonLabel: "Chat Tim Konsultasi Budidaya",
    disabledHint: "Layanan konsultasi aktif melalui WhatsApp resmi",
  },
  footer: {
    blurb:
      "Mitra penyedia sarana produksi pertanian, pupuk, pembenah tanah, dan nutrisi tanaman. Pemesanan daring resmi dilayani melalui toko Tani InD® Indonesia di Shopee.",
    storeCardTitle: "Toko Resmi Marketplace",
    storeCardDescription:
      "Kunjungi toko resmi Tani InD® Indonesia di Shopee untuk melihat etalase produk yang tersedia.",
    storeButtonLabel: "Kunjungi Tani InD® di Shopee",
  },
};
