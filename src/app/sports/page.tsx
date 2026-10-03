import type { Metadata } from 'next'
import { Card } from '@/components/Card'
import { CategoryTabs } from '@/components/CategoryTabs'
import { Pagination } from '@/components/Pagination'
import { EmptyState } from '@/components/States'
import { categoryNames, inCategory, matchesQuery, paginate } from '@/lib/catalog'
import { categories, sports } from '@/lib/services'
import { sportStory } from '@/lib/stories'
import { first, parsePage, type SearchParams } from '@/lib/url'

export const metadata: Metadata = { title: 'Sports', description: 'Browse every sport, filter by category and search by name.' }

export default async function SportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = first(params.q).trim()
  const category = first(params.category).trim()

  const [all, cats] = await Promise.all([sports.list(), categories.list().catch(() => [])])
  const filtered = all.filter((s) => (!category || inCategory(s, category)) && (!q || matchesQuery(s, q)))
  const view = paginate(filtered, parsePage(first(params.page)))

  return (
    <div className="container page">
      <header className="page__head">
        <h1>Sports</h1>
        <form action="/sports" role="search" className="filter">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="q" className="sr-only">
            Search sports
          </label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search sports" />
          <button type="submit" className="btn btn--primary">
            Search
          </button>
        </form>
      </header>

      <CategoryTabs basePath="/sports" names={categoryNames(cats, all)} active={category} query={q} />

      {view.items.length === 0 ? (
        <EmptyState title="No sports match your search" action={{ href: '/sports', label: 'Clear filters' }}>
          Try a different keyword or category.
        </EmptyState>
      ) : (
        <>
          <p className="muted" aria-live="polite">
            {view.total} {view.total === 1 ? 'sport' : 'sports'}
          </p>
          <div className="grid">
            {view.items.map((sport) => (
              <Card key={sport.uuid} story={sportStory(sport)} />
            ))}
          </div>
          <Pagination basePath="/sports" page={view.page} pages={view.pages} params={{ q, category }} />
        </>
      )}
    </div>
  )
}
