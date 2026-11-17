"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminPath } from "@/lib/admin-path";
import { verifyAdminAction } from "@/lib/supabase/admin";
import {
  isValidUuid,
  validateArticlePayload,
  type ArticleEditorPayload,
  type ArticleFieldErrors,
} from "@/lib/articles/admin-validation";

export interface SaveArticleResult {
  ok: boolean;
  id?: string;
  slug?: string;
  updatedAt?: string;
  fieldErrors?: ArticleFieldErrors;
  formError?: string;
  concurrencyError?: string;
}

export interface DeleteArticleResult {
  ok: boolean;
  error?: string;
}

function revalidateArticlePaths(slug: string, oldSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/artikel");
  revalidatePath(`/artikel/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/artikel/${oldSlug}`);
  }
  revalidatePath("/sitemap.xml");
}

export async function saveArticleAction(
  payload: ArticleEditorPayload
): Promise<SaveArticleResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, formError: auth.error };
  }
  const { supabase } = auth;

  const isEdit = Boolean(payload.id);
  if (isEdit && (!payload.id || !isValidUuid(payload.id))) {
    return { ok: false, formError: "ID artikel tidak valid." };
  }

  if (isEdit && !payload.originalUpdatedAt) {
    return {
      ok: false,
      formError:
        "Penanda versi artikel tidak ditemukan. Muat ulang halaman sebelum menyimpan.",
    };
  }

  const validated = validateArticlePayload(payload);
  if (!validated.ok) {
    return {
      ok: false,
      fieldErrors: validated.fieldErrors,
      formError: validated.formError,
    };
  }

  const data = validated.data;

  // Check slug uniqueness before write
  let slugQuery = supabase
    .from("articles")
    .select("id")
    .eq("slug", data.slug)
    .limit(1);
  if (isEdit && payload.id) {
    slugQuery = slugQuery.neq("id", payload.id);
  }
  const { data: conflictingSlug, error: slugCheckError } = await slugQuery;
  if (slugCheckError) {
    return {
      ok: false,
      formError: "Gagal memeriksa ketersediaan slug. Coba lagi.",
    };
  }
  if (conflictingSlug && conflictingSlug.length > 0) {
    return {
      ok: false,
      fieldErrors: {
        slug: "Slug ini sudah digunakan oleh artikel lain. Gunakan slug yang berbeda.",
      },
      formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
    };
  }

  if (!isEdit) {
    const publishedAt =
      data.status === "published" ? new Date().toISOString() : null;

    if (data.is_featured) {
      const { error: clearError } = await supabase
        .from("articles")
        .update({ is_featured: false })
        .eq("is_featured", true);
      if (clearError) {
        return {
          ok: false,
          formError: "Gagal memperbarui status Artikel Utama sebelumnya.",
        };
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from("articles")
      .insert({
        slug: data.slug,
        title: data.title,
        seo_title: data.seo_title,
        meta_description: data.meta_description,
        excerpt: data.excerpt,
        intro: data.intro,
        body: data.body,
        category: data.category,
        filter_category: data.filter_category,
        reading_time: data.reading_time,
        is_featured: data.is_featured,
        status: data.status,
        image_src: data.image_src,
        image_alt: data.image_alt,
        takeaways: data.takeaways,
        tags: data.tags,
        published_at: publishedAt,
      })
      .select("id, slug, updated_at")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          ok: false,
          fieldErrors: {
            slug: "Slug ini sudah digunakan oleh artikel lain.",
          },
          formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
        };
      }
      return {
        ok: false,
        formError: "Gagal menyimpan artikel baru. Pastikan data sudah benar.",
      };
    }

    revalidateArticlePaths(inserted.slug);

    return {
      ok: true,
      id: inserted.id,
      slug: inserted.slug,
      updatedAt: inserted.updated_at,
    };
  }

  // Edit mode: fetch existing row to preserve published_at and detect old slug
  const articleId = payload.id as string;
  const { data: existing, error: fetchError } = await supabase
    .from("articles")
    .select("id, slug, published_at, updated_at")
    .eq("id", articleId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, formError: "Gagal membaca data artikel saat ini." };
  }
  if (!existing) {
    return {
      ok: false,
      concurrencyError:
        "Artikel ini tidak lagi ditemukan (mungkin sudah dihapus). Muat ulang daftar artikel.",
    };
  }

  if (existing.updated_at !== payload.originalUpdatedAt) {
    return {
      ok: false,
      concurrencyError:
        "Artikel ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  const nextPublishedAt =
    existing.published_at ??
    (data.status === "published" ? new Date().toISOString() : null);

  if (data.is_featured) {
    const { error: clearError } = await supabase
      .from("articles")
      .update({ is_featured: false })
      .eq("is_featured", true)
      .neq("id", articleId);
    if (clearError) {
      return {
        ok: false,
        formError: "Gagal memperbarui status Artikel Utama sebelumnya.",
      };
    }
  }

  const { data: updatedRows, error: updateError } = await supabase
    .from("articles")
    .update({
      slug: data.slug,
      title: data.title,
      seo_title: data.seo_title,
      meta_description: data.meta_description,
      excerpt: data.excerpt,
      intro: data.intro,
      body: data.body,
      category: data.category,
      filter_category: data.filter_category,
      reading_time: data.reading_time,
      is_featured: data.is_featured,
      status: data.status,
      image_src: data.image_src,
      image_alt: data.image_alt,
      takeaways: data.takeaways,
      tags: data.tags,
      published_at: nextPublishedAt,
    })
    .eq("id", articleId)
    .eq("updated_at", payload.originalUpdatedAt as string)
    .select("id, slug, updated_at");

  if (updateError) {
    if (updateError.code === "23505") {
      return {
        ok: false,
        fieldErrors: {
          slug: "Slug ini sudah digunakan oleh artikel lain.",
        },
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }
    return {
      ok: false,
      formError: "Gagal menyimpan perubahan artikel. Coba lagi.",
    };
  }

  if (!updatedRows || updatedRows.length === 0) {
    return {
      ok: false,
      concurrencyError:
        "Artikel ini sudah diubah di tab/perangkat lain. Muat ulang.",
    };
  }

  const updated = updatedRows[0];
  revalidateArticlePaths(updated.slug, existing.slug);

  return {
    ok: true,
    id: updated.id,
    slug: updated.slug,
    updatedAt: updated.updated_at,
  };
}

export async function deleteArticleAction(
  id: string,
  confirmSlug: string
): Promise<DeleteArticleResult> {
  const auth = await verifyAdminAction();
  if (!auth.ok) {
    return { ok: false, error: auth.error };
  }
  const { supabase } = auth;

  if (!isValidUuid(id)) {
    return { ok: false, error: "ID artikel tidak valid." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("articles")
    .select("id, slug")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: "Gagal memeriksa data artikel." };
  }
  if (!existing) {
    return { ok: false, error: "Artikel tidak ditemukan." };
  }

  if (confirmSlug.trim() !== existing.slug) {
    return {
      ok: false,
      error: "Slug konfirmasi tidak sesuai. Ketik slug artikel secara persis.",
    };
  }

  const { error: deleteError } = await supabase
    .from("articles")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { ok: false, error: "Gagal menghapus artikel dari database." };
  }

  revalidateArticlePaths(existing.slug);
  redirect(adminPath("/artikel?deleted=1"));
}
