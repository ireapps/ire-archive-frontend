<script lang="ts">
  import Search from "lucide-svelte/icons/search";

  let {
    query = $bindable(""),
    loading = false,
  }: {
    query?: string;
    loading?: boolean;
  } = $props();
</script>

<div class="search-box">
  <input
    type="text"
    name="q"
    bind:value={query}
    placeholder=""
    aria-label="Search query. Press forward slash (/) to focus, Escape to clear"
  />
  <button type="submit" aria-label="Search (Enter)" disabled={loading}>
    <Search size={20} />
  </button>
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .search-box {
    display: flex;
    gap: var(--spacing-sm);

    @include tablet-down {
      gap: var(--spacing-sm);
    }
  }

  input {
    flex: 1;
    padding: var(--spacing-lg) var(--spacing-md);
    font-size: var(--font-size-lg);
    border: 1px solid var(--color-border-darker);
    background: var(--color-bg-white);
    @include hover-transition(border-color);

    &:focus {
      outline: none;
      border-color: var(--color-link);
      box-shadow: 0 0 0 1px var(--color-link);
    }

    @include tablet-down {
      font-size: var(--font-size-base);
      padding: var(--spacing-md) var(--spacing-sm);
    }
  }

  button {
    padding: var(--spacing-lg) var(--spacing-xl);
    font-size: var(--font-size-lg);
    background: var(--color-link);
    color: white;
    border: 1px solid var(--color-link);
    cursor: pointer;
    @include hover-transition(background);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: var(--color-link-hover);
      border-color: var(--color-link-hover);
    }

    &:disabled {
      background: var(--color-text-muted);
      border-color: var(--color-text-muted);
      cursor: not-allowed;
    }

    @include tablet-down {
      padding: var(--spacing-lg) var(--spacing-md);
      padding: var(--spacing-md);
      gap: 0;
      font-size: var(--font-size-base);
    }
  }
</style>
