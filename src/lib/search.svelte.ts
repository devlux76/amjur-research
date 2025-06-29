import { supabase } from './supabase'
import type { SearchRecord } from './supabase'

export interface SearchResult {
  title: string
  description: string
  url: string
  snippet?: string
}

class SearchStore {
  results = $state<SearchResult[]>([])
  loading = $state(false)
  error = $state<string | null>(null)
  query = $state('')
  savedSearches = $state<SearchRecord[]>([])

  async search(query: string) {
    if (!query.trim()) return

    try {
      this.loading = true
      this.error = null
      this.query = query

      // For now, simulate API call - replace with actual search endpoint
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        // Fallback to mock results for demonstration
        this.results = this.getMockResults(query)
        return
      }

      const data = await response.json()
      this.results = data.results || []
    } catch (error) {
      console.error('Search error:', error)
      this.error = 'Search failed. Please try again.'
      // Provide mock results for demo
      this.results = this.getMockResults(query)
    } finally {
      this.loading = false
    }
  }

  private getMockResults(query: string): SearchResult[] {
    return [
      {
        title: `${query} - Wikipedia`,
        description: `Wikipedia article about ${query}. Comprehensive information and references.`,
        url: `https://en.wikipedia.org/wiki/${query.replace(' ', '_')}`
      },
      {
        title: `${query} Guide - Complete Tutorial`,
        description: `Learn everything about ${query} with this comprehensive guide and tutorial.`,
        url: `https://example.com/${query.toLowerCase().replace(' ', '-')}-guide`
      },
      {
        title: `Best ${query} Resources`,
        description: `Top resources, tools, and references for ${query}. Updated regularly.`,
        url: `https://example.com/best-${query.toLowerCase().replace(' ', '-')}-resources`
      }
    ]
  }

  async saveSearch(result: SearchResult) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const searchRecord: Omit<SearchRecord, 'id' | 'saved_at'> = {
        user_id: user.id,
        query: this.query,
        title: result.title,
        description: result.description,
        url: result.url
      }

      const { data, error } = await supabase
        .from('searches')
        .insert(searchRecord)
        .select()
        .single()

      if (error) throw error

      this.savedSearches = [data, ...this.savedSearches]
      return data
    } catch (error: any) {
      this.error = error.message
      throw error
    }
  }

  async loadSavedSearches() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('searches')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false })

      if (error) throw error

      this.savedSearches = data || []
    } catch (error: any) {
      this.error = error.message
    }
  }

  async deleteSearch(id: string) {
    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', id)

      if (error) throw error

      this.savedSearches = this.savedSearches.filter(s => s.id !== id)
    } catch (error: any) {
      this.error = error.message
      throw error
    }
  }
}

export function createSearchStore() {
  return new SearchStore()
}

export type { SearchStore }