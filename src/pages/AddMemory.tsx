import React, { useState, useEffect } from 'react'
import { Camera, Calendar, User, Type } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/Layout/PageHeader'
import BottomNavigation from '../components/Layout/BottomNavigation'
import AudioRecorder from '../components/Memory/AudioRecorder'
import EmotionTags from '../components/Memory/EmotionTags'

interface FamilyTree {
  id: string
  name: string
}

interface FamilyMember {
  id: string
  name: string
}

const AddMemory: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTreeId, setSelectedTreeId] = useState('')
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [memoryDate, setMemoryDate] = useState('')
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  
  const [familyTrees, setFamilyTrees] = useState<FamilyTree[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFamilyTrees()
  }, [])

  useEffect(() => {
    if (selectedTreeId) {
      fetchFamilyMembers(selectedTreeId)
    }
  }, [selectedTreeId])

  const fetchFamilyTrees = async () => {
    const { data } = await supabase
      .from('family_trees')
      .select('id, name')
      .eq('created_by', user?.id)
      .order('name')

    setFamilyTrees(data || [])
    if (data && data.length > 0) {
      setSelectedTreeId(data[0].id)
    }
  }

  const fetchFamilyMembers = async (treeId: string) => {
    const { data } = await supabase
      .from('family_members')
      .select('id, name')
      .eq('family_tree_id', treeId)
      .order('name')

    setFamilyMembers(data || [])
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmotionToggle = (emotionId: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    )
  }

  const uploadFile = async (file: File | Blob, fileName: string, bucket: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error
    return data.path
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTreeId || !title.trim()) return

    setLoading(true)

    try {
      let audioUrl = null
      let photoUrl = null

      // Upload audio if exists
      if (audioBlob) {
        const audioFileName = `${Date.now()}-audio.wav`
        const audioPath = await uploadFile(audioBlob, audioFileName, 'audio-memories')
        audioUrl = `${supabase.storage.from('audio-memories').getPublicUrl(audioPath).data.publicUrl}`
      }

      // Upload photo if exists
      if (photoFile) {
        const photoFileName = `${Date.now()}-${photoFile.name}`
        const photoPath = await uploadFile(photoFile, photoFileName, 'photo-memories')
        photoUrl = `${supabase.storage.from('photo-memories').getPublicUrl(photoPath).data.publicUrl}`
      }

      // Create memory record
      const { error } = await supabase
        .from('memories')
        .insert({
          family_tree_id: selectedTreeId,
          family_member_id: selectedMemberId || null,
          title: title.trim(),
          content: content.trim() || null,
          audio_url: audioUrl,
          photo_url: photoUrl,
          emotion_tags: selectedEmotions.length > 0 ? selectedEmotions : null,
          memory_date: memoryDate || null,
          created_by: user?.id
        })

      if (error) throw error

      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating memory:', error)
      alert('Ka ndodhur një gabim gjatë ruajtjes së kujtesës.')
    } finally {
      setLoading(false)
    }
  }

  if (familyTrees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <PageHeader title="Shto Kujtes" showBack />
        
        <div className="px-4 py-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <User size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Duhet të keni një pemë familjare
            </h3>
            <p className="text-gray-600 mb-4">
              Para se të shtoni kujtime, krijoni pemën e familjes suaj.
            </p>
            <button
              onClick={() => navigate('/create-family-tree')}
              className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors"
            >
              Krijo Pemën e Familjes
            </button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <PageHeader title="Shto një Kujtes të Re" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Family Tree Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Zgjidh Pemën e Familjes
          </label>
          <select
            value={selectedTreeId}
            onChange={(e) => setSelectedTreeId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            {familyTrees.map((tree) => (
              <option key={tree.id} value={tree.id}>
                {tree.name}
              </option>
            ))}
          </select>
        </div>

        {/* Memory Title */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Type size={20} className="inline mr-2" />
            Titulli i Kujtesës
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="P.sh. 'Festa e Bajramit 2023'"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Written Story */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Shkruani historinë (opsionale)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Shkruani detaje rreth kësaj kujtese..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Audio Recording */}
        <AudioRecorder onRecordingComplete={setAudioBlob} />

        {/* Photo Upload */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Camera size={20} className="inline mr-2" />
            Shto një Foto (opsionale)
          </label>
          
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            id="photo-upload"
          />
          
          {photoPreview ? (
            <div className="space-y-3">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null)
                  setPhotoPreview(null)
                }}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hiq foton
              </button>
            </div>
          ) : (
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 transition-colors cursor-pointer"
            >
              <Camera size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Kliko për të zgjedhur foto</span>
            </label>
          )}
        </div>

        {/* Emotion Tags */}
        <EmotionTags
          selectedEmotions={selectedEmotions}
          onEmotionToggle={handleEmotionToggle}
        />

        {/* Family Member Selection */}
        {familyMembers.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <User size={20} className="inline mr-2" />
              Lidhur me anëtarin e familjes (opsionale)
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Zgjidh anëtarin (opsionale)</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Memory Date */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar size={20} className="inline mr-2" />
            Data e Kujtesës (opsionale)
          </label>
          <input
            type="date"
            value={memoryDate}
            onChange={(e) => setMemoryDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Duke ruajtur...' : 'Ruaj Kujtesën'}
        </button>
      </form>

      <BottomNavigation />
    </div>
  )
}

export default AddMemory