-- Atomic page view increment function (avoids race conditions)
-- Call via: supabase.rpc('increment_page_view', { p_slug: 'my-page' })

CREATE OR REPLACE FUNCTION public.increment_page_view(p_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.page_views (slug, views, updated_at)
  VALUES (p_slug, 1, NOW())
  ON CONFLICT (slug)
  DO UPDATE SET
    views      = page_views.views + 1,
    updated_at = NOW();
END;
$$;

-- Allow anon + authenticated to call this function
GRANT EXECUTE ON FUNCTION public.increment_page_view(TEXT) TO anon, authenticated;
