import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { SearchIcon } from './icons'
import { NavLinks } from './NavLinks'

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="brand">
          <span className="brand__mark" aria-hidden="true">
            S
          </span>
          Sport Hub
        </Link>
        <NavLinks />
        <form action="/sports" role="search" className="search">
          <label htmlFor="site-search" className="sr-only">
            Search sports
          </label>
          <input id="site-search" name="q" type="search" placeholder="Search sports" autoComplete="off" />
          <button type="submit" aria-label="Search">
            <SearchIcon />
          </button>
        </form>
        <ThemeToggle />
      </div>
    </header>
  )
}
