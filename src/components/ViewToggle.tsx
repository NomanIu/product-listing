"use client";

/** The two ways the catalogue can be laid out. */
export type ProductView = "grid" | "list";

/**
 * A segmented control to switch between grid and list layouts.
 *
 * This is a *controlled* client component: the parent owns the `value` and updates it
 * on `onChange`. Switching is therefore instant — it flips local state and re-lays-out
 * the already-loaded products, with no navigation or server round-trip.
 */
export function ViewToggle({
  value,
  onChange,
}: {
  value: ProductView;
  onChange: (view: ProductView) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Choose product layout"
      className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1"
    >
      <ToggleButton view="grid" value={value} onChange={onChange} label="Grid view">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
        </svg>
      </ToggleButton>
      <ToggleButton view="list" value={value} onChange={onChange} label="List view">
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M3 4h2v2H3V4zm4 0h10v2H7V4zM3 9h2v2H3V9zm4 0h10v2H7V9zm-4 5h2v2H3v-2zm4 0h10v2H7v-2z" />
        </svg>
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  view,
  value,
  onChange,
  label,
  children,
}: {
  view: ProductView;
  value: ProductView;
  onChange: (view: ProductView) => void;
  label: string;
  children: React.ReactNode;
}) {
  const active = view === value;
  return (
    <button
      type="button"
      onClick={() => onChange(view)}
      aria-pressed={active}
      aria-label={label}
      className={[
        "inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900",
        active
          ? "bg-white text-neutral-900 shadow-sm"
          : "text-neutral-400 hover:text-neutral-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
