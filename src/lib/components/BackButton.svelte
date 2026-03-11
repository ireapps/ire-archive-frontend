<script lang="ts">
  interface Props {
    visible: boolean;
    onClick: () => void;
    label?: string;
  }

  let { visible, onClick, label = "← Back to search" }: Props = $props();
</script>

{#if visible}
  <button class="back-button" onclick={onClick}>{label}</button>
{/if}

<style lang="scss">
  @use "../styles/mixins" as mixins;
  @use "../styles/variables" as vars;

  .back-button {
    @include mixins.button-reset;
    @include vars.hover-transition(background);
    border: 1px solid var(--color-link);
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-md);
    color: var(--color-link);

    &:hover {
      background: var(--color-bg);
    }
  }
</style>
