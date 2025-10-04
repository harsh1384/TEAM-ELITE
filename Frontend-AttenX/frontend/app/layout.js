'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useState, useEffect } from 'react'
import { 
  Home, 
  Upload, 
  FileText, 
  AlertTriangle, 
  User, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = savedTheme ? savedTheme === 'true' : prefersDark
    
    setDarkMode(isDark)
    
    // Apply theme immediately to prevent flash
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Anomalies', href: '/anomalies', icon: AlertTriangle },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('darkMode');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = savedTheme ? savedTheme === 'true' : prefersDark;
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-white to-amber-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800`}>
        <div className="flex h-screen">
          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-amber-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-amber-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-white dark:from-gray-800 dark:to-gray-800">
              <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-300">
                AttendanceAI
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 px-3">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-white transition-all duration-200"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                )
              })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 dark:hover:bg-gray-700 hover:text-amber-800 dark:hover:text-white transition-all duration-200"
              >
                {darkMode ? (
                  <>
                    <Sun className="mr-3 h-5 w-5" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-3 h-5 w-5" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-amber-200 dark:border-gray-700">
              <div className="flex items-center justify-between h-16 px-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-amber-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700"
                >
                  <Menu className="h-5 w-5" />
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Welcome back, Admin
                  </div>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}