<script lang="ts">
  import { searchStore } from '../search.svelte'
  
  let searchInput = ''
  let inputRef: HTMLInputElement

  function handleSearch() {
    if (searchInput.trim()) {
      searchStore.search(searchInput.trim())
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  function focusSearch() {
    inputRef?.focus()
  }
</script>

<div class="w-full max-w-3xl mx-auto">
  <div class="relative group">
    <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
      <svg class="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    <input
      bind:this={inputRef}
      bind:value={searchInput}
      onkeypress={handleKeyPress}
      type="text"
      placeholder="Search for research topics, papers, data..."
      class="w-full pl-14 pr-5 py-5 text-lg border-2 border-gray-200 rounded-2xl 
             focus:border-primary-500 focus:outline-none focus:ring-0
             bg-white shadow-sm hover:shadow-md focus:shadow-lg
             transition-all duration-300 ease-out
             placeholder:text-gray-400"
      disabled={searchStore.loading}
    />
    
    {#if searchInput.trim()}
      <button
        onclick={handleSearch}
        disabled={searchStore.loading}
        class="absolute inset-y-0 right-0 pr-5 flex items-center
               text-primary-600 hover:text-primary-700 
               disabled:text-gray-400 disabled:cursor-not-allowed
               transition-colors"
      >
        {#if searchStore.loading}
          <svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {:else}
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
          </svg>
        {/if}
      </button>
    {/if}
  </div>

  {#if searchStore.error}
    <div class="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700 text-sm">
      <div class="flex items-center">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {searchStore.error}
      </div>
    </div>
  {/if}
</div>