
// ── SMTP API Helper ──────────────────────────────────────────────────────────

async function sendEmailSMTP(to: string, subject: string, html: string): Promise<void> {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send email via SMTP');
    }
}

// ── Individual emails ─────────────────────────────────────────────────────────

/** Sent automatically when a user registers for an event */
export async function sendEventConfirm(to: {
    name: string; email: string; eventTitle: string; eventDate: string; eventLocation: string; whatsappLink?: string;
}) {
    const subject = `Registration Confirmed: ${to.eventTitle}`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #000;">Registration Confirmed!</h2>
            <p>Hi <b>${to.name}</b>,</p>
            <p>Your seat is reserved for <b>${to.eventTitle}</b>.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Date:</b> ${to.eventDate}</p>
                <p style="margin: 5px 0;"><b>Location:</b> ${to.eventLocation || "TBA"}</p>
            </div>
            ${to.whatsappLink ? `
            <div style="margin: 20px 0; text-align: center;">
                <p style="font-size: 14px; margin-bottom: 10px;">Join the official WhatsApp group for event updates:</p>
                <a href="${to.whatsappLink}" style="background-color: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Join WhatsApp Group</a>
            </div>
            ` : ''}
            <p>See you there!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

/** Sent automatically when a user submits a community join application */
export async function sendCommunityConfirm(to: { name: string; email: string }) {
    const subject = `Application Received: The 404 Society`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>We got your application!</h2>
            <p>Hi ${to.name},</p>
            <p>Thank you for applying to join <b>The 404 Society</b>. Our team is reviewing your profile and we'll get back to you within 3-5 business days.</p>
            <p>Stay tuned!</p>
            <p>Best regards,<br/>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

/** Sent from admin when approving or rejecting a community application */
export async function sendCommunityStatusEmail(to: {
    name: string; email: string; status: "approved" | "rejected";
}) {
    const isApproved = to.status === "approved";
    const subject = isApproved ? "Welcome to The 404 Society!" : "Update on your Application";
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Application ${isApproved ? 'Approved 🎉' : 'Update'}</h2>
            <p>Hi ${to.name},</p>
            <p>${isApproved 
                ? "🎉 Your application has been approved! Welcome to The 404 Society. You can now access the member portal and join our exclusive community events."
                : "Thank you for your interest in The 404 Society. Unfortunately, your application was not approved at this time. We encourage you to keep building and apply again in the future."
            }</p>
            <p>Best regards,<br/>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

/** Sent from admin Newsletter tab to a subscriber */
export async function sendNewsletterEmail(
    to: { name: string; email: string },
    subject: string,
    content: string
) {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hi ${to.name || "there"},</p>
            <div style="line-height: 1.6;">${content}</div>
            <p>Best regards,<br/>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

/** Sent from admin Registrations tab for a custom event update */
export async function sendBulkEventUpdate(
    to: { name: string; email: string },
    eventTitle: string,
    message: string
) {
    const subject = `Update regarding ${eventTitle}`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Event Update</h2>
            <p>Hi ${to.name},</p>
            <p>We have an update regarding <b>${eventTitle}</b>:</p>
            <div style="background: #f0f0f0; padding: 15px; border-left: 4px solid #000; margin: 20px 0;">
                ${message}
            </div>
            <p>Best regards,<br/>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

// ── Trigger-based emails (backward compatibility) ─────────────────────────────

export async function sendApplicationReceivedEmail(to: { name: string; email: string }) {
    return sendCommunityConfirm(to);
}

export async function sendApplicationApprovedEmail(to: { 
    name: string; 
    email: string;
    memberId: string;
    whatsappLink: string;
    portalLink?: string;
}) {
    const subject = "Welcome to 404 Society — Your Member ID is inside";
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Welcome to the Society! 🎉</h2>
            <p>Hi ${to.name},</p>
            <p>Congratulations, you're officially in!</p>
            <div style="background: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; opacity: 0.7;">YOUR MEMBER ID</p>
                <h1 style="margin: 10px 0; letter-spacing: 2px;">${to.memberId}</h1>
            </div>
            <p><b>Next Steps:</b></p>
            <ul>
                <li>Join our WhatsApp group: <a href="${to.whatsappLink || '#'}">Group Link</a></li>
                <li>For onboarding, contact Member **Thrisha K** on WhatsApp: <a href="https://wa.me/918951290096">+91 89512 90096</a></li>
            </ul>
            <p>Welcome aboard!</p>
            <p>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
}

export async function sendApplicationRejectedEmail(to: { name: string; email: string; feedback?: string }) {
    return sendCommunityStatusEmail({ ...to, status: 'rejected' });
}

export async function sendApplicationWaitlistedEmail(to: { name: string; email: string }) {
    const subject = "You're on the 404 Society waitlist";
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Waitlist Status</h2>
            <p>Hi ${to.name},</p>
            <p>You're shortlisted for the 404 Society! However, we have limited seats, and you're currently on our waitlist.</p>
            <p>We'll notify you immediately if a spot opens up.</p>
            <p>The 404 Society Team</p>
        </div>
    `;
    return sendEmailSMTP(to.email, subject, html);
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
        if (i < recipients.length - 1) await new Promise(r => setTimeout(r, 800)); // Increase rate-limit for SMTP
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
