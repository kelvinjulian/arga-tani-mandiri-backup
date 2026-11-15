import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sprout,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Leaf,
  BookOpen,
  ArrowRight,
  ArrowUpRight,
  FlaskConical,
  PackageCheck,
} from "lucide-react";
import { getArticles, getCategories, getSiteContent } from "@/lib/content";
import { getRobotsMetadata, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { Container } from "@/components/Container";
import { AboutSection } from "@/components/AboutSection";
import { ArticleHubSection } from "@/components/ArticleHubSection";

// Revalidate every 5 minutes; on-demand revalidation (revalidatePath/revalidateTag) will be added with /admin CMS.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteContent();
  const homeTitle = `${siteData.companyName} | Sarana Produksi Pertanian`;
  const homeDescription = siteData.fieldDescription;

  return {
    title: {
      absolute: homeTitle,
    },
    description: homeDescription,
    alternates: {
      canonical: "/",
    },
    robots: getRobotsMetadata(),
    openGraph: {
      type: "website",
      title: homeTitle,
      description: homeDescription,
      url: "/",
      siteName: siteData.companyName,
      locale: "id_ID",
      images: [
        {
          url: "/images/hero-agriculture.jpg",
          width: 1200,
          height: 630,
          alt: "Aktivitas pertanian di lahan budidaya",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: homeDescription,
      images: ["/images/hero-agriculture.jpg"],
    },
  };
}

const CATEGORY_ICONS = [Sprout, ShieldCheck, FlaskConical, PackageCheck];

export default async function HomePage() {
  const [siteData, categories, articles] = await Promise.all([
    getSiteContent(),
    getCategories(),
    getArticles(),
  ]);

  const shopeeStoreUrl = siteData.officialStore.url;
  const siteUrl = getSiteUrl();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteData.companyName,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-mark.png`,
    sameAs: [shopeeStoreUrl],
  };

  return (
    <div className="w-full min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organizationJsonLd),
        }}
      />
      {/* Section 1: Hero Section (Balanced Left Column, Wider Slanted Photo, Zero Text Collision) */}
      <section
        id="beranda"
        data-testid="hero-section"
        aria-labelledby="hero-heading"
        style={{ minHeight: "0px", height: "auto" }}
        className="scroll-mt-28 relative z-0 w-full min-h-0 overflow-x-clip pt-2 lg:pt-3 pb-6 lg:pb-8"
      >
        <Container className="relative z-10">
          <div className="relative flex flex-col lg:block">
            {/* ── Left Column Content (47% width on desktop so larger H1 & cards never collide with 55.5% photo) ── */}
            <div className="relative z-10 w-full min-w-0 lg:w-[47%] pt-4 lg:pt-6">
              {/* Eyebrow Pill */}
              <div className="hero-enter-1 inline-flex items-center gap-2 rounded-full border border-[#CFE2D5] bg-[#E8F3EC] px-3.5 py-1 text-xs font-semibold text-[#14532D]">
                <Sprout
                  className="h-3.5 w-3.5 shrink-0 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>{siteData.hero.eyebrow}</span>
              </div>

              {/* Expressive & Rhythmic H1 Headline (Proportioned so "Budidaya Optimal" sits close to photo with a clean gap and zero collision) */}
              <h1
                id="hero-heading"
                className="hero-enter-2 mt-2.5 font-display text-[clamp(1.75rem,2.32vw+0.35rem,2.3rem)] font-bold leading-[1.15] tracking-[-0.028em] text-[#0E291B]"
              >
                <span data-testid="h1-line-1" className="block">
                  Sarana Produksi
                </span>
                <span
                  data-testid="h1-line-2"
                  className="mt-1 flex flex-wrap sm:flex-nowrap items-center gap-x-1.5 gap-y-1"
                >
                  <span className="whitespace-nowrap">Pertanian untuk</span>
                  <span
                    data-testid="h1-line-3"
                    className="inline-block whitespace-nowrap rounded-2xl border border-[#C2E0CC] bg-[#DCEFE2] px-2.5 py-0.5 text-[#0E291B]"
                  >
                    Budidaya Optimal
                  </span>
                </span>
                <span
                  data-testid="h1-line-4"
                  className="relative mt-1 inline-block pb-3 sm:whitespace-nowrap bg-gradient-to-r from-[#15803D] to-[#0D9488] bg-clip-text text-transparent"
                >
                  {siteData.hero.headlineAccent}
                  {/* Continuous curved emerald underline stroke connected seamlessly to botanical leaf sprout */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 420 34"
                    fill="none"
                    className="pointer-events-none absolute -bottom-1 left-0 w-[105%] h-6.5 text-[#15803D]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 4 24 C 115 14, 260 28, 392 17 C 397 16, 401 13, 403 9"
                      stroke="#15803D"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Botanical leaf sprout connected directly at (403, 9) and (395, 16) */}
                    <path
                      d="M 403 9 C 397 3, 389 5, 391 12 C 396 13, 401 11, 403 9 Z"
                      stroke="#15803D"
                      strokeWidth="1.8"
                      fill="#DCEFE2"
                    />
                    <path
                      d="M 403 9 C 408 2, 417 3, 415 10 C 410 12, 406 11, 403 9 Z"
                      stroke="#15803D"
                      strokeWidth="1.8"
                      fill="#DCEFE2"
                    />
                    <path
                      d="M 397 15 C 404 15, 411 19, 408 24 C 402 24, 398 20, 397 15 Z"
                      stroke="#15803D"
                      strokeWidth="1.8"
                      fill="#DCEFE2"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subheadline Description below H1 */}
              <p className="hero-enter-3 mt-2.5 max-w-[460px] text-xs sm:text-[13.5px] leading-relaxed text-[#2C4737]">
                {siteData.hero.subheadline}
              </p>

              {/* Two Primary CTA Buttons side-by-side in a single row */}
              <div className="hero-enter-4 mt-4 flex flex-row flex-wrap sm:flex-nowrap items-center gap-3">
                <Link
                  href="/#produk"
                  className="inline-flex min-h-[44px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-xl bg-[#143D29] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E2B1D] active:bg-[#091C13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{siteData.hero.primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>

                <a
                  href={shopeeStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-xl bg-[#C23B1A] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#992B11] active:bg-[#7F230D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{siteData.hero.secondaryCtaLabel}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              </div>

              {/* Compact Horizontal Trust Pill Bar */}
              <div
                data-testid="hero-trust-row"
                className="hero-enter-5 mt-3.5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[#D5E6DA] bg-[#EFF6F1] px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold text-[#1F4B33]"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>Kualitas Terjamin</span>
                </span>
                <span aria-hidden="true" className="text-[#84A993]">
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Leaf
                    className="h-3.5 w-3.5 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>Ramah Lingkungan</span>
                </span>
                <span aria-hidden="true" className="text-[#84A993]">
                  •
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <PackageCheck
                    className="h-3.5 w-3.5 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>Kemasan 500gr &amp; 1kg</span>
                </span>
              </div>

              {/* 2-Column Bento Quick-Access Dock */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:max-w-[94.5%]">
                {/* Card 1: Toko Resmi Tani InD® */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#BFE3CC] bg-[#D8EFE0] p-3.5 shadow-2xs transition-colors hover:border-[#8CC9A3]">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#15803D]/15 text-[#14532D]">
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xs sm:text-[13px] font-bold leading-snug text-[#0E291B]">
                        Toko Resmi Tani InD®
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#254231]">
                        Tani InD® Shopee Official Store yang mendukung
                        produktivitas tanaman.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pl-10">
                    <a
                      href={shopeeStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E291B] hover:text-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                    >
                      <span>Kunjungi Toko</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Card 2: Konsultasi Budidaya via WhatsApp */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#6E9E81] bg-[#F7FBF8] p-3.5 shadow-2xs transition-colors hover:border-[#15803D]">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E3F2E8] text-[#15803D]">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xs sm:text-[13px] font-bold leading-snug text-[#0E291B]">
                        Konsultasi Budidaya via WhatsApp
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#2C4737]">
                        Tanya rekomendasi produk &amp; dosis dari tim kami.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pl-10">
                    <Link
                      href="/#konsultasi-whatsapp"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E291B] hover:text-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                    >
                      <span>Chat WhatsApp</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Slanted Parallelogram Photo Panel (55.5% width & extended bottom: larger to left & down, smooth rounded corners) ── */}
            <svg
              aria-hidden="true"
              width="0"
              height="0"
              className="pointer-events-none absolute h-0 w-0 overflow-hidden"
            >
              <defs>
                <clipPath
                  id="hero-slanted-rounded-clip"
                  clipPathUnits="objectBoundingBox"
                >
                  <path d="M 0.205 0 L 0.95 0 Q 1 0 1 0.065 L 1 0.44 Q 1 0.52 0.9888 0.5968 L 0.9398 0.9328 Q 0.93 1 0.88 1 L 0.215 1 Q 0.16 1 0.1344 0.928 L 0.032 0.64 Q 0 0.55 0.0248 0.462 L 0.1353 0.0715 Q 0.155 0 0.205 0 Z" />
                </clipPath>
              </defs>
            </svg>
            <div
              data-testid="hero-desktop-photo-panel"
              aria-hidden="true"
              className="pointer-events-none absolute top-0 -bottom-2 right-0 z-[2] hidden lg:block w-[55.5%] overflow-hidden"
              style={{
                clipPath: "url(#hero-slanted-rounded-clip)",
                WebkitClipPath: "url(#hero-slanted-rounded-clip)",
              }}
            >
              <Image
                src="/images/hero-agriculture.jpg"
                alt="Aktivitas pertanian di lahan budidaya"
                fill
                priority
                sizes="(min-width: 1536px) 786px, (min-width: 1024px) 52vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "54% 38%" }}
              />
            </div>

            {/* ── Desktop Dual Badge (Anchored at bottom-right of the photo, flush with left Bento cards) ── */}
            <div
              data-testid="hero-dark-badge"
              className="pointer-events-auto absolute bottom-0 right-5 z-20 hidden lg:flex items-center rounded-2xl border border-white/20 px-5 py-3.5 text-white shadow-xl w-[44%]"
              style={{
                backgroundColor: "rgba(18, 49, 32, 0.90)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="grid w-full grid-cols-2 divide-x divide-white/15 min-w-0">
                <div className="pr-4 min-w-0">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#D9F0E3]">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xs font-bold leading-snug text-white break-words">
                        {siteData.hero.overlayBadgeLeft.title}
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#D9F0E3] break-words">
                        {siteData.hero.overlayBadgeLeft.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pl-4 min-w-0">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C23B1A] text-white">
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xs font-bold leading-snug text-white break-words">
                        {siteData.hero.overlayBadgeRight.title}
                      </h2>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#D9F0E3] break-words">
                        {siteData.hero.overlayBadgeRight.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mobile/Tablet photo (below 1024px) ── */}
            <div className="relative mt-6 h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl lg:hidden">
              <Image
                src="/images/hero-agriculture.jpg"
                alt="Aktivitas pertanian di lahan budidaya"
                fill
                priority
                sizes="(min-width: 1024px) 52vw, calc(100vw - 64px)"
                className="object-cover object-center"
              />
            </div>

            {/* ── Dark-Green Dual Badge (mobile/tablet: in-flow) ── */}
            <div className="lg:hidden mt-4">
              <div
                data-testid="hero-dark-badge-mobile"
                style={{ backgroundColor: "rgba(18, 49, 32, 0.94)" }}
                className="flex min-h-[92px] w-full items-center rounded-2xl border border-white/20 px-5 py-4 text-white shadow-xl"
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:divide-x sm:divide-white/15">
                  <div className="sm:pr-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#D9F0E3]">
                        <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-display text-xs sm:text-sm font-bold leading-snug text-white">
                          {siteData.hero.overlayBadgeLeft.title}
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-[#D9F0E3]">
                          {siteData.hero.overlayBadgeLeft.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/15 pt-3 sm:border-t-0 sm:pl-4 sm:pt-0">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C23B1A] text-white">
                        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-display text-xs sm:text-sm font-bold leading-snug text-white">
                          {siteData.hero.overlayBadgeRight.title}
                        </h2>
                        <p className="mt-1 text-xs leading-relaxed text-[#D9F0E3]">
                          {siteData.hero.overlayBadgeRight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Lower page area (Kategori Produk Kami, Tentang Kami, Artikel Edukasi) */}
      <div className="relative z-10 w-full overflow-x-clip">
        {/* Section 2: Upgraded "Kategori Produk Kami" Editorial Showcase */}
        <section
          id="produk"
          aria-labelledby="category-showcase-heading"
          className="scroll-mt-28 relative z-10 bg-transparent pt-4 lg:pt-6 pb-6 lg:pb-8"
        >
          <Container>
            <div className="rounded-3xl border border-[#CEDFD4] bg-[#F5F9F6]/90 backdrop-blur-sm p-6 sm:p-7 lg:p-8 shadow-sm">
              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                {/* Left Editorial Header Column (3 cols on lg) */}
                <div className="flex flex-col justify-between lg:col-span-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFE3CC] bg-[#E6F3EB] px-3 py-1 text-xs font-bold text-[#143D29]">
                      <Sprout
                        className="h-3.5 w-3.5 text-[#15803D]"
                        aria-hidden="true"
                      />
                      <span>{siteData.categoryShowcase.pill}</span>
                    </span>
                    <h2
                      id="category-showcase-heading"
                      className="mt-3.5 font-display text-xl font-bold leading-snug text-[#0E291B] sm:text-2xl"
                    >
                      {siteData.categoryShowcase.heading}
                    </h2>
                    <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-[#33473D]">
                      {siteData.categoryShowcase.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-2">
                    <a
                      href={shopeeStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0E291B] underline decoration-[#84A993] underline-offset-4 transition-colors hover:text-[#15803D] hover:decoration-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                    >
                      <span>{siteData.categoryShowcase.ctaLabel}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>

                {/* 4 Tall Visual Bento Cards (9 cols on lg) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-9 lg:grid-cols-4">
                  {categories.map((cat, idx) => {
                    const IconComponent = CATEGORY_ICONS[idx] ?? Sprout;
                    return (
                      <a
                        key={cat.id}
                        href={cat.href || shopeeStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${cat.name} di Shopee`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#D5E4DA] bg-[#E3EDE7] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#9BC5AC] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] min-w-0"
                      >
                        {/* Top Category Photography (solid matching background, zero dark seam) */}
                        <div className="relative h-36 w-full overflow-hidden bg-[#E3EDE7]">
                          <Image
                            src={cat.image}
                            alt={cat.alt}
                            fill
                            loading={idx === 0 ? "eager" : undefined}
                            sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1023px) 44vw, 240px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105 [backface-visibility:hidden] [transform:translateZ(0)]"
                          />
                        </div>

                        {/* Lower Text Container (-mt-[1px] overlaps image bottom by 1px to prevent any seam artifact) */}
                        <div className="-mt-[1px] relative z-10 flex flex-1 flex-col justify-between bg-[#E3EDE7] p-4 pt-0 min-w-0">
                          <div>
                            {/* Overlapping Circular Icon Badge */}
                            <div className="relative z-20 -mt-5 mb-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D5E4DA] bg-white text-[#15803D] shadow-xs">
                              <IconComponent
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </div>

                            <div className="flex items-start justify-between gap-1.5">
                              <h3 className="font-display text-[15px] font-bold leading-snug text-[#0E291B] group-hover:text-[#15803D]">
                                {cat.name}
                              </h3>
                              <ArrowUpRight
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#43594D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#15803D]"
                                aria-hidden="true"
                              />
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#2C4235]">
                              {cat.description}
                            </p>
                          </div>

                          {/* Clean Minimalist Action Badge */}
                          <div className="mt-3.5 flex items-center gap-1.5 border-t border-[#C8DBD0] pt-2.5 text-xs font-bold text-[#14532D] group-hover:text-[#15803D]">
                            <span>Lihat Katalog</span>
                            <ArrowUpRight
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Spotlight Bar */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-[#0E2F1D] px-5 py-3 text-white shadow-sm">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#86EFAC]">
                    <Sprout className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      Produk Unggulan: Tamatric Asam Humat &amp; Trichoderma
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline text-white/40"
                  >
                    •
                  </span>
                  <span className="text-[#D9F0E3]">
                    Mencegah layu Fusarium &amp; meningkatkan hasil panen secara
                    alami.
                  </span>
                </div>

                <a
                  href={shopeeStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[34px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-[#0E2F1D] transition-colors hover:bg-[#D9F0E3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Lihat Detail</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Verified Shopee listings note under the spotlight bar */}
              <div className="mt-3.5 text-center">
                <p className="text-xs text-[#4A5D52]">
                  Detail produk, komposisi, dan petunjuk penggunaan tersedia di
                  halaman produk Shopee kami.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Section 3: About ("Tentang Kami" Interactive Editorial Split & Bento Grid) */}
        <AboutSection />

        {/* Section 4: Article Hub & Conversion Banner */}
        <ArticleHubSection
          articles={articles}
          whatsappNumber={siteData.whatsappNumber}
          shopeeStoreUrl={shopeeStoreUrl}
        />
      </div>
    </div>
  );
}
