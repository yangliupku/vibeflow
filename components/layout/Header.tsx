'use client'

import { useApp } from '@/context/AppContext'
import ViewToggle from './ViewToggle'

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-medium tracking-tight">vibeflow</h1>
      </div>
      <ViewToggle />
    </header>
  )
}
