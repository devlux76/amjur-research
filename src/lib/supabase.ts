import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-project-url'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface SearchRecord {
  id: string
  user_id: string
  query: string
  title?: string
  description?: string
  url?: string
  saved_at: string
  tags?: string[]
}

export interface NotebookEntry {
  id: string
  user_id: string
  title: string
  searches: SearchRecord[]
  created_at: string
  updated_at: string
}