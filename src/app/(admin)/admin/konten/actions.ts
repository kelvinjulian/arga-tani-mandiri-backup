"use server";

import { verifyAdminAction } from "@/lib/supabase/admin";
import { revalidateAllSitePaths } from "@/lib/revalidation";
import {
  getDefaultBlockValue,
  isSiteContentKey,
  validateSiteContentBlock,
} from "@/lib/site-content/validation";

export interface SaveSiteContentResult {
  ok: boolean;
  updatedAt?: string;
  value?: Record<string, unknown>;
  fieldErrors?: Record<string, string>;
  formError?: string;
  concurrencyError?: string;
}

export async function saveSiteContentAction(
  key: string,
  rawValue: Record<string, unknown>,
  originalUpdatedAt: string | null
): Promise<SaveSiteContentResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, formError: auth.error };
  }
  const { supabase } = auth;

  if (!isSiteContentKey(key)) {
    return { ok: false, formError: "Kunci blok konten tidak valid." };
  }

  const validated = validateSiteContentBlock(key, rawValue);
  if (!validated.ok) {
    return {
      ok: false,
      fieldErrors: validated.fieldErrors,
      formError: validated.formError,
    };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("site_content")
    .select("key, updated_at")
    .eq("key", key)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, formError: "Gagal memeriksa data konten saat ini." };
  }

  if (existing) {
    if (!originalUpdatedAt || existing.updated_at !== originalUpdatedAt) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("site_content")
      .update({ value: validated.value })
      .eq("key", key)
      .eq("updated_at", originalUpdatedAt)
      .select("updated_at");

    if (updateError) {
      return { ok: false, formError: "Gagal menyimpan perubahan konten." };
    }
    if (!updatedRows || updatedRows.length === 0) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }

    revalidateAllSitePaths();
    return {
      ok: true,
      updatedAt: updatedRows[0].updated_at,
      value: validated.value,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("site_content")
    .insert({ key, value: validated.value })
    .select("updated_at")
    .single();

  if (insertError) {
    return {
      ok: false,
      concurrencyError:
        "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  revalidateAllSitePaths();
  return {
    ok: true,
    updatedAt: inserted.updated_at,
    value: validated.value,
  };
}

export async function resetSiteContentAction(
  key: string,
  originalUpdatedAt: string | null
): Promise<SaveSiteContentResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, formError: auth.error };
  }
  const { supabase } = auth;

  if (!isSiteContentKey(key)) {
    return { ok: false, formError: "Kunci blok konten tidak valid." };
  }

  const defaultValue = getDefaultBlockValue(key);

  const { data: existing, error: fetchError } = await supabase
    .from("site_content")
    .select("key, updated_at")
    .eq("key", key)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, formError: "Gagal memeriksa data konten saat ini." };
  }

  if (existing) {
    if (!originalUpdatedAt || existing.updated_at !== originalUpdatedAt) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }

    const { data: updatedRows, error: updateError } = await supabase
      .from("site_content")
      .update({ value: defaultValue })
      .eq("key", key)
      .eq("updated_at", originalUpdatedAt)
      .select("updated_at");

    if (updateError || !updatedRows || updatedRows.length === 0) {
      return {
        ok: false,
        concurrencyError:
          "Bagian ini sudah diubah di tab/perangkat lain. Muat ulang.",
      };
    }

    revalidateAllSitePaths();
    return {
      ok: true,
      updatedAt: updatedRows[0].updated_at,
      value: defaultValue,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("site_content")
    .insert({ key, value: defaultValue })
    .select("updated_at")
    .single();

  if (insertError) {
    return { ok: false, formError: "Gagal mengembalikan teks awal." };
  }

  revalidateAllSitePaths();
  return {
    ok: true,
    updatedAt: inserted.updated_at,
    value: defaultValue,
  };
}
