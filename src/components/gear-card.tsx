import Link from "next/link";
import { SmartImage } from "./media";
import { Tag } from "./tag";
import { FavoriteButton } from "./favorite-button";
import { truncate } from "@/lib/format";
import type { Sport } from "@/lib/types";

export function GearCard({ sport }: { sport: Sport }) {
  return (
    <Link
      href={`/gear/${sport.uuid}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-floodlight/40"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <SmartImage
          src={sport.imageUrls?.[0]}
          alt={sport.name}
          seed={sport.uuid}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton kind="sport" itemUuid={sport.uuid} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Tag>{sport.categoryName}</Tag>
        <h3 className="font-display text-lg leading-tight tracking-wide text-chalk">
          {sport.name}
        </h3>
        <p className="text-[13px] text-slate">{truncate(sport.description, 90)}</p>
      </div>
    </Link>
  );
}
