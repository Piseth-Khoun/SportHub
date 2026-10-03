import type { FavoriteKind, Sport, SportEvent } from './types'

/** Common shape the cards, hero and rail render, so they don't care what they show. */
export interface Story {
  kind: FavoriteKind
  uuid: string
  href: string
  title: string
  summary: string
  image?: string
  tag: string
  meta: string
}

export const sportStory = (sport: Sport): Story => ({
  kind: 'sport',
  uuid: sport.uuid,
  href: `/sports/${sport.uuid}`,
  title: sport.name,
  summary: sport.description,
  image: sport.imageUrls[0],
  tag: sport.categoryName || 'Sport',
  meta: 'Sport',
})

export const eventStory = (event: SportEvent): Story => ({
  kind: 'event',
  uuid: event.uuid,
  href: `/events/${event.uuid}`,
  title: event.name,
  summary: event.description,
  image: event.imageUrls[0],
  tag: event.categoryName || 'Event',
  meta: event.locationName || 'Event',
})
