<script lang="ts">
  import type { SearchResult, SearchMode, SearchFilters } from "../types";
  import ResultCard from "./ResultCard.svelte";
  import SkeletonCard from "./SkeletonCard.svelte";
  import RelevanceKey from "./RelevanceKey.svelte";
  import { formatCount } from "../utils";

  interface SearchData {
    results: SearchResult[];
    total: number;
    hasMore: boolean;
    visibleCount: number;
    query: string;
    filters: SearchFilters;
    searchMode: SearchMode;
    hasQuery: boolean;
    hasFilters: boolean;
  }

  interface UIState {
    loading: boolean;
    loadingMore: boolean;
    error?: string | null;
    focusedResultIndex: number;
  }

  let {
    data,
    uiState,
  }: {
    data: SearchData;
    uiState: UIState;
  } = $props();

  // Derive convenience variables from data
  let results = $derived(data.results);
  let totalResults = $derived(data.total);
  let query = $derived(data.query);
  let searchMode = $derived(data.searchMode);
  let hasQuery = $derived(data.hasQuery);
  let hasFilters = $derived(data.hasFilters);
  let hasSearched = $derived(hasQuery || hasFilters);

  // Derive UI state variables
  let loading = $derived(uiState.loading);
  let loadingMore = $derived(uiState.loadingMore);
  let error = $derived(uiState.error);
  let focusedResultIndex = $derived(uiState.focusedResultIndex);
</script>

<div id="results-container">
  <!-- Screen reader announcement for search results -->
  {#if hasSearched && !loading && results.length > 0}
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {totalResults.toLocaleString()} results{query
        ? ` for "${query}"`
        : ""}
    </div>
  {:else if hasSearched && !loading && results.length === 0}
    <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
      No results found{query ? ` for "${query}"` : ""}
    </div>
  {/if}

  {#if loading}
    <div
      class="skeleton-results"
      role="status"
      aria-live="polite"
      aria-label="Loading search results"
      aria-busy="true"
    >
      {#each Array(5) as _, i (i)}
        <SkeletonCard />
      {/each}
    </div>
  {:else if error}
    <div class="no-results" role="alert" aria-live="assertive">
      Error: {error}
    </div>
  {:else if hasSearched && (query || hasFilters) && results.length > 0}
    {#if totalResults > 0}
      <div class="result-count-row" aria-label="Result count">
        <div class="result-count">
          {formatCount(totalResults)}
          {totalResults === 1 ? "result" : "results"}
        </div>
        {#if hasQuery}
          <RelevanceKey />
        {/if}
      </div>
    {/if}
    <div id="results" role="list" aria-label="Search results">
      {#each results as result, index (result.vector_id)}
        <div
          role="listitem"
          aria-label="Result {index + 1} of {totalResults}"
          data-result-index={index}
          class:focused={focusedResultIndex === index}
        >
          <ResultCard {result} {searchMode} showScore={hasQuery} />
        </div>
      {/each}
    </div>
    {#if loadingMore}
      <div
        class="skeleton-results"
        role="status"
        aria-live="polite"
        aria-label="Loading more results"
        aria-busy="true"
      >
        {#each Array(3) as _, i (i)}
          <SkeletonCard />
        {/each}
      </div>
    {/if}
  {:else if hasSearched && (query || hasFilters) && totalResults === 0}
    <div class="no-results">
      No results found. Try different search terms or filters.
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .no-results {
    padding: var(--spacing-3xl) 0;
    text-align: center;
    color: var(--color-text-light);
    font-size: var(--font-size-base);
  }

  .result-count-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-sm);
  }

  .result-count {
    color: var(--color-text-light);
    font-size: var(--font-size-base);
    padding: 0;
    margin: 0;
  }

  // List item styling with borders
  [role="listitem"] {
    padding: var(--spacing-lg) 0;
    border-top: 1px solid var(--color-border);

    &:last-child {
      border-bottom: none;
    }
  }

  // Focused result styling (invisible to default users - only shows during keyboard navigation)
  [role="listitem"].focused {
    position: relative;
  }

  [role="listitem"].focused::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: -7.5px;
    width: 2px;
    background-color: var(--color-headline);
  }
</style>
