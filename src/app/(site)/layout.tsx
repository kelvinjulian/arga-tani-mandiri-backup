import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/WhatsAppCTA";
import { Decor } from "@/components/Decor";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getArticles, getCategories, getSiteContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [siteData, categories, articles] = await Promise.all([
    getSiteContent(),
    getCategories(),
    getArticles(),
  ]);

  return (
    <div className="relative flex min-h-dvh w-full flex-col [background:linear-gradient(180deg,var(--page-top)_0%,var(--page-bottom)_100%)]">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#143D29] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:outline-2 focus:outline-offset-2 focus-visible:outline-[#0F1F17]"
      >
        Lewati ke konten utama
      </a>
      <Decor />
      <ScrollReveal />
      <div className="relative z-[1] flex w-full flex-1 flex-col">
        <Navbar
          companyName={siteData.companyName}
          shopeeStoreUrl={siteData.officialStore.url}
          whatsappNumber={siteData.whatsappNumber}
          logoSrc={siteData.navbar?.logoSrc}
          logoAlt={siteData.navbar?.logoAlt}
          brandTitle={siteData.navbar?.brandTitle}
          brandSubtitle={siteData.navbar?.brandSubtitle}
          navbarItems={siteData.navbar?.items}
          categories={categories}
        />
        <main id="konten-utama" className="w-full min-w-0 flex-1">
          {children}
        </main>
        <Footer
          siteData={siteData}
          categories={categories}
          articles={articles}
        />
      </div>
      <FloatingWhatsAppButton whatsappNumber={siteData.whatsappNumber} />
    </div>
  );
}
