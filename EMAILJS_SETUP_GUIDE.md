# EmailJS Setup Guide - Complete Integration

## Step 1: Create EmailJS Account

### 1.1 Sign Up
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Click "Sign Up For Free"
3. Register with email address
4. Verify email
5. Log in to dashboard

### 1.2 Create Service
1. In dashboard, click "Email Services"
2. Click "Add Service"
3. Choose email provider:
   - **Gmail** (easiest for testing)
   - **Outlook**
   - **Yahoo Mail**
   - **Custom SMTP**

### 1.3 For Gmail Setup:
1. Select "Gmail" service
2. Connect your Gmail account
3. Click "Connect Account"
4. Allow EmailJS to access Gmail
5. Click "Create Service"
6. Save your **Service ID** (starts with `service_`)

Example: `service_abc123xyz`

---

## Step 2: Get Your API Credentials

### 2.1 Find Service ID
1. Go to "Email Services" in dashboard
2. Click on your service
3. Copy **Service ID**

### 2.2 Find Public Key
1. Go to "Account" → "API Keys"
2. Copy **Public Key** (Long string like `pk_pub_abc123...`)

### 2.3 Create Template IDs
You'll create 4 email templates in EmailJS:

---

## Step 3: Create Email Templates in EmailJS

### Template 1: Application Received

1. In EmailJS dashboard, click "Email Templates"
2. Click "Create New Template"
3. Fill in:

**Template Name:** `404_Application_Received`

**Email Subject:**
```
Your 404 Society application is received
```

**Email Content:**
```
Hi {{to_name}},

We got your application, it's under review.

Expected response time: 3–5 days

What happens next — we'll reach out for a short interview if shortlisted.

Meanwhile, follow us on Instagram and check our website for updates.

No login needed yet at this stage.

Cheers,
The 404 Society Team
```

4. Click "Save"
5. Copy **Template ID** (top right, looks like `template_abc123`)

---

### Template 2: Application Approved

1. Click "Create New Template"

**Template Name:** `404_Application_Approved`

**Email Subject:**
```
Welcome to 404 Society — Your Member ID is inside
```

**Email Content:**
```
Hi {{to_name}},

Congratulations, you're officially in! 🎉

Your Member ID: {{member_id}}

This is your unique identifier for accessing the Member Portal. Keep it safe!

Next steps:
1. Join our WhatsApp group: {{whatsapp_link}}
2. Log into the Member Portal using your Member ID
3. Complete your profile
4. Wait for orientation details

Welcome aboard!

The 404 Society Team
```

4. Click "Save"
5. Copy **Template ID**

---

### Template 3: Application Rejected

1. Click "Create New Template"

**Template Name:** `404_Application_Rejected`

**Email Subject:**
```
Your 404 Society application update
```

**Email Content:**
```
Hi {{to_name}},

Thank you for applying to the 404 Society. While we were impressed by your interest, we couldn't shortlist your application for this batch.

This doesn't mean the end of your journey with us. We encourage you to reapply in the next cycle — your passion and skills matter to us.

{{feedback}}

Keep building, keep learning, and we'll see you soon!

Best regards,
The 404 Society Team
```

4. Click "Save"
5. Copy **Template ID**

---

### Template 4: Application Waitlisted

1. Click "Create New Template"

**Template Name:** `404_Application_Waitlisted`

**Email Subject:**
```
You're on the 404 Society waitlist
```

**Email Content:**
```
Hi {{to_name}},

Great news — you're shortlisted for the 404 Society! However, we have limited seats, and you're currently on our waitlist.

We'll notify you immediately if a spot opens up. Keep an eye on your email for updates.

In the meantime, stay engaged with our community through Instagram and our website.

Fingers crossed! 🤞

The 404 Society Team
```

4. Click "Save"
5. Copy **Template ID**

---

## Step 4: Set Environment Variables

Create or update `.env.local` in your project root:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_service_id_here
VITE_EMAILJS_PUBLIC_KEY=pk_pub_your_public_key_here

# Email Template IDs
VITE_EMAILJS_APPLICATION_RECEIVED_ID=template_your_id_here
VITE_EMAILJS_APPLICATION_APPROVED_ID=template_your_id_here
VITE_EMAILJS_APPLICATION_REJECTED_ID=template_your_id_here
VITE_EMAILJS_APPLICATION_WAITLISTED_ID=template_your_id_here

# Sender Configuration
VITE_EMAILJS_FROM_EMAIL=your-email@gmail.com
VITE_EMAILJS_FROM_NAME=The 404 Society
```

### Where to Find These Values:

| Variable | Where to Find |
|----------|---------------|
| SERVICE_ID | Email Services page |
| PUBLIC_KEY | Account → API Keys |
| TEMPLATE IDs | Email Templates (copy after creating each) |
| FROM_EMAIL | Your email address |
| FROM_NAME | 404 Society (or your name) |

---

## Step 5: Update the Code

### Update `lib/emailService.ts`

Replace the four new email functions with actual EmailJS calls:

```typescript
import emailjs from "@emailjs/browser";
import { getEmailTemplate } from "./emailTemplates";
import { logEmail } from "./emailLog";

const SVC = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const PUB = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

// Template IDs from EmailJS
const TEMPLATE_IDS = {
  applicationReceived: import.meta.env.VITE_EMAILJS_APPLICATION_RECEIVED_ID || "",
  applicationApproved: import.meta.env.VITE_EMAILJS_APPLICATION_APPROVED_ID || "",
  applicationRejected: import.meta.env.VITE_EMAILJS_APPLICATION_REJECTED_ID || "",
  applicationWaitlisted: import.meta.env.VITE_EMAILJS_APPLICATION_WAITLISTED_ID || "",
};

// Helper to render template variables
function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template;
  Object.entries(variables).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  });
  return rendered;
}

// Application Received Email
export async function sendApplicationReceivedEmail(to: { name: string; email: string }) {
  try {
    const template = await getEmailTemplate('applicationReceived');
    if (!template || !template.enabled) {
      console.warn('Application Received email disabled');
      return;
    }

    const subject = renderTemplate(template.subject, { name: to.name });
    const body = renderTemplate(template.body, { name: to.name });

    await emailjs.send(SVC, TEMPLATE_IDS.applicationReceived, {
      to_email: to.email,
      to_name: to.name,
      from_name: "The 404 Society",
      subject: subject,
      body: body,
    }, PUB);

    await logEmail(to.email, to.name, 'applicationReceived', subject, 'sent');
    console.log(`✅ Application Received email sent to ${to.email}`);
  } catch (error) {
    console.error('Error sending application received email:', error);
    await logEmail(to.email, to.name, 'applicationReceived', 'Application Received', 'failed', String(error));
  }
}

// Application Approved Email
export async function sendApplicationApprovedEmail(to: {
  name: string;
  email: string;
  memberId: string;
  whatsappLink: string;
  portalLink?: string;
}) {
  try {
    const template = await getEmailTemplate('applicationApproved');
    if (!template || !template.enabled) {
      console.warn('Application Approved email disabled');
      return;
    }

    const variables = {
      name: to.name,
      member_id: to.memberId,
      whatsapp_link: to.whatsappLink,
      portal_link: to.portalLink || 'https://portal.the404society.in',
    };

    const subject = renderTemplate(template.subject, { name: to.name });
    const body = renderTemplate(template.body, variables);

    await emailjs.send(SVC, TEMPLATE_IDS.applicationApproved, {
      to_email: to.email,
      to_name: to.name,
      from_name: "The 404 Society",
      subject: subject,
      body: body,
      member_id: to.memberId,
      whatsapp_link: to.whatsappLink,
    }, PUB);

    await logEmail(to.email, to.name, 'applicationApproved', subject, 'sent');
    console.log(`✅ Application Approved email sent to ${to.email} (Member ID: ${to.memberId})`);
  } catch (error) {
    console.error('Error sending application approved email:', error);
    await logEmail(to.email, to.name, 'applicationApproved', 'Application Approved', 'failed', String(error));
  }
}

// Application Rejected Email
export async function sendApplicationRejectedEmail(to: {
  name: string;
  email: string;
  feedback?: string;
}) {
  try {
    const template = await getEmailTemplate('applicationRejected');
    if (!template || !template.enabled) {
      console.warn('Application Rejected email disabled');
      return;
    }

    const feedbackText = to.feedback
      ? `Admin Feedback: "${to.feedback}"`
      : '';

    const variables = {
      name: to.name,
      feedback: feedbackText,
    };

    const subject = renderTemplate(template.subject, { name: to.name });
    const body = renderTemplate(template.body, variables);

    await emailjs.send(SVC, TEMPLATE_IDS.applicationRejected, {
      to_email: to.email,
      to_name: to.name,
      from_name: "The 404 Society",
      subject: subject,
      body: body,
      feedback: feedbackText,
    }, PUB);

    await logEmail(to.email, to.name, 'applicationRejected', subject, 'sent');
    console.log(`✅ Application Rejected email sent to ${to.email}`);
  } catch (error) {
    console.error('Error sending application rejected email:', error);
    await logEmail(to.email, to.name, 'applicationRejected', 'Application Rejected', 'failed', String(error));
  }
}

// Application Waitlisted Email
export async function sendApplicationWaitlistedEmail(to: {
  name: string;
  email: string;
}) {
  try {
    const template = await getEmailTemplate('applicationWaitlisted');
    if (!template || !template.enabled) {
      console.warn('Application Waitlisted email disabled');
      return;
    }

    const subject = renderTemplate(template.subject, { name: to.name });
    const body = renderTemplate(template.body, { name: to.name });

    await emailjs.send(SVC, TEMPLATE_IDS.applicationWaitlisted, {
      to_email: to.email,
      to_name: to.name,
      from_name: "The 404 Society",
      subject: subject,
      body: body,
    }, PUB);

    await logEmail(to.email, to.name, 'applicationWaitlisted', subject, 'sent');
    console.log(`✅ Application Waitlisted email sent to ${to.email}`);
  } catch (error) {
    console.error('Error sending application waitlisted email:', error);
    await logEmail(to.email, to.name, 'applicationWaitlisted', 'Application Waitlisted', 'failed', String(error));
  }
}
```

---

## Step 6: Test the Integration

### 6.1 Verify Environment Variables
```bash
# Check if vars are loaded (in browser console)
console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID)
console.log(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
```

### 6.2 Test Email Sending

1. Start dev server: `npm run dev`
2. Go to Admin → Community
3. Create test application (or use existing)
4. Click "Approve"
5. Enter WhatsApp link
6. Click "Approve & Send Email"
7. Check your email inbox for the approval email

### 6.3 Check Console Logs
Open DevTools (F12) → Console tab
Look for messages like:
```
✅ Application Approved email sent to test@example.com (Member ID: 404-2026-001)
```

### 6.4 Verify Email Logs
1. Go to Admin → Settings → Email Logs tab
2. Should show:
   - Recipient email
   - Subject line
   - Trigger type (applicationApproved)
   - Status (Sent ✓)
   - Timestamp

---

## Step 7: Troubleshooting

### Issue: "Email template not configured" error

**Cause:** Environment variables not set correctly

**Fix:**
```bash
# Verify .env.local exists in project root
# Should have all 4 VITE_EMAILJS_* variables
# Restart dev server: npm run dev
```

### Issue: Emails not sending but no error

**Cause:** Template ID is wrong or service not running

**Fix:**
1. Check `.env.local` has all values
2. Verify template IDs in EmailJS dashboard
3. Check service is "Active" (green checkmark)
4. Try sending test email from EmailJS dashboard

### Issue: "Service not found" or authentication error

**Cause:** Service ID or Public Key is incorrect

**Fix:**
1. Go to EmailJS Account page
2. Copy exact values (no extra spaces)
3. Paste into `.env.local`
4. Restart dev server

### Issue: Email arrives in spam folder

**Cause:** Gmail filters or SPF issues

**Fix:**
1. Check spam folder
2. Mark as "Not Spam"
3. Add to contacts
4. For production: Set up SPF/DKIM records

---

## Step 8: Gmail-Specific Setup (Recommended)

### Enable Less Secure App Access

If using personal Gmail:

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Scroll down to "Less Secure App Access"
3. Toggle ON
4. EmailJS can now send emails

**Note:** Better option is to use Gmail App Password (2FA required):
1. Enable 2-factor authentication
2. Go to Security settings
3. Create "App Password" for EmailJS
4. Use that password instead

---

## Step 9: Production Deployment

### For Hosting (Vercel, Netlify, etc.):

1. Add environment variables to hosting dashboard:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_APPLICATION_RECEIVED_ID`
   - `VITE_EMAILJS_APPLICATION_APPROVED_ID`
   - `VITE_EMAILJS_APPLICATION_REJECTED_ID`
   - `VITE_EMAILJS_APPLICATION_WAITLISTED_ID`

2. Redeploy your application

3. Test by creating an application and checking emails

---

## Step 10: Email Rate Limiting

EmailJS has rate limits on free plan:

| Plan | Emails/Month | Cost |
|------|-------------|------|
| Free | 200 | $0 |
| Pro | Unlimited | $9.99/mo |

**For 404 Society:**
- ~50 applications/month expected
- Free tier should be sufficient
- Upgrade to Pro if needed

---

## Complete Checklist

- [ ] Created EmailJS account
- [ ] Set up email service (Gmail/Outlook)
- [ ] Created 4 email templates in EmailJS
- [ ] Got Service ID
- [ ] Got Public Key
- [ ] Created .env.local with all credentials
- [ ] Updated lib/emailService.ts with EmailJS code
- [ ] Restarted dev server
- [ ] Tested with approval email
- [ ] Verified email received in inbox
- [ ] Checked Email Logs in admin panel
- [ ] Set environment variables on hosting platform
- [ ] Deployed to production
- [ ] Tested production emails

---

## Quick Reference

### Environment Variables
```bash
VITE_EMAILJS_SERVICE_ID=service_ABC123...
VITE_EMAILJS_PUBLIC_KEY=pk_pub_XYZ789...
VITE_EMAILJS_APPLICATION_RECEIVED_ID=template_received_123
VITE_EMAILJS_APPLICATION_APPROVED_ID=template_approved_123
VITE_EMAILJS_APPLICATION_REJECTED_ID=template_rejected_123
VITE_EMAILJS_APPLICATION_WAITLISTED_ID=template_waitlist_123
```

### Testing Command
```bash
# In browser console:
// Check if EmailJS is loaded and service available
console.log('Service:', import.meta.env.VITE_EMAILJS_SERVICE_ID?.substring(0, 15) + '...');
console.log('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.substring(0, 15) + '...');
```

---

## Support

**EmailJS Documentation:** [emailjs.com/docs](https://www.emailjs.com/docs)

**Common Issues:** [emailjs.com/help](https://www.emailjs.com/help)

**Need Help?**
1. Check browser console for specific error
2. Verify all env variables are set
3. Test service in EmailJS dashboard
4. Check email is in spam folder

---

**Setup Complete!** Your 404 Society email system is now ready to send real emails. 🎉

Generated: February 26, 2026
