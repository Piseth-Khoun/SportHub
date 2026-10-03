import { Card } from '@/components/Card'
import { EventStrip } from '@/components/EventStrip'
import { Hero } from '@/components/Hero'
import { Section } from '@/components/Section'
import { ApiNotice, EmptyState } from '@/components/States'
import { loadHome } from '@/lib/services'
import { eventStory, sportStory } from '@/lib/stories'
import Link from 'next/link'

// Static HTML refreshed in the background. Must be a literal (Next.js reads it at build time).
export const revalidate = 60

export default async function HomePage() {
  const { sports, events, categories, failed } = await loadHome()
  const stories = [...events.map(eventStory), ...sports.map(sportStory)]
  const [lead, ...others] = stories

  if (!lead) {
    return failed ? (
      <ApiNotice />
    ) : (
      <EmptyState title="Nothing here yet">Add sports and events through the API and they will appear on this page.</EmptyState>
    )
  }

  return (
    <>
      <EventStrip events={events.slice(0, 12)} />
      {failed && <ApiNotice />}
      <Hero lead={lead} rail={others.slice(0, 5)} />

      {sports.length > 0 && (
        <Section title="Sports" href="/sports" linkLabel="View all sports">
          <div className="grid">
            {sports.slice(0, 8).map((sport) => (
              <Card key={sport.uuid} story={sportStory(sport)} />
            ))}
          </div>
        </Section>
      )}

      {categories.length > 0 && (
        <Section title="Categories" href="/categories" linkLabel="All categories">
          <nav className="tabs" aria-label="Browse categories">
            {categories.map((category) => (
              <Link key={category.uuid} href={`/sports?category=${encodeURIComponent(category.name)}`} className="tab">
                {category.name}
              </Link>
            ))}
          </nav>
        </Section>
      )}

      {events.length > 0 && (
        <Section title="Events" href="/events" linkLabel="View all events">
          <div className="grid">
            {events.slice(0, 6).map((event) => (
              <Card key={event.uuid} story={eventStory(event)} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
