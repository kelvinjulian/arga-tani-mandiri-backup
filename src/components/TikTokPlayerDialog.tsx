"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, X } from "lucide-react";
import { MODAL_Z_INDEX_CLASS } from "@/lib/ui/z-index";
import type { PublicVideoItem } from "@/lib/videos/content";
import { sanitizeDisplayTitle } from "@/components/VideoCard";

interface TikTokPlayerDialogProps {
  video: PublicVideoItem | null;
  onClose: () => void;
}

export function TikTokPlayerDialog({
  video,
  onClose,
}: TikTokPlayerDialogProps) {
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!video || !mounted) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      previousFocusRef.current?.focus();
    };
  }, [video, mounted, onClose]);

  if (!mounted || !video) {
    return null;
  }

  const displayTitle = sanitizeDisplayTitle(video.title);
  const hasValidNumericId =
    typeof video.videoId === "string" && /^\d{8,25}$/.test(video.videoId);

  return createPortal(
    <div
      className={`fixed inset-0 ${MODAL_Z_INDEX_CLASS} pointer-events-auto flex max-h-dvh items-center justify-center overflow-y-auto bg-[#071D11]/80 p-3 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none sm:p-4`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tiktok-player-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[392px] flex-col overflow-hidden rounded-3xl border border-[#2B6244] bg-[#0E2F1D] p-4 text-white shadow-2xl"
      >
        <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
          <h2
            id="tiktok-player-title"
            className="line-clamp-2 font-display text-sm font-bold leading-snug text-white sm:text-base"
          >
            {displayTitle}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup pemutar video"
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
          <div className="aspect-[9/16] w-[min(360px,calc(85dvh*9/16),calc(100vw-3rem))] max-h-[85dvh] overflow-hidden rounded-2xl bg-[#071D11]">
            {hasValidNumericId ? (
              <iframe
                src={`https://www.tiktok.com/player/v1/${video.videoId}?autoplay=1&music_info=1&description=1`}
                title={displayTitle}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full border-0"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                <p className="text-sm text-[#D9F0E3]">
                  Video ini tidak dapat diputar langsung di halaman.
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#0E2F1D]"
                >
                  <span>Buka di TikTok</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex shrink-0 items-center justify-between gap-2 pt-1 text-xs">
          <span className="text-[#C6E2D1]">Pemutar Resmi TikTok</span>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#86EFAC] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>Buka di TikTok</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
