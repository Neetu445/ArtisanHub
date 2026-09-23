# ArtisanHub – Artisan Marketplace & Business Management Platform

> One platform where India's artisans sell their craft **and** run their business — products, inventory, orders, custom-design requests, customer chat and analytics — with an AI assistant that turns a photo into a bilingual product listing.

**Stack:** React + Tailwind CSS · Supabase (PostgreSQL, Auth, Storage, Realtime) · Google Gemini API · Vercel

## Quick start (evaluators)
```bash
npm install
npm run dev          # opens http://localhost:5173
```
With the included `.env` the app connects to the live Supabase backend. Without keys it runs in demo mode (localStorage) — same UI.

**Demo accounts (password `demo123`)**
`rahul@artisan.com` (artisan – potter) · `saira@artisan.com` (artisan – weaver) · `priya@customer.com` · `arjun@customer.com`

## Documentation
| File | Contents |
|---|---|
| `docs/PROJECT_DESCRIPTION.md` | Problem, solution, innovation, tech stack, architecture, impact, feasibility |
| `docs/SETUP_GUIDE.md` | Full setup, database, seeding, deployment, 3-minute demo script |
| `docs/FEATURES.md` | Feature list with status |
| `docs/ArtisanHub_Pitch_Deck.pptx` | Presentation deck |
| `supabase/schema.sql` | Database schema, trigger, RLS, storage bucket |
| `supabase/seed.mjs` | Demo data seeder |

## Project structure
```
src/
  pages/            customer pages (Discover, Artisans, Product, CustomRequest, Orders, Messages, Login)
  pages/dashboard/  artisan pages (Dashboard, Products, Orders, Profile)
  components/       Layout, Chat, shared UI
  lib/store.jsx     data layer – Supabase live mode / localStorage demo mode
  lib/supabase.js   client, mappers, image upload
  lib/gemini.js     AI listing generation
  data/seed.js      demo dataset (8 artisans across India, 17 products, orders)
public/img/         product & artisan imagery
supabase/           schema.sql, seed.mjs, update_images.mjs
docs/               documentation & pitch deck
```

## Key features
Role-based auth · storefronts · product & inventory management with low-stock alerts · search & discovery · order pipeline · **custom-order workflow with reference image → quote → approval** · per-order realtime chat · sales analytics · **Gemini photo → Hindi/English listing** · Hindi/English toggle · responsive.

## Licence
Prototype built for hackathon evaluation. Demo product and artisan imagery in `public/img/` is representative craft photography sourced from the web for demonstration purposes only; in production artisans upload their own photos via the platform.
