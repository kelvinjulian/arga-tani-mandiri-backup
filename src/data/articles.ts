export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: {
    title: string;
    text: string;
  };
}

export interface ArticleItem {
  id: string;
  slug: string;
  status: "draft" | "published";
  categoryLabel: string;
  filterCategory: string;
  readingTime: string;
  isFeatured?: boolean;
  title: string;
  seoTitle: string;
  shortTitle?: string;
  metaDescription: string;
  datePublished?: string;
  dateModified?: string;
  imageSrc: string;
  imageAlt: string;
  excerpt: string;
  intro: string;
  takeaways: [string, string, string];
  tags: string[];
  sections: ArticleSection[];
}

export const ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    slug: "cara-membaca-informasi-label-kemasan-sarana-pertanian",
    status: "draft",
    categoryLabel: "Panduan Label Kemasan",
    filterCategory: "Panduan Label",
    readingTime: "5 Menit Baca",
    isFeatured: true,
    title:
      "Cara Membaca Informasi & Takaran Dosis pada Label Kemasan Sarana Pertanian",
    seoTitle: "Panduan Label Kemasan Sarana Pertanian",
    metaDescription:
      "Panduan lengkap memahami struktur informasi resmi pada kemasan pupuk dan pembenah tanah agar aplikasi di lahan lebih tepat sasaran dan aman.",
    imageSrc: "/images/categories/pupuk-nutrisi.jpg",
    imageAlt:
      "Petani memeriksa kesuburan tanah dan panduan penggunaan nutrisi tanaman",
    excerpt:
      "Panduan lengkap memahami struktur informasi resmi pada kemasan pupuk dan pembenah tanah agar aplikasi di lahan lebih tepat sasaran dan aman.",
    intro:
      "Setiap kemasan resmi sarana produksi pertanian memuat petunjuk teknis yang disusun sebagai acuan utama bagi petani dan penyalur di lapangan. Memahami struktur informasi pada label membantu pengguna mengenali komposisi bahan aktif, takaran dosis sesuai fase tanaman, serta aturan penyimpanan secara akurat.",
    takeaways: [
      "Identitas Bahan Aktif",
      "Takaran & Interval",
      "Keamanan Aplikasi",
    ],
    tags: ["Panduan Label", "Dosis Pupuk", "Asam Humat"],
    sections: [
      {
        id: "identitas-dan-komposisi-bahan-aktif",
        heading: "Memeriksa Identitas Produk dan Komposisi Bahan Aktif",
        paragraphs: [
          "Langkah pertama sebelum mengaplikasikan sarana produksi pertanian adalah memeriksa nama dagang, peruntukan kategori produk (seperti pembenah tanah, pupuk makro-mikro, atau agensia hayati), serta ukuran berat bersih kemasan (misalnya 500 gr atau 1 kg).",
          "Perhatikan rincian komposisi pada tabel kandungan. Sebagai contoh, pada produk pembenah tanah berbasis Asam Humat dan Trichoderma seperti lini Tamatric, label kemasan mencantumkan fungsi ganda bahan organik untuk memperbaiki struktur fisik tanah sekaligus mendukung mikrobiologi perakaran.",
        ],
        bullets: [
          "Pastikan segel kemasan dalam keadaan utuh dan teks label tercetak jelas.",
          "Cocokkan jenis kandungan produk dengan kebutuhan spesifik fase pertumbuhan tanaman (vegetatif atau generatif).",
          "Periksa nomor batch atau keterangan produksi pada bagian belakang kemasan.",
        ],
        callout: {
          title: "Tips Praktis di Lahan",
          text: "Selalu baca persentase bahan aktif sebelum mencampur dua jenis sarana pertanian agar tidak terjadi reaksi pengendapan pada tangki semprot atau larutan kocor.",
        },
      },
      {
        id: "memahami-takaran-dosis-dan-interval-aplikasi",
        heading: "Memahami Petunjuk Takaran Dosis dan Interval Aplikasi",
        paragraphs: [
          "Setiap komoditas pertanian memiliki kebutuhan nutrisi dan pembenah tanah yang berbeda tergantung pada kondisi pH tanah, tekstur lahan, dan umur tanaman. Label kemasan mencantumkan rentang takaran konsentrasi (gram per liter air) atau dosis tebar per luasan lahan.",
          "Gunakan alat takar yang konsisten seperti sendok takar atau timbangan digital kecil saat menyiapkan larutan kocor maupun semprot. Hindari memperkirakan takaran tanpa mengacu pada anjuran label agar efisiensi penyerapan hara oleh akar tetap optimal.",
        ],
        bullets: [
          "Aplikasi kocor pada zona perakaran umumnya dilakukan pada pagi atau sore hari saat suhu tanah stabil.",
          "Catat tanggal aplikasi untuk menjaga keteraturan interval pemberian nutrisi berikutnya.",
          "Sesuaikan volume air pelarut agar distribusi nutrisi merata ke seluruh perakaran tanaman.",
        ],
      },
      {
        id: "simbol-keselamatan-dan-penanganan-kemasan",
        heading: "Simbol Keselamatan Kerja dan Penanganan Sisa Kemasan",
        paragraphs: [
          "Bagian bawah label kemasan memuat piktogram atau simbol petunjuk keselamatan kerja selama proses pencampuran hingga pengaplikasian di lapangan. Penggunaan perlengkapan pelindung dasar seperti sarung tangan, masker, dan sepatu kebun sangat dianjurkan.",
          "Setelah selesai digunakan, tutup kembali kemasan bubuk atau cair dengan rapat dan simpan di tempat yang teduh, kering, serta jauh dari jangkauan anak-anak maupun hewan ternak.",
        ],
        bullets: [
          "Lipat dan ikat rapat bagian dalam plastik kemasan produk berbentuk serbuk (powder) agar tidak lembap.",
          "Cuci bersih alat semprot dan ember pengaduk segera setelah selesai digunakan di lahan.",
          "Jangan menggunakan kembali wadah bekas sarana pertanian untuk keperluan rumah tangga.",
        ],
      },
    ],
  },
  {
    id: "art-2",
    slug: "pencatatan-kebutuhan-pupuk-dan-nutrisi-tanaman-per-musim-tanam",
    status: "draft",
    categoryLabel: "Manajemen Budidaya",
    filterCategory: "Manajemen Budidaya",
    readingTime: "4 Menit Baca",
    title:
      "Pencatatan Kebutuhan Pupuk dan Nutrisi Tanaman pada Setiap Musim Tanam",
    seoTitle: "Pencatatan Pupuk & Nutrisi Musim Tanam",
    metaDescription:
      "Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani mengatur jadwal aplikasi dan efisiensi biaya budidaya.",
    imageSrc: "/images/categories/pestisida.jpg",
    imageAlt: "Petani merencanakan aplikasi nutrisi dan perawatan di lahan budidaya",
    excerpt:
      "Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani mengatur jadwal aplikasi dan efisiensi biaya budidaya.",
    intro:
      "Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani maupun pengelola kios mengatur ketersediaan barang secara tepat waktu. Pencatatan yang rapi memudahkan evaluasi jenis input yang diberikan pada setiap petak lahan dari awal olah tanah hingga panen.",
    takeaways: [
      "Inventarisasi Kebutuhan Lahan",
      "Jadwal Fase Pertumbuhan",
      "Evaluasi Efisiensi Musim Tanam",
    ],
    tags: ["Manajemen Budidaya", "Dosis Pupuk", "Pembenah Tanah"],
    sections: [
      {
        id: "inventarisasi-jenis-sarana-produksi",
        heading: "Inventarisasi Kebutuhan Sarana Produksi Sebelum Olah Tanah",
        paragraphs: [
          "Tahap persiapan lahan merupakan waktu terbaik untuk mendata seluruh kebutuhan input pertanian, mulai dari pembenah tanah dasar (Asam Humat dan agensia hayati Trichoderma), pupuk dasar, hingga nutrisi lanjutan.",
          "Dengan menghitung jumlah populasi tanaman dan luas bedengan sejak awal, petani dapat memilih ukuran kemasan yang paling ekonomis, baik kemasan 500 gr untuk lahan terbatas maupun kemasan 1 kg untuk pemakaian rutin.",
        ],
        bullets: [
          "Kelompokkan kebutuhan input berdasarkan tahapan: pra-tanam, fase vegetatif, dan fase pembungaan/pembuahan.",
          "Periksa sisa stok musim sebelumnya untuk memastikan kemasan masih tersegel baik dan layak pakai.",
          "Siapkan cadangan pembenah tanah dan pelindung perakaran terutama saat memasuki musim penghujan.",
        ],
      },
      {
        id: "pencatatan-jadwal-pemakaian-lahan",
        heading: "Pencatatan Jadwal Aplikasi Berdasarkan Fase Budidaya",
        paragraphs: [
          "Buku catatan harian kebun berfungsi sebagai rekam jejak perlakuan pada setiap blok tanaman. Setiap kali melakukan pemupukan atau pengocoran pembenah tanah, catat tanggal aplikasi, jenis produk, takaran yang digunakan, serta kondisi cuaca.",
          "Data ini sangat membantu petani memantau respons pertumbuhan tanaman seperti vigor daun, kekuatan batang, dan ketahanan akar terhadap kelembapan tinggi.",
        ],
        bullets: [
          "Catat umur tanaman (Hari Setelah Tanam / HST) pada setiap jadwal pemberian nutrisi.",
          "Dokumentasikan perkembangan warna daun dan kondisi tanah setelah aplikasi pembenah tanah.",
          "Hindari tumpang tindih pemberian produk dengan fungsi serupa dalam waktu yang terlalu berdekatan.",
        ],
        callout: {
          title: "Manfaat Rekam Jejak Budidaya",
          text: "Catatan jadwal aplikasi yang lengkap memudahkan tim teknis memberikan rekomendasi tepat apabila tanaman menunjukkan gejala kekurangan nutrisi di pertengahan musim.",
        },
      },
      {
        id: "evaluasi-ketersediaan-kemasan",
        heading: "Evaluasi Hasil Panen dan Perencanaan Pengadaan Berikutnya",
        paragraphs: [
          "Pada akhir musim tanam, bandingkan catatan total penggunaan sarana produksi dengan hasil panen yang diperoleh. Evaluasi ini membantu menentukan kombinasi nutrisi dan pembenah tanah yang paling efektif untuk dipertahankan pada musim tanam selanjutnya.",
          "Bagi mitra penyalur maupun kelompok tani, rekapitulasi kebutuhan per musim juga mempermudah pemesanan kembali melalui saluran resmi seperti toko Shopee Tani InD® Indonesia.",
        ],
        bullets: [
          "Hitung rasio pemakaian kemasan 500 gr dan 1 kg untuk mengoptimalkan anggaran belanja sarana produksi.",
          "Simpan catatan dosis yang terbukti memberikan pertumbuhan paling seragam pada komoditas Anda.",
          "Lakukan pemesanan stok lebih awal sebelum jadwal olah tanah musim berikutnya dimulai.",
        ],
      },
    ],
  },
  {
    id: "art-3",
    slug: "penanganan-dan-penyimpanan-kemasan-input-pertanian-di-gudang",
    status: "draft",
    categoryLabel: "Penyimpanan & Distribusi",
    filterCategory: "Penyimpanan & Gudang",
    readingTime: "4 Menit Baca",
    title:
      "Penanganan dan Penyimpanan Kemasan Input Pertanian di Gudang Penyalur",
    seoTitle: "Penyimpanan Kemasan Input di Gudang",
    metaDescription:
      "Kondisi ruang penyimpanan yang kering dan berventilasi baik berperan penting menjaga kualitas fisik serbuk, nutrisi cair, serta viabilitas agensia hayati.",
    imageSrc: "/images/categories/produk-pendukung.jpg",
    imageAlt: "Lahan pertanian terawat dengan pengelolaan sarana produksi yang rapi",
    excerpt:
      "Kondisi ruang penyimpanan yang kering dan berventilasi baik berperan penting menjaga kualitas fisik serbuk, nutrisi cair, serta viabilitas agensia hayati.",
    intro:
      "Kondisi ruang penyimpanan berperan besar dalam menjaga keutuhan fisik kemasan, kestabilan unsur hara, serta viabilitas mikroorganisme menguntungkan selama masa simpan. Penataan yang terstruktur juga memudahkan pemeriksaan stok secara berkala oleh petani maupun pengelola kios pertanian.",
    takeaways: [
      "Sirkulasi Udara & Kelembapan",
      "Penataan Rak & Palet",
      "Perlindungan Mutu Bahan Aktif",
    ],
    tags: ["Manajemen Gudang", "Penyimpanan & Gudang", "Panduan Label"],
    sections: [
      {
        id: "ventilasi-dan-kondisi-ruang-simpan",
        heading: "Pengaturan Sirkulasi Udara dan Kelembapan Ruang Simpan",
        paragraphs: [
          "Produk sarana pertanian berbentuk serbuk (powder) seperti Asam Humat dan formulasi biologis Trichoderma memerlukan ruang simpan yang sejuk, teduh, dan terhindar dari paparan sinar matahari langsung. Suhu ruang yang terlalu panas atau lembap dapat memicu penggumpalan serbuk.",
          "Pastikan ruang penyimpanan memiliki ventilasi udara yang cukup agar terjadi pertukaran udara secara alami dan kelembapan ruangan tetap terkendali sepanjang hari.",
        ],
        bullets: [
          "Simpan produk pada suhu ruang yang sejuk dan hindarkan dari atap transparan yang memancarkan panas berlebih.",
          "Gunakan alas palet kayu atau rak penyangga agar kemasan tidak bersentuhan langsung dengan lantai tanah atau semen yang lembap.",
          "Jauhkan area penyimpanan dari sumber percikan air atau talang hujan.",
        ],
      },
      {
        id: "pemisahan-kelompok-produk",
        heading: "Pemisahan Kelompok Produk Berdasarkan Kategori dan Bentuk",
        paragraphs: [
          "Penataan gudang yang rapi selalu memisahkan kelompok produk berdasarkan jenis dan wujud fisiknya. Tempatkan kemasan pupuk nutrisi dan pembenah tanah terpisah dari produk pengendali hama agar tidak terjadi kontaminasi silang.",
          "Susun kemasan berbentuk botol atau cair di rak bagian bawah, sedangkan kemasan kantong serbuk (seperti kemasan 500 gr dan 1 kg) ditempatkan di rak bagian atas yang kering.",
        ],
        bullets: [
          "Terapkan sistem First Expired, First Out (FEFO) agar stok yang lebih awal masuk digunakan lebih dahulu.",
          "Beri jarak antar tumpukan kardus untuk menjaga aliran udara di sela-sela kemasan.",
          "Pasang penanda kategori yang jelas pada setiap baris rak penyimpanan.",
        ],
        callout: {
          title: "Menjaga Mutu Agensia Hayati",
          text: "Produk yang mengandung mikroorganisme bermanfaat seperti Trichoderma wajib disimpan di tempat teduh dan ditutup rapat kembali segera setelah sebagian isinya ditakar.",
        },
      },
      {
        id: "pemeriksaan-berkala-keterbacaan-label",
        heading: "Pemeriksaan Berkala Kondisi Segel dan Keterbacaan Label",
        paragraphs: [
          "Lakukan inspeksi rutin setiap minggu untuk memastikan tidak ada kemasan yang mengalami kebocoran, kerusakan segel, atau pudarnya informasi pada label. Label yang tetap bersih dan terbaca jelas menjamin keamanan pengguna saat menakar produk di lapangan.",
          "Apabila terdapat kemasan yang sudah dibuka sebagian untuk pemakaian bertahap, gunakan klip penjepit kedap udara dan beri catatan tanggal pembukaan kemasan.",
        ],
        bullets: [
          "Pastikan bagian mulut kantong aluminium foil atau plastik tebal bersih dari sisa serbuk sebelum ditutup kembali.",
          "Segera bersihkan area rak apabila terdapat tumpahan serbuk atau cairan nutrisi.",
          "Simpan produk di rak khusus yang terpisah dari bahan pangan dan pakan ternak.",
        ],
      },
    ],
  },
  {
    id: "art-4",
    slug: "manfaat-trichoderma-dan-asam-humat-dalam-mengembalikan-kesuburan-tanah",
    status: "draft",
    categoryLabel: "Pembenah Tanah",
    filterCategory: "Pembenah Tanah",
    readingTime: "5 Menit Baca",
    title:
      "Manfaat Trichoderma dan Asam Humat dalam Mengembalikan Kesuburan Tanah",
    seoTitle: "Manfaat Trichoderma dan Asam Humat",
    metaDescription:
      "Sinergi bahan organik Asam Humat dan mikroorganisme menguntungkan Trichoderma membantu memulihkan lahan jenuh serta melindungi perakaran tanaman.",
    imageSrc: "/images/categories/perlakuan-benih.jpg",
    imageAlt:
      "Bibit dan benih pertanian sehat berkat aplikasi pembenah tanah dan Trichoderma",
    excerpt:
      "Sinergi bahan organik Asam Humat dan mikroorganisme menguntungkan Trichoderma membantu memulihkan lahan jenuh sekaligus melindungi perakaran dari serangan jamur patogen.",
    intro:
      "Penggunaan pupuk kimia secara intensif dalam jangka panjang sering membuat struktur tanah menjadi keras, masam, dan miskin mikroorganisme menguntungkan. Kombinasi pembenah tanah Asam Humat dan agensia hayati Trichoderma hadir sebagai solusi terpadu untuk memulihkan kesehatan fisik, kimia, dan biologi tanah secara berkelanjutan.",
    takeaways: [
      "Perbaikan Struktur & KTK Tanah",
      "Perlindungan Hayati Perakaran",
      "Optimalisasi Serapan Pupuk",
    ],
    tags: ["Pembenah Tanah", "Asam Humat", "Trichoderma", "Dosis Pupuk"],
    sections: [
      {
        id: "peran-asam-humat-memperbaiki-struktur-tanah",
        heading: "Peran Asam Humat dalam Memperbaiki Struktur Fisik dan Kimia Tanah",
        paragraphs: [
          "Asam Humat merupakan fraksi aktif senyawa humik alami yang memiliki kemampuan tinggi dalam meningkatkan Kapasitas Tukar Kation (KTK) tanah. Pada tanah lempung yang padat, Asam Humat membantu membentuk agregat tanah yang lebih gembur sehingga sirkulasi oksigen dan penetrasi akar menjadi jauh lebih baik.",
          "Selain memperbaiki porositas lahan, molekul Asam Humat mengikat ion hara makro dan mikro di dalam tanah agar tidak mudah tercuci oleh air hujan atau irigasi, sehingga pupuk yang diberikan dapat diserap secara maksimal oleh akar tanaman.",
        ],
        bullets: [
          "Membantu menstabilkan pH tanah pada lahan yang mengalami kemasaman akibat residu pemupukan intensif.",
          "Meningkatkan daya simpan air (water holding capacity) pada tanah berpasir maupun lahan kering.",
          "Merangsang pertumbuhan rambut-rambut akar baru yang aktif menyerap nutrisi.",
        ],
      },
      {
        id: "mekanisme-trichoderma-melindungi-akar",
        heading: "Mekanisme Agensia Hayati Trichoderma Melindungi Zona Perakaran",
        paragraphs: [
          "Trichoderma adalah cendawan antagonis bermanfaat yang hidup secara alami di sekitar perakaran tanaman (rizosfer). Ketika diaplikasikan ke tanah, Trichoderma berkembang membentuk koloni pelindung di permukaan akar dan bersaing ruang serta nutrisi melawan jamur patogen tular tanah seperti penyebab layu Fusarium dan busuk akar.",
          "Keberadaan Trichoderma juga membantu mempercepat proses dekomposisi bahan organik di dalam tanah menjadi senyawa hara sederhana yang siap diserap oleh tanaman.",
        ],
        bullets: [
          "Menekan perkembangan jamur patogen tular tanah secara alami tanpa meninggalkan residu berbahaya.",
          "Mendukung ketahanan alami tanaman sejak fase pindah tanam hingga masa generatif.",
          "Bekerja sinergis dengan bahan organik di sekitar perakaran untuk menjaga keseimbangan biologi tanah.",
        ],
        callout: {
          title: "Solusi Terpadu Tamatric (Asam Humat & Trichoderma)",
          text: "Produk unggulan Tamatric dari Arga Tani Mandiri memadukan Asam Humat sebagai pembenah tanah sekaligus sumber karbon organik yang mendukung aktivitas Trichoderma di zona perakaran, tersedia dalam kemasan 500 gr dan 1 kg di toko resmi Tani InD® Indonesia.",
        },
      },
      {
        id: "cara-aplikasi-efektif-di-lahan",
        heading: "Panduan Waktu dan Cara Aplikasi yang Efektif di Lahan",
        paragraphs: [
          "Kombinasi Asam Humat dan Trichoderma paling efektif diberikan sejak tahap persiapan lahan (sebelum tanam atau saat pindah tanam) serta diulangi secara berkala melalui sistem kocor di sekitar pangkal batang.",
          "Aplikasi pada awal musim tanam memberi kesempatan bagi struktur tanah untuk pulih dan memungkinkan koloni Trichoderma menguasai zona perakaran lebih dahulu sebelum akar tanaman terpapar patogen di lapangan.",
        ],
        bullets: [
          "Larutkan produk sesuai takaran pada label kemasan dan kocorkan merata di sekitar perakaran pada pagi atau sore hari.",
          "Jaga kelembapan tanah yang cukup agar spora Trichoderma dapat aktif berkembang di zona rizosfer.",
          "Hindari mencampur langsung larutan agensia hayati dengan fungisida kimia sintetis dalam satu wadah.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return ARTICLES.find((item) => item.slug === slug);
}
