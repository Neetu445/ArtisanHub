import { Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import { STATUS_LABEL, STATUS_COLOR } from '../data/seed'
import { inr, useStore } from '../lib/store'

export const StatusBadge = ({ s }) => <span className={`badge ${STATUS_COLOR[s] || 'bg-stone-100'}`}>{STATUS_LABEL[s] || s}</span>

export function ProductCard({ p }) {
  const { artisan } = useStore()
  const a = artisan(p.artisanId)
  return (
    <Link to={`/product/${p.id}`} className="card overflow-hidden hover:shadow-md transition group">
      <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" loading="lazy"/>
        {p.stock === 0 && <span className="absolute top-2 left-2 badge bg-red-600 text-white">Sold out</span>}
        {p.stock > 0 && p.stock <= p.lowStock && <span className="absolute top-2 left-2 badge bg-amber-500 text-white">Only {p.stock} left</span>}
      </div>
      <div className="p-3">
        <div className="text-xs text-terra-700 font-medium">{p.category}</div>
        <div className="font-medium leading-snug line-clamp-2">{p.name}</div>
        <div className="text-xs text-stone-500 mt-1 flex items-center gap-1"><MapPin size={11}/>{a?.name} · {a?.location?.split(',').slice(-2)[0]}</div>
        <div className="font-semibold mt-2">{inr(p.price)}</div>
      </div>
    </Link>
  )
}

export function ArtisanCard({ a }) {
  return (
    <Link to={`/artisan/${a.id}`} className="card overflow-hidden hover:shadow-md transition">
      <div className="h-24 bg-stone-200"><img src={a.cover} className="w-full h-full object-cover" alt=""/></div>
      <div className="p-4 -mt-10 flex gap-3 items-end">
        <img src={a.avatar} className="w-16 h-16 rounded-full border-4 border-white object-cover" alt=""/>
        <div className="pb-1">
          <div className="font-semibold">{a.name}</div>
          <div className="text-xs text-stone-500">{a.craft}</div>
        </div>
      </div>
      <div className="px-4 pb-4 text-sm text-stone-600 flex items-center justify-between">
        <span className="flex items-center gap-1"><MapPin size={13}/>{a.location}</span>
        {a.rating > 0 && <span className="flex items-center gap-1"><Star size={13} className="fill-amber-400 text-amber-400"/>{a.rating}</span>}
      </div>
    </Link>
  )
}

export const Empty = ({ text }) => <div className="card p-10 text-center text-stone-500">{text}</div>
export const PageTitle = ({ children, right }) => <div className="flex items-center justify-between mb-5"><h1 className="text-2xl font-serif font-bold">{children}</h1>{right}</div>

export function Stepper({ steps, current }) {
  const idx = steps.indexOf(current)
  return (
    <ol className="flex items-center gap-1 overflow-x-auto py-1">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-1 whitespace-nowrap">
          <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${i <= idx ? 'bg-terra-600 text-white' : 'bg-stone-200 text-stone-500'}`}>{i + 1}</span>
          <span className={`text-xs ${i <= idx ? 'text-terra-700 font-medium' : 'text-stone-400'}`}>{STATUS_LABEL[s]}</span>
          {i < steps.length - 1 && <span className={`w-6 h-px mx-1 ${i < idx ? 'bg-terra-500' : 'bg-stone-300'}`}/>}
        </li>
      ))}
    </ol>
  )
}
