import Link from "next/link";

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "See all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[28px] leading-none tracking-wide text-chalk sm:text-[34px]">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-lg text-[15px] text-slate">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 border-b border-transparent pb-0.5 text-[15px] font-medium text-chalk transition-colors hover:border-floodlight hover:text-floodlight"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
