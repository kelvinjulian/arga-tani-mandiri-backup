# Panduan Setup Akun Admin (`docs/ADMIN_SETUP.md`)

Dokumen ini menjelaskan cara membuat akun admin pertama di Supabase dan menguji alur masuk `/admin` secara aman. Tidak ada kredensial atau kunci rahasia di sini.

---

## 1. Nonaktifkan Pendaftaran Publik & Buat Akun Admin

1. Buka dasbor proyek di **Supabase -> Authentication -> Sign In / Providers** (atau **User Signups**):
   - Pastikan opsi **Allow new users to sign up** dalam keadaan **nonaktif (OFF)** agar tidak ada pihak luar yang dapat mendaftarkan akun baru.
2. Buka menu **Authentication -> Users -> Add user -> Create new user** (atau **Invite user**):
   - Masukkan alamat email admin dan kata sandi sementara yang kuat.
   - Pastikan centang **Auto Confirm User** diaktifkan agar kolom `email_confirmed_at` langsung terisi.
   - > **Penting:** Fungsi database `public.is_admin()` (dari `0003_hardening.sql`) secara eksplisit mensyaratkan `email_confirmed_at IS NOT NULL`. Akun yang belum terkonfirmasi tidak akan pernah lolos pemeriksaan admin meskipun emailnya ada di `admin_users`.

---

## 2. Daftarkan Email ke Allowlist `public.admin_users`

Setelah akun selesai dibuat di **Authentication -> Users**, buka **SQL Editor** dan jalankan perintah berikut dengan email huruf kecil:

```sql
INSERT INTO public.admin_users (email)
VALUES ('admin@domain-anda.com')
ON CONFLICT (email) DO NOTHING;
```

---

## 3. Pengujian Alur Login (`/admin`)

1. **Akses tanpa login:** Buka `/admin` di browser — aplikasi harus mengarahkan otomatis ke `/admin/login`.
2. **Gagal login (kata sandi salah / email tidak terdaftar):** Masukkan kredensial yang salah — pesan galat generik `"Email atau kata sandi salah"` harus muncul tanpa membocorkan apakah email terdaftar.
3. **Akun non-admin:** Jika login dengan akun Supabase Auth yang tidak ada di `public.admin_users` (atau email belum dikonfirmasi), sesi harus langsung dikeluarkan dan menampilkan `"Akun ini tidak memiliki akses admin"`.
4. **Login admin berhasil:** Masuk dengan akun admin terkonfirmasi — aplikasi mengarahkan ke `/admin`, menampilkan email admin yang masuk serta dua kartu placeholder (`Artikel` dan `Konten Beranda` bertanda `Segera hadir`).
5. **Redirect saat sudah login:** Mengakses `/admin/login` dalam keadaan sudah login sebagai admin harus mengarahkan kembali ke `/admin`.
6. **Logout:** Tekan tombol **Keluar** — sesi cookie dihapus dan browser diarahkan ke `/admin/login`.

---

## 4. Mengelola artikel

- **Rute admin artikel:** Setelah masuk ke `/admin`, pilih kartu **Artikel** untuk membuka daftar artikel (`/admin/artikel`), membuat artikel baru (`/admin/artikel/baru`), mengubah (`/admin/artikel/[id]`), atau melihat pratinjau (`/admin/artikel/[id]/pratinjau`).
- **Status alur kerja:**
  - `draft`: hanya dapat dibaca oleh admin di panel admin (`RLS` membatasi akses publik).
  - `review`: dapat diakses di URL publik dengan meta `noindex` untuk peninjauan sebelum terbit.
  - `published`: tampil di situs publik dan masuk ke `sitemap.xml` (nilai `published_at` diisi otomatis saat pertama kali diterbitkan dan dipertahankan pada suntingan berikutnya).
- **Kategori filter & Artikel Utama (`is_featured`):** Pilihan `filter_category` dibatasi pada nilai yang didukung filter halaman publik (`Panduan Label`, `Manajemen Budidaya`, `Pembenah Tanah`, `Penyimpanan & Gudang`). Hanya satu artikel yang dapat berstatus `is_featured = true` pada satu waktu; mengaktifkannya akan otomatis menonaktifkan status Utama pada artikel lain.
- **Unggah gambar:** Gambar diunggah langsung ke bucket Storage `media` menggunakan sesi admin (`articles/<uuid>/<timestamp>-<nama>.<ext>`). File berformat JPG/PNG/WebP di atas 2 MB akan diperkecil di browser (maks. sisi panjang 1920 px, WebP kualitas 0,82) sebelum diunggah. File gambar lama tidak dihapus otomatis.
- **Konkurensi & revalidasi cache:** Setiap pembaruan memeriksa `updated_at` asli (optimistic concurrency) agar suntingan di tab berbeda tidak saling menimpa. Setelah simpan atau hapus berhasil, cache Next.js untuk `/`, `/artikel`, `/artikel/<slug>` (termasuk slug lama jika berubah), dan `/sitemap.xml` langsung direvalidasi.
