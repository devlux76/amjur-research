<script lang="ts">
  import { getContext } from 'svelte'
  import type { AuthStore } from '../auth.svelte.ts'
  
  interface Props {
    onAuthClick: () => void
    onNotebookClick: () => void
    currentView: 'search' | 'notebook'
  }
  
  let { onAuthClick, onNotebookClick, currentView }: Props = $props()

  const auth = getContext<AuthStore>('auth')

  async function handleSignOut() {
    try {
      await auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }
</script>

<header class="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center space-x-8">
        <h1 class="text-xl font-bold text-gray-900">
          <span class="text-primary-600">re:</span> search
        </h1>
        
        {#if auth.user}
          <nav class="flex space-x-4">
            <button
              onclick={() => currentView !== 'search' && window.location.reload()}
              class="text-sm font-medium px-3 py-2 rounded-lg transition-colors
                     {currentView === 'search' 
                       ? 'text-primary-700 bg-primary-50' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
            >
              Search
            </button>
            <button
              onclick={onNotebookClick}
              class="text-sm font-medium px-3 py-2 rounded-lg transition-colors
                     {currentView === 'notebook' 
                       ? 'text-primary-700 bg-primary-50' 
                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
            >
              Research Notes
            </button>
          </nav>
        {/if}
      </div>

      <div class="flex items-center space-x-4">
        {#if auth.user}
          <span class="text-sm text-gray-600 hidden sm:block">
            {auth.user.email}
          </span>
          <button
            onclick={handleSignOut}
            class="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign out
          </button>
        {:else}
          <button
            onclick={onAuthClick}
            class="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium
                   hover:bg-primary-700 transition-colors"
          >
            Sign in
          </button>
        {/if}
      </div>
    </div>
  </div>
</header>