import { UserButton } from '@clerk/clerk-react'
import { Menu, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-gray-900">
              Attendance Anomaly System
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </nav>
  )
}

export default Navbar