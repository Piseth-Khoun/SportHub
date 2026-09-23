import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { ApiNotice } from "@/components/api-notice";
import { BallIcon } from "@/components/icons";
import { getCategories } from "@/lib/api";
import { safe } from "@/lib/safe";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { data: categories, error } = await safe(getCategories(), []);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Categories
      </h1>
      <p className="mt-3 max-w-lg text-[15px] text-slate">
        Every sport tracked on SportHub, with its own events and gear.
      </p>

      <div className="mt-10">
        {error && <ApiNotice message={error} />}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.uuid}
                href={`/categories/${encodeURIComponent(category.name)}`}
                className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-turf/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-turf-soft text-turf">
                  <BallIcon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-xl tracking-wide text-chalk">
                  {category.name}
                </h3>
                <p className="text-[14px] text-slate">{category.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No categories yet"
            detail="Categories are created behind the scenes as events and gear come in."
          />
        )}
      </div>
    </div>
  );
}
