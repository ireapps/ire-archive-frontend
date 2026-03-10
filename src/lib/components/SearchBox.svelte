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
    gap: $spacing-md - 0.125rem;

    @include tablet-down {
      gap: $spacing-sm;
    }
  }

  input {
    flex: 1;
    padding: $spacing-lg $spacing-md;
    font-size: $font-size-lg;
    border: 1px solid $color-border-darker;
    background: $color-bg-white;
    @include hover-transition(border-color);

    &:focus {
      outline: none;
      border-color: var(--color-link);
      box-shadow: 0 0 0 1px var(--color-link);
    }

    @include tablet-down {
      font-size: $font-size-base;
      padding: $spacing-md $spacing-sm;
    }
  }

  button {
    padding: $spacing-lg $spacing-lg + 0.25rem;
    font-size: $font-size-lg;
    background: var(--color-link);
    color: white;
    border: 1px solid var(--color-link);
    cursor: pointer;
    @include hover-transition(background);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    white-space: nowrap;

    &:hover:not(:disabled) {
      background: var(--color-link-hover);
      border-color: var(--color-link-hover);
    }

    &:disabled {
      background: $color-text-lighter;
      border-color: $color-text-lighter;
      cursor: not-allowed;
    }

    @include tablet-down {
      padding: $spacing-lg $spacing-md;
      padding: $spacing-md;
      gap: 0;
      font-size: $font-size-base;
    }
  }
</style>
