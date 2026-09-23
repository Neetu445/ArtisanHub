import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStore, inr, fmtTime } from '../lib/store'
import { StatusBadge, Stepper } from '../components/ui'
import Chat from '../components/Chat'
import { STATUS, STATUS_LABEL } from '../data/seed'

export default function OrderDetail() {
  const { id } = useParams()
  const { db, user, artisan, product, userById, sendQuote, setStatus } = useStore()
  const o = db.orders.find((x) => x.id === id); if (!o) return <div>Order not found</div>
  const p = o.type === 'regular' ? product(o.productId) : null; const a = artisan(o.artisanId); const cust = userById(o.customerId)
  const isArtisan = user?.role === 'artisan' && user.artisanId === o.artisanId
  const steps = STATUS[o.type]; const idx = steps.indexOf(o.status); const next = steps[idx + 1]
  const [q, setQ] = useState({ price: '', days: '', note: '' })
  const back = isArtisan ? '/dashboard/orders' : '/orders'
  return (
    <div className="max-w-4xl mx-auto">
      <Link to={back} className="text-sm text-stone-500">← Back to orders</Link>
      <div className="grid md:grid-cols-5 gap-6 mt-2">
        <div className="md:col-span-3 space-y-4">
          <div className="card p-5">
            <div className="flex items-start gap-4">
              <img src={p?.image || o.referenceImage} className="w-24 h-24 rounded-lg object-cover bg-stone-100" alt=""/>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">{o.type === 'custom' && <span className="badge bg-terra-50 text-terra-700">Custom order</span>}<StatusBadge s={o.status}/></div>
                <h1 className="text-xl font-serif font-bold mt-1">{p?.name || o.title}</h1>
                <div className="text-sm text-stone-500">Order #{o.id.toUpperCase()} · {fmtTime(o.createdAt)}</div>
                <div className="text-sm mt-1">Qty {o.qty} · {o.amount ? <b>{inr(o.amount)}</b> : <i>Awaiting quote</i>} · Deliver to {o.address}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100"><Stepper steps={steps} current={o.status}/></div>
            {o.type === 'custom' && (<div className="mt-4 pt-4 border-t border-stone-100 grid sm:grid-cols-2 gap-4">
              <div><h3 className="text-sm font-semibold mb-1">Customer brief</h3><p className="text-sm text-stone-600">{o.brief}</p></div>
              {o.referenceImage && <div><h3 className="text-sm font-semibold mb-1">Reference image</h3><img src={o.referenceImage} className="rounded-lg max-h-48 object-cover" alt=""/></div>}
            </div>)}
            {o.quote && (<div className="mt-4 p-3 rounded-lg bg-sky-50 border border-sky-100 text-sm"><b>Quote from {a.name}:</b> {inr(o.quote.price)} · {o.quote.days} days<div className="text-stone-600 mt-1">{o.quote.note}</div></div>)}
          </div>

          {/* actions */}
          {isArtisan && o.status === 'quote_requested' && (
            <form onSubmit={(e) => { e.preventDefault(); sendQuote(o.id, { price: +q.price, days: +q.days, note: q.note }) }} className="card p-4 space-y-3">
              <h3 className="font-semibold">Send a quote</h3>
              <div className="grid grid-cols-2 gap-3"><div><label className="label">Price (₹)</label><input required type="number" className="input" value={q.price} onChange={(e) => setQ({ ...q, price: e.target.value })}/></div>
                <div><label className="label">Timeline (days)</label><input required type="number" className="input" value={q.days} onChange={(e) => setQ({ ...q, days: e.target.value })}/></div></div>
              <div><label className="label">Note</label><input className="input" placeholder="Materials, advance, batches…" value={q.note} onChange={(e) => setQ({ ...q, note: e.target.value })}/></div>
              <div className="flex gap-2"><button className="btn-primary">Send quote</button><button type="button" onClick={() => setStatus(o.id, 'declined')} className="btn-ghost text-red-600">Decline</button></div>
            </form>)}
          {!isArtisan && o.status === 'quoted' && (<div className="card p-4 flex items-center gap-3"><span className="flex-1 text-sm">Accept this quote to start production?</span>
            <button onClick={() => setStatus(o.id, 'approved')} className="btn-primary">Approve quote</button><button onClick={() => setStatus(o.id, 'cancelled')} className="btn-ghost text-red-600">Cancel</button></div>)}
          {isArtisan && next && !['quote_requested', 'quoted'].includes(o.status) && (<div className="card p-4 flex items-center gap-3"><span className="flex-1 text-sm">Update progress</span>
            <button onClick={() => setStatus(o.id, next)} className="btn-primary">Mark as {STATUS_LABEL[next]}</button></div>)}
        </div>
        <div className="md:col-span-2">
          <div className="card p-3 mb-3 flex items-center gap-3">
            <img src={isArtisan ? '/img/default-avatar.jpg' : a.avatar} className="w-10 h-10 rounded-full object-cover" alt=""/>
            <div><div className="text-xs text-stone-500">{isArtisan ? 'Customer' : 'Artisan'}</div><div className="font-medium">{isArtisan ? cust?.name : a.name}</div></div>
          </div>
          <Chat orderId={o.id}/>
        </div>
      </div>
    </div>
  )
}
