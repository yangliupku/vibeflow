'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth: number
  minWidth: number
  maxWidth: number
  side: 'left' | 'right'
  className?: string
}

export default function ResizablePanel({
  children,
  defaultWidth,
  minWidth,
  maxWidth,
  side,
  className,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const isResizing = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const stopResizing = useCallback(() => {
    isResizing.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current || !panelRef.current) return

      let newWidth: number
      if (side === 'left') {
        newWidth = e.clientX
      } else {
        newWidth = window.innerWidth - e.clientX
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    },
    [minWidth, maxWidth, side]
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div
      ref={panelRef}
      className={cn('relative flex-shrink-0', className)}
      style={{ width }}
    >
      {children}
      <div
        onMouseDown={startResizing}
        className={cn(
          'absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent/50 transition-colors z-10',
          side === 'left' ? 'right-0' : 'left-0'
        )}
      />
    </div>
  )
}
