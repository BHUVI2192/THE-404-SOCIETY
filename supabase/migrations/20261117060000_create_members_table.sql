-- Create members table for approved community members and collaboration access
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    contact TEXT,
    college TEXT,
    year TEXT,
    interest TEXT,
    skills TEXT,
    linkedin TEXT,
    social TEXT,
    reason TEXT,
    role TEXT NOT NULL DEFAULT 'member',
    status TEXT NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active members for validation and collaboration platform
CREATE POLICY "Allow public select for active members"
    ON public.members
    FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- Allow insert by anon/authenticated (controlled via approval flow / service role)
CREATE POLICY "Allow insert for members"
    ON public.members
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow update
CREATE POLICY "Allow update for members"
    ON public.members
    FOR UPDATE
    TO anon, authenticated
    USING (true);

-- Allow delete
CREATE POLICY "Allow delete for members"
    ON public.members
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_members_member_id ON public.members(member_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(status);
