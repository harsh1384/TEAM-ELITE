'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  X, 
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  Clock
} from 'lucide-react'

export default function AnomaliesPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const anomalies = [
    {
      id: 1,
      type: 'signature_mismatch',
      severity: 'high',
      employee: 'John Smith',
      employeeId: 'EMP001',
      sheet: 'Morning Shift - 2024-01-15',
      sheetId: 'A-2024-001',
      description: 'Signature pattern significantly different from historical samples',
      confidence: 0.92,
      timestamp: '2024-01-15 09:30:00',
      status: 'pending',
      reviewedBy: null
    },
    {
      id: 2,
      type: 'duplicate_signature',
      severity: 'medium',
      employee: 'Sarah Johnson',
      employeeId: 'EMP045',
      sheet: 'Evening Shift - 2024-01-14',
      sheetId: 'B-2024-003',
      description: 'Identical signature pattern found in multiple entries',
      confidence: 0.87,
      timestamp: '2024-01-14 18:45:00',
      status: 'reviewed',
      reviewedBy: 'Admin User'
    },
    {
      id: 3,
      type: 'missing_signature',
      severity: 'low',
      employee: 'Mike Davis',
      employeeId: 'EMP023',
      sheet: 'Morning Shift - 2024-01-15',
      sheetId: 'A-2024-001',
      description: 'No signature detected in designated area',
      confidence: 0.95,
      timestamp: '2024-01-15 08:15:00',
      status: 'approved',
      reviewedBy: 'HR Manager'
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'flagged': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesFilter = filter === 'all' || anomaly.status === filter
    const matchesSearch = searchTerm === '' || 
      anomaly.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-amber-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white">
          Signature Anomalies
        </h1>
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Review and manage detected signature anomalies
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAnomalies.length} of {anomalies.length} anomalies
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Type & Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {anomaly.employee}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {anomaly.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                      {anomaly.severity} - {anomaly.type.replace('_', ' ')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2 w-16">
                        <div
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${anomaly.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {Math.round(anomaly.confidence * 100)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(anomaly.status)}`}>
                      {anomaly.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-amber-600 hover:text-amber-900 dark:text-amber-400">
                        <Eye className="h-4 w-4" />
                      </button>
                      {anomaly.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}