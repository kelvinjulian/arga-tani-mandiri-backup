import type { SupportedIconName } from "@/lib/site-content/icons";

export const DEFAULT_ABOUT_IMAGE_SRC = "/images/about-collage.png";
export const DEFAULT_ABOUT_IMAGE_ALT =
  "Kolase aktivitas budidaya dan perawatan tanaman Arga Tani Mandiri";

export interface AboutImageBadge {
  enabled: boolean;
  icon: SupportedIconName;
  title: string;
  description: string;
}

export interface AboutCommitmentCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: SupportedIconName;
}

export interface AboutHistoryStep {
  id: string;
  step: string;
  title: string;
  description: string;
}

export const DEFAULT_ABOUT_EYEBROW = "Tentang Arga Tani Mandiri";
export const DEFAULT_ABOUT_HEADING_MAIN = "Mitra Sarana Pertanian untuk";
export const DEFAULT_ABOUT_HEADING_ACCENT = "Pertumbuhan Berkelanjutan";
export const DEFAULT_ABOUT_SUBHEADING =
  "Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi tanaman berkualitas untuk mendukung produktivitas dan keberlanjutan pertanian Indonesia.";

export const DEFAULT_ABOUT_IMAGE_BADGE: AboutImageBadge = {
  enabled: true,
  icon: "Sprout",
  title: "Fokus Kualitas & Keberlanjutan",
  description:
    "Menghadirkan sarana produksi pertanian yang terarah untuk kesuburan tanah dan hasil panen optimal.",
};

export const DEFAULT_ABOUT_PROFILE_TAB_LABEL = "Profil & Komitmen";
export const DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS: string[] = [
  "Kami berkomitmen untuk selalu menyediakan formulasi nutrisi tanaman dan pembenah struktur tanah (seperti lini unggulan Tamatric Black Magic Powder berbahan Asam Humat & Trichoderma) dengan spesifikasi yang teruji serta panduan penggunaan yang transparan pada setiap kemasannya.",
];

export const DEFAULT_ABOUT_COMMITMENT_CARDS: AboutCommitmentCard[] = [
  {
    id: "commit-1",
    badge: "Pendampingan Teknis",
    title: "Dukungan Petani",
    description:
      "Pendampingan pemakaian produk secara tepat guna untuk mencapai hasil budidaya optimal.",
    icon: "CheckCircle2",
  },
  {
    id: "commit-2",
    badge: "Jaringan Resmi",
    title: "Mitra Penyalur",
    description:
      "Layanan distribusi resmi dan ketersediaan kemasan ke berbagai wilayah pertanian Indonesia.",
    icon: "CheckCircle2",
  },
];

export const DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL = "Visi & Misi";
export const DEFAULT_ABOUT_VISI_HEADING = "Visi Kami";
export const DEFAULT_ABOUT_MISI_HEADING = "Misi Perusahaan";

export const DEFAULT_ABOUT_HISTORY_TAB_LABEL = "Sejarah Perusahaan";
export const DEFAULT_ABOUT_HISTORY_STEPS: AboutHistoryStep[] = [
  {
    id: "hist-1",
    step: "01",
    title: "Fase Inisiasi",
    description:
      "Berawal dari komitmen menyediakan sarana pemulihan kesehatan tanah.",
  },
  {
    id: "hist-2",
    step: "02",
    title: "Pengembangan Produk",
    description:
      "Menghadirkan formulasi Tamatric (Asam Humat & Trichoderma) dalam kemasan 500 gr & 1 kg.",
  },
  {
    id: "hist-3",
    step: "03",
    title: "Distribusi Digital Tani InD®",
    description:
      "Memperluas jangkauan nasional melalui toko resmi Shopee.",
  },
];

export const DEFAULT_ABOUT_WHY_EYEBROW = "Keunggulan Utama";
export const DEFAULT_ABOUT_WHY_CTA_LABEL = "Lihat Toko di Shopee";
