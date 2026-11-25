-- Migration: Page Views Counter Table
-- Used by PageViewCounter component on youdecide.studio landing page

CREATE TABLE IF NOT EXISTS public.page_views (
  id         BIGSERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  views      BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Public read (anon can see the count)
CREATE POLICY "page_views_public_read"
  ON public.page_views FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public insert (first-time slug creation)
CREATE POLICY "page_views_public_insert"
  ON public.page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public update (increment counter)
CREATE POLICY "page_views_public_update"
  ON public.page_views FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Index for fast slug lookup
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON public.page_views(slug);
