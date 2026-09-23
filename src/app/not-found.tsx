import Link from "next/link";
import { BallIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-32 text-center">
      <BallIcon className="h-10 w-10 text-slate" />
      <h1 className="font-display text-4xl tracking-wide text-chalk">Nothing on this pitch</h1>
      <p className="text-[15px] text-slate">
        Whatever you were looking for isn&apos;t here — it may have been removed or never existed.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-floodlight px-5 py-2.5 text-[14px] font-semibold text-pitch"
      >
        Back to SportHub
      </Link>
    </div>
  );
}
