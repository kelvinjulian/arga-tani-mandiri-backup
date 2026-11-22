# Technical Launch Checklist (`docs/LAUNCH_CHECKLIST.md`)

1. **Environment Variables & Indexing Switch (Vercel):**
   - Set `SITE_URL=https://argatanimandiri.com` (public production origin without trailing slash) and `SITE_INDEXING=on` in Vercel Production Environment Variables.
   - Pastikan redirect domain di Vercel mengarahkan `www.argatanimandiri.com` dan `argatanimandiri.com` secara konsisten ke origin `SITE_URL`.
   - Verify `/robots.txt` allows crawling (`Allow: /`, without exposing the admin path) and points to `${SITE_URL}/sitemap.xml`.
   - Verify `/sitemap.xml` returns the expected canonical URLs.

2. **Database Migrations & Supabase Auth Redirect URLs:**
   - Pastikan seluruh migrasi `supabase/migrations/0001_cms_init.sql` hingga `0007_video_play_mode.sql` telah dijalankan di Supabase SQL Editor produksi.
   - Di **Supabase Authentication → URL Configuration → Redirect URLs**, tambahkan URL produksi (apex dan `www`) untuk path admin (`/atm-kelola` atau nilai `NEXT_PUBLIC_ADMIN_PATH`):
     - `https://argatanimandiri.com/atm-kelola`
     - `https://argatanimandiri.com/atm-kelola/login`
     - `https://www.argatanimandiri.com/atm-kelola`
     - `https://www.argatanimandiri.com/atm-kelola/login`

3. **Identitas Perusahaan & Verifikasi Nomor WhatsApp (`/atm-kelola/konten/company`):**
   - Pastikan nomor WhatsApp resmi Arga Tani Mandiri sudah disimpan (menggantikan nomor dummy `6281234567890`) dan uji klik tombol WhatsApp di beranda, navbar, sticky bottom bar, serta footer.
   - Lengkapi alamat fisik, telepon, email, dan jam layanan resmi.
   - Pastikan tidak ada spanduk pratinjau/draf atau placeholder `[ISI: ...]` yang tersisa di halaman publik, dan seluruh klaim telah disetujui klien.

4. **Alur Publikasi Artikel (`/atm-kelola/artikel`):**
   - Terbitkan artikel yang sudah ditinjau klien melalui `/atm-kelola/artikel` (`status: "published"`), dan ubah artikel yang belum siap tayang ke `"draft"` agar tidak tampil dengan lencana `"Draf Peninjauan"` (`review`).

5. **Google Search Console Setup:**
   - Daftarkan dan verifikasi **Domain property** (`argatanimandiri.com`) di Google Search Console menggunakan DNS **TXT record**.
   - Submit `https://argatanimandiri.com/sitemap.xml` dan periksa laporan Page Indexing.

6. **Google Business Profile:**
   - Buat atau klaim Google Business Profile resmi menggunakan alamat fisik, nomor telepon, dan jam operasional yang sama dengan Footer.

7. **Core Web Vitals & Performance Re-Verification:**
   - Verifikasi ulang target LCP, CLS, dan INP pada URL produksi `https://argatanimandiri.com` setelah deployment.

8. **Testimoni Pelanggan (`/atm-kelola/konten/testimonials`):**
   - Pastikan seluruh testimoni berasal dari pelanggan asli dengan izin publikasi yang tercatat.
   - Pastikan seluruh angka ringkasan (*stats*) dan rating bintang mencerminkan data asli yang dapat dipertanggungjawabkan, atau matikan opsi tampilannya (`Tampilkan strip ringkasan` / `Tampilkan rating`) sebelum rilis.
   - Tidak boleh ada item contoh (`isSample: true`, `statsAreSample: true`) atau label contoh yang tersisa sebelum situs diluncurkan.

9. **Video Edukasi (`/atm-kelola/video` & `/atm-kelola/konten/video_section`):**
   - Tambahkan video asli yang sudah terbit, atau matikan opsi **Tampilkan kartu contoh saat video kosong** (`showSamples: false`) di `/atm-kelola/konten/video_section` sebelum situs diluncurkan.

10. **Menu Navbar (`/atm-kelola/konten/navbar`):**
   - Periksa seluruh item aktif pada **Navbar** (tautan bagian beranda, halaman `/artikel` atau `/video`, tautan luar `https://`, serta tujuan WhatsApp) dan pastikan tidak ada tujuan kosong atau rusak di desktop maupun menu seluler.

11. **Pengujian Mobile (`< 1024px`):**
   - **Lebar viewport:** Uji di `320px`, `360px`, `390px`, `430px`, `768px`, dan `1024px` (pastikan tidak ada scroll horizontal, teks terpotong, atau elemen meluber).
   - **Perangkat nyata:** Uji langsung di **Android Chrome** dan **iOS Safari** (ketuk setiap tombol CTA hero, drawer menu seluler, sticky bottom action bar, geser *snap carousel* di Produk/Testimoni/Video/Artikel, serta dialog video TikTok/YouTube).
   - **Jaringan & orientasi:** Uji pemuatan gambar hero (LCP) dan *lazy-loading* dengan simulasi jaringan **Slow 4G**, serta periksa tampilan pada **orientasi lanskap** (*landscape*) dan saat *on-screen keyboard* terbuka pada kolom pencarian.

12. **Content-Security-Policy (CSP) Sebelum / Segera Setelah Rilis:**
   - Jalankan tugas penambahan header `Content-Security-Policy` (dimulai dari mode `Content-Security-Policy-Report-Only`) yang mengizinkan origin Supabase proyek, embed YouTube (`www.youtube-nocookie.com`, `www.youtube.com`, `i.ytimg.com`), serta embed TikTok (`www.tiktok.com`, `*.tiktokcdn.com`).
