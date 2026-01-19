'use client'

import { useApp } from '@/context/AppContext'
import ResizablePanel from '@/components/ui/ResizablePanel'
import QuickTodos from './QuickTodos'
import UnscheduledTasks from '@/components/calendar/UnscheduledTasks'

export default function LeftPanel() {
  const { state } = useApp()
  const isCalendarView = state.activeView === 'calendar'

  return (
    <ResizablePanel
      defaultWidth={280}
      minWidth={200}
      maxWidth={400}
      side="left"
      className="border-r border-border bg-surface"
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        height: '100%',
        gap: '16px',
      }}>
        {isCalendarView ? (
          <>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <QuickTodos />
            </div>
            <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }} />
            <UnscheduledTasks />
          </>
        ) : (
          <QuickTodos />
        )}
      </div>
    </ResizablePanel>
  )
}
