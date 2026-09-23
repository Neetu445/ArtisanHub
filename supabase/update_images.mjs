// Re-points image URLs in Supabase to the bundled /img/*.jpg files. Usage: node supabase/update_images.mjs [BASE_URL]
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
const env = Object.fromEntries(readFileSync('.env','utf8').split('\n').filter(l=>l.includes('=')).map(l=>l.split('=').map(x=>x.trim())))
const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } })
const base = process.argv[2] || ''   // '' = relative paths, or e.g. https://artisanhub.vercel.app
const { error: le } = await sb.auth.signInWithPassword({ email: 'rahul@artisan.com', password: 'demo123' }); if (le) throw le
const seed = await import('../src/data/seed.js')
for (const a of seed.artisans) { const { error } = await sb.from('artisans').update({ avatar: base + a.avatar, cover: base + a.cover }).eq('id', a.id); if (error) throw error }
for (const p of seed.products) { const { error } = await sb.from('products').update({ image: base + p.image }).eq('id', p.id); if (error) throw error }
for (const o of seed.orders.filter(o => o.referenceImage)) { const { error } = await sb.from('orders').update({ reference_image: base + o.referenceImage }).eq('id', o.id); if (error) throw error }
console.log('✓ images updated for', seed.artisans.length, 'artisans,', seed.products.length, 'products')
