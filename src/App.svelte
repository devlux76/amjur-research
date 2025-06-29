<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import { createAuthStore, type AuthStore } from './lib/auth.svelte.ts'
  import { createSearchStore, type SearchStore } from './lib/search.svelte.ts'
  import Header from './lib/components/Header.svelte'
  import SearchBox from './lib/components/SearchBox.svelte'
  import SearchResults from './lib/components/SearchResults.svelte'
  import AuthModal from './lib/components/AuthModal.svelte'
  import Notebook from './lib/components/Notebook.svelte'

  // Create store instances within component context
  const auth = createAuthStore()
  const searchStore = createSearchStore()

  // Destructure auth properties for proper Svelte 5 reactivity
  const { user, loading } = auth

  // Provide stores to child components
  setContext('auth', auth)
  setContext('searchStore', searchStore)

  let showAuthModal = false
  let currentView: 'search' | 'notebook' = 'search'

  function openAuthModal() {
    showAuthModal = true
  }

  function closeAuthModal() {
    showAuthModal = false
  }

  function showNotebook() {
    currentView = 'notebook'
  }

  function showSearch() {
    currentView = 'search'
  }

  onMount(async () => {
    // Wait for auth initialization
    await auth.waitForInitialization()
  })
</script>

<div class="min-h-screen bg-gray-50">
  <Header 
    {currentView}
    onAuthClick={openAuthModal}
    onNotebookClick={showNotebook}
  />

  <main class="container mx-auto px-4 py-8">
    {#if currentView === 'search'}
      <div class="flex flex-col items-center justify-center min-h-[60vh]">
        <div class="text-center mb-12">
          <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            <span class="text-primary-600">re:</span> search
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional research made simple. Search, save, and organize your findings in one place.
          </p>
          <p class="text-lg text-gray-500 mt-4">
            Because great research deserves great tools.
          </p>
        </div>

        <SearchBox />
        <SearchResults />
      </div>
    {:else if currentView === 'notebook'}
      {#if loading}
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      {:else if user}
        <Notebook />
      {:else}
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Access Your Research Notes</h2>
          <p class="text-gray-600 mb-8">Sign in to view your saved research and findings</p>
          <button
            onclick={openAuthModal}
            class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign in to continue
          </button>
        </div>
      {/if}
    {/if}
  </main>

  <AuthModal 
    isOpen={showAuthModal} 
    onClose={closeAuthModal} 
  />
</div>