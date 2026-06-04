import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";
import { config } from "@/config";

// A single self-hosted variable font: no external blocking request, swaps without
// layout shift, and keeps the initial paint fast.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: "Product Listings",
    template: "%s · Product Listings",
  },
  description:
    "A server-rendered product catalogue with favourites, built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <head>
        {/* Warm up the image CDN connection early to improve LCP. */}
        <link rel="preconnect" href="https://cdn.dummyjson.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.dummyjson.com" />
      </head>
      <body className="flex min-h-full flex-col bg-neutral-50 font-sans text-neutral-900 antialiased">
        {/* Skip link: lets keyboard users jump past the header straight to content. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>

        <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link
              href="/products"
              className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white transition-transform group-hover:scale-105"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-base font-semibold tracking-tight text-neutral-900">
                Catalog
              </span>
            </Link>
            <nav aria-label="Primary" className="flex items-center gap-6 text-sm">
              <Link
                href="/products"
                className="font-medium text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
              >
                All products
              </Link>
            </nav>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:py-14"
        >
          {children}
        </main>

        <footer className="border-t border-neutral-200/70 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Catalog. A demo storefront.</p>
            <p>
              Data from the public{" "}
              <a
                href="https://dummyjson.com"
                className="font-medium text-neutral-700 underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                dummyjson.com
              </a>{" "}
              REST API.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
