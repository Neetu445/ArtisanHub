import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'

export default function Login() {
  const { login, signup } = useStore(); const nav = useNavigate(); const [sp] = useSearchParams()
  const [mode, setMode] = useState('login'); const [err, setErr] = useState('')
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'customer', craft: '', location: '' })
  const go = (u) => nav(sp.get('next') || (u.role === 'artisan' ? '/dashboard' : '/'))
  const [busy, setBusy] = useState(false)
  const submit = async (e) => { e.preventDefault(); setErr(''); setBusy(true); try { go(await (mode === 'login' ? login(f.email, f.password) : signup(f))) } catch (ex) { setErr(ex.message) } finally { setBusy(false) } }
  const quick = async (email) => { setErr(''); setBusy(true); try { go(await login(email, 'demo123')) } catch (ex) { setErr(ex.message) } finally { setBusy(false) } }
  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <div className="flex gap-2 mb-5">{['login', 'signup'].map((m) => <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === m ? 'bg-terra-600 text-white' : 'bg-stone-100'}`}>{m === 'login' ? 'Sign in' : 'Create account'}</button>)}</div>
        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (<>
            <div className="grid grid-cols-2 gap-2">{['customer', 'artisan'].map((r) => <button type="button" key={r} onClick={() => setF({ ...f, role: r })} className={`py-2 rounded-lg border text-sm capitalize ${f.role === r ? 'border-terra-600 bg-terra-50 text-terra-700' : 'border-stone-300'}`}>I am a {r}</button>)}</div>
            <div><label className="label">Full name</label><input required className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}/></div>
            {f.role === 'artisan' && (<div className="grid grid-cols-2 gap-2"><div><label className="label">Craft</label><input className="input" placeholder="Pottery" value={f.craft} onChange={(e) => setF({ ...f, craft: e.target.value })}/></div><div><label className="label">Location</label><input className="input" placeholder="Varanasi" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })}/></div></div>)}
          </>)}
          <div><label className="label">Email</label><input required type="email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}/></div>
          <div><label className="label">Password</label><input required type="password" className="input" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })}/></div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button disabled={busy} className="btn-primary w-full justify-center">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
      </div>
      <div className="card p-4 mt-4">
        <div className="text-xs font-medium text-stone-500 mb-2">DEMO ACCOUNTS (password: demo123)</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button onClick={() => quick('rahul@artisan.com')} className="btn-outline justify-center">Rahul · Potter</button>
          <button onClick={() => quick('saira@artisan.com')} className="btn-outline justify-center">Saira · Weaver</button>
          <button onClick={() => quick('priya@customer.com')} className="btn-ghost border justify-center">Priya · Customer</button>
          <button onClick={() => quick('arjun@customer.com')} className="btn-ghost border justify-center">Arjun · Customer</button>
        </div>
      </div>
    </div>
  )
}
