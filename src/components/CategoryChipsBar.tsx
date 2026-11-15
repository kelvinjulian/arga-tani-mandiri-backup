"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FilterChipsConfig } from "@/lib/site-content/filter-chips";

export interface CategoryChipItem {
  id: string;
  label: string;
  count?: number;
}

interface CategoryChipsBarProps {
  items: CategoryChipItem[];
  activeId: string;
  allId?: string;
  totalCount?: number;
  onSelect: (id: string) => void;
  config: FilterChipsConfig;
  variant?: "hub" | "dock";
  ariaLabel?: string;
}

export function CategoryChipsBar({
  items,
  activeId,
  allId = "all",
  totalCount,
  onSelect,
  config,
  variant = "hub",
  ariaLabel = "Filter kategori artikel",
}: CategoryChipsBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const visibleLimit = Math.max(3, Math.min(12, config.maxVisibleChips));
  const shouldUseMenu =
    config.overflowMode === "menu" && items.length > visibleLimit;
  const visibleItems = shouldUseMenu ? items.slice(0, visibleLimit) : items;
  const overflowItems = shouldUseMenu ? items.slice(visibleLimit) : [];
  const activeInOverflow = overflowItems.some((item) => item.id === activeId);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const formatLabel = (label: string, count?: number) => {
    if (!config.showArticleCounts || typeof count !== "number") {
      return label;
    }
    return `${label} (${count})`;
  };

  const chipClass = (isActive: boolean) => {
    if (variant === "dock") {
      return `shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D] ${
        isActive
          ? "bg-[#0E2F1D] text-white shadow-sm"
          : "text-[#2C4235] hover:bg-white hover:text-[#0E2F1D]"
      }`;
    }
    return `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2F1D] ${
      isActive
        ? "bg-[#0E2F1D] text-white shadow-sm"
        : "border border-[#D5E4DA] bg-white text-[#234232] hover:border-[#0E2F1D] hover:bg-[#EAF3EE]"
    }`;
  };

  const handleMenuKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % overflowItems.length;
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + overflowItems.length) % overflowItems.length;
      itemRefs.current[prev]?.focus();
    }
  };

  const wrapperBase =
    variant === "dock"
      ? "rounded-xl bg-[#F0F6F2] p-1"
      : "";

  return (
    <div ref={containerRef} className={`relative ${wrapperBase}`}>
      {/* Mobile (<640px): always single-line horizontal scroll with right fade */}
      <div className="relative sm:hidden">
        <div
          role="group"
          aria-label={ariaLabel}
          className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 pr-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => onSelect(allId)}
            aria-pressed={activeId === allId}
            className={chipClass(activeId === allId)}
          >
            {formatLabel(config.allTopicsLabel, totalCount)}
          </button>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-pressed={activeId === item.id}
              className={chipClass(activeId === item.id)}
            >
              {formatLabel(item.label, item.count)}
            </button>
          ))}
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${
            variant === "dock"
              ? "from-[#F0F6F2] to-transparent"
              : "from-[#FAFBF9] to-transparent"
          }`}
        />
      </div>

      {/* Tablet/Desktop (>=640px): scroll mode or menu mode */}
      {config.overflowMode === "scroll" ? (
        <div className="relative hidden sm:block">
          <div
            role="group"
            aria-label={ariaLabel}
            className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 pr-8 [scrollbar-width:thin]"
          >
            <button
              type="button"
              onClick={() => onSelect(allId)}
              aria-pressed={activeId === allId}
              className={chipClass(activeId === allId)}
            >
              {formatLabel(config.allTopicsLabel, totalCount)}
            </button>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={activeId === item.id}
                className={chipClass(activeId === item.id)}
              >
                {formatLabel(item.label, item.count)}
              </button>
            ))}
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l ${
              variant === "dock"
                ? "from-[#F0F6F2] to-transparent"
                : "from-[#FAFBF9] to-transparent"
            }`}
          />
        </div>
      ) : (
        <div
          role="group"
          aria-label={ariaLabel}
          className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-1.5"
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onSelect(allId);
            }}
            aria-pressed={activeId === allId}
            className={chipClass(activeId === allId)}
          >
            {formatLabel(config.allTopicsLabel, totalCount)}
          </button>
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onSelect(item.id);
              }}
              aria-pressed={activeId === item.id}
              className={chipClass(activeId === item.id)}
            >
              {formatLabel(item.label, item.count)}
            </button>
          ))}

          {overflowItems.length > 0 && (
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 ${chipClass(
                  activeInOverflow
                )}`}
              >
                <span>
                  {config.moreLabel} ({overflowItems.length})
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Kategori artikel lainnya"
                  className="absolute right-0 z-30 mt-2 min-w-[220px] max-w-[280px] rounded-xl border border-[#DCE8DF] bg-white p-1.5 shadow-lg"
                >
                  {overflowItems.map((item, idx) => {
                    const isItemActive = activeId === item.id;
                    return (
                      <button
                        key={item.id}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelect(item.id);
                          setMenuOpen(false);
                        }}
                        onKeyDown={(e) => handleMenuKeyDown(e, idx)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0E2F1D] ${
                          isItemActive
                            ? "bg-[#0E2F1D] text-white"
                            : "text-[#143D29] hover:bg-[#EAF3EE]"
                        }`}
                      >
                        <span className="truncate">
                          {formatLabel(item.label, item.count)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
