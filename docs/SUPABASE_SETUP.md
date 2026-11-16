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
   - Membuat fungsi `public.is_admin()` dan menerapkan kebijakan baca publik serta tulis khusus admin.
   - Membuat *Storage bucket* publik bernama `media` (batas ukuran 2 MB, hanya `image/webp`, `image/jpeg`, `image/png`) dan kebijakan tulis khusus admin pada `storage.objects`.

3. **`supabase/migrations/0003_hardening.sql`**
   - Mengunci `search_path = ''` pada `public.set_updated_at()`.
   - Memperketat `public.is_admin()` agar mencocokkan `auth.uid()` dengan `auth.users` dan mewajibkan `email_confirmed_at IS NOT NULL`, serta mencabut eksekusi fungsi dari `PUBLIC` dan `anon`.
   - Mencabut hak akses tabel yang tidak diperlukan pada `anon` dan `authenticated` (*defense in depth*, di mana `admin_users` dicabut seluruh haknya).
   - Menghapus kebijakan daftar objek anonim pada `storage.objects` (bucket `media` tetap publik sehingga URL gambar tetap berfungsi, sementara daftar objek hanya untuk admin).

4. **`supabase/seed.sql`**
   - Mengisi data awal secara idempoten (`ON CONFLICT ... DO UPDATE`) dari file statis proyek (`src/data/site.ts`, `categories.ts`, `articles.ts`).
   - Seluruh artikel awal di-seed dengan status `'review'`.

> **⚠️ Catatan Akun Admin (Penting):** Sebelum halaman login admin dibangun, **nonaktifkan pendaftaran pengguna baru (*Disable new user sign-ups*)** di menu **Supabase Authentication**, lalu buat akun admin melalui fitur **Invite User (undangan)**. Masukkan email admin ke tabel `public.admin_users` **hanya setelah akun tersebut selesai dibuat dan dikonfirmasi**:
> ```sql
> INSERT INTO public.admin_users (email)
> VALUES ('admin@domain-anda.com')
> ON CONFLICT (email) DO NOTHING;
> ```
> Fungsi `public.is_admin()` membaca tabel `auth.users` secara langsung dan wajib diuji/diverifikasi menggunakan akun admin yang sebenarnya.

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

Supabase SQL Editor secara bawaan berjalan dengan peran superuser/postgres yang **melewati (bypass) RLS**. Oleh karena itu, pengujian wajib menggunakan `set role anon;` dan diakhiri `reset role;`:

```sql
set role anon;
select count(*) from public.articles;   -- must succeed, only review/published rows
select * from public.admin_users;       -- must FAIL (permission denied)
insert into public.categories (id, slug, name, description, image_src, image_alt, external_url) values ('x','x','x','x','x','x','x');  -- must FAIL
reset role;
```

### Pengujian Keamanan `0006_videos.sql`

```sql
set role anon;
select count(*) from public.videos;     -- hanya mengembalikan baris dengan status = 'published'
insert into public.videos (platform, url, title) values ('youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'Uji'); -- wajib GAGAL
reset role;
```

Pengujian REST API (ganti `<SUPABASE_URL>` dan `<ANON_KEY>` dengan nilai publik proyek):

```bash
# GET diizinkan (hanya mengembalikan status = published)
curl -s "<SUPABASE_URL>/rest/v1/videos?select=id,title,status" -H "apikey: <ANON_KEY>"

# POST / PATCH / DELETE wajib ditolak (401/403)
curl -i -X POST "<SUPABASE_URL>/rest/v1/videos" -H "apikey: <ANON_KEY>" -H "Content-Type: application/json" -d '{"platform":"youtube","url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","title":"Uji"}'
curl -i -X PATCH "<SUPABASE_URL>/rest/v1/videos?id=eq.00000000-0000-0000-0000-000000000000" -H "apikey: <ANON_KEY>" -H "Content-Type: application/json" -d '{"title":"Uji"}'
curl -i -X DELETE "<SUPABASE_URL>/rest/v1/videos?id=eq.00000000-0000-0000-0000-000000000000" -H "apikey: <ANON_KEY>"
```

---

## 4. Hal yang Perlu Diverifikasi di Dokumentasi Supabase Terbaru

Sebelum membangun tahap CMS/autentikasi (`/admin`), verifikasi hal berikut pada dokumentasi resmi Supabase:
1. **Kolom `storage.buckets`:** Pastikan versi skema `storage` proyek Anda mendukung kolom `file_size_limit` dan `allowed_mime_types` pada `INSERT INTO storage.buckets`.
2. **Klaim JWT Email (`auth.jwt() ->> 'email'`):** Pastikan penyedia login Supabase Auth yang dipilih (Email/Password atau Magic Link) selalu menyertakan klaim `email` pada JWT saat admin melakukan mutasi dari browser/SSR.
3. **Nama Kunci Publik:** Pastikan proyek Supabase Anda menggunakan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau *publishable key* yang kompatibel dengan `@supabase/supabase-js`).
