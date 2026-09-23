/**
 * Types are modelled directly on the request/response bodies in the
 * provided Postman collection ("Sport"). The collection only shows request
 * bodies, not real responses, so every entity assumes the backend echoes
 * the fields it was sent back, plus a generated `uuid`. If your backend's
 * real response shape differs (extra fields, different casing, a
 * `createdAt` string, etc.), these are safe to extend — nothing in the UI
 * depends on fields beyond the ones listed here.
 */

export interface SportCategory {
  uuid: string;
  name: string;
  description: string;
}

export interface Sport {
  uuid: string;
  name: string;
  description: string;
  imageUrls: string[];
  categoryName: string;
}

export interface SportEvent {
  uuid: string;
  name: string;
  description: string;
  imageUrls: string[];
  locationName: string;
  latitude: number;
  longitude: number;
  categoryName: string;
}

export interface EventComment {
  uuid: string;
  eventUuid: string;
  comment: string;
  createdAt?: string;
}

export interface Favorite {
  uuid: string;
  sportUuid?: string | null;
  eventUuid?: string | null;
}

export type NewSport = Omit<Sport, "uuid">;
export type NewEvent = Omit<SportEvent, "uuid">;
export type NewComment = Omit<EventComment, "uuid" | "createdAt">;
export type NewFavorite = { sportUuid?: string; eventUuid?: string };
export type NewCategory = Omit<SportCategory, "uuid">;
