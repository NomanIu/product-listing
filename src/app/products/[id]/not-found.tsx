import Link from "next/link";

/** Rendered when a product id does not exist (or is malformed). */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm">
      <p className="text-5xl font-bold tracking-tight text-neutral-200">404</p>
      <h1 className="mt-4 text-lg font-semibold text-neutral-900">
        Product not found
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        We couldn&apos;t find the product you were looking for.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-block rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
      >
        Browse all products
      </Link>
    </div>
  );
}
