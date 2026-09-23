"use client";

import { useRef, useState } from "react";
import { CameraIcon, CloseIcon } from "./icons";
import { uploadImage } from "@/lib/api";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try {
        uploaded.push(await uploadImage(file));
      } catch {
        setError(
          "One or more images failed to upload. You can still submit — add images later by editing the listing.",
        );
      }
    }
    onChange([...value, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative h-20 w-20 overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pitch/80 text-chalk"
              aria-label="Remove image"
            >
              <CloseIcon className="h-3 w-3" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line text-slate transition-colors hover:border-floodlight/50 hover:text-chalk disabled:opacity-50"
        >
          <CameraIcon className="h-5 w-5" />
          <span className="text-[11px]">{uploading ? "Uploading…" : "Add"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-[13px] text-whistle">{error}</p>}
    </div>
  );
}
