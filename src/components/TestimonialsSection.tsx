"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Quote,
  Sprout,
  Star,
  ThumbsUp,
  Users,
} from "lucide-react";
import { CarouselControls } from "@/components/CarouselControls";
import { HOME_SECTION_IDS } from "@/lib/site-content/hero-cta";
import {
  cloneTestimonialsDefaults,
  type TestimonialItem,
  type TestimonialsData,
} from "@/lib/site-content/testimonials-defaults";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";
import { Container } from "@/components/Container";
import { ResilientImage } from "@/components/ResilientImage";

interface TestimonialsSectionProps {
  testimonials?: TestimonialsData;
}

const AVATAR_TONES = [
  "bg-[#D9F0E3] text-[#0E2F1D] ring-2 ring-[#9BC5AC]",
  "bg-[#143D29] text-white ring-2 ring-[#86EFAC]/60",
] as const;

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function TestimonialAvatar({
  item,
  index,
  size = "md",
  dark = false,
}: {
  item: TestimonialItem;
  index: number;
  size?: "md" | "lg";
  dark?: boolean;
}) {
  const resolvedPhoto = resolveImageSrc(item.photoSrc, null);
  const sizeClasses = size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  const ringClass = dark
    ? "ring-2 ring-[#86EFAC]/50"
    : "ring-2 ring-[#B4DEC6]";
  const toneClass = AVATAR_TONES[index % AVATAR_TONES.length];

  if (resolvedPhoto) {
    return (
      <span
        className={`relative block shrink-0 overflow-hidden rounded-full bg-[#EAF3EE] ${sizeClasses} ${ringClass}`}
      >
        <ResilientImage
          src={resolvedPhoto}
          fallbackSrc={null}
          alt={item.photoAlt || item.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold ${sizeClasses} ${toneClass}`}
    >
      {getInitials(item.name)}
    </span>
  );
}

function RatingStars({
  rating,
  dark = false,
}: {
  rating: number;
  dark?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={`Rating ${rating} dari 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? dark
                ? "fill-[#FBBF24] text-[#FBBF24]"
                : "fill-[#D97706] text-[#D97706]"
              : dark
                ? "text-white/25"
                : "text-[#CBD8D0]"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function SmallTestimonialButton({
  item,
  originalIndex,
  showRatings,
  onSelect,
  className = "",
}: {
  item: TestimonialItem;
  originalIndex: number;
  showRatings: boolean;
  onSelect: (index: number) => void;
  className?: string;
}) {
  const metaText = [item.role, item.location].filter(Boolean).join(" • ");

  return (
    <button
      type="button"
      onClick={() => onSelect(originalIndex)}
      aria-label={`Tampilkan testimoni dari ${item.name}`}
      className={`group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[#D5E4DA] bg-white p-5 text-left shadow-xs transition-[border-color,box-shadow] duration-200 hover:border-[#15803D] hover:shadow-md focus-visible:border-[#143D29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] motion-reduce:transition-none sm:p-5 ${className}`}
    >
      <div className="flex min-h-[1.5rem] w-full shrink-0 items-center justify-between gap-2">
        {item.tag ? (
          <span className="truncate rounded-full border border-[#CDE2D4] bg-[#EAF3EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#143D29]">
            {item.tag}
          </span>
        ) : (
          <span aria-hidden="true" className="h-5" />
        )}
        {showRatings ? (
          item.rating !== null ? (
            <RatingStars rating={item.rating} />
          ) : (
            <span aria-hidden="true" className="h-3.5 w-16 shrink-0" />
          )
        ) : null}
      </div>

      <div className="mt-2.5 min-h-0 w-full min-w-0 flex-1 overflow-hidden">
        <p className="line-clamp-4 break-words text-sm leading-relaxed text-[#1A3326]">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      <div className="mt-auto flex w-full shrink-0 items-center gap-3 border-t border-[#E6F0EA] pt-3">
        <TestimonialAvatar item={item} index={originalIndex} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-[#0E291B] group-hover:text-[#15803D]">
            {item.name}
          </p>
          <p className="min-h-[1rem] truncate text-xs text-[#33473D]">
            {metaText}
          </p>
        </div>
      </div>
    </button>
  );
}

interface ParsedStatNumber {
  target: number;
  decimals: number;
  decimalSep: "," | ".";
  useThousandDots: boolean;
  suffix: string;
}

function parseStatValue(raw: string): ParsedStatNumber | null {
  const trimmed = raw.trim();
  const match = trimmed.match(/^([\d.,]+)(.*)$/);
  if (!match) return null;

  const numPart = match[1];
  const suffix = match[2] ?? "";

  if (/^\d{1,3}(\.\d{3})+$/.test(numPart)) {
    const target = Number(numPart.replace(/\./g, ""));
    if (!Number.isFinite(target)) return null;
    return {
      target,
      decimals: 0,
      decimalSep: ",",
      useThousandDots: true,
      suffix,
    };
  }

  const commaMatch = numPart.match(/^(\d+),(\d+)$/);
  if (commaMatch) {
    const target = Number(`${commaMatch[1]}.${commaMatch[2]}`);
    if (!Number.isFinite(target)) return null;
    return {
      target,
      decimals: commaMatch[2].length,
      decimalSep: ",",
      useThousandDots: false,
      suffix,
    };
  }

  const dotMatch = numPart.match(/^(\d+)\.(\d+)$/);
  if (dotMatch) {
    const target = Number(numPart);
    if (!Number.isFinite(target)) return null;
    return {
      target,
      decimals: dotMatch[2].length,
      decimalSep: ".",
      useThousandDots: false,
      suffix,
    };
  }

  if (/^\d+$/.test(numPart)) {
    const target = Number(numPart);
    if (!Number.isFinite(target)) return null;
    return {
      target,
      decimals: 0,
      decimalSep: ",",
      useThousandDots: false,
      suffix,
    };
  }

  return null;
}

function formatAnimatedStat(
  current: number,
  parsed: ParsedStatNumber
): string {
  if (parsed.decimals > 0) {
    const fixed = current.toFixed(parsed.decimals);
    const formatted =
      parsed.decimalSep === "," ? fixed.replace(".", ",") : fixed;
    return `${formatted}${parsed.suffix}`;
  }

  const rounded = Math.round(current);
  if (parsed.useThousandDots) {
    const grouped = rounded
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${grouped}${parsed.suffix}`;
  }

  return `${rounded}${parsed.suffix}`;
}

function StatIcon({ index }: { index: number }) {
  const mod = index % 3;
  if (mod === 0) {
    return <Star className="h-4 w-4 fill-[#15803D] text-[#15803D]" aria-hidden="true" />;
  }
  if (mod === 1) {
    return <Users className="h-4 w-4 text-[#15803D]" aria-hidden="true" />;
  }
  return <ThumbsUp className="h-4 w-4 text-[#15803D]" aria-hidden="true" />;
}

function SummaryStatsStrip({
  stats,
}: {
  stats: NonNullable<TestimonialsData["stats"]>;
}) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const node = stripRef.current;
    if (!node || typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;
      const duration = 900;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setProgress(null);
        }
      };

      setProgress(0);
      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const colsClass =
    stats.length === 1
      ? "sm:grid-cols-1"
      : stats.length === 2
        ? "sm:grid-cols-2 sm:divide-x sm:divide-y-0"
        : stats.length >= 4
          ? "sm:grid-cols-2 lg:grid-cols-4 lg:divide-x sm:divide-y-0"
          : "sm:grid-cols-3 sm:divide-x sm:divide-y-0";

  return (
    <div
      ref={stripRef}
      aria-label="Ringkasan ulasan pelanggan"
      className={`mt-6 grid grid-cols-1 divide-y divide-[#DCE8DF] overflow-hidden rounded-2xl border border-[#CFE3D6] bg-gradient-to-r from-[#F6FBF7] via-white to-[#F6FBF7] shadow-xs ${colsClass}`}
    >
      {stats.map((stat, idx) => {
        const parsed = parseStatValue(stat.value);
        const animatedDisplay =
          progress !== null && parsed
            ? formatAnimatedStat(parsed.target * progress, parsed)
            : stat.value;

        return (
          <div
            key={stat.id}
            className="flex items-center gap-3.5 px-4 py-3 sm:px-5 sm:py-3.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E3F3E8] ring-1 ring-[#C5E3CE]">
              <StatIcon index={idx} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none font-bold tracking-tight tabular-nums text-[#143D29] sm:text-3xl">
                <span className="relative inline-block">
                  <span className="invisible" aria-hidden="true">
                    {stat.value}
                  </span>
                  <span className="absolute inset-0">{animatedDisplay}</span>
                </span>
              </p>
              <p className="mt-1 truncate text-xs font-medium text-[#43594D]">
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const data = testimonials ?? cloneTestimonialsDefaults();
  const items = data.items;

  const initialIndex = useMemo(() => {
    if (items.length === 0) return 0;
    if (data.featuredId) {
      const found = items.findIndex((item) => item.id === data.featuredId);
      if (found >= 0) return found;
    }
    return 0;
  }, [items, data.featuredId]);

  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [isFading, setIsFading] = useState(false);

  if (!data.enabled || items.length === 0) {
    return null;
  }

  const total = items.length;
  const safeIndex =
    activeIndex >= 0 && activeIndex < total ? activeIndex : 0;
  const activeItem = items[safeIndex];
  const activeMeta = [activeItem.role, activeItem.location]
    .filter(Boolean)
    .join(" • ");

  const circularOthers = Array.from({ length: total - 1 }, (_, offset) => {
    const originalIndex = (safeIndex + 1 + offset) % total;
    return { item: items[originalIndex], originalIndex };
  });
  const desktopOthers = circularOthers.slice(0, 4);

  const hasAnySample =
    items.some((item) => item.isSample) ||
    (data.showStats && data.statsAreSample && data.stats.length > 0);
  const showSampleNotice = data.showSampleLabel && hasAnySample;

  const selectIndex = (nextIndex: number) => {
    if (nextIndex === safeIndex) return;
    setIsFading(true);
    setActiveIndex(nextIndex);
    setTimeout(() => setIsFading(false), 180);
  };

  const goPrev = () => {
    selectIndex((safeIndex - 1 + total) % total);
  };

  const goNext = () => {
    selectIndex((safeIndex + 1) % total);
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

  return (
    <section
      id={HOME_SECTION_IDS.TESTIMONI}
      aria-labelledby="testimonials-heading"
      className="scroll-mt-28 relative z-10 bg-transparent pt-[var(--section-gap)] pb-0"
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C5E3CE] bg-[#E3F3E8] px-3.5 py-1 text-xs font-bold text-[#0E2F1D]">
            <Sprout className="h-3.5 w-3.5 text-[#15803D]" aria-hidden="true" />
            <span>{data.eyebrow}</span>
          </span>

          <h2
            id="testimonials-heading"
            className="mt-3 font-display text-[clamp(1.75rem,2.35vw+0.45rem,2.35rem)] font-bold leading-[1.22] tracking-tight text-[#0E291B]"
          >
            <span>{data.heading}</span>
            {data.headingAccent ? (
              <span className="mt-1 block text-[#15803D]">
                {data.headingAccent}
              </span>
            ) : null}
          </h2>

          {data.description ? (
            <p className="mt-2.5 text-sm leading-relaxed text-[#2F5341] sm:text-base">
              {data.description}
            </p>
          ) : null}
        </div>

        {/* Summary Stats Strip */}
        {data.showStats && data.stats.length > 0 ? (
          <SummaryStatsStrip stats={data.stats} />
        ) : null}

        {/* Interactive Layout: Fixed-height Featured Column + Fixed 2x2 Grid */}
        <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
          {/* Left Column: Featured Card (fixed 27rem mobile / 29rem desktop) + Control Row (fixed 3.75rem) */}
          <div
            onKeyDown={handleFeaturedKeyDown}
            className={`flex flex-col gap-4 ${
              desktopOthers.length > 0 ? "md:col-span-5" : "md:col-span-12"
            }`}
          >
            <article className="relative flex h-[27rem] flex-col overflow-hidden rounded-tl-[48px] rounded-tr-2xl rounded-br-[48px] rounded-bl-2xl border border-[#1E4F34] bg-[#0E2F1D] p-6 text-white shadow-xl md:h-[29rem] md:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-4 right-5 opacity-45"
              >
                <Quote className="h-20 w-20 text-[#2B6644]" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0E2F1D]/40 to-[#0E2F1D]" />
              </div>

              <div
                aria-live="polite"
                className={`relative z-10 flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none ${
                  isFading ? "opacity-70" : "opacity-100"
                }`}
              >
                <div className="flex min-h-[1.75rem] shrink-0 flex-wrap items-center gap-2">
                  {activeItem.tag ? (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-[#86EFAC]">
                      {activeItem.tag}
                    </span>
                  ) : null}
                  {activeItem.isSample && data.showSampleLabel ? (
                    <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#D9F0E3]">
                      Contoh
                    </span>
                  ) : null}
                </div>

                {data.showRatings ? (
                  <div className="mt-3 flex h-5 shrink-0 items-center">
                    {activeItem.rating !== null ? (
                      <RatingStars rating={activeItem.rating} dark />
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4 min-h-0 flex-1 overflow-hidden">
                  <blockquote className="line-clamp-8 font-display text-lg leading-relaxed font-semibold text-white md:line-clamp-7 md:text-[21px]">
                    &ldquo;{activeItem.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-auto flex shrink-0 items-center gap-3.5 border-t border-white/15 pt-4">
                  <TestimonialAvatar
                    item={activeItem}
                    index={safeIndex}
                    size="lg"
                    dark
                  />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold text-white">
                      {activeItem.name}
                    </p>
                    <p className="min-h-[1rem] truncate text-xs text-[#C6E2D1]">
                      {activeMeta}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Control Row (Prev / Counter + Progress / Next) - Fixed 3.75rem height */}
            <CarouselControls
              currentIndex={safeIndex}
              total={total}
              onPrev={goPrev}
              onNext={goNext}
              prevLabel="Testimoni sebelumnya"
              nextLabel="Testimoni berikutnya"
            />
          </div>

          {/* Right Column Desktop (>=768px): Fixed 2x2 grid matched to left column height (29rem + 1rem + 3.75rem = 33.75rem) */}
          {desktopOthers.length > 0 ? (
            <div className="hidden md:block md:col-span-7 md:h-[33.75rem]">
              <div
                className={`grid h-full min-h-0 grid-cols-2 grid-rows-2 gap-4 transition-opacity duration-200 motion-reduce:transition-none ${
                  isFading ? "opacity-70" : "opacity-100"
                }`}
              >
                {desktopOthers.map(({ item, originalIndex }, slotIdx) => (
                  <SmallTestimonialButton
                    key={`slot-${slotIdx}`}
                    item={item}
                    originalIndex={originalIndex}
                    showRatings={data.showRatings}
                    onSelect={selectIndex}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Mobile (<768px): Horizontal scroll-snap strip for remaining items with equal fixed height */}
        {circularOthers.length > 0 ? (
          <div className="mt-5 md:hidden">
            <div className="relative">
              <div
                role="region"
                aria-label="Daftar testimoni lainnya"
                tabIndex={0}
                className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-3 pr-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29]"
              >
                {circularOthers.map(({ item, originalIndex }) => (
                  <div
                    key={item.id}
                    className="h-[15.5rem] w-[84vw] max-w-[330px] shrink-0 snap-center"
                  >
                    <SmallTestimonialButton
                      item={item}
                      originalIndex={originalIndex}
                      showRatings={data.showRatings}
                      onSelect={selectIndex}
                    />
                  </div>
                ))}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#F7FBF8] to-transparent"
              />
            </div>
          </div>
        ) : null}

        {/* Single Section-level Sample Note */}
        {showSampleNotice ? (
          <p className="mt-4 text-xs text-[#43594D]">
            Contoh tampilan: ganti dengan testimoni pelanggan asli sebelum rilis.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
