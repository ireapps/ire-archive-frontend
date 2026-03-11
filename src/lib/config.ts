/**
 * Application configuration
 * Manages environment-specific settings like API base URL
 */

/**
 * Site metadata for HTML head and social sharing.
 * Values are driven by environment variables so that community deployments
 * can override them without touching source code.  IRE's production values
 * live in site/.env.production (not committed as a secret).
 */
export const SITE_METADATA = {
  title: import.meta.env.VITE_SITE_TITLE || "Archive Search",
  description:
    import.meta.env.VITE_SITE_DESCRIPTION ||
    "Search thousands of tipsheets, transcripts and training materials",
  image: import.meta.env.VITE_SITE_IMAGE || "/logo.png",
} as const;

/**
 * Get the API base URL from environment variables.
 * Falls back to "/api" which works with the Vercel rewrite proxy
 * defined in vercel.json (see BACKEND_URL env var).
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  search: `${API_BASE_URL}/search`,
  stats: `${API_BASE_URL}/stats`,
  resource: (id: string) => `${API_BASE_URL}/resource/${id}`,
  similarResources: (id: string) => `${API_BASE_URL}/resource/${id}/similar`,
} as const;

/**
 * Default search configuration
 */
export const SEARCH_CONFIG = {
  defaultTopK: 100,
  maxQueryLength: 500,
} as const;

/**
 * Valid resource categories.
 *
 * Defaults to the IRE document types that match the backend VALID_CATEGORIES
 * in app/config.py.  Community deployments can override this by setting the
 * VITE_CATEGORIES environment variable to a JSON array, e.g.:
 *
 *   VITE_CATEGORIES=["audio","tipsheet","webinar","dataset"]
 *
 * Invalid JSON or a non-array value falls back silently to the defaults.
 */
const _defaultCategories = [
  "audio",
  "contest entry",
  "dataset",
  "journal",
  "tipsheet",
  "webinar",
] as const;

function _isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export const VALID_CATEGORIES: readonly string[] = (() => {
  const raw = import.meta.env.VITE_CATEGORIES;
  if (!raw) return _defaultCategories;
  try {
    const parsed: unknown = JSON.parse(raw);
    return _isStringArray(parsed) ? parsed : _defaultCategories;
  } catch {
    return _defaultCategories;
  }
})();

/**
 * Static filter options (eliminates need for API call)
 */
export const FILTER_OPTIONS = {
  categories: VALID_CATEGORIES,
} as const;
