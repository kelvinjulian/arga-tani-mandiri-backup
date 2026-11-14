"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  Home,
  Package,
  Info,
  BookOpen,
  Phone,
  Sprout,
  ArrowUpRight,
} from "lucide-react";
import { SITE_DATA } from "@/data/site";
import { SHOPEE_STORE_URL, productCategories } from "@/data/categories";
import { Container } from "@/components/Container";

const NAV_LINKS = [
  { href: "/", label: "Beranda", anchorId: "beranda", icon: Home },
  { href: "/#produk", label: "Produk", anchorId: "produk", icon: Package, hasChevron: true },
  { href: "/#tentang-kami", label: "Tentang Kami", anchorId: "tentang-kami", icon: Info },
  { href: "/#artikel-edukasi", label: "Artikel Edukasi", anchorId: "artikel-edukasi", icon: BookOpen },
  { href: "/#kontak", label: "Kontak", anchorId: "kontak", icon: Phone },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const [activeHref, setActiveHref] = useState<string>(() => {
    if (pathname.startsWith("/artikel")) return "/#artikel-edukasi";
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const match = NAV_LINKS.find((l) => l.anchorId === hashId);
      if (match) return match.href;
    }
    return "/";
  });

  const isClickScrollingRef = useRef(false);
  const clickScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingScrollTargetRef = useRef<string | null>(null);

  // Calculate active href based strictly on scroll position (HOME ROUTE ONLY)
  const getActiveHrefFromScroll = useCallback((): string => {
    if (pathname.startsWith("/artikel")) return "/#artikel-edukasi";
    if (pathname !== "/") return "";

    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset : 0;
    if (scrollY < 80) {
      return "/";
    }

    // Check if scrolled near bottom of page -> Kontak
    if (
      typeof document !== "undefined" &&
      window.innerHeight + scrollY >= (document.documentElement.scrollHeight || 0) - 60
    ) {
      return "/#kontak";
    }

    const headerHeight = 88;
    const threshold = headerHeight + 0.35 * (window.innerHeight || 800);

    const sections = [
      { id: "beranda", href: "/" },
      { id: "produk", href: "/#produk" },
      { id: "tentang-kami", href: "/#tentang-kami" },
      { id: "artikel-edukasi", href: "/#artikel-edukasi" },
      { id: "kontak", href: "/#kontak" },
    ];

    let active = "/";
    for (const s of sections) {
      const el =
        document.getElementById(s.id) ||
        (s.id === "beranda" ? document.querySelector('[data-testid="hero-section"]') : null);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) {
          active = s.href;
        }
      }
    }
    return active;
  }, [pathname]);

  // Track window.scrollY > 24 for morphing dock animation
  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setIsScrolled(scrollY > 24);
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  // Automatically close mobile menu when viewport resizes to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync active item synchronously when navigating between routes
  useEffect(() => {
    if (pathname.startsWith("/artikel")) {
      if (clickScrollTimerRef.current) {
        clearTimeout(clickScrollTimerRef.current);
        clickScrollTimerRef.current = null;
      }
      isClickScrollingRef.current = false;
      pendingScrollTargetRef.current = null;
      queueMicrotask(() => setActiveHref("/#artikel-edukasi"));
      return;
    }

    if (pathname === "/") {
      const targetAnchor =
        pendingScrollTargetRef.current ||
        (typeof window !== "undefined" && window.location.hash
          ? window.location.hash.replace("#", "")
          : null);

      if (targetAnchor && targetAnchor !== "beranda") {
        const matched = NAV_LINKS.find((l) => l.anchorId === targetAnchor);
        if (matched) {
          queueMicrotask(() => setActiveHref(matched.href));
          isClickScrollingRef.current = true;
          if (clickScrollTimerRef.current) clearTimeout(clickScrollTimerRef.current);
          clickScrollTimerRef.current = setTimeout(() => {
            isClickScrollingRef.current = false;
            setActiveHref(getActiveHrefFromScroll());
          }, 1200);

          const scrollToTarget = () => {
            const el = document.getElementById(targetAnchor);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          };

          requestAnimationFrame(scrollToTarget);
          const t1 = setTimeout(scrollToTarget, 100);
          const t2 = setTimeout(scrollToTarget, 300);
          const t3 = setTimeout(scrollToTarget, 600);

          pendingScrollTargetRef.current = null;
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
          };
        }
      }

      pendingScrollTargetRef.current = null;
      isClickScrollingRef.current = false;
      queueMicrotask(() => setActiveHref(getActiveHrefFromScroll()));
    }
  }, [pathname, getActiveHrefFromScroll]);

  // Scroll listener runs ONLY on the home route
  useEffect(() => {
    if (pathname !== "/") return;

    const onScroll = () => {
      if (isClickScrollingRef.current) return;
      setActiveHref(getActiveHrefFromScroll());
    };

    const onScrollEnd = () => {
      isClickScrollingRef.current = false;
      setActiveHref(getActiveHrefFromScroll());
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }, [pathname, getActiveHrefFromScroll]);

  // Clean up click-scroll timer on unmount
  useEffect(() => {
    return () => {
      if (clickScrollTimerRef.current) {
        clearTimeout(clickScrollTimerRef.current);
        clickScrollTimerRef.current = null;
      }
    };
  }, []);

  // Escape key handler for mobile drawer
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Click sets active item immediately and smooth-scrolls
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: (typeof NAV_LINKS)[number]
  ) => {
    if (e.detail > 0) {
      e.currentTarget.blur();
    }

    if (clickScrollTimerRef.current) {
      clearTimeout(clickScrollTimerRef.current);
      clickScrollTimerRef.current = null;
    }
    isClickScrollingRef.current = false;

    setActiveHref(item.href);

    if (pathname === "/") {
      isClickScrollingRef.current = true;
      clickScrollTimerRef.current = setTimeout(() => {
        isClickScrollingRef.current = false;
        setActiveHref(getActiveHrefFromScroll());
      }, 1000);

      if (item.href === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      } else if (item.href.startsWith("/#")) {
        const targetId = item.anchorId;
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", item.href);
          }
        }
      }
    } else {
      if (item.anchorId) {
        pendingScrollTargetRef.current = item.anchorId;
        isClickScrollingRef.current = true;
      }
    }
  };

  const handleAnchorShortcut = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    href: string
  ) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    } else {
      pendingScrollTargetRef.current = targetId;
      isClickScrollingRef.current = true;
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="bg-[#0E291B]/30 backdrop-blur-xs fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      <header className="sticky top-0 z-50 w-full min-h-[76px] sm:min-h-[84px] flex items-center py-2">
        <Container className="relative w-full">
          {/* Outer Floating Glassmorphic Dock Container (morphs from full-width rounded-2xl dock at top to compact centered rounded-full capsule on scroll) */}
          <div
            className={`mx-auto flex items-center justify-between backdrop-blur-xl border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled
                ? "max-w-[1140px] rounded-full bg-white/95 border-[#BBD4C4] px-4 sm:px-5 py-2 shadow-[0_14px_36px_rgba(14,47,29,0.12)] ring-1 ring-[#0E2F1D]/5"
                : "max-w-full rounded-2xl bg-white/85 border-[#DCE8DF] px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_8px_30px_rgb(14,47,29,0.06)]"
            }`}
          >
            {/* Left: Brand Identity */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="group inline-flex items-center gap-2.5 sm:gap-3 rounded-xl text-[#0E291B] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#143D29] focus-visible:ring-offset-2"
            >
              <span
                className={`bg-[#EAF3EE] border border-[#CDE2D4] flex items-center justify-center shrink-0 transition-all duration-500 group-hover:border-[#9BC5AC] ${
                  isScrolled ? "p-1.5 rounded-full" : "p-2 rounded-xl"
                }`}
              >
                <Image
                  src="/brand/logo-mark.png"
                  alt=""
                  width={28}
                  height={28}
                  priority
                  className={`object-contain transition-all duration-500 ${
                    isScrolled ? "h-5 w-5 sm:h-6 sm:w-6" : "h-6 w-6 sm:h-7 sm:w-7"
                  }`}
                />
              </span>
              <div className="flex flex-col justify-center">
                <span
                  className={`font-display text-[#0E291B] font-bold leading-tight tracking-tight transition-all duration-500 ${
                    isScrolled ? "text-[15px] sm:text-base" : "text-base sm:text-lg"
                  }`}
                >
                  {SITE_DATA.companyName}
                </span>
                <span
                  className={`text-[#526458] text-[11px] font-medium leading-tight overflow-hidden transition-all duration-500 ${
                    isScrolled
                      ? "max-h-0 opacity-0 mt-0"
                      : "max-h-5 opacity-100 mt-0.5"
                  }`}
                >
                  Sarana Produksi Pertanian
                </span>
              </div>
            </Link>

            {/* Center: Segmented Pill Navigation Track (Desktop lg+) */}
            <nav
              aria-label="Navigasi utama"
              className="hidden lg:flex items-center gap-1 bg-[#F0F6F2]/90 p-1.5 rounded-full border border-[#DCE8DF]"
            >
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.anchorId === "artikel-edukasi" && pathname.startsWith("/artikel")
                    ? true
                    : activeHref === item.href;

                if (item.hasChevron) {
                  return (
                    <div key={item.href} className="relative group/prod">
                      <Link
                        href={item.href}
                        aria-current={isActive ? "true" : undefined}
                        onClick={(e) => handleNavClick(e, item)}
                        className={
                          isActive
                            ? "bg-[#0E2F1D] text-white font-semibold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29]"
                            : "text-[#384E40] hover:text-[#0E2F1D] hover:bg-white/70 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29]"
                        }
                      >
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                          />
                        )}
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover/prod:rotate-180 ${
                            isActive ? "text-emerald-300" : "text-[#526458]"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>

                      {/* Subtle Quick Category Hover Popover (links directly to Shopee Official Store) */}
                      <div className="invisible opacity-0 translate-y-1 group-hover/prod:visible group-hover/prod:opacity-100 group-hover/prod:translate-y-0 group-focus-within/prod:visible group-focus-within/prod:opacity-100 group-focus-within/prod:translate-y-0 transition-all duration-200 absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-64 before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-3">
                        <div className="rounded-2xl border border-[#DCE8DF] bg-white/95 backdrop-blur-xl p-2 shadow-xl">
                          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#526458]">
                            Katalog Resmi di Shopee
                          </div>
                          {productCategories.map((cat) => (
                            <a
                              key={cat.name}
                              href={SHOPEE_STORE_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#0E291B] hover:bg-[#EAF3EE] hover:text-[#15803D] transition-colors cursor-pointer"
                            >
                              <span>{cat.name}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-[#526458]" aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    onClick={(e) => handleNavClick(e, item)}
                    className={
                      isActive
                        ? "bg-[#0E2F1D] text-white font-semibold px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-sm transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29]"
                        : "text-[#384E40] hover:text-[#0E2F1D] hover:bg-white/70 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29]"
                    }
                  >
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                      />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Dual Quick-Action Buttons (Desktop lg+) */}
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/#konsultasi-whatsapp"
                onClick={(e) => handleAnchorShortcut(e, "konsultasi-whatsapp", "/#konsultasi-whatsapp")}
                className={`bg-[#EAF3EE] hover:bg-[#DCECE2] text-[#0E2F1D] border border-[#C5E3CE] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29] ${
                  isScrolled ? "rounded-full px-3.5 py-1.5" : "rounded-xl px-3.5 py-2"
                }`}
              >
                <MessageCircle className="h-4 w-4 text-[#15803D] shrink-0" aria-hidden="true" />
                <span>Chat WA</span>
              </Link>

              <a
                href={SHOPEE_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-[#C84B28] hover:bg-[#B03E1E] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow inline-flex items-center gap-1.5 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-[#143D29] ${
                  isScrolled ? "rounded-full px-4 py-1.5" : "rounded-xl px-4 py-2"
                }`}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Toko Shopee</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>

            {/* Mobile & Tablet Closed Right Controls (< lg) */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={SHOPEE_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C84B28] hover:bg-[#B03E1E] text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 shadow-2xs transition-colors"
              >
                <ShoppingBag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Shopee</span>
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-bento-drawer"
                aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                className={`bg-[#EAF3EE] hover:bg-[#DCECE2] text-[#0E2F1D] border border-[#CDE2D4] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-500 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#143D29] ${
                  isScrolled ? "rounded-full" : "rounded-xl"
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Open State: Floating Bento Sheet Dropdown (< lg) */}
          {mobileMenuOpen && (
            <nav
              id="mobile-bento-drawer"
              aria-label="Navigasi seluler"
              className="bg-white/95 backdrop-blur-xl border border-[#DCE8DF] rounded-3xl p-5 mt-2 shadow-2xl relative z-50 lg:hidden transition-all duration-300 origin-top animate-in fade-in slide-in-from-top-2"
            >
              {/* 1. Navigation List */}
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((item) => {
                  const IconComponent = item.icon;
                  const isActive =
                    item.anchorId === "artikel-edukasi" && pathname.startsWith("/artikel")
                      ? true
                      : activeHref === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={(e) => {
                          setMobileMenuOpen(false);
                          handleNavClick(e, item);
                        }}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-semibold transition-colors ${
                          isActive
                            ? "bg-[#EAF3EE] text-[#0E2F1D]"
                            : "text-[#384E40] hover:bg-[#F4F8F5] hover:text-[#0E2F1D]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                            />
                          )}
                          <span>{item.label}</span>
                        </span>
                        <IconComponent
                          className={`h-4 w-4 shrink-0 ${
                            isActive ? "text-[#15803D]" : "text-[#687D70]"
                          }`}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* 2. Embedded Mini Product Spotlight Card */}
              <Link
                href="/#produk"
                onClick={(e) => handleAnchorShortcut(e, "produk", "/#produk")}
                className="bg-gradient-to-r from-[#0B2E1B] to-[#124028] text-white p-3.5 rounded-2xl mt-3 flex items-center justify-between border border-white/10 shadow-sm transition-transform active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                    <Sprout className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xs sm:text-sm font-bold text-white truncate">
                      Produk Unggulan: Tamatric
                    </p>
                    <p className="text-[11px] text-[#D9F0E3] truncate mt-0.5">
                      Asam Humat &amp; Trichoderma
                    </p>
                  </div>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>

              {/* 3. Bottom Side-by-Side CTA Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                <Link
                  href="/#konsultasi-whatsapp"
                  onClick={(e) => handleAnchorShortcut(e, "konsultasi-whatsapp", "/#konsultasi-whatsapp")}
                  className="bg-[#15803D] hover:bg-[#116932] text-white rounded-xl py-3 px-3 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Konsultasi WhatsApp</span>
                </Link>

                <a
                  href={SHOPEE_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#C84B28] hover:bg-[#B03E1E] text-white rounded-xl py-3 px-3 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Toko Resmi Shopee</span>
                </a>
              </div>
            </nav>
          )}
        </Container>
      </header>
    </>
  );
}
