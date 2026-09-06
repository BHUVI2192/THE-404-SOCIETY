import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tevtluhuznkovezjgohh.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldnRsdWh1em5rb3Zlempnb2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzUwNzQsImV4cCI6MjA4OTk1MTA3NH0._2_hylQjLgPDdBZie6CaOCCKwUneb9oi8HQrRkbRFZ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
  }
})


