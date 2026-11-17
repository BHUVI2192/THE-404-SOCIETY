/**
 * lib/members.ts — Members registry (Supabase only)
 * Table: members
 * Used by community approval flow + future project collaboration app.
 */
import { supabase } from './supabase';

export interface Member {
  id?: string;
  memberId: string;     // 404-YYYY-NNN format
  name: string;
  email: string;
  social?: string | null;
  college?: string;
  year?: string;
  interest?: string;
  approvedAt: number;
  communityAppId?: string;
}

const fromRow = (row: any): Member => ({
  id: row.id,
  memberId: row.member_id,
  name: row.name,
  email: row.email,
  social: row.social ?? null,
  college: row.college ?? undefined,
  year: row.year ?? undefined,
  interest: row.interest ?? undefined,
  approvedAt: row.approved_at,
  communityAppId: row.community_app_id ?? undefined,
});

export async function saveMember(member: Omit<Member, 'id'>): Promise<string> {
  const { data, error } = await supabase
    .from('members')
    .insert([{
      member_id: member.memberId,
      name: member.name,
      email: member.email,
      social: member.social ?? null,
      college: member.college ?? null,
      year: member.year ?? null,
      interest: member.interest ?? null,
      approved_at: member.approvedAt,
      community_app_id: member.communityAppId ?? null,
    }])
    .select('id')
    .single();
  if (error) {
    console.error('[members] saveMember error:', error);
    throw error;
  }
  console.log(`[members] Saved member ${member.memberId} → Supabase id: ${data.id}`);
  return data.id;
}

export async function getMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('approved_at', { ascending: false });
  if (error) { console.error('[members] getMembers error:', error); return []; }
  return (data || []).map(fromRow);
}

export async function getMemberByMemberId(memberId: string): Promise<Member | null> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('member_id', memberId)
    .single();
  return data ? fromRow(data) : null;
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const { data } = await supabase
    .from('members')
    .select('*')
    .eq('email', email)
    .single();
  return data ? fromRow(data) : null;
}
