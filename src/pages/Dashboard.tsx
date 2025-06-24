import React, { useState, useEffect } from 'react'
import { Plus, Users, Clock, Heart, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/Layout/PageHeader'
import BottomNavigation from '../components/Layout/BottomNavigation'

interface FamilyTree {
  id: string
  name: string
  description: string | null
  created_at: string
}

interface RecentMemory {
  id: string
  title: string
  created_at: string
  photo_url: string | null
  emotion_tags: string[] | null
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [familyTrees, setFamilyTrees] = useState<FamilyTree[]>([])
  const [recentMemories, setRecentMemories] = useState<RecentMemory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch family trees
      const { data: trees } = await supabase
        .from('family_trees')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false })

      setFamilyTrees(trees || [])

      // Fetch recent memories
      if (trees && trees.length > 0) {
        const { data: memories } = await supabase
          .from('memories')
          .select('id, title, created_at, photo_url, emotion_tags')
          .in('family_tree_id', trees.map(t => t.id))
          .order('created_at', { ascending: false })
          .limit(5)

        setRecentMemories(memories || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Mirëmëngjes'
    if (hour < 17) return 'Mirëdita'
    return 'Mirëmbrëma'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sq-AL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 d-none">
      <PageHeader
        title={`${getGreeting()}, ${user?.user_metadata?.full_name || 'Mik'}!`}
        subtitle="Mirë se vini në arkivin tuaj familjar"
      />

      <div className="px-4 py-6 space-y-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/add-memory"
            className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <Plus size={28} className="mb-3" />
            <h3 className="font-semibold text-lg">Shto Kujtes</h3>
            <p className="text-primary-100 text-sm">Regjistro një moment</p>
          </Link>

          <Link
            to="/family-tree"
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 border border-gray-100"
          >
            <Users size={28} className="mb-3 text-primary-500" />
            <h3 className="font-semibold text-lg text-gray-900">Familja</h3>
            <p className="text-gray-600 text-sm">Shiko pemën</p>
          </Link>
        </div>

        {/* Family Trees */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pemët e Familjes</h2>
            <Link
              to="/create-family-tree"
              className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              Krijo të Re
            </Link>
          </div>

          {familyTrees.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Krijoje pemën e parë familjare
              </h3>
              <p className="text-gray-600 mb-4">
                Filloni duke krijuar pemën e familjes suaj dhe ruani kujtjet.
              </p>
              <Link
                to="/create-family-tree"
                className="inline-block bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
              >
                Krijo Pemën
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {familyTrees.map((tree) => (
                <Link
                  key={tree.id}
                  to={`/family-tree/${tree.id}`}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{tree.name}</h3>
                    {tree.description && (
                      <p className="text-gray-600 text-sm mt-1">{tree.description}</p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      Krijuar më {formatDate(tree.created_at)}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Memories */}
        {recentMemories.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Kujtetet e Fundit</h2>
              <Link
                to="/timeline"
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Shiko të Gjitha
              </Link>
            </div>

            <div className="space-y-3">
              {recentMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4"
                >
                  {memory.photo_url ? (
                    <img
                      src={memory.photo_url}
                      alt={memory.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Heart size={20} className="text-primary-500" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{memory.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(memory.created_at)}
                    </p>
                  </div>

                  {memory.emotion_tags && memory.emotion_tags.length > 0 && (
                    <div className="flex space-x-1">
                      {memory.emotion_tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{familyTrees.length}</div>
            <div className="text-sm text-gray-600">Pemë Familjare</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-600">{recentMemories.length}</div>
            <div className="text-sm text-gray-600">Kujtese</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100">
            <Clock size={24} className="mx-auto text-primary-600 mb-1" />
            <div className="text-sm text-gray-600">Aktiv</div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default Dashboard