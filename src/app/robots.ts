import type { MetadataRoute } from "next";
import { ADMIN_BASE_PATH } from "@/lib/admin-path";
import { getSiteUrl, isSiteIndexingEnabled } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexingEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [ADMIN_BASE_PATH, `${ADMIN_BASE_PATH}/`],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
