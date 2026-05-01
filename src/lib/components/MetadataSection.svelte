<script lang="ts">
  import { capFirst } from "$lib/utils";
  import {
    getAuthors,
    getAffiliations,
    getConferenceYear,
    getYear,
  } from "$lib/utils/byline";
  import type { ResourceDetail } from "$lib/types";

  interface Props {
    metadata: ResourceDetail["metadata"];
  }

  let { metadata }: Props = $props();

  // Create a resource object for the byline functions
  let resource = $derived({ metadata });
  let authors = $derived(getAuthors(resource));
  let affiliations = $derived(getAffiliations(resource));
  let conferenceYear = $derived(getConferenceYear(resource));
  let year = $derived(getYear(resource));
</script>

<dl class="metadata">
  {#if metadata.resource_id}
    <div class="meta-item">
      <dt>Resource ID</dt>
      <dd>{metadata.resource_id}</dd>
    </div>
  {/if}

  {#if metadata.category}
    <div class="meta-item">
      <dt>Category</dt>
      <dd>
        <a href="/search?categories={encodeURIComponent(metadata.category)}">
          {capFirst(metadata.category)}
        </a>
      </dd>
    </div>
  {/if}

  {#if authors}
    <div class="meta-item">
      <dt>Authors</dt>
      <dd>{authors}</dd>
    </div>
  {/if}

  {#if affiliations}
    <div class="meta-item">
      <dt>Affiliations</dt>
      <dd>{affiliations}</dd>
    </div>
  {/if}

  {#if year}
    <div class="meta-item">
      <dt>Published</dt>
      <dd>{year}</dd>
    </div>
  {/if}

  {#if conferenceYear}
    <div class="meta-item">
      <dt>Conference</dt>
      <dd>{conferenceYear}</dd>
    </div>
  {/if}

  {#if metadata.contest_name}
    <div class="meta-item">
      <dt>Contest</dt>
      <dd>{metadata.contest_name}</dd>
    </div>
  {/if}
</dl>

<style lang="scss">
  @use "../styles/variables" as *;
  @use "../styles/mixins" as *;

  .metadata {
    margin: 0 0 var(--spacing-lg) 0;
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }

  .meta-item {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid var(--color-bg);

    &:last-child {
      border-bottom: none;
    }
  }

  dt {
    font-weight: 500;
    color: var(--color-headline);
    font-size: var(--font-size-base);
  }

  dd {
    margin: 0;
    color: var(--color-text-light);
    font-size: var(--font-size-base);

    a {
      @include link-style;
    }
  }
</style>
