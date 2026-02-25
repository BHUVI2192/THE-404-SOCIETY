import emailjs from "@emailjs/browser";
import { logEmail } from "./emailLog";

const SVC = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const PUB = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

// ── Template IDs — set these in .env.local after creating templates in EmailJS
const T = {
    regConfirm: import.meta.env.VITE_EMAILJS_REG_CONFIRM_ID || "",
    communityConfirm: import.meta.env.VITE_EMAILJS_COMMUNITY_CONFIRM_ID || "",
    communityStatus: import.meta.env.VITE_EMAILJS_COMMUNITY_STATUS_ID || "",
    newsletter: import.meta.env.VITE_EMAILJS_NEWSLETTER_ID || "",
    bulkEvent: import.meta.env.VITE_EMAILJS_BULK_EVENT_ID || "",
};

async function send(templateId: string, params: Record<string, string>): Promise<void> {
    if (!templateId) throw new Error("EMAIL_TEMPLATE_NOT_CONFIGURED");
    await emailjs.send(SVC, templateId, { ...params, from_name: "The 404 Society" }, PUB);
}


// ── Individual emails ─────────────────────────────────────────────────────────

/** Sent automatically when a user registers for an event */
export async function sendEventConfirm(to: {
    name: string; email: string; eventTitle: string; eventDate: string; eventLocation: string;
}) {
    return send(T.regConfirm, {
        to_name: to.name,
        to_email: to.email,
        event_title: to.eventTitle,
        event_date: to.eventDate,
        event_location: to.eventLocation || "TBA",
    });
}

/** Sent automatically when a user submits a community join application */
export async function sendCommunityConfirm(to: { name: string; email: string }) {
    return send(T.communityConfirm, { to_name: to.name, to_email: to.email });
}

/** Sent from admin when approving or rejecting a community application */
export async function sendCommunityStatusEmail(to: {
    name: string; email: string; status: "approved" | "rejected";
}) {
    return send(T.communityStatus, {
        to_name: to.name,
        to_email: to.email,
        status: to.status.toUpperCase(),
        status_message:
            to.status === "approved"
                ? "🎉 Your application has been approved! Welcome to The 404 Society."
                : "Thank you for your interest. Unfortunately your application was not approved at this time.",
    });
}

/** Sent from admin Newsletter tab to a subscriber */
export async function sendNewsletterEmail(
    to: { name: string; email: string },
    subject: string,
    content: string
) {
    return send(T.newsletter, {
        to_name: to.name || "there",
        to_email: to.email,
        subject,
        content,
    });
}

/** Sent from admin Registrations tab for a custom event update */
export async function sendBulkEventUpdate(
    to: { name: string; email: string },
    eventTitle: string,
    message: string
) {
    return send(T.bulkEvent, {
        to_name: to.name,
        to_email: to.email,
        event_title: eventTitle,
        message,
    });
}

// ── New trigger-based emails (using EmailJS) ──────────────────────────────────

// Template IDs for trigger-based emails (set in .env.local)
const TRIGGER_TEMPLATES = {
    applicationReceived: import.meta.env.VITE_EMAILJS_APPLICATION_RECEIVED_ID || "",
    applicationApproved: import.meta.env.VITE_EMAILJS_APPLICATION_APPROVED_ID || "",
    applicationRejected: import.meta.env.VITE_EMAILJS_APPLICATION_REJECTED_ID || "",
    applicationWaitlisted: import.meta.env.VITE_EMAILJS_APPLICATION_WAITLISTED_ID || "",
};

/** Application Received - sent automatically when user submits community application */
export async function sendApplicationReceivedEmail(to: { name: string; email: string }) {
    try {
        const templateId = TRIGGER_TEMPLATES.applicationReceived;
        
        if (!templateId || !SVC || !PUB) {
            console.warn('EmailJS not configured for Application Received emails');
            return;
        }

        await emailjs.send(SVC, templateId, {
            to_email: to.email,
            to_name: to.name,
            from_name: "The 404 Society",
        }, PUB);

        await logEmail(to.email, to.name, 'applicationReceived', 'Your 404 Society application is received', 'sent');
        console.log(`✅ Application Received email sent to ${to.email}`);
    } catch (error) {
        console.error('Error sending application received email:', error);
        await logEmail(to.email, to.name, 'applicationReceived', 'Your 404 Society application is received', 'failed', String(error));
    }
}

/** Application Approved - sent when admin approves the application */
export async function sendApplicationApprovedEmail(to: { 
    name: string; 
    email: string;
    memberId: string;
    whatsappLink: string;
    portalLink?: string;
}) {
    try {
        const templateId = TRIGGER_TEMPLATES.applicationApproved;
        
        if (!templateId || !SVC || !PUB) {
            console.warn('EmailJS not configured for Application Approved emails');
            return;
        }

        await emailjs.send(SVC, templateId, {
            to_email: to.email,
            to_name: to.name,
            from_name: "The 404 Society",
            member_id: to.memberId,
            whatsapp_link: to.whatsappLink,
        }, PUB);

        await logEmail(to.email, to.name, 'applicationApproved', 'Welcome to 404 Society — Your Member ID is inside', 'sent');
        console.log(`✅ Application Approved email sent to ${to.email} (Member ID: ${to.memberId})`);
    } catch (error) {
        console.error('Error sending application approved email:', error);
        await logEmail(to.email, to.name, 'applicationApproved', 'Welcome to 404 Society', 'failed', String(error));
    }
}

/** Application Rejected - sent when admin rejects the application */
export async function sendApplicationRejectedEmail(to: {
    name: string;
    email: string;
    feedback?: string;
}) {
    try {
        const templateId = TRIGGER_TEMPLATES.applicationRejected;
        
        if (!templateId || !SVC || !PUB) {
            console.warn('EmailJS not configured for Application Rejected emails');
            return;
        }

        const feedbackText = to.feedback ? `Admin Feedback: ${to.feedback}` : '';

        await emailjs.send(SVC, templateId, {
            to_email: to.email,
            to_name: to.name,
            from_name: "The 404 Society",
            feedback: feedbackText,
        }, PUB);

        await logEmail(to.email, to.name, 'applicationRejected', 'Your 404 Society application update', 'sent');
        console.log(`✅ Application Rejected email sent to ${to.email}`);
    } catch (error) {
        console.error('Error sending application rejected email:', error);
        await logEmail(to.email, to.name, 'applicationRejected', 'Your 404 Society application update', 'failed', String(error));
    }
}

/** Application Waitlisted - sent when applicant is on waitlist */
export async function sendApplicationWaitlistedEmail(to: {
    name: string;
    email: string;
}) {
    try {
        const templateId = TRIGGER_TEMPLATES.applicationWaitlisted;
        
        if (!templateId || !SVC || !PUB) {
            console.warn('EmailJS not configured for Application Waitlisted emails');
            return;
        }

        await emailjs.send(SVC, templateId, {
            to_email: to.email,
            to_name: to.name,
            from_name: "The 404 Society",
        }, PUB);

        await logEmail(to.email, to.name, 'applicationWaitlisted', "You're on the 404 Society waitlist", 'sent');
        console.log(`✅ Application Waitlisted email sent to ${to.email}`);
    } catch (error) {
        console.error('Error sending application waitlisted email:', error);
        await logEmail(to.email, to.name, 'applicationWaitlisted', "You're on the 404 Society waitlist", 'failed', String(error));
    }
}

// ── Bulk helper ───────────────────────────────────────────────────────────────
export async function sendBulk<R extends { name?: string; email: string }>(
    recipients: R[],
    sendFn: (r: R) => Promise<void>,
    onProgress?: (done: number, total: number) => void
): Promise<{ success: number; failed: number }> {
    let success = 0, failed = 0;
    for (let i = 0; i < recipients.length; i++) {
        try { await sendFn(recipients[i]); success++; } catch { failed++; }
        onProgress?.(i + 1, recipients.length);
        if (i < recipients.length - 1) await new Promise(r => setTimeout(r, 500)); // rate-limit
    }
    return { success, failed };
}

// ── Template setup guide (used in admin dashboard UI) ────────────────────────
export const EMAIL_TEMPLATE_GUIDE = [
    { envKey: "VITE_EMAILJS_REG_CONFIRM_ID", label: "Event Registration Confirmation", vars: ["to_name", "to_email", "event_title", "event_date", "event_location", "from_name"] },
    { envKey: "VITE_EMAILJS_COMMUNITY_CONFIRM_ID", label: "Community Join Confirmation", vars: ["to_name", "to_email", "from_name"] },
    { envKey: "VITE_EMAILJS_COMMUNITY_STATUS_ID", label: "Application Status Update", vars: ["to_name", "to_email", "status", "status_message", "from_name"] },
    { envKey: "VITE_EMAILJS_NEWSLETTER_ID", label: "Newsletter", vars: ["to_name", "to_email", "subject", "content", "from_name"] },
    { envKey: "VITE_EMAILJS_BULK_EVENT_ID", label: "Event Bulk Update", vars: ["to_name", "to_email", "event_title", "message", "from_name"] },
];
