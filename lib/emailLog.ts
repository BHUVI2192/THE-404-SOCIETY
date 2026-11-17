/**
 * lib/emailLog.ts — Email audit logs (Supabase only)
 * Table: email_logs
 */
import { supabase } from './supabase';
import { EmailLog } from '../types';

const fromRow = (row: any): EmailLog => ({
  id: row.id,
  recipientEmail: row.recipient_email,
  recipientName: row.recipient_name,
  trigger: row.trigger,
  subject: row.subject,
  status: row.status,
  error: row.error ?? undefined,
  timestamp: row.timestamp,
});

export const logEmail = async (
  recipientEmail: string,
  recipientName: string,
  trigger: string,
  subject: string,
  status: 'sent' | 'failed' = 'sent',
  error?: string
): Promise<void> => {
  const { error: dbError } = await supabase.from('email_logs').insert([{
    recipient_email: recipientEmail,
    recipient_name: recipientName,
    trigger,
    subject,
    status,
    error: error || null,
    timestamp: Date.now(),
  }]);
  if (dbError) console.error('logEmail error:', dbError);
};

export const getEmailLogs = async (limitCount?: number): Promise<EmailLog[]> => {
  let query = supabase.from('email_logs').select('*').order('timestamp', { ascending: false });
  if (limitCount) query = query.limit(limitCount);
  const { data, error } = await query;
  if (error) { console.error('getEmailLogs error:', error); return []; }
  return (data || []).map(fromRow);
};

export const getEmailLogsByTrigger = async (trigger: string): Promise<EmailLog[]> => {
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('trigger', trigger)
    .order('timestamp', { ascending: false });
  if (error) { console.error('getEmailLogsByTrigger error:', error); return []; }
  return (data || []).map(fromRow);
};

export const getEmailLogsByRecipient = async (email: string): Promise<EmailLog[]> => {
  const { data, error } = await supabase
    .from('email_logs')
    .select('*')
    .eq('recipient_email', email)
    .order('timestamp', { ascending: false });
  if (error) { console.error('getEmailLogsByRecipient error:', error); return []; }
  return (data || []).map(fromRow);
};

export const clearOldLogs = async (daysOld = 90): Promise<number> => {
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const { data, error } = await supabase
    .from('email_logs')
    .delete()
    .lt('timestamp', cutoffTime)
    .select('id');
  if (error) { console.error('clearOldLogs error:', error); return 0; }
  return data?.length ?? 0;
};
