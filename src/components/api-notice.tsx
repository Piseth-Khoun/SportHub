export function ApiNotice({ message }: { message: string }) {
  return (
    <div className="mb-8 rounded-xl border border-whistle/30 bg-whistle/10 px-4 py-3 text-[14px] text-chalk">
      <span className="font-semibold text-whistle">Couldn&apos;t load live data. </span>
      {message}
    </div>
  );
}
