import { SITE_DATA, type SiteData } from "@/data/site";
import { productCategories, SHOPEE_STORE_URL } from "@/data/categories";
import { isValidWhatsAppNumber } from "@/lib/whatsapp";
import { resolveImageSrc } from "@/lib/media/resolveImageSrc";
import {
  isSupportedIconName,
  type SupportedIconName,
} from "@/lib/site-content/icons";
import {
  cloneFooterDefaults,
  DEFAULT_FOOTER_DATA,
  type FooterData,
  type FooterHighlightItem,
  type FooterLinkColumn,
  type FooterNavLink,
  type FooterSocialLink,
} from "@/lib/site-content/footer-defaults";
import {
  DEFAULT_PRIMARY_CTA,
  DEFAULT_SECONDARY_CTA,
  HOME_SECTION_IDS,
  isCtaTargetType,
  isValidExternalHttpsUrl,
  isValidHomeSectionId,
  isValidPublicPagePath,
  type CtaTarget,
  type HeroCtaButton,
} from "@/lib/site-content/hero-cta";
import {
  DEFAULT_ABOUT_COMMITMENT_CARDS,
  DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS,
  DEFAULT_ABOUT_EYEBROW,
  DEFAULT_ABOUT_HEADING_ACCENT,
  DEFAULT_ABOUT_HEADING_MAIN,
  DEFAULT_ABOUT_HISTORY_STEPS,
  DEFAULT_ABOUT_HISTORY_TAB_LABEL,
  DEFAULT_ABOUT_IMAGE_ALT,
  DEFAULT_ABOUT_IMAGE_BADGE,
  DEFAULT_ABOUT_IMAGE_SRC,
  DEFAULT_ABOUT_MISI_HEADING,
  DEFAULT_ABOUT_PROFILE_TAB_LABEL,
  DEFAULT_ABOUT_SUBHEADING,
  DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL,
  DEFAULT_ABOUT_VISI_HEADING,
  DEFAULT_ABOUT_WHY_CTA_LABEL,
  DEFAULT_ABOUT_WHY_EYEBROW,
  type AboutCommitmentCard,
  type AboutHistoryStep,
  type AboutImageBadge,
} from "@/lib/site-content/about-defaults";
import {
  DEFAULT_ARTICLE_HUB,
  DEFAULT_ARTICLE_HUB_ALL_CTA,
  type ArticleHubData,
} from "@/lib/site-content/article-hub-defaults";
import {
  DEFAULT_FILTER_CHIPS_CONFIG,
  mergeFilterChipsConfig,
  validateFilterChipsInput,
} from "@/lib/site-content/filter-chips";
import {
  cloneArticleDetailDefaults,
  cloneArticlePageDefaults,
  type ArticleDetailData,
  type ArticlePageData,
} from "@/lib/site-content/article-pages-defaults";

export const SITE_CONTENT_KEYS = [
  "company",
  "hero",
  "category_showcase",
  "about",
  "article_hub",
  "article_page",
  "article_detail",
  "whatsapp_band",
  "footer",
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[number];

export type SiteContentGroup = "Beranda" | "Halaman Artikel" | "Seluruh Situs";

export interface SiteContentBlockMeta {
  key: SiteContentKey;
  group: SiteContentGroup;
  title: string;
  description: string;
  publicHref: string;
}

export const SITE_CONTENT_BLOCKS: ReadonlyArray<SiteContentBlockMeta> = [
  {
    key: "company",
    group: "Seluruh Situs",
    title: "Identitas Perusahaan & Kontak",
    description:
      "Nama perusahaan, deskripsi SEO, toko resmi Shopee, nomor WhatsApp, dan detail kontak footer.",
    publicHref: "/",
  },
  {
    key: "hero",
    group: "Beranda",
    title: "Bagian Hero Beranda",
    description:
      "Teks eyebrow, sorotan judul, subjudul, tombol aksi, gambar hero, dan dua lencana pada foto.",
    publicHref: "/#beranda",
  },
  {
    key: "category_showcase",
    group: "Beranda",
    title: "Pengantar Kategori Produk",
    description:
      "Label pill, judul bagian, deskripsi pengantar, dan label tautan etalase produk.",
    publicHref: "/#produk",
  },
  {
    key: "about",
    group: "Beranda",
    title: "Tentang Kami, Visi, Misi & Keunggulan",
    description:
      "Visi, daftar misi perusahaan, judul keunggulan, dan 4 kartu keunggulan produk.",
    publicHref: "/#tentang-kami",
  },
  {
    key: "article_hub",
    group: "Beranda",
    title: "Artikel Edukasi (Beranda)",
    description:
      "Judul bagian, deskripsi, tombol Lihat Semua Artikel, filter chip, label kartu, dan pita konsultasi.",
    publicHref: "/#artikel-edukasi",
  },
  {
    key: "article_page",
    group: "Halaman Artikel",
    title: "Halaman Pusat Artikel (/artikel)",
    description:
      "Metadata SEO, tajuk halaman, pencarian, filter chip, label kartu, dan kartu sisi di halaman /artikel.",
    publicHref: "/artikel",
  },
  {
    key: "article_detail",
    group: "Halaman Artikel",
    title: "Tampilan Detail Artikel (/artikel/[slug])",
    description:
      "Breadcrumb, tombol kembali, daftar isi, banner CTA toko & WhatsApp, serta kartu promo di halaman baca artikel.",
    publicHref: "/artikel",
  },
  {
    key: "whatsapp_band",
    group: "Beranda",
    title: "Pita Konsultasi WhatsApp",
    description:
      "Judul, deskripsi, label tombol, dan catatan layanan pada pita konsultasi WhatsApp.",
    publicHref: "/artikel",
  },
  {
    key: "footer",
    group: "Seluruh Situs",
    title: "Footer & Saluran Resmi",
    description:
      "Kelola strip jaminan, logo & kartu unggulan, kolom tautan, judul kategori/artikel, saluran resmi, media sosial, hak cipta, dan lencana bawah.",
    publicHref: "/#kontak",
  },
];

export const SHOPEE_HOSTS = new Set(["shopee.co.id", "shp.ee", "id.shp.ee"]);

export function isSiteContentKey(value: string): value is SiteContentKey {
  return (SITE_CONTENT_KEYS as readonly string[]).includes(value);
}

export function isValidHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isShopeeHost(value: string): boolean {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    return (
      SHOPEE_HOSTS.has(host) ||
      host.endsWith(".shopee.co.id") ||
      host.endsWith(".shp.ee")
    );
  } catch {
    return false;
  }
}

export function isValidInternalOrHttpsUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return value.length >= 1;
  if (value.startsWith("#")) return value.length > 1;
  return isValidHttpsUrl(value);
}

export function isValidImageSrc(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return value.length > 1;
  return isValidHttpsUrl(value);
}

// ---------- Deep-merge & runtime safety-net helpers ----------

function asObj(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function pickStr(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

function pickHttpsUrl(value: unknown, fallback: string): string {
  if (typeof value === "string" && isValidHttpsUrl(value.trim())) {
    return value.trim();
  }
  return fallback;
}

function pickImageSrc(value: unknown, fallback: string): string {
  return resolveImageSrc(value, fallback);
}

function pickOptionalContactStr(
  contactRaw: Record<string, unknown>,
  fieldKey: string,
  fallback: string | null
): string | null {
  if (!(fieldKey in contactRaw)) {
    return fallback;
  }
  const raw = contactRaw[fieldKey];
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickStringList(
  value: unknown,
  fallback: string[],
  maxItems: number
): string[] {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, maxItems);
  return cleaned.length > 0 ? cleaned : fallback;
}

function mergeHeroCta(
  rawCta: unknown,
  legacyLabel: unknown,
  fallback: HeroCtaButton
): HeroCtaButton {
  const labelFromLegacy = pickStr(legacyLabel, fallback.label);
  if (!rawCta || typeof rawCta !== "object" || Array.isArray(rawCta)) {
    return {
      label: labelFromLegacy,
      enabled: fallback.enabled,
      target: { ...fallback.target },
    };
  }
  const obj = rawCta as Record<string, unknown>;
  const enabled = typeof obj.enabled === "boolean" ? obj.enabled : fallback.enabled;
  const label = pickStr(obj.label, labelFromLegacy);
  const rawTarget = asObj(obj.target);
  let target: CtaTarget = { ...fallback.target };

  if (isCtaTargetType(rawTarget.type)) {
    const tType = rawTarget.type;
    const tVal = typeof rawTarget.value === "string" ? rawTarget.value.trim() : "";
    if (tType === "section" && isValidHomeSectionId(tVal)) {
      target = { type: "section", value: tVal };
    } else if (tType === "page" && isValidPublicPagePath(tVal)) {
      target = { type: "page", value: tVal };
    } else if (tType === "whatsapp") {
      target = { type: "whatsapp", value: "" };
    } else if (tType === "shopee") {
      target = { type: "shopee", value: "" };
    } else if (tType === "external" && isValidExternalHttpsUrl(tVal)) {
      target = { type: "external", value: tVal };
    }
  }

  return { label, enabled, target };
}

function validateHeroCta(
  rawCta: unknown,
  legacyLabel: unknown,
  fallback: HeroCtaButton,
  requireEnabled: boolean,
  fieldPrefix: string,
  titleLabel: string,
  fieldErrors: Record<string, string>
): HeroCtaButton {
  const hasObj =
    rawCta && typeof rawCta === "object" && !Array.isArray(rawCta);
  const obj = hasObj ? (rawCta as Record<string, unknown>) : {};
  const enabled = hasObj
    ? typeof obj.enabled === "boolean"
      ? obj.enabled
      : true
    : true;

  if (requireEnabled && !enabled) {
    fieldErrors[`${fieldPrefix}.enabled`] =
      `${titleLabel} harus tetap aktif.`;
  }

  const rawLabel =
    hasObj && typeof obj.label === "string"
      ? obj.label
      : typeof legacyLabel === "string"
        ? legacyLabel
        : "";
  const trimmedLabel = rawLabel.trim();

  if (enabled) {
    const labelCheck = checkRequiredStr(
      rawLabel,
      `Label ${titleLabel.toLowerCase()}`,
      60
    );
    if (labelCheck.error) {
      fieldErrors[`${fieldPrefix}.label`] = labelCheck.error;
    }
  } else if (trimmedLabel.length > 60) {
    fieldErrors[`${fieldPrefix}.label`] =
      `Label ${titleLabel.toLowerCase()} maksimal 60 karakter.`;
  }

  let target: CtaTarget = { ...fallback.target };
  if (hasObj && obj.target && typeof obj.target === "object") {
    const rawTarget = asObj(obj.target);
    if (!isCtaTargetType(rawTarget.type)) {
      fieldErrors[`${fieldPrefix}.target`] =
        `Jenis tujuan ${titleLabel.toLowerCase()} tidak valid.`;
    } else {
      const tType = rawTarget.type;
      const tVal =
        typeof rawTarget.value === "string" ? rawTarget.value.trim() : "";
      if (tType === "section") {
        if (!isValidHomeSectionId(tVal)) {
          fieldErrors[`${fieldPrefix}.target`] =
            "Pilih bagian beranda yang valid.";
        } else {
          target = { type: "section", value: tVal };
        }
      } else if (tType === "page") {
        if (!isValidPublicPagePath(tVal)) {
          fieldErrors[`${fieldPrefix}.target`] =
            "Pilih halaman situs yang valid.";
        } else {
          target = { type: "page", value: tVal };
        }
      } else if (tType === "whatsapp") {
        target = { type: "whatsapp", value: "" };
      } else if (tType === "shopee") {
        target = { type: "shopee", value: "" };
      } else if (tType === "external") {
        if (!tVal) {
          fieldErrors[`${fieldPrefix}.target`] =
            "URL eksternal wajib diisi.";
        } else if (tVal.length > 300) {
          fieldErrors[`${fieldPrefix}.target`] =
            "URL eksternal maksimal 300 karakter.";
        } else if (!isValidExternalHttpsUrl(tVal)) {
          fieldErrors[`${fieldPrefix}.target`] =
            "URL eksternal harus menggunakan protokol https:// yang valid.";
        } else {
          target = { type: "external", value: tVal };
        }
      }
    }
  }

  return {
    label: trimmedLabel || (enabled ? fallback.label : ""),
    enabled,
    target,
  };
}

export function mergeSiteContentWithDefaults(
  byKey: Map<string, Record<string, unknown>>
): SiteData {
  const companyRaw = asObj(byKey.get("company"));
  const storeRaw = asObj(companyRaw.officialStore);
  const contactRaw = asObj(companyRaw.contact);
  const heroRaw = asObj(byKey.get("hero"));
  const badgeLeftRaw = asObj(heroRaw.overlayBadgeLeft);
  const badgeRightRaw = asObj(heroRaw.overlayBadgeRight);
  const showcaseRaw = asObj(byKey.get("category_showcase"));
  const aboutRaw = asObj(byKey.get("about"));
  const articleHubRaw = asObj(byKey.get("article_hub"));
  const articlePageRaw = asObj(byKey.get("article_page"));
  const articleDetailRaw = asObj(byKey.get("article_detail"));
  const waBandRaw = asObj(byKey.get("whatsapp_band"));
  const footerRaw = asObj(byKey.get("footer"));

  // whatsappNumber: allow explicit empty/null (renders placeholder) or valid digits;
  // only fall back to default if the key itself is absent from companyRaw.
  let whatsappNumber: string | null = SITE_DATA.whatsappNumber;
  if ("whatsappNumber" in companyRaw) {
    const rawWa = companyRaw.whatsappNumber;
    if (rawWa === null || rawWa === "") {
      whatsappNumber = null;
    } else if (typeof rawWa === "string") {
      whatsappNumber = isValidWhatsAppNumber(rawWa) ? rawWa.trim() : null;
    } else {
      whatsappNumber = null;
    }
  }

  // Trust items (1..4)
  const rawTrust = Array.isArray(heroRaw.trustItems) ? heroRaw.trustItems : null;
  const mergedTrust =
    rawTrust && rawTrust.length > 0
      ? rawTrust
          .slice(0, 4)
          .map((item, idx) => {
            const obj = asObj(item);
            const def =
              SITE_DATA.hero.trustItems[idx] ?? SITE_DATA.hero.trustItems[0];
            return {
              id: pickStr(obj.id, def.id || `trust-${idx + 1}`),
              title: pickStr(obj.title, def.title),
              subtitle: pickStr(obj.subtitle, def.subtitle),
              ...(isSupportedIconName(obj.icon) ? { icon: obj.icon } : {}),
            };
          })
      : SITE_DATA.hero.trustItems;

  // Info strip (1..4)
  const rawInfo = Array.isArray(heroRaw.infoStrip) ? heroRaw.infoStrip : null;
  const mergedInfo =
    rawInfo && rawInfo.length > 0
      ? rawInfo
          .slice(0, 4)
          .map((item, idx) => {
            const obj = asObj(item);
            const def =
              SITE_DATA.hero.infoStrip[idx] ?? SITE_DATA.hero.infoStrip[0];
            const rawHref = typeof obj.href === "string" ? obj.href.trim() : "";
            const href = isValidInternalOrHttpsUrl(rawHref) ? rawHref : def.href;
            return {
              id: pickStr(obj.id, def.id || `info-${idx + 1}`),
              label: pickStr(obj.label, def.label),
              sublabel: pickStr(obj.sublabel, def.sublabel),
              ctaLabel: pickStr(obj.ctaLabel, def.ctaLabel),
              href,
              isExternal:
                typeof obj.isExternal === "boolean"
                  ? obj.isExternal
                  : href.startsWith("https://"),
              isPlaceholder: false,
              ...(isSupportedIconName(obj.icon) ? { icon: obj.icon } : {}),
            };
          })
      : SITE_DATA.hero.infoStrip;

  // Why choose us (1..4)
  const rawWhy = Array.isArray(aboutRaw.whyChooseUs)
    ? aboutRaw.whyChooseUs
    : null;
  const mergedWhy =
    rawWhy && rawWhy.length > 0
      ? rawWhy
          .slice(0, 4)
          .map((item, idx) => {
            const obj = asObj(item);
            const def =
              SITE_DATA.about.whyChooseUs[idx] ??
              SITE_DATA.about.whyChooseUs[0];
            return {
              id: pickStr(obj.id, def.id || `why-${idx + 1}`),
              title: pickStr(obj.title, def.title),
              description: pickStr(obj.description, def.description),
              isPlaceholder: false,
              ...(isSupportedIconName(obj.icon) ? { icon: obj.icon } : {}),
            };
          })
      : SITE_DATA.about.whyChooseUs;

  return {
    companyName: pickStr(companyRaw.companyName, SITE_DATA.companyName),
    companyLegalNote: pickStr(
      companyRaw.companyLegalNote,
      SITE_DATA.companyLegalNote
    ),
    fieldDescription: pickStr(
      companyRaw.fieldDescription,
      SITE_DATA.fieldDescription
    ),
    templateBannerText: pickStr(
      companyRaw.templateBannerText,
      SITE_DATA.templateBannerText
    ),
    officialStore: {
      name: pickStr(storeRaw.name, SITE_DATA.officialStore.name),
      platform: pickStr(storeRaw.platform, SITE_DATA.officialStore.platform),
      url: pickHttpsUrl(storeRaw.url, SITE_DATA.officialStore.url),
      verificationNote: pickStr(
        storeRaw.verificationNote,
        SITE_DATA.officialStore.verificationNote
      ),
    },
    whatsappNumber,
    whatsappPlaceholderLabel: SITE_DATA.whatsappPlaceholderLabel,
    contact: {
      address: pickOptionalContactStr(
        contactRaw,
        "address",
        SITE_DATA.contact.address
      ),
      addressPlaceholder: SITE_DATA.contact.addressPlaceholder,
      phone: pickOptionalContactStr(
        contactRaw,
        "phone",
        SITE_DATA.contact.phone
      ),
      phonePlaceholder: SITE_DATA.contact.phonePlaceholder,
      email: pickOptionalContactStr(
        contactRaw,
        "email",
        SITE_DATA.contact.email
      ),
      emailPlaceholder: SITE_DATA.contact.emailPlaceholder,
      operatingHours: pickOptionalContactStr(
        contactRaw,
        "operatingHours",
        SITE_DATA.contact.operatingHours
      ),
      operatingHoursPlaceholder: SITE_DATA.contact.operatingHoursPlaceholder,
    },
    hero: {
      eyebrow: pickStr(heroRaw.eyebrow, SITE_DATA.hero.eyebrow),
      headlineMain: pickStr(heroRaw.headlineMain, SITE_DATA.hero.headlineMain),
      headlineAccent: pickStr(
        heroRaw.headlineAccent,
        SITE_DATA.hero.headlineAccent
      ),
      subheadline: pickStr(heroRaw.subheadline, SITE_DATA.hero.subheadline),
      primaryCtaLabel: mergeHeroCta(
        heroRaw.primaryCta,
        heroRaw.primaryCtaLabel,
        DEFAULT_PRIMARY_CTA
      ).label,
      secondaryCtaLabel: mergeHeroCta(
        heroRaw.secondaryCta,
        heroRaw.secondaryCtaLabel,
        DEFAULT_SECONDARY_CTA
      ).label,
      primaryCta: mergeHeroCta(
        heroRaw.primaryCta,
        heroRaw.primaryCtaLabel,
        DEFAULT_PRIMARY_CTA
      ),
      secondaryCta: mergeHeroCta(
        heroRaw.secondaryCta,
        heroRaw.secondaryCtaLabel,
        DEFAULT_SECONDARY_CTA
      ),
      imageSrc: pickImageSrc(heroRaw.imageSrc, SITE_DATA.hero.imageSrc),
      imageAlt: pickStr(heroRaw.imageAlt, SITE_DATA.hero.imageAlt),
      trustItems: mergedTrust as SiteData["hero"]["trustItems"],
      overlayBadgeLeft: {
        title: pickStr(
          badgeLeftRaw.title,
          SITE_DATA.hero.overlayBadgeLeft.title
        ),
        description: pickStr(
          badgeLeftRaw.description,
          SITE_DATA.hero.overlayBadgeLeft.description
        ),
      },
      overlayBadgeRight: {
        title: pickStr(
          badgeRightRaw.title,
          SITE_DATA.hero.overlayBadgeRight.title
        ),
        description: pickStr(
          badgeRightRaw.description,
          SITE_DATA.hero.overlayBadgeRight.description
        ),
      },
      infoStrip: mergedInfo as SiteData["hero"]["infoStrip"],
    },
    categoryShowcase: {
      pill: pickStr(showcaseRaw.pill, SITE_DATA.categoryShowcase.pill),
      heading: pickStr(showcaseRaw.heading, SITE_DATA.categoryShowcase.heading),
      description: pickStr(
        showcaseRaw.description,
        SITE_DATA.categoryShowcase.description
      ),
      ctaLabel: pickStr(
        showcaseRaw.ctaLabel,
        SITE_DATA.categoryShowcase.ctaLabel
      ),
      items: SITE_DATA.categoryShowcase.items,
    },
    about: (() => {
      const hasVisi = "visi" in aboutRaw;
      const mergedVisi = hasVisi
        ? typeof aboutRaw.visi === "string" && aboutRaw.visi.trim()
          ? aboutRaw.visi.trim()
          : null
        : SITE_DATA.about.visi ?? SITE_DATA.about.visiPlaceholder;

      const mergedMisi =
        "misi" in aboutRaw && Array.isArray(aboutRaw.misi)
          ? aboutRaw.misi
              .filter((m): m is string => typeof m === "string")
              .map((m) => m.trim())
              .filter(Boolean)
              .slice(0, 6)
          : SITE_DATA.about.misi;

      const mergedCommitmentParagraphs =
        "commitmentParagraphs" in aboutRaw &&
        Array.isArray(aboutRaw.commitmentParagraphs)
          ? aboutRaw.commitmentParagraphs
              .filter((p): p is string => typeof p === "string")
              .map((p) => p.trim())
              .filter(Boolean)
              .slice(0, 3)
          : DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS;

      const mergedCommitmentCards: AboutCommitmentCard[] =
        "commitmentCards" in aboutRaw && Array.isArray(aboutRaw.commitmentCards)
          ? aboutRaw.commitmentCards
              .slice(0, 2)
              .map((rawCard, idx) => {
                const c = asObj(rawCard);
                const defCard =
                  DEFAULT_ABOUT_COMMITMENT_CARDS[idx] ??
                  DEFAULT_ABOUT_COMMITMENT_CARDS[0];
                return {
                  id: pickStr(c.id, defCard.id),
                  badge: typeof c.badge === "string" ? c.badge.trim() : defCard.badge,
                  title: pickStr(c.title, defCard.title),
                  description: pickStr(c.description, defCard.description),
                  icon: isSupportedIconName(c.icon) ? c.icon : defCard.icon,
                };
              })
          : DEFAULT_ABOUT_COMMITMENT_CARDS;

      const mergedHistorySteps: AboutHistoryStep[] =
        "historySteps" in aboutRaw && Array.isArray(aboutRaw.historySteps)
          ? aboutRaw.historySteps.slice(0, 4).map((rawStep, idx) => {
              const s = asObj(rawStep);
              const defStep =
                DEFAULT_ABOUT_HISTORY_STEPS[idx] ??
                DEFAULT_ABOUT_HISTORY_STEPS[0];
              return {
                id: pickStr(s.id, defStep.id),
                step: pickStr(s.step, defStep.step),
                title: pickStr(s.title, defStep.title),
                description: pickStr(s.description, defStep.description),
              };
            })
          : DEFAULT_ABOUT_HISTORY_STEPS;

      const rawBadge = asObj(aboutRaw.imageBadge);
      const badgeEnabled =
        typeof rawBadge.enabled === "boolean"
          ? rawBadge.enabled
          : DEFAULT_ABOUT_IMAGE_BADGE.enabled;
      const mergedImageBadge: AboutImageBadge = {
        enabled: badgeEnabled,
        icon: isSupportedIconName(rawBadge.icon)
          ? rawBadge.icon
          : DEFAULT_ABOUT_IMAGE_BADGE.icon,
        title: badgeEnabled
          ? pickStr(rawBadge.title, DEFAULT_ABOUT_IMAGE_BADGE.title)
          : typeof rawBadge.title === "string"
          ? rawBadge.title.trim()
          : "",
        description: badgeEnabled
          ? pickStr(rawBadge.description, DEFAULT_ABOUT_IMAGE_BADGE.description)
          : typeof rawBadge.description === "string"
          ? rawBadge.description.trim()
          : "",
      };

      return {
        sectionEyebrow: pickStr(
          aboutRaw.sectionEyebrow,
          SITE_DATA.about.sectionEyebrow
        ),
        heading: pickStr(aboutRaw.heading, SITE_DATA.about.heading),
        introParagraphs: pickStringList(
          aboutRaw.introParagraphs,
          SITE_DATA.about.introParagraphs,
          4
        ),
        imagePlaceholderLabel: SITE_DATA.about.imagePlaceholderLabel,
        eyebrow: pickStr(aboutRaw.eyebrow, DEFAULT_ABOUT_EYEBROW),
        headingMain: pickStr(aboutRaw.headingMain, DEFAULT_ABOUT_HEADING_MAIN),
        headingAccent: pickStr(
          aboutRaw.headingAccent,
          DEFAULT_ABOUT_HEADING_ACCENT
        ),
        subheading: pickStr(aboutRaw.subheading, DEFAULT_ABOUT_SUBHEADING),
        imageSrc: pickImageSrc(aboutRaw.imageSrc, DEFAULT_ABOUT_IMAGE_SRC),
        imageAlt: pickStr(aboutRaw.imageAlt, DEFAULT_ABOUT_IMAGE_ALT),
        imageBadge: mergedImageBadge,
        profileTabLabel: pickStr(
          aboutRaw.profileTabLabel,
          DEFAULT_ABOUT_PROFILE_TAB_LABEL
        ),
        commitmentParagraphs: mergedCommitmentParagraphs,
        commitmentCards: mergedCommitmentCards,
        visionMissionTabLabel: pickStr(
          aboutRaw.visionMissionTabLabel,
          DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL
        ),
        visiHeading: pickStr(aboutRaw.visiHeading, DEFAULT_ABOUT_VISI_HEADING),
        visi: mergedVisi,
        visiPlaceholder: SITE_DATA.about.visiPlaceholder,
        misiHeading: pickStr(aboutRaw.misiHeading, DEFAULT_ABOUT_MISI_HEADING),
        misi: mergedMisi,
        historyTabLabel: pickStr(
          aboutRaw.historyTabLabel,
          DEFAULT_ABOUT_HISTORY_TAB_LABEL
        ),
        historySteps: mergedHistorySteps,
        whyChooseUsEyebrow: pickStr(
          aboutRaw.whyChooseUsEyebrow,
          DEFAULT_ABOUT_WHY_EYEBROW
        ),
        whyChooseUsTitle: pickStr(
          aboutRaw.whyChooseUsTitle,
          SITE_DATA.about.whyChooseUsTitle
        ),
        whyChooseUsCtaLabel: pickStr(
          aboutRaw.whyChooseUsCtaLabel,
          DEFAULT_ABOUT_WHY_CTA_LABEL
        ),
        whyChooseUs: mergedWhy as SiteData["about"]["whyChooseUs"],
      };
    })(),
    articleHub: ((): ArticleHubData => {
      const rawMax = articleHubRaw.maxSecondaryArticles;
      const maxSecondaryArticles =
        typeof rawMax === "number" &&
        Number.isInteger(rawMax) &&
        rawMax >= 1 &&
        rawMax <= 3
          ? rawMax
          : DEFAULT_ARTICLE_HUB.maxSecondaryArticles;

      const rawEmpty =
        typeof articleHubRaw.emptyStateText === "string"
          ? articleHubRaw.emptyStateText.trim()
          : DEFAULT_ARTICLE_HUB.emptyStateText;

      const rawBannerImg =
        resolveImageSrc(articleHubRaw.bannerImageSrc, null) ?? "";
      const rawBannerAlt =
        rawBannerImg && typeof articleHubRaw.bannerImageAlt === "string"
          ? articleHubRaw.bannerImageAlt.trim()
          : "";

      return {
        eyebrow: pickStr(articleHubRaw.eyebrow, DEFAULT_ARTICLE_HUB.eyebrow),
        headingMain: pickStr(
          articleHubRaw.headingMain,
          DEFAULT_ARTICLE_HUB.headingMain
        ),
        headingPill: pickStr(
          articleHubRaw.headingPill,
          DEFAULT_ARTICLE_HUB.headingPill
        ),
        headingAccent: pickStr(
          articleHubRaw.headingAccent,
          DEFAULT_ARTICLE_HUB.headingAccent
        ),
        description: pickStr(
          articleHubRaw.description,
          DEFAULT_ARTICLE_HUB.description
        ),
        allArticlesCta: mergeHeroCta(
          articleHubRaw.allArticlesCta,
          undefined,
          DEFAULT_ARTICLE_HUB_ALL_CTA
        ),
        ...mergeFilterChipsConfig(articleHubRaw, {
          ...DEFAULT_FILTER_CHIPS_CONFIG,
          allTopicsLabel: DEFAULT_ARTICLE_HUB.allTopicsLabel,
        }),
        featuredBadgePrefix: pickStr(
          articleHubRaw.featuredBadgePrefix,
          DEFAULT_ARTICLE_HUB.featuredBadgePrefix
        ),
        featuredReadMoreLabel: pickStr(
          articleHubRaw.featuredReadMoreLabel,
          DEFAULT_ARTICLE_HUB.featuredReadMoreLabel
        ),
        secondaryReadMoreLabel: pickStr(
          articleHubRaw.secondaryReadMoreLabel,
          DEFAULT_ARTICLE_HUB.secondaryReadMoreLabel
        ),
        maxSecondaryArticles,
        emptyStateText: rawEmpty,
        bannerEyebrow: pickStr(
          articleHubRaw.bannerEyebrow,
          DEFAULT_ARTICLE_HUB.bannerEyebrow
        ),
        bannerHeading: pickStr(
          articleHubRaw.bannerHeading,
          DEFAULT_ARTICLE_HUB.bannerHeading
        ),
        bannerDescription: pickStr(
          articleHubRaw.bannerDescription,
          DEFAULT_ARTICLE_HUB.bannerDescription
        ),
        whatsappCardTitle: pickStr(
          articleHubRaw.whatsappCardTitle,
          DEFAULT_ARTICLE_HUB.whatsappCardTitle
        ),
        whatsappCardSubtitle: pickStr(
          articleHubRaw.whatsappCardSubtitle,
          DEFAULT_ARTICLE_HUB.whatsappCardSubtitle
        ),
        shopeeCardTitle: pickStr(
          articleHubRaw.shopeeCardTitle,
          DEFAULT_ARTICLE_HUB.shopeeCardTitle
        ),
        shopeeCardSubtitle: pickStr(
          articleHubRaw.shopeeCardSubtitle,
          DEFAULT_ARTICLE_HUB.shopeeCardSubtitle
        ),
        bannerImageSrc: rawBannerImg,
        bannerImageAlt: rawBannerAlt,
      };
    })(),
    articlePage: ((): ArticlePageData => {
      const def = cloneArticlePageDefaults();
      const rawOg =
        typeof articlePageRaw.ogImageSrc === "string"
          ? articlePageRaw.ogImageSrc.trim()
          : "";
      const rawOgAlt =
        typeof articlePageRaw.ogImageAlt === "string"
          ? articlePageRaw.ogImageAlt.trim()
          : "";
      return {
        seoTitle: pickStr(articlePageRaw.seoTitle, def.seoTitle),
        metaDescription: pickStr(
          articlePageRaw.metaDescription,
          def.metaDescription
        ),
        ogImageSrc: resolveImageSrc(rawOg, null) ?? "",
        ogImageAlt: rawOg ? rawOgAlt : "",
        breadcrumbHomeLabel: pickStr(
          articlePageRaw.breadcrumbHomeLabel,
          def.breadcrumbHomeLabel
        ),
        breadcrumbCurrentLabel: pickStr(
          articlePageRaw.breadcrumbCurrentLabel,
          def.breadcrumbCurrentLabel
        ),
        eyebrow: pickStr(articlePageRaw.eyebrow, def.eyebrow),
        headingMain: pickStr(articlePageRaw.headingMain, def.headingMain),
        headingPill: pickStr(articlePageRaw.headingPill, def.headingPill),
        headingAccent: pickStr(articlePageRaw.headingAccent, def.headingAccent),
        description: pickStr(articlePageRaw.description, def.description),
        searchPlaceholder: pickStr(
          articlePageRaw.searchPlaceholder,
          def.searchPlaceholder
        ),
        ...mergeFilterChipsConfig(articlePageRaw, DEFAULT_FILTER_CHIPS_CONFIG),
        featuredBadgeLabel: pickStr(
          articlePageRaw.featuredBadgeLabel,
          def.featuredBadgeLabel
        ),
        featuredReadMoreLabel: pickStr(
          articlePageRaw.featuredReadMoreLabel,
          def.featuredReadMoreLabel
        ),
        draftBadgeLabel: pickStr(
          articlePageRaw.draftBadgeLabel,
          def.draftBadgeLabel
        ),
        cardReadMoreLabel: pickStr(
          articlePageRaw.cardReadMoreLabel,
          def.cardReadMoreLabel
        ),
        emptyTitle: pickStr(articlePageRaw.emptyTitle, def.emptyTitle),
        emptyResetLabel: pickStr(
          articlePageRaw.emptyResetLabel,
          def.emptyResetLabel
        ),
        sidebarPromoBadge: pickStr(
          articlePageRaw.sidebarPromoBadge,
          def.sidebarPromoBadge
        ),
        sidebarPromoTitle: pickStr(
          articlePageRaw.sidebarPromoTitle,
          def.sidebarPromoTitle
        ),
        sidebarPromoDescription: pickStr(
          articlePageRaw.sidebarPromoDescription,
          def.sidebarPromoDescription
        ),
        sidebarPromoPoints: pickStringList(
          articlePageRaw.sidebarPromoPoints,
          def.sidebarPromoPoints,
          5
        ),
        sidebarPromoButtonLabel: pickStr(
          articlePageRaw.sidebarPromoButtonLabel,
          def.sidebarPromoButtonLabel
        ),
        sidebarTopicsTitle: pickStr(
          articlePageRaw.sidebarTopicsTitle,
          def.sidebarTopicsTitle
        ),
        sidebarTopics: pickStringList(
          articlePageRaw.sidebarTopics,
          def.sidebarTopics,
          10
        ),
        sidebarConsultPrompt: pickStr(
          articlePageRaw.sidebarConsultPrompt,
          def.sidebarConsultPrompt
        ),
        sidebarConsultButtonLabel: pickStr(
          articlePageRaw.sidebarConsultButtonLabel,
          def.sidebarConsultButtonLabel
        ),
      };
    })(),
    articleDetail: ((): ArticleDetailData => {
      const def = cloneArticleDetailDefaults();
      return {
        breadcrumbHomeLabel: pickStr(
          articleDetailRaw.breadcrumbHomeLabel,
          def.breadcrumbHomeLabel
        ),
        breadcrumbHubLabel: pickStr(
          articleDetailRaw.breadcrumbHubLabel,
          def.breadcrumbHubLabel
        ),
        backToHubLabel: pickStr(
          articleDetailRaw.backToHubLabel,
          def.backToHubLabel
        ),
        draftBadgeLabel: pickStr(
          articleDetailRaw.draftBadgeLabel,
          def.draftBadgeLabel
        ),
        sectionEyebrow: pickStr(
          articleDetailRaw.sectionEyebrow,
          def.sectionEyebrow
        ),
        sectionBulletsHeading: pickStr(
          articleDetailRaw.sectionBulletsHeading,
          def.sectionBulletsHeading
        ),
        tocHeading: pickStr(articleDetailRaw.tocHeading, def.tocHeading),
        relatedHeading: pickStr(
          articleDetailRaw.relatedHeading,
          def.relatedHeading
        ),
        bottomCtaBadge: pickStr(
          articleDetailRaw.bottomCtaBadge,
          def.bottomCtaBadge
        ),
        bottomCtaHeadingTemplate: pickStr(
          articleDetailRaw.bottomCtaHeadingTemplate,
          def.bottomCtaHeadingTemplate
        ),
        bottomCtaDescription: pickStr(
          articleDetailRaw.bottomCtaDescription,
          def.bottomCtaDescription
        ),
        bottomCtaShopeeLabel: pickStr(
          articleDetailRaw.bottomCtaShopeeLabel,
          def.bottomCtaShopeeLabel
        ),
        bottomCtaWhatsappLabel: pickStr(
          articleDetailRaw.bottomCtaWhatsappLabel,
          def.bottomCtaWhatsappLabel
        ),
        sidebarPromoBadge: pickStr(
          articleDetailRaw.sidebarPromoBadge,
          def.sidebarPromoBadge
        ),
        sidebarPromoTitle: pickStr(
          articleDetailRaw.sidebarPromoTitle,
          def.sidebarPromoTitle
        ),
        sidebarPromoDescription: pickStr(
          articleDetailRaw.sidebarPromoDescription,
          def.sidebarPromoDescription
        ),
        sidebarPromoPoints: pickStringList(
          articleDetailRaw.sidebarPromoPoints,
          def.sidebarPromoPoints,
          5
        ),
        sidebarPromoButtonLabel: pickStr(
          articleDetailRaw.sidebarPromoButtonLabel,
          def.sidebarPromoButtonLabel
        ),
      };
    })(),
    whatsappBand: {
      heading: pickStr(waBandRaw.heading, SITE_DATA.whatsappBand.heading),
      description: pickStr(
        waBandRaw.description,
        SITE_DATA.whatsappBand.description
      ),
      buttonLabel: pickStr(
        waBandRaw.buttonLabel,
        SITE_DATA.whatsappBand.buttonLabel
      ),
      disabledHint: pickStr(
        waBandRaw.disabledHint,
        SITE_DATA.whatsappBand.disabledHint
      ),
    },
    footer: (() => {
      const defaults = cloneFooterDefaults();
      const rawHighlights = Array.isArray(footerRaw.highlights)
        ? footerRaw.highlights
        : null;
      const highlights: FooterHighlightItem[] =
        rawHighlights && rawHighlights.length > 0
          ? rawHighlights
              .slice(0, 4)
              .map((item, idx) => {
                const obj = asObj(item);
                const fb = defaults.highlights[idx] ?? defaults.highlights[0];
                const rawIcon = typeof obj.icon === "string" ? obj.icon : "";
                return {
                  icon: isSupportedIconName(rawIcon) ? rawIcon : fb.icon,
                  title: pickStr(obj.title, fb.title),
                  subtitle: pickStr(obj.subtitle, fb.subtitle),
                };
              })
          : defaults.highlights;

      const rawFlagship = asObj(footerRaw.flagshipCard);
      const flagshipMergedCta = mergeHeroCta(
        {
          enabled: true,
          label: defaults.flagshipCard.linkLabel,
          target: rawFlagship.target,
        },
        undefined,
        {
          enabled: true,
          label: defaults.flagshipCard.linkLabel,
          target: defaults.flagshipCard.target,
        }
      );
      const flagshipTarget = flagshipMergedCta.target;
      const flagshipCard = {
        enabled:
          typeof rawFlagship.enabled === "boolean"
            ? rawFlagship.enabled
            : defaults.flagshipCard.enabled,
        eyebrow: pickStr(rawFlagship.eyebrow, defaults.flagshipCard.eyebrow),
        title: pickStr(rawFlagship.title, defaults.flagshipCard.title),
        description: pickStr(
          rawFlagship.description,
          defaults.flagshipCard.description
        ),
        linkLabel: pickStr(
          rawFlagship.linkLabel,
          defaults.flagshipCard.linkLabel
        ),
        target: flagshipTarget,
      };

      const rawColumns = Array.isArray(footerRaw.linkColumns)
        ? footerRaw.linkColumns
        : null;
      const linkColumns: FooterLinkColumn[] =
        rawColumns && rawColumns.length > 0
          ? rawColumns.slice(0, 3).map((colItem, colIdx) => {
              const colObj = asObj(colItem);
              const fbCol =
                defaults.linkColumns[colIdx] ?? defaults.linkColumns[0];
              const rawLinks = Array.isArray(colObj.links)
                ? colObj.links
                : null;
              const links: FooterNavLink[] =
                rawLinks && rawLinks.length > 0
                  ? rawLinks
                      .slice(0, 8)
                      .map((lnkItem) => {
                        const lnkObj = asObj(lnkItem);
                        const label = pickStr(lnkObj.label, "");
                        if (!label) return null;
                        const mergedLnk = mergeHeroCta(
                          { enabled: true, label, target: lnkObj.target },
                          undefined,
                          {
                            enabled: true,
                            label,
                            target: { type: "page", value: "/" },
                          }
                        );
                        return {
                          label,
                          target: mergedLnk.target,
                        };
                      })
                      .filter((x): x is FooterNavLink => x !== null)
                  : fbCol.links;
              return {
                heading: pickStr(colObj.heading, fbCol.heading),
                links: links.length > 0 ? links : fbCol.links,
              };
            })
          : defaults.linkColumns;

      const rawSocial = Array.isArray(footerRaw.socialLinks)
        ? footerRaw.socialLinks
        : [];
      const socialLinks: FooterSocialLink[] = rawSocial
        .slice(0, 6)
        .map((item) => {
          const obj = asObj(item);
          const platform = pickStr(obj.platform, "");
          const url = pickStr(obj.url, "");
          if (!platform || !isValidExternalHttpsUrl(url)) return null;
          return { platform, url };
        })
        .filter((x): x is FooterSocialLink => x !== null);

      const rawBadges = Array.isArray(footerRaw.legalBadges)
        ? footerRaw.legalBadges
            .filter((b): b is string => typeof b === "string")
            .map((b) => b.trim())
            .filter(Boolean)
            .slice(0, 4)
        : defaults.legalBadges;

      const logoSrcRaw =
        typeof footerRaw.logoSrc === "string" ? footerRaw.logoSrc.trim() : "";

      return {
        highlights,
        logoSrc: resolveImageSrc(logoSrcRaw, null) ?? "",
        logoAlt:
          typeof footerRaw.logoAlt === "string"
            ? footerRaw.logoAlt.trim()
            : "",
        brandSubtitle: pickStr(
          footerRaw.brandSubtitle,
          defaults.brandSubtitle
        ),
        blurb: pickStr(footerRaw.blurb, defaults.blurb),
        flagshipCard,
        linkColumns,
        productCategoriesHeading: pickStr(
          footerRaw.productCategoriesHeading,
          defaults.productCategoriesHeading
        ),
        featuredArticlesHeading: pickStr(
          footerRaw.featuredArticlesHeading,
          defaults.featuredArticlesHeading
        ),
        channelsHeading: pickStr(
          footerRaw.channelsHeading,
          defaults.channelsHeading
        ),
        storeCardBadge: pickStr(
          footerRaw.storeCardBadge,
          defaults.storeCardBadge
        ),
        storeCardBadgeRight: pickStr(
          footerRaw.storeCardBadgeRight,
          defaults.storeCardBadgeRight
        ),
        storeCardTitle: pickStr(
          footerRaw.storeCardTitle,
          defaults.storeCardTitle
        ),
        storeCardDescription: pickStr(
          footerRaw.storeCardDescription,
          defaults.storeCardDescription
        ),
        storeButtonLabel: pickStr(
          footerRaw.storeButtonLabel,
          defaults.storeButtonLabel
        ),
        whatsappCardTitle: pickStr(
          footerRaw.whatsappCardTitle,
          defaults.whatsappCardTitle
        ),
        whatsappCardDescription: pickStr(
          footerRaw.whatsappCardDescription,
          defaults.whatsappCardDescription
        ),
        whatsappButtonLabel: pickStr(
          footerRaw.whatsappButtonLabel,
          defaults.whatsappButtonLabel
        ),
        contactHeading: pickStr(
          footerRaw.contactHeading,
          defaults.contactHeading
        ),
        socialLinks,
        copyrightText: pickStr(
          footerRaw.copyrightText,
          defaults.copyrightText
        ),
        legalBadges: rawBadges,
      };
    })(),
  };
}

// ---------- Block defaults & server-side validators ----------

export interface CompanyBlockValue {
  companyName: string;
  companyLegalNote: string;
  fieldDescription: string;
  officialStore: {
    name: string;
    platform: string;
    url: string;
    verificationNote: string;
  };
  whatsappNumber: string | null;
  contact: {
    address: string;
    phone: string;
    email: string;
    operatingHours: string;
  };
}

export interface HeroItemWithIcon {
  id: string;
  title: string;
  subtitle: string;
  icon: SupportedIconName;
}

export interface HeroInfoItemWithIcon {
  id: string;
  label: string;
  sublabel: string;
  ctaLabel: string;
  href: string;
  isExternal: boolean;
  icon: SupportedIconName;
}

export interface HeroBlockValue {
  eyebrow: string;
  headlineMain: string;
  headlineAccent: string;
  subheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  imageSrc: string;
  imageAlt: string;
  trustItems: HeroItemWithIcon[];
  overlayBadgeLeft: { title: string; description: string };
  overlayBadgeRight: { title: string; description: string };
  infoStrip: HeroInfoItemWithIcon[];
}

export interface CategoryShowcaseBlockValue {
  pill: string;
  heading: string;
  description: string;
  ctaLabel: string;
}

export interface WhyChooseUsWithIcon {
  id: string;
  title: string;
  description: string;
  icon: SupportedIconName;
}

export interface AboutBlockValue {
  sectionEyebrow: string;
  heading: string;
  introParagraphs: string[];
  visi: string;
  misi: string[];
  whyChooseUsTitle: string;
  whyChooseUs: WhyChooseUsWithIcon[];
}

export interface WhatsAppBandBlockValue {
  heading: string;
  description: string;
  buttonLabel: string;
  disabledHint: string;
}

export type FooterBlockValue = FooterData;

const DEFAULT_TRUST_ICONS: SupportedIconName[] = [
  "ShieldCheck",
  "Leaf",
  "PackageCheck",
  "ShoppingBag",
];
const DEFAULT_INFO_ICONS: SupportedIconName[] = [
  "ShoppingBag",
  "MessageCircle",
  "Sprout",
  "Package",
];
const DEFAULT_WHY_ICONS: SupportedIconName[] = [
  "FlaskConical",
  "FileCheck2",
  "ShoppingBag",
  "BookOpen",
];

export function getDefaultBlockValue(key: SiteContentKey): Record<string, unknown> {
  switch (key) {
    case "company":
      return {
        companyName: SITE_DATA.companyName,
        companyLegalNote: SITE_DATA.companyLegalNote,
        fieldDescription: SITE_DATA.fieldDescription,
        templateBannerText: SITE_DATA.templateBannerText,
        officialStore: { ...SITE_DATA.officialStore },
        whatsappNumber: SITE_DATA.whatsappNumber,
        whatsappPlaceholderLabel: SITE_DATA.whatsappPlaceholderLabel,
        contact: {
          address: SITE_DATA.contact.address ?? "",
          addressPlaceholder: SITE_DATA.contact.addressPlaceholder,
          phone: SITE_DATA.contact.phone ?? "",
          phonePlaceholder: SITE_DATA.contact.phonePlaceholder,
          email: SITE_DATA.contact.email ?? "",
          emailPlaceholder: SITE_DATA.contact.emailPlaceholder,
          operatingHours: SITE_DATA.contact.operatingHours ?? "",
          operatingHoursPlaceholder:
            SITE_DATA.contact.operatingHoursPlaceholder,
        },
      };
    case "hero":
      return {
        eyebrow: SITE_DATA.hero.eyebrow,
        headlineMain: SITE_DATA.hero.headlineMain,
        headlineAccent: SITE_DATA.hero.headlineAccent,
        subheadline: SITE_DATA.hero.subheadline,
        primaryCtaLabel: DEFAULT_PRIMARY_CTA.label,
        secondaryCtaLabel: DEFAULT_SECONDARY_CTA.label,
        primaryCta: {
          ...DEFAULT_PRIMARY_CTA,
          target: { type: "section", value: HOME_SECTION_IDS.PRODUK },
        },
        secondaryCta: {
          ...DEFAULT_SECONDARY_CTA,
          target: { ...DEFAULT_SECONDARY_CTA.target },
        },
        imageSrc: SITE_DATA.hero.imageSrc,
        imageAlt: SITE_DATA.hero.imageAlt,
        trustItems: SITE_DATA.hero.trustItems.map((item, idx) => ({
          ...item,
          icon: DEFAULT_TRUST_ICONS[idx] ?? "ShieldCheck",
        })),
        overlayBadgeLeft: { ...SITE_DATA.hero.overlayBadgeLeft },
        overlayBadgeRight: { ...SITE_DATA.hero.overlayBadgeRight },
        infoStrip: SITE_DATA.hero.infoStrip.map((item, idx) => ({
          ...item,
          icon: DEFAULT_INFO_ICONS[idx] ?? "Sprout",
        })),
      };
    case "category_showcase":
      return {
        pill: SITE_DATA.categoryShowcase.pill,
        heading: SITE_DATA.categoryShowcase.heading,
        description: SITE_DATA.categoryShowcase.description,
        ctaLabel: SITE_DATA.categoryShowcase.ctaLabel,
      };
    case "about":
      return {
        sectionEyebrow: SITE_DATA.about.sectionEyebrow,
        heading: SITE_DATA.about.heading,
        introParagraphs: [...SITE_DATA.about.introParagraphs],
        imagePlaceholderLabel: SITE_DATA.about.imagePlaceholderLabel,
        eyebrow: DEFAULT_ABOUT_EYEBROW,
        headingMain: DEFAULT_ABOUT_HEADING_MAIN,
        headingAccent: DEFAULT_ABOUT_HEADING_ACCENT,
        subheading: DEFAULT_ABOUT_SUBHEADING,
        imageSrc: DEFAULT_ABOUT_IMAGE_SRC,
        imageAlt: DEFAULT_ABOUT_IMAGE_ALT,
        imageBadge: { ...DEFAULT_ABOUT_IMAGE_BADGE },
        profileTabLabel: DEFAULT_ABOUT_PROFILE_TAB_LABEL,
        commitmentParagraphs: [...DEFAULT_ABOUT_COMMITMENT_PARAGRAPHS],
        commitmentCards: DEFAULT_ABOUT_COMMITMENT_CARDS.map((c) => ({ ...c })),
        visionMissionTabLabel: DEFAULT_ABOUT_VISION_MISSION_TAB_LABEL,
        visiHeading: DEFAULT_ABOUT_VISI_HEADING,
        visi: SITE_DATA.about.visi ?? "",
        visiPlaceholder: SITE_DATA.about.visiPlaceholder,
        misiHeading: DEFAULT_ABOUT_MISI_HEADING,
        misi: [...SITE_DATA.about.misi],
        historyTabLabel: DEFAULT_ABOUT_HISTORY_TAB_LABEL,
        historySteps: DEFAULT_ABOUT_HISTORY_STEPS.map((s) => ({ ...s })),
        whyChooseUsEyebrow: DEFAULT_ABOUT_WHY_EYEBROW,
        whyChooseUsTitle: SITE_DATA.about.whyChooseUsTitle,
        whyChooseUsCtaLabel: DEFAULT_ABOUT_WHY_CTA_LABEL,
        whyChooseUs: SITE_DATA.about.whyChooseUs.map((item, idx) => ({
          ...item,
          icon: DEFAULT_WHY_ICONS[idx] ?? "FlaskConical",
        })),
      };
    case "article_hub":
      return {
        ...DEFAULT_ARTICLE_HUB,
        allArticlesCta: {
          label: DEFAULT_ARTICLE_HUB_ALL_CTA.label,
          enabled: DEFAULT_ARTICLE_HUB_ALL_CTA.enabled,
          target: { ...DEFAULT_ARTICLE_HUB_ALL_CTA.target },
        },
      };
    case "article_page":
      return cloneArticlePageDefaults() as unknown as Record<string, unknown>;
    case "article_detail":
      return cloneArticleDetailDefaults() as unknown as Record<string, unknown>;
    case "whatsapp_band":
      return { ...SITE_DATA.whatsappBand };
    case "footer":
      return cloneFooterDefaults() as unknown as Record<string, unknown>;
  }
}

export function getDefaultCategoriesPayload() {
  return productCategories.map((cat, idx) => ({
    id: `cat-${idx + 1}`,
    slug:
      cat.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `kategori-${idx + 1}`,
    name: cat.name,
    description: cat.description,
    image_src: cat.image,
    image_alt: cat.alt,
    external_url: SHOPEE_STORE_URL,
    sort_order: idx,
  }));
}

export type BlockValidationResult =
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; fieldErrors: Record<string, string>; formError: string };

function checkRequiredStr(
  raw: unknown,
  label: string,
  maxLen: number
): { value: string; error?: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return { value: "", error: `${label} wajib diisi.` };
  if (value.length > maxLen) {
    return { value, error: `${label} maksimal ${maxLen} karakter.` };
  }
  return { value };
}

function checkOptionalStr(
  raw: unknown,
  label: string,
  maxLen: number
): { value: string; error?: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (value.length > maxLen) {
    return { value, error: `${label} maksimal ${maxLen} karakter.` };
  }
  return { value };
}

export function validateSiteContentBlock(
  key: SiteContentKey,
  rawInput: unknown
): BlockValidationResult {
  const input = asObj(rawInput);
  const fieldErrors: Record<string, string> = {};

  if (key === "company") {
    const companyName = checkRequiredStr(
      input.companyName,
      "Nama perusahaan",
      100
    );
    if (companyName.error) fieldErrors.companyName = companyName.error;

    const companyLegalNoteVal =
      typeof input.companyLegalNote === "string" &&
      input.companyLegalNote.trim()
        ? input.companyLegalNote.trim()
        : SITE_DATA.companyLegalNote;

    const fieldDescription = checkRequiredStr(
      input.fieldDescription,
      "Deskripsi perusahaan",
      400
    );
    if (fieldDescription.error)
      fieldErrors.fieldDescription = fieldDescription.error;

    const store = asObj(input.officialStore);
    const storeName = checkRequiredStr(store.name, "Nama toko resmi", 80);
    if (storeName.error) fieldErrors["officialStore.name"] = storeName.error;

    const storePlatform = checkRequiredStr(store.platform, "Platform toko", 40);
    if (storePlatform.error)
      fieldErrors["officialStore.platform"] = storePlatform.error;

    const storeUrl = checkRequiredStr(store.url, "URL toko resmi", 300);
    if (storeUrl.error) {
      fieldErrors["officialStore.url"] = storeUrl.error;
    } else if (!isValidHttpsUrl(storeUrl.value)) {
      fieldErrors["officialStore.url"] =
        "URL toko resmi harus menggunakan protokol https:// yang valid.";
    }

    const storeNoteVal =
      typeof store.verificationNote === "string" &&
      store.verificationNote.trim()
        ? store.verificationNote.trim()
        : SITE_DATA.officialStore.verificationNote;

    const waRaw =
      typeof input.whatsappNumber === "string"
        ? input.whatsappNumber.trim()
        : "";
    if (waRaw && !isValidWhatsAppNumber(waRaw)) {
      fieldErrors.whatsappNumber =
        "Nomor WhatsApp harus berupa 9–15 digit angka tanpa tanda + atau spasi (contoh: 6281234567890).";
    }

    const contact = asObj(input.contact);
    const checkOptionalContact = (
      raw: unknown,
      label: string,
      maxLen: number
    ): { value: string | null; error?: string } => {
      if (raw === null || raw === undefined) return { value: null };
      if (typeof raw !== "string") return { value: null };
      const trimmed = raw.trim();
      if (!trimmed) return { value: null };
      if (trimmed.length > maxLen) {
        return {
          value: trimmed,
          error: `${label} maksimal ${maxLen} karakter.`,
        };
      }
      return { value: trimmed };
    };

    const address = checkOptionalContact(
      contact.address,
      "Alamat / cakupan",
      250
    );
    if (address.error) fieldErrors["contact.address"] = address.error;

    const phone = checkOptionalContact(
      contact.phone,
      "Keterangan telepon",
      120
    );
    if (phone.error) fieldErrors["contact.phone"] = phone.error;

    const email = checkOptionalContact(
      contact.email,
      "Keterangan email/layanan",
      120
    );
    if (email.error) fieldErrors["contact.email"] = email.error;

    const operatingHours = checkOptionalContact(
      contact.operatingHours,
      "Jam operasional",
      100
    );
    if (operatingHours.error)
      fieldErrors["contact.operatingHours"] = operatingHours.error;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        companyName: companyName.value,
        companyLegalNote: companyLegalNoteVal,
        fieldDescription: fieldDescription.value,
        templateBannerText: SITE_DATA.templateBannerText,
        officialStore: {
          name: storeName.value,
          platform: storePlatform.value,
          url: storeUrl.value,
          verificationNote: storeNoteVal,
        },
        whatsappNumber: waRaw || null,
        whatsappPlaceholderLabel: SITE_DATA.whatsappPlaceholderLabel,
        contact: {
          address: address.value,
          addressPlaceholder: SITE_DATA.contact.addressPlaceholder,
          phone: phone.value,
          phonePlaceholder: SITE_DATA.contact.phonePlaceholder,
          email: email.value,
          emailPlaceholder: SITE_DATA.contact.emailPlaceholder,
          operatingHours: operatingHours.value,
          operatingHoursPlaceholder:
            SITE_DATA.contact.operatingHoursPlaceholder,
        },
      },
    };
  }

  if (key === "hero") {
    const eyebrow = checkRequiredStr(input.eyebrow, "Teks eyebrow", 100);
    if (eyebrow.error) fieldErrors.eyebrow = eyebrow.error;

    const headlineMainVal =
      typeof input.headlineMain === "string" && input.headlineMain.trim()
        ? input.headlineMain.trim()
        : SITE_DATA.hero.headlineMain;

    const headlineAccent = checkRequiredStr(
      input.headlineAccent,
      "Judul utama (sorotan hijau)",
      100
    );
    if (headlineAccent.error) fieldErrors.headlineAccent = headlineAccent.error;

    const subheadline = checkRequiredStr(input.subheadline, "Subjudul", 350);
    if (subheadline.error) fieldErrors.subheadline = subheadline.error;

    const primaryCta = validateHeroCta(
      input.primaryCta,
      input.primaryCtaLabel,
      DEFAULT_PRIMARY_CTA,
      true,
      "primaryCta",
      "Tombol Utama",
      fieldErrors
    );

    const secondaryCta = validateHeroCta(
      input.secondaryCta,
      input.secondaryCtaLabel,
      DEFAULT_SECONDARY_CTA,
      false,
      "secondaryCta",
      "Tombol Kedua",
      fieldErrors
    );

    const rawImageSrc =
      typeof input.imageSrc === "string" ? input.imageSrc.trim() : "";
    const rawImageAlt =
      typeof input.imageAlt === "string" ? input.imageAlt.trim() : "";

    let finalImageSrc = "";
    let finalImageAlt = "";

    if (rawImageSrc.length > 0) {
      if (rawImageSrc.length > 500) {
        fieldErrors.imageSrc = "Gambar hero maksimal 500 karakter.";
      } else if (!isValidImageSrc(rawImageSrc)) {
        fieldErrors.imageSrc = "URL gambar harus diawali / atau https://.";
      } else {
        finalImageSrc = rawImageSrc;
      }

      const imageAlt = checkRequiredStr(
        input.imageAlt,
        "Teks alternatif (alt) gambar hero",
        250
      );
      if (imageAlt.error) {
        fieldErrors.imageAlt = imageAlt.error;
      } else {
        finalImageAlt = imageAlt.value;
      }
    } else if (rawImageAlt.length > 250) {
      fieldErrors.imageAlt =
        "Teks alternatif (alt) gambar hero maksimal 250 karakter.";
    }

    const badgeLeft = asObj(input.overlayBadgeLeft);
    const blTitle = checkRequiredStr(
      badgeLeft.title,
      "Judul lencana kiri",
      80
    );
    if (blTitle.error) fieldErrors["overlayBadgeLeft.title"] = blTitle.error;
    const blDesc = checkRequiredStr(
      badgeLeft.description,
      "Deskripsi lencana kiri",
      200
    );
    if (blDesc.error)
      fieldErrors["overlayBadgeLeft.description"] = blDesc.error;

    const badgeRight = asObj(input.overlayBadgeRight);
    const brTitle = checkRequiredStr(
      badgeRight.title,
      "Judul lencana kanan",
      80
    );
    if (brTitle.error) fieldErrors["overlayBadgeRight.title"] = brTitle.error;
    const brDesc = checkRequiredStr(
      badgeRight.description,
      "Deskripsi lencana kanan",
      200
    );
    if (brDesc.error)
      fieldErrors["overlayBadgeRight.description"] = brDesc.error;

    const trustItems = Array.isArray(input.trustItems) && input.trustItems.length > 0
      ? input.trustItems
      : getDefaultBlockValue("hero").trustItems;

    const infoStrip = Array.isArray(input.infoStrip) && input.infoStrip.length > 0
      ? input.infoStrip
      : getDefaultBlockValue("hero").infoStrip;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        eyebrow: eyebrow.value,
        headlineMain: headlineMainVal,
        headlineAccent: headlineAccent.value,
        subheadline: subheadline.value,
        primaryCtaLabel: primaryCta.label,
        secondaryCtaLabel: secondaryCta.label,
        primaryCta,
        secondaryCta,
        imageSrc: finalImageSrc,
        imageAlt: finalImageAlt,
        trustItems,
        overlayBadgeLeft: { title: blTitle.value, description: blDesc.value },
        overlayBadgeRight: { title: brTitle.value, description: brDesc.value },
        infoStrip,
      },
    };
  }

  if (key === "category_showcase") {
    const pill = checkRequiredStr(input.pill, "Label pill", 60);
    if (pill.error) fieldErrors.pill = pill.error;

    const heading = checkRequiredStr(input.heading, "Judul bagian", 140);
    if (heading.error) fieldErrors.heading = heading.error;

    const description = checkRequiredStr(input.description, "Deskripsi", 350);
    if (description.error) fieldErrors.description = description.error;

    const ctaLabel = checkRequiredStr(input.ctaLabel, "Label tautan", 60);
    if (ctaLabel.error) fieldErrors.ctaLabel = ctaLabel.error;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        pill: pill.value,
        heading: heading.value,
        description: description.value,
        ctaLabel: ctaLabel.value,
      },
    };
  }

  if (key === "about") {
    const eyebrow = checkRequiredStr(input.eyebrow, "Label bagian", 60);
    if (eyebrow.error) fieldErrors.eyebrow = eyebrow.error;

    const headingMain = checkRequiredStr(
      input.headingMain,
      "Judul utama (baris pertama)",
      80
    );
    if (headingMain.error) fieldErrors.headingMain = headingMain.error;

    const headingAccent = checkRequiredStr(
      input.headingAccent,
      "Judul utama (teks beraksen)",
      80
    );
    if (headingAccent.error) fieldErrors.headingAccent = headingAccent.error;

    const subheading = checkRequiredStr(
      input.subheading,
      "Subjudul bagian",
      350
    );
    if (subheading.error) fieldErrors.subheading = subheading.error;

    const rawImageSrc =
      typeof input.imageSrc === "string" ? input.imageSrc.trim() : "";
    const rawImageAlt =
      typeof input.imageAlt === "string" ? input.imageAlt.trim() : "";

    let finalImageSrc = "";
    let finalImageAlt = "";

    if (rawImageSrc.length > 0) {
      if (rawImageSrc.length > 500) {
        fieldErrors.imageSrc = "Gambar Tentang Kami maksimal 500 karakter.";
      } else if (!isValidImageSrc(rawImageSrc)) {
        fieldErrors.imageSrc = "URL gambar harus diawali / atau https://.";
      } else {
        finalImageSrc = rawImageSrc;
      }

      const imageAlt = checkRequiredStr(
        input.imageAlt,
        "Teks alternatif (alt) gambar",
        250
      );
      if (imageAlt.error) {
        fieldErrors.imageAlt = imageAlt.error;
      } else {
        finalImageAlt = imageAlt.value;
      }
    } else if (rawImageAlt.length > 250) {
      fieldErrors.imageAlt =
        "Teks alternatif (alt) gambar maksimal 250 karakter.";
    }

    const rawBadge = asObj(input.imageBadge);
    const badgeEnabled = rawBadge.enabled !== false;
    let badgeTitleVal =
      typeof rawBadge.title === "string" ? rawBadge.title.trim() : "";
    let badgeDescVal =
      typeof rawBadge.description === "string"
        ? rawBadge.description.trim()
        : "";
    if (badgeEnabled) {
      const bTitle = checkRequiredStr(
        rawBadge.title,
        "Judul kartu di atas gambar",
        80
      );
      if (bTitle.error) fieldErrors["imageBadge.title"] = bTitle.error;
      badgeTitleVal = bTitle.value;

      const bDesc = checkRequiredStr(
        rawBadge.description,
        "Deskripsi kartu di atas gambar",
        200
      );
      if (bDesc.error) fieldErrors["imageBadge.description"] = bDesc.error;
      badgeDescVal = bDesc.value;
    }

    const profileTabLabel = checkRequiredStr(
      input.profileTabLabel,
      "Label tab Profil & Komitmen",
      40
    );
    if (profileTabLabel.error)
      fieldErrors.profileTabLabel = profileTabLabel.error;

    const commitmentParagraphs = Array.isArray(input.commitmentParagraphs)
      ? input.commitmentParagraphs
          .filter((p): p is string => typeof p === "string")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
    if (commitmentParagraphs.length > 3) {
      fieldErrors.commitmentParagraphs =
        "Paragraf komitmen maksimal 3 paragraf.";
    } else if (commitmentParagraphs.some((p) => p.length > 500)) {
      fieldErrors.commitmentParagraphs =
        "Setiap paragraf komitmen maksimal 500 karakter.";
    }

    const rawCommitCards = Array.isArray(input.commitmentCards)
      ? input.commitmentCards
      : [];
    const commitmentCards: AboutCommitmentCard[] = [];
    if (rawCommitCards.length > 2) {
      fieldErrors.commitmentCards = "Kartu komitmen maksimal 2 kartu.";
    } else {
      rawCommitCards.forEach((rawCard, idx) => {
        const obj = asObj(rawCard);
        const badgeStr =
          typeof obj.badge === "string" ? obj.badge.trim() : "";
        if (badgeStr.length > 40) {
          fieldErrors.commitmentCards = `Label kecil kartu komitmen #${idx + 1} maksimal 40 karakter.`;
        }
        const cTitle = checkRequiredStr(
          obj.title,
          `Judul kartu komitmen #${idx + 1}`,
          60
        );
        const cDesc = checkRequiredStr(
          obj.description,
          `Deskripsi kartu komitmen #${idx + 1}`,
          200
        );
        if (cTitle.error || cDesc.error) {
          fieldErrors.commitmentCards = cTitle.error ?? cDesc.error ?? "";
        }
        commitmentCards.push({
          id:
            typeof obj.id === "string" && obj.id.trim()
              ? obj.id.trim()
              : `commit-${idx + 1}`,
          badge: badgeStr,
          title: cTitle.value,
          description: cDesc.value,
          icon: isSupportedIconName(obj.icon) ? obj.icon : "CheckCircle2",
        });
      });
    }

    const visionMissionTabLabel = checkRequiredStr(
      input.visionMissionTabLabel,
      "Label tab Visi & Misi",
      40
    );
    if (visionMissionTabLabel.error)
      fieldErrors.visionMissionTabLabel = visionMissionTabLabel.error;

    const visiHeading = checkRequiredStr(
      input.visiHeading,
      "Judul Visi",
      40
    );
    if (visiHeading.error) fieldErrors.visiHeading = visiHeading.error;

    const rawVisi = typeof input.visi === "string" ? input.visi.trim() : "";
    if (rawVisi.length > 400) {
      fieldErrors.visi = "Visi perusahaan maksimal 400 karakter.";
    }
    const finalVisi = rawVisi.length > 0 ? rawVisi : null;

    const misiHeading = checkRequiredStr(
      input.misiHeading,
      "Judul Misi",
      40
    );
    if (misiHeading.error) fieldErrors.misiHeading = misiHeading.error;

    const misi = Array.isArray(input.misi)
      ? input.misi
          .filter((m): m is string => typeof m === "string")
          .map((m) => m.trim())
          .filter(Boolean)
      : [];
    if (misi.length > 6) {
      fieldErrors.misi = "Daftar misi maksimal 6 poin.";
    } else if (misi.some((m) => m.length > 240)) {
      fieldErrors.misi = "Setiap poin misi maksimal 240 karakter.";
    }

    const historyTabLabel = checkRequiredStr(
      input.historyTabLabel,
      "Label tab Sejarah",
      40
    );
    if (historyTabLabel.error)
      fieldErrors.historyTabLabel = historyTabLabel.error;

    const rawHistorySteps = Array.isArray(input.historySteps)
      ? input.historySteps
      : [];
    const historySteps: AboutHistoryStep[] = [];
    if (rawHistorySteps.length > 4) {
      fieldErrors.historySteps = "Langkah sejarah maksimal 4 langkah.";
    } else {
      rawHistorySteps.forEach((rawStep, idx) => {
        const obj = asObj(rawStep);
        const sStep = checkRequiredStr(
          obj.step,
          `Nomor/kode tahap #${idx + 1}`,
          10
        );
        const sTitle = checkRequiredStr(
          obj.title,
          `Judul tahap sejarah #${idx + 1}`,
          60
        );
        const sDesc = checkRequiredStr(
          obj.description,
          `Deskripsi tahap sejarah #${idx + 1}`,
          220
        );
        if (sStep.error || sTitle.error || sDesc.error) {
          fieldErrors.historySteps =
            sStep.error ?? sTitle.error ?? sDesc.error ?? "";
        }
        historySteps.push({
          id:
            typeof obj.id === "string" && obj.id.trim()
              ? obj.id.trim()
              : `hist-${idx + 1}`,
          step: sStep.value,
          title: sTitle.value,
          description: sDesc.value,
        });
      });
    }

    const whyChooseUsEyebrow = checkRequiredStr(
      input.whyChooseUsEyebrow,
      "Label atas keunggulan produk",
      40
    );
    if (whyChooseUsEyebrow.error)
      fieldErrors.whyChooseUsEyebrow = whyChooseUsEyebrow.error;

    const whyChooseUsTitle = checkRequiredStr(
      input.whyChooseUsTitle,
      "Judul keunggulan produk",
      100
    );
    if (whyChooseUsTitle.error)
      fieldErrors.whyChooseUsTitle = whyChooseUsTitle.error;

    const whyChooseUsCtaLabel = checkRequiredStr(
      input.whyChooseUsCtaLabel,
      "Label tombol keunggulan produk",
      50
    );
    if (whyChooseUsCtaLabel.error)
      fieldErrors.whyChooseUsCtaLabel = whyChooseUsCtaLabel.error;

    const rawWhy = Array.isArray(input.whyChooseUs) ? input.whyChooseUs : [];
    const whyChooseUs: WhyChooseUsWithIcon[] = [];
    if (rawWhy.length < 1 || rawWhy.length > 4) {
      fieldErrors.whyChooseUs =
        "Kartu keunggulan harus berjumlah 1 sampai 4 kartu.";
    } else {
      rawWhy.forEach((rawItem, idx) => {
        const obj = asObj(rawItem);
        const wTitle = checkRequiredStr(
          obj.title,
          `Judul keunggulan #${idx + 1}`,
          80
        );
        const wDesc = checkRequiredStr(
          obj.description,
          `Deskripsi keunggulan #${idx + 1}`,
          240
        );
        if (wTitle.error || wDesc.error) {
          fieldErrors.whyChooseUs = wTitle.error ?? wDesc.error ?? "";
        }
        whyChooseUs.push({
          id:
            typeof obj.id === "string" && obj.id.trim()
              ? obj.id.trim()
              : `why-${idx + 1}`,
          title: wTitle.value,
          description: wDesc.value,
          icon: isSupportedIconName(obj.icon)
            ? obj.icon
            : DEFAULT_WHY_ICONS[idx] ?? "FlaskConical",
        });
      });
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    const sectionEyebrowVal =
      typeof input.sectionEyebrow === "string" && input.sectionEyebrow.trim()
        ? input.sectionEyebrow.trim()
        : SITE_DATA.about.sectionEyebrow;
    const headingVal =
      typeof input.heading === "string" && input.heading.trim()
        ? input.heading.trim()
        : SITE_DATA.about.heading;
    const rawIntro = Array.isArray(input.introParagraphs)
      ? input.introParagraphs
          .filter((p): p is string => typeof p === "string")
          .map((p) => p.trim())
          .filter(Boolean)
      : [];
    const introParagraphs =
      rawIntro.length > 0 ? rawIntro : [...SITE_DATA.about.introParagraphs];

    return {
      ok: true,
      value: {
        sectionEyebrow: sectionEyebrowVal,
        heading: headingVal,
        introParagraphs,
        imagePlaceholderLabel: SITE_DATA.about.imagePlaceholderLabel,
        eyebrow: eyebrow.value,
        headingMain: headingMain.value,
        headingAccent: headingAccent.value,
        subheading: subheading.value,
        imageSrc: finalImageSrc,
        imageAlt: finalImageAlt,
        imageBadge: {
          enabled: badgeEnabled,
          icon: isSupportedIconName(rawBadge.icon)
            ? rawBadge.icon
            : DEFAULT_ABOUT_IMAGE_BADGE.icon,
          title: badgeTitleVal,
          description: badgeDescVal,
        },
        profileTabLabel: profileTabLabel.value,
        commitmentParagraphs,
        commitmentCards,
        visionMissionTabLabel: visionMissionTabLabel.value,
        visiHeading: visiHeading.value,
        visi: finalVisi,
        visiPlaceholder: SITE_DATA.about.visiPlaceholder,
        misiHeading: misiHeading.value,
        misi,
        historyTabLabel: historyTabLabel.value,
        historySteps,
        whyChooseUsEyebrow: whyChooseUsEyebrow.value,
        whyChooseUsTitle: whyChooseUsTitle.value,
        whyChooseUsCtaLabel: whyChooseUsCtaLabel.value,
        whyChooseUs: whyChooseUs.map((item) => ({
          ...item,
          isPlaceholder: false,
        })),
      },
    };
  }

  if (key === "article_hub") {
    const eyebrow = checkRequiredStr(input.eyebrow, "Label bagian", 60);
    if (eyebrow.error) fieldErrors.eyebrow = eyebrow.error;

    const headingMain = checkRequiredStr(
      input.headingMain,
      "Judul utama (teks awal)",
      80
    );
    if (headingMain.error) fieldErrors.headingMain = headingMain.error;

    const headingPill = checkRequiredStr(
      input.headingPill,
      "Judul utama (sorotan pill)",
      60
    );
    if (headingPill.error) fieldErrors.headingPill = headingPill.error;

    const headingAccent = checkRequiredStr(
      input.headingAccent,
      "Judul utama (teks bergaris bawah)",
      80
    );
    if (headingAccent.error) fieldErrors.headingAccent = headingAccent.error;

    const description = checkRequiredStr(
      input.description,
      "Deskripsi bagian",
      300
    );
    if (description.error) fieldErrors.description = description.error;

    const allArticlesCta = validateHeroCta(
      input.allArticlesCta,
      undefined,
      DEFAULT_ARTICLE_HUB_ALL_CTA,
      false,
      "allArticlesCta",
      "Tombol Lihat Semua Artikel",
      fieldErrors
    );

    const filterChips = validateFilterChipsInput(input, fieldErrors, {
      ...DEFAULT_FILTER_CHIPS_CONFIG,
      allTopicsLabel: DEFAULT_ARTICLE_HUB.allTopicsLabel,
    });

    const featuredBadgePrefix = checkRequiredStr(
      input.featuredBadgePrefix,
      "Label lencana artikel utama",
      40
    );
    if (featuredBadgePrefix.error)
      fieldErrors.featuredBadgePrefix = featuredBadgePrefix.error;

    const featuredReadMoreLabel = checkRequiredStr(
      input.featuredReadMoreLabel,
      "Label tautan baca artikel utama",
      50
    );
    if (featuredReadMoreLabel.error)
      fieldErrors.featuredReadMoreLabel = featuredReadMoreLabel.error;

    const secondaryReadMoreLabel = checkRequiredStr(
      input.secondaryReadMoreLabel,
      "Label tautan baca kartu artikel",
      50
    );
    if (secondaryReadMoreLabel.error)
      fieldErrors.secondaryReadMoreLabel = secondaryReadMoreLabel.error;

    const rawMax = Number(input.maxSecondaryArticles);
    const maxSecondaryArticles =
      Number.isInteger(rawMax) && rawMax >= 1 && rawMax <= 3 ? rawMax : 0;
    if (!maxSecondaryArticles) {
      fieldErrors.maxSecondaryArticles =
        "Jumlah kartu artikel samping harus antara 1 sampai 3.";
    }

    const emptyStateText =
      typeof input.emptyStateText === "string"
        ? input.emptyStateText.trim()
        : "";
    if (emptyStateText.length > 240) {
      fieldErrors.emptyStateText =
        "Teks kondisi kosong maksimal 240 karakter.";
    }

    const bannerEyebrow = checkRequiredStr(
      input.bannerEyebrow,
      "Label pita konsultasi",
      60
    );
    if (bannerEyebrow.error) fieldErrors.bannerEyebrow = bannerEyebrow.error;

    const bannerHeading = checkRequiredStr(
      input.bannerHeading,
      "Judul pita konsultasi",
      120
    );
    if (bannerHeading.error) fieldErrors.bannerHeading = bannerHeading.error;

    const bannerDescription = checkRequiredStr(
      input.bannerDescription,
      "Deskripsi pita konsultasi",
      240
    );
    if (bannerDescription.error)
      fieldErrors.bannerDescription = bannerDescription.error;

    const whatsappCardTitle = checkRequiredStr(
      input.whatsappCardTitle,
      "Judul kartu WhatsApp",
      60
    );
    if (whatsappCardTitle.error)
      fieldErrors.whatsappCardTitle = whatsappCardTitle.error;

    const whatsappCardSubtitle = checkRequiredStr(
      input.whatsappCardSubtitle,
      "Subjudul kartu WhatsApp",
      80
    );
    if (whatsappCardSubtitle.error)
      fieldErrors.whatsappCardSubtitle = whatsappCardSubtitle.error;

    const shopeeCardTitle = checkRequiredStr(
      input.shopeeCardTitle,
      "Judul kartu Shopee",
      60
    );
    if (shopeeCardTitle.error)
      fieldErrors.shopeeCardTitle = shopeeCardTitle.error;

    const shopeeCardSubtitle = checkRequiredStr(
      input.shopeeCardSubtitle,
      "Subjudul kartu Shopee",
      80
    );
    if (shopeeCardSubtitle.error)
      fieldErrors.shopeeCardSubtitle = shopeeCardSubtitle.error;

    const rawBannerImg =
      typeof input.bannerImageSrc === "string"
        ? input.bannerImageSrc.trim()
        : "";
    const rawBannerAlt =
      typeof input.bannerImageAlt === "string"
        ? input.bannerImageAlt.trim()
        : "";
    let finalBannerImg = "";
    let finalBannerAlt = "";

    if (rawBannerImg.length > 0) {
      if (rawBannerImg.length > 500) {
        fieldErrors.bannerImageSrc = "URL gambar maksimal 500 karakter.";
      } else if (!isValidImageSrc(rawBannerImg)) {
        fieldErrors.bannerImageSrc =
          "URL gambar harus diawali / atau https://.";
      } else {
        finalBannerImg = rawBannerImg;
      }

      const bAlt = checkRequiredStr(
        input.bannerImageAlt,
        "Teks alternatif (alt) gambar",
        250
      );
      if (bAlt.error) {
        fieldErrors.bannerImageAlt = bAlt.error;
      } else {
        finalBannerAlt = bAlt.value;
      }
    } else if (rawBannerAlt.length > 250) {
      fieldErrors.bannerImageAlt =
        "Teks alternatif (alt) gambar maksimal 250 karakter.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        eyebrow: eyebrow.value,
        headingMain: headingMain.value,
        headingPill: headingPill.value,
        headingAccent: headingAccent.value,
        description: description.value,
        allArticlesCta,
        allTopicsLabel: filterChips.allTopicsLabel,
        maxVisibleChips: filterChips.maxVisibleChips,
        overflowMode: filterChips.overflowMode,
        moreLabel: filterChips.moreLabel,
        showArticleCounts: filterChips.showArticleCounts,
        featuredBadgePrefix: featuredBadgePrefix.value,
        featuredReadMoreLabel: featuredReadMoreLabel.value,
        secondaryReadMoreLabel: secondaryReadMoreLabel.value,
        maxSecondaryArticles,
        emptyStateText,
        bannerEyebrow: bannerEyebrow.value,
        bannerHeading: bannerHeading.value,
        bannerDescription: bannerDescription.value,
        whatsappCardTitle: whatsappCardTitle.value,
        whatsappCardSubtitle: whatsappCardSubtitle.value,
        shopeeCardTitle: shopeeCardTitle.value,
        shopeeCardSubtitle: shopeeCardSubtitle.value,
        bannerImageSrc: finalBannerImg,
        bannerImageAlt: finalBannerAlt,
      },
    };
  }

  if (key === "article_page") {
    const seoTitle = checkRequiredStr(input.seoTitle, "Judul SEO halaman", 60);
    if (seoTitle.error) fieldErrors.seoTitle = seoTitle.error;

    const metaDescription = checkRequiredStr(
      input.metaDescription,
      "Deskripsi meta SEO",
      155
    );
    if (metaDescription.error)
      fieldErrors.metaDescription = metaDescription.error;

    const rawOg =
      typeof input.ogImageSrc === "string" ? input.ogImageSrc.trim() : "";
    const rawOgAlt =
      typeof input.ogImageAlt === "string" ? input.ogImageAlt.trim() : "";
    let finalOg = "";
    let finalOgAlt = "";
    if (rawOg.length > 0) {
      if (rawOg.length > 500) {
        fieldErrors.ogImageSrc = "URL gambar OG maksimal 500 karakter.";
      } else if (!isValidImageSrc(rawOg)) {
        fieldErrors.ogImageSrc = "URL gambar OG harus diawali / atau https://.";
      } else {
        finalOg = rawOg;
      }
      const altCheck = checkRequiredStr(
        input.ogImageAlt,
        "Teks alternatif gambar OG",
        200
      );
      if (altCheck.error) fieldErrors.ogImageAlt = altCheck.error;
      else finalOgAlt = altCheck.value;
    } else if (rawOgAlt.length > 200) {
      fieldErrors.ogImageAlt = "Teks alternatif gambar OG maksimal 200 karakter.";
    }

    const breadcrumbHomeLabel = checkRequiredStr(
      input.breadcrumbHomeLabel,
      "Label breadcrumb Beranda",
      40
    );
    if (breadcrumbHomeLabel.error)
      fieldErrors.breadcrumbHomeLabel = breadcrumbHomeLabel.error;

    const breadcrumbCurrentLabel = checkRequiredStr(
      input.breadcrumbCurrentLabel,
      "Label breadcrumb halaman ini",
      50
    );
    if (breadcrumbCurrentLabel.error)
      fieldErrors.breadcrumbCurrentLabel = breadcrumbCurrentLabel.error;

    const eyebrow = checkRequiredStr(input.eyebrow, "Label kecil atas (eyebrow)", 60);
    if (eyebrow.error) fieldErrors.eyebrow = eyebrow.error;

    const headingMain = checkRequiredStr(input.headingMain, "Judul utama", 80);
    if (headingMain.error) fieldErrors.headingMain = headingMain.error;

    const headingPill = checkRequiredStr(input.headingPill, "Sorotan judul", 50);
    if (headingPill.error) fieldErrors.headingPill = headingPill.error;

    const headingAccent = checkRequiredStr(
      input.headingAccent,
      "Baris aksen judul",
      60
    );
    if (headingAccent.error) fieldErrors.headingAccent = headingAccent.error;

    const description = checkRequiredStr(input.description, "Deskripsi tajuk", 350);
    if (description.error) fieldErrors.description = description.error;

    const searchPlaceholder = checkRequiredStr(
      input.searchPlaceholder,
      "Placeholder kolom pencarian",
      120
    );
    if (searchPlaceholder.error)
      fieldErrors.searchPlaceholder = searchPlaceholder.error;

    const filterChips = validateFilterChipsInput(
      input,
      fieldErrors,
      DEFAULT_FILTER_CHIPS_CONFIG
    );

    const featuredBadgeLabel = checkRequiredStr(
      input.featuredBadgeLabel,
      "Lencana artikel pilihan",
      40
    );
    if (featuredBadgeLabel.error)
      fieldErrors.featuredBadgeLabel = featuredBadgeLabel.error;

    const featuredReadMoreLabel = checkRequiredStr(
      input.featuredReadMoreLabel,
      "Tombol baca artikel pilihan",
      50
    );
    if (featuredReadMoreLabel.error)
      fieldErrors.featuredReadMoreLabel = featuredReadMoreLabel.error;

    const draftBadgeLabel = checkRequiredStr(
      input.draftBadgeLabel,
      "Label lencana draft/review",
      50
    );
    if (draftBadgeLabel.error)
      fieldErrors.draftBadgeLabel = draftBadgeLabel.error;

    const cardReadMoreLabel = checkRequiredStr(
      input.cardReadMoreLabel,
      "Tautan baca kartu artikel",
      50
    );
    if (cardReadMoreLabel.error)
      fieldErrors.cardReadMoreLabel = cardReadMoreLabel.error;

    const emptyTitle = checkRequiredStr(
      input.emptyTitle,
      "Judul hasil filter kosong",
      100
    );
    if (emptyTitle.error) fieldErrors.emptyTitle = emptyTitle.error;

    const emptyResetLabel = checkRequiredStr(
      input.emptyResetLabel,
      "Label tombol reset filter",
      60
    );
    if (emptyResetLabel.error)
      fieldErrors.emptyResetLabel = emptyResetLabel.error;

    const sidebarPromoBadge = checkRequiredStr(
      input.sidebarPromoBadge,
      "Lencana kartu promo sisi kanan",
      50
    );
    if (sidebarPromoBadge.error)
      fieldErrors.sidebarPromoBadge = sidebarPromoBadge.error;

    const sidebarPromoTitle = checkRequiredStr(
      input.sidebarPromoTitle,
      "Judul kartu promo sisi kanan",
      100
    );
    if (sidebarPromoTitle.error)
      fieldErrors.sidebarPromoTitle = sidebarPromoTitle.error;

    const sidebarPromoDescription = checkRequiredStr(
      input.sidebarPromoDescription,
      "Deskripsi kartu promo sisi kanan",
      240
    );
    if (sidebarPromoDescription.error)
      fieldErrors.sidebarPromoDescription = sidebarPromoDescription.error;

    const sidebarPromoPoints = Array.isArray(input.sidebarPromoPoints)
      ? input.sidebarPromoPoints
          .filter((x): x is string => typeof x === "string")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 5)
      : [];
    if (sidebarPromoPoints.length === 0) {
      fieldErrors.sidebarPromoPoints = "Minimal 1 poin keunggulan kartu promo.";
    }

    const sidebarPromoButtonLabel = checkRequiredStr(
      input.sidebarPromoButtonLabel,
      "Label tombol kartu promo",
      60
    );
    if (sidebarPromoButtonLabel.error)
      fieldErrors.sidebarPromoButtonLabel = sidebarPromoButtonLabel.error;

    const sidebarTopicsTitle = checkRequiredStr(
      input.sidebarTopicsTitle,
      "Judul kartu topik populer",
      80
    );
    if (sidebarTopicsTitle.error)
      fieldErrors.sidebarTopicsTitle = sidebarTopicsTitle.error;

    const sidebarTopics = Array.isArray(input.sidebarTopics)
      ? input.sidebarTopics
          .filter((x): x is string => typeof x === "string")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    const sidebarConsultPrompt = checkRequiredStr(
      input.sidebarConsultPrompt,
      "Teks ajakan konsultasi sisi kanan",
      120
    );
    if (sidebarConsultPrompt.error)
      fieldErrors.sidebarConsultPrompt = sidebarConsultPrompt.error;

    const sidebarConsultButtonLabel = checkRequiredStr(
      input.sidebarConsultButtonLabel,
      "Label tombol konsultasi WhatsApp",
      60
    );
    if (sidebarConsultButtonLabel.error)
      fieldErrors.sidebarConsultButtonLabel = sidebarConsultButtonLabel.error;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        seoTitle: seoTitle.value,
        metaDescription: metaDescription.value,
        ogImageSrc: finalOg,
        ogImageAlt: finalOgAlt,
        breadcrumbHomeLabel: breadcrumbHomeLabel.value,
        breadcrumbCurrentLabel: breadcrumbCurrentLabel.value,
        eyebrow: eyebrow.value,
        headingMain: headingMain.value,
        headingPill: headingPill.value,
        headingAccent: headingAccent.value,
        description: description.value,
        searchPlaceholder: searchPlaceholder.value,
        maxVisibleChips: filterChips.maxVisibleChips,
        overflowMode: filterChips.overflowMode,
        allTopicsLabel: filterChips.allTopicsLabel,
        moreLabel: filterChips.moreLabel,
        showArticleCounts: filterChips.showArticleCounts,
        featuredBadgeLabel: featuredBadgeLabel.value,
        featuredReadMoreLabel: featuredReadMoreLabel.value,
        draftBadgeLabel: draftBadgeLabel.value,
        cardReadMoreLabel: cardReadMoreLabel.value,
        emptyTitle: emptyTitle.value,
        emptyResetLabel: emptyResetLabel.value,
        sidebarPromoBadge: sidebarPromoBadge.value,
        sidebarPromoTitle: sidebarPromoTitle.value,
        sidebarPromoDescription: sidebarPromoDescription.value,
        sidebarPromoPoints,
        sidebarPromoButtonLabel: sidebarPromoButtonLabel.value,
        sidebarTopicsTitle: sidebarTopicsTitle.value,
        sidebarTopics,
        sidebarConsultPrompt: sidebarConsultPrompt.value,
        sidebarConsultButtonLabel: sidebarConsultButtonLabel.value,
      },
    };
  }

  if (key === "article_detail") {
    const breadcrumbHomeLabel = checkRequiredStr(
      input.breadcrumbHomeLabel,
      "Label breadcrumb Beranda",
      40
    );
    if (breadcrumbHomeLabel.error)
      fieldErrors.breadcrumbHomeLabel = breadcrumbHomeLabel.error;

    const breadcrumbHubLabel = checkRequiredStr(
      input.breadcrumbHubLabel,
      "Label breadcrumb Pusat Artikel",
      50
    );
    if (breadcrumbHubLabel.error)
      fieldErrors.breadcrumbHubLabel = breadcrumbHubLabel.error;

    const backToHubLabel = checkRequiredStr(
      input.backToHubLabel,
      "Label tombol kembali",
      60
    );
    if (backToHubLabel.error) fieldErrors.backToHubLabel = backToHubLabel.error;

    const draftBadgeLabel = checkRequiredStr(
      input.draftBadgeLabel,
      "Label lencana draft/review",
      50
    );
    if (draftBadgeLabel.error)
      fieldErrors.draftBadgeLabel = draftBadgeLabel.error;

    const sectionEyebrow = checkRequiredStr(
      input.sectionEyebrow,
      "Label kecil tiap bagian pembahasan",
      60
    );
    if (sectionEyebrow.error) fieldErrors.sectionEyebrow = sectionEyebrow.error;

    const sectionBulletsHeading = checkRequiredStr(
      input.sectionBulletsHeading,
      "Judul kotak poin penting",
      80
    );
    if (sectionBulletsHeading.error)
      fieldErrors.sectionBulletsHeading = sectionBulletsHeading.error;

    const tocHeading = checkRequiredStr(
      input.tocHeading,
      "Judul kotak daftar isi",
      60
    );
    if (tocHeading.error) fieldErrors.tocHeading = tocHeading.error;

    const relatedHeading = checkRequiredStr(
      input.relatedHeading,
      "Judul daftar panduan terkait",
      60
    );
    if (relatedHeading.error) fieldErrors.relatedHeading = relatedHeading.error;

    const bottomCtaBadge = checkRequiredStr(
      input.bottomCtaBadge,
      "Lencana banner CTA bawah",
      60
    );
    if (bottomCtaBadge.error) fieldErrors.bottomCtaBadge = bottomCtaBadge.error;

    const bottomCtaHeadingTemplate = checkRequiredStr(
      input.bottomCtaHeadingTemplate,
      "Judul banner CTA bawah",
      120
    );
    if (bottomCtaHeadingTemplate.error)
      fieldErrors.bottomCtaHeadingTemplate = bottomCtaHeadingTemplate.error;

    const bottomCtaDescription = checkRequiredStr(
      input.bottomCtaDescription,
      "Deskripsi banner CTA bawah",
      280
    );
    if (bottomCtaDescription.error)
      fieldErrors.bottomCtaDescription = bottomCtaDescription.error;

    const bottomCtaShopeeLabel = checkRequiredStr(
      input.bottomCtaShopeeLabel,
      "Tombol Shopee banner bawah",
      60
    );
    if (bottomCtaShopeeLabel.error)
      fieldErrors.bottomCtaShopeeLabel = bottomCtaShopeeLabel.error;

    const bottomCtaWhatsappLabel = checkRequiredStr(
      input.bottomCtaWhatsappLabel,
      "Tombol WhatsApp banner bawah",
      60
    );
    if (bottomCtaWhatsappLabel.error)
      fieldErrors.bottomCtaWhatsappLabel = bottomCtaWhatsappLabel.error;

    const sidebarPromoBadge = checkRequiredStr(
      input.sidebarPromoBadge,
      "Lencana kartu promo sisi kanan",
      50
    );
    if (sidebarPromoBadge.error)
      fieldErrors.sidebarPromoBadge = sidebarPromoBadge.error;

    const sidebarPromoTitle = checkRequiredStr(
      input.sidebarPromoTitle,
      "Judul kartu promo sisi kanan",
      100
    );
    if (sidebarPromoTitle.error)
      fieldErrors.sidebarPromoTitle = sidebarPromoTitle.error;

    const sidebarPromoDescription = checkRequiredStr(
      input.sidebarPromoDescription,
      "Deskripsi kartu promo sisi kanan",
      240
    );
    if (sidebarPromoDescription.error)
      fieldErrors.sidebarPromoDescription = sidebarPromoDescription.error;

    const sidebarPromoPoints = Array.isArray(input.sidebarPromoPoints)
      ? input.sidebarPromoPoints
          .filter((x): x is string => typeof x === "string")
          .map((x) => x.trim())
          .filter(Boolean)
          .slice(0, 5)
      : [];
    if (sidebarPromoPoints.length === 0) {
      fieldErrors.sidebarPromoPoints = "Minimal 1 poin keunggulan kartu promo.";
    }

    const sidebarPromoButtonLabel = checkRequiredStr(
      input.sidebarPromoButtonLabel,
      "Label tombol kartu promo",
      60
    );
    if (sidebarPromoButtonLabel.error)
      fieldErrors.sidebarPromoButtonLabel = sidebarPromoButtonLabel.error;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        breadcrumbHomeLabel: breadcrumbHomeLabel.value,
        breadcrumbHubLabel: breadcrumbHubLabel.value,
        backToHubLabel: backToHubLabel.value,
        draftBadgeLabel: draftBadgeLabel.value,
        sectionEyebrow: sectionEyebrow.value,
        sectionBulletsHeading: sectionBulletsHeading.value,
        tocHeading: tocHeading.value,
        relatedHeading: relatedHeading.value,
        bottomCtaBadge: bottomCtaBadge.value,
        bottomCtaHeadingTemplate: bottomCtaHeadingTemplate.value,
        bottomCtaDescription: bottomCtaDescription.value,
        bottomCtaShopeeLabel: bottomCtaShopeeLabel.value,
        bottomCtaWhatsappLabel: bottomCtaWhatsappLabel.value,
        sidebarPromoBadge: sidebarPromoBadge.value,
        sidebarPromoTitle: sidebarPromoTitle.value,
        sidebarPromoDescription: sidebarPromoDescription.value,
        sidebarPromoPoints,
        sidebarPromoButtonLabel: sidebarPromoButtonLabel.value,
      },
    };
  }

  if (key === "whatsapp_band") {
    const heading = checkRequiredStr(input.heading, "Judul pita WhatsApp", 120);
    if (heading.error) fieldErrors.heading = heading.error;

    const description = checkRequiredStr(input.description, "Deskripsi", 300);
    if (description.error) fieldErrors.description = description.error;

    const buttonLabel = checkRequiredStr(
      input.buttonLabel,
      "Label tombol konsultasi",
      60
    );
    if (buttonLabel.error) fieldErrors.buttonLabel = buttonLabel.error;

    const disabledHint = checkRequiredStr(
      input.disabledHint,
      "Keterangan layanan",
      150
    );
    if (disabledHint.error) fieldErrors.disabledHint = disabledHint.error;

    if (Object.keys(fieldErrors).length > 0) {
      return {
        ok: false,
        fieldErrors,
        formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
      };
    }

    return {
      ok: true,
      value: {
        heading: heading.value,
        description: description.value,
        buttonLabel: buttonLabel.value,
        disabledHint: disabledHint.value,
      },
    };
  }

  // footer
  const defaults = cloneFooterDefaults();

  // 1. Highlights (1..4)
  const rawHighlights = Array.isArray(input.highlights) ? input.highlights : [];
  const highlights: FooterHighlightItem[] = [];
  if (rawHighlights.length < 1 || rawHighlights.length > 4) {
    fieldErrors.highlights = "Strip jaminan footer harus berisi 1 hingga 4 kartu.";
  } else {
    rawHighlights.forEach((item, idx) => {
      const obj = asObj(item);
      const iconRaw = typeof obj.icon === "string" ? obj.icon.trim() : "";
      if (!isSupportedIconName(iconRaw)) {
        fieldErrors[`highlights.${idx}.icon`] = "Pilih ikon yang valid.";
      }
      const title = checkRequiredStr(obj.title, `Judul jaminan #${idx + 1}`, 80);
      if (title.error) fieldErrors[`highlights.${idx}.title`] = title.error;
      const subtitle = checkRequiredStr(
        obj.subtitle,
        `Keterangan jaminan #${idx + 1}`,
        140
      );
      if (subtitle.error) {
        fieldErrors[`highlights.${idx}.subtitle`] = subtitle.error;
      }
      if (isSupportedIconName(iconRaw) && !title.error && !subtitle.error) {
        highlights.push({
          icon: iconRaw,
          title: title.value,
          subtitle: subtitle.value,
        });
      }
    });
  }

  // 2. Logo & brand
  const logoSrcRaw =
    typeof input.logoSrc === "string" ? input.logoSrc.trim() : "";
  if (logoSrcRaw && !isValidImageSrc(logoSrcRaw)) {
    fieldErrors.logoSrc = "URL logo tidak valid.";
  }
  const logoAltRes = checkOptionalStr(input.logoAlt, "Teks alternatif logo", 120);
  if (logoAltRes.error) fieldErrors.logoAlt = logoAltRes.error;

  const brandSubtitle = checkRequiredStr(
    input.brandSubtitle,
    "Subjudul merek",
    80
  );
  if (brandSubtitle.error) fieldErrors.brandSubtitle = brandSubtitle.error;

  const blurb = checkRequiredStr(input.blurb, "Ringkasan perusahaan", 350);
  if (blurb.error) fieldErrors.blurb = blurb.error;

  // 3. Flagship card
  const flagshipRaw = asObj(input.flagshipCard);
  const flagshipEnabled =
    typeof flagshipRaw.enabled === "boolean" ? flagshipRaw.enabled : true;
  const flagshipCta = validateHeroCta(
    {
      enabled: flagshipEnabled,
      label: flagshipRaw.linkLabel,
      target: flagshipRaw.target,
    },
    undefined,
    {
      enabled: true,
      label: defaults.flagshipCard.linkLabel,
      target: defaults.flagshipCard.target,
    },
    false,
    "flagshipCard",
    "Tautan kartu unggulan",
    fieldErrors
  );
  const flagshipEyebrow = flagshipEnabled
    ? checkRequiredStr(flagshipRaw.eyebrow, "Label kecil kartu unggulan", 80)
    : checkOptionalStr(flagshipRaw.eyebrow, "Label kecil kartu unggulan", 80);
  if (flagshipEyebrow.error)
    fieldErrors["flagshipCard.eyebrow"] = flagshipEyebrow.error;

  const flagshipTitle = flagshipEnabled
    ? checkRequiredStr(flagshipRaw.title, "Judul kartu unggulan", 100)
    : checkOptionalStr(flagshipRaw.title, "Judul kartu unggulan", 100);
  if (flagshipTitle.error)
    fieldErrors["flagshipCard.title"] = flagshipTitle.error;

  const flagshipDesc = flagshipEnabled
    ? checkRequiredStr(flagshipRaw.description, "Deskripsi kartu unggulan", 220)
    : checkOptionalStr(flagshipRaw.description, "Deskripsi kartu unggulan", 220);
  if (flagshipDesc.error)
    fieldErrors["flagshipCard.description"] = flagshipDesc.error;

  // 4. Link columns (1..3 columns, 1..8 links each)
  const rawColumns = Array.isArray(input.linkColumns) ? input.linkColumns : [];
  const linkColumns: FooterLinkColumn[] = [];
  if (rawColumns.length < 1 || rawColumns.length > 3) {
    fieldErrors.linkColumns = "Kolom tautan harus berisi 1 hingga 3 kolom.";
  } else {
    rawColumns.forEach((colItem, colIdx) => {
      const colObj = asObj(colItem);
      const colHeading = checkRequiredStr(
        colObj.heading,
        `Judul kolom #${colIdx + 1}`,
        60
      );
      if (colHeading.error) {
        fieldErrors[`linkColumns.${colIdx}.heading`] = colHeading.error;
      }
      const rawLinks = Array.isArray(colObj.links) ? colObj.links : [];
      const colLinks: FooterNavLink[] = [];
      if (rawLinks.length < 1 || rawLinks.length > 8) {
        fieldErrors[`linkColumns.${colIdx}.links`] =
          "Setiap kolom harus berisi 1 hingga 8 tautan.";
      } else {
        rawLinks.forEach((lnkItem, lnkIdx) => {
          const lnkObj = asObj(lnkItem);
          const validatedLnk = validateHeroCta(
            {
              enabled: true,
              label: lnkObj.label,
              target: lnkObj.target,
            },
            undefined,
            {
              enabled: true,
              label: "Beranda",
              target: { type: "page", value: "/" },
            },
            true,
            `linkColumns.${colIdx}.links.${lnkIdx}`,
            `Tautan #${lnkIdx + 1}`,
            fieldErrors
          );
          colLinks.push({
            label: validatedLnk.label,
            target: validatedLnk.target,
          });
        });
      }
      if (!colHeading.error && colLinks.length > 0) {
        linkColumns.push({
          heading: colHeading.value,
          links: colLinks,
        });
      }
    });
  }

  // 5. Headings & Official Channels
  const productCategoriesHeading = checkRequiredStr(
    input.productCategoriesHeading,
    "Judul kolom lini produk",
    60
  );
  if (productCategoriesHeading.error)
    fieldErrors.productCategoriesHeading = productCategoriesHeading.error;

  const featuredArticlesHeading = checkRequiredStr(
    input.featuredArticlesHeading,
    "Judul kolom panduan pilihan",
    60
  );
  if (featuredArticlesHeading.error)
    fieldErrors.featuredArticlesHeading = featuredArticlesHeading.error;

  const channelsHeading = checkRequiredStr(
    input.channelsHeading,
    "Judul kolom saluran resmi",
    60
  );
  if (channelsHeading.error)
    fieldErrors.channelsHeading = channelsHeading.error;

  const storeCardBadge = checkRequiredStr(
    input.storeCardBadge,
    "Label atas kartu toko",
    50
  );
  if (storeCardBadge.error) fieldErrors.storeCardBadge = storeCardBadge.error;

  const storeCardBadgeRight = checkRequiredStr(
    input.storeCardBadgeRight,
    "Lencana kanan kartu toko",
    40
  );
  if (storeCardBadgeRight.error)
    fieldErrors.storeCardBadgeRight = storeCardBadgeRight.error;

  const storeCardTitle = checkRequiredStr(
    input.storeCardTitle,
    "Judul kartu toko",
    80
  );
  if (storeCardTitle.error) fieldErrors.storeCardTitle = storeCardTitle.error;

  const storeCardDescription = checkRequiredStr(
    input.storeCardDescription,
    "Deskripsi kartu toko",
    250
  );
  if (storeCardDescription.error)
    fieldErrors.storeCardDescription = storeCardDescription.error;

  const storeButtonLabel = checkRequiredStr(
    input.storeButtonLabel,
    "Label tombol toko",
    60
  );
  if (storeButtonLabel.error)
    fieldErrors.storeButtonLabel = storeButtonLabel.error;

  const whatsappCardTitle = checkRequiredStr(
    input.whatsappCardTitle,
    "Judul kartu WhatsApp",
    80
  );
  if (whatsappCardTitle.error)
    fieldErrors.whatsappCardTitle = whatsappCardTitle.error;

  const whatsappCardDescription = checkRequiredStr(
    input.whatsappCardDescription,
    "Deskripsi kartu WhatsApp",
    220
  );
  if (whatsappCardDescription.error)
    fieldErrors.whatsappCardDescription = whatsappCardDescription.error;

  const whatsappButtonLabel = checkRequiredStr(
    input.whatsappButtonLabel,
    "Label tombol WhatsApp",
    60
  );
  if (whatsappButtonLabel.error)
    fieldErrors.whatsappButtonLabel = whatsappButtonLabel.error;

  const contactHeading = checkRequiredStr(
    input.contactHeading,
    "Judul blok informasi kontak",
    60
  );
  if (contactHeading.error) fieldErrors.contactHeading = contactHeading.error;

  // 6. Social links (0..6, optional)
  const rawSocial = Array.isArray(input.socialLinks) ? input.socialLinks : [];
  const socialLinks: FooterSocialLink[] = [];
  if (rawSocial.length > 6) {
    fieldErrors.socialLinks = "Maksimal 6 tautan media sosial.";
  } else {
    rawSocial.forEach((item, idx) => {
      const obj = asObj(item);
      const platform = checkRequiredStr(
        obj.platform,
        `Nama platform #${idx + 1}`,
        40
      );
      if (platform.error) {
        fieldErrors[`socialLinks.${idx}.platform`] = platform.error;
      }
      const urlRaw = typeof obj.url === "string" ? obj.url.trim() : "";
      if (!urlRaw || !isValidExternalHttpsUrl(urlRaw)) {
        fieldErrors[`socialLinks.${idx}.url`] =
          "URL media sosial harus diawali https:// dan valid.";
      }
      if (!platform.error && isValidExternalHttpsUrl(urlRaw)) {
        socialLinks.push({ platform: platform.value, url: urlRaw });
      }
    });
  }

  // 7. Copyright & legal badges
  const copyrightText = checkRequiredStr(
    input.copyrightText,
    "Teks hak cipta",
    180
  );
  if (copyrightText.error) fieldErrors.copyrightText = copyrightText.error;

  const rawBadges = Array.isArray(input.legalBadges) ? input.legalBadges : [];
  const legalBadges: string[] = [];
  if (rawBadges.length > 4) {
    fieldErrors.legalBadges = "Maksimal 4 lencana bawah.";
  } else {
    rawBadges.forEach((item, idx) => {
      const res = checkOptionalStr(item, `Lencana bawah #${idx + 1}`, 60);
      if (res.error) {
        fieldErrors[`legalBadges.${idx}`] = res.error;
      } else if (res.value) {
        legalBadges.push(res.value);
      }
    });
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
      formError: "Periksa kembali kolom yang masih perlu diperbaiki.",
    };
  }

  return {
    ok: true,
    value: {
      highlights,
      logoSrc: logoSrcRaw,
      logoAlt: logoAltRes.value,
      brandSubtitle: brandSubtitle.value,
      blurb: blurb.value,
      flagshipCard: {
        enabled: flagshipEnabled,
        eyebrow: flagshipEyebrow.value,
        title: flagshipTitle.value,
        description: flagshipDesc.value,
        linkLabel: flagshipCta.label,
        target: flagshipCta.target,
      },
      linkColumns,
      productCategoriesHeading: productCategoriesHeading.value,
      featuredArticlesHeading: featuredArticlesHeading.value,
      channelsHeading: channelsHeading.value,
      storeCardBadge: storeCardBadge.value,
      storeCardBadgeRight: storeCardBadgeRight.value,
      storeCardTitle: storeCardTitle.value,
      storeCardDescription: storeCardDescription.value,
      storeButtonLabel: storeButtonLabel.value,
      whatsappCardTitle: whatsappCardTitle.value,
      whatsappCardDescription: whatsappCardDescription.value,
      whatsappButtonLabel: whatsappButtonLabel.value,
      contactHeading: contactHeading.value,
      socialLinks,
      copyrightText: copyrightText.value,
      legalBadges,
    },
  };
}
