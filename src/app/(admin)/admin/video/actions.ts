"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/lib/supabase/admin";
import { isValidUuid } from "@/lib/articles/admin-validation";
import {
  MAX_BULK_URLS,
  MAX_VIDEOS_TOTAL,
  parseVideoUrl,
  type TikTokPlayMode,
} from "@/lib/videos/url-parser";
import {
  validateVideoPayload,
  type VideoEditorPayload,
  type VideoFieldErrors,
} from "@/lib/videos/validation";

export interface SaveVideoResult {
  ok: boolean;
  id?: string;
  updatedAt?: string;
  duplicateVideoId?: string;
  fieldErrors?: VideoFieldErrors;
  formError?: string;
  concurrencyError?: string;
}

export interface BulkVideoInputItem {
  url: string;
  title: string;
  play_mode?: TikTokPlayMode;
}

export interface BulkInsertVideosResult {
  ok: boolean;
  insertedCount: number;
  skippedDuplicates: number;
  invalidCount: number;
  formError?: string;
}

export interface VideoActionResult {
  ok: boolean;
  error?: string;
}

function revalidateVideoPaths() {
  try {
    revalidatePath("/");
    revalidatePath("/video");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin/video");
  } catch {
    // Guarded so revalidating not-yet-created public /video route never throws
  }
}

export async function saveVideoAction(
  payload: VideoEditorPayload
): Promise<SaveVideoResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, formError: auth.error };
  }
  const { supabase } = auth;

  const isEdit = Boolean(payload.id);
  if (isEdit && (!payload.id || !isValidUuid(payload.id))) {
    return { ok: false, formError: "ID video tidak valid." };
  }

  if (isEdit && !payload.originalUpdatedAt) {
    return {
      ok: false,
      formError:
        "Penanda versi video tidak ditemukan. Muat ulang halaman sebelum menyimpan.",
    };
  }

  const validated = validateVideoPayload(payload);
  if (!validated.ok) {
    return {
      ok: false,
      fieldErrors: validated.fieldErrors,
      formError: validated.formError,
    };
  }

  const data = validated.data;

  // Duplicate check on (platform, video_id) when video_id is available
  if (data.video_id) {
    let dupQuery = supabase
      .from("videos")
      .select("id")
      .eq("platform", data.platform)
      .eq("video_id", data.video_id)
      .limit(1);
    if (isEdit && payload.id) {
      dupQuery = dupQuery.neq("id", payload.id);
    }
    const { data: dupRows, error: dupError } = await dupQuery;
    if (dupError) {
      return {
        ok: false,
        formError: "Gagal memeriksa duplikasi video di database.",
      };
    }
    if (dupRows && dupRows.length > 0) {
      return {
        ok: false,
        duplicateVideoId: dupRows[0].id as string,
        formError: "Video ini sudah ada.",
      };
    }
  }

  if (isEdit && payload.id) {
    const { data: existing, error: fetchError } = await supabase
      .from("videos")
      .select("id, updated_at, published_at")
      .eq("id", payload.id)
      .maybeSingle();

    if (fetchError || !existing) {
      return { ok: false, formError: "Video tidak ditemukan di database." };
    }

    if (existing.updated_at !== payload.originalUpdatedAt) {
      return {
        ok: false,
        concurrencyError:
          "Video ini sudah diubah di tab atau perangkat lain. Muat ulang halaman untuk melihat data terbaru.",
      };
    }

    const publishedAt =
      data.status === "published"
        ? (existing.published_at ?? new Date().toISOString())
        : existing.published_at;

    const updateFields = {
      platform: data.platform,
      url: data.url,
      video_id: data.video_id,
      title: data.title,
      description: data.description,
      duration: data.duration,
      thumbnail_src: data.thumbnail_src,
      status: data.status,
      is_featured: data.is_featured,
      show_on_home: data.show_on_home,
      published_at: publishedAt,
    };

    let { data: updatedRows, error: updateError } = await supabase
      .from("videos")
      .update({ ...updateFields, play_mode: data.play_mode })
      .eq("id", payload.id)
      .eq("updated_at", payload.originalUpdatedAt)
      .select("id, updated_at");

    if (
      updateError &&
      (updateError.code === "42703" || updateError.code === "PGRST204")
    ) {
      const retry = await supabase
        .from("videos")
        .update(updateFields)
        .eq("id", payload.id)
        .eq("updated_at", payload.originalUpdatedAt)
        .select("id, updated_at");
      updatedRows = retry.data;
      updateError = retry.error;
    }

    if (updateError) {
      if (updateError.code === "23505") {
        return { ok: false, formError: "Video ini sudah ada." };
      }
      return { ok: false, formError: "Gagal menyimpan perubahan video." };
    }

    if (!updatedRows || updatedRows.length === 0) {
      return {
        ok: false,
        concurrencyError:
          "Video ini sudah diubah di tab atau perangkat lain. Muat ulang halaman.",
      };
    }

    if (data.is_featured) {
      await supabase
        .from("videos")
        .update({ is_featured: false })
        .eq("is_featured", true)
        .neq("id", payload.id);
    }

    revalidateVideoPaths();
    return {
      ok: true,
      id: updatedRows[0].id as string,
      updatedAt: updatedRows[0].updated_at as string,
    };
  }

  // Create flow: enforce max 300 videos total
  const { count, error: countError } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return { ok: false, formError: "Gagal memeriksa jumlah video saat ini." };
  }

  if ((count ?? 0) >= MAX_VIDEOS_TOTAL) {
    return {
      ok: false,
      formError: `Batas maksimal ${MAX_VIDEOS_TOTAL} video telah tercapai. Hapus video lama terlebih dahulu.`,
    };
  }

  const { data: maxOrderRow } = await supabase
    .from("videos")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextSortOrder =
    typeof maxOrderRow?.sort_order === "number"
      ? maxOrderRow.sort_order + 1
      : 0;

  const insertFields = {
    platform: data.platform,
    url: data.url,
    video_id: data.video_id,
    title: data.title,
    description: data.description,
    duration: data.duration,
    thumbnail_src: data.thumbnail_src,
    status: data.status,
    is_featured: data.is_featured,
    show_on_home: data.show_on_home,
    sort_order: nextSortOrder,
    published_at:
      data.status === "published" ? new Date().toISOString() : null,
  };

  let { data: insertedRows, error: insertError } = await supabase
    .from("videos")
    .insert({ ...insertFields, play_mode: data.play_mode })
    .select("id, updated_at");

  if (
    insertError &&
    (insertError.code === "42703" || insertError.code === "PGRST204")
  ) {
    const retry = await supabase
      .from("videos")
      .insert(insertFields)
      .select("id, updated_at");
    insertedRows = retry.data;
    insertError = retry.error;
  }

  if (insertError || !insertedRows || insertedRows.length === 0) {
    if (insertError?.code === "23505") {
      return { ok: false, formError: "Video ini sudah ada." };
    }
    return { ok: false, formError: "Gagal menambahkan video baru." };
  }

  const createdId = insertedRows[0].id as string;
  if (data.is_featured) {
    await supabase
      .from("videos")
      .update({ is_featured: false })
      .eq("is_featured", true)
      .neq("id", createdId);
  }

  revalidateVideoPaths();
  return {
    ok: true,
    id: createdId,
    updatedAt: insertedRows[0].updated_at as string,
  };
}

export async function bulkInsertVideosAction(
  items: BulkVideoInputItem[]
): Promise<BulkInsertVideosResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates: 0,
      invalidCount: 0,
      formError: auth.error,
    };
  }
  const { supabase } = auth;

  if (!Array.isArray(items) || items.length === 0) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates: 0,
      invalidCount: 0,
      formError: "Masukkan minimal 1 URL video.",
    };
  }

  if (items.length > MAX_BULK_URLS) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates: 0,
      invalidCount: 0,
      formError: `Maksimal ${MAX_BULK_URLS} URL per batch.`,
    };
  }

  const { count, error: countError } = await supabase
    .from("videos")
    .select("id", { count: "exact", head: true });

  if (countError) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates: 0,
      invalidCount: 0,
      formError: "Gagal memeriksa jumlah video saat ini.",
    };
  }

  const currentTotal = count ?? 0;
  if (currentTotal >= MAX_VIDEOS_TOTAL) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates: 0,
      invalidCount: 0,
      formError: `Batas maksimal ${MAX_VIDEOS_TOTAL} video telah tercapai.`,
    };
  }

  const { data: existingRows } = await supabase
    .from("videos")
    .select("platform, video_id")
    .not("video_id", "is", null);

  const seenKeys = new Set<string>(
    (existingRows ?? []).map((r) => `${r.platform}:${r.video_id}`)
  );

  const { data: maxOrderRow } = await supabase
    .from("videos")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextSortOrder =
    typeof maxOrderRow?.sort_order === "number"
      ? maxOrderRow.sort_order + 1
      : 0;

  let skippedDuplicates = 0;
  let invalidCount = 0;
  const toInsert: Array<{
    platform: "youtube" | "tiktok";
    url: string;
    video_id: string | null;
    title: string;
    status: "published";
    is_featured: boolean;
    show_on_home: boolean;
    play_mode: TikTokPlayMode;
    sort_order: number;
    published_at: string;
  }> = [];

  const nowIso = new Date().toISOString();

  for (const item of items) {
    const parsed = parseVideoUrl(item.url ?? "");
    const title = (item.title ?? "").trim();

    if (!parsed.ok || title.length < 2 || title.length > 120) {
      invalidCount += 1;
      continue;
    }

    if (parsed.videoId) {
      const key = `${parsed.platform}:${parsed.videoId}`;
      if (seenKeys.has(key)) {
        skippedDuplicates += 1;
        continue;
      }
      seenKeys.add(key);
    }

    if (currentTotal + toInsert.length >= MAX_VIDEOS_TOTAL) {
      break;
    }

    const requestedMode = item.play_mode ?? parsed.suggestedMode;
    const resolvedMode: TikTokPlayMode =
      parsed.platform === "tiktok" &&
      parsed.videoId &&
      requestedMode === "embed"
        ? "embed"
        : "link";

    toInsert.push({
      platform: parsed.platform,
      url: parsed.normalizedUrl,
      video_id: parsed.videoId,
      title,
      status: "published",
      is_featured: false,
      show_on_home: true,
      play_mode: resolvedMode,
      sort_order: nextSortOrder,
      published_at: nowIso,
    });
    nextSortOrder += 1;
  }

  if (toInsert.length === 0) {
    return {
      ok: true,
      insertedCount: 0,
      skippedDuplicates,
      invalidCount,
    };
  }

  let { error: insertError } = await supabase.from("videos").insert(toInsert);
  if (
    insertError &&
    (insertError.code === "42703" || insertError.code === "PGRST204")
  ) {
    const withoutPlayMode = toInsert.map(({ play_mode: _pm, ...rest }) => rest);
    const retry = await supabase.from("videos").insert(withoutPlayMode);
    insertError = retry.error;
  }
  if (insertError) {
    return {
      ok: false,
      insertedCount: 0,
      skippedDuplicates,
      invalidCount,
      formError: "Gagal menyimpan batch video ke database.",
    };
  }

  revalidateVideoPaths();
  return {
    ok: true,
    insertedCount: toInsert.length,
    skippedDuplicates,
    invalidCount,
  };
}

export async function deleteVideoAction(id: string): Promise<VideoActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, error: auth.error };
  }
  if (!isValidUuid(id)) {
    return { ok: false, error: "ID video tidak valid." };
  }

  const { error } = await auth.supabase.from("videos").delete().eq("id", id);
  if (error) {
    return { ok: false, error: "Gagal menghapus video." };
  }

  revalidateVideoPaths();
  return { ok: true };
}

export async function swapVideoOrderAction(
  id: string,
  direction: "up" | "down"
): Promise<VideoActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, error: auth.error };
  }
  if (!isValidUuid(id)) {
    return { ok: false, error: "ID video tidak valid." };
  }

  const { data: rows, error } = await auth.supabase
    .from("videos")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !rows || rows.length < 2) {
    return { ok: false, error: "Tidak dapat mengubah urutan video." };
  }

  const idx = rows.findIndex((r) => r.id === id);
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || targetIdx < 0 || targetIdx >= rows.length) {
    return { ok: false, error: "Posisi video sudah di batas daftar." };
  }

  const currentRow = rows[idx];
  const neighbourRow = rows[targetIdx];

  const currentOrder =
    currentRow.sort_order === neighbourRow.sort_order
      ? idx
      : (currentRow.sort_order as number);
  const neighbourOrder =
    currentRow.sort_order === neighbourRow.sort_order
      ? targetIdx
      : (neighbourRow.sort_order as number);

  const [{ error: err1 }, { error: err2 }] = await Promise.all([
    auth.supabase
      .from("videos")
      .update({ sort_order: neighbourOrder })
      .eq("id", currentRow.id),
    auth.supabase
      .from("videos")
      .update({ sort_order: currentOrder })
      .eq("id", neighbourRow.id),
  ]);

  if (err1 || err2) {
    return { ok: false, error: "Gagal memperbarui urutan video." };
  }

  revalidateVideoPaths();
  return { ok: true };
}
