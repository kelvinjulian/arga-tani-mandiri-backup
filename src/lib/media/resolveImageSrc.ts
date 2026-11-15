const SUPABASE_MEDIA_PREFIX = "/storage/v1/object/public/media/";

function getAllowedSupabaseHost(): { hostname: string; port: string } | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return {
      hostname: parsed.hostname,
      port: parsed.port,
    };
  } catch {
    return null;
  }
}

export function isAllowedImageSrc(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed.length > 1;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;

    const allowedHost = getAllowedSupabaseHost();
    if (!allowedHost) return false;

    if (parsed.hostname !== allowedHost.hostname) return false;
    if (parsed.port !== allowedHost.port) return false;

    return (
      parsed.pathname.startsWith(SUPABASE_MEDIA_PREFIX) &&
      parsed.pathname.length > SUPABASE_MEDIA_PREFIX.length
    );
  } catch {
    return false;
  }
}

export function resolveImageSrc(rawSrc: unknown, fallback: string): string;
export function resolveImageSrc(
  rawSrc: unknown,
  fallback: string | null
): string | null;
export function resolveImageSrc(
  rawSrc: unknown,
  fallback: string | null
): string | null {
  if (rawSrc === null || rawSrc === undefined) {
    return fallback;
  }

  if (typeof rawSrc !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[resolveImageSrc] Rejected non-string image src (${typeof rawSrc}); using fallback.`
      );
    }
    return fallback;
  }

  const trimmed = rawSrc.trim();
  if (!trimmed) {
    return fallback;
  }

  if (isAllowedImageSrc(trimmed)) {
    return trimmed;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[resolveImageSrc] Rejected disallowed image src "${trimmed}"; using fallback.`
    );
  }
  return fallback;
}
