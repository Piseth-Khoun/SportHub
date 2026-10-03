export type FavoriteKind = 'sport' | 'event'

export interface Sport {
  uuid: string
  name: string
  description: string
  imageUrls: string[]
  categoryName: string
}

export interface SportEvent {
  uuid: string
  name: string
  description: string
  imageUrls: string[]
  categoryName: string
  locationName: string
  latitude: number | null
  longitude: number | null
}

export interface Category {
  uuid: string
  name: string
  description: string
}

export interface Comment {
  uuid: string
  eventUuid: string
  text: string
  createdAt: string
}

export interface Favorite {
  uuid: string
  sportUuid: string
  eventUuid: string
  sport: Sport | null
  event: SportEvent | null
}

// Write payloads (mirror the Postman collection bodies).
export interface SportInput {
  name: string
  description: string
  imageUrls: string[]
  categoryName: string
}
export interface EventInput extends SportInput {
  locationName: string
  latitude: number
  longitude: number
}
export interface CategoryInput {
  name: string
  description: string
}
export interface CommentInput {
  eventUuid: string
  comment: string
}
export interface FavoriteInput {
  sportUuid: string
  eventUuid: string
}
