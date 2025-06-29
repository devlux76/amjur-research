import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export function createAuthStore() {
  let user = $state<User | null>(null)
  let loading = $state(true)
  let error = $state<string | null>(null)
  let initPromise: Promise<void>

  async function initialize() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user = session?.user ?? null
      
      supabase.auth.onAuthStateChange((event, session) => {
        queueMicrotask(() => {
          user = session?.user ?? null
          loading = false
        })
      })
    } catch (err) {
      console.error('Auth initialization error:', err)
      error = 'Failed to initialize authentication'
    } finally {
      loading = false
    }
  }

  // Initialize immediately
  initPromise = initialize()

  async function waitForInitialization() {
    return initPromise
  }

  async function signUp(email: string, password: string) {
    try {
      error = null
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (signUpError) throw signUpError
      return data
    } catch (err: any) {
      error = err.message
      throw err
    }
  }

  async function signIn(email: string, password: string) {
    try {
      error = null
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (signInError) throw signInError
      return data
    } catch (err: any) {
      error = err.message
      throw err
    }
  }

  async function signOut() {
    try {
      error = null
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
    } catch (err: any) {
      error = err.message
      throw err
    }
  }

  return {
    get user() { return user },
    get loading() { return loading },
    get error() { return error },
    waitForInitialization,
    signUp,
    signIn,
    signOut
  }
}

export type AuthStore = ReturnType<typeof createAuthStore>