<script lang="ts">
  import type { SimilarResource } from "$lib/types";
  import ResourceCard from "./ResourceCard.svelte";
  import SkeletonCard from "./SkeletonCard.svelte";

  interface Props {
    resources?: SimilarResource[];
    loading?: boolean;
    error?: string | null;
  }

  let { resources = [], loading = false, error = null }: Props = $props();
</script>

{#if loading}
  <section class="similar-resources">
    <h3>More like this</h3>
    <div
      class="similar-list"
      role="status"
      aria-live="polite"
      aria-label="Loading similar resources"
    >
      {#each Array(3) as _, i (i)}
        <SkeletonCard size="compact" />
      {/each}
    </div>
  </section>
{:else if error}
  <div class="error-message" role="alert">
    <p>Unable to load similar resources: {error}</p>
  </div>
{:else if resources.length > 0}
  <section class="similar-resources">
    <h3>More like this</h3>
    <div class="similar-list">
      {#each resources as resource, index (resource.vector_id || resource.resource_id || index)}
        <ResourceCard
          {resource}
          size="compact"
          showScore={false}
        />
      {/each}
    </div>
  </section>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  .similar-resources {
    h3 {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin: var(--spacing-lg) 0 var(--spacing-md) 0;
      color: var(--color-headline);
    }
  }

  .similar-list {
    display: flex;
    flex-direction: column;

    :global(.resource-card) {
      padding: var(--spacing-lg) 0;
      border-bottom: 1px solid var(--color-border);

      &:first-of-type {
        padding-top: 0;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .error-message {
    padding: var(--spacing-lg) 0;

    p {
      color: var(--color-text-light);
      font-size: var(--font-size-sm);
      font-style: italic;
    }
  }
</style>
