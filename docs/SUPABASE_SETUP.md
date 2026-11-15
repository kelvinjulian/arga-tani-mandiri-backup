# Panduan Setup Database Supabase (`docs/SUPABASE_SETUP.md`)

Dokumen ini menjelaskan langkah menjalankan skrip SQL pada **Supabase SQL Editor** untuk menyiapkan skema database, kebijakan *Row Level Security (RLS)*, *Storage bucket*, dan data awal. Tidak ada kunci rahasia yang dicantumkan di sini.

---

## 1. Urutan Eksekusi di Supabase SQL Editor

Jalankan file berikut **secara berurutan** melalui menu **SQL Editor** di dasbor Supabase:

1. **`supabase/migrations/0001_init.sql`**
   - Membuat tipe enum `public.article_status` (`'draft'`, `'review'`, `'published'`).
   - Membuat fungsi trigger `public.set_updated_at()` untuk memperbarui kolom `updated_at` otomatis.
   - Membuat tabel `public.articles`, `public.categories`, `public.site_content`, dan `public.admin_users` beserta indeks pada `slug`, `status`, dan `sort_order`.

2. **`supabase/migrations/0002_rls.sql`**
   - Mengaktifkan RLS pada keempat tabel (`articles`, `categories`, `site_content`, `admin_users`).
   - Membuat fungsi `public.is_admin()` (`SECURITY DEFINER`, `SET search_path = ''`) yang memeriksa apakah email dari JWT pengguna terdaftar di `public.admin_users`.
   - Menerapkan kebijakan baca publik dan tulis khusus admin.
   - Membuat *Storage bucket* publik bernama `media` (batas ukuran 2 MB, hanya `image/webp`, `image/jpeg`, `image/png`) dan kebijakan tulis khusus admin pada `storage.objects`.

3. **`supabase/seed.sql`**
   - Mengisi data awal secara idempoten (`ON CONFLICT ... DO UPDATE`) dari file statis proyek (`src/data/site.ts`, `categories.ts`, `articles.ts`).
   - Seluruh artikel awal di-seed dengan status `'review'`.
   - **Langkah manual:** Sebelum atau sesudah menjalankan `seed.sql`, daftarkan email admin pertama (huruf kecil) ke `public.admin_users`:
     ```sql
     INSERT INTO public.admin_users (email)
     VALUES ('admin@domain-anda.com')
     ON CONFLICT (email) DO NOTHING;
     ```

---

## 2. Daftar Kunci `site_content`

Tabel `public.site_content` menyimpan blok konfigurasi beranda dengan kunci berikut:
- `company`: identitas perusahaan, deskripsi umum, toko resmi Shopee, nomor WhatsApp, dan detail kontak.
- `hero`: teks Hero, label CTA, gambar Hero, *trust items*, *overlay badge*, dan 4 item *info strip*.
- `category_showcase`: *pill*, judul, deskripsi, dan label CTA bagian kategori produk.
- `about`: teks profil, visi, misi, dan 4 poin *why choose us*.
- `whatsapp_band`: judul, deskripsi, dan label tombol pita konsultasi WhatsApp.
- `footer`: deskripsi ringkas footer dan kartu toko resmi marketplace.

---

## 3. Pengujian Keamanan (Test Section)

Jalankan blok SQL berikut di **Supabase SQL Editor** untuk memverifikasi bahwa peran `anon` hanya dapat membaca data publik yang diizinkan dan **gagal** melakukan perubahan apa pun. Setiap blok uji dibungkus `BEGIN; ... ROLLBACK;` agar tidak meninggalkan data uji.

### A. Uji Baca Publik (`SET LOCAL ROLE anon`) — Harus Berhasil
```sql
BEGIN;
SET LOCAL ROLE anon;

-- 1. Harus berhasil dan hanya menampilkan artikel berstatus 'review' atau 'published'
SELECT slug, status FROM public.articles;

-- 2. Harus berhasil menampilkan kategori & konten beranda
SELECT id, name FROM public.categories ORDER BY sort_order;
SELECT key FROM public.site_content;

-- 3. Harus mengembalikan 0 baris (admin_users terkunci oleh RLS tanpa policy publik)
SELECT * FROM public.admin_users;

ROLLBACK;
```

### B. Uji Tulis Publik (`SET LOCAL ROLE anon`) — Semua Harus GAGAL
Jalankan satu per satu (atau pisahkan per transaksi); setiap perintah di bawah ini **wajib** ditolak dengan galat RLS (`new row violates row-level security policy` atau `permission denied`):

```sql
-- 1. INSERT ke articles harus GAGAL
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.articles (
  slug, title, seo_title, meta_description, excerpt, intro,
  category, filter_category, reading_time, image_src, image_alt
) VALUES (
  'uji-anon', 'Uji', 'Uji', 'Uji', 'Uji', 'Uji',
  'Uji', 'Uji', '1 Menit', '/images/hero-agriculture.jpg', 'Uji'
);
ROLLBACK;

-- 2. UPDATE ke categories harus GAGAL
BEGIN;
SET LOCAL ROLE anon;
UPDATE public.categories SET name = 'Diubah Anon' WHERE id = 'cat-1';
ROLLBACK;

-- 3. DELETE dari site_content harus GAGAL
BEGIN;
SET LOCAL ROLE anon;
DELETE FROM public.site_content WHERE key = 'hero';
ROLLBACK;

-- 4. INSERT ke admin_users harus GAGAL
BEGIN;
SET LOCAL ROLE anon;
INSERT INTO public.admin_users (email) VALUES ('hacker@example.com');
ROLLBACK;
```

*(Catatan: Untuk `UPDATE` dan `DELETE` tanpa policy `UPDATE`/`DELETE` bagi `anon`, PostgreSQL/RLS dapat mengembalikan `0 rows affected` tanpa error eksplisit karena baris tidak terlihat/tidak diizinkan untuk dimodifikasi — pastikan data asli tidak berubah setelah `ROLLBACK`.)*

---

## 4. Hal yang Perlu Diverifikasi di Dokumentasi Supabase Terbaru

Sebelum membangun tahap CMS/autentikasi (`/admin`), verifikasi hal berikut pada dokumentasi resmi Supabase:
1. **Kolom `storage.buckets`:** Pastikan versi skema `storage` proyek Anda mendukung kolom `file_size_limit` dan `allowed_mime_types` pada `INSERT INTO storage.buckets`.
2. **Klaim JWT Email (`auth.jwt() ->> 'email'`):** Pastikan penyedia login Supabase Auth yang dipilih (Email/Password atau Magic Link) selalu menyertakan klaim `email` pada JWT saat admin melakukan mutasi dari browser/SSR.
3. **Nama Kunci Publik:** Pastikan proyek Supabase Anda menggunakan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau *publishable key* yang kompatibel dengan `@supabase/supabase-js`).
