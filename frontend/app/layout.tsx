import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CipherStudio - Browser-Based React IDE',
  description: 'Build and preview React projects in your browser',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
