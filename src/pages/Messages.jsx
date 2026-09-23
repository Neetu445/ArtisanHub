import { Link } from 'react-router-dom'
import { useStore, fmtTime } from '../lib/store'
import { Empty, PageTitle, StatusBadge } from '../components/ui'

export default function Messages({ artisanMode }) {
  const { db, user, artisan, product, userById } = useStore()
  const mine = db.orders.filter((o) => artisanMode ? o.artisanId === user.artisanId : o.customerId === user.id)
  const threads = mine.map((o) => ({ o, last: [...db.messages].reverse().find((m) => m.orderId === o.id) })).sort((x, y) => (y.last?.at || y.o.createdAt).localeCompare(x.last?.at || x.o.createdAt))
  const base = artisanMode ? '/dashboard/orders/' : '/orders/'
  return (<div><PageTitle>Messages</PageTitle>
    {threads.length === 0 ? <Empty text="No conversations yet."/> : <div className="card divide-y divide-stone-100">{threads.map(({ o, last }) => {
      const p = o.type === 'regular' ? product(o.productId) : null; const other = artisanMode ? userById(o.customerId)?.name : artisan(o.artisanId)?.name
      return (<Link key={o.id} to={base + o.id} className="flex items-center gap-3 p-3 hover:bg-stone-50">
        <img src={p?.image || o.referenceImage} className="w-12 h-12 rounded-lg object-cover bg-stone-100" alt=""/>
        <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium">{other}</span><StatusBadge s={o.status}/></div>
          <div className="text-sm text-stone-600 truncate">{p?.name || o.title}</div>
          <div className="text-xs text-stone-400 truncate">{last ? `${userById(last.senderId)?.name?.split(' ')[0]}: ${last.text}` : 'No messages yet'}</div></div>
        <div className="text-xs text-stone-400">{last && fmtTime(last.at)}</div></Link>) })}</div>}
  </div>)
}
