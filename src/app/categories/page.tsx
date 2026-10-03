import type { Metadata } from 'next'
import Link from 'next/link'
import { EmptyState } from '@/components/States'
import { inCategory } from '@/lib/catalog'
import { categories, events, sports } from '@/lib/services'

export const metadata: Metadata = { title: 'Categories', description: 'Every sport category, with the sports and events in each.' }

// Rendered per request so `next build` never depends on the API being reachable.
// API data is still cached by fetch (see REVALIDATE_SECONDS), so this stays cheap.
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const [cats, allSports, allEvents] = await Promise.all([
    categories.list(),
    sports.list().catch(() => []),
    events.list().catch(() => []),
  ])

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Categories</h1>
      </header>

      {cats.length === 0 ? (
        <EmptyState title="No categories yet">Categories created through the API will show up here.</EmptyState>
      ) : (
        <ul className="grid grid--wide">
          {cats.map((cat) => {
            const sportCount = allSports.filter((s) => inCategory(s, cat.name)).length
            const eventCount = allEvents.filter((e) => inCategory(e, cat.name)).length
            const q = encodeURIComponent(cat.name)
            return (
              <li key={cat.uuid} className="category">
                <h2>{cat.name}</h2>
                {cat.description && <p className="card__text">{cat.description}</p>}
                <p className="category__links">
                  <Link href={`/sports?category=${q}`}>
                    {sportCount} {sportCount === 1 ? 'sport' : 'sports'}
                  </Link>
                  <Link href={`/events?category=${q}`}>
                    {eventCount} {eventCount === 1 ? 'event' : 'events'}
                  </Link>
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
