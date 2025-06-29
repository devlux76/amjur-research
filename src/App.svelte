<script lang="ts">
  import { onMount } from 'svelte'
  import { auth } from './lib/auth.svelte'
  import Header from './lib/components/Header.svelte'
  import SearchBox from './lib/components/SearchBox.svelte'
  import SearchResults from './lib/components/SearchResults.svelte'
  import AuthModal from './lib/components/AuthModal.svelte'
  import Notebook from './lib/components/Notebook.svelte'

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

  onMount(() => {
    // Auth is initialized automatically in the auth store
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
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Search & Save
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Search the web and build your personal knowledge notebook
          </p>
        </div>

        <SearchBox />
        <SearchResults />
      </div>
    {:else if currentView === 'notebook'}
      {#if auth.user}
        <Notebook />
      {:else}
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Access Your Notebook</h2>
          <p class="text-gray-600 mb-8">Sign in to view your saved searches</p>
          <button
            onclick={openAuthModal}
            class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign in
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