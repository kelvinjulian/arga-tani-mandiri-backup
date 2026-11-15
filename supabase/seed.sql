-- seed.sql: Idempotent seed data copied verbatim from src/data/site.ts, categories.ts, and articles.ts
-- Run AFTER 0001_init.sql and 0002_rls.sql in the Supabase SQL Editor.

-- 1. Admin allowlist placeholder (uncomment and replace with the real lowercase admin email)
-- INSERT INTO public.admin_users (email) VALUES ('ISI_EMAIL_ADMIN') ON CONFLICT (email) DO NOTHING;

-- 2. Categories (from src/data/categories.ts & SITE_DATA.categoryShowcase.items)
INSERT INTO public.categories (
  id,
  slug,
  name,
  description,
  image_src,
  image_alt,
  external_url,
  sort_order
)
VALUES
  (
    'cat-1',
    'pupuk-nutrisi',
    'Pupuk & Nutrisi',
    'Nutrisi lengkap dan pembenah tanah untuk pertumbuhan tanaman yang optimal.',
    '/images/categories/pupuk-nutrisi.jpg',
    'Aplikasi pupuk dan nutrisi tanaman di lahan pertanian',
    'https://id.shp.ee/fCveyX1e',
    0
  ),
  (
    'cat-2',
    'pestisida',
    'Pestisida',
    'Perlindungan tanaman yang efektif terhadap gangguan hama dan penyakit.',
    '/images/categories/pestisida.jpg',
    'Perlindungan tanaman terhadap gangguan hama dan penyakit',
    'https://id.shp.ee/fCveyX1e',
    1
  ),
  (
    'cat-3',
    'perlakuan-benih',
    'Perlakuan Benih',
    'Perlindungan dan nutrisi sejak fase awal untuk benih yang tumbuh sehat.',
    '/images/categories/perlakuan-benih.jpg',
    'Bibit dan benih tanaman hijau yang tumbuh sehat',
    'https://id.shp.ee/fCveyX1e',
    2
  ),
  (
    'cat-4',
    'produk-pendukung',
    'Produk Pendukung',
    'Rangkaian sarana pendukung budidaya untuk menunjang hasil panen maksimal.',
    '/images/categories/produk-pendukung.jpg',
    'Sarana pendukung budidaya pertanian di lapangan',
    'https://id.shp.ee/fCveyX1e',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_src = EXCLUDED.image_src,
  image_alt = EXCLUDED.image_alt,
  external_url = EXCLUDED.external_url,
  sort_order = EXCLUDED.sort_order;

-- 3. Site Content Blocks (from src/data/site.ts)
INSERT INTO public.site_content (key, value)
VALUES
  (
    'company',
    $json${
      "companyName": "Arga Tani Mandiri",
      "companyLegalNote": "Distribusi Resmi Sarana Produksi Pertanian & Agensia Hayati Indonesia",
      "fieldDescription": "Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi tanaman berkualitas untuk mendukung produktivitas dan keberlanjutan pertanian Indonesia.",
      "templateBannerText": "Distribusi Resmi Tani InD® Indonesia",
      "officialStore": {
        "name": "Tani InD® Indonesia",
        "platform": "Shopee",
        "url": "https://id.shp.ee/fCveyX1e",
        "verificationNote": "Toko resmi di Shopee"
      },
      "whatsappNumber": "6281234567890",
      "whatsappPlaceholderLabel": "Layanan Konsultasi WhatsApp",
      "contact": {
        "address": "Layanan Distribusi & Pengiriman Nasional (Mitra Penyalur & Marketplace Resmi Tani InD® Indonesia)",
        "addressPlaceholder": "Layanan Distribusi & Pengiriman Nasional (Mitra Penyalur & Marketplace Resmi Tani InD® Indonesia)",
        "phone": "Konsultasi Budidaya & Layanan Mitra via WhatsApp Resmi",
        "phonePlaceholder": "Layanan Konsultasi Teknis via WhatsApp",
        "email": "Layanan Pelanggan Tani InD® Indonesia",
        "emailPlaceholder": "Layanan Resmi Tani InD® Indonesia",
        "operatingHours": "Senin - Sabtu (08.00 - 17.00 WIB)",
        "operatingHoursPlaceholder": "Senin - Sabtu (08.00 - 17.00 WIB)"
      }
    }$json$::jsonb
  ),
  (
    'hero',
    $json${
      "eyebrow": "Inovasi Nyata untuk Pertanian Indonesia",
      "headlineMain": "Sarana Produksi Pertanian untuk Budidaya Optimal ",
      "headlineAccent": "dan Hasil Panen Maksimal",
      "subheadline": "Arga Tani Mandiri menyediakan produk pupuk, pestisida, dan nutrisi tanaman berkualitas untuk mendukung produktivitas dan keberlanjutan pertanian Indonesia.",
      "primaryCtaLabel": "Lihat Katalog Produk",
      "secondaryCtaLabel": "Kunjungi Tani InD® di Shopee",
      "imageSrc": "/images/hero-agriculture.jpg",
      "imageAlt": "Petani merawat barisan tanaman pertanian hijau bersama sarana produksi Arga Tani Mandiri",
      "trustItems": [
        {
          "id": "trust-1",
          "title": "Kualitas Terjamin",
          "subtitle": "Sesuai spesifikasi kemasan"
        },
        {
          "id": "trust-2",
          "title": "Ramah Lingkungan",
          "subtitle": "Aplikasi sesuai takaran"
        },
        {
          "id": "trust-3",
          "title": "Dukungan Informasi",
          "subtitle": "Panduan budidaya & dosis"
        },
        {
          "id": "trust-4",
          "title": "Distribusi Marketplace",
          "subtitle": "Tersedia di Shopee resmi"
        }
      ],
      "overlayBadgeLeft": {
        "title": "Terdaftar Resmi & Terpercaya",
        "description": "Produk dilengkapi informasi kemasan resmi untuk kebutuhan budidaya pertanian Indonesia."
      },
      "overlayBadgeRight": {
        "title": "Tani InD® Indonesia",
        "description": "Temukan semua produk kami di toko resmi Tani InD® Indonesia di Shopee."
      },
      "infoStrip": [
        {
          "id": "info-1",
          "label": "Toko Resmi di Shopee",
          "sublabel": "Tani InD® Indonesia. Belanja aman di toko resmi kami.",
          "ctaLabel": "Kunjungi Toko Shopee",
          "href": "https://id.shp.ee/fCveyX1e",
          "isExternal": true,
          "isPlaceholder": false
        },
        {
          "id": "info-2",
          "label": "Konsultasi via WhatsApp",
          "sublabel": "Tim kami siap membantu informasi kebutuhan pertanian Anda.",
          "ctaLabel": "Chat WhatsApp",
          "href": "#konsultasi-whatsapp",
          "isExternal": false,
          "isPlaceholder": false
        },
        {
          "id": "info-3",
          "label": "Informasi Layanan",
          "sublabel": "Layanan penyediaan sarana pertanian dan pengiriman ke berbagai daerah.",
          "ctaLabel": "Selengkapnya",
          "href": "#tentang-kami",
          "isExternal": false,
          "isPlaceholder": false
        },
        {
          "id": "info-4",
          "label": "Ketersediaan Kemasan",
          "sublabel": "Tersedia pilihan ukuran kemasan 500 gr dan 1 kg sesuai kebutuhan.",
          "ctaLabel": "Lihat Katalog",
          "href": "/#produk",
          "isExternal": false,
          "isPlaceholder": false
        }
      ]
    }$json$::jsonb
  ),
  (
    'category_showcase',
    $json${
      "pill": "Kategori Produk Kami",
      "heading": "Produk Berkualitas untuk Berbagai Kebutuhan Pertanian",
      "description": "Rangkaian sarana produksi pertanian yang disiapkan untuk mendukung kesuburan tanah, nutrisi tanaman, serta perawatan budidaya di lapangan.",
      "ctaLabel": "Lihat Semua Produk"
    }$json$::jsonb
  ),
  (
    'about',
    $json${
      "sectionEyebrow": "Tentang Kami",
      "heading": "Profil Perusahaan Arga Tani Mandiri",
      "introParagraphs": [
        "Arga Tani Mandiri bergerak di bidang penyediaan sarana produksi pertanian yang mencakup pupuk, pestisida, dan nutrisi tanaman bagi petani serta mitra penyalur.",
        "Seluruh spesifikasi teknis, petunjuk penggunaan, dan peringatan keselamatan produk merujuk langsung pada informasi resmi di kemasan serta etalase Shopee kami."
      ],
      "imagePlaceholderLabel": "Dokumentasi budidaya dan sarana produksi Arga Tani Mandiri",
      "visi": "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
      "visiPlaceholder": "Menjadi mitra penyedia sarana produksi pertanian yang andal, inovatif, dan berkontribusi nyata terhadap peningkatan kualitas tanah serta hasil panen petani Indonesia.",
      "misi": [
        "Menyediakan produk pupuk, pembenah tanah, dan nutrisi tanaman dengan komposisi terukur.",
        "Memudahkan akses produk resmi bagi petani di berbagai daerah melalui jaringan distribusi digital dan toko Shopee Tani InD®.",
        "Menghadirkan edukasi budidaya dan panduan pemakaian yang tepat guna."
      ],
      "whyChooseUsTitle": "Alasan Memilih Produk Kami",
      "whyChooseUs": [
        {
          "id": "why-1",
          "title": "Formulasi Tepat Guna",
          "description": "Menggabungkan pembenah tanah (Asam Humat) dan agensia hayati (Trichoderma) untuk merawat kesuburan sekaligus mencegah penyakit akar.",
          "isPlaceholder": false
        },
        {
          "id": "why-2",
          "title": "Informasi Kemasan Transparan",
          "description": "Spesifikasi komposisi, takaran penggunaan, serta kemasan 500 gr dan 1 kg yang tertera jelas pada label produk.",
          "isPlaceholder": false
        },
        {
          "id": "why-3",
          "title": "Akses Pembelian Mudah di Shopee",
          "description": "Tersedia secara resmi di Shopee (Tani InD® Indonesia) untuk memudahkan pemesanan eceran maupun rutin dari berbagai wilayah.",
          "isPlaceholder": false
        },
        {
          "id": "why-4",
          "title": "Dukungan Panduan Budidaya",
          "description": "Didukung artikel edukasi pertanian dan layanan konsultasi cepat via WhatsApp untuk membantu mengoptimalkan hasil panen.",
          "isPlaceholder": false
        }
      ]
    }$json$::jsonb
  ),
  (
    'whatsapp_band',
    $json${
      "heading": "Chat Tim Konsultasi Budidaya Arga Tani Mandiri",
      "description": "Tanyakan rekomendasi dosis pemakaian, ketersediaan kemasan 500 gr & 1 kg, atau informasi pemesanan untuk kebutuhan pertanian dan mitra penyalur.",
      "buttonLabel": "Chat Tim Konsultasi Budidaya",
      "disabledHint": "Layanan konsultasi aktif melalui WhatsApp resmi"
    }$json$::jsonb
  ),
  (
    'footer',
    $json${
      "blurb": "Mitra penyedia sarana produksi pertanian, pupuk, pembenah tanah, dan nutrisi tanaman. Pemesanan daring resmi dilayani melalui toko Tani InD® Indonesia di Shopee.",
      "storeCardTitle": "Toko Resmi Marketplace",
      "storeCardDescription": "Kunjungi toko resmi Tani InD® Indonesia di Shopee untuk melihat etalase produk yang tersedia.",
      "storeButtonLabel": "Kunjungi Tani InD® di Shopee"
    }$json$::jsonb
  )
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

-- 4. Articles (from src/data/articles.ts — seeded with status 'review')
INSERT INTO public.articles (
  slug,
  title,
  seo_title,
  short_title,
  meta_description,
  excerpt,
  intro,
  body,
  category,
  filter_category,
  reading_time,
  is_featured,
  status,
  image_src,
  image_alt,
  takeaways,
  tags,
  published_at
)
VALUES
  (
    'cara-membaca-informasi-label-kemasan-sarana-pertanian',
    'Cara Membaca Informasi & Takaran Dosis pada Label Kemasan Sarana Pertanian',
    'Panduan Label Kemasan Sarana Pertanian',
    NULL,
    'Panduan lengkap memahami struktur informasi resmi pada kemasan pupuk dan pembenah tanah agar aplikasi di lahan lebih tepat sasaran dan aman.',
    'Panduan lengkap memahami struktur informasi resmi pada kemasan pupuk dan pembenah tanah agar aplikasi di lahan lebih tepat sasaran dan aman.',
    'Setiap kemasan resmi sarana produksi pertanian memuat petunjuk teknis yang disusun sebagai acuan utama bagi petani dan penyalur di lapangan. Memahami struktur informasi pada label membantu pengguna mengenali komposisi bahan aktif, takaran dosis sesuai fase tanaman, serta aturan penyimpanan secara akurat.',
    $json$[
      {
        "id": "identitas-dan-komposisi-bahan-aktif",
        "heading": "Memeriksa Identitas Produk dan Komposisi Bahan Aktif",
        "paragraphs": [
          "Langkah pertama sebelum mengaplikasikan sarana produksi pertanian adalah memeriksa nama dagang, peruntukan kategori produk (seperti pembenah tanah, pupuk makro-mikro, atau agensia hayati), serta ukuran berat bersih kemasan (misalnya 500 gr atau 1 kg).",
          "Perhatikan rincian komposisi pada tabel kandungan. Sebagai contoh, pada produk pembenah tanah berbasis Asam Humat dan Trichoderma seperti lini Tamatric, label kemasan mencantumkan fungsi ganda bahan organik untuk memperbaiki struktur fisik tanah sekaligus mendukung mikrobiologi perakaran."
        ],
        "bullets": [
          "Pastikan segel kemasan dalam keadaan utuh dan teks label tercetak jelas.",
          "Cocokkan jenis kandungan produk dengan kebutuhan spesifik fase pertumbuhan tanaman (vegetatif atau generatif).",
          "Periksa nomor batch atau keterangan produksi pada bagian belakang kemasan."
        ],
        "callout": {
          "title": "Tips Praktis di Lahan",
          "text": "Selalu baca persentase bahan aktif sebelum mencampur dua jenis sarana pertanian agar tidak terjadi reaksi pengendapan pada tangki semprot atau larutan kocor."
        }
      },
      {
        "id": "memahami-takaran-dosis-dan-interval-aplikasi",
        "heading": "Memahami Petunjuk Takaran Dosis dan Interval Aplikasi",
        "paragraphs": [
          "Setiap komoditas pertanian memiliki kebutuhan nutrisi dan pembenah tanah yang berbeda tergantung pada kondisi pH tanah, tekstur lahan, dan umur tanaman. Label kemasan mencantumkan rentang takaran konsentrasi (gram per liter air) atau dosis tebar per luasan lahan.",
          "Gunakan alat takar yang konsisten seperti sendok takar atau timbangan digital kecil saat menyiapkan larutan kocor maupun semprot. Hindari memperkirakan takaran tanpa mengacu pada anjuran label agar efisiensi penyerapan hara oleh akar tetap optimal."
        ],
        "bullets": [
          "Aplikasi kocor pada zona perakaran umumnya dilakukan pada pagi atau sore hari saat suhu tanah stabil.",
          "Catat tanggal aplikasi untuk menjaga keteraturan interval pemberian nutrisi berikutnya.",
          "Sesuaikan volume air pelarut agar distribusi nutrisi merata ke seluruh perakaran tanaman."
        ]
      },
      {
        "id": "simbol-keselamatan-dan-penanganan-kemasan",
        "heading": "Simbol Keselamatan Kerja dan Penanganan Sisa Kemasan",
        "paragraphs": [
          "Bagian bawah label kemasan memuat piktogram atau simbol petunjuk keselamatan kerja selama proses pencampuran hingga pengaplikasian di lapangan. Penggunaan perlengkapan pelindung dasar seperti sarung tangan, masker, dan sepatu kebun sangat dianjurkan.",
          "Setelah selesai digunakan, tutup kembali kemasan bubuk atau cair dengan rapat dan simpan di tempat yang teduh, kering, serta jauh dari jangkauan anak-anak maupun hewan ternak."
        ],
        "bullets": [
          "Lipat dan ikat rapat bagian dalam plastik kemasan produk berbentuk serbuk (powder) agar tidak lembap.",
          "Cuci bersih alat semprot dan ember pengaduk segera setelah selesai digunakan di lahan.",
          "Jangan menggunakan kembali wadah bekas sarana pertanian untuk keperluan rumah tangga."
        ]
      }
    ]$json$::jsonb,
    'Panduan Label Kemasan',
    'Panduan Label',
    '5 Menit Baca',
    true,
    'review',
    '/images/categories/pupuk-nutrisi.jpg',
    'Petani memeriksa kesuburan tanah dan panduan penggunaan nutrisi tanaman',
    ARRAY['Identitas Bahan Aktif', 'Takaran & Interval', 'Keamanan Aplikasi'],
    ARRAY['Panduan Label', 'Dosis Pupuk', 'Asam Humat'],
    NULL
  ),
  (
    'pencatatan-kebutuhan-pupuk-dan-nutrisi-tanaman-per-musim-tanam',
    'Pencatatan Kebutuhan Pupuk dan Nutrisi Tanaman pada Setiap Musim Tanam',
    'Pencatatan Pupuk & Nutrisi Musim Tanam',
    NULL,
    'Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani mengatur jadwal aplikasi dan efisiensi biaya budidaya.',
    'Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani mengatur jadwal aplikasi dan efisiensi biaya budidaya.',
    'Perencanaan stok sarana produksi pertanian sebelum memasuki musim tanam membantu petani maupun pengelola kios mengatur ketersediaan barang secara tepat waktu. Pencatatan yang rapi memudahkan evaluasi jenis input yang diberikan pada setiap petak lahan dari awal olah tanah hingga panen.',
    $json$[
      {
        "id": "inventarisasi-jenis-sarana-produksi",
        "heading": "Inventarisasi Kebutuhan Sarana Produksi Sebelum Olah Tanah",
        "paragraphs": [
          "Tahap persiapan lahan merupakan waktu terbaik untuk mendata seluruh kebutuhan input pertanian, mulai dari pembenah tanah dasar (Asam Humat dan agensia hayati Trichoderma), pupuk dasar, hingga nutrisi lanjutan.",
          "Dengan menghitung jumlah populasi tanaman dan luas bedengan sejak awal, petani dapat memilih ukuran kemasan yang paling ekonomis, baik kemasan 500 gr untuk lahan terbatas maupun kemasan 1 kg untuk pemakaian rutin."
        ],
        "bullets": [
          "Kelompokkan kebutuhan input berdasarkan tahapan: pra-tanam, fase vegetatif, dan fase pembungaan/pembuahan.",
          "Periksa sisa stok musim sebelumnya untuk memastikan kemasan masih tersegel baik dan layak pakai.",
          "Siapkan cadangan pembenah tanah dan pelindung perakaran terutama saat memasuki musim penghujan."
        ]
      },
      {
        "id": "pencatatan-jadwal-pemakaian-lahan",
        "heading": "Pencatatan Jadwal Aplikasi Berdasarkan Fase Budidaya",
        "paragraphs": [
          "Buku catatan harian kebun berfungsi sebagai rekam jejak perlakuan pada setiap blok tanaman. Setiap kali melakukan pemupukan atau pengocoran pembenah tanah, catat tanggal aplikasi, jenis produk, takaran yang digunakan, serta kondisi cuaca.",
          "Data ini sangat membantu petani memantau respons pertumbuhan tanaman seperti vigor daun, kekuatan batang, dan ketahanan akar terhadap kelembapan tinggi."
        ],
        "bullets": [
          "Catat umur tanaman (Hari Setelah Tanam / HST) pada setiap jadwal pemberian nutrisi.",
          "Dokumentasikan perkembangan warna daun dan kondisi tanah setelah aplikasi pembenah tanah.",
          "Hindari tumpang tindih pemberian produk dengan fungsi serupa dalam waktu yang terlalu berdekatan."
        ],
        "callout": {
          "title": "Manfaat Rekam Jejak Budidaya",
          "text": "Catatan jadwal aplikasi yang lengkap memudahkan tim teknis memberikan rekomendasi tepat apabila tanaman menunjukkan gejala kekurangan nutrisi di pertengahan musim."
        }
      },
      {
        "id": "evaluasi-ketersediaan-kemasan",
        "heading": "Evaluasi Hasil Panen dan Perencanaan Pengadaan Berikutnya",
        "paragraphs": [
          "Pada akhir musim tanam, bandingkan catatan total penggunaan sarana produksi dengan hasil panen yang diperoleh. Evaluasi ini membantu menentukan kombinasi nutrisi dan pembenah tanah yang paling efektif untuk dipertahankan pada musim tanam selanjutnya.",
          "Bagi mitra penyalur maupun kelompok tani, rekapitulasi kebutuhan per musim juga mempermudah pemesanan kembali melalui saluran resmi seperti toko Shopee Tani InD® Indonesia."
        ],
        "bullets": [
          "Hitung rasio pemakaian kemasan 500 gr dan 1 kg untuk mengoptimalkan anggaran belanja sarana produksi.",
          "Simpan catatan dosis yang terbukti memberikan pertumbuhan paling seragam pada komoditas Anda.",
          "Lakukan pemesanan stok lebih awal sebelum jadwal olah tanah musim berikutnya dimulai."
        ]
      }
    ]$json$::jsonb,
    'Manajemen Budidaya',
    'Manajemen Budidaya',
    '4 Menit Baca',
    false,
    'review',
    '/images/categories/pestisida.jpg',
    'Petani merencanakan aplikasi nutrisi dan perawatan di lahan budidaya',
    ARRAY['Inventarisasi Kebutuhan Lahan', 'Jadwal Fase Pertumbuhan', 'Evaluasi Efisiensi Musim Tanam'],
    ARRAY['Manajemen Budidaya', 'Dosis Pupuk', 'Pembenah Tanah'],
    NULL
  ),
  (
    'penanganan-dan-penyimpanan-kemasan-input-pertanian-di-gudang',
    'Penanganan dan Penyimpanan Kemasan Input Pertanian di Gudang Penyalur',
    'Penyimpanan Kemasan Input di Gudang',
    NULL,
    'Kondisi ruang penyimpanan yang kering dan berventilasi baik berperan penting menjaga kualitas fisik serbuk, nutrisi cair, serta viabilitas agensia hayati.',
    'Kondisi ruang penyimpanan yang kering dan berventilasi baik berperan penting menjaga kualitas fisik serbuk, nutrisi cair, serta viabilitas agensia hayati.',
    'Kondisi ruang penyimpanan berperan besar dalam menjaga keutuhan fisik kemasan, kestabilan unsur hara, serta viabilitas mikroorganisme menguntungkan selama masa simpan. Penataan yang terstruktur juga memudahkan pemeriksaan stok secara berkala oleh petani maupun pengelola kios pertanian.',
    $json$[
      {
        "id": "ventilasi-dan-kondisi-ruang-simpan",
        "heading": "Pengaturan Sirkulasi Udara dan Kelembapan Ruang Simpan",
        "paragraphs": [
          "Produk sarana pertanian berbentuk serbuk (powder) seperti Asam Humat dan formulasi biologis Trichoderma memerlukan ruang simpan yang sejuk, teduh, dan terhindar dari paparan sinar matahari langsung. Suhu ruang yang terlalu panas atau lembap dapat memicu penggumpalan serbuk.",
          "Pastikan ruang penyimpanan memiliki ventilasi udara yang cukup agar terjadi pertukaran udara secara alami dan kelembapan ruangan tetap terkendali sepanjang hari."
        ],
        "bullets": [
          "Simpan produk pada suhu ruang yang sejuk dan hindarkan dari atap transparan yang memancarkan panas berlebih.",
          "Gunakan alas palet kayu atau rak penyangga agar kemasan tidak bersentuhan langsung dengan lantai tanah atau semen yang lembap.",
          "Jauhkan area penyimpanan dari sumber percikan air atau talang hujan."
        ]
      },
      {
        "id": "pemisahan-kelompok-produk",
        "heading": "Pemisahan Kelompok Produk Berdasarkan Kategori dan Bentuk",
        "paragraphs": [
          "Penataan gudang yang rapi selalu memisahkan kelompok produk berdasarkan jenis dan wujud fisiknya. Tempatkan kemasan pupuk nutrisi dan pembenah tanah terpisah dari produk pengendali hama agar tidak terjadi kontaminasi silang.",
          "Susun kemasan berbentuk botol atau cair di rak bagian bawah, sedangkan kemasan kantong serbuk (seperti kemasan 500 gr dan 1 kg) ditempatkan di rak bagian atas yang kering."
        ],
        "bullets": [
          "Terapkan sistem First Expired, First Out (FEFO) agar stok yang lebih awal masuk digunakan lebih dahulu.",
          "Beri jarak antar tumpukan kardus untuk menjaga aliran udara di sela-sela kemasan.",
          "Pasang penanda kategori yang jelas pada setiap baris rak penyimpanan."
        ],
        "callout": {
          "title": "Menjaga Mutu Agensia Hayati",
          "text": "Produk yang mengandung mikroorganisme bermanfaat seperti Trichoderma wajib disimpan di tempat teduh dan ditutup rapat kembali segera setelah sebagian isinya ditakar."
        }
      },
      {
        "id": "pemeriksaan-berkala-keterbacaan-label",
        "heading": "Pemeriksaan Berkala Kondisi Segel dan Keterbacaan Label",
        "paragraphs": [
          "Lakukan inspeksi rutin setiap minggu untuk memastikan tidak ada kemasan yang mengalami kebocoran, kerusakan segel, atau pudarnya informasi pada label. Label yang tetap bersih dan terbaca jelas menjamin keamanan pengguna saat menakar produk di lapangan.",
          "Apabila terdapat kemasan yang sudah dibuka sebagian untuk pemakaian bertahap, gunakan klip penjepit kedap udara dan beri catatan tanggal pembukaan kemasan."
        ],
        "bullets": [
          "Pastikan bagian mulut kantong aluminium foil atau plastik tebal bersih dari sisa serbuk sebelum ditutup kembali.",
          "Segera bersihkan area rak apabila terdapat tumpahan serbuk atau cairan nutrisi.",
          "Simpan produk di rak khusus yang terpisah dari bahan pangan dan pakan ternak."
        ]
      }
    ]$json$::jsonb,
    'Penyimpanan & Distribusi',
    'Penyimpanan & Gudang',
    '4 Menit Baca',
    false,
    'review',
    '/images/categories/produk-pendukung.jpg',
    'Lahan pertanian terawat dengan pengelolaan sarana produksi yang rapi',
    ARRAY['Sirkulasi Udara & Kelembapan', 'Penataan Rak & Palet', 'Perlindungan Mutu Bahan Aktif'],
    ARRAY['Manajemen Gudang', 'Penyimpanan & Gudang', 'Panduan Label'],
    NULL
  ),
  (
    'manfaat-trichoderma-dan-asam-humat-dalam-mengembalikan-kesuburan-tanah',
    'Manfaat Trichoderma dan Asam Humat dalam Mengembalikan Kesuburan Tanah',
    'Manfaat Trichoderma dan Asam Humat',
    NULL,
    'Sinergi bahan organik Asam Humat dan mikroorganisme menguntungkan Trichoderma membantu memulihkan lahan jenuh serta melindungi perakaran tanaman.',
    'Sinergi bahan organik Asam Humat dan mikroorganisme menguntungkan Trichoderma membantu memulihkan lahan jenuh sekaligus melindungi perakaran dari serangan jamur patogen.',
    'Penggunaan pupuk kimia secara intensif dalam jangka panjang sering membuat struktur tanah menjadi keras, masam, dan miskin mikroorganisme menguntungkan. Kombinasi pembenah tanah Asam Humat dan agensia hayati Trichoderma hadir sebagai solusi terpadu untuk memulihkan kesehatan fisik, kimia, dan biologi tanah secara berkelanjutan.',
    $json$[
      {
        "id": "peran-asam-humat-memperbaiki-struktur-tanah",
        "heading": "Peran Asam Humat dalam Memperbaiki Struktur Fisik dan Kimia Tanah",
        "paragraphs": [
          "Asam Humat merupakan fraksi aktif senyawa humik alami yang memiliki kemampuan tinggi dalam meningkatkan Kapasitas Tukar Kation (KTK) tanah. Pada tanah lempung yang padat, Asam Humat membantu membentuk agregat tanah yang lebih gembur sehingga sirkulasi oksigen dan penetrasi akar menjadi jauh lebih baik.",
          "Selain memperbaiki porositas lahan, molekul Asam Humat mengikat ion hara makro dan mikro di dalam tanah agar tidak mudah tercuci oleh air hujan atau irigasi, sehingga pupuk yang diberikan dapat diserap secara maksimal oleh akar tanaman."
        ],
        "bullets": [
          "Membantu menstabilkan pH tanah pada lahan yang mengalami kemasaman akibat residu pemupukan intensif.",
          "Meningkatkan daya simpan air (water holding capacity) pada tanah berpasir maupun lahan kering.",
          "Merangsang pertumbuhan rambut-rambut akar baru yang aktif menyerap nutrisi."
        ]
      },
      {
        "id": "mekanisme-trichoderma-melindungi-akar",
        "heading": "Mekanisme Agensia Hayati Trichoderma Melindungi Zona Perakaran",
        "paragraphs": [
          "Trichoderma adalah cendawan antagonis bermanfaat yang hidup secara alami di sekitar perakaran tanaman (rizosfer). Ketika diaplikasikan ke tanah, Trichoderma berkembang membentuk koloni pelindung di permukaan akar dan bersaing ruang serta nutrisi melawan jamur patogen tular tanah seperti penyebab layu Fusarium dan busuk akar.",
          "Keberadaan Trichoderma juga membantu mempercepat proses dekomposisi bahan organik di dalam tanah menjadi senyawa hara sederhana yang siap diserap oleh tanaman."
        ],
        "bullets": [
          "Menekan perkembangan jamur patogen tular tanah secara alami tanpa meninggalkan residu berbahaya.",
          "Mendukung ketahanan alami tanaman sejak fase pindah tanam hingga masa generatif.",
          "Bekerja sinergis dengan bahan organik di sekitar perakaran untuk menjaga keseimbangan biologi tanah."
        ],
        "callout": {
          "title": "Solusi Terpadu Tamatric (Asam Humat & Trichoderma)",
          "text": "Produk unggulan Tamatric dari Arga Tani Mandiri memadukan Asam Humat sebagai pembenah tanah sekaligus sumber karbon organik yang mendukung aktivitas Trichoderma di zona perakaran, tersedia dalam kemasan 500 gr dan 1 kg di toko resmi Tani InD® Indonesia."
        }
      },
      {
        "id": "cara-aplikasi-efektif-di-lahan",
        "heading": "Panduan Waktu dan Cara Aplikasi yang Efektif di Lahan",
        "paragraphs": [
          "Kombinasi Asam Humat dan Trichoderma paling efektif diberikan sejak tahap persiapan lahan (sebelum tanam atau saat pindah tanam) serta diulangi secara berkala melalui sistem kocor di sekitar pangkal batang.",
          "Aplikasi pada awal musim tanam memberi kesempatan bagi struktur tanah untuk pulih dan memungkinkan koloni Trichoderma menguasai zona perakaran lebih dahulu sebelum akar tanaman terpapar patogen di lapangan."
        ],
        "bullets": [
          "Larutkan produk sesuai takaran pada label kemasan dan kocorkan merata di sekitar perakaran pada pagi atau sore hari.",
          "Jaga kelembapan tanah yang cukup agar spora Trichoderma dapat aktif berkembang di zona rizosfer.",
          "Hindari mencampur langsung larutan agensia hayati dengan fungisida kimia sintetis dalam satu wadah."
        ]
      }
    ]$json$::jsonb,
    'Pembenah Tanah',
    'Pembenah Tanah',
    '5 Menit Baca',
    false,
    'review',
    '/images/categories/perlakuan-benih.jpg',
    'Bibit dan benih pertanian sehat berkat aplikasi pembenah tanah dan Trichoderma',
    ARRAY['Perbaikan Struktur & KTK Tanah', 'Perlindungan Hayati Perakaran', 'Optimalisasi Serapan Pupuk'],
    ARRAY['Pembenah Tanah', 'Asam Humat', 'Trichoderma', 'Dosis Pupuk'],
    NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  seo_title = EXCLUDED.seo_title,
  short_title = EXCLUDED.short_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  intro = EXCLUDED.intro,
  body = EXCLUDED.body,
  category = EXCLUDED.category,
  filter_category = EXCLUDED.filter_category,
  reading_time = EXCLUDED.reading_time,
  is_featured = EXCLUDED.is_featured,
  status = EXCLUDED.status,
  image_src = EXCLUDED.image_src,
  image_alt = EXCLUDED.image_alt,
  takeaways = EXCLUDED.takeaways,
  tags = EXCLUDED.tags,
  published_at = EXCLUDED.published_at;
