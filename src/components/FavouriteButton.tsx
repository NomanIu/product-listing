"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleFavourite } from "@/app/products/actions";
import type { ProductId } from "@/domain/product";

interface FavouriteButtonProps {
  productId: ProductId;
  /** Accessible product title, woven into the button's label. */
  productTitle: string;
  initialCount: number;
  /** Whether the current visitor already favourited this product. */
  initialFavourited: boolean;
  /** "compact" for the card grid, "full" for the detail page. */
  variant?: "compact" | "full";
}

interface FavouriteState {
  favourited: boolean;
  count: number;
}

/**
 * The single interactive client component on the page.
 *
 * It is a small, self-contained island: the rest of the tree stays server-rendered,
 * so there is no render-blocking client JS for the initial paint (good INP/LCP).
 * Clicking toggles the visitor's favourite; the state flips optimistically for
 * instant feedback, then reconciles with the authoritative value from the action.
 */
export function FavouriteButton({
  productId,
  productTitle,
  initialCount,
  initialFavourited,
  variant = "compact",
}: FavouriteButtonProps) {
  const [state, setState] = useState<FavouriteState>({
    favourited: initialFavourited,
    count: initialCount,
  });
  const [optimistic, applyOptimistic] = useOptimistic(
    state,
    (current): FavouriteState => ({
      favourited: !current.favourited,
      count: current.count + (current.favourited ? -1 : 1),
    }),
  );
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      applyOptimistic(null);
      const result = await toggleFavourite(productId);
      if (result.ok) {
        setState({ favourited: result.favourited, count: result.count });
      }
    });
  }

  const isFull = variant === "full";
  const { favourited, count } = optimistic;
  const actionWord = favourited ? "Remove" : "Add";
  const preposition = favourited ? "from" : "to";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favourited}
      aria-label={`${actionWord} ${productTitle} ${preposition} favourites`}
      className={[
        "group/fav inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
        "disabled:cursor-not-allowed disabled:opacity-60",
        isFull ? "px-5 py-2.5 text-sm" : "px-2.5 py-1.5 text-xs",
        favourited
          ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
      ].join(" ")}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={[
          isFull ? "h-4 w-4" : "h-3.5 w-3.5",
          "transition-transform duration-200 group-active/fav:scale-125",
          favourited
            ? "fill-rose-500"
            : "fill-none stroke-current stroke-2",
        ].join(" ")}
      >
        <path d="M12 21s-7.5-4.6-10-9.4C.3 8 1.7 4.5 5 4.5c2 0 3.2 1.1 4 2.3.8-1.2 2-2.3 4-2.3 3.3 0 4.7 3.5 3 7.1C19.5 16.4 12 21 12 21z" />
      </svg>
      {isFull && <span>{favourited ? "Favourited" : "Favourite"}</span>}
      <span className="tabular-nums" aria-live="polite">
        <span className="sr-only">Favourite count: </span>
        {count}
      </span>
    </button>
  );
}
