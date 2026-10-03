'use client'

import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/lib/http'
import { comments as commentsApi } from '@/lib/services'
import type { Comment } from '@/lib/types'
import { formatDate } from '@/lib/url'

const MAX_LENGTH = 500
const newestFirst = (a: Comment, b: Comment) => b.createdAt.localeCompare(a.createdAt)

export function Comments({ eventUuid, initial }: { eventUuid: string; initial: Comment[] }) {
  const [items, setItems] = useState(() => [...initial].sort(newestFirst))
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const comment = text.trim()
    if (!comment || saving) return
    setSaving(true)
    setError(null)
    try {
      await commentsApi.create({ eventUuid, comment })
      setText('')
      setItems((await commentsApi.byEvent(eventUuid)).sort(newestFirst))
    } catch (err) {
      setError(errorMessage(err, 'Could not post your comment.'))
    } finally {
      setSaving(false)
    }
  }

  async function remove(uuid: string) {
    const previous = items
    setItems(items.filter((item) => item.uuid !== uuid))
    try {
      await commentsApi.remove(uuid)
    } catch (err) {
      setItems(previous)
      setError(errorMessage(err, 'Could not delete the comment.'))
    }
  }

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="section__title">
        Comments <span className="muted">({items.length})</span>
      </h2>

      <form onSubmit={submit} className="comments__form">
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="Share what you thought of this event"
          required
        />
        <div className="comments__actions">
          <span className="muted">
            {text.length}/{MAX_LENGTH}
          </span>
          <button type="submit" className="btn btn--primary" disabled={saving || !text.trim()}>
            {saving ? 'Posting…' : 'Post comment'}
          </button>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </form>

      {items.length === 0 ? (
        <p className="muted">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="comments__list">
          {items.map((item) => (
            <li key={item.uuid}>
              <p>{item.text}</p>
              <div className="comments__meta">
                {item.createdAt && <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>}
                <button type="button" className="link-btn" onClick={() => void remove(item.uuid)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
