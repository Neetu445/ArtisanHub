import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Upload, Check } from 'lucide-react'
import { useStore } from '../lib/store'
import { toDataUrl } from '../lib/gemini'
import { Stepper } from '../components/ui'
import { STATUS } from '../data/seed'

export default function CustomRequest() {
  const { artisanId } = useParams(); const nav = useNavigate()
  const { db, artisan, user, requestCustom } = useStore()
  const [sel, setSel] = useState(artisanId || '')
  const a = artisan(sel)
  const [f, setF] = useState({ title: '', brief: '', qty: 1, address: '', referenceImage: '' }); const [done, setDone] = useState(null)
  const onFile = async (e) => { const file = e.target.files[0]; if (file) setF({ ...f, referenceImage: await toDataUrl(file) }) }
  const submit = (e) => { e.preventDefault(); if (!sel) return; if (!user) return nav('/login?next=/custom/' + sel); if (user.role !== 'customer') return alert('Switch to a customer account to send requests.'); requestCustom({ artisanId: sel, ...f }).then(setDone).catch((ex) => alert(ex.message)) }
  if (done && a) return (<div className="card max-w-lg mx-auto p-8 text-center"><div className="w-14 h-14 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center"><Check/></div>
    <h2 className="font-serif text-2xl font-bold mt-3">Request sent to {a.name}</h2><p className="text-stone-600 mt-1">You'll get a quote with price and timeline. You can chat with the artisan on the order page.</p>
    <Link to={`/orders/${done.id}`} className="btn-primary mt-5">View request</Link></div>)
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold">Design it your way</h1>
      <p className="text-stone-600 mt-1">Describe what you want, attach a reference photo or sketch, and the artisan will send you a price and timeline. You approve before any work starts.</p>
      <div className="card p-3 my-4"><Stepper steps={STATUS.custom} current="quote_requested"/></div>
      <form onSubmit={submit} className="card p-5 space-y-4">
        <div><label className="label">Choose an artisan</label>
          <div className="grid sm:grid-cols-2 gap-2">{db.artisans.map((x) => (
            <button type="button" key={x.id} onClick={() => setSel(x.id)} className={`flex items-center gap-3 p-2 rounded-lg border text-left ${sel === x.id ? 'border-terra-600 bg-terra-50' : 'border-stone-200 hover:border-terra-300'}`}>
              <img src={x.avatar} className="w-10 h-10 rounded-full object-cover" alt=""/><div><div className="text-sm font-medium">{x.name}</div><div className="text-xs text-stone-500">{x.craft} · {x.location.split(',').slice(-2).join(',')}</div></div></button>))}</div>
          {!sel && <div className="text-xs text-stone-400 mt-1">Select who should make it.</div>}</div>
        <div><label className="label">What do you want made?</label><input required className="input" placeholder="e.g. Name-engraved kulhads for a wedding" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })}/></div>
        <div><label className="label">Details (size, colours, material, deadline)</label><textarea required rows={4} className="input" value={f.brief} onChange={(e) => setF({ ...f, brief: e.target.value })}/></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Quantity</label><input type="number" min={1} className="input" value={f.qty} onChange={(e) => setF({ ...f, qty: +e.target.value })}/></div>
          <div><label className="label">Delivery address</label><input required className="input" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })}/></div>
        </div>
        <div><label className="label">Reference image</label>
          <label className="block border-2 border-dashed border-stone-300 rounded-xl p-4 text-center cursor-pointer hover:border-terra-400">
            {f.referenceImage ? <img src={f.referenceImage} className="max-h-48 mx-auto rounded" alt="reference"/> : <div className="text-stone-500 text-sm flex flex-col items-center gap-1"><Upload/>Upload a photo or sketch of what you have in mind</div>}
            <input type="file" accept="image/*" className="hidden" onChange={onFile}/></label></div>
        <button disabled={!sel} className="btn-primary w-full justify-center">Send request for quote{a ? ` to ${a.name}` : ''}</button>
      </form>
    </div>
  )
}
