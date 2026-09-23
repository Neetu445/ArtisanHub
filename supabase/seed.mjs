// Seeds demo data into Supabase. Needs SERVICE ROLE key (never commit it):
//   SUPABASE_SERVICE_KEY=... node supabase/seed.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => l.split('=').map((x) => x.trim())))
const url = env.VITE_SUPABASE_URL, svc = process.env.SUPABASE_SERVICE_KEY
if (!svc) { console.error('Set SUPABASE_SERVICE_KEY (Project Settings → API → service_role)'); process.exit(1) }
const sb = createClient(url, svc, { auth: { persistSession: false } })

// load seed dataset
const seed = await import('../src/data/seed.js')
const PASS = 'demo123'

// 1. users
const userMap = {}
for (const u of seed.users) {
  const { data: list } = await sb.auth.admin.listUsers({ perPage: 1000 })
  let existing = list.users.find((x) => x.email === u.email)
  if (!existing) {
    const { data, error } = await sb.auth.admin.createUser({ email: u.email, password: PASS, email_confirm: true, user_metadata: { name: u.name, role: u.role } })
    if (error) throw error; existing = data.user
  }
  userMap[u.id] = existing.id
  await sb.from('profiles').upsert({ id: existing.id, name: u.name, role: u.role })
  console.log('user', u.email, '->', existing.id)
}

// 2. artisans (trigger may have auto-created one for artisan users; remove those and insert seed rows with fixed ids)
for (const uid of Object.values(userMap)) await sb.from('artisans').delete().eq('user_id', uid).not('id', 'in', `(${seed.artisans.map((a) => `"${a.id}"`).join(',')})`)
const { error: ea } = await sb.from('artisans').upsert(seed.artisans.map((a) => ({ id: a.id, user_id: a.userId ? userMap[a.userId] : null, name: a.name, craft: a.craft, location: a.location, avatar: a.avatar, cover: a.cover, years_exp: a.yearsExp, story: a.story, process: a.process, rating: a.rating, reviews: a.reviews })))
if (ea) throw ea; console.log('artisans', seed.artisans.length)

// 3. products
const { error: ep } = await sb.from('products').upsert(seed.products.map((p) => ({ id: p.id, artisan_id: p.artisanId, name: p.name, category: p.category, material: p.material, price: p.price, stock: p.stock, low_stock: p.lowStock, image: p.image, description: p.description, description_hi: p.descriptionHi, tags: p.tags })))
if (ep) throw ep; console.log('products', seed.products.length)

// 4. orders
const { error: eo } = await sb.from('orders').upsert(seed.orders.map((o) => ({ id: o.id, customer_id: userMap[o.customerId], artisan_id: o.artisanId, type: o.type, product_id: o.productId || null, qty: o.qty, amount: o.amount, status: o.status, address: o.address, title: o.title || null, brief: o.brief || null, reference_image: o.referenceImage || null, quote: o.quote || null, created_at: o.createdAt })))
if (eo) throw eo; console.log('orders', seed.orders.length)

// 5. messages
const { error: em } = await sb.from('messages').upsert(seed.messages.map((m) => ({ id: m.id, order_id: m.orderId, sender_id: userMap[m.senderId], text: m.text, created_at: m.at })))
if (em) throw em; console.log('messages', seed.messages.length)
console.log('\n✓ Seed complete. Login: rahul@artisan.com / priya@customer.com  password:', PASS)
