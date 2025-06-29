<script lang="ts">
  import { searchStore } from '../search.svelte.ts'
  import { auth } from '../auth.svelte.ts'
  import type { SearchResult } from '../search.svelte.ts'

  async function saveResult(result: SearchResult) {
    if (!auth.user) return
    
    try {
      await searchStore.saveSearch(result)
    } catch (error) {
      console.error('Failed to save search:', error)
    }
  }

  function formatUrl(url: string) {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname
    } catch {
      return url
    }
  }
</script>

{#if searchStore.results.length > 0}
  <div class="w-full max-w-4xl mx-auto mt-12 space-y-6 fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">
          Research results for "{searchStore.query}"
        </h2>
        <p class="text-gray-600 mt-1">
          {searchStore.results.length} results found
        </p>
      </div>
    </div>

    {#each searchStore.results as result, index}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 slide-up"
           style="animation-delay: {index * 100}ms">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-sm text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded">
                {formatUrl(result.url)}
              </span>
            </div>
            
            <h3 class="text-xl text-gray-900 hover:text-primary-700 transition-colors mb-3 font-semibold leading-tight">
              <a href={result.url} target="_blank" rel="noopener noreferrer" class="hover:underline">
                {result.title}
              </a>
            </h3>
            
            <p class="text-gray-600 leading-relaxed mb-4">
              {result.description}
            </p>
            
            <div class="flex items-center space-x-6">
              <a href={result.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                <span>View source</span>
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              
              {#if auth.user}
                <button
                  onclick={() => saveResult(result)}
                  class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Save to research notes</span>
                </button>
              {:else}
                <span class="text-sm text-gray-400">
                  Sign in to save research findings
                </span>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}