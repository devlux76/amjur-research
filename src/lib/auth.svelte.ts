import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

class AuthStore {
  user = $state<User | null>(null)
  loading = $state(true)
  error = $state<string | null>(null)
  private initPromise: Promise<void>

  constructor() {
    this.initPromise = this.initialize()
  }

  private async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user ?? null
      
      supabase.auth.onAuthStateChange((event, session) => {
        this.user = session?.user ?? null
        this.loading = false
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      this.error = 'Failed to initialize authentication'
    } finally {
      this.loading = false
    }
  }

  // Expose the initialization promise
  async waitForInitialization() {
    return this.initPromise
  }

  async signUp(email: string, password: string) {
    try {
      this.error = null
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error: any) {
      this.error = error.message
      throw error
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.error = null
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error: any) {
      this.error = error.message
      throw error
    }
  }

  async signOut() {
    try {
      this.error = null
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      this.error = error.message
      throw error
    }
  }
}

export const auth = new AuthStore()