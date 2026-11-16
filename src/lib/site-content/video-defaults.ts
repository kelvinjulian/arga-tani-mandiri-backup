export interface VideoSectionData {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  headingAccent: string;
  description: string;
  homeCount: number;
  ctaLabel: string;
  showSamples: boolean;
}

export interface VideoPageData {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  description: string;
  searchPlaceholder: string;
  allLabel: string;
  emptyTitle: string;
  emptyText: string;
  loadMoreLabel: string;
  seoTitle: string;
  metaDescription: string;
  ogImageSrc: string;
  ogImageAlt: string;
}

export interface SampleVideoCard {
  id: string;
  platform: "youtube" | "tiktok";
  title: string;
  duration: string;
}

export const DEFAULT_VIDEO_SECTION: VideoSectionData = {
  enabled: true,
  eyebrow: "Video Edukasi",
  heading: "Panduan Praktis",
  headingAccent: "dalam Format Video",
  description:
    "Simak penjelasan singkat seputar pengenalan produk, pembacaan label kemasan, dan informasi layanan kami.",
  homeCount: 5,
  ctaLabel: "Lihat semua video",
  showSamples: true,
};

export const DEFAULT_VIDEO_PAGE: VideoPageData = {
  eyebrow: "Galeri Video",
  heading: "Kumpulan Video",
  headingAccent: "Edukasi & Layanan",
  description:
    "Temukan video panduan budidaya, informasi kemasan produk, dan penjelasan layanan resmi Arga Tani Mandiri.",
  searchPlaceholder: "Cari judul video...",
  allLabel: "Semua",
  emptyTitle: "Belum ada video yang tersedia",
  emptyText:
    "Video edukasi dan panduan akan segera ditambahkan. Silakan kembali lagi nanti atau hubungi kami via WhatsApp.",
  loadMoreLabel: "Muat lebih banyak",
  seoTitle: "Video Edukasi & Panduan",
  metaDescription:
    "Kumpulan video edukasi pertanian, informasi kemasan, dan panduan layanan dari Arga Tani Mandiri.",
  ogImageSrc: "",
  ogImageAlt: "",
};

export const SAMPLE_VIDEO_CARDS: ReadonlyArray<SampleVideoCard> = [
  {
    id: "sample-video-1",
    platform: "youtube",
    title: "Mengenal Informasi Dasar pada Label Kemasan Sarana Pertanian",
    duration: "03:20",
  },
  {
    id: "sample-video-2",
    platform: "tiktok",
    title: "Cara Praktis Menghubungi Layanan Konsultasi Resmi",
    duration: "00:55",
  },
  {
    id: "sample-video-3",
    platform: "youtube",
    title: "Tips Penyimpanan Kemasan Input Pertanian di Gudang",
    duration: "04:10",
  },
  {
    id: "sample-video-4",
    platform: "tiktok",
    title: "Langkah Pemesanan Melalui Toko Resmi di Marketplace",
    duration: "01:05",
  },
];

export function cloneVideoSectionDefaults(): VideoSectionData {
  return { ...DEFAULT_VIDEO_SECTION };
}

export function cloneVideoPageDefaults(): VideoPageData {
  return { ...DEFAULT_VIDEO_PAGE };
}
