-- Create onboarding / community applications table
CREATE TABLE IF NOT EXISTS public.onboarding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact TEXT,
    college TEXT,
    year TEXT,
    interest TEXT,
    skills TEXT,
    reason TEXT,
    social TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    member_id TEXT,
    feedback_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.onboarding_applications ENABLE ROW LEVEL SECURITY;

-- Allow public / anon users to submit applications (INSERT)
CREATE POLICY "Allow public insert for onboarding applications"
    ON public.onboarding_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow read for anon/authenticated (or admin portal)
CREATE POLICY "Allow select for onboarding applications"
    ON public.onboarding_applications
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow update
CREATE POLICY "Allow update for onboarding applications"
    ON public.onboarding_applications
    FOR UPDATE
    TO anon, authenticated
    USING (true);

-- Allow delete
CREATE POLICY "Allow delete for onboarding applications"
    ON public.onboarding_applications
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Index for fast lookup by email and status
CREATE INDEX IF NOT EXISTS idx_onboarding_email ON public.onboarding_applications(email);
CREATE INDEX IF NOT EXISTS idx_onboarding_status ON public.onboarding_applications(status);
