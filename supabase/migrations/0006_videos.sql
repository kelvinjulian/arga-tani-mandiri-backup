-- 0006_videos.sql: Videos table (YouTube & TikTok), RLS, and privilege hardening

-- 1. Enums (idempotent)
DO $$
BEGIN
  CREATE TYPE public.video_platform AS ENUM ('youtube', 'tiktok');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.video_status AS ENUM ('draft', 'published');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- 2. Table definition
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform public.video_platform NOT NULL,
  url text NOT NULL CHECK (url ~ '^https://'),
  video_id text,
  title text NOT NULL CHECK (char_length(trim(title)) BETWEEN 2 AND 120),
  description text CHECK (description IS NULL OR char_length(description) <= 300),
  thumbnail_src text CHECK (
    thumbnail_src IS NULL
    OR thumbnail_src = ''
    OR thumbnail_src ~ '^(/|https://)'
  ),
  duration text CHECK (duration IS NULL OR char_length(duration) <= 10),
  status public.video_status NOT NULL DEFAULT 'published',
  is_featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_videos_platform_video_id_unique
  ON public.videos (platform, video_id)
  WHERE video_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_videos_status_sort_order
  ON public.videos (status, sort_order);

CREATE INDEX IF NOT EXISTS idx_videos_platform
  ON public.videos (platform);

CREATE INDEX IF NOT EXISTS idx_videos_is_featured
  ON public.videos (is_featured);

-- 4. updated_at trigger (reuses public.set_updated_at from 0003_hardening.sql)
DROP TRIGGER IF EXISTS trg_videos_updated_at ON public.videos;
CREATE TRIGGER trg_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 5. Enable Row Level Security & policies
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published videos" ON public.videos;
CREATE POLICY "Public can read published videos"
  ON public.videos
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins can select all videos" ON public.videos;
CREATE POLICY "Admins can select all videos"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
CREATE POLICY "Admins can insert videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
CREATE POLICY "Admins can update videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;
CREATE POLICY "Admins can delete videos"
  ON public.videos
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 6. Privilege hardening (mirrors 0003_hardening.sql and 0004_article_categories.sql)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.videos FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER
  ON public.videos FROM authenticated;
