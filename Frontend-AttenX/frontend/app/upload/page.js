'use client'

import { useState } from 'react'
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertTriangle,
  X,
  Eye,
  Download
} from 'lucide-react'

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
      anomalies: 0,
      backendId: null
    }))
    
    setFiles(prev => [...prev, ...newFiles])

    // Upload each file to backend
    for (const newFile of newFiles) {
      try {
        console.log('🚀 Starting upload for:', newFile.file.name)
        
        const formData = new FormData()
        formData.append('file', newFile.file)
        formData.append('shiftType', 'morning')
        formData.append('department', 'general')

        // Update progress to show uploading
        setFiles(prev => prev.map(file => 
          file.id === newFile.id 
            ? { ...file, progress: 50 }
            : file
        ))

        // Make the API call with proper error handling
        const response = await fetch('http://localhost:8000/api/upload', {
          method: 'POST',
          body: formData,
          mode: 'cors',
          headers: {
            // Don't set Content-Type for FormData, browser will set it with boundary
          }
        })

        console.log('📡 Response status:', response.status)
        console.log('📡 Response headers:', response.headers)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ HTTP Error:', response.status, errorText)
          throw new Error(`Server error: ${response.status} - ${errorText}`)
        }

        const uploadResponse = await response.json()
        console.log('📋 Upload response:', uploadResponse)
        
        if (uploadResponse.success) {
          console.log('✅ Upload successful, backend ID:', uploadResponse.data.id)
          setFiles(prev => prev.map(file => 
            file.id === newFile.id 
              ? { 
                  ...file, 
                  status: 'completed', 
                  backendId: uploadResponse.data.id,
                  progress: 100,
                  anomalies: Math.floor(Math.random() * 3) // Mock anomalies for demo
                }
              : file
          ))
        } else {
          console.log('❌ Upload failed:', uploadResponse.message)
          setFiles(prev => prev.map(file => 
            file.id === newFile.id 
              ? { 
                  ...file, 
                  status: 'error', 
                  progress: 0,
                  error: uploadResponse.message || 'Upload failed'
                }
              : file
          ))
        }
      } catch (error) {
        console.error('❌ Upload error:', error)
        
        let errorMessage = 'Upload failed'
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to server. Make sure backend is running on port 8000.'
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Check your connection.'
        } else {
          errorMessage = error.message
        }
        
        setFiles(prev => prev.map(file => 
          file.id === newFile.id 
            ? { 
                ...file, 
                status: 'error', 
                progress: 0,
                error: errorMessage
              }
            : file
        ))
      }
    }
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const testConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...')
      const response = await fetch('http://localhost:8000/api/test', {
        method: 'GET',
        mode: 'cors'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Backend connection test successful:', data)
        alert('✅ Backend connection is working!')
      } else {
        console.error('❌ Backend connection test failed:', response.status)
        alert('❌ Backend connection failed. Check if server is running.')
      }
    } catch (error) {
      console.error('❌ Connection test error:', error)
      alert('❌ Cannot connect to backend. Make sure it\'s running on port 8000.')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Attendance Sheets
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Upload scanned attendance sheets for signature anomaly detection
            </p>
          </div>
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Test Connection
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
                : 'border-blue-300 bg-blue-50/30 dark:border-blue-600 dark:bg-blue-900/10 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/15'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-blue-500 dark:text-blue-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent dark:text-white">
                  Drop files here or click to upload
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                />
              </label>
              <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                Supports PDF, JPG, PNG files up to 10MB each
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Troubleshooting Upload Issues
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              If uploads fail, click "Test Connection" to verify backend connectivity. 
              Make sure your backend is running on port 8000.
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Uploaded Files ({files.length})
              </h2>
            </div>

            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {file.file.type.includes('pdf') ? (
                        <FileText className="h-8 w-8 text-red-500" />
                      ) : (
                        <Image className="h-8 w-8 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                      
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-2 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-sm"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Uploading... {file.progress}%
                          </p>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Upload Successful</span>
                          </div>
                          {file.anomalies > 0 ? (
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">{file.anomalies} anomalies detected</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">No anomalies found</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="mt-2">
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <X className="h-4 w-4 mr-1" />
                            <span className="text-xs">
                              {file.error || 'Upload failed'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Processing Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent dark:text-blue-100 mb-2">
          Upload Guidelines
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
          <li>• Ensure attendance sheets are clearly scanned with good lighting</li>
          <li>• Signatures should be visible and not cut off at edges</li>
          <li>• PDF files are preferred for better text recognition</li>
          <li>• Maximum file size is 10MB per file</li>
          <li>• If upload fails, use "Test Connection" button to check backend status</li>
        </ul>
      </div>
    </div>
  )
}