import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, Clock, Plus, User } from 'lucide-react'

const BottomNavigation: React.FC = () => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/family-tree', icon: Users, label: 'Family' },
    { to: '/add-memory', icon: Plus, label: 'Add', isSpecial: true },
    { to: '/timeline', icon: Clock, label: 'Timeline' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-primary-200 pb-safe z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map(({ to, icon: Icon, label, isSpecial }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                isSpecial
                  ? isActive
                    ? 'bg-primary-600 text-white shadow-lg scale-110'
                    : 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                  : isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
              }`
            }
          >
            <Icon size={isSpecial ? 24 : 20} strokeWidth={2} />
            <span className={`text-xs mt-1 font-medium ${isSpecial ? 'sr-only' : ''}`}>
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation