<script lang="ts">
  import { getContext } from 'svelte'
  import type { AuthStore } from '../auth.svelte.ts'
  
  interface Props {
    isOpen: boolean
    onClose: () => void
  }
  
  let { isOpen, onClose }: Props = $props()
  
  const auth = getContext<AuthStore>('auth')
  
  let mode: 'signin' | 'signup' = 'signin'
  let email = ''
  let password = ''
  let loading = false
  let localError = ''

  function switchMode() {
    mode = mode === 'signin' ? 'signup' : 'signin'
    localError = ''
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    
    if (!email || !password) {
      localError = 'Please fill in all fields'
      return
    }

    try {
      loading = true
      localError = ''
      
      if (mode === 'signin') {
        await auth.signIn(email, password)
      } else {
        await auth.signUp(email, password)
      }
      
      onClose()
      email = ''
      password = ''
    } catch (error: any) {
      localError = error.message
    } finally {
      loading = false
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const form = event.target?.closest('form')
      if (form) {
        form.requestSubmit()
      }
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  export {}
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onclick={handleBackdropClick}
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 fade-in">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'signin' ? 'Welcome back to' : 'Join'} <span class="text-primary-600">re:</span> search
        </h2>
        <p class="text-gray-600">
          {mode === 'signin' 
            ? 'Sign in to access your research notes' 
            : 'Create your account to start building your research library'}
        </p>
      </div>

      <form onsubmit={handleSubmit} class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            onkeypress={handleKeyPress}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter your professional email"
            disabled={loading}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            onkeypress={handleKeyPress}
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        {#if localError || auth.error}
          <div class="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {localError || auth.error}
          </div>
        {/if}

        <button
          type="submit"
          disabled={loading}
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium
                 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200"
        >
          {#if loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          {:else}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          onclick={switchMode}
          class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          disabled={loading}
        >
          {mode === 'signin' 
            ? "New to re: search? Create account" 
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  </div>
{/if}