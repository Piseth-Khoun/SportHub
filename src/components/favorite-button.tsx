"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { HeartIcon } from "./icons";
import { createFavorite, deleteFavorite } from "@/lib/api";
import {
  addLocalFavorite,
  findLocalFavorite,
  removeLocalFavorite,
  subscribeToLocalFavorites,
} from "@/lib/local-favorites";

function getServerSnapshot() {
  return null;
}

export function FavoriteButton({
  kind,
  itemUuid,
  variant = "floating",
}: {
  kind: "sport" | "event";
  itemUuid: string;
  variant?: "floating" | "solid";
}) {
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Reads localStorage as an external store, rather than mirroring it into
  // state via an effect — avoids a hydration flash and a post-mount render.
  const favoriteUuid = useSyncExternalStore(
    subscribeToLocalFavorites,
    useCallback(() => findLocalFavorite(kind, itemUuid)?.uuid ?? null, [kind, itemUuid]),
    getServerSnapshot,
  );

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    setNote(null);
    try {
      if (favoriteUuid) {
        await deleteFavorite(favoriteUuid);
        removeLocalFavorite(favoriteUuid);
      } else {
        const body = kind === "sport" ? { sportUuid: itemUuid } : { eventUuid: itemUuid };
        const created = await createFavorite(body);
        addLocalFavorite({ uuid: created?.uuid ?? crypto.randomUUID(), ...body });
      }
    } catch {
      setNote("Couldn't reach the server — try again");
      setTimeout(() => setNote(null), 2500);
    } finally {
      setPending(false);
    }
  }

  const active = Boolean(favoriteUuid);
  const base =
    variant === "floating"
      ? "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors"
      : "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={active}
        aria-label={active ? "Remove from favorites" : "Add to favorites"}
        disabled={pending}
        className={`${base} ${
          variant === "floating"
            ? active
              ? "bg-turf text-pitch"
              : "bg-pitch/50 text-chalk hover:bg-pitch/70"
            : active
              ? "border-turf bg-turf-soft text-turf"
              : "border-line text-slate hover:border-turf/50 hover:text-turf"
        } ${pending ? "opacity-60" : ""}`}
      >
        <HeartIcon className="h-[18px] w-[18px]" filled={active} />
        {variant === "solid" && (active ? "Saved" : "Save")}
      </button>
      {note && (
        <span className="absolute top-full right-0 z-10 mt-2 w-max rounded-md bg-surface-raised px-2.5 py-1 text-xs text-whistle shadow-lg">
          {note}
        </span>
      )}
    </div>
  );
}
