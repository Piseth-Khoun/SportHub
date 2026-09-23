import { CategoryRail } from "@/components/category-rail";
import { GearCard } from "@/components/gear-card";
import { EmptyState } from "@/components/empty-state";
import { ApiNotice } from "@/components/api-notice";
import { getCategories, getSports } from "@/lib/api";
import { safe } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function GearPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, sports] = await Promise.all([
    safe(getCategories(), []),
    safe(getSports(), []),
  ]);

  const filtered = category
    ? sports.data.filter((s) => s.categoryName === category)
    : sports.data;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Gear
      </h1>
      <p className="mt-3 max-w-lg text-[15px] text-slate">
        Equipment recommended by players and clubs — filter by sport to find
        what you need.
      </p>

      <div className="mt-8">
        <CategoryRail categories={categories.data} activeCategory={category} basePath="/gear" />
      </div>

      <div className="mt-10">
        {(sports.error || categories.error) && (
          <ApiNotice message={sports.error ?? categories.error ?? ""} />
        )}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((sport) => (
              <GearCard key={sport.uuid} sport={sport} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={category ? `No ${category} gear yet` : "No gear listed yet"}
            detail="Try another category, or add the first item yourself."
          />
        )}
      </div>
    </div>
  );
}
