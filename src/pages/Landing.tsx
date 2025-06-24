import React, { useState } from 'react'
import { Heart, Users, Clock, Shield } from 'lucide-react'
import AuthForm from '../components/Auth/AuthForm'

const Landing: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const features = [
    {
      icon: Heart,
      title: 'Ruaj Kujteset',
      description: 'Regjistroni zërin, foto dhe histori për të ruajtur trashëgiminë familjare.',
    },
    {
      icon: Users,
      title: 'Familja Juaj',
      description: 'Krijoni pemën gjenealogjike dhe lidhni anëtarët e familjes.',
    },
    {
      icon: Clock,
      title: 'Linja Kohore',
      description: 'Shikoni kujteset tuaja në një linjë kohore të bukur dhe kronologjike.',
    },
    {
      icon: Shield,
      title: 'E Sigurt & Private',
      description: 'Të dhënat tuaja janë të sigurta dhe private, vetëm për familjen tuaj.',
    },
  ]

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-primary-100 flex items-center justify-center p-4">
        <AuthForm
          mode={authMode}
          onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-warm-50 to-primary-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-6">
                <Heart size={40} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Ruaj Trashëgiminë</span>
              <span className="block bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                Familjare
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Një arkiv dixhital i privatshëm për të ruajtur kujteset, historitë dhe zërat e familjes suaj shqiptare për brezat e ardhshëm.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuth(true)
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Filloni Falas
              </button>
              <button
                onClick={() => {
                  setAuthMode('signin')
                  setShowAuth(true)
                }}
                className="w-full sm:w-auto border-2 border-primary-500 text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all"
              >
                Hyni në Llogari
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-200 to-transparent rounded-full blur-3xl opacity-30 -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-warm-200 to-transparent rounded-full blur-3xl opacity-30 translate-y-48 -translate-x-48"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pse të zgjedhni Trashëgiminë Dixhitale?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Një aplikacion i ndërtuar me dashuri për familjet shqiptare që duan të ruajnë kujtjet dhe historitë e tyre.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up border border-gray-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-6">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Filloni të ruani historinë tuaj sot
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Bashkohuni me familjet që kanë nisur udhëtimin e tyre në ruajtjen e trashëgimisë.
          </p>
          <button
            onClick={() => {
              setAuthMode('signup')
              setShowAuth(true)
            }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Regjistrohuni Falas
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing