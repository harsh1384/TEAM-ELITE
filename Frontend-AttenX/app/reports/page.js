'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
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

  const anomalyTypes = [
    { type: 'Signature Mismatch', count: 12, percentage: 52.2 },
    { type: 'Duplicate Signature', count: 6, percentage: 26.1 },
    { type: 'Missing Signature', count: 3, percentage: 13.0 },
    { type: 'Unusual Pattern', count: 2, percentage: 8.7 }
  ]

  const topEmployees = [
    { name: 'John Smith', anomalies: 4, sheets: 15, rate: 26.7 },
    { name: 'Sarah Johnson', anomalies: 3, sheets: 18, rate: 16.7 },
    { name: 'Mike Davis', anomalies: 3, sheets: 12, rate: 25.0 },
    { name: 'Lisa Wilson', anomalies: 2, sheets: 20, rate: 10.0 },
    { name: 'Robert Brown', anomalies: 2, sheets: 14, rate: 14.3 }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics & Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comprehensive analysis of attendance anomaly detection performance
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="anomalies">Anomaly Report</option>
                <option value="performance">Performance Report</option>
              </select>
            </div>

            <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Sheets
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryStats.totalSheets}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Signatures
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryStats.totalSignatures.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Anomalies
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryStats.anomaliesDetected}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Accuracy Rate
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryStats.accuracyRate}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg Processing
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {summaryStats.avgProcessingTime}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {day.day}
                    </div>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-32">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
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

        {/* Anomaly Types */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Anomaly Types Distribution
            </h3>
            <div className="space-y-4">
              {anomalyTypes.map((type, index) => (
                <div key={type.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-yellow-500' :
                      index === 2 ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {type.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 w-24">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-yellow-500' :
                          index === 2 ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {type.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Employees with Anomalies */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Employees Requiring Attention
          </h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Anomalies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total Sheets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Anomaly Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {topEmployees.map((employee, index) => (
                  <tr key={employee.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {employee.anomalies}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {employee.sheets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2 w-16">
                          <div
                            className={`h-2 rounded-full ${
                              employee.rate > 20 ? 'bg-red-500' :
                              employee.rate > 15 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(employee.rate * 2, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {employee.rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TrendingUp className={`h-4 w-4 ${
                        index % 2 === 0 ? 'text-red-500' : 'text-green-500'
                      }`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}