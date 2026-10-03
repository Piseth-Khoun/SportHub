'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import { canOptimize } from '@/lib/images'

export interface ThumbProps {
  src?: string
  alt?: string
  sizes: string
  /** CSS aspect-ratio, e.g. "16/9". Defaults to 4/3. */
  ratio?: string
  priority?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Image with a graceful fallback. Hosts on the allow-list are optimized by
 * next/image; anything else renders as a plain lazy <img> so a stray URL from
 * the API can never crash a page.
 */
export function Thumb({ src, alt, sizes, ratio, priority = false, className, style }: ThumbProps) {
  const [failed, setFailed] = useState(false)
  const imageSrc = failed ? undefined : src || '/image/thumbnail.png'
  const rootStyle = {
    ...(ratio ? ({ ['--ratio' as string]: ratio } as CSSProperties) : {}),
    ...style,
  }

  if (!imageSrc) {
    return (
      <div
        className={['thumb', 'thumb--empty', className].filter(Boolean).join(' ')}
        style={rootStyle}
        aria-label={alt || 'No photo yet'}
        role="img"
      >
        <span>No photo yet</span>
      </div>
    )
  }

  return (
    <div className={['thumb', className].filter(Boolean).join(' ')} style={rootStyle}>
      {imageSrc.startsWith('/') || canOptimize(imageSrc) ? (
        <Image
          src={imageSrc}
          alt={alt || ''}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={alt || ''}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

export default Thumb
