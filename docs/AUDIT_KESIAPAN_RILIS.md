# Audit Kesiapan Rilis Produksi — `https://argatanimandiri.com`

**Tanggal Audit:** 22 November 2026  
**Mode:** Read-Only (tidak ada kode aplikasi atau database yang diubah)  
**Target Domain Produksi:** `https://argatanimandiri.com`

---

## Ringkasan Jumlah Temuan

| Tingkat Keparahan | Jumlah | Keterangan |
| :--- | :---: | :--- |
| **BLOCKER** | **4** | Wajib diselesaikan di Vercel / Supabase / Admin sebelum `SITE_INDEXING=on` dan domain dibuka ke publik. |
| **PENTING** | **8** | Sangat disarankan diperbaiki di kode atau konfigurasi sebelum/saat peluncuran untuk keamanan, SEO, dan keakuratan metadata. |
| **OPSIONAL** | **4** | Peningkatan performa, analitik, dan kelengkapan PWA/legal pasca-rilis. |

---

## 1. URL Situs, Canonical & Domain (`SITE_URL`)

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **URL-01** | `src/lib/seo.ts:3-11` | **BLOCKER** | `getSiteUrl()` membaca `process.env.SITE_URL`, tetapi jika variabel tersebut lupa diisi di Vercel, fallback `DEFAULT_SITE_URL` jatuh ke `"https://argatanimandiri.example.com"`. Nilai ini dipakai oleh `metadataBase` (`src/app/layout.tsx:33`), `robots.txt` (`src/app/robots.ts:15`), `sitemap.xml` (`src/app/sitemap.ts:14`), dan seluruh JSON-LD (`src/app/(site)/page.tsx:121`, `src/app/(site)/artikel/page.tsx:73`, `src/app/(site)/artikel/[slug]/page.tsx:95`, `src/app/(site)/video/page.tsx:92`). | Wajib set `SITE_URL=https://argatanimandiri.com` (tanpa garis miring di akhir) di Vercel Production Environment Variables, dan ubah `DEFAULT_SITE_URL` di `src/lib/seo.ts:3` menjadi `"https://argatanimandiri.com"`. |
| **URL-02** | `.env.example:2` & `docs/SUPABASE_SETUP.md:93-97` | **PENTING** | Contoh komentar di `.env.example:2` masih menulis `https://argatanimandiri.co.id` (bukan `.com`). | Samakan dokumentasi `.env.example` ke `https://argatanimandiri.com` dan pastikan redirect domain di Vercel mengarahkan `www.argatanimandiri.com` → `https://argatanimandiri.com` (308/301) secara konsisten dengan `SITE_URL`. |
| **URL-03** | `next.config.ts:27` | **OPSIONAL** | `allowedDevOrigins: ["192.168.18.84"]` berisi IP LAN lokal untuk pengujian ponsel. | Aman dibiarkan karena Next.js hanya menerapkan `allowedDevOrigins` pada `next dev` (diabaikan pada `next build` / produksi). |

---

## 2. Variabel Lingkungan (`process.env`)

Tidak ditemukan penggunaan `SUPABASE_SERVICE_ROLE_KEY` atau kunci rahasia server di kode klien maupun server (`src/`).

| Nama Variabel | Lokasi Pemakaian di Kode | Tercantum di `.env.example` | Eksposur Browser | Wajib di Vercel Produksi? |
| :--- | :--- | :---: | :--- | :--- |
| `SITE_URL` | `src/lib/seo.ts:6` | Ya (`.env.example:3`) | Hanya Server | **Ya** (`https://argatanimandiri.com`) |
| `SITE_INDEXING` | `src/lib/seo.ts:14` | Ya (`.env.example:6`) | Hanya Server | **Ya** (`on` saat siap diindeks Google) |
| `NEXT_PUBLIC_SUPABASE_URL` | `next.config.ts:5`, `src/proxy.ts:49`, `src/lib/supabase.ts:14`, `src/lib/supabase/client.ts:6`, `src/lib/supabase/server.ts:5`, `src/lib/media/resolveImageSrc.ts:4` | Ya (`.env.example:9`) | Publik (aman) | **Ya** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `src/proxy.ts:50`, `src/lib/supabase.ts:15`, `src/lib/supabase/client.ts:7`, `src/lib/supabase/server.ts:6` | Ya (`.env.example:10`) | Publik (anon key + RLS) | **Ya** |
| `NEXT_PUBLIC_ADMIN_PATH` | `src/lib/admin-path.ts:5` | Ya (`.env.example:15`) | Publik (*obscure*, bukan rahasia) | Opsional (default: `atm-kelola`) |
| `NODE_ENV` | `src/lib/content.ts:89`, `src/lib/supabase.ts:18`, `src/lib/media/resolveImageSrc.ts:62,79`, `src/lib/videos/content.ts:41` | Otomatis Next.js | Standar framework | Otomatis (`production`) |

---

## 3. Kontrol Pengindeksan (`SITE_INDEXING`)

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **IDX-01** | `src/lib/seo.ts:13-27`, `src/app/robots.ts:5-22`, `src/app/sitemap.ts:10-12` | **PENTING** | Mekanisme `SITE_INDEXING` bekerja konsisten: selama nilainya bukan `"on"`, `robots.txt` menolak seluruh crawler (`Disallow: /`), `sitemap.xml` mengembalikan array kosong `[]`, dan seluruh halaman mengirim `<meta name="robots" content="noindex, nofollow">`. Saat diubah ke `"on"`, halaman publik diizinkan diindeks. | Pastikan `SITE_INDEXING=on` dipasang di Vercel **hanya setelah** seluruh data contoh (Testimoni, Video, Nomor WhatsApp, Artikel) selesai diganti data asli. |
| **IDX-02** | `src/app/robots.ts:20` & `src/app/(admin)/layout.tsx:11-19` | **PENTING** | Saat `SITE_INDEXING=on`, `src/app/robots.ts:20` mencetak `Disallow: /atm-kelola` (atau nilai `ADMIN_BASE_PATH`). Karena `robots.txt` dapat dibaca publik, pencantuman ini membocorkan lokasi URL admin yang seharusnya tersembunyi, padahal `src/app/(admin)/layout.tsx:11-19` sudah memasang header/meta `noindex, nofollow, nocache` pada seluruh rute admin dan `/atm-kelola` tidak ada di `sitemap.xml`. | Pertimbangkan menghapus `ADMIN_BASE_PATH` dari `disallow` publik di `src/app/robots.ts:20` dan cukup mengandalkan meta `noindex, nofollow` di `src/app/(admin)/layout.tsx` serta proteksi autentikasi `src/proxy.ts`. |

---

## 4. Konten Placeholder, Data Contoh & Fallback Publik

Tidak ditemukan `console.log`, komentar `TODO`/`FIXME`, kata `"tes"`, atau teks *lorem ipsum* di `src/`. Namun terdapat data contoh bawaan yang akan tampil ke publik jika belum diganti di database Supabase:

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **CNT-01** | `src/data/site.ts:195` & `src/lib/whatsapp.ts:1` | **BLOCKER** | Fallback statis `WHATSAPP_NUMBER` adalah nomor dummy `"6281234567890"` (`DUMMY_WHATSAPP_NUMBER`). Karena formatnya valid (13 digit), jika blok `site_content` dengan key `"company"` di Supabase belum diisi nomor asli klien, seluruh tombol WhatsApp (Navbar, Hero, MobileActionBar, Pita Konsultasi, Footer) akan mengarah ke `https://wa.me/6281234567890`. | Masuk ke `/atm-kelola/konten/company` sebelum rilis dan simpan nomor WhatsApp resmi Arga Tani Mandiri (format `628...`), atau set `WHATSAPP_NUMBER = null` di `src/data/site.ts:195` agar fallback tidak pernah mengarah ke nomor orang lain. |
| **CNT-02** | `src/lib/site-content/testimonials-defaults.ts:47-125` & `src/components/TestimonialsSection.tsx:637-640` | **BLOCKER** | Nilai bawaan `DEFAULT_TESTIMONIALS` memiliki `enabled: true`, `showSampleLabel: true`, `statsAreSample: true`, 3 statistik contoh (`4,9/5`, `1.200+`, `98%`), 5 testimoni contoh (`isSample: true`: Budi, Siti, Hendra, Rina, Agus), serta catatan publik *"Contoh tampilan: ganti dengan testimoni pelanggan asli sebelum rilis."* | Sebelum rilis, masuk ke `/atm-kelola/konten/testimonials`: ganti dengan testimoni & statistik pelanggan asli yang disetujui klien (matikan status *Contoh*), atau nonaktifkan seksi Testimoni (`enabled: false`). |
| **CNT-03** | `src/lib/site-content/video-defaults.ts:44,66-91` & `src/components/VideoCard.tsx:165-242` | **BLOCKER** | `DEFAULT_VIDEO_SECTION.showSamples` bernilai `true`. Jika tabel `public.videos` di Supabase belum memiliki video berstatus `published`, beranda akan menampilkan 4 kartu video berlabel **"Contoh"** (`SAMPLE_VIDEO_CARDS`). | Tambahkan video YouTube/TikTok asli berstatus **Terbit** di `/atm-kelola/video`, atau matikan opsi **Tampilkan kartu contoh saat video kosong** (`showSamples: false`) di `/atm-kelola/konten/video_section`. |
| **CNT-04** | `src/data/articles.ts:39,111,181,251` & `src/lib/content.ts:70-74,143` | **PENTING** | Keempat artikel fallback di `src/data/articles.ts` berstatus `"draft"` yang dipetakan oleh `FALLBACK_ARTICLES` menjadi `"review"`. Selain itu, query `getArticles()` (`src/lib/content.ts:143`) mengambil `.in("status", ["review", "published"])`. Akibatnya, artikel berstatus `"review"` tetap tampil di katalog publik `/artikel` dan beranda dengan lencana **"Draf Peninjauan"** (`src/components/ArticleCatalogClient.tsx:216,325`). | Pastikan di `/atm-kelola/artikel` hanya artikel yang sudah disetujui klien yang berstatus `published`, dan ubah artikel yang belum siap tayang ke `draft` (atau ubah query publik `src/lib/content.ts:143` agar hanya mengambil `.eq("status", "published")`). |

---

## 5. Status Konten, Halaman Error/404, Ikon & Metadata OG

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **META-01** | `src/app/(site)/artikel/[slug]/page.tsx:60-74` | **PENTING** | Pada `generateMetadata()` halaman detail artikel, gambar OpenGraph (`openGraph.images`) dan Twitter Card (`twitter.images`) masih di-*hardcode* ke `"/images/hero-agriculture.jpg"` dengan alt statis, tidak memakai `article.imageSrc` dan `article.imageAlt` milik artikel tersebut. | Gunakan `resolveImageSrc(article.imageSrc, "/images/hero-agriculture.jpg")` dan `article.imageAlt || article.seoTitle` pada `openGraph.images` serta `twitter.images` di `src/app/(site)/artikel/[slug]/page.tsx:60-74`. |
| **META-02** | `src/app/error.tsx:26-27` | **PENTING** | Halaman error boundary publik menampilkan `{error.message || "Kesalahan tidak diketahui"}` secara mentah ke pengunjung. Pada kasus kegagalan jaringan/runtime tertentu, `error.message` dapat menampilkan pesan teknis bahasa Inggris ke pengguna akhir. | Tampilkan pesan ramah berbahasa Indonesia yang tetap kepada pengguna (dan cukup tampilkan `error.digest` jika ada untuk pelacakan). |
| **META-03** | `src/app/layout.tsx:40-44,76` & `src/app/not-found.tsx:1-45` | **OPSIONAL** | `<html lang="id">`, `locale: "id_ID"`, `src/app/icon.png`, `/brand/logo-mark.png`, dan halaman 404 berbahasa Indonesia sudah terpasang rapi, namun belum ada file `manifest.webmanifest` / `manifest.ts` untuk metadata instalasi perangkat seluler. | Opsional: tambahkan `src/app/manifest.ts` dengan nama, ikon, dan warna tema `#143D29`. |

---

## 6. Keamanan (Admin, Server Actions, Headers & Dependensi)

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **SEC-01** | `next.config.ts:25-39` | **PENTING** | Belum ada konfigurasi HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Permissions-Policy`, `Referrer-Policy`) di `next.config.ts`. | Tambahkan fungsi `async headers()` di `next.config.ts` untuk `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, dan `Referrer-Policy: strict-origin-when-cross-origin` (agar embed YouTube & TikTok tetap menerima header origin yang diperlukan). |
| **SEC-02** | `src/proxy.ts:38-127`, `src/lib/supabase/admin.ts:43,73` | — (Aman) | Rute `/admin` dan `/admin/*` selalu mengembalikan HTTP 404; seluruh halaman admin memanggil `requireAdminPage()` dan seluruh Server Actions memanggil `verifyAdminAction()` (`supabase.auth.getUser()` + RPC `is_admin()`). Seluruh tautan `target="_blank"` memiliki `rel="noopener noreferrer"`, `images.remotePatterns` dibatasi ketat ke `/storage/v1/object/public/media/**` milik project Supabase, dan `npm audit --omit=dev` melaporkan **0 vulnerabilities**. | Pastikan migrasi `0001` s/d `0007_video_play_mode.sql` telah dijalankan di Supabase produksi dan daftar URL redirect `/atm-kelola` sudah ditambahkan di Supabase Auth. |

---

## 7. Performa, Ketahanan Supabase & Struktur SEO

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **PERF-01** | `src/components/AboutSection.tsx:210-220` | **OPSIONAL** | Gambar kolase Tentang Kami (`/images/about-collage.png`, `2268x1987`) menggunakan prop `unoptimized` pada `<ResilientImage>`, sehingga browser ponsel mengunduh PNG ukuran penuh tanpa kompresi WebP/AVIF otomatis dari Next.js Image Optimization. | Hapus prop `unoptimized` pada gambar lokal di `src/components/AboutSection.tsx:218` agar Next.js menyajikan ukuran responsif sesuai `sizes="(max-width: 1023px) 100vw, 45vw"`. |
| **PERF-02** | `src/lib/content.ts:133-322` & `src/lib/videos/content.ts:103-195` | — (Aman) | Seluruh fungsi pengambilan data publik (`getSiteContent`, `getCategories`, `getArticles`, `getArticleCategories`, `getHomeVideos`, `getVideoCatalog`) membungkus query Supabase dengan `try/catch` dan jatuh kembali secara mulus ke data statis tanpa membuat halaman crash jika Supabase lambat atau dijeda. Seluruh halaman publik memakai ISR `revalidate = 300` + revalidasi instan saat admin menyimpan perubahan. | Tidak perlu perubahan arsitektur. |

---

## 8. Analitik, Legal & Konsistensi Kontak

| ID | Lokasi File & Baris | Keparahan | Temuan | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **LEG-01** | `src/data/site.ts:196-200` | **PENTING** | Nilai bawaan `ADDRESS`, `PHONE`, dan `EMAIL` di `src/data/site.ts` masih berupa deskripsi layanan umum (*"Layanan Distribusi & Pengiriman Nasional..."*, *"Konsultasi Budidaya & Layanan Mitra via WhatsApp Resmi"*), bukan alamat fisik kantor/gudang, nomor telepon, dan alamat email resmi. | Minta klien mengisi alamat fisik, nomor telepon/WhatsApp, email resmi, dan jam operasional di `/atm-kelola/konten/company` agar bagian Footer serta Google Business Profile konsisten. |
| **LEG-02** | `src/app/layout.tsx` | **OPSIONAL** | Belum ada skrip analitik trafik (seperti Vercel Web Analytics / Google Analytics) maupun halaman khusus Kebijakan Privasi / Syarat Ketentuan (transaksi dilakukan di Shopee & WhatsApp, tanpa pendaftaran akun publik atau cookie pelacakan di situs). | Opsional: pasang `@vercel/analytics` atau Google Search Console verification tag jika klien membutuhkan pemantauan trafik. |

---

## 9. Kesesuaian `docs/LAUNCH_CHECKLIST.md`

| ID | Lokasi File & Baris | Keparahan | Temuan pada `docs/LAUNCH_CHECKLIST.md` | Saran Perbaikan |
| :--- | :--- | :---: | :--- | :--- |
| **DOC-01** | `docs/LAUNCH_CHECKLIST.md:13,26,31,33` | **PENTING** | (1) Poin 3 masih menginstruksikan pengubahan `status: "draft"` di `src/data/articles.ts` (seharusnya melalui `/atm-kelola/artikel` di Supabase); (2) Poin 7 & 8 masih menulis path lama `/admin/konten/...` dan `/admin/video` (seharusnya `/atm-kelola/...`); (3) Penomoran melompat dari 8 langsung ke 10; (4) Belum mencantumkan pemeriksaan penggantian nomor WhatsApp dummy `6281234567890` di `/atm-kelola/konten/company`, eksekusi migrasi `0001`–`0007_video_play_mode.sql`, penambahan Redirect URLs `/atm-kelola` di Supabase Auth, dan konfigurasi redirect domain `www` vs apex `argatanimandiri.com` di Vercel. | Perbarui `docs/LAUNCH_CHECKLIST.md` agar seluruh path admin menggunakan `/atm-kelola` dan mencakup 4 poin pemeriksaan yang belum tertulis tersebut. |
