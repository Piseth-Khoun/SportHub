"use client";

import { useState } from "react";
import { SmartImage } from "./media";

export function Gallery({ images, seed, alt }: { images: string[]; seed: string; alt: string }) {
  const [active, setActive] = useState(0);
  const shown = images.length > 0 ? images : [undefined];

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-surface">
        <SmartImage
          src={shown[active]}
          alt={alt}
          seed={`${seed}-${active}`}
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {shown.length > 1 && (
        <div className="scroll-rail mt-3 flex gap-2 overflow-x-auto">
          {shown.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border transition-colors ${
                active === i ? "border-floodlight" : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              <SmartImage src={src} alt="" seed={`${seed}-thumb-${i}`} className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
