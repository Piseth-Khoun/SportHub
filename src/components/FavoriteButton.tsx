'use client'

import type { FavoriteKind } from '@/lib/types'
import { HeartIcon } from './icons'
import { useFavorites } from './FavoritesProvider'

interface FavoriteButtonProps {
  kind: FavoriteKind
  uuid: string
  name: string
  /** "icon" floats over card images; "labeled" is the full button used on detail pages. */
  variant?: 'icon' | 'labeled'
}

export function FavoriteButton({ kind, uuid, name, variant = 'icon' }: FavoriteButtonProps) {
  const { ready, has, busy, toggle } = useFavorites()
  const active = has(kind, uuid)

  return (
    <button
      type="button"
      className={variant === 'icon' ? 'fav' : 'btn btn--ghost fav-labeled'}
      aria-pressed={active}
      aria-label={`Save ${name} to favorites`}
      disabled={!ready || busy(kind, uuid)}
      onClick={() => void toggle(kind, uuid)}
    >
      <HeartIcon filled={active} />
      {variant === 'labeled' && <span>{active ? 'Saved' : 'Save'}</span>}
    </button>
  )
}
