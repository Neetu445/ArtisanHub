import { useStore } from '../lib/store'
import { ArtisanCard, PageTitle } from '../components/ui'
export default function Artisans() {
  const { db } = useStore()
  return (<div><PageTitle>Artisans</PageTitle><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{db.artisans.map((a) => <ArtisanCard key={a.id} a={a}/>)}</div></div>)
}
