import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { getSiteContent } from "@/lib/content";
import { getRobotsMetadata, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";
import { DEFAULT_VIDEO_PAGE } from "@/lib/site-content/video-defaults";
import { getVideoCatalog } from "@/lib/videos/content";
import type { VideoPlatform } from "@/lib/videos/url-parser";
import { Container } from "@/components/Container";
import { VideoCatalogClient } from "@/components/VideoCatalogClient";

export const revalidate = 300;

const PAGE_SIZE = 12;

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteContent();
  const pageData = siteData.videoPage ?? DEFAULT_VIDEO_PAGE;
  const fullTitle = `${pageData.seoTitle} | ${siteData.companyName}`;
  const ogImg = resolveImageSrc(
    pageData.ogImageSrc,
    "/images/hero-agriculture.jpg"
  );
  const ogAlt = pageData.ogImageSrc?.trim()
    ? pageData.ogImageAlt || pageData.seoTitle
    : pageData.seoTitle;

  return {
    title: pageData.seoTitle,
    description: pageData.metaDescription,
    alternates: {
      canonical: "/video",
    },
    robots: getRobotsMetadata(),
    openGraph: {
      type: "website",
      title: fullTitle,
      description: pageData.metaDescription,
      url: "/video",
      siteName: siteData.companyName,
      locale: "id_ID",
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: pageData.metaDescription,
      images: [ogImg],
    },
  };
}

interface VideoIndexPageProps {
  searchParams: Promise<{
    platform?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function VideoIndexPage({
  searchParams,
}: VideoIndexPageProps) {
  const sp = await searchParams;
  const activePlatform: VideoPlatform | "all" =
    sp.platform === "youtube" || sp.platform === "tiktok"
      ? sp.platform
      : "all";
  const searchQuery = (sp.q ?? "").trim();
  const currentPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  const [siteData, catalog] = await Promise.all([
    getSiteContent(),
    getVideoCatalog({
      platform: activePlatform === "all" ? undefined : activePlatform,
      q: searchQuery,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
  ]);

  const pageData = siteData.videoPage ?? DEFAULT_VIDEO_PAGE;
  const siteUrl = getSiteUrl();

  const youtubeItemsForJsonLd = catalog.items.filter(
    (v) => v.platform === "youtube" && v.videoId && v.thumbnailSrc
  );

  const itemListJsonLd =
    youtubeItemsForJsonLd.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: youtubeItemsForJsonLd.map((v, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "VideoObject",
              name: v.title,
              description: v.description || v.title,
              thumbnailUrl: v.thumbnailSrc,
              embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
              ...(v.publishedAt ? { uploadDate: v.publishedAt } : {}),
            },
          })),
        }
      : null;

  return (
    <div className="relative w-full bg-transparent">
      {itemListJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(itemListJsonLd),
          }}
        />
      ) : null}

      <div className="relative w-full overflow-x-clip">
        <section
          aria-labelledby="video-page-heading"
          className="relative z-10 bg-transparent pt-6 pb-16 md:pt-8 md:pb-20"
        >
          <Container>
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
                  Video
                </li>
              </ol>
            </nav>

            <div className="mt-5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
                  <Sprout
                    className="h-3.5 w-3.5 text-[#15803D]"
                    aria-hidden="true"
                  />
                  <span>{pageData.eyebrow}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-[#CBD8D0] bg-white px-3 py-1 text-xs font-semibold tabular-nums text-[#143D29]">
                  {catalog.totalCount} video
                </span>
              </div>

              <h1
                id="video-page-heading"
                className="mt-3 font-display text-[clamp(1.85rem,2.5vw+0.45rem,2.6rem)] font-bold leading-[1.18] tracking-tight text-[#0E291B]"
              >
                <span>{pageData.heading}</span>
                {pageData.headingAccent ? (
                  <span className="mt-1 block text-[#15803D]">
                    {pageData.headingAccent}
                  </span>
                ) : null}
              </h1>

              {pageData.description ? (
                <p className="mt-3 text-sm leading-relaxed text-[#2F5341] sm:text-base">
                  {pageData.description}
                </p>
              ) : null}
            </div>

            <VideoCatalogClient
              items={catalog.items}
              featuredVideo={catalog.featuredVideo}
              hasAnyPublished={catalog.hasAnyPublished}
              totalCount={catalog.totalCount}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              activePlatform={activePlatform}
              searchQuery={searchQuery}
              counts={catalog.counts}
              pageData={pageData}
            />
          </Container>
        </section>
      </div>
    </div>
  );
}
