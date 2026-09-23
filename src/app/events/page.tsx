import { CategoryRail } from "@/components/category-rail";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { ApiNotice } from "@/components/api-notice";
import { getCategories, getEvents } from "@/lib/api";
import { safe } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, events] = await Promise.all([
    safe(getCategories(), []),
    safe(getEvents(), []),
  ]);

  const filtered = category
    ? events.data.filter((e) => e.categoryName === category)
    : events.data;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Events
      </h1>
      <p className="mt-3 max-w-lg text-[15px] text-slate">
        Courts, pitches, and pickup games — every listing links back to the
        spot on the map.
      </p>

      <div className="mt-8">
        <CategoryRail categories={categories.data} activeCategory={category} basePath="/events" />
      </div>

      <div className="mt-10">
        {(events.error || categories.error) && (
          <ApiNotice message={events.error ?? categories.error ?? ""} />
        )}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((event) => (
              <EventCard key={event.uuid} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={category ? `No ${category} events yet` : "No events yet"}
            detail="Try another category, or add the first listing yourself."
          />
        )}
      </div>
    </div>
  );
}
