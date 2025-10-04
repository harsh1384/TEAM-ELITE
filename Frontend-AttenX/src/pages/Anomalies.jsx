import { useState } from 'react'
import { 
  AlertTriangle, 
  Users, 
  FileX, 
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'

const Anomalies = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('all')

  // Mock data based on signature-related anomalies (since roll numbers and names are pre-printed)
  const missingSignatures = [
    {
      id: 1,
      roll_number: '2021023',
      student_name: 'SNEHA GUPTA',
      severity: 'high',
      last_seen: '2024-01-15',
      issue: 'Missing signature',
      signature_status: 'No signature found - Student marked absent'
    },
    {
      id: 2,
      roll_number: '2021067',
      student_name: 'VIKASH SINGH',
      severity: 'high',
      last_seen: '2024-01-14',
      issue: 'Missing signature',
      signature_status: 'Empty signature field'
    },
    {
      id: 3,
      roll_number: '2021089',
      student_name: 'AMIT KUMAR',
      severity: 'high',
      last_seen: '2024-01-13',
      issue: 'Missing signature',
      signature_status: 'Signature field blank'
    }
  ]

  const suspiciousSignatures = [
    {
      id: 4,
      roll_number: '2021045',
      student_name: 'PRIYA PATEL',
      severity: 'high',
      last_seen: '2024-01-15',
      issue: 'Forged signature suspected',
      signature_status: 'Signature differs from previous records',
      confidence: '85%'
    },
    {
      id: 5,
      roll_number: '2021098',
      student_name: 'ANJALI VERMA',
      severity: 'medium',
      last_seen: '2024-01-14',
      issue: 'Suspicious signature pattern',
      signature_status: 'Similar to another student signature',
      confidence: '72%'
    },
    {
      id: 6,
      roll_number: '2021156',
      student_name: 'ROHIT SHARMA',
      severity: 'high',
      last_seen: '2024-01-13',
      issue: 'Proxy signature detected',
      signature_status: 'Signature matches another student',
      confidence: '91%'
    }
  ]

  const illegibleSignatures = [
    {
      id: 7,
      roll_number: '2021034',
      student_name: 'DEEPAK SINGH',
      severity: 'medium',
      last_seen: '2024-01-15',
      issue: 'Illegible signature',
      signature_status: 'Cannot verify signature authenticity'
    },
    {
      id: 8,
      roll_number: '2021078',
      student_name: 'KAVYA SHARMA',
      severity: 'low',
      last_seen: '2024-01-14',
      issue: 'Partially illegible signature',
      signature_status: 'Signature partially readable'
    },
    {
      id: 9,
      roll_number: '2021112',
      student_name: 'ARJUN PATEL',
      severity: 'medium',
      last_seen: '2024-01-13',
      issue: 'Scribbled signature',
      signature_status: 'Signature appears rushed or scribbled'
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  const handleRefresh = () => {
    alert('Refreshing signature anomaly detection...')
  }

  const handleExport = () => {
    alert('Exporting signature anomaly report...')
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Signature Anomaly Detection</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review signature-related issues in attendance records</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">Missing Signatures</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{missingSignatures.length}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FileX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">Students without signatures</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Suspicious Signatures</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{suspiciousSignatures.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Potential forgeries or proxies</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Illegible Signatures</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{illegibleSignatures.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Unreadable or unclear signatures</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Total Anomalies</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {missingSignatures.length + suspiciousSignatures.length + illegibleSignatures.length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">Requires manual review</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by roll number or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div> 
     {/* Missing Signatures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileX className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Missing Signatures</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span>{missingSignatures.length} entries found</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {missingSignatures.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {anomaly.roll_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.signature_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                      <AlertTriangle className={`h-3 w-3 mr-1 ${getSeverityIcon(anomaly.severity)}`} />
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.last_seen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspicious Signatures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Suspicious Signatures</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span>{suspiciousSignatures.length} entries found</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {suspiciousSignatures.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {anomaly.roll_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.signature_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {anomaly.confidence}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                      <AlertTriangle className={`h-3 w-3 mr-1 ${getSeverityIcon(anomaly.severity)}`} />
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.last_seen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Illegible Signatures */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Illegible Signatures</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Eye className="h-4 w-4" />
            <span>{illegibleSignatures.length} entries found</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Seen</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {illegibleSignatures.map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {anomaly.roll_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.signature_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                      <AlertTriangle className={`h-3 w-3 mr-1 ${getSeverityIcon(anomaly.severity)}`} />
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {anomaly.last_seen}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <h4 className="font-medium mb-3">For Missing Signatures:</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Mark student as absent</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Contact student for verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Check with faculty</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">For Suspicious Signatures:</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Compare with signature database</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Flag for manual verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Investigate proxy attendance</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">For Illegible Signatures:</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Request clearer signature</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Manual review required</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Update signature guidelines</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Anomalies