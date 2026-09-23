"use client";

import { useState } from "react";
import { ChatIcon } from "./icons";
import { createComment } from "@/lib/api";
import type { EventComment } from "@/lib/types";

export function Comments({
  eventUuid,
  initialComments,
}: {
  eventUuid: string;
  initialComments: EventComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || posting) return;
    setPosting(true);
    setError(null);
    try {
      const created = await createComment({ eventUuid, comment: value });
      setComments((prev) => [
        ...prev,
        created?.uuid ? created : { uuid: crypto.randomUUID(), eventUuid, comment: value },
      ]);
      setText("");
    } catch {
      setError("Couldn't post that comment — check the API connection and try again.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-chalk">
        <ChatIcon className="h-5 w-5" />
        Comments
        <span className="text-base font-normal text-slate">({comments.length})</span>
      </h2>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share how the game went, court conditions, anything useful…"
          className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] text-chalk placeholder:text-slate focus:outline-none focus:border-floodlight/60"
        />
        <button
          type="submit"
          disabled={posting || !text.trim()}
          className="shrink-0 rounded-full bg-floodlight px-5 py-2.5 text-[14px] font-semibold text-pitch transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </form>
      {error && <p className="mt-2 text-[13px] text-whistle">{error}</p>}

      <ul className="mt-6 flex flex-col gap-4">
        {comments.length === 0 && (
          <li className="text-[14px] text-slate">
            No comments yet — be the first to say something about this spot.
          </li>
        )}
        {comments.map((comment) => (
          <li
            key={comment.uuid}
            className="rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-chalk"
          >
            {comment.comment}
          </li>
        ))}
      </ul>
    </div>
  );
}
