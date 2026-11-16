# EmailJS Quick Start - 5 Minute Setup

## Step 1: Create EmailJS Account (2 minutes)

1. Go to [emailjs.com](https://www.emailjs.com)
2. Click "Sign Up" and create account
3. Verify email

✅ **Done**

---

## Step 2: Set Up Email Service (1 minute)

1. Log in to EmailJS dashboard
2. Click "Email Services"
3. Click "Add Service"
4. Select **Gmail** (easiest for testing)
5. Follow the authorization flow
6. **Copy your Service ID** (looks like `service_abc123xyz`)

✅ **Done** - Save Service ID

---

## Step 3: Get Your API Key (1 minute)

1. Click "Account" in top right
2. Click "API Keys"
3. **Copy Public Key** (starts with `pk_pub_`)

✅ **Done** - Save Public Key

---

## Step 4: Create .env.local File (1 minute)

Create a file `.env.local` in your project root with:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_paste_your_id_here
VITE_EMAILJS_PUBLIC_KEY=pk_pub_paste_your_key_here

# Email Template IDs (leave empty for now, will fill after creating templates)
VITE_EMAILJS_APPLICATION_RECEIVED_ID=
VITE_EMAILJS_APPLICATION_APPROVED_ID=
VITE_EMAILJS_APPLICATION_REJECTED_ID=
VITE_EMAILJS_APPLICATION_WAITLISTED_ID=
```

Replace with your actual Service ID and Public Key.

✅ **Done**

---

## Step 5: Create Email Templates in EmailJS (5 minutes)

Go back to EmailJS dashboard → "Email Templates"

### Template 1: Application Received

Click "Create New Template"

**Name:** `404_Application_Received`

**Subject:**
```
Your 404 Society application is received
```

**Content:**
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

**Copy Template ID** from top right ✅

---

### Template 2: Application Approved

Click "Create New Template"

**Name:** `404_Application_Approved`

**Subject:**
```
Welcome to 404 Society — Your Member ID is inside
```

**Content:**
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

**Copy Template ID** ✅

---

### Template 3: Application Rejected

Click "Create New Template"

**Name:** `404_Application_Rejected`

**Subject:**
```
Your 404 Society application update
```

**Content:**
```
Hi {{to_name}},

Thank you for applying to the 404 Society. While we were impressed by your interest, we couldn't shortlist your application for this batch.

This doesn't mean the end of your journey with us. We encourage you to reapply in the next cycle — your passion and skills matter to us.

{{feedback}}

Keep building, keep learning, and we'll see you soon!

Best regards,
The 404 Society Team
```

**Copy Template ID** ✅

---

### Template 4: Application Waitlisted

Click "Create New Template"

**Name:** `404_Application_Waitlisted`

**Subject:**
```
You're on the 404 Society waitlist
```

**Content:**
```
Hi {{to_name}},

Great news — you're shortlisted for the 404 Society! However, we have limited seats, and you're currently on our waitlist.

We'll notify you immediately if a spot opens up. Keep an eye on your email for updates.

In the meantime, stay engaged with our community through Instagram and our website.

Fingers crossed! 🤞

The 404 Society Team
```

**Copy Template ID** ✅

---

## Step 6: Update .env.local with Template IDs

Now update your `.env.local` with the 4 Template IDs you just created:

```bash
VITE_EMAILJS_SERVICE_ID=service_xyz123abc
VITE_EMAILJS_PUBLIC_KEY=pk_pub_123456xyz
VITE_EMAILJS_APPLICATION_RECEIVED_ID=template_abc123
VITE_EMAILJS_APPLICATION_APPROVED_ID=template_def456
VITE_EMAILJS_APPLICATION_REJECTED_ID=template_ghi789
VITE_EMAILJS_APPLICATION_WAITLISTED_ID=template_jkl012
```

✅ **Done**

---

## Step 7: Test It!

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Go to Admin Dashboard:**
   - Navigate to `/admin`
   - Click "Community"

3. **Create a test application:**
   - Fill out the community application form
   - You'll get an "Application Received" email ✅

4. **Approve the application:**
   - In Community tab, click "Approve"
   - Enter WhatsApp group link
   - Click "Approve & Send Email"
   - Check inbox for "Welcome" email ✅

5. **Check Admin Settings:**
   - Go to Admin → Settings → Email Logs
   - Should see all emails sent ✅

---

## Troubleshooting

### Issue: "Template not configured" error

**Fix:** Check that `.env.local` has all environment variables and restart dev server.

```bash
# Stop: Press Ctrl+C
# Then: npm run dev
```

### Issue: Emails not arriving

**Check:**
1. Check spam folder
2. Verify Template ID is correct in .env.local
3. Check browser console (F12) for errors
4. Verify service is active in EmailJS dashboard

### Issue: "Service not found" error

**Fix:** Check Service ID is exactly correct (copy from EmailJS dashboard)

---

## What's Happening Behind the Scenes

✅ When user submits application → `sendApplicationReceivedEmail()` fires automatically

✅ When admin clicks Approve → `sendApplicationApprovedEmail()` fires with Member ID

✅ When admin clicks Reject → `sendApplicationRejectedEmail()` fires with feedback

✅ When admin clicks Waitlist → `sendApplicationWaitlistedEmail()` fires

✅ All emails logged in Admin → Settings → Email Logs for audit trail

---

## Quick Reference

| Action | Email Sent | Info |
|--------|-----------|------|
| Form Submit | Application Received | Auto |
| Admin Approve | Application Approved | Member ID + WhatsApp link |
| Admin Reject | Application Rejected | Optional feedback |
| Admin Waitlist | Application Waitlisted | Confirmation |

---

## Next Steps

Once working:
- Test all 4 email triggers
- Verify Member ID generation (format: 404-2026-XXX)
- Check Email Logs in Admin panel
- Deploy to production with same .env variables

---

Need more details? See `EMAILJS_SETUP_GUIDE.md` for comprehensive setup.

**Setup Time: ~10 minutes**
**Email Sending: Real-time after setup**

🎉 You're all set!
