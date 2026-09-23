import { Hero } from "@/components/hero";
import { CategoryRail } from "@/components/category-rail";
import { SectionHeader } from "@/components/section-header";
import { EventCard } from "@/components/event-card";
import { GearCard } from "@/components/gear-card";
import { EmptyState } from "@/components/empty-state";
import { ApiNotice } from "@/components/api-notice";
import { getCategories, getEvents, getSports } from "@/lib/api";
import { safe } from "@/lib/safe";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, events, sports] = await Promise.all([
    safe(getCategories(), []),
    safe(getEvents(), []),
    safe(getSports(), []),
  ]);

  const error = categories.error ?? events.error ?? sports.error;

  return (
    <>
      <Hero featuredEvent={events.data[0] ?? null} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {error && <ApiNotice message={error} />}

        <CategoryRail categories={categories.data} basePath="/events" />

        <section className="mt-16">
          <SectionHeader
            title="Upcoming near you"
            subtitle="Pickup games, courts, and pitches added by the community."
            href="/events"
          />
          {events.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {events.data.slice(0, 8).map((event) => (
                <EventCard key={event.uuid} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events yet"
              detail="Know a court or a pickup game? Be the first to put it on the map."
              action={
                <Link
                  href="/submit"
                  className="mt-1 rounded-full bg-floodlight px-4 py-2 text-[14px] font-semibold text-pitch"
                >
                  Add an event
                </Link>
              }
            />
          )}
        </section>

        <section className="mt-16 pb-20">
          <SectionHeader
            title="Gear to get game-ready"
            subtitle="Equipment shared and reviewed by other players."
            href="/gear"
          />
          {sports.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {sports.data.slice(0, 8).map((sport) => (
                <GearCard key={sport.uuid} sport={sport} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No gear listed yet"
              detail="Add the equipment your court or club recommends."
              action={
                <Link
                  href="/submit"
                  className="mt-1 rounded-full bg-floodlight px-4 py-2 text-[14px] font-semibold text-pitch"
                >
                  Add gear
                </Link>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
