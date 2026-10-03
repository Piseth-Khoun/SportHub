import Link from 'next/link'
import { hrefWith } from '@/lib/url'

interface PaginationProps {
  basePath: string
  page: number
  pages: number
  params?: Record<string, string>
}

export function Pagination({ basePath, page, pages, params = {} }: PaginationProps) {
  if (pages <= 1) return null
  const to = (n: number) => hrefWith(basePath, { ...params, page: n > 1 ? n : undefined })

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={to(page - 1)} rel="prev" className="btn btn--ghost">
          Previous
        </Link>
      ) : (
        <span />
      )}
      <span className="muted">
        Page {page} of {pages}
      </span>
      {page < pages ? (
        <Link href={to(page + 1)} rel="next" className="btn btn--ghost">
          Next
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
