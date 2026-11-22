import React from "react";
import Link from "next/link";
import { ResilientImage } from "@/components/ResilientImage";
import {
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sprout,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { SITE_DATA, type SiteData } from "@/data/site";
import { productCategories } from "@/data/categories";
import { ARTICLES } from "@/data/articles";
import type { ContentArticleItem, ContentCategoryItem } from "@/lib/content";
import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";
import {
  HOME_SECTION_IDS,
  resolveHeroCta,
} from "@/lib/site-content/hero-cta";
import {
  DEFAULT_FOOTER_DATA,
  DEFAULT_FOOTER_LOGO_SRC,
} from "@/lib/site-content/footer-defaults";
import { SupportedIcon } from "@/lib/site-content/icons";
import { Container } from "@/components/Container";

interface FooterProps {
  siteData?: SiteData;
  categories?: ContentCategoryItem[];
  articles?: ContentArticleItem[];
}

export function Footer({
  siteData = SITE_DATA,
  categories,
  articles,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const footer = siteData.footer ?? DEFAULT_FOOTER_DATA;
  const whatsappHref = getWhatsAppHref(siteData.whatsappNumber);
  const companyCtx = {
    whatsappNumber: siteData.whatsappNumber,
    shopeeStoreUrl: siteData.officialStore.url,
  };
  const categoryList =
    categories && categories.length > 0
      ? categories
      : productCategories.map((c) => ({
          name: c.name,
          href: siteData.officialStore.url,
        }));
  const articleList =
    articles && articles.length > 0 ? articles.slice(0, 4) : ARTICLES.slice(0, 4);

  const logoSrc = footer.logoSrc?.trim() || DEFAULT_FOOTER_LOGO_SRC;
  const logoAlt = footer.logoAlt?.trim() || "";
  const copyrightResolved = footer.copyrightText
    .replace(/\{tahun\}|\{year\}/gi, String(currentYear))
    .replace(/\{perusahaan\}|\{company\}/gi, siteData.companyName);

  const flagshipCta = resolveHeroCta(
    {
      enabled: footer.flagshipCard.enabled,
      label: footer.flagshipCard.linkLabel,
      target: footer.flagshipCard.target,
    },
    companyCtx,
    {
      enabled: true,
      label: DEFAULT_FOOTER_DATA.flagshipCard.linkLabel,
      target: DEFAULT_FOOTER_DATA.flagshipCard.target,
    }
  );

  const contactItems = [
    siteData.contact.address?.trim()
      ? { key: "address", icon: MapPin, text: siteData.contact.address.trim() }
      : null,
    siteData.contact.phone?.trim()
      ? { key: "phone", icon: Phone, text: siteData.contact.phone.trim() }
      : null,
    siteData.contact.email?.trim()
      ? { key: "email", icon: Mail, text: siteData.contact.email.trim() }
      : null,
    siteData.contact.operatingHours?.trim()
      ? {
          key: "operatingHours",
          icon: Clock,
          text: siteData.contact.operatingHours.trim(),
        }
      : null,
  ].filter(
    (item): item is { key: string; icon: typeof MapPin; text: string } =>
      item !== null
  );

  return (
    <footer
      id={HOME_SECTION_IDS.KONTAK}
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
            {footer.highlights.map((item, idx) => (
              <div
                key={`${idx}-${item.title}`}
                className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xs transition-colors hover:border-emerald-400/25 hover:bg-white/[0.06]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-[#143D29] text-emerald-300">
                  <SupportedIcon
                    name={item.icon}
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
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
            ))}
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
                    <ResilientImage
                      src={logoSrc}
                      fallbackSrc="/brand/logo-mark.png"
                      alt={logoAlt}
                      width={40}
                      height={40}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <div>
                    <span className="block font-display text-lg font-bold tracking-tight text-white">
                      {siteData.companyName}
                    </span>
                    <span className="block text-xs font-medium text-emerald-300">
                      {footer.brandSubtitle}
                    </span>
                  </div>
                </Link>

                <p className="mt-4 text-sm leading-relaxed text-[#C6E2D1]">
                  {footer.blurb}
                </p>
              </div>

              {/* Compact Flagship Solution Highlight Card */}
              {footer.flagshipCard.enabled && (
                <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-[#133A26] to-[#0E2B1C] p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Sprout className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{footer.flagshipCard.eyebrow}</span>
                  </div>
                  <p className="mt-1.5 font-display text-sm font-bold text-white">
                    {footer.flagshipCard.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                    {footer.flagshipCard.description}
                  </p>
                  {flagshipCta.kind === "link" &&
                    (flagshipCta.isExternal ? (
                      <a
                        href={flagshipCta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 transition-colors hover:text-white"
                      >
                        <span>{footer.flagshipCard.linkLabel}</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={flagshipCta.href}
                        className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-emerald-300 transition-colors hover:text-white"
                      >
                        <span>{footer.flagshipCard.linkLabel}</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ))}
                </div>
              )}
            </div>

            {/* Column 2 (lg:col-span-2): Navigasi & Kategori (side-by-side 2 columns on mobile <1024px, stacked on desktop) */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 lg:col-span-2 lg:block">
              <div className="min-w-0">
                {footer.linkColumns.map((col, colIdx) => (
                  <div
                    key={`${colIdx}-${col.heading}`}
                    className={colIdx > 0 ? "mt-6" : undefined}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-1 shrink-0 rounded-full bg-emerald-400"
                        aria-hidden="true"
                      />
                      <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                        {col.heading}
                      </h2>
                    </div>

                    <ul className="mt-3 space-y-0.5 text-sm lg:mt-4 lg:space-y-2.5">
                      {col.links.map((lnk, lnkIdx) => {
                        const resolved = resolveHeroCta(
                          {
                            enabled: true,
                            label: lnk.label,
                            target: lnk.target,
                          },
                          companyCtx,
                          {
                            enabled: true,
                            label: lnk.label,
                            target: { type: "page", value: "/" },
                          }
                        );
                        if (resolved.kind !== "link") return null;
                        return (
                          <li key={`${lnkIdx}-${lnk.label}`}>
                            {resolved.isExternal ? (
                              <a
                                href={resolved.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[44px] items-center gap-1.5 py-1.5 text-[#C6E2D1] transition-colors hover:text-white lg:min-h-0 lg:py-0"
                              >
                                <ChevronRight
                                  className="h-3.5 w-3.5 shrink-0 text-emerald-400/70"
                                  aria-hidden="true"
                                />
                                <span className="break-words">{lnk.label}</span>
                              </a>
                            ) : (
                              <Link
                                href={resolved.href}
                                className="inline-flex min-h-[44px] items-center gap-1.5 py-1.5 text-[#C6E2D1] transition-colors hover:text-white lg:min-h-0 lg:py-0"
                              >
                                <ChevronRight
                                  className="h-3.5 w-3.5 shrink-0 text-emerald-400/70"
                                  aria-hidden="true"
                                />
                                <span className="break-words">{lnk.label}</span>
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="min-w-0 lg:mt-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-4 w-1 shrink-0 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                    {footer.productCategoriesHeading}
                  </h2>
                </div>

                <ul className="mt-3 space-y-0.5 text-xs lg:space-y-2">
                  {categoryList.map((cat) => (
                    <li key={cat.name}>
                      <a
                        href={cat.href || siteData.officialStore.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center gap-1.5 py-1.5 text-[#B8D8C5] transition-colors hover:text-emerald-300 lg:min-h-0 lg:py-0"
                      >
                        <span className="break-words">{cat.name}</span>
                        <ExternalLink
                          className="h-3 w-3 shrink-0 opacity-75"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3 (lg:col-span-3): Panduan Tani Pilihan */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-4 w-1 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-white">
                  {footer.featuredArticlesHeading}
                </h2>
              </div>

              <ul className="mt-4 space-y-3">
                {articleList.map((article) => (
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
                  {footer.channelsHeading}
                </h2>
              </div>

              <div className="mt-4 rounded-2xl border border-white/12 bg-white/[0.04] p-5 space-y-4">
                {/* Channel 1: Shopee Official Store Link Row */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      {footer.storeCardBadge}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {footer.storeCardBadgeRight}
                    </span>
                  </div>
                  <p className="mt-1 font-display text-base font-bold text-white">
                    {footer.storeCardTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                    {footer.storeCardDescription}
                  </p>
                  <a
                    href={siteData.officialStore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white transition-all hover:border-[#C84B28] hover:bg-[#C84B28] lg:min-h-0"
                  >
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag
                        className="h-4 w-4 text-emerald-300"
                        aria-hidden="true"
                      />
                      <span>{footer.storeButtonLabel}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                {/* Channel 2: WhatsApp Technical Support Row */}
                <div className="border-t border-white/10 pt-4">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    {footer.whatsappCardTitle}
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-[#B8D8C5]">
                    {footer.whatsappCardDescription}
                  </p>
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-[44px] w-full items-center justify-between rounded-xl border border-emerald-400/30 bg-[#143D29]/80 px-3.5 py-2.5 text-xs font-bold text-emerald-200 transition-all hover:bg-emerald-600 hover:text-white lg:min-h-0"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>{footer.whatsappButtonLabel}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="mt-3 inline-flex min-h-[44px] w-full items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-emerald-200 lg:min-h-0">
                      <span className="inline-flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        <span>{WHATSAPP_PLACEHOLDER_TEXT}</span>
                      </span>
                    </span>
                  )}
                </div>

                {contactItems.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                      {footer.contactHeading}
                    </span>
                    <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#B8D8C5]">
                      {contactItems.map((item) => {
                        const ContactIcon = item.icon;
                        const phoneMatch =
                          item.key === "phone"
                            ? item.text.match(/\+?\d[\d\s-]{7,}\d/)
                            : null;
                        const emailMatch =
                          item.key === "email"
                            ? item.text.match(
                                /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
                              )
                            : null;
                        return (
                          <li key={item.key} className="flex items-start gap-2">
                            <ContactIcon
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300"
                              aria-hidden="true"
                            />
                            {phoneMatch ? (
                              <a
                                href={`tel:${phoneMatch[0].replace(/[\s-]/g, "")}`}
                                className="min-w-0 break-words underline decoration-emerald-400/50 underline-offset-4 hover:text-white"
                              >
                                {item.text}
                              </a>
                            ) : emailMatch ? (
                              <a
                                href={`mailto:${emailMatch[0]}`}
                                className="min-w-0 break-words underline decoration-emerald-400/50 underline-offset-4 hover:text-white"
                              >
                                {item.text}
                              </a>
                            ) : (
                              <span className="min-w-0 break-words">
                                {item.text}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {footer.socialLinks.length > 0 && (
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {footer.socialLinks.map((soc, idx) => (
                        <a
                          key={`${idx}-${soc.platform}`}
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:border-emerald-400/40 hover:text-white lg:min-h-0 lg:px-3 lg:py-1"
                        >
                          <span>{soc.platform}</span>
                          <ExternalLink
                            className="h-3 w-3 shrink-0"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TIER 3: Bottom Copyright & Legal Bar */}
          <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#A7D7B9] sm:flex-row sm:items-center">
            <p>{copyrightResolved}</p>

            {footer.legalBadges.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {footer.legalBadges.map((badge, idx) => (
                  <span
                    key={`${idx}-${badge}`}
                    className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-medium ${
                      idx === 1 ? "text-emerald-300" : "text-[#D9F0E3]"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </footer>
  );
}
