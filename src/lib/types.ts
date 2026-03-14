export interface Download {
  id: string;
  url: string;
  name: string;
}

/**
 * Shared metadata interface for resources
 * Used by SearchResult, ResourceDetail, and SimilarResource
 */
export interface ResourceMetadata {
  vector_id?: string;
  resource_id?: string;
  authors?: string;
  affiliations?: string;
  category?: string;
  subject?: string;
  description?: string;
  tags?: string[];
  keywords?: string[];
  conference?: string;
  conference_year?: string;
  year?: string;
  published?: string;
  resource_year?: number | null;
  year_computed?: number | null;
  date_created?: string;
  date_updated?: string;
  contest_name?: string;
  contest_entry_status?: string;
  downloads?: Download[];
  speakers?: string[];
  [key: string]: unknown;
}

export interface SearchResult {
  vector_id: string;
  title: string;
  text: string;
  score: number;
  metadata?: ResourceMetadata;
}

export interface ResourceDetail {
  vector_id: string;
  title: string;
  text: string;
  doc_type: string;
  metadata: ResourceMetadata;
}

/**
 * API statistics response
 */
export interface StatsResponse {
  collection_name: string;
  total_documents: number;
  total_points: number;
  vector_size: number;
  status: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  count: number;
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface SearchError {
  message: string;
  detail?: string;
}

export type SearchMode = "hybrid" | "keyword";

export interface SearchFilters {
  categories?: string[];
  sort_by?: "relevance" | "newest" | "oldest";
  search_mode?: SearchMode;
}

export interface SimilarResource {
  vector_id: string;
  resource_id: string;
  title: string;
  score: number;
  metadata: ResourceMetadata;
}

export interface SimilarResourcesResponse {
  vector_id: string;
  similar_resources: SimilarResource[];
  count: number;
}
