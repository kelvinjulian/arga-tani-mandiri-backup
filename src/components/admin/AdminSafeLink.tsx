"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

declare global {
  interface Window {
    __adminIsDirty?: boolean;
  }
}

export function AdminSafeLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    if (typeof window !== "undefined" && window.__adminIsDirty) {
      const confirmed = window.confirm(
        "Perubahan yang belum disimpan akan hilang. Tetap tinggalkan halaman ini?"
      );
      if (!confirmed) {
        e.preventDefault();
      }
    }
  };

  return <Link {...props} onClick={handleClick} />;
}
