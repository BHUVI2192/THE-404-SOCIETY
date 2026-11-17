-- Create email_templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
    id TEXT PRIMARY KEY,
    trigger TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
    updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_email_templates_select" ON public.email_templates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_email_templates_insert" ON public.email_templates FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_email_templates_update" ON public.email_templates FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "public_email_templates_delete" ON public.email_templates FOR DELETE TO anon, authenticated USING (true);
