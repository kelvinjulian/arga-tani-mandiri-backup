import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  ListTree,
  ArrowLeft,
  Clock,
  Check,
  Sprout,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import type { ContentArticleItem } from "@/lib/content";
import { Container } from "@/components/Container";
import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";
import {
  DEFAULT_ARTICLE_DETAIL,
  type ArticleDetailData,
} from "@/lib/site-content/article-pages-defaults";

interface ArticleDetailViewProps {
  article: ContentArticleItem;
  relatedArticles: ContentArticleItem[];
  officialStoreName: string;
  shopeeStoreUrl: string;
  whatsappNumber?: string | null;
  articleDetail?: ArticleDetailData;
}

export function ArticleDetailView({
  article,
  relatedArticles,
  officialStoreName,
  shopeeStoreUrl,
  whatsappNumber,
  articleDetail = DEFAULT_ARTICLE_DETAIL,
}: ArticleDetailViewProps) {
  const whatsappHref = getWhatsAppHref(whatsappNumber);
  const bottomCtaHeading = articleDetail.bottomCtaHeadingTemplate.replace(
    /\{toko\}|\{store\}/gi,
    officialStoreName
  );

  const takeaways = article.takeaways.filter((item) => item.trim().length > 0);

  return (
    <div className="relative w-full overflow-x-clip">
      <article className="relative z-10 bg-transparent pt-6 pb-16 md:pt-8 md:pb-20">
        <Container>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs sm:text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-[#43594D]">
              <li>
                <Link
                  href="/"
                  className="font-semibold text-[#143D29] transition-colors hover:text-[#15803D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                >
                  {articleDetail.breadcrumbHomeLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/artikel"
                  className="font-semibold text-[#143D29] transition-colors hover:text-[#15803D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                >
                  {articleDetail.breadcrumbHubLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li
                aria-current="page"
                className="line-clamp-1 font-semibold text-[#0E291B]"
              >
                {article.title}
              </li>
            </ol>
          </nav>

          <div className="mt-5">
            <Link
              href="/artikel"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#DCE8DF] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#0E2F1D] shadow-xs transition-all hover:border-[#9BC5AC] hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{articleDetail.backToHubLabel}</span>
            </Link>
          </div>

          {/* Article Header */}
          <header className="mt-6 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
                <Sprout
                  className="h-3.5 w-3.5 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>{article.categoryLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE8DF] bg-white px-3 py-1 text-xs font-semibold text-[#384E40]">
                <Clock
                  className="h-3.5 w-3.5 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>{article.readingTime}</span>
              </span>
              {article.status === "review" && (
                <span className="inline-flex items-center rounded-full border border-[#E8C87A] bg-[#FEF6DF] px-3.5 py-1 text-xs font-bold text-[#6B4806]">
                  {articleDetail.draftBadgeLabel}
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-[clamp(1.75rem,2.7vw+0.6rem,2.65rem)] font-bold leading-[1.2] tracking-tight text-[#0E291B]">
              {article.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#33473D] sm:text-lg">
              {article.intro}
            </p>

            {/* Key Takeaways Pills */}
            {takeaways.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {takeaways.map((pill, idx) => (
                  <span
                    key={`${idx}-${pill}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0E2F1D] shadow-2xs"
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
          </header>

          {/* Large Slanted-Rounded Hero Image */}
          <div className="relative mt-8 h-[280px] w-full overflow-hidden rounded-tl-[56px] rounded-tr-2xl rounded-br-[56px] rounded-bl-2xl border-4 border-white bg-[#0E2F1D] shadow-xl sm:h-[400px] lg:h-[440px]">
            <Image
              src={article.imageSrc}
              alt={article.imageAlt}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071D11]/50 via-transparent to-transparent"
            />
          </div>

          {/* 12-Column Reading Layout */}
          <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Left 8 Columns: Rich Article Content */}
            <div className="space-y-7 lg:col-span-8">
              {article.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`heading-${section.id}`}
                  className="scroll-mt-28 rounded-3xl border border-[#DCE8DF] bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E3F3E8] text-xs font-bold text-[#0E2F1D]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
                      {articleDetail.sectionEyebrow}
                    </span>
                  </div>

                  <h2
                    id={`heading-${section.id}`}
                    className="mt-3 font-display text-xl font-bold leading-snug text-[#0E291B] sm:text-2xl"
                  >
                    {section.heading}
                  </h2>

                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#2C4235] sm:text-base">
                    {section.paragraphs
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((paragraph, pIdx) => (
                        <p key={`${pIdx}-${paragraph}`}>{paragraph}</p>
                      ))}
                  </div>

                  {section.bullets &&
                    section.bullets.some((b) => b.trim().length > 0) && (
                      <div className="mt-5 rounded-2xl border border-[#DCE8DF] bg-[#F6FAF7] p-4 sm:p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#0E2F1D]">
                          {articleDetail.sectionBulletsHeading}
                        </p>
                        <ul className="mt-3 space-y-2.5 text-sm text-[#2C4235]">
                          {section.bullets
                            .map((b) => b.trim())
                            .filter(Boolean)
                            .map((bullet, bIdx) => (
                              <li
                                key={`${bIdx}-${bullet}`}
                                className="flex items-start gap-2.5"
                              >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E3F3E8] text-[#15803D]">
                                  <Check
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="leading-relaxed">
                                  {bullet}
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                  {section.callout && (
                    <div className="mt-5 rounded-2xl border-l-4 border-[#15803D] bg-[#EAF3EE] p-4 sm:p-5">
                      <p className="font-display text-sm font-bold text-[#0E2F1D]">
                        {section.callout.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#2C4235]">
                        {section.callout.text}
                      </p>
                    </div>
                  )}
                </section>
              ))}

              {/* Bottom In-Article Conversion Banner */}
              <div
                role="region"
                aria-label="Banner konsultasi dan toko resmi"
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2E1B] to-[#113B24] p-6 text-white shadow-xl sm:p-8"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{articleDetail.bottomCtaBadge}</span>
                </span>

                <h2 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">
                  {bottomCtaHeading}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-[#D9F0E3] sm:text-base">
                  {articleDetail.bottomCtaDescription}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={shopeeStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#C84B28] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B03E1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ShoppingBag
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{articleDetail.bottomCtaShopeeLabel}</span>
                    <ExternalLink
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  </a>

                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <MessageCircle
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{articleDetail.bottomCtaWhatsappLabel}</span>
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white/90">
                      <MessageCircle
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{WHATSAPP_PLACEHOLDER_TEXT}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Table of Contents & Conversion Card */}
            <aside
              aria-labelledby="toc-heading"
              className="flex flex-col gap-6 lg:col-span-4 lg:sticky lg:top-24"
            >
              {/* Sticky Table of Contents */}
              <div className="rounded-3xl border border-[#DCE8DF] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[#EBF2ED] pb-3.5">
                  <ListTree
                    className="h-4 w-4 shrink-0 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <h2
                    id="toc-heading"
                    className="font-display text-sm font-bold uppercase tracking-wide text-[#0E291B]"
                  >
                    {articleDetail.tocHeading}
                  </h2>
                </div>

                <nav aria-label="Daftar isi artikel" className="mt-3.5">
                  <ol className="space-y-2 text-sm">
                    {article.sections.map((section, idx) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="flex items-start gap-2.5 rounded-xl p-2 font-medium text-[#2C4235] transition-colors hover:bg-[#EAF3EE] hover:text-[#0E2F1D]"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#EAF3EE] text-xs font-bold text-[#15803D]">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">
                            {section.heading}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                  <div className="mt-5 border-t border-[#EBF2ED] pt-4">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#526458]">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{articleDetail.relatedHeading}</span>
                    </p>
                    <ul className="mt-2.5 space-y-2 text-xs">
                      {relatedArticles.map((rel) => (
                        <li key={rel.id}>
                          <Link
                            href={`/artikel/${rel.slug}`}
                            className="block rounded-lg p-1.5 font-semibold text-[#0E2F1D] transition-colors hover:bg-[#F4F8F5] hover:text-[#15803D]"
                          >
                            {rel.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Tamatric / Tani InD Shopee Conversion Card */}
              <div className="rounded-3xl border border-emerald-800/40 bg-gradient-to-b from-[#0E2F1D] to-[#0A2215] p-6 text-white shadow-xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{articleDetail.sidebarPromoBadge}</span>
                </span>

                <h3 className="mt-3.5 font-display text-xl font-bold leading-snug text-white">
                  {articleDetail.sidebarPromoTitle}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#D9F0E3]">
                  {articleDetail.sidebarPromoDescription}
                </p>

                <ul className="mt-4 space-y-2 text-xs sm:text-sm text-[#EAF3EE]">
                  {articleDetail.sidebarPromoPoints.map((pt, idx) => (
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
                  <ShoppingBag
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{articleDetail.sidebarPromoButtonLabel}</span>
                  <ExternalLink
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </aside>
          </div>
        </Container>
      </article>
    </div>
  );
}
