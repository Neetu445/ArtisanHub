import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = url && key ? createClient(url, key) : null
export const isLive = !!supabase

// ---- row <-> app object mappers (DB is snake_case, app is camelCase) ----
export const fromArtisan = (r) => ({ id: r.id, userId: r.user_id, name: r.name, craft: r.craft, location: r.location, avatar: r.avatar, cover: r.cover, yearsExp: r.years_exp, story: r.story, process: r.process, rating: Number(r.rating), reviews: r.reviews })
export const toArtisan = (a) => ({ name: a.name, craft: a.craft, location: a.location, avatar: a.avatar, cover: a.cover, years_exp: a.yearsExp, story: a.story, process: a.process })
export const fromProduct = (r) => ({ id: r.id, artisanId: r.artisan_id, name: r.name, category: r.category, material: r.material, price: r.price, stock: r.stock, lowStock: r.low_stock, image: r.image, description: r.description, descriptionHi: r.description_hi, tags: r.tags || [], createdAt: r.created_at })
export const toProduct = (p) => ({ artisan_id: p.artisanId, name: p.name, category: p.category, material: p.material, price: p.price, stock: p.stock, low_stock: p.lowStock, image: p.image, description: p.description, description_hi: p.descriptionHi, tags: p.tags })
export const fromOrder = (r) => ({ id: r.id, customerId: r.customer_id, artisanId: r.artisan_id, type: r.type, productId: r.product_id, qty: r.qty, amount: r.amount, status: r.status, address: r.address, title: r.title, brief: r.brief, referenceImage: r.reference_image, quote: r.quote, createdAt: r.created_at })
export const fromMessage = (r) => ({ id: r.id, orderId: r.order_id, senderId: r.sender_id, text: r.text, at: r.created_at })
export const fromProfile = (r) => ({ id: r.id, name: r.name, role: r.role })

// upload a data-URL or File to storage, return public URL
export async function uploadImage(src, folder = 'uploads') {
  if (!supabase || !src) return src
  let blob = src
  if (typeof src === 'string') { if (!src.startsWith('data:')) return src; blob = await (await fetch(src)).blob() }
  const ext = (blob.type?.split('/')[1] || 'jpg').replace('jpeg', 'jpg')
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('images').upload(path, blob, { contentType: blob.type })
  if (error) throw error
  return supabase.storage.from('images').getPublicUrl(path).data.publicUrl
}
