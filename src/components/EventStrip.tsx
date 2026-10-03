import Link from 'next/link'
import type { SportEvent } from '@/lib/types'

/** Horizontally scrolling event ticker, the equivalent of ESPN's scoreboard strip. */
export function EventStrip({ events }: { events: SportEvent[] }) {
  if (events.length === 0) return null
  return (
    <section className="strip" aria-label="Events">
      <div className="container strip__inner">
        <h2 className="strip__title">Events</h2>
        <ul className="strip__list">
          {events.map((event) => (
            <li key={event.uuid} className="strip__item">
              <Link href={`/events/${event.uuid}`}>
                <span className="tag">{event.categoryName || 'Event'}</span>
                <strong>{event.name}</strong>
                <span className="muted">{event.locationName}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
