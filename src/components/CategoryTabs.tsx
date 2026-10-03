import Link from 'next/link'
import { hrefWith } from '@/lib/url'

interface CategoryTabsProps {
  basePath: string
  names: string[]
  active: string
  query?: string
}

/** Plain links, so filtering needs no client JavaScript. */
export function CategoryTabs({ basePath, names, active, query }: CategoryTabsProps) {
  if (names.length === 0) return null
  const current = active.toLowerCase()
  return (
    <nav className="tabs" aria-label="Filter by category">
      <Link href={hrefWith(basePath, { q: query })} className="tab" aria-current={current === '' ? 'true' : undefined}>
        All
      </Link>
      {names.map((name) => (
        <Link
          key={name}
          href={hrefWith(basePath, { category: name, q: query })}
          className="tab"
          aria-current={current === name.toLowerCase() ? 'true' : undefined}
        >
          {name}
        </Link>
      ))}
    </nav>
  )
}
