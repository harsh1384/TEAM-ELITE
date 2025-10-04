import { useState, useRef } from 'react'
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Download,
  Eye,
  Loader2,
  FileSpreadsheet,
  Info,
  ArrowRight,
  Zap
} from 'lucide-react'

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedData, setUploadedData] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  // Mock data for demonstration
  const mockUploadedData = {
    total_records: 1250,
    valid_records: 1198,
    invalid_records: 52,
    preview: [
      { roll_number: 'CS001', student_name: 'John Doe', subject: 'Mathematics', status: 'Present', date: '2024-01-15' },
      { roll_number: 'CS002', student_name: 'Jane Smith', subject: 'Physics', status: 'Absent', date: '2024-01-15' },
      { roll_number: 'CS003', student_name: 'Mike Johnson', subject: 'Chemistry', status: 'Present', date: '2024-01-15' },
      { roll_number: 'CS004', student_name: 'Sarah Wilson', subject: 'Biology', status: 'Present', date: '2024-01-15' },
      { roll_number: 'CS005', student_name: 'David Brown', subject: 'Mathematics', status: 'Absent', date: '2024-01-15' },
    ]
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleFileSelection = (selectedFile) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf'
    ]
    
    if (allowedTypes.includes(selectedFile.type) || 
        selectedFile.name.match(/\.(jpg|jpeg|png|webp|pdf)$/i)) {
      setFile(selectedFile)
      setUploadedData(null)
    } else {
      alert('Please select an image file (JPG, PNG, WebP) or PDF document.')
    }
  }

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      handleFileSelection(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.')
      return
    }

    setUploading(true)
    // Simulate upload delay
    setTimeout(() => {
      setUploadedData(mockUploadedData)
      setUploading(false)
    }, 2000)
  }

  const handleProcess = async () => {
    setProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      setProcessing(false)
      alert('Data processed successfully! Anomalies detected and reports generated.')
    }, 3000)
  }

  const removeFile = () => {
    setFile(null)
    setUploadedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upload Attendance Sheets</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload scanned attendance sheets or photos and let our OCR-powered system extract and analyze student signatures for anomaly detection.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UploadIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Upload</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Upload scanned attendance sheets or photos. Supported formats: Images (JPG, PNG, WebP) and PDF documents
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-105' 
              : file 
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                dragActive ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <UploadIcon className={`h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {dragActive ? 'Drop your document here' : 'Upload attendance sheet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Drag and drop your scanned attendance sheet or photo here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  <span>Choose Document</span>
                </button>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Maximum file size: 10MB • Supported: JPG, PNG, WebP, PDF
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center space-x-6">
              <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
                <FileText className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{file.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ File ready for upload
                </p>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-red-500" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/*,application/pdf"
            onChange={handleFileChange}
          />
        </div>

        {/* Upload Button */}
        {file && !uploadedData && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="h-6 w-6" />
                  <span>Upload & Process</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div> 
     {/* Upload Results */}
      {uploadedData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Successful</h2>
              <p className="text-gray-600 dark:text-gray-400">Your file has been processed and analyzed</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{uploadedData.total_records}</p>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Records</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{uploadedData.valid_records}</p>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Valid Records</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500 rounded-xl shadow-lg">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{uploadedData.invalid_records}</p>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Invalid Records</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Preview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Data Preview</h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                Showing first 5 records
              </span>
            </div>
            
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {Object.keys(uploadedData.preview[0] || {}).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {key.replace('_', ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {uploadedData.preview.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
            >
              {processing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-6 w-6" />
                  <span>Process OCR & Detect Anomalies</span>
                </>
              )}
            </button>
            
            <button className="inline-flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Download className="h-6 w-6" />
              <span>Download Template</span>
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <Info className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">Document Requirements</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Supported Formats:</h4>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>JPEG (.jpg, .jpeg)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>PNG (.png)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>WebP (.webp)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>PDF (.pdf)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Maximum size: 10MB</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>High resolution recommended</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload