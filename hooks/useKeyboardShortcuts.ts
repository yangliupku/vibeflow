'use client'

import { useEffect } from 'react'
import { useApp } from '@/context/AppContext'

export function useKeyboardShortcuts() {
  const { state, setView } = useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Cmd/Ctrl + 1: Kanban view
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault()
        setView('kanban')
      }

      // Cmd/Ctrl + 2: Calendar view
      if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault()
        setView('calendar')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setView])
}
