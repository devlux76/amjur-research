<script lang="ts">
  import { searchStore } from '../search.svelte'
  import { auth } from '../auth.svelte'
  import { onMount } from 'svelte'

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
    <h2 class="text-2xl font-bold text-gray-900">Your Search Notebook</h2>
    <span class="text-sm text-gray-500">
      {searchStore.savedSearches.length} saved searches
    </span>
  </div>

  {#if searchStore.savedSearches.length === 0}
    <div class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No saved searches yet</h3>
      <p class="mt-2 text-gray-500">Start searching and save interesting results to build your notebook.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each searchStore.savedSearches as search}
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {search.query}
                </span>
                <span class="text-xs text-gray-500">
                  {formatDate(search.saved_at)}
                </span>
              </div>
              
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {search.title}
              </h3>
              
              {#if search.description}
                <p class="text-gray-600 mb-3 line-clamp-2">
                  {search.description}
                </p>
              {/if}
              
              {#if search.url}
                <a href={search.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
                  Visit saved page →
                </a>
              {/if}
            </div>
            
            <button
              onclick={() => deleteSearch(search.id)}
              class="ml-4 text-gray-400 hover:text-error-600 transition-colors"
              title="Delete search"
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