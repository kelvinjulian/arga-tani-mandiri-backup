"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";

export interface ResilientImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string | null;
}

export function ResilientImage({
  src,
  fallbackSrc = null,
  alt,
  className,
  onError,
  ...rest
}: ResilientImageProps) {
  const safeFallback = fallbackSrc
    ? resolveImageSrc(fallbackSrc, null)
    : null;
  const primarySrc = resolveImageSrc(src, safeFallback);

  const [failedUrls, setFailedUrls] = useState<string[]>([]);

  const activeSrc =
    primarySrc && !failedUrls.includes(primarySrc)
      ? primarySrc
      : safeFallback && !failedUrls.includes(safeFallback)
        ? safeFallback
        : null;

  if (!activeSrc) {
    return null;
  }

  return (
    <Image
      {...rest}
      src={activeSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailedUrls((prev) =>
          prev.includes(activeSrc) ? prev : [...prev, activeSrc]
        );
        onError?.(event);
      }}
    />
  );
}
