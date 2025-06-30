import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

// Create module-level reactive state
export const auth = $state({
  user: null as User | null,
  loading: true,
  error: null as string | null,
  initPromise: null as Promise<void> | null,

  async initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      this.user = session?.user ?? null
      
      supabase.auth.onAuthStateChange((event, session) => {
        queueMicrotask(() => {
          this.user = session?.user ?? null
          this.loading = false
        })
      })
    } catch (err) {
      console.error('Auth initialization error:', err)
      this.error = 'Failed to initialize authentication'
    } finally {
      this.loading = false
    }
  },

  async waitForInitialization() {
    if (!this.initPromise) {
      this.initPromise = this.initialize()
    }
    return this.initPromise
  },

  async signUp(email: string, password: string) {
    try {
      this.error = null
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (signUpError) throw signUpError
      return data
    } catch (err: any) {
      this.error = err.message
      throw err
    }
  },

  async signIn(email: string, password: string) {
    try {
      this.error = null
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      return data
    } catch (err: any) {
      this.error = err.message
      throw err
    }
  },

  async signOut() {
    try {
      this.error = null
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err: any) {
      this.error = err.message
      throw err
    }
  }
})

// Initialize immediately
auth.waitForInitialization()

export type AuthStore = typeof auth