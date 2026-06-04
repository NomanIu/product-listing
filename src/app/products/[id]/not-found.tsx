import Link from "next/link";

/** Rendered when a product id does not exist (or is malformed). */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h1 className="text-lg font-semibold">Product not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        We couldn&apos;t find the product you were looking for.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        Browse all products
      </Link>
    </div>
  );
}
