# Admin Dashboard - Quick Start Guide

## 🚀 Getting Started

The admin dashboard is now fully integrated into your application. Here's how to access and use it.

## Access the Admin Panel

### Local Development
```
http://localhost:5173/#/admin
```

### In Production
```
https://your-domain.com/#/admin
```

## Dashboard Structure

```
Admin Dashboard
├── 📊 Dashboard (Main Overview)
├── 📅 Events (Manage Events)
├── 👥 Registrations (View Event Registrations)
└── 🤝 Community (Manage Community Applications)
```

## Quick Tips

### 1. Event Management

**Create a New Event:**
1. Go to `/admin/events`
2. Click "New Event" button (top right)
3. Fill in the event details:
   - Title (required)
   - Date (e.g., "MAR 15")
   - Year (e.g., "2026")
   - Location (required)
   - Category (optional)
   - Image URL (optional)
   - Description (optional)
4. Click "Save Event"

**Edit an Event:**
1. Click the ✏️ (Edit) icon next to an event
2. Modify the details
3. Click "Save Event"

**Toggle Event Status:**
1. Click the status button (Open/Locked) to toggle
2. "Open" = accepting registrations
3. "Locked" = no new registrations

**Delete an Event:**
1. Click the 🗑️ (Delete) icon
2. Confirm deletion

---

### 2. View Event Registrations

**Access Registrations:**
1. Go to `/admin/registrations`

**Filter Registrations:**
- Use the search box to find by name, email, or student ID
- Use the event dropdown to filter by specific event

**Export Data:**
1. Click "Export CSV" button
2. CSV file downloads to your computer
3. Open in Excel, Sheets, or any spreadsheet app

**Delete Registration:**
1. Click the 🗑️ (Delete) icon
2. Confirm deletion

---

### 3. Manage Community Applications

**Access Community Apps:**
1. Go to `/admin/community`

**Filter Applications:**
- Use status filters: All, Pending, Approved, Rejected
- Use search box to find by name, email, or college

**Review Application:**
1. Each application is shown as a card
2. View all applicant details:
   - Name, Email, Contact Number
   - College, Year of Study
   - Areas of Interest
   - Social/Portfolio Links

**Approve Application:**
1. For pending applications, click "Approve" (green button)
2. Application status changes to "Approved"
3. Applicant becomes a community member

**Reject Application:**
1. For pending applications, click "Reject" (red button)
2. Application status changes to "Rejected"

**Delete Application:**
1. Click the 🗑️ (Delete) icon
2. Confirm deletion

---

## Dashboard Statistics

The main dashboard shows:
- **Total Events**: All events you've created
- **Active Events**: Events currently open for registration
- **Event Registrations**: Total people registered for events
- **Community Applications**: Total community membership applications
- **Approved Members**: Number of approved community members
- **Pending Review**: Applications awaiting your decision

---

## Data Format Reference

### Event Date Format
```
"MAR 15"  // Use 3-letter month abbreviation + day
"JAN 01", "DEC 31", "SEP 20", etc.
```

### Student ID (Optional)
```
"2024001"       // Student ID number
"123456"        // Any unique identifier
Optional field - can be left empty
```

### Links & URLs
```
"https://example.com/image.jpg"
"https://instagram.com/username"
"https://portfolio.example.com"
```

---

## Color Guide

### Event Status
- 🟢 **Open** (Green) - Accepting new registrations
- 🔴 **Locked** (Red) - Closed for new registrations

### Community Status
- 🟡 **Pending** (Yellow/Orange) - Awaiting your decision
- 🟢 **Approved** (Green) - Accepted as member
- 🔴 **Rejected** (Red) - Application declined

---

## Common Workflows

### Workflow 1: Create & Manage an Event

1. Go to Events page
2. Click "New Event"
3. Fill in details (keep status as "Open")
4. Save event
5. Promote event through other channels
6. Monitor registrations in Registrations page
7. When registration deadline passes, toggle status to "Locked"
8. Export CSV for attendee list
9. Use list for communications or venue planning

### Workflow 2: Process Community Applications

1. Go to Community page
2. Filter for "Pending" applications
3. Review each applicant's details
4. Click "Approve" for qualified candidates
5. Click "Reject" for not-qualified candidates
6. View statistics of approved vs rejected

### Workflow 3: Event Analytics

1. Create events for different programs
2. Promote and collect registrations
3. Go to Registrations page
4. Filter by specific event
5. Export CSV
6. Analyze attendance and demographics

---

## Frequently Asked Questions

**Q: Can I edit an event after creating it?**
A: Yes! Click the edit icon (✏️) to modify any event details.

**Q: How do I prevent new registrations for an event?**
A: Click the event status toggle to change from "Open" to "Locked". This prevents new registrations without deleting the event.

**Q: Can I see who registered for a specific event?**
A: Yes! Go to Registrations page and use the event dropdown filter to see registrations for that specific event.

**Q: How do I backup registration data?**
A: Use the "Export CSV" button to download registration data. Keep these CSV files as backups.

**Q: Can I undo changes?**
A: The current system doesn't have an undo feature. Be careful with deletions - they are permanent.

**Q: Can I approve/reject multiple applications at once?**
A: Currently, you must approve/reject one at a time. Bulk operations can be added in future versions.

**Q: Where is application data stored?**
A: Data is stored in your browser's localStorage. It persists across sessions but is specific to this domain.

---

## Before You Deploy to Production

### Security Checklist
- [ ] Set up proper authentication for admin access
- [ ] Restrict admin routes to authorized users only
- [ ] Use a real database instead of localStorage
- [ ] Enable HTTPS/SSL
- [ ] Add activity logging for audit trail
- [ ] Set up regular database backups

### Preparation Checklist
- [ ] Test all event creation and editing workflows
- [ ] Test CSV export functionality
- [ ] Test community application approval/rejection
- [ ] Get familiar with all dashboard statistics
- [ ] Create first set of test events
- [ ] Document any custom procedures

---

## Performance Tips

1. **Regular CSV Exports**: Export data regularly to backup
2. **Archive Events**: Delete old/completed events to keep dashboard fast
3. **Clean Old Registrations**: Remove registrations from past events periodically
4. **Browser Cache**: Clear browser cache if experiencing slowdown

---

## Technical Details

### Default Local Storage Collections
```
nexus_events                  // All events
nexus_registrations           // All registrations
nexus_community_applications  // All community apps
```

### File Locations
- Admin Layout: `components/admin/AdminLayout.tsx`
- Dashboard: `pages/admin/Dashboard.tsx`
- Events: `pages/admin/EventManagement.tsx`
- Registrations: `pages/admin/RegistrationManagement.tsx`
- Community: `pages/admin/CommunityManagement.tsx`
- Utils: `lib/adminUtils.ts`

---

## Troubleshooting

**Issue: Dashboard shows no data**
- Check browser console for errors (F12)
- Ensure localStorage is enabled
- Try clearing cache and reloading

**Issue: Can't save event**
- Ensure required fields are filled (Title, Date, Location)
- Check browser console for error messages

**Issue: Export CSV not working**
- Check browser's download folder
- Check browser permissions for downloads
- Try a different browser if issue persists

---

## Next Steps

1. ✅ Access the admin panel at `/admin`
2. ✅ Create your first event
3. ✅ Test the registration workflow
4. ✅ Review community application process
5. ✅ Customize as needed for your use case

---

## Support & Customization

The admin dashboard is built with React, TypeScript, and Tailwind CSS. It can be easily extended with:
- Additional fields or validations
- Email notifications
- Analytics and charts
- User authentication
- Bulk operations
- And more!

For questions or customizations, refer to the code comments and ADMIN_DASHBOARD.md documentation.

Happy managing! 🎉
