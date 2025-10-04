import { SignIn } from '@clerk/clerk-react'
import { BarChart3 } from 'lucide-react'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BarChart3 className="h-12 w-12 text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Attendance Anomaly System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn 
            redirectUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-primary hover:bg-primary/90 text-sm normal-case",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage