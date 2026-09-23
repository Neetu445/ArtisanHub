# ArtisanHub – Setup & Deployment Guide

## Prerequisites
- Node.js 20+ (22+ recommended)
- A free Supabase project (https://supabase.com)
- A free Gemini API key (https://aistudio.google.com)

## 1. Install
```bash
npm install
```

## 2. Environment variables
Copy `.env.example` to `.env` and fill in:
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon / publishable key>
VITE_GEMINI_API_KEY=<gemini key>
```
If `VITE_SUPABASE_ANON_KEY` is left empty the app runs in **demo mode** (localStorage, seeded data) — useful for quick evaluation without any setup.

## 3. Database
Supabase Dashboard → SQL Editor → paste `supabase/schema.sql` → Run.
Creates tables, signup trigger, stock RPC, RLS policies, realtime publication and the `images` storage bucket.

## 4. Auth settings (demo convenience)
Authentication → Providers → Email → turn **Confirm email** OFF.

## 5. Seed demo data
```bash
# Windows cmd
set SUPABASE_SERVICE_KEY=<service_role key>
node supabase/seed.mjs
# Node < 22: add --experimental-websocket
```
Creates 4 demo users, 8 artisans across India, 17 products, 10 orders (incl. custom), chat history.

## 6. Run
```bash
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## 7. Deploy (Vercel)
1. Push to GitHub
2. Vercel → New Project → Import → Framework: Vite
3. Add the three `VITE_*` env vars → Deploy
`vercel.json` already handles SPA routing.

## Demo accounts (password: demo123)
| Email | Role |
|---|---|
| rahul@artisan.com | Artisan – potter, Varanasi |
| saira@artisan.com | Artisan – Banarasi weaver |
| priya@customer.com | Customer – Bengaluru |
| arjun@customer.com | Customer – Delhi |

## Suggested demo flow (3 minutes)
1. **Customer (Priya):** Discover → search "madhubani" → open product → view artisan story → **Custom Order** → pick artisan → describe + upload reference → send
2. **Artisan (Rahul):** Dashboard → Orders → *Quote requests* → open → **Send quote**
3. **Customer:** My Orders → quote appears live → **Approve**
4. **Artisan:** mark In Progress → Shipped; chat inside the order
5. **Artisan:** Products → Add product → upload photo → **Generate listing with AI** → Hindi + English filled in → Save
6. **Artisan:** Dashboard shows updated revenue, low-stock alert, top products
7. Toggle **हिंदी** in the header to show bilingual descriptions
