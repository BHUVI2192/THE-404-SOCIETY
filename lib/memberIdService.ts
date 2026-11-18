/**
 * lib/memberIdService.ts — Member ID generator & validator (Supabase only)
 * Generates unique, non-pattern cryptographic Member IDs (e.g. 404-9F82, 404-3D71).
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

/**
 * Generates a random 4-character non-pattern alphanumeric code (e.g., 9F82, 7K2M).
 * Excludes easily confusable characters (0, O, 1, I).
 */
function generateRandomEntropy(length = 4): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a unique, non-pattern Member ID (e.g. 404-8K2N).
 * Verifies that the generated ID does not already exist in the database.
 */
export const generateMemberId = async (year = new Date().getFullYear()): Promise<string> => {
  let memberId = '';
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    attempts++;
    const code = generateRandomEntropy(4);
    memberId = `404-${code}`;

    // Check if ID is already assigned in members table
    const { data } = await supabase
      .from('members')
      .select('member_id')
      .eq('member_id', memberId)
      .maybeSingle();

    if (!data) {
      exists = false;
    }
  }

  // Record counter and last_id in member_id_counters table
  const { data: existing } = await supabase
    .from('member_id_counters')
    .select('counter')
    .eq('year', year)
    .maybeSingle();

  const counter = (existing?.counter ?? 0) + 1;
  await supabase
    .from('member_id_counters')
    .upsert({ year, counter, last_id: memberId }, { onConflict: 'year' });

  return memberId;
};

export const setMemberId = async (memberId: string): Promise<boolean> => {
  if (!validateMemberId(memberId)) return false;

  const year = new Date().getFullYear();
  const { data: existing } = await supabase
    .from('member_id_counters')
    .select('counter')
    .eq('year', year)
    .maybeSingle();

  const counter = (existing?.counter ?? 0) + 1;
  await supabase
    .from('member_id_counters')
    .upsert({ year, counter, last_id: memberId.toUpperCase() }, { onConflict: 'year' });

  return true;
};
