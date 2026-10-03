/**
 * Decides whether an image URL can go through next/image. Hosts come from
 * IMAGE_HOSTS in next.config.ts, so there is one list to maintain.
 */
const patterns = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '').split(',').filter(Boolean)

function hostMatches(host: string, pattern: string): boolean {
  if (pattern.startsWith('**.')) return host.endsWith(pattern.slice(2))
  if (pattern.startsWith('*.')) {
    const suffix = pattern.slice(1)
    return host.endsWith(suffix) && !host.slice(0, -suffix.length).includes('.')
  }
  return host === pattern
}

export function canOptimize(src: string): boolean {
  try {
    const url = new URL(src)
    return url.protocol === 'https:' && patterns.some((pattern) => hostMatches(url.hostname, pattern))
  } catch {
    return false
  }
}
