import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportHub — Find where the game is happening",
  description:
    "Courts, pitches, and gear shared by players near you — mapped, tagged, and open to whoever adds them next.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/*
          Loaded as a plain stylesheet rather than next/font/google: on some
          setups Turbopack's internal font-resolution module can't be
          resolved (the "@vercel/turbopack-next/internal/font/google/font"
          error), usually because the dev/build process can't reach
          fonts.gstatic.com. A <link> tag loads the exact same font files,
          just from the browser at runtime instead of the bundler at build
          time — so it works regardless of that restriction, and falls back
          to the system stack in globals.css if it can't load at all.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- this
            rule targets the Pages Router's per-page _document.js; this is
            the App Router's root layout, which already wraps every page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
