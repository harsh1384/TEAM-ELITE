'use client'

import { useState, useEffect } from 'react'
import apiClient from '../../lib/api'

export default function TestApiPage() {
  const [status, setStatus] = useState('Testing...')
  const [results, setResults] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const addResult = (test, success, data = null) => {
    setResults(prev => [...prev, { test, success, data, timestamp: new Date().toLocaleTimeString() }])
  }

  const testAPI = async () => {
    try {
      setStatus('Running API tests...')
      setResults([])

      // Test 1: Health Check
      try {
        const healthResponse = await fetch('http://localhost:8000/health')
        const healthData = await healthResponse.json()
        addResult('Health Check', true, healthData.status)
      } catch (error) {
        addResult('Health Check', false, error.message)
      }

      // Test 2: Login
      try {
        const loginResponse = await apiClient.login('admin@company.com', 'admin123')
        if (loginResponse.success) {
          addResult('Login', true, `Welcome ${loginResponse.data.user.firstName}`)
          setIsLoggedIn(true)
        } else {
          addResult('Login', false, 'Login failed')
        }
      } catch (error) {
        addResult('Login', false, error.message)
      }

      // Test 3: Dashboard Stats (requires login)
      if (isLoggedIn || apiClient.getToken()) {
        try {
          const statsResponse = await apiClient.getDashboardStats()
          if (statsResponse.success) {
            addResult('Dashboard Stats', true, `${statsResponse.data.totalSheets} sheets, ${statsResponse.data.totalAnomalies} anomalies`)
          }
        } catch (error) {
          addResult('Dashboard Stats', false, error.message)
        }

        // Test 4: User Profile
        try {
          const profileResponse = await apiClient.getProfile()
          if (profileResponse.success) {
            addResult('User Profile', true, `${profileResponse.data.firstName} ${profileResponse.data.lastName}`)
          }
        } catch (error) {
          addResult('User Profile', false, error.message)
        }

        // Test 5: Anomalies List
        try {
          const anomaliesResponse = await apiClient.getAnomalies()
          if (anomaliesResponse.success) {
            addResult('Anomalies List', true, `${anomaliesResponse.data.anomalies.length} anomalies found`)
          }
        } catch (error) {
          addResult('Anomalies List', false, error.message)
        }
      }

      setStatus('Tests completed!')
    } catch (error) {
      setStatus('Tests failed!')
      addResult('General Error', false, error.message)
    }
  }

  useEffect(() => {
    testAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-amber-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-6">
            API Connection Test
          </h1>
          
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                status.includes('completed') ? 'bg-green-500' : 
                status.includes('failed') ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`} />
              <span className="text-lg font-medium text-gray-900 dark:text-white">{status}</span>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.test}
                    </span>
                    <span className={`text-sm ${
                      result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {result.success ? '✅ Success' : '❌ Failed'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {result.timestamp}
                  </span>
                </div>
                {result.data && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {typeof result.data === 'string' ? result.data : JSON.stringify(result.data)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
              Backend Status
            </h3>
            <div className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <div>• Backend URL: http://localhost:8000</div>
              <div>• API Base: http://localhost:8000/api</div>
              <div>• Database: NeonDB (Connected)</div>
              <div>• Authentication: JWT Tokens</div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={testAPI}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md font-medium transition-all duration-200"
            >
              Run Tests Again
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md font-medium transition-all duration-200"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}