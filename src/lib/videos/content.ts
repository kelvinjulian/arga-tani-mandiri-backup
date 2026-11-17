import { getSupabaseClient } from "@/lib/supabase";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";
import {
  getYouTubeThumbnailUrl,
  parseVideoUrl,
  type TikTokPlayMode,
  type VideoPlatform,
} from "@/lib/videos/url-parser";

export interface PublicVideoItem {
  id: string;
  platform: VideoPlatform;
  url: string;
  videoId: string | null;
  title: string;
  description: string | null;
  thumbnailSrc: string | null;
  duration: string | null;
  isFeatured: boolean;
  showOnHome: boolean;
  playMode: TikTokPlayMode;
  publishedAt: string | null;
}

interface RawVideoRow {
  id: unknown;
  platform: unknown;
  url: unknown;
  video_id: unknown;
  title: unknown;
  description: unknown;
  thumbnail_src: unknown;
  duration: unknown;
  is_featured: unknown;
  show_on_home: unknown;
  play_mode?: unknown;
  published_at: unknown;
}

function warnDev(message: string, error?: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[videos] ${message}`, error ?? "");
  }
}

function mapAndValidateVideoRow(row: RawVideoRow): PublicVideoItem | null {
  if (typeof row.id !== "string" || !row.id) return null;
  if (typeof row.url !== "string" || !row.url.trim()) return null;

  const parsed = parseVideoUrl(row.url);
  if (!parsed.ok) {
    warnDev(`Melewati baris video tidak valid (${row.id}): ${parsed.error}`);
    return null;
  }

  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (title.length < 2) {
    warnDev(`Melewati baris video tanpa judul valid (${row.id}).`);
    return null;
  }

  const customThumb = resolveImageSrc(row.thumbnail_src, null);
  const autoThumb =
    parsed.platform === "youtube" && parsed.videoId
      ? getYouTubeThumbnailUrl(parsed.videoId)
      : null;

  const rawPlayMode =
    parsed.platform === "tiktok" &&
    parsed.videoId &&
    row.play_mode === "embed"
      ? "embed"
      : "link";

  return {
    id: row.id,
    platform: parsed.platform,
    url: parsed.normalizedUrl,
    videoId: parsed.videoId,
    title: title.slice(0, 120),
    description:
      typeof row.description === "string" && row.description.trim()
        ? row.description.trim().slice(0, 300)
        : null,
    thumbnailSrc: customThumb ?? autoThumb,
    duration:
      typeof row.duration === "string" && row.duration.trim()
        ? row.duration.trim().slice(0, 10)
        : null,
    isFeatured: Boolean(row.is_featured),
    showOnHome: Boolean(row.show_on_home),
    playMode: rawPlayMode,
    publishedAt:
      typeof row.published_at === "string" ? row.published_at : null,
  };
}

export async function getHomeVideos(limit: number): Promise<PublicVideoItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const safeLimit = Math.min(12, Math.max(3, Math.trunc(limit) || 5));

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("status", "published")
      .eq("show_on_home", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(safeLimit);

    if (error) {
      warnDev("Gagal mengambil video beranda dari Supabase.", error);
      return [];
    }

    return ((data ?? []) as RawVideoRow[])
      .map(mapAndValidateVideoRow)
      .filter((v): v is PublicVideoItem => v !== null);
  } catch (err) {
    warnDev("Kesalahan saat query video beranda.", err);
    return [];
  }
}

export interface VideoCatalogResult {
  items: PublicVideoItem[];
  totalCount: number;
  featuredVideo: PublicVideoItem | null;
  hasAnyPublished: boolean;
  counts: {
    all: number;
    youtube: number;
    tiktok: number;
  };
}

export async function getVideoCatalog(params: {
  platform?: VideoPlatform;
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<VideoCatalogResult> {
  const emptyResult: VideoCatalogResult = {
    items: [],
    totalCount: 0,
    featuredVideo: null,
    hasAnyPublished: false,
    counts: { all: 0, youtube: 0, tiktok: 0 },
  };

  const supabase = getSupabaseClient();
  if (!supabase) return emptyResult;

  const pageSize = Math.min(24, Math.max(1, params.pageSize ?? 12));
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = (params.q ?? "").trim();

  try {
    let query = supabase
      .from("videos")
      .select("*", { count: "exact" })
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (params.platform) {
      query = query.eq("platform", params.platform);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const [
      listRes,
      allCountRes,
      ytCountRes,
      ttCountRes,
    ] = await Promise.all([
      query.range(from, to),
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("platform", "youtube"),
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .eq("platform", "tiktok"),
    ]);

    if (listRes.error) {
      warnDev("Gagal mengambil katalog video dari Supabase.", listRes.error);
      return emptyResult;
    }

    const items = ((listRes.data ?? []) as RawVideoRow[])
      .map(mapAndValidateVideoRow)
      .filter((v): v is PublicVideoItem => v !== null);

    const allCount = allCountRes.count ?? 0;
    const ytCount = ytCountRes.count ?? 0;
    const ttCount = ttCountRes.count ?? 0;

    const showFeatured =
      page === 1 &&
      !params.platform &&
      !q &&
      items.length > 0 &&
      items[0].isFeatured;

    return {
      items,
      totalCount: listRes.count ?? items.length,
      featuredVideo: showFeatured ? items[0] : null,
      hasAnyPublished: allCount > 0,
      counts: {
        all: allCount,
        youtube: ytCount,
        tiktok: ttCount,
      },
    };
  } catch (err) {
    warnDev("Kesalahan saat query katalog video.", err);
    return emptyResult;
  }
}

export async function hasPublishedVideos(): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { count, error } = await supabase
      .from("videos")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    if (error) return false;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}
