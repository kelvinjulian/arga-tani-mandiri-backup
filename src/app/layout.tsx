import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { getRobotsMetadata, getSiteUrl } from "@/lib/seo";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteContent();
  const defaultTitle = `${siteData.companyName} | Sarana Produksi Pertanian`;
  const defaultDescription = siteData.fieldDescription;
  const heroImageUrl = resolveImageSrc(
    siteData.hero.imageSrc,
    "/images/hero-agriculture.jpg"
  );
  const heroImageAlt = siteData.hero.imageAlt;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: defaultTitle,
      template: `%s | ${siteData.companyName}`,
    },
    description: defaultDescription,
    robots: getRobotsMetadata(),
    icons: {
      icon: "/brand/logo-mark.png",
      shortcut: "/brand/logo-mark.png",
      apple: "/brand/logo-mark.png",
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      url: "/",
      siteName: siteData.companyName,
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: heroImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: [heroImageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${sourceSans3.variable}`}
    >
      <body className="min-h-dvh w-full text-[#0F1F17] antialiased">
        {children}
      </body>
    </html>
  );
}
