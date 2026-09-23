"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputClass } from "@/components/field";
import { ImageUploader } from "@/components/image-uploader";
import { CategoryPicker } from "@/components/category-picker";
import { createEvent, createSport, getCategories } from "@/lib/api";
import type { SportCategory } from "@/lib/types";

export default function SubmitPage() {
  const [tab, setTab] = useState<"event" | "gear">("event");
  const [categories, setCategories] = useState<SportCategory[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-24 sm:px-6">
      <h1 className="font-display text-[40px] leading-none tracking-wide text-chalk sm:text-[48px]">
        Add to SportHub
      </h1>
      <p className="mt-3 text-[15px] text-slate">
        Put a court, pitch, or piece of gear on the map for other players to find.
      </p>

      <div className="mt-8 inline-flex rounded-full border border-line p-1">
        <TabButton active={tab === "event"} onClick={() => setTab("event")}>
          Event or venue
        </TabButton>
        <TabButton active={tab === "gear"} onClick={() => setTab("gear")}>
          Gear
        </TabButton>
      </div>

      <div className="mt-8">
        {tab === "event" ? (
          <EventForm categories={categories} />
        ) : (
          <GearForm categories={categories} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${
        active ? "bg-floodlight text-pitch" : "text-slate hover:text-chalk"
      }`}
    >
      {children}
    </button>
  );
}

function SubmitStatus({ state }: { state: "idle" | "saving" | "done" | "error" }) {
  if (state === "done") {
    return <p className="text-[14px] text-turf">Added — thanks for the contribution.</p>;
  }
  if (state === "error") {
    return (
      <p className="text-[14px] text-whistle">
        Couldn&apos;t save that — check the API connection and try again.
      </p>
    );
  }
  return null;
}

function EventForm({ categories }: { categories: SportCategory[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [categoryName, setCategoryName] = useState(categories[0]?.name ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const created = await createEvent({
        name,
        description,
        imageUrls,
        locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        categoryName: categoryName || "Uncategorized",
      });
      setStatus("done");
      if (created?.uuid) {
        setTimeout(() => router.push(`/events/${created.uuid}`), 900);
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Name">
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Riverside 5-a-side court" />
      </Field>
      <Field label="Description">
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={4}
          placeholder="Surface, lighting, what to expect, how to get in"
        />
      </Field>
      <Field label="Location name">
        <input
          required
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className={inputClass}
          placeholder="Phnom Penh Riverside Sports Complex"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Latitude">
          <input
            required
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className={inputClass}
            placeholder="11.572356"
          />
        </Field>
        <Field label="Longitude">
          <input
            required
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className={inputClass}
            placeholder="104.923874"
          />
        </Field>
      </div>
      <Field label="Sport" hint="Pick an existing sport or add a new one.">
        <CategoryPicker categories={categories} value={categoryName} onChange={setCategoryName} />
      </Field>
      <Field label="Photos">
        <ImageUploader value={imageUrls} onChange={setImageUrls} />
      </Field>

      <div className="mt-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-floodlight px-6 py-3 text-[15px] font-semibold text-pitch transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "saving" ? "Adding…" : "Add event"}
        </button>
        <SubmitStatus state={status} />
      </div>
    </form>
  );
}

function GearForm({ categories }: { categories: SportCategory[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState(categories[0]?.name ?? "");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const created = await createSport({
        name,
        description,
        imageUrls,
        categoryName: categoryName || "Uncategorized",
      });
      setStatus("done");
      if (created?.uuid) {
        setTimeout(() => router.push(`/gear/${created.uuid}`), 900);
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Name">
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Adidas training cones" />
      </Field>
      <Field label="Description">
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={4}
          placeholder="What it's for, condition, where to get it"
        />
      </Field>
      <Field label="Sport" hint="Pick an existing sport or add a new one.">
        <CategoryPicker categories={categories} value={categoryName} onChange={setCategoryName} />
      </Field>
      <Field label="Photos">
        <ImageUploader value={imageUrls} onChange={setImageUrls} />
      </Field>

      <div className="mt-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-floodlight px-6 py-3 text-[15px] font-semibold text-pitch transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "saving" ? "Adding…" : "Add gear"}
        </button>
        <SubmitStatus state={status} />
      </div>
    </form>
  );
}
