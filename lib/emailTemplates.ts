import { supabase } from "./supabase";
import { EmailTemplate } from "../types";

// Default templates
const DEFAULT_TEMPLATES: Omit<EmailTemplate, 'id'>[] = [
  {
    trigger: 'applicationReceived',
    subject: 'Your 404 Society application is received',
    body: `Hi {{name}},

We got your application, it's under review.

Expected response time: 3–5 days

What happens next — we'll reach out for a short interview if shortlisted.

Meanwhile, follow us on Instagram and check our website for updates.

No login needed yet at this stage.

Cheers,
The 404 Society Team`,
    enabled: true,
    variables: ['name'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    trigger: 'applicationApproved',
    subject: 'Welcome to 404 Society — Your Member ID is inside',
    body: `Hi {{name}},

Congratulations, you're officially in! 🎉

Your Member ID: {{member_id}}

This is your unique identifier for accessing the Member Portal. Keep it safe!

Next steps:
1. Join our WhatsApp group: {{whatsapp_link}}
2. Log into the Member Portal using your Member ID
3. Complete your profile
4. Wait for orientation details

Welcome aboard!

The 404 Society Team`,
    enabled: true,
    variables: ['name', 'member_id', 'whatsapp_link'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    trigger: 'applicationRejected',
    subject: 'Your 404 Society application update',
    body: `Hi {{name}},

Thank you for applying to the 404 Society. While we were impressed by your interest, we couldn't shortlist your application for this batch.

This doesn't mean the end of your journey with us. We encourage you to reapply in the next cycle — your passion and skills matter to us.

{{feedback}}

Keep building, keep learning, and we'll see you soon!

Best regards,
The 404 Society Team`,
    enabled: true,
    variables: ['name', 'feedback'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    trigger: 'applicationWaitlisted',
    subject: "You're on the 404 Society waitlist",
    body: `Hi {{name}},

Great news — you're shortlisted for the 404 Society! However, we have limited seats, and you're currently on our waitlist.

We'll notify you immediately if a spot opens up. Keep an eye on your email for updates.

In the meantime, stay engaged with our community through Instagram and our website.

Fingers crossed! 🤞

The 404 Society Team`,
    enabled: true,
    variables: ['name'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const fromRow = (row: any): EmailTemplate => ({
  id: row.id,
  trigger: row.trigger,
  subject: row.subject,
  body: row.body,
  enabled: row.enabled,
  variables: row.variables || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Initialize templates if they don't exist
export const initializeTemplates = async () => {
  try {
    const templates = await getEmailTemplates();
    if (templates.length === 0) {
      for (const template of DEFAULT_TEMPLATES) {
        await supabase.from('email_templates').upsert({
          id: template.trigger,
          trigger: template.trigger,
          subject: template.subject,
          body: template.body,
          enabled: template.enabled,
          variables: template.variables,
          created_at: template.createdAt,
          updated_at: template.updatedAt,
        }, { onConflict: 'trigger' });
      }
    }
  } catch (error) {
    console.error("Error initializing templates in Supabase:", error);
  }
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error getting email templates:", error);
      return [];
    }

    return (data || []).map(fromRow);
  } catch (error) {
    console.error("Error getting templates:", error);
    return [];
  }
};

export const getEmailTemplate = async (trigger: string): Promise<EmailTemplate | undefined> => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('trigger', trigger)
      .single();

    if (error || !data) {
      // Fallback: check in DEFAULT_TEMPLATES
      const found = DEFAULT_TEMPLATES.find((t) => t.trigger === trigger);
      return found ? { ...found, id: found.trigger } : undefined;
    }

    return fromRow(data);
  } catch (error) {
    console.error("Error getting template by trigger:", error);
    return undefined;
  }
};

export const updateEmailTemplate = async (id: string, data: Partial<EmailTemplate>) => {
  try {
    const updatePayload: any = { updated_at: Date.now() };
    if (data.subject !== undefined) updatePayload.subject = data.subject;
    if (data.body !== undefined) updatePayload.body = data.body;
    if (data.enabled !== undefined) updatePayload.enabled = data.enabled;
    if (data.variables !== undefined) updatePayload.variables = data.variables;

    const { error } = await supabase
      .from('email_templates')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error("Error updating template in Supabase:", error);
    }
  } catch (error) {
    console.error("Error updating template:", error);
  }
};

export const toggleEmailTemplate = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('email_templates')
      .select('enabled')
      .eq('id', id)
      .single();

    if (!error && data) {
      await supabase
        .from('email_templates')
        .update({ enabled: !data.enabled, updated_at: Date.now() })
        .eq('id', id);
    }
  } catch (error) {
    console.error("Error toggling template:", error);
  }
};
