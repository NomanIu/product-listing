/**
 * Skeleton shown while the listing's server data resolves. It reserves the same
 * layout as the real grid so there is no layout shift when content arrives.
 */
export default function Loading() {
  return (
    <>
      <div className="mb-10 border-b border-neutral-200 pb-8">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
        <div className="mt-3 h-9 w-56 animate-pulse rounded bg-neutral-200" />
      </div>
      <ul
        role="list"
        aria-hidden="true"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <div className="aspect-square animate-pulse bg-neutral-100" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-16 animate-pulse rounded bg-neutral-200" />
                <div className="h-7 w-14 animate-pulse rounded-full bg-neutral-200" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
