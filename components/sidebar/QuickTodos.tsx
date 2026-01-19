'use client'

import { useState, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function QuickTodos() {
  const { state, addQuickTodo, toggleQuickTodo, deleteQuickTodo } = useApp()
  const [newTodo, setNewTodo] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      addQuickTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        quick todos
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="add a quick todo..."
          className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-text-primary outline-none focus:border-accent"
        />
      </form>
      <div className="flex flex-col gap-1">
        {state.quickTodos.length === 0 ? (
          <p className="text-xs text-text-secondary py-2">no todos yet</p>
        ) : (
          state.quickTodos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-2 rounded border border-transparent px-1 py-1 hover:border-border"
            >
              <button
                onClick={() => toggleQuickTodo(todo.id)}
                className={cn(
                  'h-4 w-4 flex-shrink-0 rounded-sm border transition-colors',
                  todo.completed
                    ? 'border-accent bg-accent'
                    : 'border-border hover:border-accent'
                )}
              >
                {todo.completed && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-full w-full text-background"
                  >
                    <path
                      fill="currentColor"
                      d="M10 3L4.5 8.5 2 6l-.7.7 3.2 3.2 6.2-6.2z"
                    />
                  </svg>
                )}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  todo.completed
                    ? 'text-text-secondary line-through'
                    : 'text-text-primary'
                )}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteQuickTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 text-xs transition-opacity"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
