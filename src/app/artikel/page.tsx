import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { getArticles, getSiteContent } from "@/lib/content";
import { getRobotsMetadata, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { Container } from "@/components/Container";
import { ArticleCatalogClient } from "@/components/ArticleCatalogClient";
import { WhatsAppConsultationBand } from "@/components/WhatsAppCTA";

// Revalidate every 5 minutes; on-demand revalidation (revalidatePath/revalidateTag) will be added with /admin CMS.
export const revalidate = 300;

const hubTitle = "Pusat Edukasi & Panduan Tani";
const hubDescription =
  "Panduan praktis pembacaan dosis label kemasan, manajemen nutrisi musim tanam, pemulihan kesuburan tanah, dan penyimpanan sarana produksi pertanian.";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteContent();
  const hubFullTitle = `${hubTitle} | ${siteData.companyName}`;

  return {
    title: hubTitle,
    description: hubDescription,
    alternates: {
      canonical: "/artikel",
    },
    robots: getRobotsMetadata(),
    openGraph: {
      type: "website",
      title: hubFullTitle,
      description: hubDescription,
      url: "/artikel",
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
      title: hubFullTitle,
      description: hubDescription,
      images: ["/images/hero-agriculture.jpg"],
    },
  };
}

export default async function ArtikelIndexPage() {
  const [articles, siteData] = await Promise.all([
    getArticles(),
    getSiteContent(),
  ]);
  const siteUrl = getSiteUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artikel Edukasi",
        item: `${siteUrl}/artikel`,
      },
    ],
  };

  return (
    <div className="relative w-full bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      <div className="relative w-full overflow-x-clip">
        <section
          aria-labelledby="artikel-page-heading"
          className="relative z-10 bg-transparent pt-6 pb-16 md:pt-8 md:pb-20"
        >
          <Container>
            {/* Clean Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs sm:text-sm">
              <ol className="flex flex-wrap items-center gap-2 text-[#43594D]">
                <li>
                  <Link
                    href="/"
                    className="font-semibold text-[#143D29] transition-colors hover:text-[#15803D] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F1F17]"
                  >
                    Beranda
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  aria-current="page"
                  className="font-semibold text-[#0E291B]"
                >
                  Artikel Edukasi
                </li>
              </ol>
            </nav>

            {/* Editorial Hero Header */}
            <div className="mt-5 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
                <Sprout
                  className="h-3.5 w-3.5 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>Pusat Edukasi &amp; Panduan Tani</span>
              </span>

              <h1
                id="artikel-page-heading"
                className="mt-3.5 font-display text-[clamp(1.85rem,2.7vw+0.6rem,2.65rem)] font-bold leading-[1.2] tracking-tight text-[#0E291B]"
              >
                <span>Pusat Wawasan Budidaya &amp; </span>
                <span className="inline-block rounded-xl border border-[#C5E3CE] bg-[#E3F3E8] px-3 py-0.5 text-[#0E291B]">
                  Panduan Aplikasi
                </span>
                <span className="mt-1 block text-[#15803D]">
                  <span className="relative inline-block pb-2">
                    Sarana Pertanian
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
              </h1>

              <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-[#33473D] sm:text-base">
                Temukan panduan praktis seputar pembacaan dosis label kemasan,
                manajemen nutrisi per musim tanam, pemulihan kesuburan tanah
                dengan Asam Humat dan Trichoderma, hingga standar penyimpanan
                sarana produksi pertanian.
              </p>
            </div>

            {/* Interactive Search/Filter Dock, Featured Spotlight Card, and 12-Col Content Area */}
            <ArticleCatalogClient
              articles={articles}
              whatsappNumber={siteData.whatsappNumber}
              shopeeStoreUrl={siteData.officialStore.url}
            />
          </Container>
        </section>
      </div>

      <div className="relative z-20">
        <WhatsAppConsultationBand />
      </div>
    </div>
  );
}
