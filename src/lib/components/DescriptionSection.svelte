<script lang="ts">
  import { formatDescription } from '$lib/utils';

  interface Props {
    description?: string;
  }

  let { description }: Props = $props();
</script>

{#if description}
  <section class="description">
    <h3>Description</h3>
    <p>{@html formatDescription(description)}</p>
  </section>
{/if}

<style lang="scss">
  @use '../styles/variables' as *;

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
    color: var(--color-headline);
  }

  .description p {
    color: var(--color-text);
    line-height: 1.6;
    margin: 0;
    font-size: var(--font-size-base);
  }
</style>
