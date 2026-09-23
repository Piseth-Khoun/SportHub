"use client";

import type { Favorite } from "./types";

/**
 * The `favorites` endpoint has no concept of a signed-in user — a favorite
 * is just a bare {sportUuid | eventUuid} row. To make "My favorites" mean
 * something on a no-login site, this keeps the list of favorite records
 * *this browser* created, in localStorage, alongside the real API calls
 * that persist the rows themselves.
 */

const KEY = "sporthub:favorites";
export const FAVORITES_CHANGED_EVENT = "sporthub:favorites-changed";

export function readLocalFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Favorite[]) : [];
  } catch {
    return [];
  }
}

function writeLocalFavorites(favorites: Favorite[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  } catch {
    // storage unavailable (private mode, quota) — favoriting still works
    // for this session via the API, it just won't persist on reload.
  }
}

export function subscribeToLocalFavorites(callback: () => void): () => void {
  window.addEventListener(FAVORITES_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(FAVORITES_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function findLocalFavorite(
  kind: "sport" | "event",
  itemUuid: string,
): Favorite | undefined {
  return readLocalFavorites().find((f) =>
    kind === "sport" ? f.sportUuid === itemUuid : f.eventUuid === itemUuid,
  );
}

export function addLocalFavorite(favorite: Favorite) {
  const current = readLocalFavorites();
  writeLocalFavorites([...current, favorite]);
}

export function removeLocalFavorite(favoriteUuid: string) {
  writeLocalFavorites(readLocalFavorites().filter((f) => f.uuid !== favoriteUuid));
}
