# HETU AI — Landing Page & Causal Intelligence Debugger Integration

## 1. Project Overview
- **Live URL**: `https://www.the404society.in/hetu.ai` (also accessible via `/hetu`, `/hetu-ai`, and `/404-ai`)
- **Repository**: `https://github.com/BHUVI2192/THE-404-SOCIETY.git`
- **Primary Stack**: React 19, TypeScript, Vite, React Router v7, Supabase JS v2, Lucide React, TailwindCSS.

---

## 2. Branding & Visual Design System
- **Brand Name**: **`HETU`** (rendered in solid bold black font `#000000`, `letter-spacing: -0.05em`).
- **Canvas Background**: Lavender `#f5f5ff` / `#f4f4fa`.
- **Primary Accent**: Violet `#5b5fc7` / `#6e4aff`.
- **Typography System**:
  - **Headings & Titles**: `DM Sans` / `DM Mono` (`Font-weight: 700 / 500`, `letter-spacing: -0.05em`).
  - **Tags, Eyebrows & Action Buttons**: `JetBrains Mono` (`Font-weight: 700`, uppercase, `letter-spacing: 0.15em - 0.22em`).
  - **Code & Textarea**: `JetBrains Mono` / `Space Mono` (`12px`, `#1a1a2e` text on off-white `#f4f4f9` container background).

---

## 3. Page Structure & Features

### Landing Page (`ReferenceLanding.tsx`)
1. **Header Navigation**:
   - `HETU` logo in bold black font.
   - Nav links: `Product`, `How it works`, `Replay`.
   - `Start using HETU ↗` button.
2. **Hero Section**:
   - `• DEBUGGER FOR MULTI-AGENT SYSTEMS` eyebrow.
   - Title: **`Find the decisive step.`**
   - Subtitle: `See what broke. Replay the fix.`
   - Index tag: `HETU / 01   FIND THE CAUSE. FIX THE BRANCH.`
3. **`WHAT CHANGES` Section**:
   - 3 metric cards: `3 framework starting points`, `1 decisive error step`, `4 moves from failure to fix`.
4. **`THE DIAGNOSIS` Section**:
   - `A failed run is not the diagnosis.` text & interactive trace card visualizer.
5. **`PASTE TRACE` & `SELECT A TRACE` Intake Section**:
   - `• PASTE TRACE`: Textarea box supporting raw JSON traces + `START ANALYSIS ↗` violet action button.
   - `• SELECT A TRACE`: 3 interactive sample cards:
     - `TRACE / SEMANTIC` — **Cascading Semantic Failure**
     - `TRACE / LOOP` — **Infinite Review Loop**
     - `TRACE / MEMORY` — **Memory Poisoning**
6. **`HOW IT WORKS` Section**: 4 step workflow cards (`01 Ingest`, `02 Causal Graph`, `03 Traverse`, `04 Replay`).
7. **`DETERMINISTIC CONTROL` Section**: Interactive branch replay visualization.
8. **`EVIDENCE FIRST` Section**: Trace summary panel & execution metrics.
9. **Footer**: `HETU` logo, navigation links, and `© 2026 HETU`.

### Debugger View (`Home.tsx`)
- Triggered automatically upon trace submission or clicking a sample trace card.
- Displays full Multi-Agent Cognitive Execution Graph (`GraphCanvas`), root cause analysis (DES identification), evidence score, propagation flow, decision recommendations, and markdown report generator.

---

## 4. Key Configuration & Technical Fixes

### A. Routing Configuration (`App.tsx` & `vercel.json`)
- Routes added to `App.tsx`:
  - `<Route path="/hetu.ai" element={<HetuApp />} />`
  - `<Route path="/hetu" element={<HetuApp />} />`
  - `<Route path="/hetu-ai" element={<HetuApp />} />`
  - `<Route path="/404-ai" element={<HetuApp />} />`
- Rewrites in `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "/api/$1" },
      { "source": "/((?!api/).*)", "destination": "/index.html" }
    ]
  }
  ```

### B. Supabase Auth Lock Fix (`lib/supabase.ts`)
- **Problem**: Default Supabase client attempted `navigator.locks` acquisition, throwing `Uncaught (in promise) Error: Acquiring an exclusive Navigator LockManager lock immediately failed` and halting React initialization.
- **Resolution**:
  ```ts
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      lock: false,
    }
  })
  ```

### C. CSS Bundling (`index.tsx` & `Home.tsx`)
- Imported `./404ai/frontend/src/app/globals.css` into `index.tsx` and `Home.tsx` to ensure all Hetu landing page styles are bundled into Vite's production CSS output.
- Preloaded Google Fonts (`DM Sans`, `DM Mono`, `JetBrains Mono`, `Newsreader`, `Inter`) in `index.html`.

---

## 5. Git Commit Log
- Commit `283b2b2`: `feat: Add HETU landing page and trace debugger integration at /hetu.ai`
- Commit `8eca0e9`: `fix: bundle Hetu CSS styles in main app build for /hetu.ai`
- Commit `3e05e33`: `fix: resolve Supabase auth lock error and Pixelify font override on Hetu landing page`
