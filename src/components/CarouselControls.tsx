"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CarouselControlsProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}

export function CarouselControls({
  currentIndex,
  total,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: CarouselControlsProps) {
  if (total <= 1) {
    return null;
  }

  const counterLabel = `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <div className="flex h-[3.75rem] shrink-0 items-center gap-3 rounded-2xl border border-[#D5E4DA] bg-white px-3.5 shadow-2xs">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#CBD8D0] bg-[#F8FBF9] text-[#143D29] transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] lg:h-10 lg:w-10"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 font-display text-xs font-bold tabular-nums text-[#0E291B]">
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
        onClick={onNext}
        aria-label={nextLabel}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#CBD8D0] bg-[#F8FBF9] text-[#143D29] transition-colors hover:bg-[#EAF3EE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143D29] lg:h-10 lg:w-10"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
