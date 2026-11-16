"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ResilientImage } from "@/components/ResilientImage";
import {
  Sprout,
  ArrowRight,
  Clock,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { WHATSAPP_NUMBER } from "@/data/site";
import { SHOPEE_STORE_URL } from "@/data/categories";
import type { ContentArticleItem } from "@/lib/content";
import { Container } from "@/components/Container";
import { HOME_SECTION_IDS, resolveHeroCta } from "@/lib/site-content/hero-cta";
import { CategoryChipsBar } from "@/components/CategoryChipsBar";
import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";
import {
  DEFAULT_ARTICLE_HUB,
  DEFAULT_ARTICLE_HUB_ALL_CTA,
  type ArticleHubData,
} from "@/lib/site-content/article-hub-defaults";
import {
  articleMatchesCategory,
  buildVisibleArticleCategoryFilters,
  DEFAULT_ARTICLE_CATEGORIES,
  type ArticleCategoryItem,
} from "@/lib/article-categories";

interface ArticleHubSectionProps {
  articles?: ContentArticleItem[];
  articleHub?: ArticleHubData;
  articleCategories?: ArticleCategoryItem[];
  whatsappNumber?: string | null;
  shopeeStoreUrl?: string;
}

const DEFAULT_ARTICLES: ContentArticleItem[] = ARTICLES.map((item) => ({
  ...item,
  status: item.status === "published" ? "published" : "review",
}));

export function ArticleHubSection({
  articles = DEFAULT_ARTICLES,
  articleHub = DEFAULT_ARTICLE_HUB,
  articleCategories = DEFAULT_ARTICLE_CATEGORIES,
  whatsappNumber = WHATSAPP_NUMBER,
  shopeeStoreUrl = SHOPEE_STORE_URL,
}: ArticleHubSectionProps) {
  const [activeTopic, setActiveTopic] = useState<string>("all");

  const list = articles.length > 0 ? articles : DEFAULT_ARTICLES;
  const maxSecondary =
    typeof articleHub.maxSecondaryArticles === "number" &&
    articleHub.maxSecondaryArticles >= 1 &&
    articleHub.maxSecondaryArticles <= 3
      ? articleHub.maxSecondaryArticles
      : 3;

  const filterCategories = useMemo(
    () => buildVisibleArticleCategoryFilters(articleCategories, list),
    [articleCategories, list]
  );

  const { featuredArticle, secondaryArticles } = useMemo(() => {
    if (activeTopic === "all") {
      return {
        featuredArticle: list[0],
        secondaryArticles: list.slice(1, 1 + maxSecondary),
      };
    }

    const selectedCat = articleCategories.find((c) => c.slug === activeTopic);
    const matchedIndex = selectedCat
      ? list.findIndex((item) => articleMatchesCategory(item, selectedCat))
      : -1;

    if (matchedIndex === -1) {
      return {
        featuredArticle: list[0],
        secondaryArticles: list.slice(1, 1 + maxSecondary),
      };
    }

    const featured = list[matchedIndex];
    const others = list
      .filter((_, idx) => idx !== matchedIndex)
      .slice(0, maxSecondary);

    return {
      featuredArticle: featured,
      secondaryArticles: others,
    };
  }, [activeTopic, articleCategories, list, maxSecondary]);

  const chipItems = useMemo(
    () =>
      filterCategories.map((cat) => ({
        id: cat.slug,
        label: cat.label,
        count: list.filter((a) => articleMatchesCategory(a, cat)).length,
      })),
    [filterCategories, list]
  );

  const resolvedAllCta = resolveHeroCta(
    articleHub.allArticlesCta ?? DEFAULT_ARTICLE_HUB_ALL_CTA,
    { whatsappNumber, shopeeStoreUrl },
    DEFAULT_ARTICLE_HUB_ALL_CTA
  );

  const whatsappHref = getWhatsAppHref(whatsappNumber);

  return (
    <section
      id={HOME_SECTION_IDS.ARTIKEL_EDUKASI}
      aria-labelledby="article-hub-heading"
      className="scroll-mt-28 relative z-10 bg-transparent pt-[var(--section-gap)] pb-[var(--section-gap)]"
    >
      <Container>
        {/* A. Two-Row Asymmetric Header:
            Row 1 gives the H2 800px+ width on the left and puts "Lihat Semua Artikel" at top-right.
            Row 2 puts the concise description on bottom-left and the single-line 5-pill capsule on bottom-right. */}
        <div>
          {/* Row 1: Eyebrow + Wide H2 (Left) & "Lihat Semua Artikel" Button (Top-Right) */}
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
                <Sprout
                  className="h-3.5 w-3.5 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>{articleHub.eyebrow}</span>
              </span>

              <h2
                id="article-hub-heading"
                className="mt-3 font-display text-[clamp(1.75rem,2.35vw+0.45rem,2.35rem)] font-bold leading-[1.22] tracking-tight text-[#0E291B]"
              >
                <span>{articleHub.headingMain} </span>
                <span className="inline-block rounded-xl border border-[#C5E3CE] bg-[#E3F3E8] px-3 py-0.5 text-[#0E291B]">
                  {articleHub.headingPill}
                </span>
                <span className="mt-1.5 block text-[#15803D]">
                  <span className="relative inline-block pb-2">
                    {articleHub.headingAccent}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 320 18"
                      fill="none"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute left-0 -bottom-0.5 h-3.5 w-[103%]"
                    >
                      <path
                        d="M3 12 C 85 5, 205 5, 298 11"
                        stroke="#15803D"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M296 11 C 304 5, 314 5, 317 10 C 312 15, 303 15, 296 11 Z"
                        fill="#15803D"
                      />
                    </svg>
                  </span>
                </span>
              </h2>
            </div>

            {/* Top-Right Action Button */}
            {resolvedAllCta.kind === "link" &&
              (resolvedAllCta.isExternal ? (
                <a
                  href={resolvedAllCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#C5E3CE] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0E2F1D] shadow-xs transition-all duration-200 hover:border-[#0E2F1D] hover:bg-[#0E2F1D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{articleHub.allArticlesCta.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={resolvedAllCta.href}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#C5E3CE] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0E2F1D] shadow-xs transition-all duration-200 hover:border-[#0E2F1D] hover:bg-[#0E2F1D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
                >
                  <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{articleHub.allArticlesCta.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              ))}
          </div>

          {/* Row 2: Editorial Description (Bottom-Left) & Sleek Single-Line Segmented Filter Capsule (Bottom-Right) */}
          <div className="mt-4 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <p className="max-w-[430px] text-sm leading-relaxed text-[#33473D]">
              {articleHub.description}
            </p>

            <CategoryChipsBar
              items={chipItems}
              activeId={activeTopic}
              allId="all"
              totalCount={list.length}
              onSelect={setActiveTopic}
              variant="hub"
              ariaLabel="Filter topik artikel edukasi"
              config={{
                maxVisibleChips: articleHub.maxVisibleChips ?? 6,
                overflowMode: articleHub.overflowMode ?? "menu",
                allTopicsLabel: articleHub.allTopicsLabel,
                moreLabel: articleHub.moreLabel ?? "Lainnya",
                showArticleCounts: articleHub.showArticleCounts ?? false,
              }}
            />
          </div>
        </div>

        {articles.length === 0 && articleHub.emptyStateText.trim() ? (
          <p className="mt-6 rounded-2xl border border-[#DCE8DF] bg-white px-5 py-4 text-sm text-[#33473D]">
            {articleHub.emptyStateText}
          </p>
        ) : null}

        {/* B. 12-Column Asymmetric Bento Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (lg:col-span-7) - Featured Spotlight Article Card */}
          <article className="group relative flex min-h-[440px] flex-col justify-end overflow-hidden rounded-tl-[64px] rounded-tr-2xl rounded-br-[64px] rounded-bl-2xl border-4 border-white bg-[#0E2F1D] shadow-xl transition-all duration-300 lg:col-span-7">
            <ResilientImage
              src={featuredArticle.imageSrc}
              fallbackSrc="/images/hero-agriculture.jpg"
              alt={featuredArticle.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071D11]/80 via-[#071D11]/25 to-transparent"
            />

            {/* Floating dark forest-green frosted glass card at bottom-left */}
            <div className="relative z-10 m-4 max-w-xl rounded-2xl border border-white/15 bg-[#0E2F1D]/92 p-6 text-white shadow-2xl backdrop-blur-md transition-all duration-300 sm:m-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {articleHub.featuredBadgePrefix} •{" "}
                  {featuredArticle.readingTime}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#D9F0E3]">
                  {featuredArticle.categoryLabel}
                </span>
              </div>

              <h3 className="mt-3.5 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
                <Link
                  href={`/artikel/${featuredArticle.slug}`}
                  className="hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  {featuredArticle.title}
                </Link>
              </h3>

              <p className="mt-2.5 text-sm leading-relaxed text-[#D9F0E3]/95">
                {featuredArticle.excerpt}
              </p>

              <Link
                href={`/artikel/${featuredArticle.slug}`}
                aria-label={`Baca panduan: ${featuredArticle.title}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-transform group-hover:translate-x-1 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                <span>{articleHub.featuredReadMoreLabel}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* Right Column (lg:col-span-5) - Stacked Horizontal Interactive Cards */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            {secondaryArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-[#DCE8DF] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9BC5AC] hover:shadow-xl sm:flex-row sm:p-5"
              >
                {/* Left thumbnail */}
                <Link
                  href={`/artikel/${article.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-[#EAF3EE] sm:h-36 sm:w-40"
                >
                  <ResilientImage
                    src={article.imageSrc}
                    fallbackSrc="/images/hero-agriculture.jpg"
                    alt={article.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Right content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                  <div>
                    <span className="inline-block rounded-md bg-[#EAF3EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                      {article.categoryLabel}
                    </span>

                    <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-[#0E291B] transition-colors group-hover:text-[#15803D] sm:text-lg">
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EBF2ED] pt-2.5 text-xs">
                    <span className="inline-flex items-center gap-1 font-medium text-[#526458]">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{article.readingTime}</span>
                    </span>

                    <Link
                      href={`/artikel/${article.slug}`}
                      aria-label={`Baca panduan: ${article.title}`}
                      className="inline-flex items-center gap-1 font-bold text-[#0E2F1D] transition-colors group-hover:text-[#15803D]"
                    >
                      <span>{articleHub.secondaryReadMoreLabel}</span>
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* C. Bottom Conversion Banner (Proportional Dual-Card Action Buttons without Awkward Green Border) */}
        <div
          id={HOME_SECTION_IDS.KONSULTASI_WHATSAPP}
          className="scroll-mt-28 relative mt-8 grid grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2E1B] to-[#113B24] p-6 text-white shadow-xl sm:p-7 lg:grid-cols-12"
        >
          {articleHub.bannerImageSrc ? (
            <ResilientImage
              src={articleHub.bannerImageSrc}
              fallbackSrc={null}
              alt={articleHub.bannerImageAlt}
              fill
              unoptimized
              sizes="100vw"
              className="pointer-events-none object-cover opacity-15"
            />
          ) : null}
          <div className="relative z-10 lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{articleHub.bannerEyebrow}</span>
            </span>
            <h3 className="mt-2.5 font-display text-xl font-bold leading-snug text-white sm:text-2xl">
              {articleHub.bannerHeading}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#D9F0E3]">
              {articleHub.bannerDescription}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 rounded-2xl bg-white p-4 text-[#0E291B] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EAF4EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F3E8] text-[#15803D] transition-colors group-hover:bg-[#15803D] group-hover:text-white">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-bold leading-snug text-[#0E291B]">
                    {articleHub.whatsappCardTitle}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-[#526458]">
                    {articleHub.whatsappCardSubtitle}
                  </span>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-[#15803D] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            ) : (
              <span className="flex items-center gap-3.5 rounded-2xl border border-white/25 bg-white/10 p-4 text-white/90">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-emerald-300">
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-bold leading-snug">
                    {WHATSAPP_PLACEHOLDER_TEXT}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-[#D9F0E3]">
                    {articleHub.whatsappCardSubtitle}
                  </span>
                </div>
              </span>
            )}

            <a
              href={shopeeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3.5 rounded-2xl bg-[#C84B28] p-4 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B03E1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-display text-sm font-bold leading-snug text-white">
                  {articleHub.shopeeCardTitle}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-white/85">
                  {articleHub.shopeeCardSubtitle}
                </span>
              </div>
              <ExternalLink
                className="h-4 w-4 shrink-0 text-white/90 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
