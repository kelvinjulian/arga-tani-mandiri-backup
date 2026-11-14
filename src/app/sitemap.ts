import type { MetadataRoute } from "next";
import { ARTICLES } from "@/data/articles";
import { getSiteUrl, isSiteIndexingEnabled } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteIndexingEnabled()) {
    return [];
  }

  const baseUrl = getSiteUrl();

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

  const publishedArticleRoutes: MetadataRoute.Sitemap = ARTICLES.filter(
    (article) => article.status === "published"
  ).map((article) => {
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
