"use client";

import React, { useState } from "react";
import { Clock, ExternalLink, Play } from "lucide-react";
import type { PublicVideoItem } from "@/lib/videos/content";
import type { SampleVideoCard } from "@/lib/site-content/video-defaults";

interface VideoCardProps {
  video?: PublicVideoItem;
  sample?: SampleVideoCard;
  isActivePlayer?: boolean;
  onPlayYouTube?: (id: string) => void;
  onPlayTikTok?: (video: PublicVideoItem) => void;
  onActivateCompact?: (video: PublicVideoItem) => void;
  fixedFeaturedBody?: boolean;
  variant?: "featured" | "card" | "compact";
  className?: string;
}

export function sanitizeDisplayTitle(rawTitle: string): string {
  const withoutEmoji = rawTitle
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D\u2600-\u27BF]/g, "")
    .replace(/!{2,}/g, "!")
    .replace(/\?{2,}/g, "?")
    .replace(/\.{4,}/g, "...")
    .replace(/\s+/g, " ")
    .trim();

  return withoutEmoji || rawTitle.trim();
}

export function PlatformIconChip({
  platform,
  size = "sm",
}: {
  platform: "youtube" | "tiktok";
  size?: "sm" | "md";
}) {
  const boxSize = size === "md" ? "h-8 w-8" : "h-7 w-7";
  const iconSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-white ${boxSize} ${
        platform === "youtube"
          ? "border border-white/40 bg-[var(--brand-youtube)] shadow-xs"
          : "border border-white/25 bg-[var(--brand-tiktok-bg)] shadow-[-1.5px_0_0_var(--brand-tiktok-cyan),1.5px_0_0_var(--brand-tiktok-pink)]"
      }`}
    >
      <span className="sr-only">
        {platform === "tiktok" ? "TikTok" : "YouTube"}
      </span>
      {platform === "youtube" ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconSize}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.5" y="5" width="19" height="14" rx="4" />
          <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={iconSize}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 17a3 3 0 1 1-2-2.83V6l9-2v9" />
          <circle cx="14" cy="15" r="2" />
        </svg>
      )}
    </span>
  );
}

export function PlatformDot({ platform }: { platform: "youtube" | "tiktok" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        platform === "youtube"
          ? "bg-[var(--brand-youtube)]"
          : "bg-[var(--brand-tiktok-bg)] shadow-[-1px_0_0_var(--brand-tiktok-cyan),1px_0_0_var(--brand-tiktok-pink)]"
      }`}
    />
  );
}

function BrandedPlaceholder({
  platform,
  isTikTok = false,
  showTikTokLabel = false,
}: {
  platform: "youtube" | "tiktok";
  isTikTok?: boolean;
  showTikTokLabel?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden ${
        isTikTok
          ? "bg-gradient-to-br from-[#0E2F1D] via-[#143D29] to-[#1F5C3E]"
          : "bg-gradient-to-br from-[#143D29] via-[#1C4D34] to-[#0E2F1D]"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(134,239,172,0.16)_1px,transparent_1px)] [background-size:16px_16px]"
      />
      <div className="relative z-10 flex flex-col items-center">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#0E2F1D]/80 text-[#86EFAC] ring-4 ring-white/10 ${
            platform === "tiktok"
              ? "shadow-[-2px_0_0_rgba(37,244,238,0.55),2px_0_0_rgba(254,44,85,0.55)]"
              : ""
          }`}
        >
          <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
        </span>
        {platform === "tiktok" ? (
          showTikTokLabel ? (
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#0E2F1D]/85 px-3 py-1 text-[11px] font-semibold text-white">
              <span>Buka di TikTok</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </span>
          ) : (
            <span className="mt-2 text-[11px] font-semibold tracking-wide text-[#D9F0E3]">
              TikTok
            </span>
          )
        ) : null}
      </div>
    </div>
  );
}

export function VideoCard({
  video,
  sample,
  isActivePlayer = false,
  onPlayYouTube,
  onPlayTikTok,
  onActivateCompact,
  fixedFeaturedBody = false,
  variant = "card",
  className = "",
}: VideoCardProps) {
  const [thumbFailed, setThumbFailed] = useState(false);

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  // Sample non-clickable placeholder card
  if (sample) {
    const displayTitle = sanitizeDisplayTitle(sample.title);

    if (isCompact) {
      return (
        <article
          className={`flex h-full items-center gap-3.5 overflow-hidden rounded-2xl border border-[#D5E4DA] bg-white p-2.5 shadow-xs ${className}`}
        >
          <div className="relative aspect-video w-[36%] shrink-0 overflow-hidden rounded-xl bg-[#0E2F1D] sm:w-[40%]">
            <BrandedPlaceholder
              platform={sample.platform}
              isTikTok={sample.platform === "tiktok"}
            />
            <div className="absolute top-2 left-2">
              <PlatformIconChip platform={sample.platform} />
            </div>
            {sample.duration ? (
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-[#071D11]/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                {sample.duration}
              </span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1 pr-1">
            <h3 className="line-clamp-3 font-display text-sm font-bold leading-snug text-[#0E291B]">
              {displayTitle}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-[#43594D]">
              <span>{sample.platform === "tiktok" ? "TikTok" : "YouTube"}</span>
              <span className="rounded-full border border-[#D5E4DA] bg-[#F4F9F6] px-2 py-0.5 text-[10px] font-semibold text-[#33473D]">
                Contoh
              </span>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article
        className={`flex h-full flex-col overflow-hidden rounded-2xl border border-[#D5E4DA] bg-white shadow-xs ${className}`}
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#0E2F1D]">
          <BrandedPlaceholder
            platform={sample.platform}
            isTikTok={sample.platform === "tiktok"}
            showTikTokLabel={isFeatured && sample.platform === "tiktok"}
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <PlatformIconChip
              platform={sample.platform}
              size={isFeatured ? "md" : "sm"}
            />
            <span className="rounded-full border border-white/25 bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-[#143D29]">
              Contoh
            </span>
          </div>
          {sample.duration ? (
            <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-md bg-[#071D11]/85 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>{sample.duration}</span>
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <h3
            className={`line-clamp-2 font-display font-bold leading-snug text-[#0E291B] ${
              isFeatured ? "text-base sm:text-xl" : "text-sm sm:text-base"
            }`}
          >
            {displayTitle}
          </h3>
          <p className="mt-2 text-xs text-[#43594D]">
            Contoh tampilan (tambahkan video di admin)
          </p>
        </div>
      </article>
    );
  }

  if (!video) return null;

  const displayTitle = sanitizeDisplayTitle(video.title);
  const isYouTube = video.platform === "youtube";
  const hasTikTokEmbedId =
    !isYouTube &&
    typeof video.videoId === "string" &&
    /^\d{8,25}$/.test(video.videoId);
  const showThumb = Boolean(video.thumbnailSrc) && !thumbFailed;
  const platformLabel = isYouTube ? "YouTube" : "TikTok";

  const cardShellClass = `group flex h-full w-full overflow-hidden rounded-2xl border border-[#D5E4DA] bg-white text-left shadow-xs transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#15803D] hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 ${className}`;

  if (isCompact) {
    const compactBody = (
      <div className="flex h-full w-full items-center gap-3.5 p-2.5">
        <div className="relative aspect-video w-[36%] shrink-0 overflow-hidden rounded-xl bg-[#0E2F1D] sm:w-[40%]">
          {showThumb && video.thumbnailSrc ? (
            <img
              src={video.thumbnailSrc}
              alt={displayTitle}
              width={320}
              height={180}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />
          ) : (
            <BrandedPlaceholder
              platform={video.platform}
              isTikTok={!isYouTube}
            />
          )}

          {(isYouTube || showThumb) && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#143D29]/90 text-white shadow-md ring-2 ring-white/20 transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#15803D] motion-reduce:transition-none"
            >
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </span>
          )}

          <div className="absolute top-2 left-2 z-10">
            <PlatformIconChip platform={video.platform} />
          </div>

          {video.duration ? (
            <span className="absolute right-1.5 bottom-1.5 z-10 rounded-md bg-[#071D11]/85 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
              {video.duration}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <h3 className="line-clamp-3 font-display text-sm font-bold leading-snug text-[#0E291B] group-hover:text-[#15803D]">
            {displayTitle}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-[#43594D]">
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                isYouTube
                  ? "text-[var(--brand-youtube-text)]"
                  : "text-[var(--brand-tiktok-text)]"
              }`}
            >
              <PlatformDot platform={video.platform} />
              <span>{platformLabel}</span>
            </span>
            {video.duration ? (
              <>
                <span aria-hidden="true">•</span>
                <span className="font-mono">{video.duration}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );

    if (onActivateCompact) {
      return (
        <article className="h-full min-h-0">
          <button
            type="button"
            onClick={() => onActivateCompact(video)}
            aria-label={
              isYouTube
                ? `Putar video: ${displayTitle}`
                : hasTikTokEmbedId
                  ? `Putar video TikTok: ${displayTitle}`
                  : `Buka di TikTok: ${displayTitle}`
            }
            className={`${cardShellClass} cursor-pointer`}
          >
            {compactBody}
          </button>
        </article>
      );
    }

    if (isYouTube) {
      return (
        <article className="h-full min-h-0">
          <button
            type="button"
            onClick={() => onPlayYouTube?.(video.id)}
            aria-label={`Putar video: ${displayTitle}`}
            className={`${cardShellClass} cursor-pointer`}
          >
            {compactBody}
          </button>
        </article>
      );
    }

    if (hasTikTokEmbedId && onPlayTikTok) {
      return (
        <article className="h-full min-h-0">
          <button
            type="button"
            onClick={() => onPlayTikTok(video)}
            aria-label={`Putar video TikTok: ${displayTitle}`}
            className={`${cardShellClass} cursor-pointer`}
          >
            {compactBody}
          </button>
        </article>
      );
    }

    return (
      <article className="h-full min-h-0">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buka di TikTok: ${displayTitle}`}
          className={cardShellClass}
        >
          {compactBody}
        </a>
      </article>
    );
  }

  // Featured or Standard Grid Card: exact 16:9 image at top, title & optional description below (NO overlay title, NO black bars)
  const mediaFrame = (
    <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[#0E2F1D]">
      {isYouTube && isActivePlayer && video.videoId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&rel=0`}
          title={displayTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="h-full w-full border-0"
        />
      ) : (
        <>
          {showThumb && video.thumbnailSrc ? (
            <img
              src={video.thumbnailSrc}
              alt={displayTitle}
              width={640}
              height={360}
              loading="lazy"
              decoding="async"
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />
          ) : (
            <BrandedPlaceholder
              platform={video.platform}
              isTikTok={!isYouTube}
              showTikTokLabel={isFeatured && !isYouTube && !hasTikTokEmbedId}
            />
          )}

          {(isYouTube || showThumb) && (
            <span
              aria-hidden="true"
              className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-[#143D29]/90 text-white shadow-lg ring-4 ring-white/20 transition-transform duration-200 group-hover:scale-105 group-hover:bg-[#15803D] group-focus-visible:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100 ${
                isFeatured ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11"
              }`}
            >
              <Play
                className={`ml-0.5 fill-current ${
                  isFeatured ? "h-6 w-6 sm:h-7 sm:w-7" : "h-4 w-4"
                }`}
              />
            </span>
          )}

          <div className="absolute top-3 left-3 z-10">
            <PlatformIconChip
              platform={video.platform}
              size={isFeatured ? "md" : "sm"}
            />
          </div>

          {!isYouTube && !hasTikTokEmbedId && showThumb ? (
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-[#0E2F1D]/85 text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </span>
          ) : null}

          {video.duration ? (
            <span className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 rounded-md bg-[#071D11]/85 px-2 py-0.5 font-mono text-[11px] font-semibold text-white">
              <Clock className="h-3 w-3" aria-hidden="true" />
              <span>{video.duration}</span>
            </span>
          ) : null}
        </>
      )}
    </div>
  );

  const cardBody = (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {mediaFrame}
      <div
        className={`flex flex-1 flex-col justify-center p-4 sm:p-5 ${
          isFeatured && fixedFeaturedBody ? "lg:h-[7.25rem] lg:flex-none" : ""
        }`}
      >
        <h3
          className={`line-clamp-2 font-display font-bold leading-snug text-[#0E291B] group-hover:text-[#15803D] ${
            isFeatured ? "text-base sm:text-xl" : "text-sm sm:text-base"
          }`}
        >
          {displayTitle}
        </h3>
        {isFeatured && video.description ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#33473D] sm:text-sm">
            {video.description}
          </p>
        ) : null}
        {!isFeatured ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-[#43594D]">
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                isYouTube
                  ? "text-[var(--brand-youtube-text)]"
                  : "text-[var(--brand-tiktok-text)]"
              }`}
            >
              <PlatformDot platform={video.platform} />
              <span>{platformLabel}</span>
            </span>
            {video.duration ? (
              <>
                <span aria-hidden="true">•</span>
                <span className="font-mono">{video.duration}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (isYouTube && isActivePlayer) {
    return <article className={cardShellClass}>{cardBody}</article>;
  }

  if (isYouTube) {
    return (
      <article className="h-full">
        <button
          type="button"
          onClick={() => onPlayYouTube?.(video.id)}
          aria-label={`Putar video: ${displayTitle}`}
          className={`${cardShellClass} cursor-pointer`}
        >
          {cardBody}
        </button>
      </article>
    );
  }

  if (hasTikTokEmbedId && onPlayTikTok) {
    return (
      <article className="h-full">
        <button
          type="button"
          onClick={() => onPlayTikTok(video)}
          aria-label={`Putar video TikTok: ${displayTitle}`}
          className={`${cardShellClass} cursor-pointer`}
        >
          {cardBody}
        </button>
      </article>
    );
  }

  return (
    <article className="h-full">
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka di TikTok: ${displayTitle}`}
        className={cardShellClass}
      >
        {cardBody}
      </a>
    </article>
  );
}
