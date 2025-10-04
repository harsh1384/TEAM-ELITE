import { Link } from 'react-router-dom'
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Upload,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Database
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-900/20',
      darkBorder: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Reports Generated',
      value: '45',
      change: '+8%',
      changeType: 'positive',
      icon: FileText,
      gradient: 'from-emerald-500 to-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      darkBorder: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Anomalies Detected',
      value: '12',
      change: '-23%',
      changeType: 'negative',
      icon: AlertTriangle,
      gradient: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50 dark:bg-red-900/20',
      darkBorder: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'Attendance Rate',
      value: '87.5%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-900/20',
      darkBorder: 'border-purple-200 dark:border-purple-800',
    },
  ]

  const quickActions = [
    {
      title: 'Upload Sheets',
      description: 'Scan attendance documents',
      icon: Upload,
      href: '/upload',
      gradient: 'from-blue-600 to-blue-700',
      hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
    },
    {
      title: 'View Reports',
      description: 'Analytics & insights',
      icon: BarChart3,
      href: '/reports',
      gradient: 'from-emerald-600 to-emerald-700',
      hoverGradient: 'hover:from-emerald-700 hover:to-emerald-800',
    },
    {
      title: 'Check Anomalies',
      description: 'Review suspicious entries',
      icon: AlertTriangle,
      href: '/anomalies',
      gradient: 'from-red-600 to-red-700',
      hoverGradient: 'hover:from-red-700 hover:to-red-800',
    },
  ]

  const recentActivity = [
    {
      id: 1,
      message: 'Attendance sheet processed via OCR',
      time: '2 hours ago',
      status: 'success',
      icon: CheckCircle,
    },
    {
      id: 2,
      message: '3 suspicious signatures detected',
      time: '4 hours ago',
      status: 'warning',
      icon: AlertTriangle,
    },
    {
      id: 3,
      message: 'Monthly report generated',
      time: '1 day ago',
      status: 'info',
      icon: FileText,
    },
    {
      id: 4,
      message: 'System backup completed',
      time: '2 days ago',
      status: 'success',
      icon: Database,
    },
  ]



  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'warning': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-500'
      case 'warning': return 'bg-amber-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Good morning, Admin</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Here's what's happening with your attendance system today.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date().toLocaleDateString('en-US', { year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                <stat.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400' 
                  : 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-md group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
                  <action.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className={`p-1.5 rounded-md ${getStatusColor(activity.status)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard