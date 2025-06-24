import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uuokpaemjecjahwpgtnr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_trees: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          family_tree_id: string
          name: string
          birth_date: string | null
          death_date: string | null
          gender: string | null
          bio: string | null
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_tree_id: string
          name: string
          birth_date?: string | null
          death_date?: string | null
          gender?: string | null
          bio?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_tree_id?: string
          name?: string
          birth_date?: string | null
          death_date?: string | null
          gender?: string | null
          bio?: string | null
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          family_tree_id: string
          family_member_id: string | null
          title: string
          content: string | null
          audio_url: string | null
          photo_url: string | null
          emotion_tags: string[] | null
          memory_date: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_tree_id: string
          family_member_id?: string | null
          title: string
          content?: string | null
          audio_url?: string | null
          photo_url?: string | null
          emotion_tags?: string[] | null
          memory_date?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_tree_id?: string
          family_member_id?: string | null
          title?: string
          content?: string | null
          audio_url?: string | null
          photo_url?: string | null
          emotion_tags?: string[] | null
          memory_date?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}