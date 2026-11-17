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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    _FIREBASE_API_KEY=AIzaSyBWUAgMfQxicK09MJyOXLHYdkLb-IOU3tI
VITE_FIREBASE_AUTH_DOMAIN=the-404-society-backend.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=the-404-society-backend
VITE_FIREBASE_STORAGE_BUCKET=the-404-society-backend.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=129406327256
VITE_FIREBASE_APP_ID=1:129406327256:web:0d4bbd523ee50dea433aad
VITE_EMAILJS_SERVICE_ID=service_d8ikxk7
VITE_EMAILJS_PUBLIC_KEY=IGxwmhBT2FsHcNLRg
VITE_ADMIN_SECRET=admin123
VITE_GEMINI_API_KEY=AIzaSyDnC_X9bBzNdNVrtEvaj0-il91nRAggHow

# ── Razorpay Payment Gateway ──────────────────────────────────────────────────
# Public key — safe to expose in the browser bundle
VITE_RAZORPAY_KEY_ID=rzp_test_SPszl0IhFrWBJS
VITE_RAZORPAY_MODE=TEST

# Server-side only keys (NO VITE_ prefix = never bundled into the browser).
# Used by api/create-order.js (Vercel) and the Vite dev-server middleware.
RAZORPAY_KEY_ID=rzp_test_SPszl0IhFrWBJS
RAZORPAY_KEY_SECRET=DkRR2lKZDf71Md3DIMhAK9D0

# ── Email Automation Templates (create in EmailJS > Email Templates) ──────────
# Each template must have "To Email" field set to {{to_email}}
VITE_EMAILJS_APPLICATION_RECEIVED_ID=template_ru5r9z8
VITE_EMAILJS_APPLICATION_APPROVED_ID=template_281c12k


# ── AI Email Composer (one generic template: to_name, to_email, subject, message, from_name, reply_to)
VITE_EMAILJS_ADMIN_EMAIL_ID=

# ── Google SMTP Credentials (Server-side only) ──────────────────────────────────
EMAIL_USER=the404society01@gmail.com
EMAIL_PASS="xews guhy wtqm tbsh"
# ── Supabase (Linked: ccteuughftetfjpvrjtb) ──────────────────────────────────
VITE_SUPABASE_URL=https://ccteuughftetfjpvrjtb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdGV1dWdoZnRldGZqcHZyanRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjU1NTYsImV4cCI6MjEwNDIwMTU1Nn0.IKE9hWJpaa-neqRVljSoXglY7Ltw-XxsCPFRdwW6nvQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdGV1dWdoZnRldGZqcHZyanRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYyNTU1NiwiZXhwIjoyMTA0MjAxNTU2fQ.gx4W_XZrkM122A7kR8fwtT9QZoXc7LJ2vJqcOHrzp6Y