"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Film, Sprout } from "lucide-react";
import { HOME_SECTION_IDS } from "@/lib/site-content/hero-cta";
import {
  cloneVideoSectionDefaults,
  SAMPLE_VIDEO_CARDS,
  type VideoSectionData,
} from "@/lib/site-content/video-defaults";
import type { PublicVideoItem } from "@/lib/videos/content";
import { CarouselControls } from "@/components/CarouselControls";
import { Container } from "@/components/Container";
import { TikTokPlayerDialog } from "@/components/TikTokPlayerDialog";
import { sanitizeDisplayTitle, VideoCard } from "@/components/VideoCard";

interface VideoSectionProps {
  videos: PublicVideoItem[];
  videoSection?: VideoSectionData;
}

export function VideoSection({ videos, videoSection }: VideoSectionProps) {
  const data = videoSection ?? cloneVideoSectionDefaults();
  const hasRealVideos = videos.length > 0;

  const initialIndex = useMemo(() => {
    if (!hasRealVideos) return 0;
    const featuredIdx = videos.findIndex((v) => v.isFeatured);
    return featuredIdx >= 0 ? featuredIdx : 0;
  }, [hasRealVideos, videos]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isFading, setIsFading] = useState(false);
  const [activeYouTubeId, setActiveYouTubeId] = useState<string | null>(null);
  const [activeTikTokVideo, setActiveTikTokVideo] =
    useState<PublicVideoItem | null>(null);

  if (!data.enabled) {
    return null;
  }

  if (!hasRealVideos && !data.showSamples) {
    return null;
  }

  const total = hasRealVideos ? videos.length : SAMPLE_VIDEO_CARDS.length;
  const safeIndex =
    activeIndex >= 0 && activeIndex < total ? activeIndex : 0;

  const stopAllPlayback = () => {
    setActiveYouTubeId(null);
    setActiveTikTokVideo(null);
  };

  const navigateToIndex = (nextIndex: number) => {
    if (nextIndex === safeIndex) return;
    stopAllPlayback();
    setIsFading(true);
    setActiveIndex(nextIndex);
    setTimeout(() => setIsFading(false), 180);
  };

  const goPrev = () => {
    navigateToIndex((safeIndex - 1 + total) % total);
  };

  const goNext = () => {
    navigateToIndex((safeIndex + 1) % total);
  };

  const handleFeaturedKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const handlePlayYouTube = (id: string) => {
    setActiveTikTokVideo(null);
    setActiveYouTubeId(id);
  };

  const handlePlayTikTok = (video: PublicVideoItem) => {
    setActiveYouTubeId(null);
    setActiveTikTokVideo(video);
  };

  const handleActivateCompact = (
    video: PublicVideoItem,
    originalIndex: number
  ) => {
    stopAllPlayback();
    if (originalIndex !== safeIndex) {
      setIsFading(true);
      setActiveIndex(originalIndex);
      setTimeout(() => setIsFading(false), 180);
    }

    if (video.platform === "youtube") {
      setActiveYouTubeId(video.id);
      return;
    }

    if (video.videoId && /^\d{8,25}$/.test(video.videoId)) {
      setActiveTikTokVideo(video);
      return;
    }

    window.open(video.url, "_blank", "noopener,noreferrer");
  };

  const featuredReal = hasRealVideos ? videos[safeIndex] : null;
  const featuredSample = !hasRealVideos ? SAMPLE_VIDEO_CARDS[safeIndex] : null;

  const circularOthersCount = Math.min(4, Math.max(0, total - 1));
  const circularRealOthers = hasRealVideos
    ? Array.from({ length: circularOthersCount }, (_, offset) => {
        const originalIndex = (safeIndex + 1 + offset) % total;
        return { item: videos[originalIndex], originalIndex };
      })
    : [];
  const circularSampleOthers = !hasRealVideos
    ? Array.from({ length: circularOthersCount }, (_, offset) => {
        const originalIndex = (safeIndex + 1 + offset) % total;
        return { item: SAMPLE_VIDEO_CARDS[originalIndex], originalIndex };
      })
    : [];

  const hasSecondary = circularOthersCount > 0;
  const activeAnnouncementTitle = featuredReal
    ? sanitizeDisplayTitle(featuredReal.title)
    : featuredSample
      ? sanitizeDisplayTitle(featuredSample.title)
      : "";

  return (
    <section
      id={HOME_SECTION_IDS.VIDEO}
      aria-labelledby="video-section-heading"
      className="scroll-mt-28 relative z-10 bg-transparent pt-[var(--section-gap)] pb-0"
    >
      <Container>
        {/* Header: matches ArticleHubSection's "Lihat semua" pill button & placement */}
        <div>
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
                <Sprout
                  className="h-3.5 w-3.5 text-[#15803D]"
                  aria-hidden="true"
                />
                <span>{data.eyebrow}</span>
              </span>

              <h2
                id="video-section-heading"
                className="mt-3 font-display text-[clamp(1.75rem,2.35vw+0.45rem,2.35rem)] font-bold leading-[1.22] tracking-tight text-[#0E291B]"
              >
                <span>{data.heading}</span>
                {data.headingAccent ? (
                  <span className="mt-1 block text-[#15803D]">
                    {data.headingAccent}
                  </span>
                ) : null}
              </h2>
            </div>

            {hasRealVideos ? (
              <Link
                href="/video"
                className="hidden min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#C5E3CE] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0E2F1D] shadow-xs transition-all duration-200 hover:border-[#0E2F1D] hover:bg-[#0E2F1D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D] lg:inline-flex"
              >
                <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{data.ctaLabel}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ) : null}
          </div>

          {data.description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#2F5341] sm:text-base">
              {data.description}
            </p>
          ) : null}

          {hasRealVideos ? (
            <div className="mt-4 lg:hidden">
              <Link
                href="/video"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-[#C5E3CE] bg-white px-5 py-2.5 text-xs font-bold text-[#0E2F1D] shadow-xs transition-all duration-200 hover:border-[#0E2F1D] hover:bg-[#0E2F1D] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D]"
              >
                <Film className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{data.ctaLabel}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          ) : null}
        </div>

        {/* Live region announcing active video title on navigation */}
        <p className="sr-only" aria-live="polite">
          {activeAnnouncementTitle
            ? `Video aktif: ${activeAnnouncementTitle}`
            : ""}
        </p>

        {/* Desktop (>=1024px): Left Featured + Controls, Right Equal-Height Vertical List (up to 4 circular) */}
        <div className="mt-8 hidden gap-6 lg:grid lg:grid-cols-12 lg:items-stretch">
          <div
            onKeyDown={handleFeaturedKeyDown}
            className={`flex flex-col gap-4 ${
              hasSecondary ? "lg:col-span-7" : "lg:col-span-12"
            }`}
          >
            <div
              className={`flex-1 transition-opacity duration-200 motion-reduce:transition-none ${
                isFading ? "opacity-70" : "opacity-100"
              }`}
            >
              {featuredReal ? (
                <VideoCard
                  video={featuredReal}
                  variant="featured"
                  fixedFeaturedBody
                  isActivePlayer={activeYouTubeId === featuredReal.id}
                  onPlayYouTube={handlePlayYouTube}
                  onPlayTikTok={handlePlayTikTok}
                />
              ) : featuredSample ? (
                <VideoCard sample={featuredSample} variant="featured" />
              ) : null}
            </div>

            <CarouselControls
              currentIndex={safeIndex}
              total={total}
              onPrev={goPrev}
              onNext={goNext}
              prevLabel="Video sebelumnya"
              nextLabel="Video berikutnya"
            />
          </div>

          {hasSecondary ? (
            <div
              className={`grid h-full min-h-0 auto-rows-fr grid-cols-1 gap-3.5 transition-opacity duration-200 motion-reduce:transition-none lg:col-span-5 ${
                isFading ? "opacity-70" : "opacity-100"
              }`}
            >
              {hasRealVideos
                ? circularRealOthers.map(({ item, originalIndex }, slotIdx) => (
                    <VideoCard
                      key={`slot-${slotIdx}`}
                      video={item}
                      variant="compact"
                      onActivateCompact={(v) =>
                        handleActivateCompact(v, originalIndex)
                      }
                    />
                  ))
                : circularSampleOthers.map(({ item }, slotIdx) => (
                    <VideoCard
                      key={`sample-slot-${slotIdx}`}
                      sample={item}
                      variant="compact"
                    />
                  ))}
            </div>
          ) : null}
        </div>

        {/* Mobile / Tablet (<1024px): Featured, then Controls, then stacked compact cards */}
        <div
          onKeyDown={handleFeaturedKeyDown}
          className="mt-7 flex flex-col gap-3.5 lg:hidden"
        >
          <div
            className={`transition-opacity duration-200 motion-reduce:transition-none ${
              isFading ? "opacity-70" : "opacity-100"
            }`}
          >
            {featuredReal ? (
              <VideoCard
                video={featuredReal}
                variant="featured"
                isActivePlayer={activeYouTubeId === featuredReal.id}
                onPlayYouTube={handlePlayYouTube}
                onPlayTikTok={handlePlayTikTok}
              />
            ) : featuredSample ? (
              <VideoCard sample={featuredSample} variant="featured" />
            ) : null}
          </div>

          <CarouselControls
            currentIndex={safeIndex}
            total={total}
            onPrev={goPrev}
            onNext={goNext}
            prevLabel="Video sebelumnya"
            nextLabel="Video berikutnya"
          />

          {hasSecondary
            ? hasRealVideos
              ? circularRealOthers.map(({ item, originalIndex }, slotIdx) => (
                  <VideoCard
                    key={`mobile-slot-${slotIdx}`}
                    video={item}
                    variant="compact"
                    onActivateCompact={(v) =>
                      handleActivateCompact(v, originalIndex)
                    }
                  />
                ))
              : circularSampleOthers.map(({ item }, slotIdx) => (
                  <VideoCard
                    key={`mobile-sample-${slotIdx}`}
                    sample={item}
                    variant="compact"
                  />
                ))
            : null}
        </div>
      </Container>

      <TikTokPlayerDialog
        video={activeTikTokVideo}
        onClose={() => setActiveTikTokVideo(null)}
      />
    </section>
  );
}
