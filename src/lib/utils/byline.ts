import { stripHtml } from "../utils";

type ResourceWithMetadata = {
  metadata?: {
    authors?: string;
    affiliations?: string;
    resource_year?: number;
    conference?: string;
    year?: string;
  };
};

/**
 * Get cleaned authors string or null
 */
export function getAuthors(resource: ResourceWithMetadata): string | null {
  const cleaned = resource.metadata?.authors
    ? stripHtml(resource.metadata.authors).trim()
    : "";
  return cleaned || null;
}

/**
 * Get cleaned affiliations string or null
 */
export function getAffiliations(resource: ResourceWithMetadata): string | null {
  const cleaned = resource.metadata?.affiliations
    ? stripHtml(resource.metadata.affiliations).trim()
    : "";
  return cleaned || null;
}

/**
 * Get resource year or null
 */
export function getYear(resource: ResourceWithMetadata): number | null {
  return resource.metadata?.resource_year ?? null;
}

/**
 * Get paired conference and year string (e.g., "IRE 2023")
 */
export function getConferenceYear(
  resource: ResourceWithMetadata
): string | null {
  const conferenceRaw = resource.metadata?.conference
    ? stripHtml(resource.metadata.conference).trim()
    : "";
  const yearRaw = resource.metadata?.year
    ? stripHtml(resource.metadata.year).trim()
    : "";

  const conference =
    conferenceRaw.toLowerCase() === "not listed" ? "" : conferenceRaw;
  const year = yearRaw.toLowerCase() === "not listed" ? "" : yearRaw;

  if (!conference || !year) return null;

  return `${conference} ${year}`;
}
