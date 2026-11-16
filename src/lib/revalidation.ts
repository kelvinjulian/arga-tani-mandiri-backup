import { revalidatePath } from "next/cache";

/**
 * Revalidates all public routes and shared layouts affected by site_content or categories updates.
 */
export function revalidateAllSitePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/artikel");
  revalidatePath("/artikel/[slug]", "page");
  try {
    revalidatePath("/video");
  } catch {
    // Guarded if /video is not yet built
  }
  revalidatePath("/sitemap.xml");
}
