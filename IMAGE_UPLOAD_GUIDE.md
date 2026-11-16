# 📸 Image Upload Implementation Guide

## Overview
You now have a complete image upload system for the 404 Society admin dashboard. Images are stored as Base64 in `localStorage` and persist across the entire website.

---

## ✨ What's New

### 1. **Image Upload Utility** (`lib/imageUpload.ts`)
- Converts image files to Base64 strings
- Validates file types (JPG, PNG, WebP, GIF)
- Enforces 5MB file size limit
- Provides helpful error messages

### 2. **Admin Pages with Image Upload**

#### **Blog Management** (`pages/admin/BlogManagement.tsx`)
- File input to upload blog featured images
- Real-time image preview (80x80px)
- Synced with public Blog page (`/blog`)
- Images stored in `localStorage` key: `nexus_blog_posts`

#### **Event Management** (`pages/admin/EventManagement.tsx`)
- File input to upload event banner images
- Real-time image preview (80x80px)
- Synced with public Events page (`/events`)
- Images stored in `localStorage` key: `nexus_events`

---

## 🔄 Data Sync Flow

### Admin → Public Website

```
Admin Dashboard (BlogManagement.tsx)
    ↓
Upload Image → Convert to Base64 → formData.image
    ↓
Click "Create" → addBlogPost(formData)
    ↓
Update localStorage['nexus_blog_posts'] via db.set()
    ↓
Public Blog Page (Blog.tsx)
    ↓
Call getBlogPosts() → db.get('nexus_blog_posts')
    ↓
Display images with <img src={article.image} />
```

**Key Point:** Admin and public pages use the **same data collections**:
- Blog: Both use `lib/blog.ts` → `nexus_blog_posts` collection
- Events: Both use `lib/events.ts` → `nexus_events` collection
- Data is instantly synchronized! No delay between admin change and website display.

---

## 📋 How to Use

### **Create a Blog Post with Image**

1. **Go to Dashboard** → Admin → Blogs Management
2. **Click "Add Blog"** button
3. **Fill in the form:**
   - Title: "My Awesome Blog" ✓
   - Category: "TECH" ✓
   - Date: "FEB 20, 2026" (optional)
   - Featured Image: **Click to upload an image file** 🖼️
   - Excerpt: "Brief summary..." (optional)
   - Content: "Full blog content..." ✓

4. **See Image Preview:** When you select an image, a 80×80 preview appears
5. **Click "Create"** → Image is converted to Base64 and saved in localStorage
6. **Check your website:** Go to `/blog` → Your new blog with image appears instantly!

### **Create an Event with Image**

1. **Go to Dashboard** → Admin → Events Management
2. **Click "Add Event"** button
3. **Fill in the form:**
   - Title: "Web Dev Hackathon" ✓
   - Location: "PESITM Lab 4" ✓
   - Category: "Hackathon" (optional)
   - Event Image: **Click to upload an image file** 🖼️
   - Description: "Join us for..." ✓

4. **See Image Preview:** When you select an image, a 80×80 preview appears
5. **Click "Save Event"** → Image is converted to Base64 and saved in localStorage
6. **Check your website:** Go to `/events` → Your new event appears instantly!

---

## 🖼️ Image Storage Details

### **Storage Method: Base64 in localStorage**

**What is Base64?**
- A text-based encoding format for binary files (like images)
- Can be stored directly in `localStorage` (which only accepts strings)
- Can be used directly in `<img>` tags via `data:` URLs

**Example:**
```javascript
// Original image file: photo.jpg (100KB)
// After Base64 encoding: ~130KB text string
// Stored in localStorage as: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
// Used in HTML: <img src="data:image/jpeg;base64,/9j/4AAQSkZJRg..." />
```

### **Storage Limits**

| Item | Size |
|------|------|
| Single image typical | 50-200 KB (Base64) |
| Max per image | ~5MB (enforced) |
| Total localStorage | ~5-10 MB limit |
| Recommended usage | 3-5 blog images + 3-5 event images |

**Current Usage:**
- Check browser console: `console.log(localStorage)`
- Estimate total size of all data stored

### **File Type Support**
✅ JPG / JPEG
✅ PNG  
✅ WebP
✅ GIF
❌ SVG, PDF, WebM (not supported)

---

## 🔍 Testing Image Persistence

### **Verify Images Save to localStorage**

1. **Open Browser DevTools** (F12)
2. **Go to Application → Storage → Local Storage**
3. **Look for:**
   - `nexus_blog_posts` - Contains all blogs with images
   - `nexus_events` - Contains all events with images

4. **Example Data Structure:**
```json
{
  "id": "123456",
  "title": "My First Post",
  "category": "TECH",
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "content": "...",
  "excerpt": "...",
  "date": "FEB 20, 2026",
  "createdAt": 1740063200000,
  "colSpan": 1,
  "rowSpan": 1
}
```

### **Check Image Display on Public Website**

1. **Create blog/event with image in admin**
2. **Go to `/blog` or `/events`** page
3. **You should see your new post with the image displayed**
4. **Refresh the page** → Image still there ✓ (Persisted in localStorage)

### **Test on Different Browser Tabs**

1. **Tab A:** Go to admin dashboard, create a blog with image
2. **Tab B:** Go to `/blog` page, refresh
3. **Your new blog appears instantly** (without restarting the app)

---

## 📝 Admin Form Fields

### **Blog Management**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | ✓ | Blog post title |
| Category | Text | ✓ | e.g., "TECH", "TUTORIAL" |
| Date | Text | ✗ | e.g., "FEB 20, 2026" |
| Featured Image | File | ✗ | Upload JPG/PNG/WebP/GIF |
| Excerpt | Textarea | ✗ | Brief summary (optional) |
| Content | Textarea | ✓ | Full blog content |

### **Event Management**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | ✓ | Event name |
| Location | Text | ✓ | Event location |
| Date | Text | ✗ | e.g., "MAR 15" |
| Year | Text | ✗ | e.g., "2026" |
| Category | Text | ✗ | e.g., "Hackathon", "Workshop" |
| Status | Select | ✓ | Open or Locked |
| Event Image | File | ✗ | Upload JPG/PNG/WebP/GIF |
| Description | Textarea | ✓ | Event details |

---

## 🚀 Advanced: Future Enhancements

### **Cloud Storage (Firebase/AWS)**
When you're ready to scale beyond localStorage:

1. **Firebase Storage:**
   - 5GB free tier
   - Automatic CDN delivery
   - Faster image loading
   - Integrates with existing Firebase setup

2. **Implementation Needed:**
   - Replace Base64 with file uploads to Cloud Storage
   - Store image URLs in localStorage instead of full Base64
   - Update `lib/imageUpload.ts` to call Firebase

### **Image Compression**
- Automatically compress images before storage
- Reduce Base64 string size by 30-50%
- Improve localStorage utilization

### **Image Cropping**
- Let admins crop/resize images before upload
- Ensure consistent image dimensions across site

---

## ⚠️ Known Limitations

### **localStorage Constraints**
1. **Size Limit:** ~5-10MB total (browser dependent)
   - With Base64 encoding, images take 33% more space
   - 5 images × 200KB = ~1.3MB

2. **Only Works in Browser**
   - Data doesn't sync across devices
   - Each browser/device has separate localStorage
   - Images lost if user clears browser data

3. **No Server Backup**
   - Data only exists in browser storage
   - No automatic backup system

### **Browser Compatibility**
- localStorage supported in all modern browsers
- Data persists across tabs and sessions
- Cleared by "Clear Browser Data" action

**Solution:** For production, migrate to Firebase Storage or similar cloud solution.

---

## 🛠️ Troubleshooting

### **Image Not Showing in Admin Preview?**
- File size might exceed 5MB
- File type might not be supported (check console for error)
- Try a different image format (JPG/PNG instead of GIF)

### **Image Not Displaying on Public Website?**
- Check DevTools → Application → localStorage → check `nexus_blog_posts` or `nexus_events`
- Refresh browser (Ctrl+R)
- Check browser console for JavaScript errors

### **Images Disappeared After Resetting Browser?**
- Browser was cleared of cache/cookies/storage data
- Use "Clear browsing data" option and select "Cookies and other site data"
- localStorage is cleared with this action

### **File Upload Button Not Working?**
- Check browser console for errors
- Try a different image file (ensure it's actually an image)
- Check file permissions on your computer

---

## 📚 Code Examples

### **Using Images in Your Components**

```tsx
import { BlogPostData } from '../lib/blog';

// Display blog image
export const BlogCard: React.FC<{ blog: BlogPostData }> = ({ blog }) => {
  return (
    <div className="blog-card">
      {/* Image displays with Base64 URL */}
      <img 
        src={blog.image}  // e.g., "data:image/png;base64,..."
        alt={blog.title}
        style={{ width: '100%', height: 'auto' }}
      />
      <h2>{blog.title}</h2>
    </div>
  );
};
```

### **Programmatically Adding Images**

```tsx
import { addBlogPost, BlogPostData } from '../lib/blog';
import { processImageFile } from '../lib/imageUpload';

const file = e.target.files[0];
const result = await processImageFile(file);

const newBlog: BlogPostData = {
  title: 'My Post',
  category: 'TECH',
  image: result.base64,  // Base64 string
  content: 'Content...',
  excerpt: 'Summary...',
  date: 'FEB 20, 2026',
};

await addBlogPost(newBlog);
```

---

## ✅ Checklist: Verify Everything Works

- [ ] Create blog post with image via admin
- [ ] See image preview in admin form (80x80 thumbnail)
- [ ] Click "Create" and see success toast message
- [ ] Go to `/blog` and see new blog with image
- [ ] Refresh browser → Image still there
- [ ] Check localStorage in DevTools → `nexus_blog_posts` contains image data
- [ ] Create event with image via admin
- [ ] Go to `/events` and see new event
- [ ] Edit existing blog/event and update image
- [ ] Delete blog/event → No longer appears on website
- [ ] Test on different browser tab → Data synced instantly

---

## 📞 Support

If images aren't working:
1. Check browser console (F12 → Console tab) for error messages
2. Verify image file is JPG/PNG/WebP (not a different format)
3. Ensure image file size < 5MB
4. Clear browser storage and try again
5. Check localStorage in DevTools to verify data is being saved

---

**Last Updated:** February 25, 2026
**Version:** 1.0 - Base64 localStorage implementation
