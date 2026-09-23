"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { GearCard } from "@/components/gear-card";
import { EmptyState } from "@/components/empty-state";
import { getEvent, getSport } from "@/lib/api";
import { readLocalFavorites, subscribeToLocalFavorites } from "@/lib/local-favorites";
import type { Sport, SportEvent } from "@/lib/types";

export default function FavoritesPage() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const favorites = readLocalFavorites();
      const eventUuids = favorites.map((f) => f.eventUuid).filter(Boolean) as string[];
      const sportUuids = favorites.map((f) => f.sportUuid).filter(Boolean) as string[];

      const [eventResults, sportResults] = await Promise.all([
        Promise.allSettled(eventUuids.map((uuid) => getEvent(uuid))),
        Promise.allSettled(sportUuids.map((uuid) => getSport(uuid))),
      ]);

      if (cancelled) return;
      setEvents(eventResults.filter((r) => r.status === "fulfilled").map((r) => r.value));
      setSports(sportResults.filter((r) => r.status === "fulfilled").map((r) => r.value));
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // FavoriteButton broadcasts a change event on every add/remove (including
  // from the heart on these very cards) — subscribing here keeps the list in
  // sync without needing a callback prop passed through EventCard/GearCard,
  // which are Server Components and can't accept function props.
  useEffect(() => {
    const syncFromStorage = () => {
      const favorites = readLocalFavorites();
      setEvents((prev) => prev.filter((e) => favorites.some((f) => f.eventUuid === e.uuid)));
      setSports((prev) => prev.filter((s) => favorites.some((f) => f.sportUuid === s.uuid)));
    };
    return subscribeToLocalFavorites(syncFromStorage);
  }, []);

  const empty = !loading && events.length === 0 && sports.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Favorites
      </h1>
      <p className="mt-3 max-w-lg text-[15px] text-slate">
        Saved on this device — tap the heart on anything to bring it back here.
      </p>

      {loading && <p className="mt-10 text-[14px] text-slate">Loading your favorites…</p>}

      {empty && (
        <div className="mt-10">
          <EmptyState
            title="Nothing saved yet"
            detail="Browse events and gear, and tap the heart on anything you want to keep."
            action={
              <Link
                href="/events"
                className="mt-1 rounded-full bg-floodlight px-4 py-2 text-[14px] font-semibold text-pitch"
              >
                Browse events
              </Link>
            }
          />
        </div>
      )}

      {events.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-chalk">Events</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.uuid} event={event} />
            ))}
          </div>
        </section>
      )}

      {sports.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-wide text-chalk">Gear</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {sports.map((sport) => (
              <GearCard key={sport.uuid} sport={sport} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
