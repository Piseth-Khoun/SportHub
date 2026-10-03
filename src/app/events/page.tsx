import type { Metadata } from 'next'
import { Card } from '@/components/Card'
import { CategoryTabs } from '@/components/CategoryTabs'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/States'
import { categoryNames, inCategory, matchesQuery, paginate } from '@/lib/catalog'
import { categories, events } from '@/lib/services'
import { eventStory } from '@/lib/stories'
import { first, parsePage, type SearchParams } from '@/lib/url'

export const metadata: Metadata = { title: 'Events', description: 'Find venues and events near you.' }

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = first(params.q).trim()
  const category = first(params.category).trim()

  const [all, cats] = await Promise.all([events.list(), categories.list().catch(() => [])])
  const filtered = all.filter(
    (e) =>
      (!category || inCategory(e, category)) &&
      (!q || matchesQuery(e, q) || e.locationName.toLowerCase().includes(q.toLowerCase())),
  )
  const view = paginate(filtered, parsePage(first(params.page)))

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Events</h1>
        <form action="/events" role="search" className="filter">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="q" className="sr-only">
            Search events
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search events or places" />
          <button type="submit" className="btn btn--primary">
            Search
          </button>
        </form>
      </header>

      <CategoryTabs basePath="/events" names={categoryNames(cats, all)} active={category} query={q} />

      {view.items.length === 0 ? (
        <EmptyState title="No events match your search" action={{ href: '/events', label: 'Clear filters' }}>
          Try a different keyword or category.
        </EmptyState>
      ) : (
        <>
          <p className="muted" aria-live="polite">
            {view.total} {view.total === 1 ? 'event' : 'events'}
          </p>
          <div className="grid">
            {view.items.map((event) => (
              <Card key={event.uuid} story={eventStory(event)} />
            ))}
          </div>
          <Pagination basePath="/events" page={view.page} pages={view.pages} params={{ q, category }} />
        </>
      )}
    </div>
  )
}
