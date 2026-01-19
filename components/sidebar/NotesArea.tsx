'use client'

import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'

const NOTES_ID = 'main-notes'

export default function NotesArea() {
  const { state, updateNote } = useApp()
  const [content, setContent] = useState('')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const note = state.notes.find((n) => n.id === NOTES_ID)
    if (note && isInitialLoad.current) {
      setContent(note.content)
      isInitialLoad.current = false
    }
  }, [state.notes])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)

    // Debounce save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      updateNote(NOTES_ID, newContent)
    }, 500)
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        notes
      </h3>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder="write notes here..."
        className="flex-1 resize-none rounded border border-border bg-background p-2 text-sm text-text-primary outline-none focus:border-accent"
      />
    </div>
  )
}
