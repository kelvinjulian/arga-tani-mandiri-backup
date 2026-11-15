import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SITE_DATA } from "@/data/site";
import { getRobotsMetadata, getSiteUrl } from "@/lib/seo";

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

const defaultTitle = `${SITE_DATA.companyName} | Sarana Produksi Pertanian`;
const defaultDescription = SITE_DATA.fieldDescription;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_DATA.companyName}`,
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
    siteName: SITE_DATA.companyName,
    locale: "id_ID",
    type: "website",
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
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/hero-agriculture.jpg"],
  },
};

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
