import Link from 'next/link'

export function EmptyState({ title, children, action }: { title: string; children?: string; action?: { href: string; label: string } }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action && (
        <Link href={action.href} className="btn btn--primary">
          {action.label}
        </Link>
      )}
    </div>
  )
}

export function ApiNotice() {
  return (
    <div className="container">
      <p className="notice" role="status">
        Some content could not be loaded from the Sport API. Check <code>API_BASE_URL</code> in your environment and
        reload the page.
      </p>
    </div>
  )
}
