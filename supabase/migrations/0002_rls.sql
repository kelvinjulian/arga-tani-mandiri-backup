-- 0002_rls.sql: Row Level Security, admin allowlist helper, and Storage policies

-- 1. Enable Row Level Security on every table
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Admin helper function (SECURITY DEFINER with fixed search_path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. Articles policies
-- Public (anon & authenticated) can read only review or published rows; draft is hidden
DROP POLICY IF EXISTS "Public can read review and published articles" ON public.articles;
CREATE POLICY "Public can read review and published articles"
  ON public.articles
  FOR SELECT
  TO anon, authenticated
  USING (status IN ('review', 'published'));

DROP POLICY IF EXISTS "Admins can read all articles" ON public.articles;
CREATE POLICY "Admins can read all articles"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert articles" ON public.articles;
CREATE POLICY "Admins can insert articles"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update articles" ON public.articles;
CREATE POLICY "Admins can update articles"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete articles" ON public.articles;
CREATE POLICY "Admins can delete articles"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. Categories policies (public read, admin write)
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
CREATE POLICY "Public can read categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 5. Site content policies (public read, admin write)
DROP POLICY IF EXISTS "Public can read site_content" ON public.site_content;
CREATE POLICY "Public can read site_content"
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can insert site_content" ON public.site_content;
CREATE POLICY "Admins can insert site_content"
  ON public.site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update site_content" ON public.site_content;
CREATE POLICY "Admins can update site_content"
  ON public.site_content
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete site_content" ON public.site_content;
CREATE POLICY "Admins can delete site_content"
  ON public.site_content
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. admin_users: RLS is enabled with NO policies, so anon/authenticated have zero direct access.
-- Only public.is_admin() (SECURITY DEFINER) can query this table.

-- 7. Storage bucket "media" (public read, 2 MB limit, image MIME types only, admin writes)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  2097152,
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can view media objects" ON storage.objects;
CREATE POLICY "Public can view media objects"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admins can upload media objects" ON storage.objects;
CREATE POLICY "Admins can upload media objects"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update media objects" ON storage.objects;
CREATE POLICY "Admins can update media objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete media objects" ON storage.objects;
CREATE POLICY "Admins can delete media objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
