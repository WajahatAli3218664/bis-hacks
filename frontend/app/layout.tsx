import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Todo App',
  description: 'AI-powered todo application with purple theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50" suppressHydrationWarning>{children}</body>
    </html>
  )
}
