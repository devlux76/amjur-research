<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import type { SearchStore } from '../search.svelte.ts'
  import { auth } from '../auth.svelte.ts'

  const searchStore = getContext<SearchStore>('searchStore')

  onMount(() => {
    if (auth.user) {
      searchStore.loadSavedSearches()
    }
  })

  async function deleteSearch(id: string) {
    try {
      await searchStore.deleteSearch(id)
    } catch (error) {
      console.error('Failed to delete search:', error)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
</script>

<div class="w-full max-w-4xl mx-auto mt-8">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">Your Research Notes</h2>
      <p class="text-gray-600 mt-1">Organize and revisit your saved research findings</p>
    </div>
    <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
      {searchStore.savedSearches.length} saved {searchStore.savedSearches.length === 1 ? 'item' : 'items'}
    </span>
  </div>

  {#if searchStore.savedSearches.length === 0}
    <div class="text-center py-16">
      <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-xl font-medium text-gray-900 mb-2">No research notes yet</h3>
      <p class="text-gray-500 mb-6 max-w-md mx-auto">
        Start searching and save interesting findings to build your professional research library.
      </p>
      <button
        onclick={() => window.location.reload()}
        class="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        Start researching
      </button>
    </div>
  {:else}
    <div class="space-y-4">
      {#each searchStore.savedSearches as search}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-3">
                <span class="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                  {search.query}
                </span>
                <span class="text-xs text-gray-500">
                  {formatDate(search.saved_at)}
                </span>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                {search.title}
              </h3>
              
              {#if search.description}
                <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {search.description}
                </p>
              {/if}
              
              {#if search.url}
                <a href={search.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                  <span>View source</span>
                  <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              {/if}
            </div>
            
            <button
              onclick={() => deleteSearch(search.id)}
              class="ml-4 text-gray-400 hover:text-error-600 transition-colors p-1"
              title="Remove from research notes"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>