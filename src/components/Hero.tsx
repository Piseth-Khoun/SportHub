import Link from 'next/link'
import type { Story } from '@/lib/stories'
import { truncate } from '@/lib/url'
import { Thumb } from './Thumb'

/** Lead story on the left, headline rail on the right (the ESPN front-page pattern). */
export function Hero({ lead, rail }: { lead: Story; rail: Story[] }) {
  return (
    <section className="container hero" aria-labelledby="hero-title">
      <article className="hero__lead">
        <Link href={lead.href} className="hero__link">
          <Thumb src={lead.image} alt="" sizes="(min-width: 960px) 62vw, 100vw" ratio="16/9" priority />
          <span className="tag">{lead.tag}</span>
          <h1 id="hero-title" className="hero__title">
            {lead.title}
          </h1>
        </Link>
        {lead.summary && <p className="hero__text">{truncate(lead.summary, 220)}</p>}
        {lead.kind === 'event' && lead.meta && <p className="muted">{lead.meta}</p>}
      </article>

      {rail.length > 0 && (
        <aside className="rail" aria-labelledby="rail-title">
          <h2 id="rail-title" className="rail__title">
            Top picks
          </h2>
          <ul>
            {rail.map((story) => (
              <li key={`${story.kind}:${story.uuid}`}>
                <Link href={story.href} className="rail__item">
                  <span className="rail__thumb">
                    <Thumb src={story.image} alt="" sizes="96px" ratio="1/1" />
                  </span>
                  <span className="rail__text">
                    <span className="tag">{story.tag}</span>
                    <strong>{story.title}</strong>
                    <span className="muted">{story.meta}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  )
}
