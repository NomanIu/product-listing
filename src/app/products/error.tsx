"use client";

/**
 * Route-level error boundary for the listing. If the upstream API or the database is
 * unreachable, the user sees a recoverable message with a retry instead of a crash.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm"
    >
      <h1 className="text-lg font-semibold text-neutral-900">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        We couldn&apos;t load the products. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        Try again
      </button>
    </div>
  );
}
