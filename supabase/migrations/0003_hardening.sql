-- 0003_hardening.sql: tighten admin check, privileges and storage listing

-- 1. updated_at trigger function with a fixed search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. is_admin(): match the signed-in user's id, require a confirmed email that is on the allowlist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.admin_users a ON a.email = lower(u.email)
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. Defense in depth: strip unneeded table privileges (RLS stays the main protection)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.articles, public.categories, public.site_content FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON public.articles, public.categories, public.site_content FROM authenticated;
REVOKE ALL ON public.admin_users FROM anon, authenticated;

-- 4. Storage: bucket stays public (URLs keep working) but anonymous listing is removed
DROP POLICY IF EXISTS "Public can view media objects" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view media objects" ON storage.objects;
CREATE POLICY "Admins can view media objects"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
