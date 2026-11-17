import { isValidImageSrc } from "@/lib/site-content/validation";
import {
  parseVideoUrl,
  type TikTokPlayMode,
  type VideoPlatform,
  type VideoStatus,
} from "@/lib/videos/url-parser";

export interface VideoEditorPayload {
  id?: string;
  originalUpdatedAt?: string | null;
  url: string;
  title: string;
  description: string;
  duration: string;
  thumbnail_src: string;
  status: VideoStatus;
  is_featured: boolean;
  show_on_home: boolean;
  play_mode?: TikTokPlayMode;
}

export type VideoFieldErrors = Partial<
  Record<
    | "url"
    | "title"
    | "description"
    | "duration"
    | "thumbnail_src"
    | "status"
    | "play_mode",
    string
  >
>;

export interface ValidatedVideoData {
  platform: VideoPlatform;
  url: string;
  video_id: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  thumbnail_src: string | null;
  status: VideoStatus;
  is_featured: boolean;
  show_on_home: boolean;
  play_mode: TikTokPlayMode;
}

export function validateVideoPayload(payload: VideoEditorPayload):
  | { ok: true; data: ValidatedVideoData }
  | { ok: false; fieldErrors: VideoFieldErrors; formError: string } {
  const fieldErrors: VideoFieldErrors = {};

  const parsedUrl = parseVideoUrl(payload.url ?? "");
  if (!parsedUrl.ok) {
    fieldErrors.url = parsedUrl.error;
  }

  const title = (payload.title ?? "").trim();
  if (!title) {
    fieldErrors.title = "Judul video wajib diisi.";
  } else if (title.length < 2) {
    fieldErrors.title = "Judul video minimal 2 karakter.";
  } else if (title.length > 120) {
    fieldErrors.title = "Judul video maksimal 120 karakter.";
  }

  const description = (payload.description ?? "").trim();
  if (description.length > 300) {
    fieldErrors.description = "Deskripsi video maksimal 300 karakter.";
  }

  const duration = (payload.duration ?? "").trim();
  if (duration.length > 10) {
    fieldErrors.duration = "Durasi maksimal 10 karakter (mis. 03:45).";
  }

  const thumbnailSrc = (payload.thumbnail_src ?? "").trim();
  if (thumbnailSrc.length > 0) {
    if (thumbnailSrc.length > 500) {
      fieldErrors.thumbnail_src = "URL thumbnail maksimal 500 karakter.";
    } else if (!isValidImageSrc(thumbnailSrc)) {
      fieldErrors.thumbnail_src =
        "URL thumbnail harus diawali / atau https://.";
    }
  }

  if (payload.status !== "draft" && payload.status !== "published") {
    fieldErrors.status = "Status video tidak valid.";
  }

  let playMode: TikTokPlayMode = "link";
  if (parsedUrl.ok && parsedUrl.platform === "tiktok") {
    const requestedMode = payload.play_mode ?? parsedUrl.suggestedMode;
    if (requestedMode !== "embed" && requestedMode !== "link") {
      fieldErrors.play_mode = "Cara memutar TikTok tidak valid.";
    } else if (requestedMode === "embed" && !parsedUrl.videoId) {
      fieldErrors.play_mode =
        "Tautan pendek TikTok tidak memiliki ID video sehingga hanya bisa dibuka di TikTok.";
    } else {
      playMode = requestedMode;
    }
  }

  if (Object.keys(fieldErrors).length > 0 || !parsedUrl.ok) {
    return {
      ok: false,
      fieldErrors,
      formError: "Periksa kembali isian video yang bertanda merah.",
    };
  }

  return {
    ok: true,
    data: {
      platform: parsedUrl.platform,
      url: parsedUrl.normalizedUrl,
      video_id: parsedUrl.videoId,
      title,
      description: description || null,
      duration: duration || null,
      thumbnail_src: thumbnailSrc || null,
      status: payload.status,
      is_featured: Boolean(payload.is_featured),
      show_on_home: Boolean(payload.show_on_home),
      play_mode: playMode,
    },
  };
}
