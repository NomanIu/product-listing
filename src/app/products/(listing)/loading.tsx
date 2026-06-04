/**
 * Skeleton shown while the listing's server data resolves. It reserves the same
 * layout as the real grid so there is no layout shift when content arrives.
 */
export default function Loading() {
  return (
    <>
      <div className="mb-8">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-200" />
      </div>
      <ul
        role="list"
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-slate-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-full animate-pulse rounded bg-slate-200" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
