"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ResilientImage } from "@/components/ResilientImage";
import {
  Search,
  RotateCcw,
  ArrowRight,
  Clock,
  Check,
  Sprout,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { WHATSAPP_NUMBER } from "@/data/site";
import { SHOPEE_STORE_URL } from "@/data/categories";
import type { ContentArticleItem } from "@/lib/content";
import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";
import {
  articleMatchesCategory,
  buildVisibleArticleCategoryFilters,
  DEFAULT_ARTICLE_CATEGORIES,
  type ArticleCategoryItem,
} from "@/lib/article-categories";
import type { FilterChipsConfig } from "@/lib/site-content/filter-chips";
import {
  DEFAULT_ARTICLE_PAGE,
  type ArticlePageData,
} from "@/lib/site-content/article-pages-defaults";
import { CategoryChipsBar } from "@/components/CategoryChipsBar";

const POPULAR_TOPIC_TAGS = [
  "Panduan Label",
  "Pembenah Tanah",
  "Asam Humat",
  "Trichoderma",
  "Manajemen Gudang",
  "Dosis Pupuk",
] as const;

interface ArticleCatalogClientProps {
  articles?: ContentArticleItem[];
  articleCategories?: ArticleCategoryItem[];
  whatsappNumber?: string | null;
  shopeeStoreUrl?: string;
  filterChips?: FilterChipsConfig;
  articlePage?: ArticlePageData;
}

const DEFAULT_ARTICLES: ContentArticleItem[] = ARTICLES.map((item) => ({
  ...item,
  status: item.status === "published" ? "published" : "review",
}));

export function ArticleCatalogClient({
  articles = DEFAULT_ARTICLES,
  articleCategories = DEFAULT_ARTICLE_CATEGORIES,
  whatsappNumber = WHATSAPP_NUMBER,
  shopeeStoreUrl = SHOPEE_STORE_URL,
  filterChips,
  articlePage = DEFAULT_ARTICLE_PAGE,
}: ArticleCatalogClientProps) {
  const effectiveChips: FilterChipsConfig = filterChips ?? {
    maxVisibleChips: articlePage.maxVisibleChips,
    overflowMode: articlePage.overflowMode,
    allTopicsLabel: articlePage.allTopicsLabel,
    moreLabel: articlePage.moreLabel,
    showArticleCounts: articlePage.showArticleCounts,
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Semua Topik");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const activeList = articles.length > 0 ? articles : DEFAULT_ARTICLES;
  const featuredSpotlight =
    activeList.find((item) => item.isFeatured) ?? activeList[0];

  const dockChipItems = useMemo(() => {
    const visible = buildVisibleArticleCategoryFilters(
      articleCategories,
      activeList
    );
    return visible.map((c) => ({
      id: c.filterLabel,
      label: c.filterLabel,
      count: activeList.filter((a) => articleMatchesCategory(a, c)).length,
    }));
  }, [articleCategories, activeList]);

  const filteredArticles = useMemo(() => {
    const selectedCatObj =
      selectedCategory === "Semua Topik"
        ? null
        : articleCategories.find((c) => c.filterLabel === selectedCategory) ??
          null;

    return activeList.filter((article) => {
      const matchesCategory =
        selectedCategory === "Semua Topik" ||
        (selectedCatObj
          ? articleMatchesCategory(article, selectedCatObj)
          : article.filterCategory === selectedCategory);

      const matchesTag =
        !selectedTag ||
        article.tags.some(
          (t) => t.toLowerCase() === selectedTag.toLowerCase()
        ) ||
        article.filterCategory.toLowerCase() === selectedTag.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.intro.toLowerCase().includes(q) ||
        article.categoryLabel.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [activeList, articleCategories, searchQuery, selectedCategory, selectedTag]);

  const handleCategorySelect = (categoryMatch: string) => {
    setSelectedCategory(categoryMatch);
    setSelectedTag(null);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setSelectedCategory("Semua Topik");
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("Semua Topik");
    setSelectedTag(null);
  };

  const whatsappHref = getWhatsAppHref(whatsappNumber);

  return (
    <div>
      {/* A. Sticky Search & Category Filter Dock on mobile, floating dock on desktop */}
      <div className="sticky top-[64px] z-30 mt-8 flex flex-col items-stretch justify-between gap-2.5 rounded-2xl border border-[#DCE8DF] bg-white/95 p-2.5 shadow-md backdrop-blur-md lg:static lg:flex-row lg:items-center lg:gap-3">
        {/* Left: Sleek Search Input */}
        <div className="relative flex-1">
          <label htmlFor="article-search-input" className="sr-only">
            Cari topik artikel edukasi
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526458]"
            aria-hidden="true"
          />
          <input
            id="article-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={articlePage.searchPlaceholder}
            className="min-h-11 w-full rounded-xl border border-transparent bg-[#F4F8F5] pl-10 pr-4 py-2 text-sm text-[#0E291B] placeholder:text-[#526458] transition-colors focus:border-[#9BC5AC] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Right: Segmented Category Filter Pills */}
        <CategoryChipsBar
          items={dockChipItems}
          activeId={selectedTag === null ? selectedCategory : "__tag__"}
          allId="Semua Topik"
          totalCount={activeList.length}
          onSelect={handleCategorySelect}
          config={effectiveChips}
          variant="dock"
          ariaLabel="Filter kategori artikel"
        />
      </div>

      {/* B. Featured Hero Article Spotlight Card (Full-Width 12-Column Split Card) */}
      <article className="mt-8 grid grid-cols-1 items-center gap-8 rounded-3xl border border-[#DCE8DF] bg-white p-5 shadow-lg sm:p-7 lg:grid-cols-12">
        {/* Left (lg:col-span-5): Slanted-rounded image container */}
        <div className="relative h-64 overflow-hidden rounded-tl-[48px] rounded-tr-xl rounded-br-[48px] rounded-bl-xl bg-[#0E2F1D] sm:h-80 lg:col-span-5">
          <ResilientImage
            src={featuredSpotlight.imageSrc}
            fallbackSrc="/images/hero-agriculture.jpg"
            alt={featuredSpotlight.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071D11]/60 via-transparent to-transparent"
          />
          <span className="absolute top-4 left-4 rounded-full border border-white/25 bg-[#0E2F1D]/85 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-md backdrop-blur-md">
            {articlePage.featuredBadgeLabel} • {featuredSpotlight.readingTime}
          </span>
        </div>

        {/* Right (lg:col-span-7): Content */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-lg bg-[#EAF3EE] px-3 py-1 text-xs font-bold text-[#15803D]">
              {featuredSpotlight.categoryLabel}
            </span>
            {featuredSpotlight.status === "review" && (
              <span className="inline-block rounded-lg border border-[#E8C87A] bg-[#FEF6DF] px-3 py-1 text-xs font-bold text-[#6B4806]">
                {articlePage.draftBadgeLabel}
              </span>
            )}
          </div>

          <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-[#0E291B] sm:text-3xl">
            <Link
              href={`/artikel/${featuredSpotlight.slug}`}
              className="transition-colors hover:text-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
            >
              {featuredSpotlight.title}
            </Link>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#33473D] sm:text-base">
            {featuredSpotlight.intro}
          </p>

          {/* 3 Key Takeaway Pills */}
          {featuredSpotlight.takeaways.some((p) => p.trim().length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {featuredSpotlight.takeaways
                .map((p) => p.trim())
                .filter(Boolean)
                .map((pill, idx) => (
                  <span
                    key={`${idx}-${pill}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#F4F9F6] px-3 py-1 text-xs font-semibold text-[#0E2F1D]"
                  >
                    <Check
                      className="h-3.5 w-3.5 text-[#15803D]"
                      aria-hidden="true"
                    />
                    <span>{pill}</span>
                  </span>
                ))}
            </div>
          )}

          <div className="mt-6">
            <Link
              href={`/artikel/${featuredSpotlight.slug}`}
              aria-label={`Baca panduan: ${featuredSpotlight.title}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0E2F1D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#15803D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
            >
              <span>{articlePage.featuredReadMoreLabel}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>

      {/* C. 12-Column Main Content Area */}
      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left 8 Columns: 2-Column Interactive Article Grid */}
        <div className="lg:col-span-8">
          {selectedTag && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[#C5E3CE] bg-[#EAF3EE] px-4 py-2.5 text-xs sm:text-sm">
              <span className="font-medium text-[#0E2F1D]">
                Menampilkan topik populer:{" "}
                <strong className="font-bold">#{selectedTag}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className="inline-flex min-h-[44px] items-center px-2 font-bold text-[#15803D] hover:underline lg:min-h-0 lg:px-0"
              >
                Tampilkan Semua
              </button>
            </div>
          )}

          {filteredArticles.length === 0 ? (
            <div
              role="status"
              className="rounded-2xl border border-[#DCE8DF] bg-white p-8 text-center shadow-sm"
            >
              <h3 className="font-display text-lg font-bold text-[#0E291B]">
                {articlePage.emptyTitle}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#33473D]">
                Pencarian &ldquo;{searchQuery || selectedTag}&rdquo; pada
                kategori {selectedCategory} belum menemukan artikel yang cocok.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0E2F1D] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#15803D]"
              >
                <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{articlePage.emptyResetLabel}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9BC5AC] hover:shadow-xl"
                >
                  <div>
                    {/* Top category pill + reading time */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md bg-[#EAF3EE] px-2.5 py-1 text-xs font-semibold text-[#15803D]">
                          {article.categoryLabel}
                        </span>
                        {article.status === "review" && (
                          <span className="rounded-md border border-[#E8C87A] bg-[#FEF6DF] px-2.5 py-1 text-xs font-bold text-[#6B4806]">
                            {articlePage.draftBadgeLabel}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#526458]">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{article.readingTime}</span>
                      </span>
                    </div>

                    {/* Real photo thumbnail */}
                    <Link
                      href={`/artikel/${article.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="relative my-3.5 block h-48 w-full overflow-hidden rounded-xl bg-[#EAF3EE]"
                    >
                      <ResilientImage
                        src={article.imageSrc}
                        fallbackSrc="/images/hero-agriculture.jpg"
                        alt={article.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Bold H3 title + concise 2-line summary */}
                    <h3 className="font-display text-lg font-bold leading-snug text-[#0E291B] transition-colors group-hover:text-[#15803D]">
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
                      >
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#33473D]">
                      {article.excerpt}
                    </p>

                    {/* Key-takeaway bullet list */}
                    {article.takeaways.some((p) => p.trim().length > 0) && (
                      <ul className="mt-4 space-y-1.5 rounded-xl bg-[#F6FAF7] p-3 text-xs text-[#2C4235]">
                        {article.takeaways
                          .map((p) => p.trim())
                          .filter(Boolean)
                          .map((point, idx) => (
                            <li
                              key={`${idx}-${point}`}
                              className="flex items-center gap-2"
                            >
                              <Check
                                className="h-3.5 w-3.5 shrink-0 text-[#15803D]"
                                aria-hidden="true"
                              />
                              <span className="font-medium">{point}</span>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  {/* Bottom link */}
                  <div className="mt-5 border-t border-[#EBF2ED] pt-3.5">
                    <Link
                      href={`/artikel/${article.slug}`}
                      aria-label={`Baca panduan: ${article.title}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0E2F1D] transition-colors group-hover:text-[#15803D]"
                    >
                      <span>{articlePage.cardReadMoreLabel}</span>
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Columns: Sticky Conversion & Topic Sidebar */}
        <aside
          aria-label="Produk unggulan dan topik populer"
          className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-24"
        >
          {/* Card 1: Dark-Emerald Product Spotlight */}
          <div className="rounded-3xl border border-emerald-800/40 bg-gradient-to-b from-[#0E2F1D] to-[#0A2215] p-6 text-white shadow-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{articlePage.sidebarPromoBadge}</span>
            </span>

            <h2 className="mt-3.5 font-display text-xl font-bold leading-snug text-white">
              {articlePage.sidebarPromoTitle}
            </h2>

            <p className="mt-2.5 text-sm leading-relaxed text-[#D9F0E3]">
              {articlePage.sidebarPromoDescription}
            </p>

            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#EAF3EE]">
              {articlePage.sidebarPromoPoints.map((pt, idx) => (
                <li key={`${idx}-${pt}`} className="flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <a
              href={shopeeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C84B28] py-3 px-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B03E1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{articlePage.sidebarPromoButtonLabel}</span>
              <ExternalLink
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Card 2: Quick Consultation & Popular Topics */}
          <div className="rounded-3xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
            <h2 className="font-display text-base font-bold text-[#0E291B]">
              {articlePage.sidebarTopicsTitle}
            </h2>

            <div className="mt-3.5 flex flex-wrap gap-2">
              {(articlePage.sidebarTopics.length > 0
                ? articlePage.sidebarTopics
                : POPULAR_TOPIC_TAGS
              ).map((tag) => {
                const isTagActive = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    aria-pressed={isTagActive}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      isTagActive
                        ? "border-[#0E2F1D] bg-[#0E2F1D] text-white"
                        : "border-[#DCE8DF] bg-[#F4F8F5] text-[#2C4235] hover:border-[#9BC5AC] hover:bg-[#EAF3EE] hover:text-[#0E2F1D]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-[#EBF2ED] pt-4">
              <p className="text-xs font-medium text-[#526458]">
                {articlePage.sidebarConsultPrompt}
              </p>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C5E3CE] bg-[#EAF3EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0E2F1D] transition-all hover:bg-[#DCECE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
                >
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>{articlePage.sidebarConsultButtonLabel}</span>
                </a>
              ) : (
                <span className="mt-2.5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#DCE8DF] bg-[#F4F7F4] px-4 py-2.5 text-xs font-semibold text-[#43594D]">
                  <MessageCircle
                    className="h-4 w-4 shrink-0 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>{WHATSAPP_PLACEHOLDER_TEXT}</span>
                </span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
