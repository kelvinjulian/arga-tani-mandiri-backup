import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticles,
  getSiteContent,
} from "@/lib/content";
import { getRobotsMetadata, getSiteUrl, serializeJsonLd } from "@/lib/seo";
import { ArticleDetailView } from "@/components/ArticleDetailView";

// Revalidate every 5 minutes; on-demand revalidation (revalidatePath/revalidateTag) will be added with /admin CMS.
export const revalidate = 300;

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [article, siteData] = await Promise.all([
    getArticleBySlug(slug),
    getSiteContent(),
  ]);

  if (!article || article.status === "draft") {
    return {
      title: "Artikel Tidak Ditemukan",
      robots: getRobotsMetadata(true),
    };
  }

  const isNoIndex = article.status !== "published";
  const fullTitle = `${article.seoTitle} | ${siteData.companyName}`;
  const canonicalPath = `/artikel/${article.slug}`;

  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: {
      canonical: canonicalPath,
    },
    robots: getRobotsMetadata(isNoIndex),
    openGraph: {
      type: "article",
      title: fullTitle,
      description: article.metaDescription,
      url: canonicalPath,
      siteName: siteData.companyName,
      locale: "id_ID",
      images: [
        {
          url: "/images/hero-agriculture.jpg",
          width: 1200,
          height: 630,
          alt: "Aktivitas pertanian di lahan budidaya",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: article.metaDescription,
      images: ["/images/hero-agriculture.jpg"],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const [article, allArticles, siteData] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    getSiteContent(),
  ]);

  if (!article || article.status === "draft") {
    notFound();
  }

  const relatedArticles = allArticles.filter((item) => item.id !== article.id);
  const shopeeStoreUrl = siteData.officialStore.url;
  const whatsappNumber = siteData.whatsappNumber;
  const siteUrl = getSiteUrl();
  const articleImageUrl = article.imageSrc.startsWith("http")
    ? article.imageSrc
    : `${siteUrl}${article.imageSrc}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artikel Edukasi",
        item: `${siteUrl}/artikel`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${siteUrl}/artikel/${article.slug}`,
      },
    ],
  };

  const articleJsonLd =
    article.status === "published"
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.metaDescription,
          image: [articleImageUrl],
          ...(article.datePublished
            ? { datePublished: article.datePublished }
            : {}),
          ...(article.dateModified
            ? { dateModified: article.dateModified }
            : {}),
          publisher: {
            "@type": "Organization",
            name: siteData.companyName,
            url: siteUrl,
            logo: {
              "@type": "ImageObject",
              url: `${siteUrl}/brand/logo-mark.png`,
            },
          },
        }
      : null;

  return (
    <div className="relative w-full bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(articleJsonLd),
          }}
        />
      )}

      <ArticleDetailView
        article={article}
        relatedArticles={relatedArticles}
        officialStoreName={siteData.officialStore.name}
        shopeeStoreUrl={shopeeStoreUrl}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
