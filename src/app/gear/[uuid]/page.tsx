import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { Tag } from "@/components/tag";
import { FavoriteButton } from "@/components/favorite-button";
import { ApiError, getSport } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  let sport;
  try {
    sport = await getSport(uuid);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }
  if (!sport) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-24 sm:px-6">
      <Link href="/gear" className="text-[14px] font-medium text-slate hover:text-chalk">
        Back to all gear
      </Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <Gallery images={sport.imageUrls ?? []} seed={sport.uuid} alt={sport.name} />

        <div>
          <Tag>{sport.categoryName}</Tag>
          <h1 className="mt-3 font-display text-[38px] leading-[0.95] tracking-wide text-chalk sm:text-[44px]">
            {sport.name}
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-chalk/90">{sport.description}</p>
          <div className="mt-6">
            <FavoriteButton kind="sport" itemUuid={sport.uuid} variant="solid" />
          </div>
        </div>
      </div>
    </div>
  );
}
