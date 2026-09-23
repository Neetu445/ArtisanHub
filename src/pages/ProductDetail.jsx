import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Sparkles, Check } from 'lucide-react'
import { useStore, inr } from '../lib/store'

export default function ProductDetail() {
  const { id } = useParams(); const nav = useNavigate()
  const { product, artisan, user, placeOrder, lang } = useStore()
  const p = product(id); const [qty, setQty] = useState(1); const [address, setAddress] = useState(''); const [done, setDone] = useState(null); const [err, setErr] = useState('')
  if (!p) return <div>Product not found</div>
  const a = artisan(p.artisanId)
  const order = async (e) => { e.preventDefault(); setErr('')
    if (!user) return nav('/login?next=/product/' + id)
    if (user.role !== 'customer') return setErr('Switch to a customer account to place orders.')
    try { const o = await placeOrder({ productId: id, qty, address }); setDone(o) } catch (ex) { setErr(ex.message) } }
  if (done) return (
    <div className="card max-w-lg mx-auto p-8 text-center"><div className="w-14 h-14 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center"><Check/></div>
      <h2 className="font-serif text-2xl font-bold mt-3">Order placed!</h2><p className="text-stone-600 mt-1">{a.name} has received your order for {qty} × {p.name}. Payment on delivery.</p>
      <Link to={`/orders/${done.id}`} className="btn-primary mt-5">Track order</Link></div>)
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="card overflow-hidden"><img src={p.image} className="w-full aspect-[4/3] object-cover" alt={p.name}/></div>
      <div>
        <div className="text-sm text-terra-700 font-medium">{p.category} · {p.material}</div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold mt-1">{p.name}</h1>
        <div className="text-2xl font-semibold mt-2">{inr(p.price)}</div>
        <p className="text-stone-600 mt-3">{lang === 'hi' && p.descriptionHi ? p.descriptionHi : p.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">{p.tags?.map((t) => <span key={t} className="badge bg-stone-100 text-stone-600">#{t}</span>)}</div>
        <Link to={`/artisan/${a.id}`} className="card p-3 mt-5 flex items-center gap-3 hover:bg-stone-50">
          <img src={a.avatar} className="w-12 h-12 rounded-full object-cover" alt=""/>
          <div className="flex-1"><div className="font-medium">{a.name}</div><div className="text-xs text-stone-500 flex items-center gap-1"><MapPin size={11}/>{a.location}</div></div>
          <span className="text-sm text-terra-700">View profile →</span>
        </Link>
        <form onSubmit={order} className="card p-4 mt-4 space-y-3">
          <div className="flex items-center justify-between"><span className="font-medium">Place order</span>
            {p.stock === 0 ? <span className="badge bg-red-100 text-red-700">Sold out</span> : <span className={`text-sm ${p.stock <= p.lowStock ? 'text-amber-600' : 'text-stone-500'}`}>{p.stock} in stock</span>}</div>
          <div className="flex gap-3">
            <div className="w-24"><label className="label">Qty</label><input type="number" min={1} max={p.stock} value={qty} onChange={(e) => setQty(+e.target.value)} className="input"/></div>
            <div className="flex-1"><label className="label">Delivery address</label><input required className="input" placeholder="Area, City" value={address} onChange={(e) => setAddress(e.target.value)}/></div>
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <div className="flex items-center justify-between"><span className="text-sm text-stone-500">Total <b className="text-stone-800">{inr(p.price * qty)}</b> · Pay on delivery</span>
            <button disabled={p.stock === 0} className="btn-primary">Order now</button></div>
        </form>
        <Link to={`/custom/${a.id}`} className="btn-outline w-full justify-center mt-3"><Sparkles size={16}/>Want something customised? Request a custom piece</Link>
      </div>
    </div>
  )
}
