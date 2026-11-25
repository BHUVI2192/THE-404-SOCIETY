/**
 * lib/supabase.ts — Supabase client (single instance)
 */
import { createClient } from '@supabase/supabase-js';

const ACTIVE_SUPABASE_URL = 'https://ccteuughftetfjpvrjtb.supabase.co';
const ACTIVE_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdGV1dWdoZnRldGZqcHZyanRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjU1NTYsImV4cCI6MjEwNDIwMTU1Nn0.IKE9hWJpaa-neqRVljSoXglY7Ltw-XxsCPFRdwW6nvQ';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const isStaleUrl = !envUrl || envUrl.includes('tevtluhuznkovezjgohh');

const supabaseUrl = isStaleUrl ? ACTIVE_SUPABASE_URL : envUrl;
const supabaseAnonKey = isStaleUrl
  ? ACTIVE_SUPABASE_ANON_KEY
  : import.meta.env.VITE_SUPABASE_ANON_KEY || ACTIVE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
  },
});
