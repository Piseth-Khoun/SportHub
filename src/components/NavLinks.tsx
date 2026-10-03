'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFavorites } from './FavoritesProvider'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/sports', label: 'Sports' },
  { href: '/events', label: 'Events' },
  { href: '/categories', label: 'Categories' },
  { href: '/favorites', label: 'Favorites' },
] as const

export function NavLinks() {
  const pathname = usePathname()
  const { count } = useFavorites()

  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined}>
            {label}
            {href === '/favorites' && count > 0 && <span className="badge">{count}</span>}
          </Link>
        )
      })}
    </nav>
  )
}
