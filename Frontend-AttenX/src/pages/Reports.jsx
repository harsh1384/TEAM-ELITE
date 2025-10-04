import { useState } from 'react'
import { Download, BarChart3, PieChart, TrendingUp, Users, Calendar } from 'lucide-react'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data for demonstration
  const subjectData = [
    { subject: 'Mathematics', total: 120, present: 105, absent: 15, percentage: 87.5 },
    { subject: 'Physics', total: 115, present: 98, absent: 17, percentage: 85.2 },
    { subject: 'Chemistry', total: 118, present: 102, absent: 16, percentage: 86.4 },
    { subject: 'Biology', total: 122, present: 110, absent: 12, percentage: 90.2 },
    { subject: 'English', total: 125, present: 115, absent: 10, percentage: 92.0 },
  ]

  const handleDownload = (reportType) => {
    alert(`Downloading ${reportType} report...`)
  }

  return (
    <div className="space-y-8">
      {/* Header with Period Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <p className="text-gray-600 mt-2">View attendance statistics and download detailed reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="semester">This Semester</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-3xl font-bold text-green-600">88.7%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+2.3% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Active students</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Held</p>
              <p className="text-3xl font-bold text-purple-600">156</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reports Generated</p>
              <p className="text-3xl font-bold text-orange-600">45</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">This month</p>
        </div>
      </div>

      {/* Download Reports Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Download Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleDownload('subject-wise')}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Subject-wise Report</span>
          </button>
          <button
            onClick={() => handleDownload('student-wise')}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Student-wise Report</span>
          </button>
          <button
            onClick={() => handleDownload('summary')}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Summary Report</span>
          </button>
        </div>
      </div> 
     {/* Subject-wise Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Subject-wise Attendance</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <BarChart3 className="h-4 w-4" />
            <span>Attendance percentage by subject</span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjectData.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {subject.present}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {subject.absent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            subject.percentage >= 90 ? 'bg-green-500' :
                            subject.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">{subject.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trends</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Bar Chart - Attendance by Subject</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Overall Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Pie Chart - Present vs Absent</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports