import type { NextConfig } from 'next'

// Single source of truth for which image hosts are optimized. The same list is
// exposed to the client (see src/lib/images.ts) so unknown hosts fall back to a
// plain <img> instead of crashing next/image.
const imageHosts = (
  process.env.IMAGE_HOSTS ?? 'sport-hub.eunglyzhia.social,*.eunglyzhia.social,*.eunglyzhia.com'
)
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean)

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_IMAGE_HOSTS: imageHosts.join(',') },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: imageHosts.map((hostname) => ({ protocol: 'https' as const, hostname })),
  },
}

export default nextConfig
