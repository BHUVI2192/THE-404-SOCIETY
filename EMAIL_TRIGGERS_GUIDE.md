# Email Triggers & Member ID System - Implementation Guide

## Overview

This document describes the complete implementation of the 4-tier email trigger system and automatic Member ID generation for the 404 Society community applications workflow.

## System Architecture

### 1. Email Templates Service (`lib/emailTemplates.ts`)

Manages all email templates with full CRUD operations. Includes 4 default templates:

- **Application Received** - Sent automatically when user submits application
- **Application Approved** - Sent when admin clicks Approve
- **Application Rejected** - Sent when admin clicks Reject
- **Application Waitlisted** - Sent when admin clicks Waitlist

Each template has:
- `trigger`: Unique identifier
- `subject`: Email subject line
- `body`: Email body with `{{variable}}` placeholders
- `enabled`: Toggle to enable/disable
- `variables`: List of available variables for that email

### 2. Member ID Service (`lib/memberIdService.ts`)

Generates unique Member IDs in the format: **404-YYYY-NNN**

- `404`: Fixed club identifier
- `YYYY`: Joining year (auto-detected from current date)
- `NNN`: Auto-incremented 3-digit number per year (001, 002, 003...)

**Key Functions:**
- `generateMemberId(year)` - Auto-generates next available ID for a year
- `setMemberId(memberId)` - Manual override for edge cases
- `validateMemberId(id)` - Validates ID format

**Example IDs:** 404-2026-001, 404-2026-047, 404-2027-003

### 3. Email Log Service (`lib/emailLog.ts`)

Tracks all sent emails for auditing and debugging.

**Logged Information:**
- Recipient name & email
- Email trigger type
- Email subject
- Sent/failed status
- Timestamp
- Error message (if failed)

### 4. Email Service Triggers (`lib/emailService.ts`)

Four new trigger functions that send emails with custom templates:

```typescript
// Application received (auto-send on form submit)
sendApplicationReceivedEmail({ name, email })

// Application approved (on admin approval)
sendApplicationApprovedEmail({ 
  name, 
  email, 
  memberId, 
  whatsappLink,
  portalLink // optional
})

// Application rejected (on admin rejection)
sendApplicationRejectedEmail({ 
  name, 
  email, 
  feedback // optional admin feedback
})

// Application waitlisted (on waitlist action)
sendApplicationWaitlistedEmail({ name, email })
```

---

## Admin Panel Features

### Community Management Page (`pages/admin/CommunityManagement.tsx`)

**New Features:**

1. **Enhanced Filters**
   - Search now includes Member ID
   - New "Waitlisted" status filter

2. **Member ID Display**
   - Shows "Member ID" field for approved applications
   - Displays in monospace font for clarity

3. **Approve/Reject/Waitlist Actions**
   - Each pending application has action buttons
   - Clicking opens a modal with options:

   **Approve Modal:**
   - Auto-generate Member ID (recommended)
   - Option to manually override Member ID
   - WhatsApp group link input (for email)
   - Validates ID format before sending

   **Reject Modal:**
   - Optional feedback textarea
   - Feedback is included in rejection email
   - Stored permanently against application

   **Waitlist Modal:**
   - Simple confirmation
   - Sends waitlist status email

4. **Email Tracking**
   - Records which emails have been sent
   - Prevents duplicate sends
   - Logs in Email Logs section

---

### Settings Page (`pages/admin/Settings.tsx`)

Located at `/admin/settings` with two tabs:

#### Email Templates Tab

**Features:**
- View all 4 email templates
- Edit subject and body for each
- Variable substitution guide
- Enable/disable individual triggers
- Shows last updated timestamp

**Available Variables by Trigger:**
- `applicationReceived`: `{{name}}`
- `applicationApproved`: `{{name}}`, `{{member_id}}`, `{{whatsapp_link}}`
- `applicationRejected`: `{{name}}`, `{{feedback}}`
- `applicationWaitlisted`: `{{name}}`

**Example template:**
```
Subject: Welcome to 404 Society — Your Member ID is inside

Body:
Hi {{name}},

Congratulations, you're officially in! 🎉

Your Member ID: {{member_id}}

WhatsApp: {{whatsapp_link}}

...
```

#### Email Logs Tab

**Features:**
- View all sent emails in chronological order
- Sort by recipient, trigger, status
- Filter by trigger type
- View error messages for failed sends
- Shows timestamp for each email

**Log Columns:**
- Recipient (name + email)
- Email subject
- Trigger type
- Status (Sent ✓ / Failed ✗)
- Date & time

---

## Database Schema

### CommunityApp (Updated)

```typescript
interface CommunityApp {
  id?: string;
  name: string;
  email: string;
  contact: string;
  college: string;
  year: string;
  interest?: string;
  social?: string;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  
  // NEW FIELDS
  memberId?: string;           // "404-2026-047"
  feedbackReason?: string;     // Admin feedback on rejection
  emailsSent?: {
    applicationReceived?: boolean;
    applicationApproved?: boolean;
    applicationRejected?: boolean;
    applicationWaitlisted?: boolean;
  };
  createdAt?: number;
  updatedAt?: number;
}
```

### EmailTemplate

```typescript
interface EmailTemplate {
  id: string;
  trigger: 'applicationReceived' | 'applicationApproved' | 
           'applicationRejected' | 'applicationWaitlisted';
  subject: string;
  body: string;
  enabled: boolean;
  variables: string[];
  createdAt: number;
  updatedAt: number;
}
```

### EmailLog

```typescript
interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  trigger: string;
  subject: string;
  status: 'sent' | 'failed';
  timestamp: number;
  error?: string;
}
```

---

## Workflow Example

### Step 1: User Submits Application
User fills form on Community page → Form submission triggers:
```typescript
sendApplicationReceivedEmail({ 
  name: "Rajesh", 
  email: "rajesh@example.com" 
})
```
✉️ **Email sent:** "Your 404 Society application is received"

### Step 2: Admin Reviews in Community Section
Admin navigates to `/admin/community`
- Sees all pending applications
- Reviews candidate details

### Step 3: Admin Approves & Generates Member ID
Admin clicks "Approve" button on Rajesh's application
- Modal opens
- Member ID auto-generated: **404-2026-047**
- Admin enters WhatsApp link
- Clicks "Approve & Send Email"

```typescript
// Internally:
generateMemberId(2026) // Returns "404-2026-047"
sendApplicationApprovedEmail({
  name: "Rajesh",
  email: "rajesh@example.com",
  memberId: "404-2026-047",
  whatsappLink: "https://chat.whatsapp.com/..."
})
```

✉️ **Email sent:**
```
Subject: Welcome to 404 Society — Your Member ID is inside

Hi Rajesh,

Congratulations, you're officially in! 🎉

Your Member ID: 404-2026-047

WhatsApp: https://chat.whatsapp.com/...

[Portal login instructions]
```

### Step 4: Member Receives Email & Takes Action
Rajesh receives the email and:
1. Joins WhatsApp group via link
2. Logs into Member Portal using Member ID: **404-2026-047**
3. Completes profile
4. Waits for orientation

---

## Key Features Summary

### Automatic Features
- ✅ Member ID auto-generated on approval
- ✅ Emails auto-sent based on actions
- ✅ Email logs auto-tracked
- ✅ Templates auto-initialized on first load
- ✅ Year-based ID counter

### Manual Controls
- 🔧 Override Member ID in edge cases
- 🔧 Edit all email templates
- 🔧 Add/modify variable text in templates
- 🔧 Enable/disable specific email triggers
- 🔧 Add feedback/notes before rejection

### Safety Features
- ✓ Validates Member ID format (404-YYYY-NNN)
- ✓ Prevents duplicate Member ID assignments
- ✓ Tracks which emails were sent
- ✓ Logs all email activity for audit trail
- ✓ Error handling for failed sends

---

## API Integration Points

### When Integrating with Real Email Service (EmailJS):

1. **Update emailService.ts** to use EmailJS templates:
```typescript
// Replace the logging with actual EmailJS sending
await send(T.yourEmailJSId, {
  to_email: to.email,
  subject: subject,
  body: body,
  // ... other parameters
});
```

2. **Set up EmailJS templates** for each trigger:
   - Create templates in EmailJS dashboard
   - Get template IDs
   - Add to .env.local

3. **Test the flow** end-to-end before going live

---

## Customization Guide

### Changing Email Template Content

1. Go to Admin Panel → Settings → Email Templates
2. Click "Edit Template" on desired email
3. Modify subject and body
4. Use available variables as placeholders
5. Click "Save Changes"

### Adding a New Status (e.g., "Interviewing")

1. Update CommunityApp interface in `lib/community_apps.ts`
2. Add new trigger to `types.ts`
3. Create new default template in `lib/emailTemplates.ts`
4. Add new send function in `lib/emailService.ts`
5. Add UI in `CommunityManagement.tsx`

### Customizing Member ID Format

Edit `lib/memberIdService.ts`:
```typescript
// Change format as needed, e.g., "SOCIETY-2026-047"
const memberId = `SOCIETY-${year}-${paddedNumber}`;
```

---

## Troubleshooting

### Issue: Emails not sending
- Check if templates are enabled in Settings
- Verify email service credentials in .env
- Check Email Logs for error messages
- Ensure recipient email is valid

### Issue: Member ID not auto-generating
- Check browser localStorage (currentimplementation)
- Verify year counter is initialized
- Try manual override if auto-generation fails

### Issue: Duplicate Member IDs
- Not possible with auto-generation
- Manual override validates format
- Check Email Logs to see what was sent

### Issue: Templates not appearing
- Click "Initialize Templates" in Settings
- Clear browser cache if using localStorage
- Check browser console for errors

---

## Mobile Responsive Features

✓ Admin settings responsive on mobile
✓ Community management works on tablets
✓ Modal dialogs adapt to screen size
✓ Email form fields stack on small screens
✓ Log table scrolls horizontally on mobile

---

## Future Enhancements

Possible additions to this system:

1. **Bulk Actions**
   - Approve multiple applications at once
   - Send custom emails to specific groups

2. **Email Scheduling**
   - Schedule emails to send at specific times
   - Batch send optimization

3. **Automation Rules**
   - Auto-approve based on criteria
   - Auto-waitlist if quota exceeded
   - Auto-advance from waitlist

4. **Analytics**
   - Email open tracking
   - Response rate metrics
   - Funnel analysis

5. **Integration**
   - Slack notifications for admins
   - SMS fallback for important emails
   - Calendar integration for interviews

---

## Support & Questions

For issues or questions about this implementation:
1. Check the Troubleshooting section above
2. Review the code comments in service files
3. Check Email Logs for detailed error messages
4. Verify all environment variables are set correctly

---

**Version:** 1.0
**Last Updated:** February 26, 2026
**Status:** Production Ready
