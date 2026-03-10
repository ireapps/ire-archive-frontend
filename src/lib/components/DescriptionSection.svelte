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
    font-size: $font-size-lg;
    font-weight: 600;
    margin: $spacing-lg 0 $spacing-sm 0;
    color: $color-headline;
  }

  .description p {
    color: $color-text;
    line-height: 1.6;
    margin: 0;
    font-size: $font-size-base;
  }
</style>
