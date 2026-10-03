import type { Category, Comment, Favorite, Sport, SportEvent } from './types'

/**
 * The API's response envelope isn't documented in the Postman collection, so
 * every payload goes through these tolerant helpers: plain arrays, `{ data }`,
 * `{ content }` (Spring pages), `{ items }`, etc. all resolve to the same shape.
 */

type Rec = Record<string, unknown>

const rec = (value: unknown): Rec | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Rec) : null

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

const num = (value: unknown): number | null => {
  const n = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v !== '') : []

const ENVELOPE_KEYS = ['data', 'content', 'items', 'results', 'records'] as const

export function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  const root = rec(payload)
  if (!root) return []
  for (const key of ENVELOPE_KEYS) {
    const value = root[key]
    if (Array.isArray(value)) return value
    const nested = rec(value)
    if (nested) {
      const inner = unwrapList(nested)
      if (inner.length) return inner
    }
  }
  return []
}

export function unwrapItem(payload: unknown): unknown {
  const root = rec(payload)
  if (!root || 'uuid' in root || 'id' in root) return payload
  for (const key of ['data', 'content', 'item', 'result']) {
    const nested = rec(root[key])
    if (nested) return nested
  }
  return root
}

function images(r: Rec): string[] {
  const list = strings(r.imageUrls ?? r.images)
  const single = str(r.imageUrl ?? r.image)
  return list.length ? list : single ? [single] : []
}

function categoryName(r: Rec): string {
  return str(r.categoryName) || str(rec(r.category)?.name) || str(r.category)
}

export function parseSport(raw: unknown): Sport | null {
  const r = rec(raw)
  const uuid = r && str(r.uuid ?? r.id)
  if (!r || !uuid) return null
  return {
    uuid,
    name: str(r.name) || 'Untitled sport',
    description: str(r.description),
    imageUrls: images(r),
    categoryName: categoryName(r),
  }
}

export function parseEvent(raw: unknown): SportEvent | null {
  const r = rec(raw)
  const uuid = r && str(r.uuid ?? r.id)
  if (!r || !uuid) return null
  return {
    uuid,
    name: str(r.name) || 'Untitled event',
    description: str(r.description),
    imageUrls: images(r),
    categoryName: categoryName(r),
    locationName: str(r.locationName ?? r.location),
    latitude: num(r.latitude ?? r.lat),
    longitude: num(r.longitude ?? r.lng ?? r.lon),
  }
}

export function parseCategory(raw: unknown): Category | null {
  const r = rec(raw)
  const uuid = r && str(r.uuid ?? r.id)
  if (!r || !uuid) return null
  return { uuid, name: str(r.name) || 'Untitled category', description: str(r.description) }
}

export function parseComment(raw: unknown): Comment | null {
  const r = rec(raw)
  const uuid = r && str(r.uuid ?? r.id)
  if (!r || !uuid) return null
  return {
    uuid,
    eventUuid: str(r.eventUuid ?? rec(r.event)?.uuid),
    text: str(r.comment ?? r.content ?? r.text),
    createdAt: str(r.createdAt ?? r.created_at ?? r.createdDate),
  }
}

export function parseFavorite(raw: unknown): Favorite | null {
  const r = rec(raw)
  const uuid = r && str(r.uuid ?? r.id)
  if (!r || !uuid) return null
  const sport = parseSport(r.sport)
  const event = parseEvent(r.event)
  return {
    uuid,
    sportUuid: str(r.sportUuid) || sport?.uuid || '',
    eventUuid: str(r.eventUuid) || event?.uuid || '',
    sport,
    event,
  }
}
