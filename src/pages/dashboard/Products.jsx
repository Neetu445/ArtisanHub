import { useState } from 'react'
import { Plus, Sparkles, Trash2, Pencil, Upload, Loader2 } from 'lucide-react'
import { useStore, inr } from '../../lib/store'
import { generateListing, toDataUrl } from '../../lib/gemini'
import { PageTitle } from '../../components/ui'

const blank = { name: '', category: 'Pottery', material: '', price: '', stock: '', lowStock: 5, image: '', description: '', descriptionHi: '', tags: [] }

export default function Products() {
  const { db, user, addProduct, updateProduct, deleteProduct } = useStore()
  const list = db.products.filter((p) => p.artisanId === user.artisanId)
  const [form, setForm] = useState(null); const [file, setFile] = useState(null); const [ai, setAi] = useState(false); const [aiDone, setAiDone] = useState(false)
  const open = (p) => { setForm(p ? { ...p } : { ...blank }); setFile(null); setAiDone(false) }
  const onFile = async (e) => { const f = e.target.files[0]; if (!f) return; setFile(f); setForm({ ...form, image: await toDataUrl(f) }) }
  const runAi = async () => { setAi(true); try { const r = await generateListing(file); setForm({ ...form, ...r, price: form.price || r.suggestedPrice }); setAiDone(true) } catch (e) { alert(e.message) } finally { setAi(false) } }
  const save = (e) => { e.preventDefault(); const d = { ...form, price: +form.price, stock: +form.stock, lowStock: +form.lowStock, artisanId: user.artisanId, image: form.image || '/img/default-product.jpg' }
    Promise.resolve(form.id ? updateProduct(form.id, d) : addProduct(d)).then(() => setForm(null)).catch((ex) => alert(ex.message)) }
  return (
    <div>
      <PageTitle right={<button onClick={() => open()} className="btn-primary"><Plus size={16}/>Add product</button>}>Products & Inventory</PageTitle>
      <div className="card overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-stone-50 text-stone-500 text-left"><tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr></thead>
        <tbody className="divide-y divide-stone-100">{list.map((p) => (<tr key={p.id} className={p.stock <= p.lowStock ? 'bg-amber-50/60' : ''}>
          <td className="p-3"><div className="flex items-center gap-3"><img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt=""/><div><div className="font-medium">{p.name}</div><div className="text-xs text-stone-500">{p.material}</div></div></div></td>
          <td className="p-3">{p.category}</td><td className="p-3 font-medium">{inr(p.price)}</td>
          <td className="p-3"><div className="flex items-center gap-2"><button onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })} className="w-6 h-6 rounded bg-stone-100">−</button><span className={`w-8 text-center font-medium ${p.stock === 0 ? 'text-red-600' : p.stock <= p.lowStock ? 'text-amber-600' : ''}`}>{p.stock}</span><button onClick={() => updateProduct(p.id, { stock: p.stock + 1 })} className="w-6 h-6 rounded bg-stone-100">+</button>
            {p.stock === 0 ? <span className="badge bg-red-100 text-red-700">Out</span> : p.stock <= p.lowStock && <span className="badge bg-amber-100 text-amber-700">Low</span>}</div></td>
          <td className="p-3 text-right whitespace-nowrap"><button onClick={() => open(p)} className="btn-ghost px-2"><Pencil size={15}/></button><button onClick={() => confirm('Delete product?') && deleteProduct(p.id)} className="btn-ghost px-2 text-red-600"><Trash2 size={15}/></button></td></tr>))}
          {list.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-stone-500">No products yet. Add your first one — try the AI listing generator!</td></tr>}</tbody></table></div>

      {form && (<div className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setForm(null)}>
        <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl p-5 max-h-[92vh] overflow-y-auto space-y-4">
          <h2 className="text-lg font-semibold">{form.id ? 'Edit product' : 'Add product'}</h2>
          <div className="grid sm:grid-cols-[200px_1fr] gap-4">
            <div><label className="block aspect-square border-2 border-dashed border-stone-300 rounded-xl overflow-hidden cursor-pointer hover:border-terra-400">
              {form.image ? <img src={form.image} className="w-full h-full object-cover" alt=""/> : <div className="h-full flex flex-col items-center justify-center text-stone-400 text-sm gap-1"><Upload/>Photo</div>}
              <input type="file" accept="image/*" className="hidden" onChange={onFile}/></label>
              <button type="button" onClick={runAi} disabled={!form.image || ai} className="btn-outline w-full justify-center mt-2 text-sm">{ai ? <Loader2 size={15} className="animate-spin"/> : <Sparkles size={15}/>}{ai ? 'Generating…' : 'Generate listing with AI'}</button>
              {aiDone && <div className="text-xs text-green-700 mt-1 text-center">✓ Filled in English + Hindi. Edit as needed.</div>}
              {!import.meta.env.VITE_GEMINI_API_KEY && <div className="text-[10px] text-stone-400 mt-1 text-center">Demo mode – add VITE_GEMINI_API_KEY for live Gemini</div>}
            </div>
            <div className="space-y-3">
              <div><label className="label">Name</label><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="label">Category</label><select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['Pottery', 'Textiles', 'Woodwork', 'Jewellery', 'Metalwork', 'Painting', 'Other'].map((c) => <option key={c}>{c}</option>)}</select></div>
                <div><label className="label">Material</label><input className="input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}/></div></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="label">Price ₹</label><input required type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}/></div>
                <div><label className="label">Stock</label><input required type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}/></div>
                <div><label className="label">Low-stock alert</label><input type="number" className="input" value={form.lowStock} onChange={(e) => setForm({ ...form, lowStock: e.target.value })}/></div></div>
            </div>
          </div>
          <div><label className="label">Description (English)</label><textarea rows={2} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></div>
          <div><label className="label">विवरण (Hindi)</label><textarea rows={2} className="input" value={form.descriptionHi} onChange={(e) => setForm({ ...form, descriptionHi: e.target.value })}/></div>
          <div><label className="label">Tags (comma separated)</label><input className="input" value={form.tags?.join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}/></div>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setForm(null)} className="btn-ghost">Cancel</button><button className="btn-primary">Save</button></div>
        </form></div>)}
    </div>
  )
}
