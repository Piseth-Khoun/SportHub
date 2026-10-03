import type { Metadata } from 'next'
import { FavoritesView } from '@/components/FavoritesView'
import { events, sports } from '@/lib/services'

export const metadata: Metadata = { title: 'Favorites' }
export const revalidate = 60

export default async function FavoritesPage() {
  const [allSports, allEvents] = await Promise.all([sports.list().catch(() => []), events.list().catch(() => [])])

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Favorites</h1>
      </header>
      <FavoritesView sports={allSports} events={allEvents} />
    </div>
  )
}
