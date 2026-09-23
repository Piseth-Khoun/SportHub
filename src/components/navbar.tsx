"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BallIcon, CloseIcon, SearchIcon } from "./icons";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/gear", label: "Gear" },
  { href: "/categories", label: "Categories" },
  { href: "/favorites", label: "Favorites" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setMenuOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-pitch/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
          <BallIcon className="h-6 w-6 text-floodlight" />
          <span className="font-display text-xl tracking-wide text-chalk">SPORTHUB</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-slate transition-colors hover:text-chalk"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 md:flex">
          <SearchIcon className="h-4 w-4 shrink-0 text-slate" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events and gear"
            className="w-full bg-transparent text-[14px] text-chalk placeholder:text-slate focus:outline-none"
          />
        </form>

        <Link
          href="/submit"
          className="hidden shrink-0 rounded-full bg-floodlight px-4 py-2 text-[14px] font-semibold text-pitch transition-opacity hover:opacity-90 md:block"
        >
          Add yours
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-line text-chalk md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <CloseIcon className="h-5 w-5" /> : <BallIcon className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line px-4 pb-5 md:hidden">
          <form onSubmit={submitSearch} className="mt-4 flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2.5">
            <SearchIcon className="h-4 w-4 shrink-0 text-slate" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events and gear"
              className="w-full bg-transparent text-[15px] text-chalk placeholder:text-slate focus:outline-none"
            />
          </form>
          <nav className="mt-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[16px] font-medium text-chalk hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/submit"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-floodlight px-4 py-2.5 text-center text-[15px] font-semibold text-pitch"
            >
              Add yours
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
