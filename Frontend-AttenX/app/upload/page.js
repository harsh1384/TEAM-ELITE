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

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      anomalies: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const processFiles = async () => {
    setProcessing(true)
    
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        // Simulate processing
        setFiles(prev => prev.map(file => 
          file.id === files[i].id 
            ? { ...file, status: 'processing', progress: 0 }
            : file
        ))

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200))
          setFiles(prev => prev.map(file => 
            file.id === files[i].id 
              ? { ...file, progress }
              : file
          ))
        }

        // Simulate completion with random anomalies
        const anomalies = Math.floor(Math.random() * 5)
        setFiles(prev => prev.map(file => 
          file.id === files[i].id 
            ? { 
                ...file, 
                status: 'completed', 
                progress: 100,
                anomalies
              }
            : file
        ))
      }
    }
    
    setProcessing(false)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Attendance Sheets
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload scanned attendance sheets for signature anomaly detection
        </p>
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

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Uploaded Files ({files.length})
              </h2>
              {files.some(f => f.status === 'pending') && (
                <button
                  onClick={processFiles}
                  disabled={processing}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {processing ? 'Processing...' : 'Process All'}
                </button>
              )}
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
                      
                      {file.status === 'processing' && (
                        <div className="mt-2">
                          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full h-2 shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-sm"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Processing... {file.progress}%
                          </p>
                        </div>
                      )}
                      
                      {file.status === 'completed' && (
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Processed</span>
                          </div>
                          {file.anomalies > 0 && (
                            <div className="flex items-center text-red-600 dark:text-red-400">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span className="text-xs">{file.anomalies} anomalies detected</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Download className="h-4 w-4" />
                        </button>
                      </>
                    )}
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
          Processing Guidelines
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
          <li>• Ensure attendance sheets are clearly scanned with good lighting</li>
          <li>• Signatures should be visible and not cut off at edges</li>
          <li>• PDF files are preferred for better text recognition</li>
          <li>• Processing time depends on file size and signature count</li>
          <li>• Anomalies will be flagged for manual review</li>
        </ul>
      </div>
    </div>
  )
}