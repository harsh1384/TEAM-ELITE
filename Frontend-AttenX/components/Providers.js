'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '../contexts/ThemeContext'
import { Toaster } from './ui/toaster'

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}