'use client'

import { 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Clock,
  Eye
} from 'lucide-react'

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Scanned',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: FileText,
    },
    {
      name: 'Anomalies Detected',
      value: '23',
      change: '-8%',
      changeType: 'negative',
      icon: AlertTriangle,
    },
    {
      name: 'Verified Signatures',
      value: '1,224',
      change: '+15%',
      changeType: 'positive',
      icon: CheckCircle,
    },
    {
      name: 'Active Users',
      value: '156',
      change: '+3%',
      changeType: 'positive',
      icon: Users,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'anomaly',
      message: 'Signature anomaly detected in Sheet #A-2024-001',
      time: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'upload',
      message: 'New attendance sheet uploaded: Morning Shift',
      time: '15 minutes ago',
      severity: 'normal'
    },
    {
      id: 3,
      type: 'verification',
      message: 'Batch verification completed for 45 signatures',
      time: '1 hour ago',
      severity: 'normal'
    },
    {
      id: 4,
      type: 'anomaly',
      message: 'Duplicate signature pattern found in Sheet #B-2024-003',
      time: '2 hours ago',
      severity: 'medium'
    },
    {
      id: 5,
      type: 'system',
      message: 'Daily backup completed successfully',
      time: '3 hours ago',
      severity: 'normal'
    }
  ]

  const quickActions = [
    {
      name: 'Upload New Sheet',
      description: 'Scan and analyze attendance sheets',
      href: '/upload',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'View Anomalies',
      description: 'Review detected signature anomalies',
      href: '/anomalies',
      icon: AlertTriangle,
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      name: 'Generate Report',
      description: 'Create detailed analysis reports',
      href: '/reports',
      icon: TrendingUp,
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-amber-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Monitor attendance anomaly detection and system performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-amber-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-amber-600 dark:text-amber-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="relative group bg-gradient-to-br from-white to-amber-50 dark:bg-gray-700 p-6 rounded-lg border border-amber-200 dark:border-gray-600 hover:shadow-lg hover:border-amber-300 transition-all duration-200"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-md">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {action.name}
                    </h3>
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      {action.description}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                          activity.severity === 'high' 
                            ? 'bg-red-500' 
                            : activity.severity === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}>
                          {activity.type === 'anomaly' && <AlertTriangle className="h-4 w-4 text-white" />}
                          {activity.type === 'upload' && <FileText className="h-4 w-4 text-white" />}
                          {activity.type === 'verification' && <CheckCircle className="h-4 w-4 text-white" />}
                          {activity.type === 'system' && <Clock className="h-4 w-4 text-white" />}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {activity.message}
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}