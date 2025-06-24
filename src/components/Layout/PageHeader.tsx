import React from 'react'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showMenu?: boolean
  rightAction?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  rightAction,
}) => {
  const navigate = useNavigate()

  return (
    <header className="bg-gradient-to-br from-primary-500 to-primary-600 text-white text-center px-4 py-6 pb-8">
      <div className="flex items-center justify-between mb-2">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div />
        )}
        
        {rightAction || (showMenu && (
          <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors">
            <MoreVertical size={24} />
          </button>
        ))}
      </div>
      
      <div>
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        {subtitle && (
          <p className="text-primary-100 text-sm opacity-90">{subtitle}</p>
        )}
      </div>
    </header>
  )
}

export default PageHeader