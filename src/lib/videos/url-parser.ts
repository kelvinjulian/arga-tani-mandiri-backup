export type VideoPlatform = "youtube" | "tiktok";
export type VideoStatus = "draft" | "published";
export type TikTokPlayMode = "embed" | "link";

export const MAX_VIDEOS_TOTAL = 300;
export const MAX_BULK_URLS = 50;

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const TIKTOK_DIGITS_REGEX = /^\d{8,25}$/;
const SHORT_CODE_REGEX = /^[A-Za-z0-9_-]+$/;
const IFRAME_SRC_REGEX =
  /^<iframe\b[^>]{0,2000}\bsrc\s*=\s*(?:"([^"]{1,1000})"|'([^']{1,1000})')/i;

const YOUTUBE_MAIN_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
]);

const YOUTUBE_EMBED_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "www.youtube-nocookie.com",
]);

const YOUTUBE_NOCOOKIE_HOSTS = new Set([
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const TIKTOK_MAIN_HOSTS = new Set([
  "tiktok.com",
  "www.tiktok.com",
  "m.tiktok.com",
]);

const TIKTOK_SHORT_HOSTS = new Set(["vm.tiktok.com", "vt.tiktok.com"]);

export type ParseVideoUrlResult =
  | {
      ok: true;
      platform: VideoPlatform;
      videoId: string | null;
      normalizedUrl: string;
      suggestedMode: TikTokPlayMode;
    }
  | {
      ok: false;
      error: string;
    };

function parseIframeSnippet(raw: string): ParseVideoUrlResult {
  if (raw.length > 2500) {
    return {
      ok: false,
      error: "Kode embed iframe terlalu panjang.",
    };
  }

  const match = raw.match(IFRAME_SRC_REGEX);
  const extractedSrc = (match?.[1] ?? match?.[2] ?? "").trim();
  if (!extractedSrc) {
    return {
      ok: false,
      error: "Atribut src pada kode embed iframe tidak ditemukan.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(extractedSrc);
  } catch {
    return {
      ok: false,
      error: "URL src pada kode embed iframe tidak valid.",
    };
  }

  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      error: "URL src pada kode embed iframe harus menggunakan https://.",
    };
  }

  if (parsed.username || parsed.password) {
    return {
      ok: false,
      error: "URL src pada kode embed tidak boleh mengandung kredensial.",
    };
  }

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  if (YOUTUBE_EMBED_HOSTS.has(host)) {
    const id = segments[1] ?? "";
    if (segments[0] === "embed" && YOUTUBE_ID_REGEX.test(id)) {
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
        suggestedMode: "link",
      };
    }
    return {
      ok: false,
      error: "URL src iframe YouTube harus berbentuk /embed/<ID> yang valid.",
    };
  }

  if (host === "www.tiktok.com") {
    // https://www.tiktok.com/player/v1/<digits>
    if (
      segments[0] === "player" &&
      segments[1] === "v1" &&
      TIKTOK_DIGITS_REGEX.test(segments[2] ?? "")
    ) {
      const id = segments[2];
      return {
        ok: true,
        platform: "tiktok",
        videoId: id,
        normalizedUrl: `https://www.tiktok.com/player/v1/${id}`,
        suggestedMode: "embed",
      };
    }

    // https://www.tiktok.com/@user/video/<digits>
    if (
      segments.length >= 3 &&
      segments[0].startsWith("@") &&
      segments[0].length > 1 &&
      segments[1] === "video" &&
      TIKTOK_DIGITS_REGEX.test(segments[2] ?? "")
    ) {
      const user = segments[0];
      const id = segments[2];
      return {
        ok: true,
        platform: "tiktok",
        videoId: id,
        normalizedUrl: `https://www.tiktok.com/${user}/video/${id}`,
        suggestedMode: "embed",
      };
    }

    return {
      ok: false,
      error:
        "URL src iframe TikTok harus berbentuk /player/v1/<id> atau /@user/video/<id>.",
    };
  }

  return {
    ok: false,
    error:
      "Host src pada kode embed iframe harus www.youtube.com, youtube.com, www.youtube-nocookie.com, atau www.tiktok.com.",
  };
}

export function parseVideoUrl(rawInput: string): ParseVideoUrlResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { ok: false, error: "URL video wajib diisi." };
  }

  if (/^<iframe\b/i.test(trimmed)) {
    return parseIframeSnippet(trimmed);
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Format URL tidak valid." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "URL video harus menggunakan protokol https://." };
  }

  if (parsed.username || parsed.password) {
    return {
      ok: false,
      error: "URL tidak boleh mengandung kredensial (userinfo).",
    };
  }

  const host = parsed.hostname.toLowerCase();
  const segments = parsed.pathname.split("/").filter(Boolean);

  // YouTube short domain: youtu.be/<ID>
  if (host === "youtu.be") {
    const id = segments[0] ?? "";
    if (!YOUTUBE_ID_REGEX.test(id)) {
      return {
        ok: false,
        error: "ID video YouTube pada tautan youtu.be tidak valid.",
      };
    }
    return {
      ok: true,
      platform: "youtube",
      videoId: id,
      normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
      suggestedMode: "link",
    };
  }

  // YouTube main/mobile hosts
  if (YOUTUBE_MAIN_HOSTS.has(host)) {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v")?.trim() ?? "";
      if (!YOUTUBE_ID_REGEX.test(id)) {
        return {
          ok: false,
          error:
            "Parameter ?v= pada URL YouTube harus berisi 11 karakter ID yang valid.",
        };
      }
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
        suggestedMode: "link",
      };
    }

    if (segments[0] === "shorts") {
      const id = segments[1] ?? "";
      if (!YOUTUBE_ID_REGEX.test(id)) {
        return {
          ok: false,
          error: "ID video YouTube Shorts tidak valid.",
        };
      }
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/shorts/${id}`,
        suggestedMode: "link",
      };
    }

    if (segments[0] === "embed") {
      const id = segments[1] ?? "";
      if (!YOUTUBE_ID_REGEX.test(id)) {
        return {
          ok: false,
          error: "ID video YouTube embed tidak valid.",
        };
      }
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
        suggestedMode: "link",
      };
    }

    return {
      ok: false,
      error:
        "Gunakan tautan video YouTube (/watch?v=..., /shorts/..., /embed/..., atau youtu.be/...).",
    };
  }

  // YouTube nocookie embed URL: youtube-nocookie.com/embed/<ID>
  if (YOUTUBE_NOCOOKIE_HOSTS.has(host)) {
    const id = segments[1] ?? "";
    if (segments[0] === "embed" && YOUTUBE_ID_REGEX.test(id)) {
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
        suggestedMode: "link",
      };
    }
    return {
      ok: false,
      error: "URL youtube-nocookie.com harus berbentuk /embed/<ID> yang valid.",
    };
  }

  // TikTok short domains: vm.tiktok.com/<code>, vt.tiktok.com/<code>
  if (TIKTOK_SHORT_HOSTS.has(host)) {
    const code = segments[0] ?? "";
    if (!code || !SHORT_CODE_REGEX.test(code)) {
      return {
        ok: false,
        error: "Kode tautan pendek TikTok tidak valid.",
      };
    }
    return {
      ok: true,
      platform: "tiktok",
      videoId: null,
      normalizedUrl: `https://${host}/${code}`,
      suggestedMode: "link",
    };
  }

  // TikTok main/mobile hosts
  if (TIKTOK_MAIN_HOSTS.has(host)) {
    // tiktok.com/t/<code>
    if (segments[0] === "t") {
      const code = segments[1] ?? "";
      if (!code || !SHORT_CODE_REGEX.test(code)) {
        return {
          ok: false,
          error: "Kode tautan TikTok /t/ tidak valid.",
        };
      }
      return {
        ok: true,
        platform: "tiktok",
        videoId: null,
        normalizedUrl: `https://www.tiktok.com/t/${code}`,
        suggestedMode: "link",
      };
    }

    // www.tiktok.com/player/v1/<digits>
    if (
      segments[0] === "player" &&
      segments[1] === "v1" &&
      TIKTOK_DIGITS_REGEX.test(segments[2] ?? "")
    ) {
      const id = segments[2];
      return {
        ok: true,
        platform: "tiktok",
        videoId: id,
        normalizedUrl: `https://www.tiktok.com/player/v1/${id}`,
        suggestedMode: "embed",
      };
    }

    // tiktok.com/@user/video/<digits>
    if (
      segments.length >= 3 &&
      segments[0].startsWith("@") &&
      segments[0].length > 1 &&
      segments[1] === "video" &&
      TIKTOK_DIGITS_REGEX.test(segments[2] ?? "")
    ) {
      const user = segments[0];
      const videoId = segments[2];
      return {
        ok: true,
        platform: "tiktok",
        videoId,
        normalizedUrl: `https://www.tiktok.com/${user}/video/${videoId}`,
        suggestedMode: "link",
      };
    }

    return {
      ok: false,
      error:
        "Gunakan tautan video TikTok (/@username/video/123..., /player/v1/123..., /t/..., vm.tiktok.com/..., atau vt.tiktok.com/...).",
    };
  }

  return {
    ok: false,
    error:
      "Domain tidak didukung. Hanya tautan YouTube dan TikTok yang diizinkan.",
  };
}

export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getEffectiveVideoThumbnail(
  platform: VideoPlatform,
  videoId: string | null,
  thumbnailSrc: string | null | undefined
): string | null {
  const custom = typeof thumbnailSrc === "string" ? thumbnailSrc.trim() : "";
  if (custom) return custom;
  if (platform === "youtube" && videoId) {
    return getYouTubeThumbnailUrl(videoId);
  }
  return null;
}
