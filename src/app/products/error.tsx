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
      className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center"
    >
      <h1 className="text-lg font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">
        We couldn&apos;t load the products. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        Try again
      </button>
    </div>
  );
}
