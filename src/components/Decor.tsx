"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Tiled Page Background Constants
 * P: Period (tile height) in pixels
 * g: Seam gap in pixels
 * Extent: Vertical distance from top of first shape (96px) to bottom of lowest shape (2971px) = 2875px
 * P = Extent (2875px) + g (333px) = 3208px
 */
export const g = 333;
export const P = 3208;
export const DECOR_EXTENT = 2875;
export const DECOR_SEAM_GAP = g;
export const DECOR_TILE_HEIGHT = P;
export const MIRROR_ALTERNATE_TILES = true;
export const MAX_ANIMATED_ELEMENTS = 10;

interface TileProps {
  tileIndex: number;
}

function DecorTile({ tileIndex }: TileProps) {
  const isMirrored = MIRROR_ALTERNATE_TILES && tileIndex % 2 === 1;

  // Animate only the first MAX_ANIMATED_ELEMENTS in document order across the page;
  // duplicates and elements beyond that remain static.
  const shouldAnimate = (candidateIndex: number) =>
    tileIndex === 0 && candidateIndex < MAX_ANIMATED_ELEMENTS;

  return (
    <div
      data-tile-index={tileIndex}
      className="absolute inset-x-0 w-full pointer-events-none"
      style={{
        top: `${tileIndex * P}px`,
        height: `${P}px`,
        transform: isMirrored ? "scaleX(-1)" : undefined,
        transformOrigin: "center top",
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          LEFT GUTTER SHAPES (14 shapes)
          ══════════════════════════════════════════════════════════════ */}

      {/* L1: Hero top-left soft circle with radial gradient (bleeds off edge) */}
      <div
        className={`absolute -left-36 h-[380px] w-[380px] rounded-full hidden md:block ${
          shouldAnimate(0) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "96px",
          background:
            "radial-gradient(circle, var(--deco-sage, #83A183) 0%, rgba(131, 161, 131, 0.4) 70%, transparent 100%)",
          opacity: 0.28,
        }}
      />
      {/* L2: Small olive accent cluster */}
      <div
        className="absolute left-[3%] h-5 w-5 rounded-full hidden xl:block"
        style={{
          top: "257px",
          backgroundColor: "var(--deco-olive, #6F8454)",
          opacity: 0.45,
        }}
      />
      {/* L3: Double concentric ring */}
      <div
        className="absolute left-[2%] hidden 2xl:block"
        style={{ top: "385px", opacity: 0.32 }}
      >
        <svg viewBox="0 0 160 160" className="h-32 w-32" fill="none">
          <circle
            cx="80"
            cy="80"
            r="38"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.5"
          />
          <circle
            cx="80"
            cy="80"
            r="68"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.8"
            strokeDasharray="3 4"
          />
        </svg>
      </div>

      {/* L4: Dark forest circle #1 (closed shape, <=90px) */}
      <div
        className="absolute left-[4%] h-[68px] w-[68px] rounded-full hidden xl:block"
        style={{
          top: "610px",
          backgroundColor: "var(--deco-forest, #254735)",
          opacity: 0.24,
        }}
      />
      {/* L5: Soft mint circle cluster */}
      <div
        className={`absolute -left-20 h-[240px] w-[240px] rounded-full hidden lg:block ${
          shouldAnimate(1) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "706px",
          background:
            "radial-gradient(circle, var(--bg-mint-tint, #D9F0E3) 0%, rgba(217, 240, 227, 0.5) 75%, transparent 100%)",
          opacity: 0.3,
        }}
      />
      {/* L6: Short botanical sprig #1 (~230px tall) */}
      <div
        className={`absolute left-0 hidden lg:block ${
          shouldAnimate(2) ? "decor-float-slow" : ""
        }`}
        style={{ top: "866px", opacity: 0.44 }}
      >
        <svg viewBox="0 0 70 230" fill="none" className="h-[230px] w-[70px]">
          <path
            d="M 6 226 C 18 170, 28 90, 52 14"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M 12 180 C 2 176, -2 165, 4 154 C 14 158, 18 168, 16 178 Z"
            fill="var(--deco-forest, #254735)"
          />
          <path
            d="M 17 140 C 30 132, 40 136, 42 146 C 32 150, 24 146, 18 141 Z"
            fill="var(--deco-olive, #6F8454)"
          />
          <path
            d="M 28 96 C 16 90, 12 78, 18 70 C 26 76, 30 86, 30 94 Z"
            fill="var(--deco-forest, #254735)"
          />
          <path
            d="M 36 60 C 50 52, 60 56, 62 66 C 50 70, 42 66, 37 61 Z"
            fill="var(--deco-sage, #83A183)"
          />
          <path
            d="M 52 14 C 44 24, 48 34, 52 38 C 58 32, 60 22, 52 14 Z"
            fill="var(--deco-olive, #6F8454)"
          />
        </svg>
      </div>

      {/* L7: Large sage circle bleeding off edge */}
      <div
        className={`absolute -left-32 h-[320px] w-[320px] rounded-full hidden md:block ${
          shouldAnimate(3) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "1155px",
          background:
            "radial-gradient(circle, var(--deco-sage, #83A183) 0%, rgba(131, 161, 131, 0.4) 70%, transparent 100%)",
          opacity: 0.26,
        }}
      />
      {/* L8: Half-circle bleeding off left edge */}
      <div
        className="absolute -left-28 h-[280px] w-[280px] rounded-full hidden lg:block"
        style={{
          top: "1412px",
          backgroundColor: "var(--bg-mint-tint, #D9F0E3)",
          opacity: 0.28,
        }}
      />
      {/* L9: Concentric ring pair near about cards */}
      <div
        className="absolute left-[3%] hidden xl:block"
        style={{ top: "1572px", opacity: 0.35 }}
      >
        <svg viewBox="0 0 200 200" className="h-40 w-40" fill="none">
          <circle
            cx="100"
            cy="100"
            r="44"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.6"
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.8"
          />
        </svg>
      </div>

      {/* L10: Medium sage cluster */}
      <div
        className={`absolute left-[2%] h-[220px] w-[220px] rounded-full hidden xl:block ${
          shouldAnimate(4) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "1861px",
          background:
            "radial-gradient(circle, var(--deco-sage, #83A183) 0%, rgba(131, 161, 131, 0.35) 70%, transparent 100%)",
          opacity: 0.24,
        }}
      />
      {/* L11: Short botanical sprig #2 (~200px tall) */}
      <div
        className={`absolute left-0 hidden lg:block ${
          shouldAnimate(5) ? "decor-float-slow" : ""
        }`}
        style={{ top: "2085px", opacity: 0.4 }}
      >
        <svg viewBox="0 0 65 200" fill="none" className="h-[200px] w-[65px]">
          <path
            d="M 6 194 C 18 140, 26 80, 48 10"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M 12 150 C 2 146, -1 136, 5 126 C 14 130, 17 140, 15 148 Z"
            fill="var(--deco-olive, #6F8454)"
          />
          <path
            d="M 22 102 C 34 94, 44 98, 45 108 C 34 112, 26 108, 23 103 Z"
            fill="var(--deco-sage, #83A183)"
          />
          <path
            d="M 48 10 C 40 18, 44 28, 48 32 C 54 26, 56 18, 48 10 Z"
            fill="var(--deco-forest, #254735)"
          />
        </svg>
      </div>
      {/* L12: Dark forest circle #2 (closed shape, <=90px) */}
      <div
        className="absolute left-[5%] h-[80px] w-[80px] rounded-full hidden xl:block"
        style={{
          top: "2342px",
          backgroundColor: "var(--deco-forest, #254735)",
          opacity: 0.22,
        }}
      />

      {/* L13: Large mint circle bleeding off edge */}
      <div
        className={`absolute -left-36 h-[340px] w-[340px] rounded-full hidden md:block ${
          shouldAnimate(6) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "2631px",
          background:
            "radial-gradient(circle, var(--bg-mint-tint, #D9F0E3) 0%, rgba(217, 240, 227, 0.4) 75%, transparent 100%)",
          opacity: 0.32,
        }}
      />
      {/* L14: Solid olive accent node */}
      <div
        className="absolute left-[3%] h-6 w-6 rounded-full hidden xl:block"
        style={{
          top: "2823px",
          backgroundColor: "var(--deco-olive, #6F8454)",
          opacity: 0.46,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          RIGHT GUTTER SHAPES (14 shapes)
          ══════════════════════════════════════════════════════════════ */}

      {/* R1: Strip right of hero photo - large mint circle bleeding off edge */}
      <div
        className={`absolute -right-36 h-[360px] w-[360px] rounded-full hidden md:block ${
          shouldAnimate(7) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "96px",
          background:
            "radial-gradient(circle, var(--bg-mint-tint, #D9F0E3) 0%, rgba(217, 240, 227, 0.45) 75%, transparent 100%)",
          opacity: 0.32,
        }}
      />
      {/* R2: Strip right of hero photo - concentric ring pair */}
      <div
        className="absolute right-[3%] hidden lg:block"
        style={{ top: "289px", opacity: 0.36 }}
      >
        <svg viewBox="0 0 180 180" className="h-36 w-36" fill="none">
          <circle
            cx="90"
            cy="90"
            r="42"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.6"
          />
          <circle
            cx="90"
            cy="90"
            r="76"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.8"
          />
        </svg>
      </div>
      {/* R3: Dark forest circle #1 (closed shape, <=90px) */}
      <div
        className="absolute right-[5%] h-[76px] w-[76px] rounded-full hidden xl:block"
        style={{
          top: "449px",
          backgroundColor: "var(--deco-forest, #254735)",
          opacity: 0.25,
        }}
      />
      {/* R4: Solid olive accent cluster */}
      <div
        className="absolute right-[2.5%] h-5 w-5 rounded-full hidden xl:block"
        style={{
          top: "545px",
          backgroundColor: "var(--deco-olive, #6F8454)",
          opacity: 0.48,
        }}
      />

      {/* R5: Half-circle bleeding off right edge */}
      <div
        className="absolute -right-32 h-[280px] w-[280px] rounded-full hidden md:block"
        style={{
          top: "706px",
          background:
            "radial-gradient(circle, var(--deco-sage, #83A183) 0%, rgba(131, 161, 131, 0.4) 70%, transparent 100%)",
          opacity: 0.28,
        }}
      />
      {/* R6: Short botanical sprig #3 (~250px tall) */}
      <div
        className={`absolute right-0 hidden lg:block ${
          shouldAnimate(8) ? "decor-float-slow" : ""
        }`}
        style={{ top: "898px", opacity: 0.42 }}
      >
        <svg viewBox="0 0 75 250" fill="none" className="h-[250px] w-[75px]">
          <path
            d="M 68 244 C 54 180, 42 100, 18 16"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M 60 196 C 46 190, 40 178, 48 168 C 58 174, 62 184, 61 194 Z"
            fill="var(--deco-sage, #83A183)"
          />
          <path
            d="M 50 148 C 64 140, 72 146, 72 156 C 60 160, 52 156, 51 149 Z"
            fill="var(--deco-forest, #254735)"
          />
          <path
            d="M 38 106 C 24 98, 20 86, 28 78 C 36 84, 40 96, 39 104 Z"
            fill="var(--deco-olive, #6F8454)"
          />
          <path
            d="M 18 16 C 28 24, 26 36, 20 42 C 14 34, 12 24, 18 16 Z"
            fill="var(--deco-forest, #254735)"
          />
        </svg>
      </div>

      {/* R7: Soft mint circle cluster */}
      <div
        className={`absolute right-[3%] h-[260px] w-[260px] rounded-full hidden xl:block ${
          shouldAnimate(9) ? "decor-float-slow" : ""
        }`}
        style={{
          top: "1187px",
          background:
            "radial-gradient(circle, var(--bg-mint-tint, #D9F0E3) 0%, rgba(217, 240, 227, 0.5) 75%, transparent 100%)",
          opacity: 0.3,
        }}
      />
      {/* R8: Triple concentric ring cluster */}
      <div
        className="absolute right-[2%] hidden lg:block"
        style={{ top: "1444px", opacity: 0.34 }}
      >
        <svg viewBox="0 0 240 240" className="h-48 w-48" fill="none">
          <circle
            cx="120"
            cy="120"
            r="42"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.5"
          />
          <circle
            cx="120"
            cy="120"
            r="74"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.8"
          />
          <circle
            cx="120"
            cy="120"
            r="106"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>
      </div>
      {/* R9: Solid olive accent node */}
      <div
        className="absolute right-[4%] h-6 w-6 rounded-full hidden xl:block"
        style={{
          top: "1636px",
          backgroundColor: "var(--deco-olive, #6F8454)",
          opacity: 0.48,
        }}
      />

      {/* R10: Dark forest circle #2 (closed shape, <=90px) */}
      <div
        className="absolute right-[4.5%] h-[72px] w-[72px] rounded-full hidden xl:block"
        style={{
          top: "1829px",
          backgroundColor: "var(--deco-forest, #254735)",
          opacity: 0.22,
        }}
      />
      {/* R11: Short botanical sprig #4 (~220px tall) */}
      <div
        className="absolute right-0 hidden lg:block"
        style={{ top: "2053px", opacity: 0.4 }}
      >
        <svg viewBox="0 0 70 220" fill="none" className="h-[220px] w-[70px]">
          <path
            d="M 64 214 C 50 155, 38 85, 16 12"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="2.0"
            strokeLinecap="round"
          />
          <path
            d="M 56 170 C 42 164, 38 152, 46 142 C 55 147, 58 157, 57 167 Z"
            fill="var(--deco-olive, #6F8454)"
          />
          <path
            d="M 46 120 C 58 112, 66 118, 66 128 C 55 132, 48 128, 47 122 Z"
            fill="var(--deco-sage, #83A183)"
          />
          <path
            d="M 16 12 C 24 20, 22 30, 18 36 C 12 28, 10 18, 16 12 Z"
            fill="var(--deco-forest, #254735)"
          />
        </svg>
      </div>
      {/* R12: Half-circle bleeding off right edge */}
      <div
        className="absolute -right-28 h-[280px] w-[280px] rounded-full hidden md:block"
        style={{
          top: "2310px",
          background:
            "radial-gradient(circle, var(--deco-sage, #83A183) 0%, rgba(131, 161, 131, 0.4) 70%, transparent 100%)",
          opacity: 0.27,
        }}
      />

      {/* R13: Soft mint circle cluster */}
      <div
        className="absolute -right-24 h-[260px] w-[260px] rounded-full hidden md:block"
        style={{
          top: "2631px",
          background:
            "radial-gradient(circle, var(--bg-mint-tint, #D9F0E3) 0%, rgba(217, 240, 227, 0.45) 75%, transparent 100%)",
          opacity: 0.31,
        }}
      />
      {/* R14: Concentric ring pair near footer */}
      <div
        className="absolute right-[3%] hidden lg:block"
        style={{ top: "2791px", opacity: 0.3 }}
      >
        <svg viewBox="0 0 170 170" className="h-34 w-34" fill="none">
          <circle
            cx="85"
            cy="85"
            r="40"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.5"
          />
          <circle
            cx="85"
            cy="85"
            r="72"
            stroke="var(--deco-olive, #6F8454)"
            strokeWidth="1.8"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Decor Component - Unified Page-Level Botanical Backdrop
 * Shared across ALL pages (Home, Article Hub, and sub-routes).
 * Renders ceil(pageHeight / P) tiles stacked vertically from navbar to dark footer band.
 */
export function Decor() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Initial state guarantees matched SSR and client hydration output
  const [tileCount, setTileCount] = useState(isHome ? 2 : 1);

  useEffect(() => {
    const updateTiles = () => {
      // Short article hub routes always render strictly 1 tile
      if (pathname && pathname.startsWith("/artikel")) {
        setTileCount(1);
        return;
      }
      const footer = document.getElementById("kontak");
      const lightAreaHeight = footer
        ? footer.offsetTop
        : document.documentElement.scrollHeight || document.body.scrollHeight;
      const computedCount = Math.max(1, Math.ceil(lightAreaHeight / P));
      setTileCount(computedCount);
    };

    updateTiles();

    const resizeObserver = new ResizeObserver(() => {
      updateTiles();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }
    window.addEventListener("resize", updateTiles);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateTiles);
    };
  }, [pathname]);

  return (
    <div
      data-testid="site-decor"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none w-full"
    >
      {Array.from({ length: tileCount }).map((_, index) => (
        <DecorTile key={index} tileIndex={index} />
      ))}
    </div>
  );
}
