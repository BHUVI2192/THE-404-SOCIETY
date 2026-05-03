# 404 AI — Premium Onboarding Experience

This onboarding portal has been engineered as a **premium, single-page application** seamlessly integrated into your existing application stack (`the-404-society`). 

By integrating it as a new route (`/404-ai` and `/apply`) within the existing platform, you maintain a unified codebase while delivering a completely custom, full-screen, high-fidelity experience without interfering with the rest of your community platform.

---

## 📁 1. Project Structure

The portal is self-contained and modular. Below is the file mapping within your existing stack:

```text
the-404-society/
├── pages/
│   └── AIOnboarding.tsx         # The complete UI, Form, and Framer Motion logic
├── api/
│   └── submit-404-application.js # Serverless endpoint handling Nodemailer
├── App.tsx                      # Updated with new `/404-ai` & `/apply` routes
└── .env.local                   # Contains the SMTP Email App Passwords
```

---

## 🎨 2. Tailwind Setup & Design System

The application uses TailwindCSS combined with Framer Motion for cinematic animations. 

**Design Tokens Implemented:**
- **Primary Accent:** Deep Orange (`#ff6b00`)
- **Background:** Deep Black (`#0a0a0a`) with custom SVG noise/grain texture injection.
- **Typography:** Uses a mixture of bold structural sans-serif and italic serif combinations to create an editorial, intelligent aesthetic.
- **Focus States:** Magnetic button hints, glowing form fields, and dynamic checkbox borders.

Since the project already had Tailwind configured (`tailwind.config.js` and `index.css`), the onboarding page utilizes strictly custom-defined inline palette utility classes (e.g., `text-[#ff6b00]`, `bg-[#0a0a0a]`) so it avoids polluting your global `index.css`.

---

## 📨 3. Email Integration

We built a dedicated serverless function (`api/submit-404-application.js`) to handle submissions.

1. **User submits the form** via frontend (`fetch('/api/submit-404-application', ...)`).
2. **Admin Notification:** `submit-404-application.js` sends a beautifully formatted HTML email containing all the user's answers straight to the Founder's email.
3. **User Auto-Reply:** It immediately sends an elegant, founder-styled thank-you email back to the applicant.

---

## ⚙️ 4. SMTP Setup Instructions

You are using Google SMTP (`nodemailer`) via an App Password. This is currently set up correctly in your `.env.local` using `the404society01@gmail.com`.

If you ever need to reset or change the sending email address to a new `@404ai.com` or `@gmail.com` account:

1. Go to your **Google Account Settings**.
2. Navigate to **Security** > **2-Step Verification**.
3. Scroll down to **App Passwords**.
4. Create a new App Password (select "Mail" and "Other (Custom name)" -> e.g., "404 AI Portal").
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`).

---

## 🔐 5. Environment Variable Setup

In your `.env.local` (for local development) and in **Vercel Settings** (for production), ensure these variables are present:

```env
# Google SMTP Credentials (Server-side only)
EMAIL_USER=the404society01@gmail.com
EMAIL_PASS="gmbu fnlc wcjt qnsa"
```
*(Your current `.env.local` is already configured perfectly with these credentials).*

---

## 🚀 6. Vercel Deployment Instructions

Since this is built into your existing Vite + Vercel setup, deploying is frictionless:

1. Commit all the new changes:
   ```bash
   git add .
   git commit -m "feat: complete 404 AI premium onboarding portal"
   ```
2. Push to your main branch:
   ```bash
   git push origin main
   ```
3. Vercel will automatically build the UI and deploy the new `/api/submit-404-application` Serverless Function. 
4. **Important**: Go to your Vercel Dashboard -> Settings -> **Environment Variables**. Make sure you add `EMAIL_USER` and `EMAIL_PASS` exactly as they appear in your `.env.local` file so the production API route can send emails.

---

## 🧪 How to Test Locally

1. Start your dev server:
   ```bash
   pnpm dev
   ```
2. Open `http://localhost:5173/404-ai` (or whichever port Vite gives you) in your browser.
3. Fill out the application and submit it.
4. Check your email inbox (`the404society01@gmail.com`) for the admin summary.
5. Check the applicant's email inbox for the welcome receipt!

Enjoy the launch!
