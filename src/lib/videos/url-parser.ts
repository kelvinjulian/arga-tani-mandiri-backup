export type VideoPlatform = "youtube" | "tiktok";
export type VideoStatus = "draft" | "published";

export const MAX_VIDEOS_TOTAL = 300;
export const MAX_BULK_URLS = 50;

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;
const TIKTOK_DIGITS_REGEX = /^\d+$/;
const SHORT_CODE_REGEX = /^[A-Za-z0-9_-]+$/;

const YOUTUBE_MAIN_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
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
    }
  | {
      ok: false;
      error: string;
    };

export function parseVideoUrl(rawInput: string): ParseVideoUrlResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { ok: false, error: "URL video wajib diisi." };
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
    };
  }

  // YouTube main/mobile hosts
  if (YOUTUBE_MAIN_HOSTS.has(host)) {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v")?.trim() ?? "";
      if (!YOUTUBE_ID_REGEX.test(id)) {
        return {
          ok: false,
          error: "Parameter ?v= pada URL YouTube harus berisi 11 karakter ID yang valid.",
        };
      }
      return {
        ok: true,
        platform: "youtube",
        videoId: id,
        normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
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
      };
    }

    return {
      ok: false,
      error:
        "Gunakan tautan video YouTube (/watch?v=..., /shorts/..., /embed/..., atau youtu.be/...).",
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
      };
    }

    // tiktok.com/@user/video/<digits>
    if (
      segments.length >= 3 &&
      segments[0].startsWith("@") &&
      segments[0].length > 1 &&
      segments[1] === "video" &&
      TIKTOK_DIGITS_REGEX.test(segments[2])
    ) {
      const user = segments[0];
      const videoId = segments[2];
      return {
        ok: true,
        platform: "tiktok",
        videoId,
        normalizedUrl: `https://www.tiktok.com/${user}/video/${videoId}`,
      };
    }

    return {
      ok: false,
      error:
        "Gunakan tautan video TikTok (/@username/video/123..., /t/..., vm.tiktok.com/..., atau vt.tiktok.com/...).",
    };
  }

  return {
    ok: false,
    error: "Domain tidak didukung. Hanya tautan YouTube dan TikTok yang diizinkan.",
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

/*
 * URL parser sanity cases (12+ valid & malicious cases):
 * 1.  https://www.youtube.com/watch?v=dQw4w9WgXcQ -> ok, youtube, id=dQw4w9WgXcQ
 * 2.  https://youtu.be/dQw4w9WgXcQ -> ok, youtube, id=dQw4w9WgXcQ, normalized watch?v=
 * 3.  https://m.youtube.com/shorts/dQw4w9WgXcQ -> ok, youtube, id=dQw4w9WgXcQ, normalized /shorts/
 * 4.  https://youtube.com/embed/dQw4w9WgXcQ -> ok, youtube, id=dQw4w9WgXcQ, normalized watch?v=
 * 5.  https://www.tiktok.com/@petani.id/video/7345678901234567890 -> ok, tiktok, id=7345678901234567890
 * 6.  https://vm.tiktok.com/ZSYabc123/ -> ok, tiktok, id=null
 * 7.  https://vt.tiktok.com/ZSYabc123/ -> ok, tiktok, id=null
 * 8.  https://www.tiktok.com/t/ZSYabc123/ -> ok, tiktok, id=null
 * 9.  http://www.youtube.com/watch?v=dQw4w9WgXcQ -> error (http not https)
 * 10. javascript:alert(1) -> error (protocol)
 * 11. https://youtube.com@evil.com/watch?v=dQw4w9WgXcQ -> error (userinfo trick)
 * 12. https://notyoutube.com/watch?v=dQw4w9WgXcQ -> error (lookalike host)
 * 13. https://www.youtube.com/watch?v=short -> error (invalid 11-char ID)
 * 14. https://www.tiktok.com/@user/video/notdigits -> error (non-digit TikTok ID)
 */
