"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, MessageCircle, ShoppingBag } from "lucide-react";
import { getWhatsAppHref, WHATSAPP_PLACEHOLDER_TEXT } from "@/lib/whatsapp";

interface MobileActionBarProps {
  whatsappNumber?: string | null;
  shopeeStoreUrl?: string | null;
}

export function MobileActionBar({
  whatsappNumber,
  shopeeStoreUrl,
}: MobileActionBarProps) {
  const whatsappHref = getWhatsAppHref(whatsappNumber);
  const hasShopee = Boolean(shopeeStoreUrl && shopeeStoreUrl.trim());

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isNearFooterEnd, setIsNearFooterEnd] = useState(false);

  // Detect mobile menu or modal dialog open state
  useEffect(() => {
    const checkOverlays = () => {
      const menuOpen =
        document.documentElement.dataset.mobileMenuOpen === "true";
      const modalOpen = Boolean(
        document.querySelector('[role="dialog"][aria-modal="true"]')
      );
      setIsOverlayOpen(menuOpen || modalOpen);
    };

    checkOverlays();
    const observer = new MutationObserver(checkOverlays);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mobile-menu-open"],
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // Detect on-screen keyboard open via input focus or visualViewport shrink
  useEffect(() => {
    const isTextInput = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName;
      if (tag === "TEXTAREA" || tag === "SELECT") return true;
      if (tag === "INPUT") {
        const type = (el as HTMLInputElement).type?.toLowerCase() || "text";
        return !["button", "checkbox", "radio", "submit", "reset", "file"].includes(
          type
        );
      }
      return (el as HTMLElement).isContentEditable === true;
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (isTextInput(e.target as Element)) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        setIsKeyboardOpen(isTextInput(document.activeElement));
      }, 80);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Detect very bottom of the page so the bar never overlaps the footer CTA
  useEffect(() => {
    const checkScrollBottom = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight || 0;
      const winHeight = window.innerHeight || 0;
      const distanceFromBottom = docHeight - (scrollY + winHeight);
      setIsNearFooterEnd(docHeight > winHeight + 200 && distanceFromBottom < 96);
    };

    checkScrollBottom();
    window.addEventListener("scroll", checkScrollBottom, { passive: true });
    window.addEventListener("resize", checkScrollBottom);
    return () => {
      window.removeEventListener("scroll", checkScrollBottom);
      window.removeEventListener("resize", checkScrollBottom);
    };
  }, []);

  const isHidden = isOverlayOpen || isKeyboardOpen || isNearFooterEnd;

  return (
    <aside
      aria-label="Aksi cepat seluler"
      aria-hidden={isHidden ? "true" : undefined}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#CDE2D4] bg-white/95 px-4 pt-2 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(14,47,29,0.10)] backdrop-blur-md transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden ${
        isHidden
          ? "pointer-events-none translate-y-full"
          : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2.5">
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isHidden ? -1 : undefined}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#15803D] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#116932] active:bg-[#0E5629] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E291B]"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Chat WhatsApp</span>
          </a>
        ) : (
          <span className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#CBD8D0] bg-[#F4F8F5] px-3.5 py-2.5 text-xs font-semibold text-[#33473D]">
            <MessageCircle className="h-4 w-4 shrink-0 text-[#15803D]" aria-hidden="true" />
            <span className="truncate">{WHATSAPP_PLACEHOLDER_TEXT}</span>
          </span>
        )}

        {hasShopee && shopeeStoreUrl ? (
          <a
            href={shopeeStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={isHidden ? -1 : undefined}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#C84B28] px-4 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-[#B03E1E] active:bg-[#963317] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E291B]"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Toko Shopee</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </aside>
  );
}
