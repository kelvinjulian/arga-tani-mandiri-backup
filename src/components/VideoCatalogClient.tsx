"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Film,
  Play,
  Search,
  Star,
} from "lucide-react";
import type { PublicVideoItem } from "@/lib/videos/content";
import type { VideoPlatform } from "@/lib/videos/url-parser";
import type { VideoPageData } from "@/lib/site-content/video-defaults";
import { TikTokPlayerDialog } from "@/components/TikTokPlayerDialog";
import {
  PlatformDot,
  PlatformIconChip,
  sanitizeDisplayTitle,
  VideoCard,
} from "@/components/VideoCard";

interface VideoCatalogClientProps {
  items: PublicVideoItem[];
  featuredVideo: PublicVideoItem | null;
  hasAnyPublished: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  activePlatform: VideoPlatform | "all";
  searchQuery: string;
  counts: {
    all: number;
    youtube: number;
    tiktok: number;
  };
  pageData: VideoPageData;
}

function FeaturedEditorialCard({
  video,
  isActivePlayer,
  onPlayYouTube,
  onPlayTikTok,
}: {
  video: PublicVideoItem;
  isActivePlayer: boolean;
  onPlayYouTube: (id: string) => void;
  onPlayTikTok: (video: PublicVideoItem) => void;
}) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const displayTitle = sanitizeDisplayTitle(video.title);
  const isYouTube = video.platform === "youtube";
  const hasTikTokEmbedId =
    !isYouTube &&
    video.playMode === "embed" &&
    typeof video.videoId === "string" &&
    /^\d{8,25}$/.test(video.videoId);
  const showThumb = Boolean(video.thumbnailSrc) && !thumbFailed;
  const platformLabel = isYouTube ? "YouTube" : "TikTok";

  const triggerPlay = () => {
    if (isYouTube) {
      onPlayYouTube(video.id);
    } else if (hasTikTokEmbedId) {
      onPlayTikTok(video);
    }
  };

  if (isYouTube && isActivePlayer && video.videoId) {
    return (
      <article className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D5E4DA] bg-[#0E2F1D] shadow-md">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={displayTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="h-full w-full border-0"
        />
      </article>
    );
  }

  return (
    <article className="group relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D5E4DA] bg-[#0E2F1D] shadow-md">
      {/* Full-frame clickable thumbnail / fallback */}
      {isYouTube || hasTikTokEmbedId ? (
        <button
          type="button"
          onClick={triggerPlay}
          aria-label={
            isYouTube
              ? `Putar video: ${displayTitle}`
              : `Putar video TikTok: ${displayTitle}`
          }
          className="block h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          {showThumb && video.thumbnailSrc ? (
            <img
              src={video.thumbnailSrc}
              alt={displayTitle}
              width={1260}
              height={540}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0E2F1D] via-[#143D29] to-[#1F5C3E]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(134,239,172,0.16)_1px,transparent_1px)] [background-size:16px_16px]"
              />
            </div>
          )}
        </button>
      ) : (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka di TikTok: ${displayTitle}`}
          className="block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
        >
          {showThumb && video.thumbnailSrc ? (
            <img
              src={video.thumbnailSrc}
              alt={displayTitle}
              width={1260}
              height={540}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0E2F1D] via-[#143D29] to-[#1F5C3E]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(134,239,172,0.16)_1px,transparent_1px)] [background-size:16px_16px]"
              />
            </div>
          )}
        </a>
      )}

      {/* Bottom ~50% dark gradient scrim (top stays clean) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#071D11]/95 via-[#071D11]/65 to-transparent"
      />

      {/* Top-Left Featured Badge ("Video Unggulan") */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 z-10 sm:top-5 sm:left-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#86EFAC]/50 bg-[#15803D] px-3 py-1 text-xs font-bold text-white shadow-sm">
          <Star
            className="h-3.5 w-3.5 fill-[#86EFAC] text-[#86EFAC]"
            aria-hidden="true"
          />
          <span>Video Unggulan</span>
        </span>
      </div>

      {/* Centered Large Play Button */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#143D29]/90 text-white shadow-lg ring-4 ring-white/25 transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#15803D] motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:h-16 sm:w-16 ${
          !isYouTube && !showThumb
            ? "shadow-[-2px_0_0_rgba(37,244,238,0.55),2px_0_0_rgba(254,44,85,0.55)]"
            : ""
        }`}
      >
        <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
      </span>

      {/* Bottom Overlay Content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0 max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <PlatformIconChip platform={video.platform} size="md" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071D11]/80 px-2.5 py-0.5 text-xs font-semibold text-white">
              <PlatformDot platform={video.platform} />
              <span>{platformLabel}</span>
            </span>
          </div>

          <h2 className="line-clamp-2 font-display text-lg font-bold leading-snug text-white sm:text-2xl">
            {displayTitle}
          </h2>

          {video.description ? (
            <p className="mt-1.5 hidden text-sm leading-relaxed text-[#D9F0E3] md:line-clamp-2">
              {video.description}
            </p>
          ) : null}

          <div className="pointer-events-auto mt-3">
            {isYouTube || hasTikTokEmbedId ? (
              <button
                type="button"
                onClick={triggerPlay}
                className="inline-flex min-h-[40px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#15803D] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-[44px] sm:px-5 sm:text-sm"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Putar video</span>
              </button>
            ) : (
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[#15803D] px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-[44px] sm:px-5 sm:text-sm"
              >
                <span>Buka di TikTok</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {video.duration ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-[#071D11]/85 px-2.5 py-1 font-mono text-xs font-semibold text-white">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{video.duration}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function VideoCatalogClient({
  items,
  featuredVideo,
  hasAnyPublished,
  totalCount,
  currentPage,
  pageSize,
  activePlatform,
  searchQuery,
  counts,
  pageData,
}: VideoCatalogClientProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [activeTikTokVideo, setActiveTikTokVideo] =
    useState<PublicVideoItem | null>(null);
  const listTopRef = React.useRef<HTMLDivElement | null>(null);
  const prevPageRef = React.useRef<number>(currentPage);

  React.useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      listTopRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [currentPage]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePlayYouTube = (id: string) => {
    setActiveTikTokVideo(null);
    setActiveVideoId(id);
  };

  const handlePlayTikTok = (video: PublicVideoItem) => {
    setActiveVideoId(null);
    setActiveTikTokVideo(video);
  };

  const buildHref = (next: {
    platform?: VideoPlatform | "all";
    q?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const p = next.platform ?? activePlatform;
    const qVal = next.q !== undefined ? next.q : searchQuery;
    const pg = next.page ?? 1;
    if (p !== "all") params.set("platform", p);
    if (qVal.trim()) params.set("q", qVal.trim());
    if (pg > 1) params.set("page", String(pg));
    const qs = params.toString();
    return qs ? `/video?${qs}` : "/video";
  };

  const gridItems = featuredVideo
    ? items.filter((v) => v.id !== featuredVideo.id)
    : items;

  const chips: Array<{
    key: VideoPlatform | "all";
    label: string;
    count: number;
  }> = [
    { key: "all", label: pageData.allLabel, count: counts.all },
    { key: "youtube", label: "YouTube", count: counts.youtube },
    { key: "tiktok", label: "TikTok", count: counts.tiktok },
  ];

  return (
    <div ref={listTopRef} className="mt-7 scroll-mt-24 space-y-7">
      {/* Sticky Filter Chips & Search under Navbar on mobile */}
      <div className="sticky top-[64px] z-30 flex flex-col gap-3 rounded-2xl border border-[#DCE8DF] bg-white/95 p-3 shadow-sm backdrop-blur-md sm:rounded-3xl sm:p-4 md:static md:flex-row md:items-center md:justify-between">
        <div
          role="navigation"
          aria-label="Filter platform video"
          className="flex w-full flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain rounded-2xl border border-[#E1EDE5] bg-[#F2F7F4] p-1.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:inline-flex md:w-auto md:flex-wrap"
        >
          {chips.map((chip) => {
            const isActive = activePlatform === chip.key;
            return (
              <Link
                key={chip.key}
                href={buildHref({ platform: chip.key, page: 1 })}
                className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] lg:min-h-[36px] ${
                  isActive
                    ? "bg-[#143D29] text-white shadow-xs"
                    : "bg-transparent text-[#143D29] hover:bg-white hover:shadow-2xs"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {chip.key !== "all" ? (
                    <PlatformDot platform={chip.key} />
                  ) : null}
                  <span>{chip.label}</span>
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#E0EFE6] text-[#143D29]"
                  }`}
                >
                  {chip.count}
                </span>
              </Link>
            );
          })}
        </div>

        <form
          method="get"
          action="/video"
          className="flex items-center gap-1.5 rounded-2xl border border-[#CBD8D0] bg-[#F8FBF9] p-1.5 transition-colors focus-within:border-[#143D29] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#143D29]/15 md:w-[340px]"
        >
          {activePlatform !== "all" && (
            <input type="hidden" name="platform" value={activePlatform} />
          )}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#43594D]"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder={pageData.searchPlaceholder}
              aria-label={pageData.searchPlaceholder}
              className="min-h-[44px] w-full bg-transparent pl-8 pr-2 py-1 text-base text-[#0F1F17] placeholder:text-[#587063] focus:outline-none lg:min-h-[36px] lg:text-sm"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] shrink-0 cursor-pointer rounded-xl bg-[#143D29] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#0E2B1D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] lg:min-h-[36px]"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Empty State vs No Results vs Video Grid */}
      {!hasAnyPublished ? (
        <div className="rounded-3xl border border-[#DCE8DF] bg-white p-10 text-center shadow-xs">
          <Film
            className="mx-auto h-10 w-10 text-[#6F8476]"
            aria-hidden="true"
          />
          <h2 className="mt-3 font-display text-lg font-bold text-[#0E291B]">
            {pageData.emptyTitle}
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#33473D]">
            {pageData.emptyText}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-[#DCE8DF] bg-white p-10 text-center shadow-xs">
          <Film
            className="mx-auto h-10 w-10 text-[#6F8476]"
            aria-hidden="true"
          />
          <h2 className="mt-3 font-display text-lg font-bold text-[#0E291B]">
            Tidak ada video yang cocok
          </h2>
          <p className="mt-1.5 text-sm text-[#33473D]">
            Coba ubah kata kunci pencarian atau pilih filter Semua.
          </p>
          <Link
            href="/video"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-xl border border-[#CBD8D0] bg-[#F8FBF9] px-4 py-2 text-xs font-semibold text-[#143D29] hover:bg-[#EAF3EE] lg:min-h-[40px]"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {featuredVideo ? (
            <FeaturedEditorialCard
              video={featuredVideo}
              isActivePlayer={activeVideoId === featuredVideo.id}
              onPlayYouTube={handlePlayYouTube}
              onPlayTikTok={handlePlayTikTok}
            />
          ) : null}

          {gridItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
              {gridItems.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  variant="card"
                  isActivePlayer={activeVideoId === video.id}
                  onPlayYouTube={handlePlayYouTube}
                  onPlayTikTok={handlePlayTikTok}
                />
              ))}
            </div>
          ) : null}

          {/* Numbered Pagination */}
          {totalPages > 1 ? (
            <nav
              aria-label="Navigasi halaman video"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCE8DF] bg-white px-4 py-3 text-xs text-[#33473D]"
            >
              <span>
                Halaman {currentPage} dari {totalPages} ({totalCount} video)
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildHref({ page: currentPage - 1 })}
                    className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#F8FBF9] px-3 py-1.5 font-semibold text-[#143D29] hover:bg-[#EAF3EE] lg:min-h-[36px]"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sebelumnya</span>
                  </Link>
                ) : null}
                {currentPage < totalPages ? (
                  <Link
                    href={buildHref({ page: currentPage + 1 })}
                    className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-[#CBD8D0] bg-[#F8FBF9] px-3 py-1.5 font-semibold text-[#143D29] hover:bg-[#EAF3EE] lg:min-h-[36px]"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </nav>
          ) : null}
        </div>
      )}

      <TikTokPlayerDialog
        video={activeTikTokVideo}
        onClose={() => setActiveTikTokVideo(null)}
      />
    </div>
  );
}
