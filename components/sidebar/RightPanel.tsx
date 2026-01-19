'use client'

import ResizablePanel from '@/components/ui/ResizablePanel'
import NotesArea from './NotesArea'

export default function RightPanel() {
  return (
    <ResizablePanel
      defaultWidth={280}
      minWidth={200}
      maxWidth={400}
      side="right"
      className="border-l border-border bg-surface"
    >
      <div className="flex flex-col p-4 h-full overflow-auto">
        <NotesArea />
      </div>
    </ResizablePanel>
  )
}
