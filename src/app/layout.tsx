import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SITE_DATA } from "@/data/site";
import { getRobotsMetadata, getSiteUrl } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppCTA";
import { Decor } from "@/components/Decor";
import { ScrollReveal } from "@/components/ScrollReveal";

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
      <body className="relative min-h-dvh w-full flex flex-col [background:linear-gradient(180deg,var(--page-top)_0%,var(--page-bottom)_100%)] text-[#0F1F17] antialiased">
        <a
          href="#konten-utama"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#143D29] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-2 focus:outline-offset-2 focus-visible:outline-[#0F1F17]"
        >
          Lewati ke konten utama
        </a>
        <Decor />
        <ScrollReveal />
        <div className="relative z-[1] flex w-full flex-1 flex-col">
          <Navbar />
          <main id="konten-utama" className="w-full min-w-0 flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
