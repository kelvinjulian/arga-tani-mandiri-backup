-- 0007_video_play_mode.sql: Add per-video play_mode ('embed' | 'link') for TikTok videos

ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS play_mode text NOT NULL DEFAULT 'link';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'videos_play_mode_check'
      AND conrelid = 'public.videos'::regclass
  ) THEN
    ALTER TABLE public.videos
      ADD CONSTRAINT videos_play_mode_check
      CHECK (play_mode IN ('embed', 'link'));
  END IF;
END
$$;
