"use client";

import { useState } from "react";
import Image from "next/image";
import { BallIcon } from "./icons";
import { toneFor } from "@/lib/format";

export function SmartImage({
  src,
  alt,
  seed,
  className = "",
  sizes,
  fill = true,
}: {
  src: string | undefined;
  alt: string;
  seed: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: toneFor(seed) }}
      >
        <BallIcon className="h-8 w-8 text-slate/50" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
