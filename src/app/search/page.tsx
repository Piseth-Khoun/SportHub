import { EventCard } from "@/components/event-card";
import { GearCard } from "@/components/gear-card";
import { EmptyState } from "@/components/empty-state";
import { ApiNotice } from "@/components/api-notice";
import { getEvents, getSports } from "@/lib/api";
import { safe } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const [{ data: events, error: eventsError }, { data: sports, error: sportsError }] =
    await Promise.all([safe(getEvents(), []), safe(getSports(), [])]);

  const matchedEvents = query
    ? events.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.locationName.toLowerCase().includes(query),
      )
    : [];
  const matchedSports = query
    ? sports.filter(
        (s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query),
      )
    : [];

  const totalMatches = matchedEvents.length + matchedSports.length;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Search
      </h1>
      <p className="mt-3 text-[15px] text-slate">
        {query ? (
          <>
            {totalMatches} result{totalMatches === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </>
        ) : (
          "Type something in the search bar above to look across events and gear."
        )}
      </p>

      {(eventsError || sportsError) && (
        <div className="mt-6">
          <ApiNotice message={eventsError ?? sportsError ?? ""} />
        </div>
      )}

      {query && totalMatches === 0 && (
        <div className="mt-10">
          <EmptyState title="No matches" detail="Try a different word, or browse by category instead." />
        </div>
      )}

      {matchedEvents.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl tracking-wide text-chalk">Events</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {matchedEvents.map((event) => (
              <EventCard key={event.uuid} event={event} />
            ))}
          </div>
        </section>
      )}

      {matchedSports.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-wide text-chalk">Gear</h2>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {matchedSports.map((sport) => (
              <GearCard key={sport.uuid} sport={sport} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
