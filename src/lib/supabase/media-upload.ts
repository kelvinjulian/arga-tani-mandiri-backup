import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { MAX_IMAGE_BYTES } from "@/lib/articles/admin-validation";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export interface MediaUploadResult {
  ok: true;
  publicUrl: string;
  resized: boolean;
}

export interface MediaUploadError {
  ok: false;
  error: string;
}

function sanitizeBaseName(filename: string): string {
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  const cleaned = withoutExt
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
  return cleaned || "gambar-artikel";
}

function getExtensionFromMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

async function resizeImageToWebP(file: File): Promise<Blob> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Gagal membaca file gambar."));
      el.src = imageUrl;
    });

    const maxSide = 1920;
    const { naturalWidth: w, naturalHeight: h } = img;
    if (!w || !h) {
      throw new Error("Dimensi gambar tidak valid.");
    }

    const scale = Math.min(1, maxSide / Math.max(w, h));
    const targetW = Math.max(1, Math.round(w * scale));
    const targetH = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Browser tidak mendukung pemrosesan gambar.");
    }
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/webp", 0.82);
    });
    if (!blob) {
      throw new Error("Gagal mengonversi gambar ke format WebP.");
    }
    return blob;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function uploadArticleImage(
  file: File
): Promise<MediaUploadResult | MediaUploadError> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      ok: false,
      error: "Format gambar harus JPG, PNG, atau WebP.",
    };
  }

  let uploadBlob: Blob = file;
  let contentType = file.type;
  let ext = getExtensionFromMime(file.type);
  let resized = false;

  if (file.size > MAX_IMAGE_BYTES) {
    try {
      uploadBlob = await resizeImageToWebP(file);
      contentType = "image/webp";
      ext = "webp";
      resized = true;
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Gagal memperkecil ukuran gambar.",
      };
    }

    if (uploadBlob.size > MAX_IMAGE_BYTES) {
      return {
        ok: false,
        error:
          "Ukuran gambar masih melebihi 2 MB setelah diperkecil. Pilih gambar lain yang lebih ringan.",
      };
    }
  }

  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    return { ok: false, error: "Konfigurasi Supabase belum tersedia." };
  }

  const folderId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const timestamp = Date.now();
  const baseName = sanitizeBaseName(file.name);
  const objectPath = `articles/${folderId}/${timestamp}-${baseName}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(objectPath, uploadBlob, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    return {
      ok: false,
      error:
        "Gagal mengunggah gambar ke penyimpanan. Pastikan Anda masih masuk sebagai admin.",
    };
  }

  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(objectPath);

  return {
    ok: true,
    publicUrl: urlData.publicUrl,
    resized,
  };
}
