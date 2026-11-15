"use server";

import { verifyAdminAction } from "@/lib/supabase/admin";
import { revalidateAllSitePaths } from "@/lib/revalidation";
import {
  getDefaultCategoriesPayload,
  isValidHttpsUrl,
  isValidImageSrc,
} from "@/lib/site-content/validation";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MIN_CATEGORIES = 1;
const MAX_CATEGORIES = 8;

export interface AdminCategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_src: string;
  image_alt: string;
  external_url: string;
  sort_order: number;
  updated_at: string;
}

export interface CategoryActionResult {
  ok: boolean;
  categories?: AdminCategoryRow[];
  fieldErrors?: Record<string, string>;
  formError?: string;
  concurrencyError?: string;
}

async function fetchOrderedCategories(
  supabase: Parameters<typeof verifyAdminAction> extends never
    ? never
    : Awaited<ReturnType<typeof verifyAdminAction>> extends infer R
      ? R extends { ok: true; supabase: infer S }
        ? S
        : never
      : never
): Promise<AdminCategoryRow[]> {
  const { data } = await supabase
    .from("categories")
    .select(
      "id, slug, name, description, image_src, image_alt, external_url, sort_order, updated_at"
    )
    .order("sort_order", { ascending: true });
  return (data ?? []) as AdminCategoryRow[];
}

export async function saveCategoryAction(payload: {
  id?: string;
  originalUpdatedAt?: string;
  name: string;
  slug: string;
  description: string;
  image_src: string;
  image_alt: string;
  external_url: string;
}): Promise<CategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, formError: auth.error };
  const { supabase } = auth;

  const isEdit = Boolean(payload.id);
  const fieldErrors: Record<string, string> = {};

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  if (!name) fieldErrors.name = "Nama kategori wajib diisi.";
  else if (name.length > 80) fieldErrors.name = "Nama kategori maksimal 80 karakter.";

  const slug = typeof payload.slug === "string" ? payload.slug.trim() : "";
  if (!slug) fieldErrors.slug = "Slug wajib diisi.";
  else if (!SLUG_REGEX.test(slug)) {
    fieldErrors.slug =
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).";
  } else if (slug.length > 100) {
    fieldErrors.slug = "Slug maksimal 100 karakter.";
  }

  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  if (!description) fieldErrors.description = "Deskripsi kategori wajib diisi.";
  else if (description.length > 260) {
    fieldErrors.description = "Deskripsi maksimal 260 karakter.";
  }

  const imageSrc =
    typeof payload.image_src === "string" ? payload.image_src.trim() : "";
  if (!imageSrc) fieldErrors.image_src = "Gambar kategori wajib diunggah.";
  else if (!isValidImageSrc(imageSrc)) {
    fieldErrors.image_src = "URL gambar harus diawali / atau https://.";
  }

  const imageAlt =
    typeof payload.image_alt === "string" ? payload.image_alt.trim() : "";
  if (!imageAlt) fieldErrors.image_alt = "Teks alternatif (alt) gambar wajib diisi.";
  else if (imageAlt.length > 250) {
    fieldErrors.image_alt = "Teks alt maksimal 250 karakter.";
  }

  const externalUrl =
    typeof payload.external_url === "string" ? payload.external_url.trim() : "";
  if (!externalUrl) fieldErrors.external_url = "URL toko eksternal wajib diisi.";
  else if (!isValidHttpsUrl(externalUrl)) {
    fieldErrors.external_url =
      "URL eksternal harus menggunakan protokol https:// yang valid.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
    };
  }

  // Check slug uniqueness
  let slugQuery = supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .limit(1);
  if (isEdit && payload.id) {
    slugQuery = slugQuery.neq("id", payload.id);
  }
  const { data: slugConflict } = await slugQuery;
  if (slugConflict && slugConflict.length > 0) {
    return {
      ok: false,
      fieldErrors: { slug: "Slug ini sudah digunakan kategori lain." },
      formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
    };
  }

  if (!isEdit) {
    const current = await fetchOrderedCategories(supabase);
    if (current.length >= MAX_CATEGORIES) {
      return {
        ok: false,
        formError: `Maksimal ${MAX_CATEGORIES} kategori produk yang dapat ditambahkan.`,
      };
    }

    const nextSort =
      current.length > 0
        ? Math.max(...current.map((c) => c.sort_order)) + 1
        : 0;
    const newId = `cat-${slug.slice(0, 30)}-${Date.now().toString(36)}`;

    const { error: insertError } = await supabase.from("categories").insert({
      id: newId,
      slug,
      name,
      description,
      image_src: imageSrc,
      image_alt: imageAlt,
      external_url: externalUrl,
      sort_order: nextSort,
    });

    if (insertError) {
      return { ok: false, formError: "Gagal menambahkan kategori baru." };
    }

    revalidateAllSitePaths();
    return { ok: true, categories: await fetchOrderedCategories(supabase) };
  }

  const categoryId = payload.id as string;
  if (!payload.originalUpdatedAt) {
    return {
      ok: false,
      formError: "Penanda versi kategori tidak ditemukan. Muat ulang halaman.",
    };
  }

  const { data: existing } = await supabase
    .from("categories")
    .select("id, updated_at")
    .eq("id", categoryId)
    .maybeSingle();

  if (!existing || existing.updated_at !== payload.originalUpdatedAt) {
    return {
      ok: false,
      concurrencyError:
        "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("categories")
    .update({
      slug,
      name,
      description,
      image_src: imageSrc,
      image_alt: imageAlt,
      external_url: externalUrl,
    })
    .eq("id", categoryId)
    .eq("updated_at", payload.originalUpdatedAt)
    .select("id");

  if (updateError) {
    return { ok: false, formError: "Gagal menyimpan perubahan kategori." };
  }
  if (!updatedRows || updatedRows.length === 0) {
    return {
      ok: false,
      concurrencyError:
        "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  revalidateAllSitePaths();
  return { ok: true, categories: await fetchOrderedCategories(supabase) };
}

export async function reorderCategoriesAction(
  orderedIds: Array<{ id: string; updatedAt: string }>
): Promise<CategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, formError: auth.error };
  const { supabase } = auth;

  const current = await fetchOrderedCategories(supabase);
  const currentMap = new Map(current.map((c) => [c.id, c]));

  for (const item of orderedIds) {
    const row = currentMap.get(item.id);
    if (!row || row.updated_at !== item.updatedAt) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }
  }

  for (let i = 0; i < orderedIds.length; i++) {
    const { id, updatedAt } = orderedIds[i];
    const { data: updatedRows, error } = await supabase
      .from("categories")
      .update({ sort_order: i })
      .eq("id", id)
      .eq("updated_at", updatedAt)
      .select("id");

    if (error || !updatedRows || updatedRows.length === 0) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }
  }

  revalidateAllSitePaths();
  return { ok: true, categories: await fetchOrderedCategories(supabase) };
}

export async function deleteCategoryAction(
  id: string,
  originalUpdatedAt: string
): Promise<CategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, formError: auth.error };
  const { supabase } = auth;

  const current = await fetchOrderedCategories(supabase);
  if (current.length <= MIN_CATEGORIES) {
    return {
      ok: false,
      formError: `Minimal harus ada ${MIN_CATEGORIES} kategori produk.`,
    };
  }

  const target = current.find((c) => c.id === id);
  if (!target || target.updated_at !== originalUpdatedAt) {
    return {
      ok: false,
      concurrencyError:
        "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("updated_at", originalUpdatedAt);

  if (deleteError) {
    return { ok: false, formError: "Gagal menghapus kategori." };
  }

  revalidateAllSitePaths();
  return { ok: true, categories: await fetchOrderedCategories(supabase) };
}

export async function resetCategoriesAction(): Promise<CategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, formError: auth.error };
  const { supabase } = auth;

  const defaults = getDefaultCategoriesPayload();
  const defaultIds = new Set(defaults.map((d) => d.id));

  const current = await fetchOrderedCategories(supabase);
  const extraIds = current
    .filter((c) => !defaultIds.has(c.id))
    .map((c) => c.id);

  if (extraIds.length > 0) {
    const { error: delError } = await supabase
      .from("categories")
      .delete()
      .in("id", extraIds);
    if (delError) {
      return { ok: false, formError: "Gagal menghapus kategori tambahan." };
    }
  }

  const { error: upsertError } = await supabase
    .from("categories")
    .upsert(defaults, { onConflict: "id" });

  if (upsertError) {
    return { ok: false, formError: "Gagal mengembalikan kategori awal." };
  }

  revalidateAllSitePaths();
  return { ok: true, categories: await fetchOrderedCategories(supabase) };
}
