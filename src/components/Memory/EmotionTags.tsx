import React from 'react'
import { Heart, Smile, Frown, Star, Zap, Coffee } from 'lucide-react'

const emotions = [
  { id: 'happy', label: 'Gëzim', icon: Smile, color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
  { id: 'love', label: 'Dashuri', icon: Heart, color: 'text-red-500 bg-red-50 border-red-200' },
  { id: 'nostalgia', label: 'Nostalgjhi', icon: Star, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { id: 'pride', label: 'Krenari', icon: Zap, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { id: 'peaceful', label: 'Qetësi', icon: Coffee, color: 'text-green-500 bg-green-50 border-green-200' },
  { id: 'sad', label: 'Trishtim', icon: Frown, color: 'text-gray-500 bg-gray-50 border-gray-200' },
]

interface EmotionTagsProps {
  selectedEmotions: string[]
  onEmotionToggle: (emotionId: string) => void
}

const EmotionTags: React.FC<EmotionTagsProps> = ({ selectedEmotions, onEmotionToggle }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Si ndiheni duke e kujtuar këtë?
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {emotions.map((emotion) => {
          const Icon = emotion.icon
          const isSelected = selectedEmotions.includes(emotion.id)
          
          return (
            <button
              key={emotion.id}
              onClick={() => onEmotionToggle(emotion.id)}
              className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? `${emotion.color} border-opacity-100 shadow-sm`
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon size={20} className={isSelected ? emotion.color.split(' ')[0] : 'text-gray-400'} />
              <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                {emotion.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default EmotionTags