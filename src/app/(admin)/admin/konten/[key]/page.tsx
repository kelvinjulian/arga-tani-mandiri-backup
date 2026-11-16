import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/supabase/admin";
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  SITE_CONTENT_BLOCKS,
  getDefaultBlockValue,
  isSiteContentKey,
  mergeSiteContentWithDefaults,
} from "@/lib/site-content/validation";
import { SITE_DATA } from "@/data/site";
import { SiteContentEditorForm } from "@/components/admin/SiteContentEditorForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ubah Konten Beranda",
};

interface AdminKontenEditPageProps {
  params: Promise<{ key: string }>;
}

export default async function AdminKontenEditPage({
  params,
}: AdminKontenEditPageProps) {
  const { supabase, user } = await requireAdminPage();
  const { key } = await params;

  if (!isSiteContentKey(key)) {
    notFound();
  }

  const blockMeta = SITE_CONTENT_BLOCKS.find((b) => b.key === key);
  if (!blockMeta) {
    notFound();
  }

  const { data: row } = await supabase
    .from("site_content")
    .select("key, value, updated_at")
    .eq("key", key)
    .maybeSingle();

  let companyContext = {
    companyName: SITE_DATA.companyName,
    whatsappNumber: SITE_DATA.whatsappNumber,
    shopeeStoreUrl: SITE_DATA.officialStore.url,
    contact: { ...SITE_DATA.contact },
  };

  if (key === "hero" || key === "article_hub" || key === "footer") {
    const { data: companyRow } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", "company")
      .maybeSingle();
    if (companyRow?.value && typeof companyRow.value === "object") {
      const mergedCompany = mergeSiteContentWithDefaults(
        new Map([["company", companyRow.value as Record<string, unknown>]])
      );
      companyContext = {
        companyName: mergedCompany.companyName,
        whatsappNumber: mergedCompany.whatsappNumber,
        shopeeStoreUrl: mergedCompany.officialStore.url,
        contact: { ...mergedCompany.contact },
      };
    }
  }

  const defaultVal = getDefaultBlockValue(key);
  let initialValue: Record<string, unknown> = defaultVal;

  if (row && row.value && typeof row.value === "object") {
    const merged = mergeSiteContentWithDefaults(
      new Map([[key, row.value as Record<string, unknown>]])
    );
    if (key === "company") {
      initialValue = {
        companyName: merged.companyName,
        companyLegalNote: merged.companyLegalNote,
        fieldDescription: merged.fieldDescription,
        officialStore: merged.officialStore,
        whatsappNumber: merged.whatsappNumber,
        contact: merged.contact,
      };
    } else if (key === "hero") {
      const rawRow = row.value as Record<string, unknown>;
      const rawImageSrc =
        typeof rawRow.imageSrc === "string" ? rawRow.imageSrc.trim() : "";
      initialValue = {
        ...merged.hero,
        imageSrc: rawImageSrc,
        imageAlt: rawImageSrc ? merged.hero.imageAlt : "",
      } as unknown as Record<string, unknown>;
    } else if (key === "category_showcase") {
      initialValue =
        merged.categoryShowcase as unknown as Record<string, unknown>;
    } else if (key === "about") {
      const rawRow = row.value as Record<string, unknown>;
      const rawImageSrc =
        typeof rawRow.imageSrc === "string" ? rawRow.imageSrc.trim() : "";
      initialValue = {
        ...merged.about,
        imageSrc: rawImageSrc,
        imageAlt: rawImageSrc ? merged.about.imageAlt : "",
      } as unknown as Record<string, unknown>;
    } else if (key === "testimonials") {
      initialValue = merged.testimonials as unknown as Record<string, unknown>;
    } else if (key === "video_section") {
      initialValue = merged.videoSection as unknown as Record<string, unknown>;
    } else if (key === "video_page") {
      const rawRow = row.value as Record<string, unknown>;
      const rawOg =
        typeof rawRow.ogImageSrc === "string" ? rawRow.ogImageSrc.trim() : "";
      initialValue = {
        ...merged.videoPage,
        ogImageSrc: rawOg,
        ogImageAlt: rawOg ? merged.videoPage?.ogImageAlt ?? "" : "",
      } as unknown as Record<string, unknown>;
    } else if (key === "article_hub") {
      initialValue = merged.articleHub as unknown as Record<string, unknown>;
    } else if (key === "article_page") {
      const rawRow = row.value as Record<string, unknown>;
      const rawOg =
        typeof rawRow.ogImageSrc === "string" ? rawRow.ogImageSrc.trim() : "";
      initialValue = {
        ...merged.articlePage,
        ogImageSrc: rawOg,
        ogImageAlt: rawOg ? merged.articlePage?.ogImageAlt ?? "" : "",
      } as unknown as Record<string, unknown>;
    } else if (key === "article_detail") {
      initialValue = merged.articleDetail as unknown as Record<string, unknown>;
    } else if (key === "whatsapp_band") {
      initialValue = merged.whatsappBand as unknown as Record<string, unknown>;
    } else {
      const rawRow = row.value as Record<string, unknown>;
      const rawLogoSrc =
        typeof rawRow.logoSrc === "string" ? rawRow.logoSrc.trim() : "";
      initialValue = {
        ...merged.footer,
        logoSrc: rawLogoSrc,
        logoAlt: rawLogoSrc ? merged.footer.logoAlt : "",
      } as unknown as Record<string, unknown>;
    }
  }

  return (
    <div className="min-h-dvh w-full">
      <AdminHeader userEmail={user.email ?? "Admin"} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <AdminBreadcrumb
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Konten Situs", href: "/admin/konten" },
            { label: blockMeta.group },
            { label: blockMeta.title },
          ]}
          backHref="/admin/konten"
          backLabel="Konten Situs"
        />
        <SiteContentEditorForm
          blockKey={key}
          blockGroup={blockMeta.group}
          blockTitle={blockMeta.title}
          blockDescription={blockMeta.description}
          publicHref={blockMeta.publicHref}
          companyContext={companyContext}
          initialValue={initialValue}
          initialUpdatedAt={
            row && typeof row.updated_at === "string" ? row.updated_at : null
          }
        />
      </main>
    </div>
  );
}
