/**
 * lib/community_apps.ts — Community Applications (Supabase only)
 * Table: onboarding_applications
 */
import { supabase } from './supabase';

export interface CommunityApp {
  id?: string;
  name: string;
  email: string;
  contact: string;
  college: string;
  year: string;
  interest?: string;
  skills?: string;
  reason?: string;
  social?: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  memberId?: string;
  feedbackReason?: string;
  emailsSent?: {
    applicationReceived?: boolean;
    applicationApproved?: boolean;
    applicationRejected?: boolean;
    applicationWaitlisted?: boolean;
  };
  createdAt?: number;
  updatedAt?: number;
}

const fromRow = (row: any): CommunityApp => ({
  id: row.id,
  name: row.name,
  email: row.email,
  contact: row.contact || '',
  college: row.college || '',
  year: row.year || '',
  interest: row.interest ?? undefined,
  skills: row.skills ?? undefined,
  reason: row.reason ?? undefined,
  social: row.social ?? undefined,
  status: row.status,
  memberId: row.member_id ?? undefined,
  feedbackReason: row.feedback_reason ?? undefined,
  emailsSent: row.emails_sent ?? {},
  createdAt: row.created_at ? new Date(row.created_at).getTime() : undefined,
  updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : undefined,
});

/** Returns true if an application with this email already exists */
export const checkDuplicateCommunityApp = async (email: string): Promise<boolean> => {
  const { data } = await supabase
    .from('onboarding_applications')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .limit(1);
  return (data?.length ?? 0) > 0;
};

export const getCommunityApps = async (): Promise<CommunityApp[]> => {
  const { data, error } = await supabase
    .from('onboarding_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getCommunityApps error:', error); return []; }
  return (data || []).map(fromRow);
};

export const subscribeToCommunityApps = (callback: (apps: CommunityApp[]) => void): (() => void) => {
  getCommunityApps().then(callback);
  const channel = supabase
    .channel('community_apps_changes_' + Math.random().toString(36).substring(7))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'onboarding_applications' }, () => {
      getCommunityApps().then(callback);
    })
    .subscribe();

  // Polling fallback every 15s in case websocket connection drops
  const pollInterval = setInterval(() => {
    getCommunityApps().then(callback);
  }, 15000);

  return () => { 
    clearInterval(pollInterval);
    supabase.removeChannel(channel); 
  };
};

export const saveCommunityApp = async (app: Omit<CommunityApp, 'id' | 'status'>) => {
  const cleanEmail = app.email?.trim().toLowerCase();
  const cleanName = app.name?.trim();

  if (!cleanName) {
    throw new Error('Name is required');
  }
  if (!cleanEmail) {
    throw new Error('Email is required');
  }

  const { data, error } = await supabase
    .from('onboarding_applications')
    .insert([{
      name: cleanName,
      email: cleanEmail,
      contact: app.contact || '',
      college: app.college || '',
      year: app.year || '',
      interest: app.interest || '',
      skills: app.skills || '',
      reason: app.reason || '',
      social: app.social || '',
      status: 'pending',
    }])
    .select('id')
    .single();
  if (error) {
    console.error('saveCommunityApp error:', error);
    throw error;
  }
  return { id: data.id };
};

export const updateCommunityApp = async (id: string, data: Partial<CommunityApp>): Promise<void> => {
  const updatePayload: any = { updated_at: new Date().toISOString() };
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.memberId !== undefined) updatePayload.member_id = data.memberId;
  if (data.feedbackReason !== undefined) updatePayload.feedback_reason = data.feedbackReason;
  if (data.emailsSent !== undefined) updatePayload.emails_sent = data.emailsSent;
  const { error } = await supabase.from('onboarding_applications').update(updatePayload).eq('id', id);
  if (error) console.error('updateCommunityApp error:', error);
};

export const deleteCommunityApp = async (id: string): Promise<void> => {
  const { error } = await supabase.from('onboarding_applications').delete().eq('id', id);
  if (error) console.error('deleteCommunityApp error:', error);
};
