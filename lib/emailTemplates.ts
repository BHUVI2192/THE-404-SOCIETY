import { db } from "./firebase";
import { EmailTemplate } from "../types";

const EMAIL_TEMPLATES_COLLECTION = "email_templates";

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

// Initialize templates if they don't exist
export const initializeTemplates = async () => {
  const templates = await getEmailTemplates();
  if (templates.length === 0) {
    for (const template of DEFAULT_TEMPLATES) {
      await db.set(EMAIL_TEMPLATES_COLLECTION, [
        ...await getEmailTemplates(),
        {
          ...template,
          id: db.generateId(),
        },
      ]);
    }
  }
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  return db.get(EMAIL_TEMPLATES_COLLECTION);
};

export const getEmailTemplate = async (trigger: string): Promise<EmailTemplate | undefined> => {
  const templates = await getEmailTemplates();
  return templates.find((t) => t.trigger === trigger);
};

export const updateEmailTemplate = async (id: string, data: Partial<EmailTemplate>) => {
  const templates = await getEmailTemplates();
  const updated = templates.map((t) =>
    t.id === id
      ? {
          ...t,
          ...data,
          updatedAt: Date.now(),
        }
      : t
  );
  db.set(EMAIL_TEMPLATES_COLLECTION, updated);
};

export const toggleEmailTemplate = async (id: string) => {
  const templates = await getEmailTemplates();
  const template = templates.find((t) => t.id === id);
  if (template) {
    await updateEmailTemplate(id, { enabled: !template.enabled });
  }
};
