'use client'

import Image from 'next/image'
import { useState, type CSSProperties } from 'react'
import { canOptimize } from '@/lib/images'

interface ThumbProps {
  src?: string
  alt: string
  sizes: string
  /** CSS aspect-ratio, e.g. "16/9". Defaults to 4/3. */
  ratio?: string
  priority?: boolean
}

/**
 * Image with a graceful fallback. Hosts on the allow-list are optimized by
 * next/image; anything else renders as a plain lazy <img> so a stray URL from
 * the API can never crash a page.
 */
export function Thumb({ src, alt, sizes, ratio, priority = false }: ThumbProps) {
  const [failed, setFailed] = useState(false)
  const style = ratio ? ({ '--ratio': ratio } as CSSProperties) : undefined

  if (!src || failed) {
    return (
      <div className="thumb thumb--empty" style={style} aria-hidden="true">
        <span>No photo yet</span>
      </div>
    )
  }

  return (
    <div className="thumb" style={style}>
      {canOptimize(src) ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
