'use client'

import { useState, useEffect, useRef } from 'react'
import type { Task } from '@/types'
import { useApp } from '@/context/AppContext'

interface TaskModalProps {
  task: Task
  onClose: () => void
}

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const { updateTask, deleteTask } = useApp()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [status, setStatus] = useState(task.status)
  const [scheduledDate, setScheduledDate] = useState(task.scheduledDate || '')
  const [scheduledTime, setScheduledTime] = useState(task.scheduledTime || '')
  const [duration, setDuration] = useState(task.duration?.toString() || '')
  const modalRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    titleRef.current?.select()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    updateTask({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      scheduledDate: scheduledDate || undefined,
      scheduledTime: scheduledTime || undefined,
      duration: duration ? parseInt(duration) : undefined,
    })
    onClose()
  }

  const handleDelete = () => {
    if (confirm('Delete this task?')) {
      deleteTask(task.id)
      onClose()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: '#141416',
          border: '1px solid #27272a',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 500, color: '#fafafa' }}>Edit Task</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
              Title
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '4px',
                color: '#fafafa',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '4px',
                color: '#fafafa',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task['status'])}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: '#0a0a0b',
                border: '1px solid #27272a',
                borderRadius: '4px',
                color: '#fafafa',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '4px',
                  color: '#fafafa',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '4px',
                  color: '#fafafa',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '4px' }}>
                Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                step="15"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#0a0a0b',
                  border: '1px solid #27272a',
                  borderRadius: '4px',
                  color: '#fafafa',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #27272a',
              borderRadius: '4px',
              color: '#ef4444',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #27272a',
                borderRadius: '4px',
                color: '#a1a1aa',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '4px',
                color: '#fafafa',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
