import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { IndianRupee, ClipboardList, AlertTriangle, Sparkles, Users } from 'lucide-react'
import { useStore, inr } from '../../lib/store'
import { StatusBadge, PageTitle } from '../../components/ui'

const COLORS = ['#b5532d', '#e28150', '#f4cdb4', '#7a3521', '#ecab83']

export default function Dashboard() {
  const { db, user, product, userById } = useStore()
  const aid = user.artisanId
  const orders = db.orders.filter((o) => o.artisanId === aid)
  const products = db.products.filter((p) => p.artisanId === aid)
  const paid = orders.filter((o) => o.amount && !['quote_requested', 'quoted', 'cancelled', 'declined'].includes(o.status))
  const revenue = paid.reduce((s, o) => s + o.amount, 0)
  const pending = orders.filter((o) => ['received', 'quote_requested', 'approved', 'in_progress'].includes(o.status)).length
  const low = products.filter((p) => p.stock <= p.lowStock)
  const customers = new Set(orders.map((o) => o.customerId)); const repeat = [...customers].filter((c) => orders.filter((o) => o.customerId === c).length > 1).length

  const months = [...Array(4)].map((_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (3 - i)); return { key: d.toISOString().slice(0, 7), label: d.toLocaleString('en-IN', { month: 'short' }) } })
  const monthly = months.map((m) => ({ month: m.label, revenue: paid.filter((o) => o.createdAt.startsWith(m.key)).reduce((s, o) => s + o.amount, 0) }))
  const byProduct = {}; paid.filter((o) => o.type === 'regular').forEach((o) => { byProduct[o.productId] = (byProduct[o.productId] || 0) + o.amount })
  const top = Object.entries(byProduct).map(([id, v]) => ({ name: (product(id)?.name || '').slice(0, 22) + '…', value: v })).sort((a, b) => b.value - a.value).slice(0, 5)
  const split = [{ name: 'Regular', value: paid.filter((o) => o.type === 'regular').reduce((s, o) => s + o.amount, 0) }, { name: 'Custom', value: paid.filter((o) => o.type === 'custom').reduce((s, o) => s + o.amount, 0) }]

  const Stat = ({ icon: I, label, value, sub, to, warn }) => (<Link to={to || '#'} className={`card p-4 flex gap-3 ${warn ? 'border-amber-300 bg-amber-50' : ''}`}><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${warn ? 'bg-amber-100 text-amber-700' : 'bg-terra-50 text-terra-700'}`}><I size={20}/></div><div><div className="text-xs text-stone-500">{label}</div><div className="text-xl font-bold">{value}</div>{sub && <div className="text-xs text-stone-500 truncate max-w-[140px]">{sub}</div>}</div></Link>)

  return (
    <div>
      <PageTitle>Namaste, {user.name.split(' ')[0]} 👋</PageTitle>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={IndianRupee} label="Total revenue" value={inr(revenue)} sub={`${paid.length} orders`} to="/dashboard/orders"/>
        <Stat icon={ClipboardList} label="Needs attention" value={pending} sub="open orders / quotes" to="/dashboard/orders"/>
        <Stat icon={AlertTriangle} label="Low stock" value={low.length} sub={low[0]?.name} to="/dashboard/products" warn={low.length > 0}/>
        <Stat icon={Users} label="Customers" value={customers.size} sub={`${repeat} repeat`} />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="card p-4 lg:col-span-2"><h3 className="font-semibold mb-2">Revenue – last 4 months</h3>
          <ResponsiveContainer width="100%" height={220}><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="month"/><YAxis tickFormatter={(v) => '₹' + v / 1000 + 'k'}/><Tooltip formatter={(v) => inr(v)}/><Line type="monotone" dataKey="revenue" stroke="#b5532d" strokeWidth={3} dot={{ r: 5 }}/></LineChart></ResponsiveContainer></div>
        <div className="card p-4"><h3 className="font-semibold mb-2">Regular vs Custom</h3>
          <ResponsiveContainer width="100%" height={220}><PieChart><Pie data={split} dataKey="value" innerRadius={50} outerRadius={80} label={(e) => e.name}>{split.map((_, i) => <Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip formatter={(v) => inr(v)}/></PieChart></ResponsiveContainer></div>
        <div className="card p-4 lg:col-span-2"><h3 className="font-semibold mb-2">Top products by revenue</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={top} layout="vertical" margin={{ left: 40 }}><XAxis type="number" tickFormatter={(v) => '₹' + v}/><YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }}/><Tooltip formatter={(v) => inr(v)}/><Bar dataKey="value" fill="#b5532d" radius={[0, 6, 6, 0]}/></BarChart></ResponsiveContainer></div>
        <div className="card p-4"><h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles size={16} className="text-terra-600"/>Recent activity</h3>
          <div className="space-y-2">{[...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((o) => (<Link to={`/dashboard/orders/${o.id}`} key={o.id} className="flex items-center gap-2 text-sm hover:bg-stone-50 rounded p-1"><div className="flex-1 min-w-0"><div className="truncate">{o.type === 'regular' ? product(o.productId)?.name : o.title}</div><div className="text-xs text-stone-500">{userById(o.customerId)?.name}</div></div><StatusBadge s={o.status}/></Link>))}</div></div>
      </div>
    </div>
  )
}
