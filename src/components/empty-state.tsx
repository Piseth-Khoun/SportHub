import { BallIcon } from "./icons";

export function EmptyState({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface/60 px-6 py-14 text-center">
      <BallIcon className="h-8 w-8 text-slate" />
      <h3 className="font-display text-xl tracking-wide text-chalk">{title}</h3>
      {detail && <p className="max-w-sm text-[15px] text-slate">{detail}</p>}
      {action}
    </div>
  );
}
