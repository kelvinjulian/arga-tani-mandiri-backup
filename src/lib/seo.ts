import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://argatanimandiri.com";

export function getSiteUrl(): string {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) {
    return DEFAULT_SITE_URL;
  }
  return raw.replace(/\/+$/, "");
}

export function isSiteIndexingEnabled(): boolean {
  return process.env.SITE_INDEXING?.trim().toLowerCase() === "on";
}

export function getRobotsMetadata(forceNoIndex = false): Metadata["robots"] {
  const allowIndex = !forceNoIndex && isSiteIndexingEnabled();
  return {
    index: allowIndex,
    follow: allowIndex,
    googleBot: {
      index: allowIndex,
      follow: allowIndex,
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

