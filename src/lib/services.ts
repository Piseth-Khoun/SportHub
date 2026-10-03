import { ApiError, request } from './http'
import {
  parseCategory,
  parseComment,
  parseEvent,
  parseFavorite,
  parseSport,
  unwrapItem,
  unwrapList,
} from './normalize'
import type {
  Category,
  CategoryInput,
  Comment,
  CommentInput,
  EventInput,
  Favorite,
  FavoriteInput,
  Sport,
  SportEvent,
  SportInput,
} from './types'

/**
 * Generic CRUD client for one REST resource. Every endpoint in the Postman
 * collection (list / get / create / PATCH / DELETE) is covered by this factory.
 */
function resource<T, TCreate, TUpdate = Partial<TCreate>>(
  path: string,
  tag: string,
  parse: (raw: unknown) => T | null,
) {
  const one = (uuid: string) => `${path}/${encodeURIComponent(uuid)}`

  return {
    async list(): Promise<T[]> {
      const payload = await request(path, { tags: [tag] })
      return unwrapList(payload)
        .map(parse)
        .filter((item): item is T => item !== null)
    },

    /** Resolves to `null` when the API answers 404. */
    async get(uuid: string): Promise<T | null> {
      try {
        return parse(unwrapItem(await request(one(uuid), { tags: [tag] })))
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null
        throw error
      }
    },

    create: (input: TCreate) => request(path, { method: 'POST', body: input }),
    update: (uuid: string, input: TUpdate) => request(one(uuid), { method: 'PATCH', body: input }),
    remove: (uuid: string) => request<void>(one(uuid), { method: 'DELETE' }),
  }
}

export const sports = resource<Sport, SportInput>('sports', 'sports', parseSport)
export const events = resource<SportEvent, EventInput>('events', 'events', parseEvent)
export const categories = resource<Category, CategoryInput>('sport_categories', 'categories', parseCategory)

const commentResource = resource<Comment, CommentInput>('comments', 'comments', parseComment)
export const comments = {
  ...commentResource,
  async byEvent(eventUuid: string): Promise<Comment[]> {
    const payload = await request(`comments/events/${encodeURIComponent(eventUuid)}`, { tags: ['comments'] })
    return unwrapList(payload)
      .map(parseComment)
      .filter((item): item is Comment => item !== null)
  },
}

const favoriteResource = resource<Favorite, FavoriteInput>('favorites', 'favorites', parseFavorite)
export const favorites = {
  list: favoriteResource.list,
  add: favoriteResource.create,
  /**
   * The Postman collection documents DELETE as `/favorite/{uuid}` (singular)
   * while every other favorites route is plural. Try the RESTful path first and
   * fall back to the documented one.
   */
  async remove(uuid: string): Promise<void> {
    try {
      await favoriteResource.remove(uuid)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
        await request<void>(`favorite/${encodeURIComponent(uuid)}`, { method: 'DELETE' })
        return
      }
      throw error
    }
  },
}

/** Home page data. One failing endpoint must not take the whole page down. */
export async function loadHome() {
  const results = await Promise.allSettled([sports.list(), events.list(), categories.list()])
  results.forEach((result) => {
    if (result.status === 'rejected') console.error('[home] API request failed:', result.reason)
  })
  const value = <T,>(result: PromiseSettledResult<T[]>): T[] => (result.status === 'fulfilled' ? result.value : [])
  return {
    sports: value(results[0]),
    events: value(results[1]),
    categories: value(results[2]),
    failed: results.some((result) => result.status === 'rejected'),
  }
}
