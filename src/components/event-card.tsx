import Link from "next/link";
import { SmartImage } from "./media";
import { Tag } from "./tag";
import { FavoriteButton } from "./favorite-button";
import { PinIcon } from "./icons";
import type { SportEvent } from "@/lib/types";

export function EventCard({ event }: { event: SportEvent }) {
  return (
    <Link
      href={`/events/${event.uuid}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-floodlight/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SmartImage
          src={event.imageUrls?.[0]}
          alt={event.name}
          seed={event.uuid}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/10 to-transparent" />
        <div className="absolute top-3 left-3">
          <Tag>{event.categoryName}</Tag>
        </div>
        <div className="absolute top-3 right-3">
          <FavoriteButton kind="event" itemUuid={event.uuid} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-tight tracking-wide text-chalk">
          {event.name}
        </h3>
        <p className="flex items-center gap-1.5 text-[13px] text-slate">
          <PinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{event.locationName}</span>
        </p>
      </div>
    </Link>
  );
}
