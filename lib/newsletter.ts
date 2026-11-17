/**
 * lib/newsletter.ts — Newsletter subscribers (Supabase only)
 * Table: newsletter_subscribers
 */
import { supabase } from './supabase';

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  subscribedAt?: number;
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) { console.error('getSubscribers error:', error); return []; }
  return (data || []).map(row => ({
    id: row.id,
    email: row.email,
    name: row.name ?? '',
    subscribedAt: row.subscribed_at,
  }));
}

export async function subscribeToNewsletter(email: string, name?: string): Promise<void> {
  const trimmedEmail = email.toLowerCase().trim();

  // Check for existing subscription
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', trimmedEmail)
    .limit(1);

  if (existing && existing.length > 0) {
    throw new Error('This email is already subscribed!');
  }

  const { error } = await supabase.from('newsletter_subscribers').insert([{
    email: trimmedEmail,
    name: name?.trim() || '',
    subscribed_at: Date.now(),
  }]);

  if (error) {
    console.error('subscribeToNewsletter error:', error);
    throw error;
  }
}

export async function unsubscribeById(id: string): Promise<void> {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) console.error('unsubscribeById error:', error);
}
