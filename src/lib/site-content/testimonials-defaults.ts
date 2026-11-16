export const TESTIMONIALS_MIN_ITEMS = 0;
export const TESTIMONIALS_MAX_ITEMS = 12;
export const TESTIMONIALS_STATS_MIN = 0;
export const TESTIMONIALS_STATS_MAX = 4;

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  tag: string;
  rating: number | null;
  photoSrc: string;
  photoAlt: string;
  isSample: boolean;
}

export interface TestimonialStat {
  id: string;
  value: string;
  label: string;
}

export interface TestimonialsData {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  headingAccent: string;
  description: string;
  showSampleLabel: boolean;
  showRatings: boolean;
  showStats: boolean;
  statsAreSample: boolean;
  stats: TestimonialStat[];
  featuredId: string | null;
  items: TestimonialItem[];
}

export const DEFAULT_TESTIMONIALS: TestimonialsData = {
  enabled: true,
  eyebrow: "Testimoni Pelanggan",
  heading: "Cerita Pengalaman",
  headingAccent: "Layanan Kami",
  description:
    "Ulasan singkat mengenai kemudahan pemesanan, kejelasan informasi kemasan, dan komunikasi tim layanan kami.",
  showSampleLabel: true,
  showRatings: true,
  showStats: true,
  statsAreSample: true,
  stats: [
    { id: "stat-1", value: "4,9/5", label: "Rata-rata ulasan" },
    { id: "stat-2", value: "1.200+", label: "Pelanggan terlayani" },
    { id: "stat-3", value: "98%", label: "Merekomendasikan" },
  ],
  featuredId: "testimoni-1",
  items: [
    {
      id: "testimoni-1",
      quote:
        "Komunikasi admin saat menanyakan ketersediaan stok sangat responsif. Informasi cara pemesanan lewat toko resmi juga dijelaskan dengan runtut dan mudah diikuti.",
      name: "Budi",
      role: "Petani cabai",
      location: "Kediri",
      tag: "Layanan Pemesanan",
      rating: 5,
      photoSrc: "",
      photoAlt: "",
      isSample: true,
    },
    {
      id: "testimoni-2",
      quote:
        "Keterangan pada katalog dan label kemasan mudah dipahami sebelum kami memesan. Tim layanan juga sigap menjawab pertanyaan seputar jadwal pengiriman.",
      name: "Siti",
      role: "Pengelola toko tani",
      location: "Magelang",
      tag: "Informasi Produk",
      rating: 5,
      photoSrc: "",
      photoAlt: "",
      isSample: true,
    },
    {
      id: "testimoni-3",
      quote:
        "Proses pemesanan melalui tautan resmi terasa praktis dan transparan. Konfirmasi pesanan diterima cepat sehingga koordinasi di gudang lebih lancar.",
      name: "Hendra",
      role: "Petani hortikultura",
      location: "Garut",
      tag: "Toko Resmi",
      rating: 4,
      photoSrc: "",
      photoAlt: "",
      isSample: true,
    },
    {
      id: "testimoni-4",
      quote:
        "Saat berkonsultasi via WhatsApp, tim memberikan penjelasan yang sopan dan membantu memahami petunjuk dasar pada kemasan produk.",
      name: "Rina",
      role: "Petani padi",
      location: "Subang",
      tag: "Konsultasi Layanan",
      rating: 5,
      photoSrc: "",
      photoAlt: "",
      isSample: true,
    },
    {
      id: "testimoni-5",
      quote:
        "Paket diterima dalam kondisi rapi dan sesuai daftar pesanan. Layanan purna jualnya ramah saat kami mengonfirmasi dokumen pengiriman.",
      name: "Agus",
      role: "Mitra penyalur",
      location: "Malang",
      tag: "Pengiriman & Kemasan",
      rating: 5,
      photoSrc: "",
      photoAlt: "",
      isSample: true,
    },
  ],
};

export function cloneTestimonialsDefaults(): TestimonialsData {
  return {
    ...DEFAULT_TESTIMONIALS,
    stats: DEFAULT_TESTIMONIALS.stats.map((stat) => ({ ...stat })),
    items: DEFAULT_TESTIMONIALS.items.map((item) => ({ ...item })),
  };
}
