export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-turf/40 bg-turf-soft px-2.5 py-1 text-[13px] font-medium text-turf">
      {children}
    </span>
  );
}
