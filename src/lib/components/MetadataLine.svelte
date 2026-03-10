<script lang="ts">
  interface Props {
    author?: string | null;
    affiliation?: string | null;
    conferenceYear?: string | null;
  }

  let { author, affiliation, conferenceYear }: Props = $props();

  const parts = $derived.by(() => {
    const result = [];
    if (author) result.push(author);
    if (affiliation) result.push(affiliation);
    if (conferenceYear) result.push(conferenceYear);
    return result;
  });
</script>

{#if parts.length > 0}
  <div class="metadata-line">
    <div class="metadata-line__text">
      {#each parts as part, i}
        {#if i > 0}<span class="metadata-line__separator"> • </span>{/if}
        <span>{part}</span>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  .metadata-line {
    color: $color-text-light;
    font-size: $font-size-sm;
    margin-bottom: $spacing-xs;
  }

  .metadata-line__text {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .metadata-line__separator {
    margin: 0 $spacing-xs;
  }
</style>
