import { EmptyState } from '@/components/States'

export default function NotFound() {
  return (
    <div className="container">
      <EmptyState title="We couldn't find that page" action={{ href: '/', label: 'Back to home' }}>
        The link may be outdated, or the item was removed.
      </EmptyState>
    </div>
  )
}
