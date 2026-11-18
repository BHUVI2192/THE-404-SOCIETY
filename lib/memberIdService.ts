/**
 * lib/memberIdService.ts — Member ID counter (Supabase only)
 * Table: member_id_counters (year PK, counter, last_id)
 */
import { supabase } from './supabase';

export const validateMemberId = (memberId: string): boolean =>
  /^404-[A-Z0-9]{3,12}$/i.test(memberId) || /^404-\d{4}-\d{3}$/.test(memberId);

export const getYearCounter = async (year: number): Promise<number> => {
  const { data } = await supabase
    .from('member_id_counters')
    .select('counter')
    .eq('year', year)
    .single();
  return data?.counter ?? 0;
};

export const generateMemberId = async (year = new Date().getFullYear()): Promise<string> => {
  const { data: existing } = await supabase
    .from('member_id_counters')
    .select('counter')
    .eq('year', year)
    .single();

  const counter = (existing?.counter ?? 0) + 1;
  const memberId = `404-${year}-${String(counter).padStart(3, '0')}`;

  await supabase
    .from('member_id_counters')
    .upsert({ year, counter, last_id: memberId }, { onConflict: 'year' });

  return memberId;
};

export const setMemberId = async (memberId: string): Promise<boolean> => {
  const match = memberId.match(/^404-(\d{4})-(\d{3})$/);
  if (!match) return false;

  const year = parseInt(match[1]);
  const number = parseInt(match[2]);

  const { data: existing } = await supabase
    .from('member_id_counters')
    .select('counter')
    .eq('year', year)
    .single();

  const currentCounter = existing?.counter ?? 0;
  if (number >= currentCounter) {
    await supabase
      .from('member_id_counters')
      .upsert({ year, counter: number, last_id: memberId }, { onConflict: 'year' });
  }
  return true;
};
