'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useApp } from '@/context/AppContext'
import type { Task } from '@/types'
import Column from './Column'
import TaskCard from './TaskCard'
import AddTaskForm from './AddTaskForm'

const columns: { id: Task['status']; title: string }[] = [
  { id: 'todo', title: 'todo' },
  { id: 'in-progress', title: 'in progress' },
  { id: 'complete', title: 'complete' },
]

export default function KanbanBoard() {
  const { state, dispatch, moveTask } = useApp()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const getTasksByStatus = (status: Task['status']) => {
    return state.tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = state.tasks.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    // We don't move during drag over - only on drag end
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const activeTask = state.tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // Check if dropping over a column directly
    const targetColumn = columns.find((col) => col.id === overId)
    if (targetColumn) {
      if (activeTask.status !== targetColumn.id) {
        moveTask(activeId, targetColumn.id)
      }
      return
    }

    // Check if dropping over another task
    const overTask = state.tasks.find((t) => t.id === overId)
    if (overTask) {
      // If the task is in a different column, move it there
      if (activeTask.status !== overTask.status) {
        moveTask(activeId, overTask.status)
        return
      }

      // Same column - reorder
      const columnTasks = getTasksByStatus(activeTask.status)
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId)
      const newIndex = columnTasks.findIndex((t) => t.id === overId)

      if (oldIndex !== newIndex) {
        const reordered = [...columnTasks]
        const [removed] = reordered.splice(oldIndex, 1)
        reordered.splice(newIndex, 0, removed)

        // Update order values
        const updatedTasks = state.tasks.map((t) => {
          const idx = reordered.findIndex((r) => r.id === t.id)
          if (idx !== -1) {
            return { ...t, order: idx }
          }
          return t
        })

        dispatch({ type: 'SET_TASKS', payload: updatedTasks })
      }
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ maxWidth: '400px' }}>
          <AddTaskForm />
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: 'flex', flex: 1, gap: '24px' }}>
            {columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={getTasksByStatus(column.id)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
