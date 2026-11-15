"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAction } from "@/lib/supabase/admin";
import { revalidateAllSitePaths } from "@/lib/revalidation";
import {
  ARTICLE_CATEGORY_SLUG_REGEX,
  slugifyCategoryName,
  type ArticleCategoryItem,
} from "@/lib/article-categories";

export interface ArticleCategoryActionResult {
  ok: boolean;
  category?: ArticleCategoryItem;
  error?: string;
  concurrencyError?: string;
}

function validateCategoryInputs(
  rawName: string,
  rawFilterLabel: string,
  rawSlug: string
):
  | { ok: true; name: string; filterLabel: string; slug: string }
  | { ok: false; error: string } {
  const name = rawName.trim();
  if (name.length < 2 || name.length > 40) {
    return { ok: false, error: "Nama kategori harus 2 sampai 40 karakter." };
  }

  const filterLabel = (rawFilterLabel.trim() || name).trim();
  if (filterLabel.length < 2 || filterLabel.length > 40) {
    return { ok: false, error: "Label filter harus 2 sampai 40 karakter." };
  }

  const slug = (rawSlug.trim() || slugifyCategoryName(name)).toLowerCase();
  if (
    slug.length < 2 ||
    slug.length > 60 ||
    !ARTICLE_CATEGORY_SLUG_REGEX.test(slug)
  ) {
    return {
      ok: false,
      error:
        "Slug kategori hanya boleh berisi huruf kecil, angka, dan tanda hubung (2–60 karakter).",
    };
  }

  return { ok: true, name, filterLabel, slug };
}

function mapPgErrorToIndonesian(
  error: { code?: string; message?: string; details?: string } | null,
  fallback: string
): string {
  if (!error) return fallback;
  if (error.code === "23505") {
    const detail = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
    if (detail.includes("filter_label")) {
      return "Label filter sudah dipakai kategori lain.";
    }
    if (detail.includes("name")) {
      return "Nama kategori sudah dipakai kategori lain.";
    }
    if (detail.includes("slug")) {
      return "Slug kategori sudah dipakai kategori lain.";
    }
    return "Nama, label filter, atau slug sudah dipakai kategori lain.";
  }
  return error.message?.trim() || fallback;
}

function revalidateArticleCategoryPaths() {
  revalidateAllSitePaths();
  revalidatePath("/admin/kategori-artikel");
  revalidatePath("/admin/artikel");
}

export async function createArticleCategoryAction(
  rawName: string,
  rawFilterLabel: string,
  rawSlug: string
): Promise<ArticleCategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth;

  const validated = validateCategoryInputs(rawName, rawFilterLabel, rawSlug);
  if (!validated.ok) return { ok: false, error: validated.error };

  const { data: dupRows } = await supabase
    .from("article_categories")
    .select("id, name, filter_label, slug")
    .or(
      `name.eq."${validated.name}",filter_label.eq."${validated.filterLabel}",slug.eq."${validated.slug}"`
    );

  if (Array.isArray(dupRows) && dupRows.length > 0) {
    const dup = dupRows[0];
    if (dup.name === validated.name) {
      return { ok: false, error: "Nama kategori sudah dipakai kategori lain." };
    }
    if (dup.filter_label === validated.filterLabel) {
      return { ok: false, error: "Label filter sudah dipakai kategori lain." };
    }
    return {
      ok: false,
      error: `Slug "${validated.slug}" sudah dipakai kategori lain.`,
    };
  }

  const { data: lastRow } = await supabase
    .from("article_categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder =
    typeof lastRow?.sort_order === "number" ? lastRow.sort_order + 1 : 0;

  const { data: inserted, error: insertError } = await supabase
    .from("article_categories")
    .insert({
      name: validated.name,
      filter_label: validated.filterLabel,
      slug: validated.slug,
      sort_order: nextOrder,
    })
    .select("id, slug, name, filter_label, sort_order, updated_at")
    .single();

  if (insertError || !inserted) {
    return {
      ok: false,
      error: mapPgErrorToIndonesian(
        insertError,
        "Gagal menambahkan kategori artikel. Pastikan migrasi 0004 & 0005 sudah dijalankan."
      ),
    };
  }

  revalidateArticleCategoryPaths();
  return {
    ok: true,
    category: {
      id: inserted.id,
      slug: inserted.slug,
      name: inserted.name,
      filterLabel: inserted.filter_label,
      sortOrder: inserted.sort_order,
      updatedAt: inserted.updated_at,
    },
  };
}

export async function renameArticleCategoryAction(
  id: string,
  rawName: string,
  rawFilterLabel: string,
  rawSlug: string,
  originalUpdatedAt?: string
): Promise<ArticleCategoryActionResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth;

  const validated = validateCategoryInputs(rawName, rawFilterLabel, rawSlug);
  if (!validated.ok) return { ok: false, error: validated.error };

  const { data: existing, error: fetchError } = await supabase
    .from("article_categories")
    .select("id, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !existing) {
    return { ok: false, error: "Kategori artikel tidak ditemukan." };
  }

  if (
    originalUpdatedAt &&
    existing.updated_at &&
    existing.updated_at !== originalUpdatedAt
  ) {
    return {
      ok: false,
      concurrencyError:
        "Kategori ini sudah diubah di tab/perangkat lain. Muat ulang halaman.",
    };
  }

  const { data: rpcRows, error: rpcError } = await supabase.rpc(
    "rename_article_category",
    {
      p_id: id,
      p_name: validated.name,
      p_filter_label: validated.filterLabel,
      p_slug: validated.slug,
    }
  );

  if (rpcError || !Array.isArray(rpcRows) || rpcRows.length === 0) {
    return {
      ok: false,
      error: mapPgErrorToIndonesian(
        rpcError,
        "Gagal memperbarui kategori artikel secara atomik."
      ),
    };
  }

  const row = rpcRows[0] as {
    id: string;
    slug: string;
    name: string;
    filter_label: string;
    sort_order: number;
    updated_at: string;
  };

  revalidateArticleCategoryPaths();
  return {
    ok: true,
    category: {
      id: row.id,
      slug: row.slug,
      name: row.name,
      filterLabel: row.filter_label,
      sortOrder: row.sort_order,
      updatedAt: row.updated_at,
    },
  };
}

export async function reorderArticleCategoriesAction(
  orderedIds: string[]
): Promise<{ ok: boolean; error?: string }> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth;

  for (let idx = 0; idx < orderedIds.length; idx += 1) {
    const id = orderedIds[idx];
    const { error } = await supabase
      .from("article_categories")
      .update({ sort_order: idx })
      .eq("id", id);
    if (error) {
      return { ok: false, error: "Gagal menyimpan urutan kategori artikel." };
    }
  }

  revalidateArticleCategoryPaths();
  return { ok: true };
}

export async function deleteArticleCategoryAction(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  const auth = await verifyAdminAction();
  if (!auth.ok) return { ok: false, error: auth.error };
  const { supabase } = auth;

  const { data: cat, error: catError } = await supabase
    .from("article_categories")
    .select("id, name, filter_label")
    .eq("id", id)
    .maybeSingle();

  if (catError || !cat) {
    return { ok: false, error: "Kategori artikel tidak ditemukan." };
  }

  const { count, error: countError } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .or(`category.eq."${cat.name}",filter_category.eq."${cat.filter_label}"`);

  if (countError) {
    return { ok: false, error: "Gagal memeriksa pemakaian kategori." };
  }

  if ((count ?? 0) > 0) {
    return {
      ok: false,
      error: `Masih dipakai ${count} artikel. Pindahkan artikel ke kategori lain dulu.`,
    };
  }

  const { error: deleteError } = await supabase
    .from("article_categories")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { ok: false, error: "Gagal menghapus kategori artikel." };
  }

  revalidateArticleCategoryPaths();
  return { ok: true };
}
