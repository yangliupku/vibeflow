'use client'

import QuickTodos from './QuickTodos'
import NotesArea from './NotesArea'

export default function Sidebar() {
  return (
    <aside className="flex w-80 flex-col border-l border-border bg-surface">
      <div className="flex flex-col gap-6 p-4 flex-1">
        <QuickTodos />
        <NotesArea />
      </div>
    </aside>
  )
}
