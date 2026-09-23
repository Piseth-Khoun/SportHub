import Link from "next/link";
import type { SportCategory } from "@/lib/types";

export function CategoryRail({
  categories,
  activeCategory,
  basePath = "/events",
}: {
  categories: SportCategory[];
  activeCategory?: string;
  basePath?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <div className="scroll-rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <Pill href={basePath} active={!activeCategory}>
        All sports
      </Pill>
      {categories.map((category) => (
        <Pill
          key={category.uuid}
          href={`${basePath}?category=${encodeURIComponent(category.name)}`}
          active={activeCategory === category.name}
        >
          {category.name}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-4 py-2 text-[14px] font-medium whitespace-nowrap transition-colors ${
        active
          ? "border-turf bg-turf text-pitch"
          : "border-line text-slate hover:border-turf/50 hover:text-chalk"
      }`}
    >
      {children}
    </Link>
  );
}
