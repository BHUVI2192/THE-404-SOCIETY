# Admin Dashboard Documentation

## Overview

The Admin Dashboard is a comprehensive management system for **The 404 Society** platform. It allows administrators to manage events, view registrations, and handle community applications.

## Features

### 1. Dashboard
- **Overview Statistics**: Display key metrics including total events, active events, registrations, and community applications
- **Recent Activity Feed**: Shows the latest events, registrations, and community applications
- **Quick Stats**: Color-coded cards for easy visualization of platform health

### 2. Event Management
- **Create Events**: Add new events with title, date, location, category, and description
- **Edit Events**: Modify existing event details
- **Delete Events**: Remove events from the system
- **Status Control**: Toggle event status between "Open" (accepting registrations) and "Locked" (closed)
- **Event Details**: Store images, descriptions, year, and categorization

### 3. Registration Management
- **View All Registrations**: See all event registrations in a comprehensive table
- **Search & Filter**: Filter registrations by:
  - Name, email, or student ID (search)
  - Event name (dropdown filter)
- **Export to CSV**: Download registration data for external analysis
- **Delete Registrations**: Remove individual registration records
- **Statistics**: Display total registrations, filtered count, and number of unique events

### 4. Community Management
- **Application Review**: View all community membership applications
- **Status Management**: 
  - Pending: Applications awaiting review
  - Approved: Accepted members
  - Rejected: Declined applications
- **Approve/Reject**: Quick action buttons for pending applications
- **Detailed View**: See applicant information including name, email, college, year, interests, and social links
- **Filter & Search**: Find applications by name, email, or college
- **Statistics**: Dashboard showing total, pending, approved, and rejected counts

## File Structure

```
components/admin/
├── AdminLayout.tsx           # Main admin layout with sidebar navigation

pages/admin/
├── Dashboard.tsx             # Admin dashboard with statistics
├── EventManagement.tsx       # Event CRUD operations
├── RegistrationManagement.tsx # Registration viewing and management
└── CommunityManagement.tsx   # Community application management

lib/
├── events.ts                 # Event data operations
├── registrations.ts          # Registration data operations
├── community_apps.ts         # Community application data operations
├── firebase.ts               # Database/storage operations
└── adminUtils.ts             # Admin utility functions
```

## Access

The admin dashboard is accessible at:
```
http://localhost:5173/#/admin
```

### Routes

- **Dashboard**: `/admin`
- **Events**: `/admin/events`
- **Registrations**: `/admin/registrations`
- **Community**: `/admin/community`

## Data Models

### Event Data
```typescript
{
  id: string;
  title: string;
  date: string;                // Format: "MAR 15"
  year: string;                // Format: "2026"
  location: string;
  img: string;                 // Image URL
  status: "open" | "locked";
  category?: string;
  description?: string;
  createdAt?: number;          // Timestamp
}
```

### Registration Data
```typescript
{
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  studentId?: string;
  createdAt?: number;          // Timestamp
}
```

### Community Application Data
```typescript
{
  id: string;
  name: string;
  email: string;
  contact: string;
  college: string;
  year: string;
  interest?: string;
  social?: string;             // URL
  status: "pending" | "approved" | "rejected";
  createdAt?: number;          // Timestamp
}
```

## UI Components

### AdminLayout
- Collapsible sidebar with navigation
- Dark theme (Tailwind CSS)
- Responsive design for mobile and desktop
- Quick exit button to return to main site

### Dashboard Cards
- Color-coded stat cards
- Recent activity timeline
- At-a-glance platform health metrics

### Event Management Table
- Sortable columns
- Inline status toggle
- Edit/Delete actions
- Modal form for creating/editing

### Registration Table
- Searchable and filterable
- CSV export functionality
- Delete individual records
- Date formatting

### Community Cards
- Grid layout for applications
- Status badges with color coding
- Quick approve/reject buttons
- Detailed applicant information

## Usage Guide

### Creating an Event
1. Navigate to `/admin/events`
2. Click "New Event" button
3. Fill in event details in the modal form
4. Click "Save Event"

### Managing Event Registrations
1. Navigate to `/admin/registrations`
2. Use search box to find specific registrations
3. Use event dropdown to filter by event
4. Click "Export CSV" to download data
5. Delete individual records as needed

### Processing Community Applications
1. Navigate to `/admin/community`
2. Filter by status (Pending, Approved, Rejected)
3. Search for specific applicants
4. Review application details
5. Click "Approve" or "Reject" for pending applications
6. Delete applications as needed

## Styling

- **Color Scheme**: Dark theme with cyan accents
- **Icons**: Lucide React icons
- **Framework**: Tailwind CSS
- **Animations**: Smooth transitions and hover effects

### Status Badge Colors
- **Open/Approved**: Green (`#10b981`)
- **Locked/Rejected**: Red (`#ef4444`)
- **Pending**: Yellow/Orange (`#f59e0b`)

## Data Persistence

The admin system uses local storage (via `firebase.ts`) to persist data. All CRUD operations automatically:
- Fetch current data
- Apply changes
- Save back to localStorage
- Trigger the UI update

## Error Handling

All operations include:
- Try-catch blocks for error handling
- Toast notifications for user feedback
- Loading states during async operations
- Confirmation dialogs for destructive actions

## Utility Functions

The `lib/adminUtils.ts` file provides helper functions:
- `formatDate()` - Format timestamps to readable dates
- `formatDateTime()` - Format timestamps with time
- `getStatusColor()` - Get color classes for status badges
- `exportToCSV()` - Export data to CSV format
- `isValidEmail()` - Validate email addresses
- `isValidUrl()` - Validate URLs
- `getInitials()` - Generate initials from names
- `debounce()` - Debounce function calls

## Performance Considerations

- Registrations and applications are sorted by creation date (newest first)
- Filtering happens on the client side for instant feedback
- Large datasets can be exported for external analysis
- No pagination implemented (can be added for very large datasets)

## Future Enhancements

Potential additions to consider:
1. **Analytics Dashboard**: Charts showing registration trends over time
2. **Email Notifications**: Send emails to approved/rejected community applicants
3. **Batch Operations**: Select multiple registrations for bulk actions
4. **Event Analytics**: View registration numbers per event
5. **User Management**: Add/remove admin accounts
6. **Activity Logs**: Track all admin actions
7. **Pagination**: Handle large datasets efficiently
8. **Dark Mode Toggle**: Already supports dark theme
9. **Attendance Tracking**: Track who attended events
10. **Email Templates**: Customize notification emails

## Support

For issues or questions about the admin dashboard, refer to:
- Check console for error messages
- Verify localStorage is not full
- Ensure all required fields are filled when creating/editing
- Check browser compatibility (modern browsers recommended)
