import Link from 'next/link'
import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  href?: string
  linkLabel?: string
  children: ReactNode
}

export function Section({ title, href, linkLabel, children }: SectionProps) {
  return (
    <section className="container section">
      <header className="section__head">
        <h2 className="section__title">{title}</h2>
        {href && <Link href={href}>{linkLabel ?? 'View all'}</Link>}
      </header>
      {children}
    </section>
  )
}
