export const SHOPEE_STORE_URL = "https://id.shp.ee/fCveyX1e";

export interface ProductCategory {
  name: string;
  description: string;
  image: string;
  alt: string;
}

export const productCategories: ProductCategory[] = [
  {
    name: "Pupuk & Nutrisi",
    description:
      "Nutrisi lengkap dan pembenah tanah untuk pertumbuhan tanaman yang optimal.",
    image: "/images/categories/pupuk-nutrisi.jpg",
    alt: "Aplikasi pupuk dan nutrisi tanaman di lahan pertanian",
  },
  {
    name: "Pestisida",
    description:
      "Perlindungan tanaman yang efektif terhadap gangguan hama dan penyakit.",
    image: "/images/categories/pestisida.jpg",
    alt: "Perlindungan tanaman terhadap gangguan hama dan penyakit",
  },
  {
    name: "Perlakuan Benih",
    description:
      "Perlindungan dan nutrisi sejak fase awal untuk benih yang tumbuh sehat.",
    image: "/images/categories/perlakuan-benih.jpg",
    alt: "Bibit dan benih tanaman hijau yang tumbuh sehat",
  },
  {
    name: "Produk Pendukung",
    description:
      "Rangkaian sarana pendukung budidaya untuk menunjang hasil panen maksimal.",
    image: "/images/categories/produk-pendukung.jpg",
    alt: "Sarana pendukung budidaya pertanian di lapangan",
  },
];

