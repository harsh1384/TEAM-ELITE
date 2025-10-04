'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('7days')
  const [reportType, setReportType] = useState('summary')

  const summaryStats = {
    totalSheets: 156,
    totalSignatures: 2847,
    anomaliesDetected: 23,
    accuracyRate: 98.2,
    avgProcessingTime: 2.3
  }

  const weeklyData = [
    { day: 'Mon', sheets: 25, anomalies: 3, accuracy: 98.5 },
    { day: 'Tue', sheets: 28, anomalies: 2, accuracy: 99.1 },
    { day: 'Wed', sheets: 22, anomalies: 4, accuracy: 97.8 },
    { day: 'Thu', sheets: 30, anomalies: 1, accuracy: 99.3 },
    { day: 'Fri', sheets: 26, anomalies: 5, accuracy: 97.2 },
    { day: 'Sat', sheets: 15, anomalies: 2, accuracy: 98.7 },
    { day: 'Sun', sheets: 10, anomalies: 6, accuracy: 96.5 }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-amber-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white">
          Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Comprehensive analysis of attendance anomaly detection performance
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
              
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="anomalies">Anomaly Report</option>
              </select>
            </div>

            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md text-sm font-medium transition-all duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sheets</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{summaryStats.totalSheets}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Signatures</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{summaryStats.totalSignatures.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Anomalies</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{summaryStats.anomaliesDetected}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Accuracy Rate</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{summaryStats.accuracyRate}%</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Processing</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{summaryStats.avgProcessingTime}s</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-4">
            Weekly Activity
          </h3>
          <div className="space-y-4">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {day.day}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-32">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${(day.sheets / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {day.sheets} sheets
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    {day.anomalies} anomalies
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {day.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}