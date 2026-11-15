-- 0001_init.sql: Core schema for Arga Tani Mandiri (articles, categories, site_content, admin_users)

-- 1. Enum type for article publishing workflow
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'article_status' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.article_status AS ENUM ('draft', 'review', 'published');
  END IF;
END
$$;

-- 2. Trigger function to keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Articles table (matches src/data/articles.ts ArticleItem & ArticleSection[])
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  seo_title text NOT NULL,
  short_title text,
  meta_description text NOT NULL,
  excerpt text NOT NULL,
  intro text NOT NULL,
  -- body stores structured H2 sections: [{ id, heading, paragraphs, bullets?, callout?: { title, text } }]
  body jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL,
  filter_category text NOT NULL,
  reading_time text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  status public.article_status NOT NULL DEFAULT 'draft',
  image_src text NOT NULL,
  image_alt text NOT NULL,
  takeaways text[] NOT NULL DEFAULT '{}'::text[],
  tags text[] NOT NULL DEFAULT '{}'::text[],
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);

DROP TRIGGER IF EXISTS trg_articles_updated_at ON public.articles;
CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Product categories table (matches src/data/categories.ts & SITE_DATA.categoryShowcase.items)
CREATE TABLE IF NOT EXISTS public.categories (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  image_src text NOT NULL,
  image_alt text NOT NULL,
  external_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories (sort_order);

DROP TRIGGER IF EXISTS trg_categories_updated_at ON public.categories;
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 5. Site content table (key-value JSONB blocks for src/data/site.ts)
-- Documented keys:
--   'company'           -> companyName, companyLegalNote, fieldDescription, templateBannerText, officialStore, whatsappNumber, whatsappPlaceholderLabel, contact
--   'hero'              -> eyebrow, headlineMain, headlineAccent, subheadline, primaryCtaLabel, secondaryCtaLabel, imageSrc, imageAlt, trustItems, overlayBadgeLeft, overlayBadgeRight, infoStrip
--   'category_showcase' -> pill, heading, description, ctaLabel
--   'about'             -> sectionEyebrow, heading, introParagraphs, imagePlaceholderLabel, visi, visiPlaceholder, misi, whyChooseUsTitle, whyChooseUs
--   'whatsapp_band'     -> heading, description, buttonLabel, disabledHint
--   'footer'            -> blurb, storeCardTitle, storeCardDescription, storeButtonLabel
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_site_content_updated_at ON public.site_content;
CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 6. Admin allowlist table (lowercase emails only)
CREATE TABLE IF NOT EXISTS public.admin_users (
  email text PRIMARY KEY CHECK (email = lower(email)),
  created_at timestamptz NOT NULL DEFAULT now()
);
