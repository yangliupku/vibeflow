'use client'

import { useState, useEffect, useRef } from 'react'
import type { Task } from '@/types'
import { useApp } from '@/context/AppContext'

interface EventPopoverProps {
  task: Task
  position: { x: number; y: number }
  onClose: () => void
}

export default function EventPopover({ task, position, onClose }: EventPopoverProps) {
  const { updateTask, deleteTask } = useApp()
  const [date, setDate] = useState(task.scheduledDate || '')
  const [time, setTime] = useState(task.scheduledTime || '')
  const [duration, setDuration] = useState(task.duration?.toString() || '60')
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleSave = () => {
    updateTask({
      ...task,
      scheduledDate: date || undefined,
      scheduledTime: time || undefined,
      duration: duration ? parseInt(duration) : undefined,
    })
    onClose()
  }

  const handleDelete = () => {
    deleteTask(task.id)
    onClose()
  }

  const handleClearSchedule = () => {
    updateTask({
      ...task,
      scheduledDate: undefined,
      scheduledTime: undefined,
      duration: undefined,
    })
    onClose()
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-64 rounded border border-border bg-surface p-3 shadow-lg"
      style={{
        left: Math.min(position.x, window.innerWidth - 280),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
    >
      <div className="mb-3">
        <p className="text-sm font-medium text-text-primary">{task.title}</p>
        {task.description && (
          <p className="mt-1 text-xs text-text-secondary">{task.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <label className="text-xs text-text-secondary">date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary">time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary">duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="15"
            step="15"
            className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm text-text-primary outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 rounded border border-accent bg-accent px-2 py-1 text-sm text-background transition-colors hover:bg-accent/90"
        >
          save
        </button>
        <button
          onClick={handleClearSchedule}
          className="rounded border border-border px-2 py-1 text-sm text-text-secondary transition-colors hover:border-text-secondary"
        >
          clear
        </button>
        <button
          onClick={handleDelete}
          className="rounded border border-border px-2 py-1 text-sm text-red-400 transition-colors hover:border-red-400"
        >
          delete
        </button>
      </div>
    </div>
  )
}
