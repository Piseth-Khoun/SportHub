import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Tag } from "@/components/tag";
import { FavoriteButton } from "@/components/favorite-button";
import { Comments } from "@/components/comments";
import { PinIcon } from "@/components/icons";
import { ApiError, getCommentsForEvent, getEvent } from "@/lib/api";
import { formatCoordinates, googleMapsUrl, osmEmbedUrl } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  let event;
  try {
    event = await getEvent(uuid);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  if (!event) notFound();

  const comments = await getCommentsForEvent(uuid).catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6">
      <Link href="/events" className="text-[14px] font-medium text-slate hover:text-chalk">
        Back to all events
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <Gallery images={event.imageUrls ?? []} seed={event.uuid} alt={event.name} />

        <div>
          <Tag>{event.categoryName}</Tag>
          <h1 className="mt-3 font-display text-[38px] leading-[0.95] tracking-wide text-chalk sm:text-[44px]">
            {event.name}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-[15px] text-slate">
            <PinIcon className="h-4 w-4 shrink-0" />
            {event.locationName}
          </p>

          <p className="mt-6 text-[15px] leading-relaxed text-chalk/90">{event.description}</p>

          <div className="mt-6">
            <FavoriteButton kind="event" itemUuid={event.uuid} variant="solid" />
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <iframe
              title={`Map showing ${event.locationName}`}
              src={osmEmbedUrl(event.latitude, event.longitude)}
              className="h-64 w-full grayscale-[15%]"
              loading="lazy"
            />
            <div className="flex items-center justify-between bg-surface px-4 py-3 text-[13px] text-slate">
              <span>{formatCoordinates(event.latitude, event.longitude)}</span>
              <a
                href={googleMapsUrl(event.latitude, event.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-floodlight hover:opacity-80"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-2xl">
        <Comments eventUuid={event.uuid} initialComments={comments} />
      </div>
    </div>
  );
}
