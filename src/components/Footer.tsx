import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>Sport Hub. Sports, venues and events in one place.</p>
        <nav aria-label="Footer">
          <Link href="/sports">Sports</Link>
          <Link href="/events">Events</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/favorites">Favorites</Link>
        </nav>
      </div>
    </footer>
  )
}
