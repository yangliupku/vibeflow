'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'

export default function AddTaskForm() {
  const { addTask } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(title.trim())
      setTitle('')
      setIsOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setTitle('')
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded border border-dashed border-border px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:border-accent hover:text-text-primary"
      >
        + add task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="task title..."
        className="flex-1 rounded border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="rounded border border-border bg-surface px-3 py-2 text-sm text-text-primary transition-colors hover:border-accent disabled:opacity-50"
      >
        add
      </button>
      <button
        type="button"
        onClick={() => {
          setTitle('')
          setIsOpen(false)
        }}
        className="rounded border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:border-red-400 hover:text-red-400"
      >
        ×
      </button>
    </form>
  )
}
