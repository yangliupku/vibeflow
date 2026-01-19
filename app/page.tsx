'use client'

import { useApp } from '@/context/AppContext'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import Header from '@/components/layout/Header'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import LeftPanel from '@/components/sidebar/LeftPanel'
import RightPanel from '@/components/sidebar/RightPanel'
import CalendarView from '@/components/calendar/CalendarView'

export default function Home() {
  const { state } = useApp()
  useKeyboardShortcuts()

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <div className="flex-1 overflow-auto">
          {state.activeView === 'kanban' ? (
            <KanbanBoard />
          ) : (
            <div className="h-full p-4">
              <CalendarView />
            </div>
          )}
        </div>
        <RightPanel />
      </main>
    </div>
  )
}
