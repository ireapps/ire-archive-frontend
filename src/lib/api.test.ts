import { describe, it, expect, vi, beforeEach } from "vitest";
import * as appEnv from "$app/environment";
import { goto } from "$app/navigation";
import {
  searchDocuments,
  getResourceById,
  getSimilarResources,
  getStats,
  ApiError,
} from "./api";
import type {
  SearchResponse,
  ResourceDetail,
  SimilarResourcesResponse,
  StatsResponse,
} from "./types";

describe("API Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchDocuments", () => {
    it("should perform search with query", async () => {
      const mockResponse: SearchResponse = {
        results: [
          {
            vector_id: "test-id-1",
            title: "Test Resource",
            text: "Test description",
            score: 0.95,
            metadata: {
              resource_id: "123",
              authors: "Test Author",
              affiliations: "Test Org",
              date_created: "2024-01-01",
            },
          },
        ],
        query: "test query",
        count: 1,
        total: 1,
        limit: 20,
        offset: 0,
        has_more: false,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await searchDocuments("test query");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/search"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("test query"),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle search with filters", async () => {
      const mockResponse: SearchResponse = {
        results: [],
        query: "",
        count: 0,
        total: 0,
        limit: 20,
        offset: 0,
        has_more: false,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await searchDocuments("test", { categories: ["tipsheet"] });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining("tipsheet"),
        })
      );
    });

    it("should handle pagination parameters", async () => {
      const mockResponse: SearchResponse = {
        results: [],
        query: "test",
        count: 0,
        total: 100,
        limit: 20,
        offset: 40,
        has_more: true,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await searchDocuments("test", undefined, 20, 40);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"limit":20'),
        })
      );
    });

    it("should throw ApiError on failed request", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: vi.fn().mockResolvedValue({
          message: "Search failed",
          detail: "Database error",
        }),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);

      await expect(searchDocuments("test")).rejects.toThrow(ApiError);

      // Reset and mock again for the second call
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
      await expect(searchDocuments("test")).rejects.toThrow("Search failed");
    });

    it("should throw ApiError on network failure", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Network error"));

      await expect(searchDocuments("test")).rejects.toThrow(ApiError);

      // Second call for message check
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Network error"));
      await expect(searchDocuments("test")).rejects.toThrow(
        "Network error: Unable to connect to the API"
      );
    });

    it("should throw ApiError for empty query and no filters", async () => {
      await expect(searchDocuments("")).rejects.toThrow(ApiError);
      await expect(searchDocuments("")).rejects.toThrow(
        "Search query or filters required"
      );
    });

    it("should throw ApiError for query too long", async () => {
      const longQuery = "a".repeat(1001);
      await expect(searchDocuments(longQuery)).rejects.toThrow(ApiError);
      await expect(searchDocuments(longQuery)).rejects.toThrow(
        "Search query too long"
      );
    });

    it("redirects to login with returnTo on 401", async () => {
      (appEnv as any).browser = true;
      const originalLocation = window.location;
      Object.defineProperty(window, "location", {
        value: {
          pathname: "/search",
          search: "?q=prison%20conditions",
        },
        writable: true,
      });

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: vi.fn().mockResolvedValue({ detail: "Session expired" }),
      } as unknown as Response);

      await expect(searchDocuments("prison conditions")).rejects.toThrow(
        ApiError
      );

      expect(goto).toHaveBeenCalledWith(
        "/login?expired=true&returnTo=%2Fsearch%3Fq%3Dprison%2520conditions"
      );

      Object.defineProperty(window, "location", { value: originalLocation });
    });
  });

  describe("getResourceById", () => {
    it("should fetch resource by ID", async () => {
      const mockResource: ResourceDetail = {
        vector_id: "test-id",
        title: "Test Resource",
        text: "Full resource text content",
        doc_type: "document",
        metadata: {
          resource_id: "123",
          authors: "Test Author",
          affiliations: "Test Org",
          date_created: "2024-01-01",
          category: "tipsheet",
        },
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResource,
      } as Response);

      const result = await getResourceById("test-id");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/resource/test-id"),
        expect.objectContaining({
          credentials: "include",
        })
      );

      expect(result).toEqual(mockResource);
    });

    it("should throw ApiError for 404 not found", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: vi.fn().mockRejectedValue(new Error("Not JSON")),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);

      await expect(getResourceById("non-existent")).rejects.toThrow(ApiError);

      // Reset and mock again for the second call
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
      await expect(getResourceById("non-existent")).rejects.toThrow(
        "HTTP 404: Not Found"
      );
    });

    it("should throw ApiError on network failure", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Network error"));

      await expect(getResourceById("test-id")).rejects.toThrow(ApiError);
    });
  });

  describe("getSimilarResources", () => {
    it("should fetch similar resources", async () => {
      const mockResponse: SimilarResourcesResponse = {
        vector_id: "test-id",
        similar_resources: [
          {
            vector_id: "similar-1",
            resource_id: "456",
            title: "Similar Resource",
            score: 0.85,
            metadata: {
              authors: "Similar Author",
              affiliations: "Similar Org",
              date_created: "2024-01-02",
            },
          },
        ],
        count: 1,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await getSimilarResources("test-id");

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/resource/test-id/similar"),
        expect.objectContaining({
          credentials: "include",
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should throw ApiError for 404 not found", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: vi.fn().mockRejectedValue(new Error("Not JSON")),
      } as unknown as Response;

      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);

      await expect(getSimilarResources("non-existent")).rejects.toThrow(
        ApiError
      );

      // Reset and mock again for the second call
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse);
      await expect(getSimilarResources("non-existent")).rejects.toThrow(
        "HTTP 404: Not Found"
      );
    });

    it("should throw ApiError on network failure", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Network error"));

      await expect(getSimilarResources("test-id")).rejects.toThrow(ApiError);
    });
  });

  describe("getStats", () => {
    it("should fetch collection statistics", async () => {
      const mockStats: StatsResponse = {
        collection_name: "nonprofit_knowledge",
        total_documents: 33312,
        total_points: 33312,
        vector_size: 384,
        status: "ready",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      } as Response);

      const result = await getStats();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/stats"));

      expect(result).toEqual(mockStats);
    });

    it("should throw ApiError on failed request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      } as Response);

      await expect(getStats()).rejects.toThrow(ApiError);
    });

    it("should throw ApiError on network failure", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Network error"));

      await expect(getStats()).rejects.toThrow(ApiError);
      await expect(getStats()).rejects.toThrow(
        "Network error: Unable to connect to the API"
      );
    });
  });
});
