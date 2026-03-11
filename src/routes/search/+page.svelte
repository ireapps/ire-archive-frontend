<script lang="ts">
  import { goto } from "$app/navigation";
  import { navigating } from "$app/stores";
  import SearchBox from "$lib/components/SearchBox.svelte";
  import SearchResults from "$lib/components/SearchResults.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import { searchDocuments } from "$lib/api";
  import { FILTER_OPTIONS } from "$lib/config";
  import { focusSearchInput } from "$lib/utils/dom";

  import type { SearchResult, SearchMode } from "$lib/types";

  // Get data from load function
  let { data } = $props();

  // Pagination and UI state
  const RESULTS_PER_PAGE = 20;
  let loadingMore = $state(false);
  let focusedResultIndex = $state(-1);
  let loadMoreError = $state<string | null>(null);

  // Results state (initial load from load function, then append for pagination)
  let results = $state<SearchResult[]>(data.results || []);
  let currentPage = $state(1);
  let inputQuery = $state(data.query);

  // Reset pagination and focus when search changes
  $effect(() => {
    // Track data properties that trigger reset
    const { query, filters, sortBy, searchMode, results: newResults } = data;

    results = newResults || [];
    currentPage = 1;
    focusedResultIndex = -1;
    inputQuery = query;
  });

  async function loadMoreResults() {
    loadingMore = true;
    loadMoreError = null;

    try {
      const nextPage = currentPage + 1;
      const offset = (nextPage - 1) * RESULTS_PER_PAGE;
      const response = await searchDocuments(
        data.query || "",
        data.filters,
        RESULTS_PER_PAGE,
        offset,
        fetch
      );

      // Append new results (deduplicate)
      const existingIds = new Set(results.map((r) => r.vector_id));
      const newResults = response.results.filter(
        (r) => !existingIds.has(r.vector_id)
      );
      results = [...results, ...newResults];
      currentPage = nextPage;
    } catch (err: unknown) {
      loadMoreError =
        err instanceof Error
          ? err.message
          : "Failed to load more results. Please try again.";
      console.error("Load more error:", err);
    } finally {
      loadingMore = false;
    }
  }

  function buildSearchUrl(formData: FormData): string {
    const params = new URLSearchParams();

    const query = (formData.get("q") as string | null)?.trim() ?? "";
    if (query) {
      params.set("q", query);
    }

    const categories = formData
      .getAll("categories")
      .map(String)
      .filter((category) => category.length > 0);
    categories.forEach((category) => params.append("categories", category));

    const sort = formData.get("sort");
    if (typeof sort === "string" && sort.length > 0) {
      params.set("sort", sort);
    }

    const mode = formData.get("mode");
    if (typeof mode === "string" && mode.length > 0) {
      params.set("mode", mode);
    }

    return params.toString() ? `/search?${params.toString()}` : "/search";
  }

  function handleSearchSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const searchUrl = buildSearchUrl(formData);
    goto(searchUrl, { noScroll: true });
  }

  function scrollToFocusedResult() {
    window.requestAnimationFrame(() => {
      const resultElements = document.querySelectorAll("[data-result-index]");
      const focusedElement = resultElements[focusedResultIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    });
  }

  // Focus search input when landing on empty search page
  $effect(() => {
    if (!data.hasQuery && !data.hasFilters) {
      focusSearchInput();
    }
  });

  // Keyboard navigation for search results
  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const isInputFocused =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT";

    // Escape - clear search when input is focused
    if (
      event.key === "Escape" &&
      target.tagName === "INPUT" &&
      target.getAttribute("type") === "text"
    ) {
      event.preventDefault();
      goto("/search", { noScroll: true });
      return;
    }

    // Down arrow from search input - start navigating results
    if (
      event.key === "ArrowDown" &&
      target.tagName === "INPUT" &&
      target.getAttribute("type") === "text" &&
      results.length > 0
    ) {
      event.preventDefault();
      (target as HTMLInputElement).blur();
      focusedResultIndex = 0;
      scrollToFocusedResult();
      return;
    }

    // Arrow key navigation for results
    if (!isInputFocused && results.length > 0) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusedResultIndex = Math.min(
          focusedResultIndex + 1,
          results.length - 1
        );
        scrollToFocusedResult();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const newIndex = Math.max(focusedResultIndex - 1, -1);
        if (newIndex === -1) {
          focusSearchInput();
        } else {
          focusedResultIndex = newIndex;
          scrollToFocusedResult();
        }
      } else if (event.key === "Enter" && focusedResultIndex >= 0) {
        event.preventDefault();
        const result = results[focusedResultIndex];
        if (result) {
          goto(`/resource/${result.vector_id}`);
        }
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
  <title
    >{data.query ? `${data.query} - Search Results` : "Search"} | IRE Resource Center</title
  >
</svelte:head>

<div class="search-page">
  <form method="get" action="/search" onsubmit={handleSearchSubmit}>
    <SearchBox bind:query={inputQuery} loading={!!$navigating} />

    <FilterBar
      categories={FILTER_OPTIONS.categories}
      selectedCategories={data.filters.categories || FILTER_OPTIONS.categories}
      sortBy={data.sortBy}
      searchMode={data.searchMode}
    />
  </form>

  <SearchResults
    data={{
      ...data,
      results,
      hasMore: data.hasMore,
      visibleCount: results.length,
    }}
    uiState={{
      loading: !!$navigating,
      loadingMore,
      error: data.error || loadMoreError,
      focusedResultIndex,
    }}
  />

  {#if loadingMore}
    <div class="loading-more" role="status" aria-live="polite">
      Loading more results...
    </div>
  {:else if data.hasMore && results.length < data.total}
    <div class="load-more-container">
      <button
        class="load-more-button"
        onclick={loadMoreResults}
        aria-label={`Load more results; showing ${results.length} of ${data.total}`}
      >
        Load more
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/variables" as *;

  .search-page {
    opacity: 1;
    transition: opacity 0.2s ease-in-out;
  }

  .load-more-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  .load-more-button {
    @include button-reset;
    border: 1px solid var(--color-link);
    padding: var(--spacing-md) var(--spacing-2xl);
    font-size: var(--font-size-base);
    color: var(--color-link);
    cursor: pointer;
    @include hover-transition(background-color);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--color-link-hover);
      color: var(--color-bg-white);
    }

    &:focus {
      @include focus-outline;
    }
  }

  .loading-more {
    text-align: center;
    padding: 2rem;
    color: var(--color-text-light);
  }
</style>
