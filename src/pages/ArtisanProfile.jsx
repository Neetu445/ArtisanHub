import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Award, Sparkles } from 'lucide-react'
import { useStore } from '../lib/store'
import { ProductCard } from '../components/ui'

export default function ArtisanProfile() {
  const { id } = useParams(); const { db, artisan } = useStore()
  const a = artisan(id); if (!a) return <div>Artisan not found</div>
  const products = db.products.filter((p) => p.artisanId === id)
  return (
    <div>
      <div className="card overflow-hidden">
        <div className="h-44 md:h-56 bg-stone-200"><img src={a.cover} className="w-full h-full object-cover" alt=""/></div>
        <div className="p-5 md:flex gap-6">
          <img src={a.avatar} className="w-28 h-28 rounded-full border-4 border-white -mt-16 object-cover shadow" alt=""/>
          <div className="flex-1 mt-3 md:mt-0">
            <div className="flex flex-wrap items-start gap-3">
              <div><h1 className="text-2xl font-serif font-bold">{a.name}</h1><div className="text-terra-700 font-medium">{a.craft}</div></div>
              <Link to={`/custom/${a.id}`} className="btn-primary ml-auto"><Sparkles size={16}/>Request Custom Piece</Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-stone-600 mt-2">
              <span className="flex items-center gap-1"><MapPin size={14}/>{a.location}</span>
              <span className="flex items-center gap-1"><Award size={14}/>{a.yearsExp} yrs experience</span>
              {a.rating > 0 && <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400"/>{a.rating} ({a.reviews} reviews)</span>}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div><h3 className="font-semibold text-sm mb-1">The Story</h3><p className="text-sm text-stone-600">{a.story || 'This artisan has not added their story yet.'}</p></div>
              <div><h3 className="font-semibold text-sm mb-1">The Process</h3><p className="text-sm text-stone-600">{a.process || '—'}</p></div>
            </div>
          </div>
        </div>
      </div>
      <h2 className="font-serif text-xl font-semibold mt-8 mb-3">Products ({products.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map((p) => <ProductCard key={p.id} p={p}/>)}</div>
    </div>
  )
}
