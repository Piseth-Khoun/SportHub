export default function Loading() {
  return (
    <div className="container section" aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton--title" />
      <div className="grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skeleton skeleton--card" />
        ))}
      </div>
    </div>
  )
}
