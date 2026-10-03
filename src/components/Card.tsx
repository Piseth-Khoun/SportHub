import Link from 'next/link'
import type { Story } from '@/lib/stories'
import { PinIcon } from './icons'
import { FavoriteButton } from './FavoriteButton'
import { Thumb } from './Thumb'

const SIZES = '(min-width: 1100px) 290px, (min-width: 640px) 33vw, 100vw'

/** One card for sports and events. The title link is stretched over the card via CSS. */
export function Card({ story, priority = false }: { story: Story; priority?: boolean }) {
  return (
    <article className="card">
      <div className="card__media">
        <Thumb src={story.image} alt="" sizes={SIZES} priority={priority} />
        <FavoriteButton kind={story.kind} uuid={story.uuid} name={story.title} />
      </div>
      <div className="card__body">
        <span className="tag">{story.tag}</span>
        <h3 className="card__title">
          <Link href={story.href} className="card__link">
            {story.title}
          </Link>
        </h3>
        {story.summary && <p className="card__text">{story.summary}</p>}
        {story.kind === 'event' && story.meta && (
          <p className="card__meta">
            <PinIcon /> {story.meta}
          </p>
        )}
      </div>
    </article>
  )
}
