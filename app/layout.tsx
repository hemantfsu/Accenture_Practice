import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Accenture Mock Prep - Premium Assessment Platform',
  description: 'Interactive gamified mock tests for Accenture placement preparation',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: '#6c46ff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Accenture Prep',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-4 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm md:text-base font-medium">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
                <span className="font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Hemant Dhangar
                </span>
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
