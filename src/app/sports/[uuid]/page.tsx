import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card } from '@/components/Card'
import { FavoriteButton } from '@/components/FavoriteButton'
import { Thumb } from '@/components/Thumb'
import { inCategory } from '@/lib/catalog'
import { sports } from '@/lib/services'
import { sportStory } from '@/lib/stories'
import { truncate } from '@/lib/url'

type Props = { params: Promise<{ uuid: string }> }

// Identical fetches in one render pass are memoized by Next.js, so calling
// sports.get() here and in the page costs a single upstream request.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params
  const sport = await sports.get(uuid).catch(() => null)
  if (!sport) return { title: 'Sport not found' }
  return {
    title: sport.name,
    description: truncate(sport.description, 160),
    openGraph: { images: sport.imageUrls.slice(0, 1) },
  }
}

export default async function SportPage({ params }: Props) {
  const { uuid } = await params
  const sport = await sports.get(uuid)
  if (!sport) notFound()

  const [cover, ...gallery] = sport.imageUrls
  const related = sport.categoryName
    ? (await sports.list().catch(() => []))
        .filter((s) => s.uuid !== sport.uuid && inCategory(s, sport.categoryName))
        .slice(0, 4)
    : []

  return (
    <div className="container page">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/sports">Sports</Link>
        <span aria-hidden="true">/</span>
        <span>{sport.name}</span>
      </nav>

      <article className="detail">
        <div className="detail__media">
          <Thumb src={cover} alt={sport.name} sizes="(min-width: 960px) 60vw, 100vw" ratio="16/9" priority />
          {gallery.length > 0 && (
            <ul className="gallery">
              {gallery.map((src) => (
                <li key={src}>
                  <Thumb src={src} alt={`${sport.name} photo`} sizes="(min-width: 960px) 20vw, 33vw" ratio="4/3" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="detail__body">
          {sport.categoryName && (
            <Link href={`/sports?category=${encodeURIComponent(sport.categoryName)}`} className="tag">
              {sport.categoryName}
            </Link>
          )}
          <h1>{sport.name}</h1>
          {sport.description && <p className="detail__text">{sport.description}</p>}
          <FavoriteButton kind="sport" uuid={sport.uuid} name={sport.name} variant="labeled" />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section" aria-labelledby="related-title">
          <h2 id="related-title" className="section__title">
            More in {sport.categoryName}
          </h2>
          <div className="grid">
            {related.map((item) => (
              <Card key={item.uuid} story={sportStory(item)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
