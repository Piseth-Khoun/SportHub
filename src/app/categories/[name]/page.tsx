import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { GearCard } from "@/components/gear-card";
import { EmptyState } from "@/components/empty-state";
import { getEvents, getSports } from "@/lib/api";
import { safe } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  const [{ data: events }, { data: sports }] = await Promise.all([
    safe(getEvents(), []),
    safe(getSports(), []),
  ]);

  const categoryEvents = events.filter((e) => e.categoryName === categoryName);
  const categorySports = sports.filter((s) => s.categoryName === categoryName);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <Link href="/categories" className="text-[14px] font-medium text-slate hover:text-chalk">
        Back to categories
      </Link>
      <h1 className="mt-4 font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        {categoryName}
      </h1>

      <section className="mt-12">
        <h2 className="font-display text-2xl tracking-wide text-chalk">Events</h2>
        {categoryEvents.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryEvents.map((event) => (
              <EventCard key={event.uuid} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[14px] text-slate">No {categoryName} events yet.</p>
        )}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl tracking-wide text-chalk">Gear</h2>
        {categorySports.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categorySports.map((sport) => (
              <GearCard key={sport.uuid} sport={sport} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[14px] text-slate">No {categoryName} gear yet.</p>
        )}
      </section>

      {categoryEvents.length === 0 && categorySports.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title={`Nothing under ${categoryName} yet`}
            detail="Add the first event or gear listing for this sport."
          />
        </div>
      )}
    </div>
  );
}
