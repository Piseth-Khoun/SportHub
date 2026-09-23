"use client";

import { useState } from "react";
import { inputClass } from "./field";
import type { SportCategory } from "@/lib/types";

export function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: SportCategory[];
  value: string;
  onChange: (name: string) => void;
}) {
  const [mode, setMode] = useState<"existing" | "new">(
    categories.length > 0 ? "existing" : "new",
  );

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-2 flex gap-4 text-[13px] text-slate">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === "existing"}
              onChange={() => {
                setMode("existing");
                onChange(categories[0]?.name ?? "");
              }}
            />
            Existing category
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === "new"}
              onChange={() => {
                setMode("new");
                onChange("");
              }}
            />
            New category
          </label>
        </div>
      )}

      {mode === "existing" && categories.length > 0 ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.uuid} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Basketball"
          className={inputClass}
          required
        />
      )}
    </div>
  );
}
