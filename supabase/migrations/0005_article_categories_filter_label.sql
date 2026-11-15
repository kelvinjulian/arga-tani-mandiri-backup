-- 0005: article_categories gets filter_label (value stored in articles.filter_category)

ALTER TABLE public.article_categories ADD COLUMN IF NOT EXISTS filter_label text;

UPDATE public.article_categories
SET filter_label = CASE slug
  WHEN 'panduan-label'       THEN 'Panduan Label'
  WHEN 'manajemen-budidaya'  THEN 'Manajemen Budidaya'
  WHEN 'pembenah-tanah'      THEN 'Pembenah Tanah'
  WHEN 'penyimpanan-gudang'  THEN 'Penyimpanan & Gudang'
  ELSE name
END
WHERE filter_label IS NULL;

ALTER TABLE public.article_categories ALTER COLUMN filter_label SET NOT NULL;

ALTER TABLE public.article_categories
  DROP CONSTRAINT IF EXISTS article_categories_filter_label_len;
ALTER TABLE public.article_categories
  ADD CONSTRAINT article_categories_filter_label_len
  CHECK (char_length(trim(filter_label)) BETWEEN 2 AND 40);

CREATE UNIQUE INDEX IF NOT EXISTS ux_article_categories_name
  ON public.article_categories (name);
CREATE UNIQUE INDEX IF NOT EXISTS ux_article_categories_filter_label
  ON public.article_categories (filter_label);

-- Replace the rename function (new signature with filter_label)
DROP FUNCTION IF EXISTS public.rename_article_category(uuid, text, text);

CREATE OR REPLACE FUNCTION public.rename_article_category(
  p_id uuid,
  p_name text,
  p_filter_label text,
  p_slug text
)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  filter_label text,
  sort_order integer,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_old_name text;
  v_old_filter text;
  v_clean_name text;
  v_clean_filter text;
  v_clean_slug text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Akses ditolak: hanya admin yang dapat mengubah kategori artikel.';
  END IF;

  v_clean_name := trim(coalesce(p_name, ''));
  v_clean_filter := trim(coalesce(p_filter_label, ''));
  v_clean_slug := lower(trim(coalesce(p_slug, '')));

  IF char_length(v_clean_name) < 2 OR char_length(v_clean_name) > 40 THEN
    RAISE EXCEPTION 'Nama kategori harus 2 sampai 40 karakter.';
  END IF;
  IF char_length(v_clean_filter) < 2 OR char_length(v_clean_filter) > 40 THEN
    RAISE EXCEPTION 'Label filter harus 2 sampai 40 karakter.';
  END IF;
  IF v_clean_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Slug kategori hanya boleh berisi huruf kecil, angka, dan tanda hubung.';
  END IF;

  SELECT c.name, c.filter_label
    INTO v_old_name, v_old_filter
    FROM public.article_categories c
   WHERE c.id = p_id
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kategori artikel tidak ditemukan.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.article_categories c
              WHERE c.id <> p_id AND c.name = v_clean_name) THEN
    RAISE EXCEPTION 'Nama kategori sudah dipakai kategori lain.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.article_categories c
              WHERE c.id <> p_id AND c.filter_label = v_clean_filter) THEN
    RAISE EXCEPTION 'Label filter sudah dipakai kategori lain.';
  END IF;
  IF EXISTS (SELECT 1 FROM public.article_categories c
              WHERE c.id <> p_id AND c.slug = v_clean_slug) THEN
    RAISE EXCEPTION 'Slug kategori sudah dipakai kategori lain.';
  END IF;

  UPDATE public.article_categories c
     SET name = v_clean_name,
         filter_label = v_clean_filter,
         slug = v_clean_slug
   WHERE c.id = p_id;

  UPDATE public.articles a
     SET category = v_clean_name
   WHERE a.category = v_old_name;

  UPDATE public.articles a
     SET filter_category = v_clean_filter
   WHERE a.filter_category = v_old_filter;

  RETURN QUERY
  SELECT c.id, c.slug, c.name, c.filter_label, c.sort_order, c.updated_at
    FROM public.article_categories c
   WHERE c.id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.rename_article_category(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rename_article_category(uuid, text, text, text) TO authenticated;