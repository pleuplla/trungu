import React, { useState, useRef } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        onRecordingComplete(audioBlob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Regjistro një kujtes audio
      </h3>
      
      <div className="flex flex-col items-center space-y-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all active:scale-95"
          >
            <Mic size={32} />
          </button>
        )}

        {isRecording && (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={stopRecording}
              className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all active:scale-95"
            >
              <Square size={32} />
            </button>
            <div className="text-center">
              <div className="flex items-center space-x-2 text-red-600">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-gentle"></div>
                <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Duke regjistruar...</p>
            </div>
          </div>
        )}

        {audioUrl && (
          <div className="flex flex-col items-center space-y-4 w-full">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center space-x-4">
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white shadow-md hover:from-primary-600 hover:to-primary-700 transition-all"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="text-sm text-gray-600">
                Regjistrimi juaj është gati
              </div>
            </div>
            
            <button
              onClick={() => {
                setAudioUrl(null)
                setIsPlaying(false)
              }}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Regjistro përsëri
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioRecorder