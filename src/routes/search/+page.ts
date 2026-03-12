import type { PageLoad } from "./$types";
import { searchDocuments } from "$lib/api";
import type { SearchFilters, SearchMode } from "$lib/types";

/**
 * Load function for search page
 * Parses URL params and performs search server-side (or during navigation)
 * Re-runs automatically when URL changes
 */
export const load: PageLoad = async ({ url, fetch }) => {
  const RESULTS_PER_PAGE = 20;

  // Parse URL parameters
  const query = url.searchParams.get("q") || "";
  // Support both multiple parameters (?categories=x&categories=y) and comma-separated (?categories=x,y)
  const categoriesParams = url.searchParams.getAll("categories");
  const categories =
    categoriesParams.length > 0
      ? categoriesParams
          .flatMap((c) => c.split(","))
          .filter((c) => c.length > 0)
      : [];
  const sortParam = url.searchParams.get("sort");
  const sortBy: "relevance" | "newest" | "oldest" =
    sortParam === "newest" || sortParam === "oldest" ? sortParam : "relevance";
  const modeParam = url.searchParams.get("mode");
  const searchMode: SearchMode = modeParam === "keyword" ? modeParam : "hybrid";

  // Build filters
  const filters: SearchFilters = {
    sort_by: sortBy,
    search_mode: searchMode,
  };
  if (categories.length > 0) {
    filters.categories = categories;
  }

  // Check if we have anything to search for
  const hasQuery = query.trim().length > 0;
  const hasFilters = categories.length > 0;

  // Only search if we have query or filters
  if (!hasQuery && !hasFilters) {
    return {
      query,
      categories,
      sortBy,
      searchMode,
      filters,
      results: [],
      total: 0,
      hasMore: false,
      hasQuery,
      hasFilters,
    };
  }

  // Perform search
  try {
    const response = await searchDocuments(
      query,
      filters,
      RESULTS_PER_PAGE,
      0,
      fetch
    );

    return {
      query,
      categories,
      sortBy,
      searchMode,
      filters,
      results: response.results,
      total: response.total,
      hasMore: response.has_more,
      hasQuery,
      hasFilters,
    };
  } catch (error) {
    // Return error state
    return {
      query,
      categories,
      sortBy,
      searchMode,
      filters,
      results: [],
      total: 0,
      hasMore: false,
      hasQuery,
      hasFilters,
      error: error instanceof Error ? error.message : "Search failed",
    };
  }
};

// Disable prerendering to ensure consistent CSR behavior
export const prerender = false;
export const ssr = false;
