import { revalidatePath } from "next/cache";

/**
 * Revalidates all public routes and shared layouts affected by site_content or categories updates.
 */
export function revalidateAllSitePaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/artikel");
  revalidatePath("/artikel/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
