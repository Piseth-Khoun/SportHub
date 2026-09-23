import Link from "next/link";
import { SmartImage } from "./media";
import { PinIcon } from "./icons";
import type { SportEvent } from "@/lib/types";

export function Hero({ featuredEvent }: { featuredEvent: SportEvent | null }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-[52px] leading-[0.95] tracking-wide text-chalk sm:text-[68px]">
            Find where the game is happening.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-slate">
            Courts, pitches, and gear shared by players near you — with the
            location, the gear list, and who&apos;s already talking about it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events"
              className="rounded-full bg-floodlight px-6 py-3 text-[15px] font-semibold text-pitch transition-opacity hover:opacity-90"
            >
              Browse events
            </Link>
            <Link
              href="/gear"
              className="rounded-full border border-line px-6 py-3 text-[15px] font-semibold text-chalk transition-colors hover:border-turf/50"
            >
              Explore gear
            </Link>
          </div>
        </div>

        <div className="relative">
          <div
            className="floodlight-glow pointer-events-none absolute -inset-10 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--floodlight-soft) 0%, transparent 70%)",
            }}
          />
          <div className="relative rounded-2xl border border-line bg-surface p-2 shadow-2xl">
            {featuredEvent ? (
              <Link href={`/events/${featuredEvent.uuid}`} className="block">
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-xl">
                  <SmartImage
                    src={featuredEvent.imageUrls?.[0]}
                    alt={featuredEvent.name}
                    seed={featuredEvent.uuid}
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/10 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-floodlight px-3 py-1 text-[12px] font-semibold text-pitch">
                    Next up
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-2xl tracking-wide text-chalk">
                      {featuredEvent.name}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-slate">
                      <PinIcon className="h-4 w-4 shrink-0" />
                      {featuredEvent.locationName}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex aspect-[5/4] w-full flex-col items-center justify-center gap-3 rounded-xl bg-surface-raised px-6 text-center">
                <p className="font-display text-xl tracking-wide text-chalk">
                  No events lit up yet
                </p>
                <p className="text-[14px] text-slate">
                  Be the first to add a court or pickup game.
                </p>
                <Link
                  href="/submit"
                  className="mt-1 rounded-full bg-floodlight px-4 py-2 text-[14px] font-semibold text-pitch"
                >
                  Add an event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
