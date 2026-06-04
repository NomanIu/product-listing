"use client";

import { useOptimistic, useState, useTransition } from "react";
import { addFavourite } from "@/app/products/actions";
import type { ProductId } from "@/domain/product";

interface FavouriteButtonProps {
  productId: ProductId;
  /** Accessible product title, woven into the button's label. */
  productTitle: string;
  initialCount: number;
}

/**
 * The single interactive client component on the page.
 *
 * It is a small, self-contained island: the rest of the tree stays server-rendered,
 * so there is no render-blocking client JS for the initial paint (good INP/LCP).
 * The count updates optimistically for instant feedback, then reconciles with the
 * authoritative value returned by the Server Action.
 */
export function FavouriteButton({
  productId,
  productTitle,
  initialCount,
}: FavouriteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [optimisticCount, addOptimistic] = useOptimistic(
    count,
    (current) => current + 1,
  );
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      addOptimistic(null);
      const result = await addFavourite(productId);
      if (result.ok) setCount(result.count);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Favourite ${productTitle}`}
      className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-rose-600"
      >
        <path d="M12 21s-7.5-4.6-10-9.4C.3 8 1.7 4.5 5 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.3 0 4.7 3.5 3 7.1C19.5 16.4 12 21 12 21z" />
      </svg>
      <span>Favourite</span>
      <span
        aria-live="polite"
        className="min-w-5 rounded-full bg-slate-100 px-2 text-center text-xs font-semibold text-slate-700 tabular-nums"
      >
        <span className="sr-only">Favourite count: </span>
        {optimisticCount}
      </span>
    </button>
  );
}
