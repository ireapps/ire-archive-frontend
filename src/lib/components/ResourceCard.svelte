<script lang="ts">
  import type { SearchMode } from "../types";
  import {
    stripHtml,
    truncateText,
    formatDescription,
    getDisplayTitle,
  } from "../utils";
  import {
    getAuthors,
    getAffiliations,
    getConferenceYear,
    getYear,
  } from "../utils/byline";
  import CategoryBadge from "./CategoryBadge.svelte";
  import MetadataLine from "./MetadataLine.svelte";

  interface Props {
    resource: {
      vector_id?: string;
      title: string;
      text?: string;
      metadata?: {
        vector_id?: string;
        category?: string;
        description?: string;
        authors?: string;
        affiliations?: string;
        resource_year?: number | null;
        conference?: string;
        year?: string;
      };
    };
    size?: "normal" | "compact";
    showDescription?: boolean;
    score?: number;
    searchMode?: SearchMode;
    showScore?: boolean;
  }

  let {
    resource,
    size = "normal",
    showDescription = false,
    score,
    searchMode = "hybrid",
    showScore = true,
  }: Props = $props();

  // Use vector_id at top level first (for both SearchResult and SimilarResource), fallback to metadata.vector_id
  let resourceId = $derived(resource.vector_id || resource.metadata?.vector_id);
  let cleanTitle = $derived(getDisplayTitle(resource.title, resource.metadata));
  let author = $derived(getAuthors(resource));
  let affiliation = $derived(getAffiliations(resource));
  let conferenceYear = $derived(getConferenceYear(resource));
  let year = $derived(getYear(resource));
  let category = $derived(resource.metadata?.category);

  // Description handling (for search results)
  let description = $derived(resource.metadata?.description);
  let truncatedDescription = $derived(
    description && showDescription
      ? truncateText(stripHtml(description), 300)
      : null
  );

  // Determine heading level based on size
  let HeadingTag = $derived(size === "compact" ? "h4" : "h3");
  let yearLabel = $derived(year ? year.toString() : "Undated");

  // Format relevance score as dot visualization based on search mode
  let formattedScore = $derived.by(() => {
    if (!showScore || score === undefined) return null;

    let filled: number;

    if (searchMode === "keyword") {
      // BM25 keyword search scores (0-20+ range, unbounded)
      if (score >= 10)
        filled = 5; // Excellent exact match
      else if (score >= 6)
        filled = 4; // Good match, multiple terms
      else if (score >= 3)
        filled = 3; // Decent match, some terms
      else if (score >= 1.5)
        filled = 2; // Weak match, few terms
      else filled = 1; // Minimal match
    } else {
      // Hybrid semantic search with cross-encoder scores (-7 to +10 range)
      if (score >= 6)
        filled = 5; // Highly relevant
      else if (score >= 3)
        filled = 4; // Very relevant
      else if (score >= 0)
        filled = 3; // Relevant
      else if (score >= -3)
        filled = 2; // Possibly relevant
      else filled = 1; // Marginally relevant
    }

    return "●".repeat(filled) + "○".repeat(5 - filled);
  });

  // Contextual tooltip based on search mode
  let scoreTooltip = $derived(
    searchMode === "keyword" ? "Keyword match" : "Semantic relevance"
  );
</script>

<div
  class="resource-card"
  class:compact={size === "compact"}
  data-relevance-score={score}
  data-vector-id={resourceId}
  data-testid="result-card"
>
  <div class="title-row">
    <svelte:element this={HeadingTag}>
      <a href="/resource/{resourceId}">
        {cleanTitle}
      </a>
    </svelte:element>

    <span class="year-badge">{yearLabel}</span>
  </div>

  {#if author || affiliation || conferenceYear}
    <MetadataLine {author} {affiliation} {conferenceYear} />
  {/if}

  {#if truncatedDescription}
    <div class="content-preview">
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- content comes from trusted API -->
      {@html formatDescription(truncatedDescription)}
    </div>
  {/if}

  <div class="badges">
    <CategoryBadge {category} {size} />
    {#if formattedScore}
      <span class="relevance-score" title={scoreTooltip}>{formattedScore}</span>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../styles/mixins" as *;

  .resource-card {
    h3 {
      @include card-title(var(--font-size-xl));
      margin-bottom: 0;
    }

    h4 {
      @include card-title(var(--font-size-lg));
      margin-bottom: 0;
    }

    &.compact {
      h4 {
        font-size: var(--font-size-md);
      }
    }
  }

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
  }

  .year-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    background-color: var(--color-badge-bg);
    color: var(--color-badge-text);
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    height: fit-content;
  }

  .badges {
    @include badge-container;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .relevance-score {
    display: inline-flex;
    align-items: center;
    color: var(--color-text-light);
    font-size: var(--font-size-xs);
    font-weight: 400;
    white-space: nowrap;
    margin-left: auto;
    cursor: default;
  }

  .content-preview {
    color: var(--color-text);
    line-height: 1.6;
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-sm);
  }
</style>
