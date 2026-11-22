import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Sprout,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Leaf,
  BookOpen,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  FlaskConical,
  PackageCheck,
} from "lucide-react";
import {
  getArticleCategories,
  getArticles,
  getCategories,
  getSiteContent,
} from "@/lib/content";
import { getRobotsMetadata, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import {
  DEFAULT_PRIMARY_CTA,
  DEFAULT_SECONDARY_CTA,
  HOME_SECTION_IDS,
  resolveHeroCta,
  resolveHeroCtaIcon,
} from "@/lib/site-content/hero-cta";
import { Container } from "@/components/Container";
import { MobileSnapRow } from "@/components/MobileSnapRow";
import { AboutSection } from "@/components/AboutSection";
import { ArticleHubSection } from "@/components/ArticleHubSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { VideoSection } from "@/components/VideoSection";
import { getHomeVideos } from "@/lib/videos/content";
import { ResilientImage } from "@/components/ResilientImage";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";
import { productCategories } from "@/data/categories";

// Revalidate every 5 minutes; on-demand revalidation (revalidatePath/revalidateTag) will be added with /admin CMS.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteContent();
  const homeTitle = `${siteData.companyName} | Sarana Produksi Pertanian`;
  const homeDescription = siteData.fieldDescription;
  const heroImageUrl = resolveImageSrc(
    siteData.hero.imageSrc,
    "/images/hero-agriculture.jpg"
  );
  const heroImageAlt = siteData.hero.imageAlt;

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
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description: homeDescription,
      images: [heroImageUrl],
    },
  };
}

const CATEGORY_ICONS = [Sprout, ShieldCheck, FlaskConical, PackageCheck];

export default async function HomePage() {
  const [siteData, categories, articles, articleCategories] = await Promise.all([
    getSiteContent(),
    getCategories(),
    getArticles(),
    getArticleCategories(),
  ]);
  const homeVideos = await getHomeVideos(
    siteData.videoSection?.homeCount ?? 5
  );

  const shopeeStoreUrl = siteData.officialStore.url;
  const primaryCta = siteData.hero.primaryCta ?? {
    ...DEFAULT_PRIMARY_CTA,
    label: siteData.hero.primaryCtaLabel,
  };
  const secondaryCta = siteData.hero.secondaryCta ?? {
    ...DEFAULT_SECONDARY_CTA,
    label: siteData.hero.secondaryCtaLabel,
  };
  const resolvedPrimaryCta = resolveHeroCta(
    primaryCta,
    { whatsappNumber: siteData.whatsappNumber, shopeeStoreUrl },
    DEFAULT_PRIMARY_CTA
  );
  const resolvedSecondaryCta = resolveHeroCta(
    secondaryCta,
    { whatsappNumber: siteData.whatsappNumber, shopeeStoreUrl },
    DEFAULT_SECONDARY_CTA
  );
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
      {/* Section 1: Hero Section (Mobile: content-sized background photo ending 28px below trust row; Desktop lg+: Balanced Left Column & Wider Slanted Photo) */}
      <section
        id={HOME_SECTION_IDS.BERANDA}
        data-testid="hero-section"
        aria-labelledby="hero-heading"
        className="scroll-mt-28 relative z-0 w-full overflow-x-clip pt-0 pb-4 lg:min-h-0 lg:pt-3 lg:pb-8"
      >
        <Container className="relative z-10">
          <div className="relative flex flex-col lg:block">
            {/* ── Left Column Content (47% width on desktop so larger H1 & cards never collide with 55.5% photo) ── */}
            <div className="relative z-10 w-full min-w-0 lg:w-[47%] lg:pt-6">
              {/* Mobile Hero Stage Wrapper: background photo ends 28px below the trust row (pb-7), never covering the Bento cards below */}
              <div className="relative -mx-4 flex min-h-[520px] max-h-[100svh] flex-col justify-end overflow-hidden px-4 pt-6 pb-7 sm:-mx-6 sm:px-6 lg:mx-0 lg:block lg:min-h-0 lg:max-h-none lg:overflow-visible lg:p-0">
                {/* Mobile/Tablet (<1024px) Full-Bleed Background Image + WCAG AA Dark Scrim Overlay */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#081F12] lg:hidden"
                >
                  <ResilientImage
                    src={siteData.hero.imageSrc}
                    fallbackSrc="/images/hero-agriculture.jpg"
                    alt={siteData.hero.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 1px"
                    className="object-cover object-[58%_72%]"
                  />
                  {/* Strongest behind text/CTAs, softer near top and bottom edge */}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,31,18,0.52)_0%,rgba(6,24,14,0.86)_42%,rgba(5,22,13,0.92)_85%,rgba(8,31,18,0.78)_100%)]" />
                </div>

                <div className="relative z-10">
                  {/* Eyebrow Pill */}
                  <div className="hero-enter-1 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0A2617]/85 px-3.5 py-1 text-xs font-semibold text-[#E6F4EC] lg:border-[#CFE2D5] lg:bg-[#E8F3EC] lg:text-[#14532D]">
                    <Sprout
                      className="h-3.5 w-3.5 shrink-0 text-[#6EE7B7] lg:text-[#15803D]"
                      aria-hidden="true"
                    />
                    <span>{siteData.hero.eyebrow}</span>
                  </div>

                  {/* Expressive & Rhythmic H1 Headline */}
                  <h1
                    id="hero-heading"
                    className="hero-enter-2 mt-3 font-display text-[clamp(1.75rem,2.32vw+0.35rem,2.3rem)] font-bold leading-[1.15] tracking-[-0.028em] text-white lg:mt-2.5 lg:text-[#0E291B]"
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
                        className="inline-block whitespace-nowrap rounded-2xl border border-[#6EE7B7]/40 bg-[#14532D]/90 px-2.5 py-0.5 text-[#ECFDF5] lg:border-[#C2E0CC] lg:bg-[#DCEFE2] lg:text-[#0E291B]"
                      >
                        Budidaya Optimal
                      </span>
                    </span>
                    <span
                      data-testid="h1-line-4"
                      className="relative mt-1 inline-block max-w-full pb-3 sm:whitespace-nowrap bg-gradient-to-r from-[#6EE7B7] to-[#5EEAD4] bg-clip-text text-transparent lg:from-[#15803D] lg:to-[#0D9488]"
                    >
                      {siteData.hero.headlineAccent}
                      {/* Continuous curved emerald underline stroke connected seamlessly to botanical leaf sprout */}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 436 34"
                        fill="none"
                        className="pointer-events-none absolute -bottom-1 left-0 h-6.5 w-full text-[#6EE7B7] lg:w-[108%] lg:text-[#15803D]"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M 4 24 C 120 14, 270 28, 408 17 C 413 16, 417 13, 419 9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Botanical leaf sprout connected directly at (419, 9) and (413, 15) */}
                        <path
                          d="M 419 9 C 413 3, 405 5, 407 12 C 412 13, 417 11, 419 9 Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="#DCEFE2"
                        />
                        <path
                          d="M 419 9 C 424 2, 433 3, 431 10 C 426 12, 422 11, 419 9 Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="#DCEFE2"
                        />
                        <path
                          d="M 413 15 C 420 15, 427 19, 424 24 C 418 24, 414 20, 413 15 Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          fill="#DCEFE2"
                        />
                      </svg>
                    </span>
                  </h1>

                  {/* Subheadline Description below H1 */}
                  <p className="hero-enter-3 mt-3 max-w-[460px] text-base leading-relaxed text-[#E6F4EC] lg:mt-2.5 lg:text-[13.5px] lg:text-[#2C4737]">
                    {siteData.hero.subheadline}
                  </p>

                  {/* Two Primary CTA Buttons: stacked full-width (min-h 48px) on mobile, side-by-side on desktop */}
                  {(resolvedPrimaryCta.kind !== "disabled" ||
                    resolvedSecondaryCta.kind !== "disabled") && (
                    <div className="hero-enter-4 mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:mt-4 lg:flex-nowrap">
                      {resolvedPrimaryCta.kind === "link" &&
                        (resolvedPrimaryCta.isExternal ? (
                          <a
                            href={resolvedPrimaryCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#6EE7B7]/35 bg-[#15803D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E2B1D] active:bg-[#091C13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:min-h-[44px] lg:border-0 lg:bg-[#143D29] lg:px-4 lg:py-2.5 lg:focus-visible:outline-[#0F1F17]"
                          >
                            {primaryCta.target.type === "whatsapp" ? (
                              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : primaryCta.target.type === "shopee" ? (
                              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            <span>{primaryCta.label}</span>
                            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            href={resolvedPrimaryCta.href}
                            className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#6EE7B7]/35 bg-[#15803D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E2B1D] active:bg-[#091C13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:min-h-[44px] lg:border-0 lg:bg-[#143D29] lg:px-4 lg:py-2.5 lg:focus-visible:outline-[#0F1F17]"
                          >
                            <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>{primaryCta.label}</span>
                            {resolveHeroCtaIcon(primaryCta) === "arrow-down" ? (
                              <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                          </Link>
                        ))}
                      {resolvedPrimaryCta.kind === "whatsapp-placeholder" && (
                        <span className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#CBD8D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#33473D] sm:w-auto lg:min-h-[44px]">
                          <MessageCircle className="h-4 w-4 shrink-0 text-[#15803D]" aria-hidden="true" />
                          <span>{resolvedPrimaryCta.text}</span>
                        </span>
                      )}

                      {resolvedSecondaryCta.kind === "link" &&
                        (resolvedSecondaryCta.isExternal ? (
                          <a
                            href={resolvedSecondaryCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C23B1A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#992B11] active:bg-[#7F230D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:min-h-[44px] lg:px-4 lg:py-2.5 lg:focus-visible:outline-[#0F1F17]"
                          >
                            {secondaryCta.target.type === "whatsapp" ? (
                              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            <span>{secondaryCta.label}</span>
                            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          <Link
                            href={resolvedSecondaryCta.href}
                            className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C23B1A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#992B11] active:bg-[#7F230D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:min-h-[44px] lg:px-4 lg:py-2.5 lg:focus-visible:outline-[#0F1F17]"
                          >
                            <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>{secondaryCta.label}</span>
                            {resolveHeroCtaIcon(secondaryCta) === "arrow-down" ? (
                              <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                          </Link>
                        ))}
                      {resolvedSecondaryCta.kind === "whatsapp-placeholder" && (
                        <span className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[#CBD8D0] bg-white px-4 py-2.5 text-sm font-semibold text-[#33473D] sm:w-auto lg:min-h-[44px]">
                          <MessageCircle className="h-4 w-4 shrink-0 text-[#15803D]" aria-hidden="true" />
                          <span>{resolvedSecondaryCta.text}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Compact Horizontal Trust Pill Bar (Background photo ends 28px below this row on mobile) */}
                  <div
                    data-testid="hero-trust-row"
                    className="hero-enter-5 mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-white/20 bg-[#0A2617]/85 px-3.5 py-2 text-xs font-semibold text-[#E6F4EC] sm:rounded-full sm:py-1.5 lg:mt-3.5 lg:border-[#D5E6DA] lg:bg-[#EFF6F1] lg:text-[#1F4B33]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck
                        className="h-3.5 w-3.5 text-[#6EE7B7] lg:text-[#15803D]"
                        aria-hidden="true"
                      />
                      <span>Kualitas Terjamin</span>
                    </span>
                    <span aria-hidden="true" className="text-[#84A993]">
                      •
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Leaf
                        className="h-3.5 w-3.5 text-[#6EE7B7] lg:text-[#15803D]"
                        aria-hidden="true"
                      />
                      <span>Ramah Lingkungan</span>
                    </span>
                    <span aria-hidden="true" className="text-[#84A993]">
                      •
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <PackageCheck
                        className="h-3.5 w-3.5 text-[#6EE7B7] lg:text-[#15803D]"
                        aria-hidden="true"
                      />
                      <span>Kemasan 500gr &amp; 1kg</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 2-Column Bento Quick-Access Dock */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-3.5 lg:max-w-[94.5%]">
                {/* Card 1: Toko Resmi Tani InD® */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#BFE3CC] bg-[#D8EFE0]/95 p-3.5 shadow-2xs transition-colors hover:border-[#8CC9A3] lg:bg-[#D8EFE0]">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#15803D]/15 text-[#14532D]">
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xs sm:text-[13px] font-bold leading-snug text-[#0E291B]">
                        Toko Resmi Tani InD®
                      </h2>
                      <p className="mt-1 text-xs lg:text-[11px] leading-relaxed text-[#254231]">
                        Tani InD® Shopee Official Store yang mendukung
                        produktivitas tanaman.
                      </p>
                    </div>
                  </div>
                  <div className="mt-1.5 pl-10 lg:mt-2.5">
                    <a
                      href={shopeeStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-[#0E291B] hover:text-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] lg:min-h-0"
                    >
                      <span>Kunjungi Toko</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Card 2: Konsultasi Budidaya via WhatsApp */}
                <div className="flex flex-col justify-between rounded-2xl border border-[#6E9E81] bg-[#F7FBF8]/95 p-3.5 shadow-2xs transition-colors hover:border-[#15803D] lg:bg-[#F7FBF8]">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E3F2E8] text-[#15803D]">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-xs sm:text-[13px] font-bold leading-snug text-[#0E291B]">
                        Konsultasi Budidaya via WhatsApp
                      </h2>
                      <p className="mt-1 text-xs lg:text-[11px] leading-relaxed text-[#2C4737]">
                        Tanya rekomendasi produk &amp; dosis dari tim kami.
                      </p>
                    </div>
                  </div>
                  <div className="mt-1.5 pl-10 lg:mt-2.5">
                    <Link
                      href="/#konsultasi-whatsapp"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-bold text-[#0E291B] hover:text-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] lg:min-h-0"
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
              <ResilientImage
                src={siteData.hero.imageSrc}
                fallbackSrc="/images/hero-agriculture.jpg"
                alt={siteData.hero.imageAlt}
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

            {/* ── Dark-Green Dual Badge (mobile/tablet: in-flow over background hero) ── */}
            <div className="lg:hidden mt-3.5">
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
          id={HOME_SECTION_IDS.PRODUK}
          aria-labelledby="category-showcase-heading"
          className="scroll-mt-28 relative z-10 bg-transparent pt-4 lg:pt-6 pb-0"
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

                  <div className="mt-4 pt-1 lg:mt-5 lg:pt-2">
                    <a
                      href={shopeeStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-[#0E291B] underline decoration-[#84A993] underline-offset-4 transition-colors hover:text-[#15803D] hover:decoration-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17] lg:min-h-0"
                    >
                      <span>{siteData.categoryShowcase.ctaLabel}</span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                    </a>
                  </div>

                  {/* Mobile (<768px) horizontally scrollable quick category chips */}
                  {categories.length > 0 && (
                    <div
                      role="navigation"
                      aria-label="Pintasan kategori produk"
                      className="mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
                    >
                      {categories.map((cat, idx) => {
                        const ChipIcon = CATEGORY_ICONS[idx] ?? Sprout;
                        return (
                          <a
                            key={`chip-${cat.id}`}
                            href={cat.href || shopeeStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#BFE3CC] bg-white px-3.5 py-2 text-xs font-semibold text-[#143D29] shadow-2xs transition-colors hover:bg-[#EAF3EE] active:bg-[#DCECE2]"
                          >
                            <ChipIcon
                              className="h-3.5 w-3.5 shrink-0 text-[#15803D]"
                              aria-hidden="true"
                            />
                            <span>{cat.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Mobile (<768px): Horizontal Snap Carousel of Category Cards */}
                <div className="md:hidden">
                  <MobileSnapRow
                    ariaLabel="Daftar kategori produk"
                    itemCount={categories.length}
                    edgeBleed={false}
                  >
                    {categories.map((cat, idx) => {
                      const IconComponent = CATEGORY_ICONS[idx] ?? Sprout;
                      return (
                        <a
                          key={`mob-${cat.id}`}
                          href={cat.href || shopeeStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${cat.name} di Shopee`}
                          className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[#D5E4DA] bg-[#E3EDE7] shadow-xs transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] ${
                            categories.length > 2
                              ? "w-[84%] max-w-[300px] shrink-0 snap-start"
                              : "w-full"
                          }`}
                        >
                          <div className="relative h-36 w-full overflow-hidden bg-[#E3EDE7]">
                            <ResilientImage
                              src={cat.image}
                              fallbackSrc={
                                productCategories[idx]?.image ??
                                "/images/hero-agriculture.jpg"
                              }
                              alt={cat.alt}
                              fill
                              sizes="(max-width: 767px) 84vw, 240px"
                              className="object-cover"
                            />
                          </div>
                          <div className="-mt-[1px] relative z-10 flex flex-1 flex-col justify-between bg-[#E3EDE7] p-4 pt-0 min-w-0">
                            <div>
                              <div className="relative z-20 -mt-5 mb-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D5E4DA] bg-white text-[#15803D] shadow-xs">
                                <IconComponent
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex items-start justify-between gap-1.5">
                                <h3 className="font-display text-[15px] font-bold leading-snug text-[#0E291B]">
                                  {cat.name}
                                </h3>
                                <ArrowUpRight
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#43594D]"
                                  aria-hidden="true"
                                />
                              </div>
                              <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#2C4235]">
                                {cat.description}
                              </p>
                            </div>
                            <div className="mt-3.5 flex items-center gap-1.5 border-t border-[#C8DBD0] pt-2.5 text-xs font-bold text-[#14532D]">
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
                  </MobileSnapRow>
                </div>

                {/* Tablet (2 cols) & Desktop (4 Tall Visual Bento Cards, 9 cols on lg) */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-4 lg:col-span-9 lg:grid-cols-4">
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
                          <ResilientImage
                            src={cat.image}
                            fallbackSrc={
                              productCategories[idx]?.image ??
                              "/images/hero-agriculture.jpg"
                            }
                            alt={cat.alt}
                            fill
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
        <AboutSection
          aboutData={siteData.about}
          shopeeStoreUrl={shopeeStoreUrl}
        />

        {/* Section 4: Testimonials ("Testimoni Pelanggan") */}
        <TestimonialsSection testimonials={siteData.testimonials} />

        {/* Section 5: Video Edukasi */}
        <VideoSection
          videos={homeVideos}
          videoSection={siteData.videoSection}
        />

        {/* Section 6: Article Hub & Conversion Banner */}
        <ArticleHubSection
          articles={articles}
          articleHub={siteData.articleHub}
          articleCategories={articleCategories}
          whatsappNumber={siteData.whatsappNumber}
          shopeeStoreUrl={shopeeStoreUrl}
        />
      </div>
    </div>
  );
}
