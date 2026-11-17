/**
 * lib/registrations.ts — Event Registrations (Supabase only)
 * Table: registrations
 */
import { supabase } from './supabase';

export interface Registration {
  id?: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  studentId?: string;
  phone?: string;
  branch?: string;
  year?: string;
  teamName?: string;
  paymentStatus?: 'not_required' | 'pending' | 'completed' | 'failed';
  paymentId?: string;
  amountPaid?: number;
  createdAt?: number;
}

const fromRow = (row: any): Registration => ({
  id: row.id,
  eventId: row.event_id,
  eventTitle: row.event_title,
  name: row.name,
  email: row.email,
  studentId: row.student_id ?? undefined,
  phone: row.phone ?? undefined,
  branch: row.branch ?? undefined,
  year: row.year ?? undefined,
  teamName: row.team_name ?? undefined,
  paymentStatus: row.payment_status ?? 'not_required',
  paymentId: row.payment_id ?? undefined,
  amountPaid: row.amount_paid ?? undefined,
  createdAt: row.created_at,
});

const toRow = (r: Partial<Registration>) => {
  const row: any = {};
  if (r.eventId !== undefined) row.event_id = r.eventId;
  if (r.eventTitle !== undefined) row.event_title = r.eventTitle;
  if (r.name !== undefined) row.name = r.name;
  if (r.email !== undefined) row.email = r.email;
  if (r.studentId !== undefined) row.student_id = r.studentId;
  if (r.phone !== undefined) row.phone = r.phone;
  if (r.branch !== undefined) row.branch = r.branch;
  if (r.year !== undefined) row.year = r.year;
  if (r.teamName !== undefined) row.team_name = r.teamName;
  if (r.paymentStatus !== undefined) row.payment_status = r.paymentStatus;
  if (r.paymentId !== undefined) row.payment_id = r.paymentId;
  if (r.amountPaid !== undefined) row.amount_paid = r.amountPaid;
  return row;
};

/** Returns true if (email + eventId) already has a registration */
export const checkDuplicateRegistration = async (email: string, eventId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('registrations')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .eq('event_id', eventId)
    .limit(1);
  return (data?.length ?? 0) > 0;
};

export const getRegistrations = async (): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getRegistrations error:', error); return []; }
  return (data || []).map(fromRow);
};

export const subscribeToRegistrations = (callback: (regs: Registration[]) => void): (() => void) => {
  getRegistrations().then(callback);
  const channel = supabase
    .channel('registrations_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'registrations' }, () => {
      getRegistrations().then(callback);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const saveRegistration = async (reg: Omit<Registration, 'id'>) => {
  const { data, error } = await supabase
    .from('registrations')
    .insert([{ ...toRow(reg), email: reg.email?.trim().toLowerCase(), created_at: Date.now() }])
    .select('id')
    .single();
  if (error) { console.error('saveRegistration error:', error); throw error; }
  return { id: data.id };
};

export const deleteRegistration = async (id: string): Promise<void> => {
  const { error } = await supabase.from('registrations').delete().eq('id', id);
  if (error) console.error('deleteRegistration error:', error);
};

export const updateRegistrationPayment = async (
  registrationId: string,
  paymentStatus: Registration['paymentStatus'],
  paymentId?: string,
  amountPaid?: number
): Promise<boolean> => {
  const updateData: any = { payment_status: paymentStatus };
  if (paymentId) updateData.payment_id = paymentId;
  if (amountPaid !== undefined) updateData.amount_paid = amountPaid;
  const { error } = await supabase.from('registrations').update(updateData).eq('id', registrationId);
  if (error) { console.error('updateRegistrationPayment error:', error); return false; }
  return true;
};

export const getRegistrationById = async (id: string): Promise<Registration | null> => {
  const { data, error } = await supabase.from('registrations').select('*').eq('id', id).single();
  if (error || !data) return null;
  return fromRow(data);
};
