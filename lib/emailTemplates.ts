import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
  try {
    const templates = await getEmailTemplates();
    if (templates.length === 0) {
      const templatesRef = collection(db, EMAIL_TEMPLATES_COLLECTION);
      for (const template of DEFAULT_TEMPLATES) {
        // Use the trigger string as the document ID
        const docRef = doc(templatesRef, template.trigger);
        await setDoc(docRef, { ...template, id: template.trigger });
      }
    }
  } catch (error) {
    console.error("Error initializing templates:", error);
  }
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const templatesRef = collection(db, EMAIL_TEMPLATES_COLLECTION);
    const snapshot = await getDocs(templatesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailTemplate));
  } catch (error) {
    console.error("Error getting templates:", error);
    return [];
  }
};

export const getEmailTemplate = async (trigger: string): Promise<EmailTemplate | undefined> => {
  try {
    // Attempt to load from doc ID (trigger setup)
    const docRef = doc(db, EMAIL_TEMPLATES_COLLECTION, trigger);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as EmailTemplate;
    }
    // Fallback search
    const templates = await getEmailTemplates();
    return templates.find((t) => t.trigger === trigger);
  } catch (error) {
    console.error("Error getting template by trigger:", error);
    return undefined;
  }
};

export const updateEmailTemplate = async (id: string, data: Partial<EmailTemplate>) => {
  try {
    const docRef = doc(db, EMAIL_TEMPLATES_COLLECTION, id);
    await updateDoc(docRef, { ...data, updatedAt: Date.now() });
  } catch (error) {
    console.error("Error updating template:", error);
  }
};

export const toggleEmailTemplate = async (id: string) => {
  try {
    const docRef = doc(db, EMAIL_TEMPLATES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const current = docSnap.data().enabled;
      await updateDoc(docRef, { enabled: !current, updatedAt: Date.now() });
    }
  } catch (error) {
    console.error("Error toggling template:", error);
  }
};
