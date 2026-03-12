/**
 * API client for IRE semantic search backend
 * Handles all HTTP requests with proper error handling and typing
 */

import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { API_ENDPOINTS, SEARCH_CONFIG } from "./config";
import type {
  SearchResponse,
  SearchFilters,
  ResourceDetail,
  SimilarResourcesResponse,
  StatsResponse,
  SearchResult,
} from "./types";

const AUTH_BYPASS = import.meta.env.VITE_AUTH_BYPASS === "true";

// Minimal mock data to unblock e2e flows when auth is bypassed
const MOCK_RESOURCES: ResourceDetail[] = [
  {
    vector_id: "mock-investigative-1",
    title: "Investigative Journalism Playbook",
    text: "Guides and checklists for investigative reporting.",
    doc_type: "tipsheet",
    metadata: {
      vector_id: "mock-investigative-1",
      category: "tipsheet",
      description: "A concise primer on investigative reporting techniques.",
      authors: "IRE Training Team",
      resource_year: 2024,
    },
  },
  {
    vector_id: "mock-real-estate-1",
    title: "Real Estate Records 101",
    text: "How to follow property money trails.",
    doc_type: "tipsheet",
    metadata: {
      vector_id: "mock-real-estate-1",
      category: "tipsheet",
      description: "Finding ownership, shell companies, and transfers.",
      authors: "Jane Reporter",
      resource_year: 2023,
    },
  },
  {
    vector_id: "mock-data-analytics-1",
    title: "Data & Analytics Bootcamp",
    text: "Hands-on walkthrough of analytics for reporters.",
    doc_type: "webinar",
    metadata: {
      vector_id: "mock-data-analytics-1",
      category: "webinar",
      description: "Video session on data journalism workflows.",
      authors: "Data Desk",
      resource_year: 2022,
    },
  },
];

function filterMockResources(filters?: SearchFilters): ResourceDetail[] {
  if (!filters?.categories || filters.categories.length === 0) {
    return MOCK_RESOURCES;
  }

  const categories = new Set(filters.categories.map((c) => c.toLowerCase()));
  return MOCK_RESOURCES.filter((resource) =>
    resource.metadata?.category
      ? categories.has(resource.metadata.category.toLowerCase())
      : false
  );
}

function buildMockSearchResponse(
  query: string,
  filters: SearchFilters | undefined,
  limit: number,
  offset: number
): SearchResponse {
  const resources = filterMockResources(filters);
  const paged = resources.slice(offset, offset + limit);
  const results: SearchResult[] = paged.map((resource, index) => ({
    vector_id: resource.vector_id,
    title: resource.title,
    text: resource.text,
    score: Math.max(1, 8 - index),
    metadata: resource.metadata,
  }));

  return {
    results,
    query,
    count: results.length,
    total: resources.length,
    limit,
    offset,
    has_more: offset + limit < resources.length,
  };
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Helper to handle API responses with auth error detection.
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
  // Handle authentication errors
  if (response.status === 401) {
    if (browser) {
      const currentUrl = window.location.pathname + window.location.search;
      const encodedReturnTo = encodeURIComponent(currentUrl || "/");
      const redirectUrl = `/login?expired=true&returnTo=${encodedReturnTo}`;
      // Avoid loops if already on login
      if (window.location.pathname !== "/login") {
        goto(redirectUrl);
      }
    }
    throw new ApiError("Session expired", 401);
  }

  if (response.status === 403) {
    throw new ApiError("Active membership required", 403);
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorDetail = await response.json();
      if (errorDetail?.message) {
        errorMessage = errorDetail.message;
      } else if (errorDetail?.detail) {
        errorMessage = errorDetail.detail;
      }
    } catch {
      // Ignore JSON parsing errors
    }
    throw new ApiError(errorMessage, response.status);
  }

  return await response.json();
}

/**
 * Search for documents using semantic search
 * @param query - The search query string
 * @param filters - Optional filters to apply
 * @param limit - Results per page (default: 20)
 * @param offset - Number of results to skip (default: 0)
 * @param customFetch - Optional fetch function (use SvelteKit's fetch in load functions)
 * @returns Promise with search results
 * @throws ApiError if the request fails
 */
export async function searchDocuments(
  query: string,
  filters?: SearchFilters,
  limit: number = 20,
  offset: number = 0,
  customFetch: typeof fetch = fetch
): Promise<SearchResponse> {
  // Validate input - require either query or filters
  if ((!query || query.trim().length === 0) && !filters) {
    throw new ApiError("Search query or filters required");
  }

  if (query.length > SEARCH_CONFIG.maxQueryLength) {
    throw new ApiError(
      `Search query too long (max ${SEARCH_CONFIG.maxQueryLength} characters)`
    );
  }

  if (AUTH_BYPASS) {
    return buildMockSearchResponse(
      query.trim(),
      filters,
      limit ?? SEARCH_CONFIG.defaultTopK,
      offset ?? 0
    );
  }

  try {
    const requestBody: {
      query: string;
      limit: number;
      offset: number;
      sort_by: string;
      categories?: string[];
      search_mode?: string;
    } = {
      query: query ? query.trim() : "",
      limit: limit,
      offset: offset,
      sort_by: filters?.sort_by || "relevance",
    };

    // Add categories filter if provided (as top-level field, not nested)
    if (filters?.categories && filters.categories.length > 0) {
      requestBody.categories = filters.categories;
    }

    // Add search mode if provided (default is "hybrid" on backend)
    if (filters?.search_mode) {
      requestBody.search_mode = filters.search_mode;
    }

    const response = await customFetch(API_ENDPOINTS.search, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ← ADDED: Send session cookie
      body: JSON.stringify(requestBody),
    });

    return handleApiResponse<SearchResponse>(response);
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error: Unable to connect to the API. Please check your internet connection.",
        undefined,
        error.message
      );
    }

    // Handle other unexpected errors
    throw new ApiError(
      "An unexpected error occurred",
      undefined,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Get API statistics
 * @returns Promise with API stats
 * @throws ApiError if the request fails
 */
export async function getStats(): Promise<StatsResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.stats);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error: Unable to connect to the API",
        undefined,
        error.message
      );
    }

    throw new ApiError(
      "An unexpected error occurred",
      undefined,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Get a single resource by vector ID
 * @param vectorId - The vector ID (MD5 hash)
 * @returns Promise with resource details
 * @throws ApiError if the request fails
 */
export async function getResourceById(
  vectorId: string
): Promise<ResourceDetail> {
  if (AUTH_BYPASS) {
    const resource = MOCK_RESOURCES.find((item) => item.vector_id === vectorId);
    if (!resource) {
      throw new ApiError(`Mock resource not found: ${vectorId}`, 404);
    }
    return resource;
  }

  try {
    const response = await fetch(API_ENDPOINTS.resource(vectorId), {
      credentials: "include", // ← ADDED: Send session cookie
    });

    return handleApiResponse<ResourceDetail>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error: Unable to connect to the API",
        undefined,
        error.message
      );
    }

    throw new ApiError(
      "An unexpected error occurred",
      undefined,
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Get similar resources for a given vector ID
 * @param vectorId - The vector ID (MD5 hash) to find similar resources for
 * @returns Promise with similar resources
 * @throws ApiError if the request fails
 */
export async function getSimilarResources(
  vectorId: string
): Promise<SimilarResourcesResponse> {
  if (AUTH_BYPASS) {
    const target = MOCK_RESOURCES.find((item) => item.vector_id === vectorId);
    if (!target) {
      throw new ApiError(`Mock resource not found: ${vectorId}`, 404);
    }

    const similar = MOCK_RESOURCES.filter(
      (item) => item.vector_id !== vectorId
    );

    return {
      vector_id: vectorId,
      similar_resources: similar.map((resource, index) => ({
        vector_id: resource.vector_id,
        resource_id: resource.vector_id,
        title: resource.title,
        score: Math.max(1, 7 - index),
        metadata: resource.metadata,
      })),
      count: similar.length,
    };
  }

  try {
    const response = await fetch(API_ENDPOINTS.similarResources(vectorId), {
      credentials: "include", // ← ADDED: Send session cookie
    });

    return handleApiResponse<SimilarResourcesResponse>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        "Network error: Unable to connect to the API",
        undefined,
        error.message
      );
    }

    throw new ApiError(
      "An unexpected error occurred",
      undefined,
      error instanceof Error ? error.message : String(error)
    );
  }
}
