import { useState, useEffect } from 'react'
import { 
  Scan, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Eye,
  RefreshCw,
  Download,
  Settings,
  Zap,
  FileText,
  Image as ImageIcon
} from 'lucide-react'

const Processing = () => {
  const [processingJobs, setProcessingJobs] = useState([
    {
      id: 1,
      filename: 'attendance_sheet_math_101.jpg',
      status: 'completed',
      progress: 100,
      extractedData: {
        rollNumbers: 45,
        names: 45,
        attendanceMarks: 45,
        confidence: 94.2
      },
      processingTime: '2.3s',
      timestamp: '2024-01-15 10:30:25'
    },
    {
      id: 2,
      filename: 'physics_attendance_jan15.pdf',
      status: 'processing',
      progress: 67,
      extractedData: null,
      processingTime: null,
      timestamp: '2024-01-15 10:32:10'
    },
    {
      id: 3,
      filename: 'chemistry_sheet_scan.png',
      status: 'queued',
      progress: 0,
      extractedData: null,
      processingTime: null,
      timestamp: '2024-01-15 10:33:45'
    },
    {
      id: 4,
      filename: 'biology_attendance.jpg',
      status: 'error',
      progress: 0,
      extractedData: null,
      processingTime: null,
      timestamp: '2024-01-15 10:35:12',
      error: 'Low image quality - unable to extract table structure'
    }
  ])

  const [ocrSettings, setOcrSettings] = useState({
    confidence_threshold: 85,
    auto_rotation: true,
    noise_reduction: true,
    table_detection: 'advanced',
    language: 'english'
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'queued': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'processing': return RefreshCw
      case 'queued': return Clock
      case 'error': return AlertCircle
      default: return Clock
    }
  }

  const reprocessFile = (jobId) => {
    setProcessingJobs(jobs => 
      jobs.map(job => 
        job.id === jobId 
          ? { ...job, status: 'processing', progress: 0, error: null }
          : job
      )
    )
  }

  return (
    <div className="space-y-8">
      {/* Processing Overview */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">OCR Processing Center</h1>
            <p className="text-purple-100">
              Monitor and manage optical character recognition of attendance sheets
            </p>
          </div>
          <Scan className="h-16 w-16 text-purple-200" />
        </div>
      </div>

      {/* Processing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Processed</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">94.2%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-purple-600">2.1s</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Queue Length</p>
              <p className="text-2xl font-bold text-yellow-600">3</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* OCR Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">OCR Configuration</h2>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="70"
                max="99"
                value={ocrSettings.confidence_threshold}
                onChange={(e) => setOcrSettings({...ocrSettings, confidence_threshold: e.target.value})}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12">
                {ocrSettings.confidence_threshold}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Detection
            </label>
            <select 
              value={ocrSettings.table_detection}
              onChange={(e) => setOcrSettings({...ocrSettings, table_detection: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="ml_enhanced">ML Enhanced</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ocrSettings.auto_rotation}
                onChange={(e) => setOcrSettings({...ocrSettings, auto_rotation: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auto Rotation</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={ocrSettings.noise_reduction}
                onChange={(e) => setOcrSettings({...ocrSettings, noise_reduction: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Noise Reduction</span>
            </label>
          </div>
        </div>
      </div>

      {/* Processing Queue */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Processing Queue</h2>
        
        <div className="space-y-4">
          {processingJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status)
            return (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {job.filename.includes('.pdf') ? (
                      <FileText className="h-8 w-8 text-red-600" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-blue-600" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{job.filename}</h3>
                      <p className="text-sm text-gray-500">{job.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      <StatusIcon className={`h-3 w-3 mr-1 ${job.status === 'processing' ? 'animate-spin' : ''}`} />
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                    
                    {job.status === 'error' && (
                      <button
                        onClick={() => reprocessFile(job.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {(job.status === 'processing' || job.status === 'completed') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          job.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {job.error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{job.error}</p>
                  </div>
                )}

                {/* Extracted Data Summary */}
                {job.extractedData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{job.extractedData.rollNumbers}</p>
                      <p className="text-xs text-gray-600">Roll Numbers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{job.extractedData.names}</p>
                      <p className="text-xs text-gray-600">Names</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{job.extractedData.attendanceMarks}</p>
                      <p className="text-xs text-gray-600">Attendance Marks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{job.extractedData.confidence}%</p>
                      <p className="text-xs text-gray-600">Confidence</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-3">
                  {job.status === 'completed' && (
                    <>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Processing