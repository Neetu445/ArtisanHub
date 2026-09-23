import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, inr, fmtDate } from '../../lib/store'
import { StatusBadge, Empty, PageTitle } from '../../components/ui'
import { STATUS_LABEL, STATUS } from '../../data/seed'

export default function Orders() {
  const { db, user, product, userById, setStatus } = useStore()
  const [tab, setTab] = useState('all')
  const all = db.orders.filter((o) => o.artisanId === user.artisanId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const match = (o, k) => k === 'all' || o.status === k || (k === 'received' && o.status === 'approved')
  const tabs = [['all', 'All'], ['quote_requested', 'Quote requests'], ['received', 'New'], ['in_progress', 'In progress'], ['shipped', 'Shipped'], ['delivered', 'Delivered']]
  const list = all.filter((o) => match(o, tab))
  return (
    <div><PageTitle>Orders</PageTitle>
      <div className="flex gap-1 overflow-x-auto mb-4">{tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border ${tab === k ? 'bg-terra-600 text-white border-terra-600' : 'bg-white border-stone-300'}`}>{l} <span className="opacity-70">({all.filter((o) => match(o, k)).length})</span></button>)}</div>
      {list.length === 0 ? <Empty text="No orders here."/> : <div className="space-y-2">{list.map((o) => { const p = o.type === 'regular' ? product(o.productId) : null; const steps = STATUS[o.type]; const next = steps[steps.indexOf(o.status) + 1]; return (
        <div key={o.id} className="card p-3 flex items-center gap-3">
          <img src={p?.image || o.referenceImage} className="w-14 h-14 rounded-lg object-cover bg-stone-100" alt=""/>
          <div className="flex-1 min-w-0"><Link to={`/dashboard/orders/${o.id}`} className="font-medium hover:text-terra-700 truncate block">{p?.name || o.title}</Link>
            <div className="text-xs text-stone-500">{o.type === 'custom' && <span className="badge bg-terra-50 text-terra-700 mr-1">Custom</span>}{userById(o.customerId)?.name} · Qty {o.qty} · {fmtDate(o.createdAt)} · {o.address}</div></div>
          <div className="text-right"><div className="font-semibold">{o.amount ? inr(o.amount) : '—'}</div><StatusBadge s={o.status}/></div>
          {o.status === 'quote_requested' ? <Link to={`/dashboard/orders/${o.id}`} className="btn-primary text-sm py-1.5">Send quote</Link>
            : next && o.status !== 'quoted' ? <button onClick={() => setStatus(o.id, next)} className="btn-outline text-sm py-1.5 whitespace-nowrap">→ {STATUS_LABEL[next]}</button> : <span className="w-24"/>}
        </div>) })}</div>}
    </div>
  )
}
