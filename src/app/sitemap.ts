import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/content";
import { getSiteUrl, isSiteIndexingEnabled } from "@/lib/seo";

// Revalidate every 5 minutes; on-demand revalidation (revalidatePath/revalidateTag) will be added with /admin CMS.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isSiteIndexingEnabled()) {
    return [];
  }

  const baseUrl = getSiteUrl();
  const articles = await getArticles();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/artikel`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const publishedArticleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => article.status === "published")
    .map((article) => {
      const lastModified = article.dateModified ?? article.datePublished;
      return {
        url: `${baseUrl}/artikel/${article.slug}`,
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly",
        priority: 0.7,
      };
    });

  return [...staticRoutes, ...publishedArticleRoutes];
}
