import { type ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './provider'
import { api } from '@/lib/api'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My App',
    description: 'My app description',
  }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
