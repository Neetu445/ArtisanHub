// Central data store. Live mode = Supabase (Postgres + Auth + Storage + Realtime).
// Demo mode (no VITE_SUPABASE_ANON_KEY) = localStorage with seed data. Same API either way.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as seed from '../data/seed'
import { supabase, isLive, fromArtisan, toArtisan, fromProduct, toProduct, fromOrder, fromMessage, fromProfile, uploadImage } from './supabase'

const KEY = 'artisanhub_db_v1'
const Ctx = createContext(null)
const uid = (p) => p + Math.random().toString(36).slice(2, 8)
const EMPTY = { users: [], artisans: [], products: [], orders: [], messages: [] }

function loadLocal() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch {}
  return { users: seed.users, artisans: seed.artisans, products: seed.products, orders: seed.orders, messages: seed.messages }
}

export function StoreProvider({ children }) {
  const [db, setDb] = useState(isLive ? EMPTY : loadLocal)
  const [user, setUser] = useState(() => { if (isLive) return null; try { return JSON.parse(localStorage.getItem(KEY + '_user')) } catch { return null } })
  const [lang, setLang] = useState(() => localStorage.getItem(KEY + '_lang') || 'en')
  const [ready, setReady] = useState(!isLive)

  useEffect(() => { localStorage.setItem(KEY + '_lang', lang) }, [lang])
  useEffect(() => { if (!isLive) localStorage.setItem(KEY, JSON.stringify(db)) }, [db])
  useEffect(() => { if (!isLive) localStorage.setItem(KEY + '_user', JSON.stringify(user)) }, [user])

  const patch = (fn) => setDb((d) => ({ ...d, ...fn(d) }))

  // ---------- LIVE: load everything + realtime ----------
  const refresh = useCallback(async () => {
    if (!isLive) return
    const [a, p, o, m, u] = await Promise.all([
      supabase.from('artisans').select('*').order('created_at'),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at'),
      supabase.from('profiles').select('*'),
    ])
    setDb({ artisans: (a.data || []).map(fromArtisan), products: (p.data || []).map(fromProduct), orders: (o.data || []).map(fromOrder), messages: (m.data || []).map(fromMessage), users: (u.data || []).map(fromProfile) })
  }, [])

  const hydrateUser = useCallback(async (session) => {
    if (!session?.user) return setUser(null)
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    const { data: art } = await supabase.from('artisans').select('id').eq('user_id', session.user.id).maybeSingle()
    setUser({ id: session.user.id, email: session.user.email, name: prof?.name || session.user.user_metadata?.name || 'User', role: prof?.role || session.user.user_metadata?.role || 'customer', artisanId: art?.id || null })
  }, [])

  useEffect(() => {
    if (!isLive) return
    ;(async () => { const { data } = await supabase.auth.getSession(); await hydrateUser(data.session); await refresh(); setReady(true) })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { hydrateUser(s); refresh() })
    const ch = supabase.channel('db').on('postgres_changes', { event: '*', schema: 'public' }, () => refresh()).subscribe()
    return () => { sub.subscription.unsubscribe(); supabase.removeChannel(ch) }
  }, [refresh, hydrateUser])

  // ---------- API ----------
  const api = {
    db, user, lang, setLang, ready, isLive, refresh,
    resetDemo: () => { if (!isLive) { localStorage.removeItem(KEY); setDb(loadLocal()) } },

    // ---- auth ----
    login: async (email, password) => {
      if (isLive) { const { data, error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; await hydrateUser(data.session); await refresh()
        const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.user.id).single(); return { role: prof?.role } }
      const u = db.users.find((x) => x.email === email && x.password === password)
      if (!u) throw new Error('Invalid email or password'); setUser(u); return u
    },
    signup: async ({ name, email, password, role, craft, location }) => {
      if (isLive) { const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, role, craft, location } } }); if (error) throw error
        if (!data.session) throw new Error('Check your email to confirm, then sign in. (Disable "Confirm email" in Supabase Auth settings to skip this.)')
        await hydrateUser(data.session); await refresh(); return { role } }
      if (db.users.find((x) => x.email === email)) throw new Error('Email already registered')
      const u = { id: uid('u'), name, email, password, role }; let artisan = null
      if (role === 'artisan') { artisan = { id: uid('a'), userId: u.id, name, craft: craft || 'Handicraft', location: location || 'India', avatar: '/img/default-avatar.jpg', cover: '/img/default-cover.jpg', yearsExp: 1, story: '', process: '', rating: 0, reviews: 0 }; u.artisanId = artisan.id }
      patch((d) => ({ users: [...d.users, u], artisans: artisan ? [...d.artisans, artisan] : d.artisans })); setUser(u); return u
    },
    logout: async () => { if (isLive) await supabase.auth.signOut(); setUser(null) },

    // ---- lookups ----
    artisan: (id) => db.artisans.find((a) => a.id === id),
    product: (id) => db.products.find((p) => p.id === id),
    userById: (id) => db.users.find((u) => u.id === id),
    myArtisan: () => (user?.artisanId ? db.artisans.find((a) => a.id === user.artisanId) : null),

    // ---- artisan profile ----
    updateArtisan: async (id, data) => {
      if (isLive) { const d = { ...data, avatar: await uploadImage(data.avatar, 'avatars'), cover: await uploadImage(data.cover, 'covers') }; const { error } = await supabase.from('artisans').update(toArtisan(d)).eq('id', id); if (error) throw error; return refresh() }
      patch((d) => ({ artisans: d.artisans.map((a) => (a.id === id ? { ...a, ...data } : a)) }))
    },

    // ---- products ----
    addProduct: async (p) => {
      if (isLive) { const image = await uploadImage(p.image, 'products'); const { data, error } = await supabase.from('products').insert(toProduct({ ...p, image })).select().single(); if (error) throw error; await refresh(); return fromProduct(data) }
      const np = { ...p, id: uid('p') }; patch((d) => ({ products: [np, ...d.products] })); return np
    },
    updateProduct: async (id, data) => {
      if (isLive) { const cur = db.products.find((p) => p.id === id); const merged = { ...cur, ...data, image: await uploadImage(data.image ?? cur.image, 'products') }; const { error } = await supabase.from('products').update(toProduct(merged)).eq('id', id); if (error) throw error; return refresh() }
      patch((d) => ({ products: d.products.map((p) => (p.id === id ? { ...p, ...data } : p)) }))
    },
    deleteProduct: async (id) => {
      if (isLive) { const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; return refresh() }
      patch((d) => ({ products: d.products.filter((p) => p.id !== id) }))
    },

    // ---- orders ----
    placeOrder: async ({ productId, qty, address }) => {
      const p = db.products.find((x) => x.id === productId)
      if (!p || p.stock < qty) throw new Error('Not enough stock')
      if (isLive) {
        const { data, error } = await supabase.from('orders').insert({ customer_id: user.id, artisan_id: p.artisanId, type: 'regular', product_id: productId, qty, amount: p.price * qty, status: 'received', address }).select().single()
        if (error) throw error; await supabase.rpc('decrement_stock', { pid: productId, q: qty }); await refresh(); return fromOrder(data)
      }
      const o = { id: uid('o'), customerId: user.id, artisanId: p.artisanId, type: 'regular', productId, qty, amount: p.price * qty, status: 'received', createdAt: new Date().toISOString(), address }
      patch((d) => ({ orders: [o, ...d.orders], products: d.products.map((x) => (x.id === productId ? { ...x, stock: x.stock - qty } : x)) })); return o
    },
    requestCustom: async ({ artisanId, title, brief, qty, referenceImage, address }) => {
      if (isLive) {
        const ref = await uploadImage(referenceImage, 'references')
        const { data, error } = await supabase.from('orders').insert({ customer_id: user.id, artisan_id: artisanId, type: 'custom', title, brief, qty, reference_image: ref, status: 'quote_requested', amount: 0, address }).select().single()
        if (error) throw error; await refresh(); return fromOrder(data)
      }
      const o = { id: uid('c'), customerId: user.id, artisanId, type: 'custom', title, brief, qty, referenceImage, status: 'quote_requested', quote: null, amount: 0, createdAt: new Date().toISOString(), address }
      patch((d) => ({ orders: [o, ...d.orders] })); return o
    },
    sendQuote: async (orderId, quote) => {
      if (isLive) { const { error } = await supabase.from('orders').update({ quote, amount: quote.price, status: 'quoted' }).eq('id', orderId); if (error) throw error; return refresh() }
      patch((d) => ({ orders: d.orders.map((o) => (o.id === orderId ? { ...o, quote, amount: quote.price, status: 'quoted' } : o)) }))
    },
    setStatus: async (orderId, status) => {
      if (isLive) { const { error } = await supabase.from('orders').update({ status }).eq('id', orderId); if (error) throw error; return refresh() }
      patch((d) => ({ orders: d.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }))
    },

    // ---- messages ----
    sendMessage: async (orderId, text) => {
      if (isLive) { const { error } = await supabase.from('messages').insert({ order_id: orderId, sender_id: user.id, text }); if (error) throw error; return refresh() }
      patch((d) => ({ messages: [...d.messages, { id: uid('m'), orderId, senderId: user.id, text, at: new Date().toISOString() }] }))
    },
  }
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN')
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
export const fmtTime = (iso) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
