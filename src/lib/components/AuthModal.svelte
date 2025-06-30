<script lang="ts">
  import { auth } from '../auth.svelte.ts'
  
  interface Props {
    isOpen: boolean
    onClose: () => void
  }
  
  let { isOpen, onClose }: Props = $props()
  
  const state = $state({
    mode: 'signin' as 'signin' | 'signup',
    email: '',
    password: '',
    loading: false,
    localError: ''
  })

  function switchMode() {
    state.mode = state.mode === 'signin' ? 'signup' : 'signin'
    state.localError = ''
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    
    if (!state.email || !state.password) {
      state.localError = 'Please fill in all fields'
      return
    }

    try {
      state.loading = true
      state.localError = ''
      
      if (state.mode === 'signin') {
        await auth.signIn(state.email, state.password)
      } else {
        await auth.signUp(state.email, state.password)
      }
      
      onClose()
      state.email = ''
      state.password = ''
    } catch (error: any) {
      state.localError = error.message
    } finally {
      state.loading = false
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
    tabindex="0"
    role="dialog"
    aria-modal="true"
    aria-label="Authentication Modal"
    onkeydown={handleKeyPress}
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 fade-in">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {state.mode === 'signin' ? 'Welcome back to' : 'Join'} <span class="text-primary-600">re:</span> search
        </h2>
        <p class="text-gray-600">
          {state.mode === 'signin' 
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
            bind:value={state.email}
            onkeypress={handleKeyPress}
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter your professional email"
            disabled={state.loading}
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            bind:value={state.password}
            onkeypress={handleKeyPress}
            required
            minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            placeholder="Enter your password"
            disabled={state.loading}
          />
        </div>

        {#if state.localError || auth.error}
          <div class="p-3 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
            {state.localError || auth.error}
          </div>
        {/if}

        <button
          type="submit"
          disabled={state.loading}
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium
                 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200"
        >
          {#if state.loading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {state.mode === 'signin' ? 'Signing in...' : 'Creating account...'}
          {:else}
            {state.mode === 'signin' ? 'Sign in' : 'Create account'}
          {/if}
        </button>
      </form>

      <div class="mt-6 text-center">
        <button
          onclick={switchMode}
          class="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          disabled={state.loading}
        >
          {state.mode === 'signin' 
            ? "New to re: search? Create account" 
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  </div>
{/if}