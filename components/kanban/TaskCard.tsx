'use client'

import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '@/types'
import { useApp } from '@/context/AppContext'
import TaskModal from './TaskModal'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { deleteTask } = useApp()
  const [showModal, setShowModal] = useState(false)
  const dragStartPos = useRef<{ x: number; y: number } | null>(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!dragStartPos.current) return

    const distance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.current.x, 2) +
      Math.pow(e.clientY - dragStartPos.current.y, 2)
    )

    // Only open modal if it was a click (not a drag)
    if (distance < 5) {
      setShowModal(true)
    }
    dragStartPos.current = null
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          padding: '12px',
          backgroundColor: '#141416',
          border: '1px solid #27272a',
          borderRadius: '4px',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.5 : 1,
        }}
        {...attributes}
        {...listeners}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', color: '#fafafa', wordBreak: 'break-word' }}>{task.title}</p>
            {task.description && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: '#a1a1aa', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {task.description}
              </p>
            )}
            {task.scheduledDate && (
              <p style={{ marginTop: '8px', fontSize: '12px', color: '#3b82f6' }}>
                {task.scheduledDate}
                {task.scheduledTime && ` ${task.scheduledTime}`}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteTask(task.id)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              cursor: 'pointer',
              fontSize: '14px',
              opacity: 0.5,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#ef4444' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = '#a1a1aa' }}
          >
            ×
          </button>
        </div>
      </div>
      {showModal && (
        <TaskModal task={task} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
