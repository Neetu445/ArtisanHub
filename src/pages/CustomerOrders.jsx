import { Link } from 'react-router-dom'
import { useStore, inr, fmtDate } from '../lib/store'
import { StatusBadge, Empty, PageTitle } from '../components/ui'

export default function CustomerOrders() {
  const { db, user, artisan, product } = useStore()
  const orders = db.orders.filter((o) => o.customerId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return (
    <div><PageTitle>My Orders</PageTitle>
      {orders.length === 0 ? <Empty text="No orders yet. Discover something handmade!"/> : (
        <div className="space-y-3">{orders.map((o) => { const p = o.type === 'regular' ? product(o.productId) : null; const a = artisan(o.artisanId); return (
          <Link key={o.id} to={`/orders/${o.id}`} className="card p-4 flex items-center gap-4 hover:bg-stone-50">
            <img src={p?.image || o.referenceImage} className="w-16 h-16 rounded-lg object-cover bg-stone-100" alt=""/>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p?.name || o.title}</div>
              <div className="text-xs text-stone-500">{o.type === 'custom' && <span className="badge bg-terra-50 text-terra-700 mr-2">Custom</span>}{a?.name} · {fmtDate(o.createdAt)} · Qty {o.qty}</div>
            </div>
            <div className="text-right"><div className="font-semibold">{o.amount ? inr(o.amount) : 'Awaiting quote'}</div><StatusBadge s={o.status}/></div>
          </Link>) })}</div>)}
    </div>
  )
}
