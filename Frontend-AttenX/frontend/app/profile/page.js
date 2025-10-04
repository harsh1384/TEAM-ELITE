'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3,
  Save,
  Camera,
  Key,
  Bell,
  Clock,
  Award,
  Activity,
  Shield
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Human Resources',
    position: 'HR Manager',
    location: 'New York, NY',
    employeeId: 'EMP001',
    timezone: 'America/New_York',
    bio: 'Experienced HR professional with over 8 years in talent management and employee relations.'
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    anomalyAlerts: true,
    weeklyReports: true,
    systemUpdates: false
  })

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would call the API to save the profile
    console.log('Saving profile:', profile)
  }

  const stats = [
    { name: 'Sheets Processed', value: '1,247', icon: Activity, color: 'text-blue-600' },
    { name: 'Anomalies Reviewed', value: '89', icon: Shield, color: 'text-red-600' },
    { name: 'Reports Generated', value: '23', icon: Award, color: 'text-green-600' },
    { name: 'Days Active', value: '156', icon: Clock, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-amber-200 dark:border-gray-700 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white">
          Profile
        </h1>
        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white">
                  Personal Information
                </h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-md text-sm font-medium transition-all duration-200"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-2 shadow-md border border-amber-200 dark:border-gray-600">
                      <Camera className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </button>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {profile.position} • {profile.department}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Employee ID: {profile.employeeId}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => handleProfileChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) => handleProfileChange('position', e.target.value)}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-4">
                Activity Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 ${stat.color} mr-3`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {stat.name}
                        </span>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-amber-200 dark:border-gray-700">
            <div className="p-6">
              <h3 className="text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:text-white mb-4">
                <Bell className="inline h-5 w-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleNotificationChange(key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}