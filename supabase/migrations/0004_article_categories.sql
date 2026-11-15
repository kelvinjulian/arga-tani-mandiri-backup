-- 0004_article_categories.sql: Article categories table, RLS, privilege hardening, seed, and atomic rename RPC

-- 1. Table definition
CREATE TABLE IF NOT EXISTS public.article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 40),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_article_categories_slug
  ON public.article_categories (slug);
CREATE INDEX IF NOT EXISTS idx_article_categories_sort_order
  ON public.article_categories (sort_order);

DROP TRIGGER IF EXISTS trg_article_categories_updated_at ON public.article_categories;
CREATE TRIGGER trg_article_categories_updated_at
  BEFORE UPDATE ON public.article_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 2. Enable Row Level Security & policies (mirrors 0002_rls.sql)
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read article_categories" ON public.article_categories;
CREATE POLICY "Public can read article_categories"
  ON public.article_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert article_categories" ON public.article_categories;
CREATE POLICY "Admins can insert article_categories"
  ON public.article_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update article_categories" ON public.article_categories;
CREATE POLICY "Admins can update article_categories"
  ON public.article_categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete article_categories" ON public.article_categories;
CREATE POLICY "Admins can delete article_categories"
  ON public.article_categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 3. Privilege hardening (mirrors 0003_hardening.sql)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.article_categories FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON public.article_categories FROM authenticated;

-- 4. Idempotent seed matching the 4 distinct categories currently in seed.sql & articles.ts
INSERT INTO public.article_categories (slug, name, sort_order)
VALUES
  ('panduan-label', 'Panduan Label Kemasan', 0),
  ('manajemen-budidaya', 'Manajemen Budidaya', 1),
  ('pembenah-tanah', 'Pembenah Tanah', 2),
  ('penyimpanan-gudang', 'Penyimpanan & Distribusi', 3)
ON CONFLICT (slug) DO NOTHING;

-- 5. Atomic rename/slug-update RPC so articles stay in sync within one transaction
CREATE OR REPLACE FUNCTION public.rename_article_category(
  p_id uuid,
  p_name text,
  p_slug text
)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  sort_order integer,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_old_name text;
  v_old_slug text;
  v_clean_name text;
  v_clean_slug text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Akses ditolak: hanya admin yang dapat mengubah kategori artikel.';
  END IF;

  v_clean_name := trim(coalesce(p_name, ''));
  v_clean_slug := lower(trim(coalesce(p_slug, '')));

  IF char_length(v_clean_name) < 2 OR char_length(v_clean_name) > 40 THEN
    RAISE EXCEPTION 'Nama kategori harus 2 sampai 40 karakter.';
  END IF;

  IF v_clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Slug kategori hanya boleh berisi huruf kecil, angka, dan tanda hubung.';
  END IF;

  SELECT c.name, c.slug
    INTO v_old_name, v_old_slug
    FROM public.article_categories c
   WHERE c.id = p_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kategori artikel tidak ditemukan.';
  END IF;

  UPDATE public.article_categories c
     SET name = v_clean_name,
         slug = v_clean_slug
   WHERE c.id = p_id;

  UPDATE public.articles a
     SET category = v_clean_name,
         filter_category = v_clean_slug
   WHERE a.filter_category = v_old_slug
      OR a.category = v_old_name;

  RETURN QUERY
  SELECT c.id, c.slug, c.name, c.sort_order, c.updated_at
    FROM public.article_categories c
   WHERE c.id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.rename_article_category(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rename_article_category(uuid, text, text) TO authenticated;
