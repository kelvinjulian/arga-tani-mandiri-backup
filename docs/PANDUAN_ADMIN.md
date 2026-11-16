# Panduan Penggunaan Panel Admin Arga Tani Mandiri

Panduan singkat ini disusun untuk pengelola situs agar dapat memperbarui artikel, tulisan di halaman utama, serta daftar kategori produk dengan aman dan mudah.

---

## 1. Cara Masuk & Keluar

1. Buka halaman `/admin/login` di browser Anda.
2. Masukkan **email** dan **kata sandi** akun admin Anda, lalu tekan **Masuk**.
3. Jika sudah selesai bekerja, tekan tombol **Keluar** di pojok kanan atas agar akun tetap aman.

---

## 2. Mengelola Artikel Edukasi

Buka menu **Artikel** dari halaman utama Panel Admin.

- **Membuat atau mengubah artikel:** Tekan **Buat Artikel** untuk menulis baru, atau **Ubah** pada salah satu artikel yang ada.
- **Melihat tampilan sebelum terbit:** Gunakan tombol **Lihat** atau **Pratinjau** untuk melihat hasil tampilan persis seperti yang dilihat pengunjung.
- **Menghapus artikel:** Buka halaman ubah artikel, tekan **Hapus Artikel**, lalu ketik ulang alamat slug artikel untuk konfirmasi.

### Arti Status Artikel
- **Draft:** Hanya bisa dilihat oleh admin di dalam Panel Admin. Belum tampil di situs publik.
- **Review:** Sudah bisa dibuka lewat tautan situs publik dengan tanda **DRAFT: perlu ditinjau**, tetapi belum dimasukkan ke hasil pencarian Google.
- **Terbit:** Sudah tayang penuh untuk umum dan siap ditemukan oleh mesin pencari.

---

## 3. Mengelola Konten Beranda

Buka menu **Konten Beranda** untuk mengubah teks dan informasi penting di halaman depan, meliputi:
- **Identitas Perusahaan & Kontak:** Nama perusahaan, tautan toko Shopee resmi, serta **nomor WhatsApp** (isi hanya angka dengan kode negara, misalnya `6281234567890`, tanpa tanda `+` atau spasi).
- **Bagian Hero Beranda:** Judul utama, subjudul, tombol aksi, gambar utama, poin kepercayaan, dan kartu informasi.
- **Pengantar Kategori Produk, Tentang Kami, Pita WhatsApp, dan Footer:** Semua teks dapat diperbarui sesuai kebutuhan tanpa menyentuh kode.

---

## 4. Mengelola Kategori Produk

Buka menu **Kategori Produk** untuk mengatur 1 hingga 8 kategori yang tampil di halaman depan:
- Tekan **Tambah Kategori** untuk menambah kartu baru, atau **Ubah** pada kategori yang ada.
- Gunakan tombol **panah atas / bawah** untuk mengatur urutan tampil.
- Gunakan tombol **tempat sampah** jika ingin menghapus kategori (minimal harus tersisa 1 kategori).

---

## 5. Mengunggah Gambar

- Format gambar yang diterima: **JPG**, **PNG**, atau **WebP**.
- Batas ukuran file adalah **2 MB**. Jika Anda memilih foto yang lebih besar dari 2 MB, sistem akan otomatis memperkecil ukurannya sebelum mengunggah.
- **Teks Alternatif (Alt)** wajib diisi dengan penjelasan singkat isi gambar (membantu pembaca layar dan pencarian Google).

---

## 6. Tombol "Kembalikan ke teks awal"

Pada setiap bagian **Konten Beranda** dan **Kategori Produk**, tersedia tombol **Kembalikan ke teks awal**. Jika ditekan dan dikonfirmasi, seluruh tulisan pada bagian tersebut akan dikembalikan persis seperti isi bawaan awal situs.

---

## 7. Jika Terjadi Kendala

- **Pesan "Bagian ini sudah diubah di tab/perangkat lain":** Artinya ada perubahan lain yang lebih baru. Tekan **Muat Ulang** agar Anda melihat data terbaru sebelum menyimpan lagi.
- **Perubahan belum langsung terlihat:** Tekan muat ulang (*refresh*) pada halaman situs publik. Jika masih ada kendala, catat pesan yang muncul di layar dan hubungi pengembang situs Anda.


## Mengubah Bagian Artikel Edukasi di Beranda

1. Buka **Konten Beranda** (`/admin/konten`) lalu pilih **Artikel Edukasi (Beranda)**.
2. Anda dapat mengubah judul bagian, deskripsi, tombol **Lihat Semua Artikel** (beserta tujuan tautannya), label kartu baca, jumlah kartu samping (1–3), teks saat artikel kosong, gambar aksen opsional, dan teks pita konsultasi di bagian bawah.
3. Klik **Simpan Perubahan** untuk menerbitkan, atau **Kembalikan ke teks awal** untuk kembali ke teks bawaan.

## Mengelola Kategori Artikel

1. Buka **Kategori Artikel** (`/admin/kategori-artikel`) dari Dasbor atau tombol **Kelola Kategori Artikel** di halaman Daftar Artikel.
2. **Tambah kategori:** isi Nama Kategori dan Slug Filter (terisi otomatis), lalu klik **Tambah**.
3. **Ubah nama / slug & urutan:** klik **Ubah** untuk memperbarui nama/slug (artikel yang memakai kategori ini otomatis ikut diperbarui), atau gunakan tombol panah atas/bawah untuk mengatur urutan tampil di filter.
4. **Hapus kategori:** kategori hanya dapat dihapus jika tidak sedang dipakai oleh artikel mana pun.
5. **Dari editor artikel:** saat membuat/mengubah artikel, pilih kategori dari daftar dropdown atau klik **+ Kategori baru** untuk membuat kategori langsung tanpa kehilangan draf yang sedang ditulis.

## Mengelola Bagian Testimoni di Beranda

1. Buka **Konten Situs** (`/admin/konten`) lalu pilih **Testimoni Pelanggan** (`/admin/konten/testimonials`).
2. Anda dapat mengaktifkan/menonaktifkan bagian, mengatur label **Contoh**, tampilan **Rating** bintang, serta **Strip Angka Ringkasan** (maksimal 4 angka, dapat ditambah, dihapus, dan diurutkan).
3. Di **Daftar Testimoni** (maksimal 12 item), gunakan tombol **Jadikan sorotan** untuk memilih testimoni awal pada kartu utama, ubah urutan, atau unggah foto opsional (wajib isi teks alternatif jika foto diisi).
4. Hapus atau ganti seluruh item bertanda **Contoh** (baik testimoni maupun angka ringkasan) dengan data asli pelanggan (dengan izin) sebelum situs diluncurkan, lalu klik **Simpan Perubahan**.

## Mengelola Daftar Video (YouTube & TikTok)

1. Buka **Video** (`/admin/video`) dari **Dashboard** admin.
2. **Tambah satu video:** klik **Tambah Video**, tempel tautan YouTube (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`) atau TikTok (`tiktok.com/@akun/video/...`, `vm.tiktok.com/...`, `vt.tiktok.com/...`), isi judul, lalu atur deskripsi, durasi, atau thumbnail opsional.
3. **Tempel banyak URL sekaligus:** klik **Tempel Banyak URL** (`/admin/video/banyak`), masukkan hingga 50 tautan (satu per baris), klik **Periksa URL & Pratinjau** untuk melihat hasil validasi/duplikat dan mengedit judul, lalu simpan yang valid.
4. **Status, Beranda, & Unggulan:** pilih **Terbit** agar tampil di publik atau **Draft** untuk disimpan internal; aktifkan **Jadikan unggulan** untuk menandai satu video utama (menggantikan video unggulan sebelumnya secara otomatis). Gunakan tombol panah atas/bawah di daftar untuk mengatur urutan tampil (tetap bekerja lintas halaman paginasi).
