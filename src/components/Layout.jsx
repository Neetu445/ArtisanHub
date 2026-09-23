import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Store, Sparkles, Package, ClipboardList, MessageSquare, BarChart3, LogOut, Search, ShoppingBag, User, Languages, Palette } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Layout() {
  const { user, logout, lang, setLang, isLive, ready } = useStore()
  const nav = useNavigate()
  const doLogout = async () => { await logout(); nav('/') }
  const isArtisan = user?.role === 'artisan'
  const links = isArtisan
    ? [ ['/dashboard', BarChart3, 'Dashboard'], ['/dashboard/products', Package, 'Products'], ['/dashboard/orders', ClipboardList, 'Orders'], ['/dashboard/messages', MessageSquare, 'Messages'], ['/dashboard/profile', User, 'Storefront'] ]
    : [ ['/', Search, 'Discover'], ['/artisans', Palette, 'Artisans'], ['/custom', Sparkles, 'Custom Order'], ...(user ? [['/orders', ShoppingBag, 'My Orders'], ['/messages', MessageSquare, 'Messages']] : []) ]
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to={isArtisan ? '/dashboard' : '/'} className="flex items-center gap-2 font-serif text-xl font-bold text-terra-700"><Store size={22}/> ArtisanHub</Link>
          <span className={`badge hidden sm:inline ${isLive ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{isLive ? '● Supabase' : 'demo'}</span>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {links.map(([to, Icon, label]) => (
              <NavLink key={to} to={to} end={to === '/' || to === '/dashboard'} className={({isActive}) => `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${isActive ? 'bg-terra-50 text-terra-700 font-medium' : 'text-stone-600 hover:bg-stone-100'}`}><Icon size={16}/>{label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="btn-ghost text-sm px-2" title="Toggle description language"><Languages size={16}/>{lang === 'en' ? 'हिंदी' : 'EN'}</button>
            {user ? (<>
              <span className="hidden sm:block text-sm text-stone-600">{user.name} <span className="badge bg-stone-100 text-stone-600 ml-1">{user.role}</span></span>
              <button onClick={doLogout} className="btn-ghost text-sm px-2"><LogOut size={16}/></button>
            </>) : <Link to="/login" className="btn-primary text-sm py-1.5">Sign in</Link>}
          </div>
        </div>
        <nav className="md:hidden flex overflow-x-auto border-t border-stone-100 px-2">
          {links.map(([to, Icon, label]) => (
            <NavLink key={to} to={to} end={to === '/' || to === '/dashboard'} className={({isActive}) => `flex items-center gap-1 px-3 py-2 text-xs whitespace-nowrap ${isActive ? 'text-terra-700 border-b-2 border-terra-600' : 'text-stone-600'}`}><Icon size={14}/>{label}</NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">{ready ? <Outlet/> : <div className="p-10 text-center text-stone-500">Loading…</div>}</main>
      <footer className="text-center text-xs text-stone-400 py-4">ArtisanHub · Empowering India's artisans – from Varanasi to Kutch, Madhubani to Channapatna</footer>
    </div>
  )
}
