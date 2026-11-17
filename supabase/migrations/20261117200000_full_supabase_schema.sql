-- ============================================================
-- Migration: Full Supabase schema for The 404 Society
-- Replaces: Firestore collections
-- Tables: events, blog_posts, community_applications, 
--         registrations, newsletter_subscribers, 
--         email_logs, member_id_counters, members
-- ============================================================

-- ── EVENTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
    img TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','locked')),
    category TEXT,
    description TEXT,
    pricing JSONB,
    max_registrations INT,
    whatsapp_link TEXT,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_events_select" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_events_insert" ON public.events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_events_update" ON public.events FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "public_events_delete" ON public.events FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- ── BLOG POSTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    col_span INT NOT NULL DEFAULT 1,
    row_span INT NOT NULL DEFAULT 1,
    author_name TEXT,
    read_time TEXT,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_blog_select" ON public.blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_blog_insert" ON public.blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_blog_update" ON public.blog_posts FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "public_blog_delete" ON public.blog_posts FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_blog_created_at ON public.blog_posts(created_at DESC);

-- ── COMMUNITY APPLICATIONS ───────────────────────────────────
-- (Already exists as onboarding_applications — we extend it)
ALTER TABLE public.onboarding_applications
    ADD COLUMN IF NOT EXISTS member_id TEXT,
    ADD COLUMN IF NOT EXISTS feedback_reason TEXT,
    ADD COLUMN IF NOT EXISTS emails_sent JSONB DEFAULT '{}'::JSONB;

-- ── REGISTRATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    event_title TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    student_id TEXT,
    phone TEXT,
    branch TEXT,
    year TEXT,
    team_name TEXT,
    payment_status TEXT DEFAULT 'not_required',
    payment_id TEXT,
    amount_paid INT,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_reg_select" ON public.registrations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_reg_insert" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_reg_update" ON public.registrations FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "public_reg_delete" ON public.registrations FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_reg_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_reg_created_at ON public.registrations(created_at DESC);

-- ── NEWSLETTER SUBSCRIBERS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT DEFAULT '',
    subscribed_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_newsletter_select" ON public.newsletter_subscribers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_newsletter_insert" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_newsletter_delete" ON public.newsletter_subscribers FOR DELETE TO anon, authenticated USING (true);

-- ── EMAIL LOGS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    trigger TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','failed')),
    error TEXT,
    timestamp BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_email_log_select" ON public.email_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_email_log_insert" ON public.email_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_email_log_delete" ON public.email_logs FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_email_log_timestamp ON public.email_logs(timestamp DESC);

-- ── MEMBER ID COUNTERS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.member_id_counters (
    year INT PRIMARY KEY,
    counter INT NOT NULL DEFAULT 0,
    last_id TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.member_id_counters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_counter_select" ON public.member_id_counters FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_counter_insert" ON public.member_id_counters FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_counter_update" ON public.member_id_counters FOR UPDATE TO anon, authenticated USING (true);

-- ── MEMBERS (approved) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    social TEXT,
    college TEXT,
    year TEXT,
    interest TEXT,
    approved_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
    community_app_id TEXT
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_members_select" ON public.members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_members_insert" ON public.members FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_members_update" ON public.members FOR UPDATE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_members_member_id ON public.members(member_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- ── STORAGE BUCKET ───────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "allow_public_uploads" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "allow_public_read_uploads" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'uploads');

CREATE POLICY "allow_public_delete_uploads" ON storage.objects
  FOR DELETE TO anon, authenticated USING (bucket_id = 'uploads');

