import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Comments } from '@/components/Comments'
import { FavoriteButton } from '@/components/FavoriteButton'
import { PinIcon } from '@/components/icons'
import { Thumb } from '@/components/Thumb'
import { comments, events } from '@/lib/services'
import { truncate } from '@/lib/url'

type Props = { params: Promise<{ uuid: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params
  const event = await events.get(uuid).catch(() => null)
  if (!event) return { title: 'Event not found' }
  return {
    title: event.name,
    description: truncate(event.description, 160),
    openGraph: { images: event.imageUrls.slice(0, 1) },
  }
}

function mapUrls(lat: number, lon: number) {
  const bbox = [lon - 0.008, lat - 0.005, lon + 0.008, lat + 0.005].map((n) => n.toFixed(5)).join('%2C')
  return {
    embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`,
    directions: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
  }
}

export default async function EventPage({ params }: Props) {
  const { uuid } = await params
  const [event, initialComments] = await Promise.all([events.get(uuid), comments.byEvent(uuid).catch(() => [])])
  if (!event) notFound()

  const [cover, ...gallery] = event.imageUrls
  const map = event.latitude !== null && event.longitude !== null ? mapUrls(event.latitude, event.longitude) : null

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/events">Events</Link>
        <span aria-hidden="true">/</span>
        <span>{event.name}</span>
      </nav>

      <article className="detail">
        <div className="detail__media">
          <Thumb src={cover} alt={event.name} sizes="(min-width: 960px) 60vw, 100vw" ratio="16/9" priority />
          {gallery.length > 0 && (
            <ul className="gallery">
              {gallery.map((src) => (
                <li key={src}>
                  <Thumb src={src} alt={`${event.name} photo`} sizes="(min-width: 960px) 20vw, 33vw" ratio="4/3" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail__body">
          {event.categoryName && (
            <Link href={`/events?category=${encodeURIComponent(event.categoryName)}`} className="tag">
              {event.categoryName}
            </Link>
          )}
          <h1>{event.name}</h1>
          {event.locationName && (
            <p className="detail__place">
              <PinIcon /> {event.locationName}
            </p>
          )}
          {event.description && <p className="detail__text">{event.description}</p>}
          <div className="detail__actions">
            <FavoriteButton kind="event" uuid={event.uuid} name={event.name} variant="labeled" />
            {map && (
              <a href={map.directions} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
            )}
          </div>
        </div>
      </article>

      {map && (
        <section className="section" aria-labelledby="map-title">
          <h2 id="map-title" className="section__title">
            Location
          </h2>
          <iframe className="map" title={`Map of ${event.locationName || event.name}`} src={map.embed} loading="lazy" />
        </section>
      )}

      <Comments eventUuid={event.uuid} initial={initialComments} />
    </div>
  )
}
