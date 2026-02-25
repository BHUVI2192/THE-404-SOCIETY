# Quick Start - Testing the Email & Member ID System

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/admin`

### Step 2: Create a Test Application
1. Go to `http://localhost:5173/community`
2. Fill out the community application form
3. Submit the form
4. You should see a success message

### Step 3: Access Admin Panel
1. Navigate to `http://localhost:5173/admin`
2. You should see Dashboard with stats

### Step 4: Review Application in Community Section
1. Click "Community" in the sidebar
2. You should see your test application in "Pending" status
3. Click on it to see details

---

## 🧪 Test Scenarios

### Test 1: Auto-Generate Member ID
**Objective:** Verify Member ID auto-generation

1. In Community section, find your pending application
2. Click the "Approve" button
3. Modal opens - keep Member ID field empty
4. Enter WhatsApp link: `https://chat.whatsapp.com/example123`
5. Click "Approve & Send Email"

**Expected Results:**
- Application status changes to "Approved"
- Member ID in format `404-2026-XXX` is displayed
- Email is logged in Settings → Email Logs

**Verification:**
```
✓ Member ID appears in application card
✓ Format matches 404-YYYY-NNN
✓ Email log shows "applicationApproved" trigger
✓ Email subject is correct
```

---

### Test 2: Manual Member ID Override
**Objective:** Verify admin can override Member ID

1. Create another test application
2. Click "Approve"
3. In the modal, enter custom Member ID: `404-2026-999`
4. Enter WhatsApp link
5. Click "Approve & Send Email"

**Expected Results:**
- Custom Member ID is accepted
- Application displays `404-2026-999`
- Email is logged

**Verification:**
```
✓ Custom ID accepted
✓ ID format validated
✓ Email sent successfully
```

---

### Test 3: Member ID Format Validation
**Objective:** Verify invalid Member IDs are rejected

1. Create another test application
2. Click "Approve"
3. Enter invalid Member ID: `invalid-format`
4. Click "Approve & Send Email"

**Expected Results:**
- Error message: "Invalid Member ID format. Use: 404-YYYY-NNN"
- Application not updated
- No email sent

**Verification:**
```
✓ Invalid format rejected
✓ Error message shown
✓ No email in logs
```

---

### Test 4: Application Rejection
**Objective:** Verify rejection workflow with feedback

1. Create another test application
2. Click "Reject" button
3. Modal opens - add feedback: "Not aligned with current focus areas"
4. Click "Reject & Send Email"

**Expected Results:**
- Application status changes to "Rejected"
- Feedback is displayed in application card
- Email is logged as "applicationRejected"
- Feedback appears in Email Logs

**Verification:**
```
✓ Status changed to Rejected
✓ Feedback displayed
✓ Email logged with trigger
✓ Recipient shown in logs
```

---

### Test 5: Waitlist Action
**Objective:** Verify waitlist workflow

1. Create another test application
2. Click "Waitlist" button
3. Modal shows action
4. Click "Waitlist & Send Email"

**Expected Results:**
- Application status changes to "Waitlisted"
- Email is logged as "applicationWaitlisted"
- Stat card shows "Waitlisted" count

**Verification:**
```
✓ Status changed to Waitlisted
✓ Email logged
✓ Stats updated correctly
```

---

### Test 6: Email Templates Editing
**Objective:** Verify admin can customize email templates

1. Navigate to `/admin/settings`
2. Click "Email Templates" tab
3. Find "Application Approved" template
4. Click "Edit Template"
5. Change subject to: `Welcome Aboard, {{name}}!`
6. Change first line of body to: `Hey {{name}}, excited to have you!`
7. Click "Save Changes"

**Expected Results:**
- Template is updated
- Changes persist on page reload
- Next approval email uses new template

**Verification:**
```
✓ Edit modal opens
✓ Changes save without error
✓ Reloading shows saved changes
```

---

### Test 7: Email Logs Viewing
**Objective:** Verify email logs are tracked

1. Go to `/admin/settings`
2. Click "Email Logs" tab
3. You should see all emails sent in previous tests

4. Click on a log entry to see details:
   - Recipient name & email
   - Subject line
   - Trigger type
   - Status (Sent/Failed)
   - Timestamp

**Expected Results:**
- All emails from tests are listed
- Most recent emails appear first
- All details are accurate

**Verification:**
```
✓ Logs show all sent emails
✓ Recipient info is correct
✓ Trigger type matches action
✓ Timestamps are accurate
```

---

### Test 8: Search by Member ID
**Objective:** Verify Member ID search functionality

1. Go to Community section
2. In the search box, enter a Member ID (e.g., `404-2026-047`)
3. Only applications with that Member ID should appear

**Expected Results:**
- Search filters by Member ID
- Shows exact match only
- Case-insensitive

**Verification:**
```
✓ Search is case-insensitive
✓ Exact match filtering works
✓ Search clears when field emptied
```

---

### Test 9: Status Filters
**Objective:** Verify new "Waitlisted" filter works

1. Go to Community section
2. Click "Waitlisted" filter button
3. Only waitlisted applications should appear

4. Click "All" to reset

**Expected Results:**
- Waitlisted filter shows only waitlisted apps
- Other filters work as before
- Stats update correctly

**Verification:**
```
✓ Waitlist filter works
✓ Stats count is accurate
✓ All filters are mutually exclusive
```

---

### Test 10: Mobile Responsive
**Objective:** Verify mobile experience

1. Open DevTools (F12)
2. Toggle device toolbar (mobile view)
3. Test on iPad (768px) and iPhone (375px)

**Test items:**
- Community management cards stack

 vertically
- Modal dialogs fit on screen
- Settings page is readable
- Navigation is accessible
- Buttons are clickable

**Expected Results:**
- All content is visible and usable
- No horizontal scroll needed
- Touch-friendly element sizes

**Verification:**
```
✓ Responsive on all breakpoints
✓ Text is readable at all sizes
✓ Modals work on mobile
✓ No hidden content
```

---

## 🔍 Debugging Tips

### Check Browser Console
```javascript
// View all community apps
const apps = JSON.parse(localStorage.getItem('nexus_community_applications'));
console.log(apps);

// View all email templates
const templates = JSON.parse(localStorage.getItem('email_templates'));
console.log(templates);

// View all email logs
const logs = JSON.parse(localStorage.getItem('email_logs'));
console.log(logs);

// View Member ID counters
const counters = JSON.parse(localStorage.getItem('member_id_counters'));
console.log(counters);
```

### Clear All Data
If you need to start fresh:
```javascript
// In browser console:
localStorage.removeItem('nexus_community_applications');
localStorage.removeItem('email_templates');
localStorage.removeItem('email_logs');
localStorage.removeItem('member_id_counters');
location.reload();
```

### View Network Requests
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Perform actions (approve, reject, etc.)
4. Check request/response payloads

---

## ✅ Success Criteria

You've successfully tested the system when:

- [x] Member IDs are generated in correct format (404-2026-NNN)
- [x] All 4 email triggers fire at appropriate times
- [x] Email templates can be edited from admin panel
- [x] Email logs show all sent emails
- [x] Admin can provide feedback on rejections
- [x] Search works by Member ID
- [x] Waitlist status is functional
- [x] Mobile experience is responsive
- [x] Data persists after page reload
- [x] No console errors

---

## 📊 Test Coverage

| Feature | Test # | Status |
|---------|--------|--------|
| Member ID Auto-Generate | Test 1 | ✅ |
| Member ID Manual Override | Test 2 | ✅ |
| ID Format Validation | Test 3 | ✅ |
| Email Rejection | Test 4 | ✅ |
| Waitlist Action | Test 5 | ✅ |
| Template Editing | Test 6 | ✅ |
| Email Logs | Test 7 | ✅ |
| Search by Member ID | Test 8 | ✅ |
| Waitlist Filter | Test 9 | ✅ |
| Mobile Responsive | Test 10 | ✅ |

---

## 🐛 Known Issues & Workarounds

### Issue: Templates not initializing
**Workaround:** Clear localStorage and reload
```javascript
localStorage.clear();
location.reload();
```

### Issue: Email not logging
**Cause:** Service might be catching errors silently
**Fix:** Check browser console for error messages
```javascript
console.error() statements in emailService.ts
```

### Issue: Member ID counter off
**Workaround:** Manually reset counter
```javascript
localStorage.setItem('member_id_counters', JSON.stringify([
  { year: 2026, counter: 0, lastId: '' }
]));
```

---

## 📞 Need Help?

If tests fail:

1. Check browser console for errors
2. Verify localStorage data using DevTools
3. Clear cache/localStorage and retry
4. Check EMAIL_TRIGGERS_GUIDE.md for details
5. Review code comments in service files

---

**Ready to test?** Start with Test 1 above!

Good luck! 🎉
