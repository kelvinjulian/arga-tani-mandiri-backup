import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Package,
  Sprout,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { SITE_DATA, WHATSAPP_NUMBER } from "@/data/site";
import { SHOPEE_STORE_URL, productCategories } from "@/data/categories";
import { ARTICLES } from "@/data/articles";
import { Container } from "@/components/Container";

const FOOTER_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Standar Mutu Terjaga",
    subtitle: "Spesifikasi komposisi & takaran jelas pada label kemasan resmi",
  },
  {
    icon: Package,
    title: "Kemasan 500 gr & 1 kg",
    subtitle: "Ukuran praktis untuk uji lahan maupun pemakaian rutin musim tanam",
  },
  {
    icon: MapPin,
    title: "Distribusi Nasional",
    subtitle: "Pengiriman ke berbagai wilayah via mitra & marketplace resmi",
  },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const rawNumber = WHATSAPP_NUMBER || "6281234567890";
  const whatsappHref = `https://wa.me/${rawNumber.replace(/\D/g, "")}`;

  return (
    <footer
      id="kontak"
      aria-label="Informasi perusahaan dan navigasi situs"
      className="scroll-mt-28 relative w-full text-white"
    >
      {/* Organic Curved Top Wave Transitioning Page Canvas into Deep Forest Footer */}
      <div
        className="pointer-events-none relative z-10 -mb-1 w-full overflow-hidden leading-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          className="block h-8 w-full sm:h-11 md:h-14"
        >
          <path
            d="M0 60 L0 26 C280 4, 520 44, 780 20 C1040 0, 1260 36, 1440 16 L1440 60 Z"
            fill="#0D2B1C"
          />
        </svg>
      </div>

      <div className="relative overflow-hidden bg-[#0D2B1C] pt-6 pb-20 md:pt-8 md:pb-16">
        {/* Subtle Decorative Botanical Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 bottom-12 z-0 hidden select-none overflow-hidden lg:block"
          style={{ opacity: 0.035 }}
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="h-64 w-64 text-white"
          >
            <path
              d="M 30 170 C 60 115, 105 60, 175 20 C 145 75, 100 125, 30 170 Z"
              fill="currentColor"
            />
            <path
              d="M 30 170 L 170 25"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <Container className="relative z-10">
          {/* TIER 1: 3-Column Corporate & Operational Assurance Bento Strip */}
          <div className="grid grid-cols-1 gap-4 border-b border-white/10 pb-8 md:grid-cols-3">
            {FOOTER_HIGHLIGHTS.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xs transition-colors hover:border-emerald-400/25 hover:bg-white/[0.06]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-[#143D29] text-emerald-300">
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-display text-sm font-bold leading-snug text-white">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TIER 2: Main 12-Column Footer Directory */}
          <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Column 1 (lg:col-span-4): Brand Identity & Flagship Product Note */}
            <div className="flex flex-col justify-between lg:col-span-4 lg:pr-4">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 rounded-xl text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-[#143D29] p-2 shadow-inner">
                    <Image
                      src="/brand/logo-mark-light.png"
                      alt=""
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <div>
                    <span className="block font-display text-lg font-bold tracking-tight text-white">
                      {SITE_DATA.companyName}
                    </span>
                    <span className="block text-xs font-medium text-emerald-300">
                      Sarana Produksi Pertanian
                    </span>
                  </div>
                </Link>

                <p className="mt-4 text-sm leading-relaxed text-[#C6E2D1]">
                  Mitra penyedia sarana produksi pertanian, pupuk, pembenah
                  tanah, dan nutrisi tanaman berkualitas untuk mendukung
                  produktivitas serta keberlanjutan lahan petani Indonesia.
                </p>
              </div>

              {/* Compact Flagship Solution Highlight Card */}
              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-[#133A26] to-[#0E2B1C] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Sprout className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Lini Unggulan Arga Tani Mandiri</span>
                </div>
                <p className="mt-1.5 font-display text-sm font-bold text-white">
                  Tamatric: Asam Humat &amp; Trichoderma
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                  Sinergi pembenah tanah organik dan agensia hayati pelindung
                  perakaran tanaman.
                </p>
                <Link
                  href="/artikel/manfaat-trichoderma-dan-asam-humat-dalam-mengembalikan-kesuburan-tanah"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 transition-colors hover:text-white"
                >
                  <span>Pelajari Cara Kerja &amp; Manfaat</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Column 2 (lg:col-span-2): Navigasi & Kategori */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-1 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  Menu Utama
                </h2>
              </div>

              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-[#C6E2D1] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-emerald-400/70"
                      aria-hidden="true"
                    />
                    <span>Beranda</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#produk"
                    className="inline-flex items-center gap-1.5 text-[#C6E2D1] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-emerald-400/70"
                      aria-hidden="true"
                    />
                    <span>Kategori Produk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#tentang-kami"
                    className="inline-flex items-center gap-1.5 text-[#C6E2D1] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-emerald-400/70"
                      aria-hidden="true"
                    />
                    <span>Tentang Kami</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#artikel-edukasi"
                    className="inline-flex items-center gap-1.5 text-[#C6E2D1] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-emerald-400/70"
                      aria-hidden="true"
                    />
                    <span>Artikel Edukasi</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/artikel"
                    className="inline-flex items-center gap-1.5 text-[#C6E2D1] transition-colors hover:text-white"
                  >
                    <ChevronRight
                      className="h-3.5 w-3.5 text-emerald-400/70"
                      aria-hidden="true"
                    />
                    <span>Pusat Panduan Tani</span>
                  </Link>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-2">
                <span
                  className="h-4 w-1 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  Lini Produk
                </h2>
              </div>

              <ul className="mt-3 space-y-2 text-xs">
                {productCategories.map((cat) => (
                  <li key={cat.name}>
                    <a
                      href={SHOPEE_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#B8D8C5] transition-colors hover:text-emerald-300"
                    >
                      <span>{cat.name}</span>
                      <ExternalLink
                        className="h-3 w-3 shrink-0 opacity-75"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 (lg:col-span-3): Panduan Tani Pilihan */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-1 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  Panduan Budidaya Pilihan
                </h2>
              </div>

              <ul className="mt-4 space-y-3">
                {ARTICLES.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="group block rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-all hover:border-emerald-400/30 hover:bg-white/[0.06]"
                    >
                      <span className="block text-[11px] font-semibold text-emerald-300">
                        {article.categoryLabel} • {article.readingTime}
                      </span>
                      <span className="mt-1 line-clamp-2 block font-display text-xs font-bold leading-snug text-white transition-colors group-hover:text-emerald-200">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 (lg:col-span-3): Unified Official Channels Directory */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-1 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  Akses &amp; Saluran Resmi
                </h2>
              </div>

              <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.04] p-5 space-y-4">
                {/* Channel 1: Shopee Official Store Link Row */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      Marketplace Resmi
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      Shopee Official
                    </span>
                  </div>
                  <p className="mt-1 font-display text-base font-bold text-white">
                    {SITE_DATA.officialStore.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                    Pemesanan produk eceran maupun rutin dilayani melalui
                    etalase resmi kami di Shopee.
                  </p>
                  <a
                    href={SITE_DATA.officialStore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:border-[#C84B28] hover:bg-[#C84B28]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag
                        className="h-4 w-4 text-emerald-300"
                        aria-hidden="true"
                      />
                      <span>Buka Etalase Tani InD®</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                {/* Channel 2: WhatsApp Technical Support Row */}
                <div className="border-t border-white/10 pt-4">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Pendampingan Petani &amp; Mitra
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                    Hubungi tim kami untuk informasi dosis pemakaian dan
                    ketersediaan stok kemasan.
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-between rounded-xl border border-emerald-400/30 bg-[#143D29]/80 px-3.5 py-2.5 text-xs font-bold text-emerald-200 transition-all hover:bg-emerald-600 hover:text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      <span>WhatsApp Layanan Resmi</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* TIER 3: Bottom Copyright & Legal Bar */}
          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#A7D7B9] sm:flex-row sm:items-center">
            <p>
              Hak Cipta &copy; {currentYear} {SITE_DATA.companyName}. Seluruh
              hak cipta dilindungi.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-medium text-[#D9F0E3]">
                Sarana Produksi Pertanian Indonesia
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-medium text-emerald-300">
                Tani InD® Official Store
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
