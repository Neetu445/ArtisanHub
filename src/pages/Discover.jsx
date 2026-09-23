import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Sparkles, Upload, FileText, CheckCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { ProductCard, ArtisanCard, Empty } from '../components/ui'
import { Link } from 'react-router-dom'

const CATS = ['All', 'Pottery', 'Textiles', 'Woodwork', 'Jewellery', 'Metalwork', 'Painting', 'Other']

export default function Discover() {
  const { db } = useStore()
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All'); const [max, setMax] = useState(20000); const [sort, setSort] = useState('new')
  const list = useMemo(() => {
    let l = db.products.filter((p) => {
      const a = db.artisans.find((x) => x.id === p.artisanId)
      const hay = `${p.name} ${p.category} ${p.material} ${(p.tags || []).join(' ')} ${p.description || ''} ${a?.name} ${a?.location} ${a?.craft}`.toLowerCase()
      const words = q.toLowerCase().split(/\s+/).filter(Boolean)
      return (cat === 'All' || p.category === cat) && (q ? true : p.price <= max) && words.every((w) => hay.includes(w))
    })
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    return l
  }, [db, q, cat, max, sort])
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-terra-600 to-terra-800 text-white p-8 md:p-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold max-w-xl">Handmade across India. Made for you.</h1>
        <p className="mt-2 text-terra-100 max-w-lg">Discover authentic crafts from Varanasi to Kutch, directly from the makers — or request a custom piece made just for you.</p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1"><Search className="absolute left-3 top-3 text-stone-400" size={18}/>
            <input className="input pl-10 text-stone-800" placeholder="Search saree, madhubani, dokra, blue pottery…" value={q} onChange={(e) => setQ(e.target.value)}/></div>
          <Link to="/custom" className="btn bg-white text-terra-700 hover:bg-terra-50 justify-center whitespace-nowrap"><Sparkles size={16}/>Design your own</Link>
        </div>
      </section>

      {!q && <section className="card p-6 md:flex items-center gap-8">
        <div className="md:w-1/3"><div className="text-terra-700 text-sm font-medium flex items-center gap-1"><Sparkles size={14}/>Custom orders</div>
          <h2 className="font-serif text-2xl font-bold mt-1">Can't find it? Have it made.</h2>
          <p className="text-stone-600 text-sm mt-2">Send a reference photo or sketch, describe size, colour and material — the artisan quotes a price and timeline, and you approve before work begins.</p>
          <Link to="/custom" className="btn-primary mt-4">Start a custom request</Link></div>
        <div className="grid grid-cols-3 gap-3 flex-1 mt-5 md:mt-0">
          {[[Upload, '1. Share your idea', 'Upload a reference image and describe your design'], [FileText, '2. Get a quote', 'Artisan replies with price, timeline and notes'], [CheckCircle, '3. Approve & track', 'Chat with the maker and follow progress to delivery']].map(([I, t, d]) => (
            <div key={t} className="rounded-xl bg-terra-50 p-4"><I className="text-terra-600" size={22}/><div className="font-medium text-sm mt-2">{t}</div><div className="text-xs text-stone-600 mt-1">{d}</div></div>))}
        </div>
      </section>}

      {!q && <section>
        <div className="flex items-center justify-between mb-3"><h2 className="font-serif text-xl font-semibold">Meet the Artisans</h2><Link to="/artisans" className="text-sm text-terra-700">View all →</Link></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{db.artisans.slice(0, 8).map((a) => <ArtisanCard key={a.id} a={a}/>)}</div>
      </section>}

      <section>
        {q && <div className="flex items-center gap-3 mb-3"><h2 className="font-serif text-xl font-semibold">{list.length} result{list.length !== 1 && 's'} for “{q}”</h2><button onClick={() => setQ('')} className="btn-ghost text-sm">Clear</button></div>}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-sm border ${cat === c ? 'bg-terra-600 text-white border-terra-600' : 'bg-white border-stone-300 hover:border-terra-400'}`}>{c}</button>)}
          <div className="ml-auto flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2"><SlidersHorizontal size={14}/>Up to ₹{max.toLocaleString('en-IN')}<input type="range" min={200} max={20000} step={100} value={max} onChange={(e) => setMax(+e.target.value)} className="accent-terra-600"/></label>
            <select className="input w-auto py-1" value={sort} onChange={(e) => setSort(e.target.value)}><option value="new">Newest</option><option value="low">Price: low → high</option><option value="high">Price: high → low</option></select>
          </div>
        </div>
        {list.length ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{list.map((p) => <ProductCard key={p.id} p={p}/>)}</div> : <Empty text="No products match your search."/>}
      </section>
    </div>
  )
}