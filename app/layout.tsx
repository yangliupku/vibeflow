import type { Metadata } from 'next'
import { AppProvider } from '@/context/AppContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vibeflow',
  description: 'Project management for vibe coders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
