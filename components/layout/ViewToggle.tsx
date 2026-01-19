'use client'

import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function ViewToggle() {
  const { state, setView } = useApp()

  return (
    <div className="flex gap-1 rounded border border-border bg-background p-1">
      <button
        onClick={() => setView('kanban')}
        title="Kanban view (Cmd+1)"
        className={cn(
          'px-3 py-1 text-sm transition-colors',
          state.activeView === 'kanban'
            ? 'bg-surface text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        kanban
      </button>
      <button
        onClick={() => setView('calendar')}
        title="Calendar view (Cmd+2)"
        className={cn(
          'px-3 py-1 text-sm transition-colors',
          state.activeView === 'calendar'
            ? 'bg-surface text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        calendar
      </button>
    </div>
  )
}
