'use client'

import { mergeByUuid } from '@/lib/catalog'
import { eventStory, sportStory } from '@/lib/stories'
import type { SportEvent, Sport } from '@/lib/types'
import { Card } from './Card'
import { useFavorites } from './FavoritesProvider'
import { EmptyState } from './States'

/** Joins the saved favorites with the catalog fetched on the server. */
export function FavoritesView({ sports, events }: { sports: Sport[]; events: SportEvent[] }) {
  const { ready, has, items } = useFavorites()

  if (!ready) return <p className="muted" role="status">Loading your favorites…</p>

  const savedSports = mergeByUuid(
    sports.filter((s) => has('sport', s.uuid)),
    items.flatMap((f) => (f.sport ? [f.sport] : [])),
  )
  const savedEvents = mergeByUuid(
    events.filter((e) => has('event', e.uuid)),
    items.flatMap((f) => (f.event ? [f.event] : [])),
  )

  if (savedSports.length + savedEvents.length === 0) {
    return (
      <EmptyState title="You haven't saved anything yet" action={{ href: '/sports', label: 'Browse sports' }}>
        Tap the heart on any sport or event to keep it here.
      </EmptyState>
    )
  }

  return (
    <>
      {savedSports.length > 0 && (
        <section className="section" aria-labelledby="fav-sports">
          <h2 id="fav-sports" className="section__title">Sports</h2>
          <div className="grid">
            {savedSports.map((s) => (
              <Card key={s.uuid} story={sportStory(s)} />
            ))}
          </div>
        </section>
      )}
      {savedEvents.length > 0 && (
        <section className="section" aria-labelledby="fav-events">
          <h2 id="fav-events" className="section__title">Events</h2>
          <div className="grid">
            {savedEvents.map((e) => (
              <Card key={e.uuid} story={eventStory(e)} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
