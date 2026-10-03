'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { errorMessage } from '@/lib/http'
import { favorites as favoritesApi } from '@/lib/services'
import type { Favorite, FavoriteKind } from '@/lib/types'

interface FavoritesContext {
  ready: boolean
  count: number
  items: Favorite[]
  has: (kind: FavoriteKind, uuid: string) => boolean
  busy: (kind: FavoriteKind, uuid: string) => boolean
  toggle: (kind: FavoriteKind, uuid: string) => Promise<void>
}

const Context = createContext<FavoritesContext | null>(null)
const keyOf = (kind: FavoriteKind, uuid: string) => `${kind}:${uuid}`

/** Optimistic favorites store shared by every card, the nav badge and /favorites. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Favorite[]>([])
  const [ready, setReady] = useState(false)
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setItems(await favoritesApi.list())
    } catch (err) {
      setError(errorMessage(err, 'Could not load your favorites.'))
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  // Toasts clear themselves.
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(null), 5_000)
    return () => clearTimeout(timer)
  }, [error])

  const index = useMemo(() => {
    const map = new Map<string, Favorite>()
    for (const item of items) {
      if (item.sportUuid) map.set(keyOf('sport', item.sportUuid), item)
      if (item.eventUuid) map.set(keyOf('event', item.eventUuid), item)
    }
    return map
  }, [items])

  const toggle = useCallback(
    async (kind: FavoriteKind, uuid: string) => {
      const key = keyOf(kind, uuid)
      if (pending.has(key)) return
      const existing = index.get(key)

      setPending((prev) => new Set(prev).add(key))
      setError(null)
      try {
        if (existing) {
          setItems((prev) => prev.filter((item) => item !== existing))
          await favoritesApi.remove(existing.uuid)
        } else {
          const placeholder: Favorite = {
            uuid: '',
            sportUuid: kind === 'sport' ? uuid : '',
            eventUuid: kind === 'event' ? uuid : '',
            sport: null,
            event: null,
          }
          setItems((prev) => [...prev, placeholder])
          await favoritesApi.add({ sportUuid: placeholder.sportUuid, eventUuid: placeholder.eventUuid })
          await load() // swap the placeholder for the real record (and its uuid)
        }
      } catch (err) {
        await load() // resync with the server rather than guess what was saved
        setError(errorMessage(err, 'Could not update your favorites.'))
      } finally {
        setPending((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      }
    },
    [index, load, pending],
  )

  const value = useMemo<FavoritesContext>(
    () => ({
      ready,
      items,
      count: index.size,
      has: (kind, uuid) => index.has(keyOf(kind, uuid)),
      busy: (kind, uuid) => pending.has(keyOf(kind, uuid)),
      toggle,
    }),
    [ready, items, index, pending, toggle],
  )

  return (
    <Context.Provider value={value}>
      {children}
      {error && (
        <p className="toast" role="alert">
          {error}
        </p>
      )}
    </Context.Provider>
  )
}

export function useFavorites(): FavoritesContext {
  const context = useContext(Context)
  if (!context) throw new Error('useFavorites must be used inside <FavoritesProvider>')
  return context
}
