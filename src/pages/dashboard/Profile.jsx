import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { PageTitle } from '../../components/ui'
import { toDataUrl } from '../../lib/gemini'

export default function Profile() {
  const { myArtisan, updateArtisan } = useStore()
  const a = myArtisan(); const [f, setF] = useState({ ...a }); const [saved, setSaved] = useState(false)
  const pick = (k) => async (e) => { const file = e.target.files[0]; if (file) setF({ ...f, [k]: await toDataUrl(file) }) }
  const save = (e) => { e.preventDefault(); Promise.resolve(updateArtisan(a.id, f)).then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }).catch((ex) => alert(ex.message)) }
  return (
    <div className="max-w-2xl">
      <PageTitle right={<Link to={`/artisan/${a.id}`} className="btn-outline text-sm">View public storefront</Link>}>My Storefront</PageTitle>
      <form onSubmit={save} className="card p-5 space-y-4">
        <div className="relative h-36 rounded-xl overflow-hidden bg-stone-200"><img src={f.cover} className="w-full h-full object-cover" alt=""/><label className="absolute bottom-2 right-2 btn bg-white/90 text-xs py-1 cursor-pointer">Change cover<input type="file" accept="image/*" className="hidden" onChange={pick('cover')}/></label></div>
        <div className="flex items-center gap-4 -mt-12 ml-4"><img src={f.avatar} className="w-20 h-20 rounded-full border-4 border-white object-cover" alt=""/><label className="btn-ghost text-xs cursor-pointer mt-8">Change photo<input type="file" accept="image/*" className="hidden" onChange={pick('avatar')}/></label></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="label">Name</label><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}/></div>
          <div><label className="label">Craft</label><input className="input" value={f.craft} onChange={(e) => setF({ ...f, craft: e.target.value })}/></div>
          <div><label className="label">Location</label><input className="input" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })}/></div>
          <div><label className="label">Years of experience</label><input type="number" className="input" value={f.yearsExp} onChange={(e) => setF({ ...f, yearsExp: +e.target.value })}/></div>
        </div>
        <div><label className="label">Your story</label><textarea rows={3} className="input" value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })}/></div>
        <div><label className="label">Your process</label><textarea rows={3} className="input" value={f.process} onChange={(e) => setF({ ...f, process: e.target.value })}/></div>
        <div className="flex items-center gap-3"><button className="btn-primary">Save</button>{saved && <span className="text-sm text-green-700">Saved ✓</span>}</div>
      </form>
    </div>
  )
}
