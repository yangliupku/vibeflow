'use client'

import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Task } from '@/types'
import TaskCard from './TaskCard'
import { cn } from '@/lib/utils'

interface ColumnProps {
  id: Task['status']
  title: string
  tasks: Task[]
}

export default function Column({ id, title, tasks }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '4px',
        border: '1px solid #27272a',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : '#0a0a0b',
        minWidth: '200px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #27272a',
        padding: '8px 12px'
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 500, color: '#a1a1aa' }}>{title}</h2>
        <span style={{ fontSize: '12px', color: '#a1a1aa' }}>{tasks.length}</span>
      </div>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflowY: 'auto',
        padding: '16px'
      }}>
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: '#a1a1aa'
          }}>
            drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}
