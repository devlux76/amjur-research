<script lang="ts">
  import { searchStore } from '../search.svelte'
  import { auth } from '../auth.svelte'
  import type { SearchResult } from '../search.svelte'

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
  <div class="w-full max-w-4xl mx-auto mt-8 space-y-4 fade-in">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-medium text-gray-700">
        Search results for "{searchStore.query}"
      </h2>
      <span class="text-sm text-gray-500">
        {searchStore.results.length} results
      </span>
    </div>

    {#each searchStore.results as result, index}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 slide-up"
           style="animation-delay: {index * 100}ms">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm text-primary-600 font-medium">
                {formatUrl(result.url)}
              </span>
            </div>
            
            <h3 class="text-xl text-primary-700 hover:text-primary-800 transition-colors mb-2">
              <a href={result.url} target="_blank" rel="noopener noreferrer" class="hover:underline">
                {result.title}
              </a>
            </h3>
            
            <p class="text-gray-600 leading-relaxed mb-3">
              {result.description}
            </p>
            
            <div class="flex items-center space-x-4">
              <a href={result.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Visit site →
              </a>
              
              {#if auth.user}
                <button
                  onclick={() => saveResult(result)}
                  class="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Save to notebook</span>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}