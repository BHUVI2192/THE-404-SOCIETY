/**
 * lib/events.ts — Events data layer (Supabase only)
 */
import { supabase } from './supabase';
import { EventPricing } from '../types';

export interface EventData {
  id?: string;
  title: string;
  date: string;
  year: string;
  location: string;
  img: string;
  status: 'open' | 'locked';
  category?: string;
  description?: string;
  pricing?: EventPricing;
  maxRegistrations?: number;
  whatsappLink?: string;
  createdAt?: number;
}

// Map Supabase snake_case row → camelCase EventData
const fromRow = (row: any): EventData => ({
  id: row.id,
  title: row.title,
  date: row.date,
  year: row.year,
  location: row.location,
  img: row.img,
  status: row.status,
  category: row.category ?? undefined,
  description: row.description ?? undefined,
  pricing: row.pricing ?? undefined,
  maxRegistrations: row.max_registrations ?? undefined,
  whatsappLink: row.whatsapp_link ?? undefined,
  createdAt: row.created_at,
});

// Map EventData → Supabase insert/update payload
const toRow = (e: Partial<EventData>) => {
  const row: any = {};
  if (e.title !== undefined) row.title = e.title;
  if (e.date !== undefined) row.date = e.date;
  if (e.year !== undefined) row.year = e.year;
  if (e.location !== undefined) row.location = e.location;
  if (e.img !== undefined) row.img = e.img;
  if (e.status !== undefined) row.status = e.status;
  if (e.category !== undefined) row.category = e.category;
  if (e.description !== undefined) row.description = e.description;
  if (e.pricing !== undefined) row.pricing = e.pricing;
  if (e.maxRegistrations !== undefined) row.max_registrations = e.maxRegistrations;
  if (e.whatsappLink !== undefined) row.whatsapp_link = e.whatsappLink;
  return row;
};

export const getEvents = async (): Promise<EventData[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getEvents error:', error); return []; }
  return (data || []).map(fromRow);
};

export const subscribeToEvents = (callback: (events: EventData[]) => void): (() => void) => {
  // Initial fetch
  getEvents().then(callback);
  // Realtime subscription
  const channel = supabase
    .channel('events_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
      getEvents().then(callback);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
};

export const getEventById = async (id: string): Promise<EventData | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return fromRow(data);
};

export const addEvent = async (event: Omit<EventData, 'id'>): Promise<string | null> => {
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...toRow(event), created_at: Date.now() }])
    .select('id')
    .single();
  if (error) { console.error('addEvent error:', error); return null; }
  return data?.id ?? null;
};

export const updateEvent = async (id: string, data: Partial<EventData>): Promise<void> => {
  const { error } = await supabase.from('events').update(toRow(data)).eq('id', id);
  if (error) console.error('updateEvent error:', error);
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) console.error('deleteEvent error:', error);
};

// ── Pricing helpers (unchanged logic) ──────────────────────
export const isEventFree = (event: EventData): boolean =>
  event.pricing?.isFree !== false;

export const getEffectivePrice = (event: EventData): number => {
  if (!event.pricing || event.pricing.isFree) return 0;
  const baseAmount = event.pricing.amount;
  if (event.pricing.earlyBirdDiscount?.enabled) {
    const validUntil = new Date(event.pricing.earlyBirdDiscount.validUntil);
    if (new Date() <= validUntil) {
      return Math.round(baseAmount * (1 - event.pricing.earlyBirdDiscount.discountPercent / 100));
    }
  }
  return baseAmount;
};

export const formatPrice = (amountInPaise: number): string => {
  const rupees = amountInPaise / 100;
  return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const isEarlyBirdActive = (event: EventData): boolean => {
  if (!event.pricing?.earlyBirdDiscount?.enabled) return false;
  return new Date() <= new Date(event.pricing.earlyBirdDiscount.validUntil);
};
