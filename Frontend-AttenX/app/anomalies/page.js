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
    },
    {
      id: 4,
      type: 'signature_mismatch',
      severity: 'high',
      employee: 'Lisa Wilson',
      employeeId: 'EMP067',
      sheet: 'Night Shift - 2024-01-13',
      sheetId: 'C-2024-002',
      description: 'Signature shows signs of potential forgery',
      confidence: 0.89,
      timestamp: '2024-01-13 23:20:00',
      status: 'flagged',
      reviewedBy: 'Security Team'
    },
    {
      id: 5,
      type: 'unusual_pattern',
      severity: 'medium',
      employee: 'Robert Brown',
      employeeId: 'EMP089',
      sheet: 'Morning Shift - 2024-01-12',
      sheetId: 'A-2024-005',
      description: 'Signature pressure and speed patterns are inconsistent',
      confidence: 0.76,
      timestamp: '2024-01-12 07:45:00',
      status: 'pending',
      reviewedBy: null
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'signature_mismatch': return <AlertTriangle className="h-4 w-4" />
      case 'duplicate_signature': return <FileText className="h-4 w-4" />
      case 'missing_signature': return <X className="h-4 w-4" />
      case 'unusual_pattern': return <Eye className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredAnomalies = anomalies.filter(anomaly => {
    const matchesFilter = filter === 'all' || anomaly.status === filter
    const matchesSearch = searchTerm === '' || 
      anomaly.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anomaly.sheet.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Signature Anomalies
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and manage detected signature anomalies
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee or sheet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAnomalies.length} of {anomalies.length} anomalies
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type & Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sheet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAnomalies.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                        {getTypeIcon(anomaly.type)}
                        <span className="ml-1 capitalize">{anomaly.severity}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                      {anomaly.type.replace('_', ' ')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
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
                    <div className="text-sm text-gray-900 dark:text-white">
                      {anomaly.sheet}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {anomaly.sheetId}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            anomaly.confidence >= 0.9 ? 'bg-red-500' :
                            anomaly.confidence >= 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
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
                    {anomaly.reviewedBy && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        by {anomaly.reviewedBy}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Eye className="h-4 w-4" />
                      </button>
                      {anomaly.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  High Severity
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {anomalies.filter(a => a.severity === 'high').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Medium Severity
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {anomalies.filter(a => a.severity === 'medium').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Review
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {anomalies.filter(a => a.status === 'pending').length}
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
                  Resolved
                </div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {anomalies.filter(a => a.status === 'approved').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}