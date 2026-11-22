"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface MobileSnapRowProps {
  ariaLabel: string;
  itemCount: number;
  children: React.ReactNode;
  className?: string;
  edgeBleed?: boolean;
  showControls?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
}

export function MobileSnapRow({
  ariaLabel,
  itemCount,
  children,
  className = "",
  edgeBleed = true,
  showControls = true,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: MobileSnapRowProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const programmaticLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isProgrammaticScrollRef = useRef(false);
  const [internalIndex, setInternalIndex] = useState(0);

  const currentIndex =
    typeof controlledIndex === "number" ? controlledIndex : internalIndex;
  const safeIndex =
    currentIndex >= 0 && currentIndex < itemCount ? currentIndex : 0;

  const computeNearestSnapIndex = useCallback((): number => {
    const el = scrollerRef.current;
    if (!el || itemCount <= 1) return 0;
    const childNodes = el.children;
    if (childNodes.length === 0) return 0;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) return 0;
    if (el.scrollLeft >= maxScroll - 4) {
      return Math.min(itemCount - 1, childNodes.length - 1);
    }

    const firstChild = childNodes[0] as HTMLElement;
    const baseOffset = firstChild ? firstChild.offsetLeft : 0;
    const currentScroll = el.scrollLeft;

    let bestIdx = 0;
    let bestDist = Infinity;
    const limit = Math.min(itemCount, childNodes.length);

    for (let i = 0; i < limit; i += 1) {
      const child = childNodes[i] as HTMLElement;
      const snapPos = child.offsetLeft - baseOffset;
      const dist = Math.abs(snapPos - currentScroll);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [itemCount]);

  const syncIndexFromDom = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;
    const nextIdx = computeNearestSnapIndex();
    setInternalIndex(nextIdx);
    onActiveIndexChange?.(nextIdx);
  }, [computeNearestSnapIndex, onActiveIndexChange]);

  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      syncIndexFromDom();
    });
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onResize = () => {
      syncIndexFromDom();
    };
    const onScrollEnd = () => {
      if (programmaticLockTimerRef.current) {
        clearTimeout(programmaticLockTimerRef.current);
        programmaticLockTimerRef.current = null;
      }
      isProgrammaticScrollRef.current = false;
      syncIndexFromDom();
    };

    window.addEventListener("resize", onResize);
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("resize", onResize);
      el.removeEventListener("scrollend", onScrollEnd);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (programmaticLockTimerRef.current) {
        clearTimeout(programmaticLockTimerRef.current);
      }
    };
  }, [syncIndexFromDom]);

  const scrollToIndex = (targetIdx: number) => {
    const el = scrollerRef.current;
    if (!el || itemCount <= 1) return;
    const clamped = Math.max(0, Math.min(itemCount - 1, targetIdx));
    const childNodes = el.children;
    const targetChild = childNodes[clamped] as HTMLElement | undefined;
    const firstChild = childNodes[0] as HTMLElement | undefined;
    if (!targetChild) return;

    const baseOffset = firstChild ? firstChild.offsetLeft : 0;
    const targetLeft = Math.max(0, targetChild.offsetLeft - baseOffset);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (programmaticLockTimerRef.current) {
      clearTimeout(programmaticLockTimerRef.current);
    }
    isProgrammaticScrollRef.current = !prefersReducedMotion;
    setInternalIndex(clamped);
    onActiveIndexChange?.(clamped);

    el.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if (!prefersReducedMotion) {
      programmaticLockTimerRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        programmaticLockTimerRef.current = null;
      }, 420);
    }
  };

  // Rule: If a section has 1-2 items, do not render a carousel UI (no dots, no peeking), just stack them.
  if (itemCount <= 2) {
    return (
      <div className={`flex flex-col gap-3.5 ${className}`.trim()}>
        {children}
      </div>
    );
  }

  const counterLabel = `${String(safeIndex + 1).padStart(2, "0")} / ${String(
    itemCount
  ).padStart(2, "0")}`;
  const progressPercent = ((safeIndex + 1) / itemCount) * 100;
  const isAtStart = safeIndex <= 0;
  const isAtEnd = safeIndex >= itemCount - 1;

  return (
    <div className={`relative ${className}`.trim()}>
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={handleScroll}
        className={`relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] ${
          edgeBleed ? "-mx-4 scroll-px-4 px-4" : "scroll-px-1"
        }`}
      >
        {children}
      </div>

      {showControls && (
        <div className="relative z-10 mt-2.5 flex h-[3.25rem] items-center gap-3 rounded-2xl border border-[#D5E4DA] bg-white px-3 shadow-2xs">
          <button
            type="button"
            disabled={isAtStart}
            onClick={() => scrollToIndex(safeIndex - 1)}
            aria-label="Geser ke kartu sebelumnya"
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#CBD8D0] bg-[#F8FBF9] text-[#143D29] transition-colors hover:bg-[#EAF3EE] active:bg-[#DCECE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span
              aria-live="polite"
              className="shrink-0 font-display text-xs font-bold tabular-nums text-[#0E291B]"
            >
              {counterLabel}
            </span>
            <div
              aria-hidden="true"
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#DCE8DF]"
            >
              <div
                className="h-full rounded-full bg-[#15803D] transition-all duration-200 motion-reduce:transition-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isAtEnd}
            onClick={() => scrollToIndex(safeIndex + 1)}
            aria-label="Geser ke kartu berikutnya"
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#CBD8D0] bg-[#F8FBF9] text-[#143D29] transition-colors hover:bg-[#EAF3EE] active:bg-[#DCECE2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
