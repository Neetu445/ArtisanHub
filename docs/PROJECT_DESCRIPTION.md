# ArtisanHub – Artisan Marketplace & Business Management Platform

**Domains:** Web & Mobile Applications · Agriculture & Rural Innovation · Social Impact · Generative AI

## 1. Problem Statement

Small artisans and handmade-product sellers across India — potters in Varanasi, weavers in Kutch, toy-makers in Channapatna, Madhubani painters in Bihar — run their businesses through fragmented channels: WhatsApp chats, Instagram DMs, phone calls and paper notebooks.

This causes:
- **Lost orders and miscommunication** – custom requests, delivery dates and payments scattered across chats
- **No inventory visibility** – overselling or idle stock
- **Weak customer relationships** – no order history, no follow-up, no repeat business
- **Low discoverability** – artisans depend on word of mouth; customers seeking authentic handmade or custom products cannot find them
- **No business insight** – artisans cannot tell which products, seasons or customers drive their income

The result is reduced sales, little recognition of the craft, and restricted growth.

## 2. Solution

ArtisanHub is a single web platform that combines a **marketplace** (for customers) with a **business back-office** (for artisans). A customer chat, the order, the stock deduction and the sales report become one connected flow.

| For Artisans | For Customers |
|---|---|
| Product & inventory management with low-stock alerts | Search & discover by craft, material, region, price |
| Digital storefront with story, process photos, ratings | Verified artisan profiles – know who made it |
| Order pipeline: Received → In Progress → Shipped → Delivered | Live order tracking |
| **Custom-order quotations** with reference images | **Request custom pieces** by uploading a reference image |
| Per-order messaging with customers | Direct chat with the maker |
| Sales dashboard: revenue trends, top products, repeat customers | Order history |
| **AI listing generator** – photo → bilingual product listing | Hindi / English product descriptions |

## 3. Key Innovation

1. **Marketplace + back-office in one.** Etsy / Amazon Karigar sell *for* the artisan; WhatsApp and Instagram leave management *to* them. ArtisanHub does both in one connected data flow — no double entry.
2. **Structured custom-order workflow.** Discover → Request → Upload Reference → Receive Quote → Approve → Production → Delivery. Replaces the chaotic WhatsApp back-and-forth that no existing marketplace handles.
3. **AI-assisted, photo-first listing.** Gemini generates title, category, material, tags, suggested price and descriptions in **Hindi and English** from a single photo — removing the biggest barrier for low-digital-literacy artisans.
4. **Craft storytelling.** Artisan profiles put the maker and the process front and centre, turning products into recognised art that commands better prices.

## 4. Technology Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS + React Router | Fast, responsive, works on entry-level smartphones |
| Backend & Database | Supabase – PostgreSQL, Row Level Security | No custom server; SQL schema with triggers and RPC |
| Authentication | Supabase Auth (email/password, role-based: artisan / customer) | Signup trigger auto-creates profile & storefront |
| File Storage | Supabase Storage (public `images` bucket) | Product photos, reference images, avatars |
| Realtime | Supabase Realtime (Postgres changes) | Orders, quotes and messages update live across devices |
| AI | Google Gemini API (`gemini-3-flash` with fallbacks) | Image → bilingual listing JSON |
| Charts | Recharts | Artisan analytics dashboard |
| Deployment | Vercel (frontend) + Supabase cloud | Free tier, zero infrastructure cost |
| Payments | Out of scope for prototype (Cash on Delivery / UPI QR) | Razorpay planned for phase 2 |

## 5. Architecture

```
┌─────────────────────────────────────────────────────┐
│  React + Tailwind SPA (Vercel)                      │
│  Customer views  │  Artisan dashboard  │  Auth       │
└────────┬─────────────────┬──────────────────┬───────┘
         │ supabase-js     │                  │ fetch
┌────────▼─────────────────▼────────┐  ┌──────▼───────┐
│  Supabase                         │  │ Gemini API   │
│  • Auth (JWT, roles)              │  │ image →      │
│  • PostgreSQL (5 tables, RLS)     │  │ bilingual    │
│  • Storage (images bucket)        │  │ listing JSON │
│  • Realtime (postgres_changes)    │  └──────────────┘
└───────────────────────────────────┘
```

**Data model:** `profiles` (role) · `artisans` (storefront) · `products` (inventory) · `orders` (regular + custom, status, quote JSON) · `messages` (per-order thread).

## 6. Real-World Impact

- **Economic:** wider reach and repeat customers, fewer lost orders, better pricing for custom work
- **Operational:** manual bookkeeping replaced by automatic order, stock and revenue tracking — artisans spend time creating instead of administrating
- **Social & Cultural:** traditional crafts gain visibility beyond their locality, preserving skills by making them viable livelihoods
- **Inclusion:** Hindi/English UI, photo-first AI listing, works on low-end phones

## 7. Feasibility & Scalability

- Built entirely on managed, free-tier services — no servers to maintain
- Supabase scales to 100k+ users on standard plans; RLS keeps data isolated per user
- Applicable to any handmade sector (pottery, textiles, jewellery, woodwork, painting, metalwork)
- Ready for artisan clusters, SHGs, cooperatives and schemes like ODOP and PM Vishwakarma
- Phase 2 roadmap: Razorpay payments, WhatsApp notifications, reviews & ratings, logistics integration, regional languages beyond Hindi, PWA offline mode

## 8. Business Model

Free basic listing for artisans · small subscription for analytics & custom-order tools · low commission on marketplace sales.
