'use client'

import { useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg, DateSelectArg } from '@fullcalendar/core'
import type { EventResizeDoneArg, EventReceiveArg } from '@fullcalendar/interaction'
import { useApp } from '@/context/AppContext'
import type { Task } from '@/types'
import EventPopover from './EventPopover'

export default function CalendarView() {
  const { state, updateTask, dispatch } = useApp()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 })
  const calendarRef = useRef<FullCalendar>(null)

  const handleEventReceive = (info: EventReceiveArg) => {
    const taskId = info.draggedEl.getAttribute('data-task-id')
    const task = state.tasks.find((t) => t.id === taskId)

    if (task && info.event.start) {
      const scheduledDate = info.event.start.toISOString().split('T')[0]
      const scheduledTime = info.event.allDay
        ? undefined
        : info.event.start.toTimeString().slice(0, 5)

      updateTask({
        ...task,
        scheduledDate,
        scheduledTime,
        duration: task.duration || 60,
      })
    }

    // Remove the temporary event created by FullCalendar
    info.event.remove()
  }

  const scheduledTasks = state.tasks.filter((t) => t.scheduledDate)

  const events = scheduledTasks.map((task) => {
    const start = task.scheduledTime
      ? `${task.scheduledDate}T${task.scheduledTime}`
      : task.scheduledDate

    const end = task.scheduledTime && task.duration
      ? new Date(
          new Date(`${task.scheduledDate}T${task.scheduledTime}`).getTime() +
            task.duration * 60000
        ).toISOString()
      : undefined

    return {
      id: task.id,
      title: task.title,
      start,
      end,
      allDay: !task.scheduledTime,
      backgroundColor:
        task.status === 'complete'
          ? '#22c55e'
          : task.status === 'in-progress'
          ? '#eab308'
          : '#3b82f6',
      borderColor: 'transparent',
      extendedProps: { task },
    }
  })

  const handleEventClick = (info: EventClickArg) => {
    const task = info.event.extendedProps.task as Task
    setSelectedTask(task)
    setPopoverPosition({
      x: info.jsEvent.clientX,
      y: info.jsEvent.clientY,
    })
  }

  const handleEventDrop = (info: EventDropArg) => {
    const task = info.event.extendedProps.task as Task
    const newDate = info.event.start

    if (newDate) {
      const scheduledDate = newDate.toISOString().split('T')[0]
      const scheduledTime = info.event.allDay
        ? undefined
        : newDate.toTimeString().slice(0, 5)

      updateTask({
        ...task,
        scheduledDate,
        scheduledTime,
      })
    }
  }

  const handleEventResize = (info: EventResizeDoneArg) => {
    const task = info.event.extendedProps.task as Task
    const start = info.event.start
    const end = info.event.end

    if (start && end) {
      const duration = Math.round((end.getTime() - start.getTime()) / 60000)
      updateTask({
        ...task,
        duration,
      })
    }
  }

  const handleDateSelect = (info: DateSelectArg) => {
    const title = prompt('Task title:')
    if (title) {
      const scheduledDate = info.start.toISOString().split('T')[0]
      const scheduledTime = info.allDay
        ? undefined
        : info.start.toTimeString().slice(0, 5)

      const duration = info.allDay
        ? undefined
        : Math.round((info.end.getTime() - info.start.getTime()) / 60000)

      const maxOrder = state.tasks
        .filter((t) => t.status === 'todo')
        .reduce((max, t) => Math.max(max, t.order), -1)

      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        status: 'todo',
        scheduledDate,
        scheduledTime,
        duration,
        createdAt: new Date().toISOString(),
        order: maxOrder + 1,
      }

      dispatch({ type: 'ADD_TASK', payload: newTask })
    }

    const calendarApi = calendarRef.current?.getApi()
    calendarApi?.unselect()
  }

  return (
    <div className="h-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        height="100%"
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        select={handleDateSelect}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
        eventResizableFromStart={true}
        droppable={true}
        eventReceive={handleEventReceive}
      />
      {selectedTask && (
        <EventPopover
          task={selectedTask}
          position={popoverPosition}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}
