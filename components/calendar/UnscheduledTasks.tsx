'use client'

import { useEffect, useRef } from 'react'
import { Draggable } from '@fullcalendar/interaction'
import { useApp } from '@/context/AppContext'
import type { Task } from '@/types'

export default function UnscheduledTasks() {
  const { state } = useApp()
  const containerRef = useRef<HTMLDivElement>(null)

  const unscheduledTasks = state.tasks.filter((t) => !t.scheduledDate)

  useEffect(() => {
    if (!containerRef.current) return

    const draggable = new Draggable(containerRef.current, {
      itemSelector: '.fc-event',
      eventData: (eventEl) => {
        const taskId = eventEl.getAttribute('data-task-id')
        const task = state.tasks.find((t) => t.id === taskId)
        if (!task) return {}

        return {
          id: task.id,
          title: task.title,
          duration: { minutes: task.duration || 60 },
          extendedProps: { task },
        }
      },
    })

    return () => {
      draggable.destroy()
    }
  }, [state.tasks])

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'complete':
        return '#22c55e'
      case 'in-progress':
        return '#eab308'
      default:
        return '#3b82f6'
    }
  }

  return (
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <h3 style={{
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#a1a1aa',
        marginBottom: '12px',
      }}>
        Unscheduled Tasks
      </h3>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {unscheduledTasks.length === 0 ? (
          <p style={{ fontSize: '12px', color: '#52525b', padding: '8px 0' }}>
            All tasks are scheduled
          </p>
        ) : (
          unscheduledTasks.map((task) => (
            <div
              key={task.id}
              className="fc-event"
              data-task-id={task.id}
              style={{
                padding: '8px 12px',
                backgroundColor: '#0a0a0b',
                border: '1px solid #27272a',
                borderLeft: `3px solid ${getStatusColor(task.status)}`,
                borderRadius: '4px',
                cursor: 'grab',
                fontSize: '13px',
                color: '#fafafa',
              }}
            >
              <div style={{ fontWeight: 500 }}>{task.title}</div>
              {task.description && (
                <div style={{
                  fontSize: '11px',
                  color: '#a1a1aa',
                  marginTop: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {task.description}
                </div>
              )}
              <div style={{
                fontSize: '10px',
                color: '#52525b',
                marginTop: '4px',
                textTransform: 'capitalize',
              }}>
                {task.status.replace('-', ' ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
