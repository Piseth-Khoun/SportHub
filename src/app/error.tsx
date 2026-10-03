'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container state">
      <h1>We couldn&apos;t load this page</h1>
      <p>The Sport API may be unreachable. Check your connection and try again.</p>
      <button type="button" className="btn btn--primary" onClick={reset}>
        Try again
      </button>
    </div>
  )
}
