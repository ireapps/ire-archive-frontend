<script lang="ts">
  import { goto } from "$app/navigation";
  import Info from "lucide-svelte/icons/info";
  import SlidersHorizontal from "lucide-svelte/icons/sliders-horizontal";
  import type { SearchMode } from "../types";
  import { capFirst } from "../utils";
  import SearchModeToggle from "./SearchModeToggle.svelte";

  interface Props {
    categories: readonly string[];
    selectedCategories: readonly string[];
    sortBy: "relevance" | "newest" | "oldest";
    searchMode: SearchMode;
  }

  let { categories, selectedCategories, sortBy, searchMode }: Props = $props();
  let expanded = $state(false);
  let showAiTooltip = $state(false);

  // Refs for keyboard shortcuts
  let sortSelect = $state<HTMLSelectElement>();

  // Keyboard shortcuts for filters
  $effect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Alt + S - Focus sort filter
      if (event.altKey && event.key === "s") {
        event.preventDefault();
        if (!expanded) {
          expanded = true;
          setTimeout(() => sortSelect?.focus(), 50);
        } else {
          sortSelect?.focus();
        }
      }

      // Alt + X - Clear all filters
      if (event.altKey && event.key === "x") {
        event.preventDefault();
        clearFilters();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  function handleCategoryChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const form = checkbox.form;
    if (!form) return;

    // Check what the selection would be after this change
    const formData = new FormData(form);
    const currentSelection = formData.getAll("categories");

    // Prevent unchecking the last category
    if (currentSelection.length === 0) {
      event.preventDefault();
      checkbox.checked = true;
      return;
    }

    // Submit the form
    form.requestSubmit();
  }

  function toggleExpanded() {
    expanded = !expanded;
  }

  function showTooltip() {
    showAiTooltip = true;
  }

  function hideTooltip() {
    showAiTooltip = false;
  }

  function toggleTooltip(event: Event) {
    event.preventDefault();
    showAiTooltip = !showAiTooltip;
  }

  function clearFilters() {
    goto("/search");
  }
</script>

<div class="filter-bar">
  <button
    type="button"
    class="filter-toggle"
    onclick={toggleExpanded}
    aria-expanded={expanded}
    aria-controls="filter-controls-panel"
    aria-label={expanded
      ? "Collapse filter controls"
      : "Expand filter controls"}
  >
    <span class="filter-icon" aria-hidden="true">
      <SlidersHorizontal
        size={16}
        strokeWidth={2}
        class="filter-toggle__icon"
      />
    </span>
    <span class="filter-label">Controls</span>
    <span class="expand-icon" aria-hidden="true">{expanded ? "▲" : "▼"}</span>
  </button>

  {#if expanded}
    <div
      id="filter-controls-panel"
      class="filter-controls"
      role="group"
      aria-label="Search filters and sorting options"
    >
      <div class="filter-group category-group">
        <span class="group-label">Categories</span>
        <div class="category-checkboxes">
          {#each categories as category}
            <label class="category-checkbox">
              <input
                type="checkbox"
                name="categories"
                value={category}
                checked={selectedCategories.includes(category)}
                onchange={handleCategoryChange}
              />
              <span>{capFirst(category)}</span>
            </label>
          {/each}
        </div>
      </div>

      <div class="filter-group">
        <label for="sort-filter">Sort By</label>
        <select
          id="sort-filter"
          name="sort"
          bind:this={sortSelect}
          value={sortBy}
          onchange={(e) => e.currentTarget.form?.requestSubmit()}
          aria-label="Sort results (Alt+S)"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div class="filter-group mode-toggle-group">
        <div class="group-header">
          <span class="group-label">AI-powered search</span>
          <button
            type="button"
            class="mode-toggle-info"
            aria-label="About AI-powered search"
            aria-describedby={showAiTooltip ? "ai-powered-tooltip" : undefined}
            onmouseenter={showTooltip}
            onmouseleave={hideTooltip}
            onfocus={showTooltip}
            onblur={hideTooltip}
            onclick={toggleTooltip}
          >
            <Info
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              class="mode-toggle-info__icon"
            />
          </button>
          {#if showAiTooltip}
            <div
              id="ai-powered-tooltip"
              role="tooltip"
              class="mode-toggle-tooltip"
              aria-live="polite"
            >
              Use machine learning to find conceptually related resources
            </div>
          {/if}
        </div>
        <SearchModeToggle {searchMode} submitOnChange={true} />
      </div>

      <div class="filter-group">
        <button
          type="button"
          class="clear-filters"
          onclick={clearFilters}
          aria-label="Clear search and filters (Alt+X)"
        >
          Clear
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .filter-bar {
    margin: $spacing-xl 0;
    border: 1px solid $color-border-dark;
    background: $color-bg-lighter;
  }

  .filter-toggle {
    width: 100%;
    padding: $spacing-md $spacing-lg;
    background: $color-bg-light;
    border: none;
    border-bottom: 1px solid $color-border-dark;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: $spacing-sm + 0.125rem;
    font-size: $font-size-base;
    color: $color-text;
    text-align: left;
    @include hover-transition(background);

    @include tablet-down {
      padding: $spacing-lg;
      min-height: 3rem; // 48px minimum for comfortable mobile tapping
    }

    &:hover {
      background: #ebebeb;
    }
  }

  .filter-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .filter-label {
    flex: 1;
    font-weight: 500;
  }

  .expand-icon {
    font-size: $font-size-base - 0.0125rem;
    color: $color-text-light;
  }

  .filter-controls {
    padding: $spacing-md + 0.1875rem;
    display: flex;
    flex-direction: column;
    gap: $spacing-md + 0.1875rem;
    font-size: $font-size-sm; // Slightly smaller text to reduce wrapping

    @include tablet-down {
      padding: $spacing-md;
      gap: $spacing-md; // More spacing between controls on mobile
    }

    @include desktop {
      flex-direction: row;
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm $spacing-md;

    @include tablet-down {
      gap: $spacing-xs;
    }

    @include desktop {
      flex: 1;
      min-width: 12.5rem;
    }

    label,
    .group-label {
      font-size: inherit;
      font-weight: 400;
      color: $color-text;
    }

    select {
      padding: $spacing-sm + 0.125rem $spacing-md - 0.125rem;
      font-size: $font-size-base;
      border: 1px solid $color-border-dark;
      border-radius: $radius-md;
      background: $color-bg-white;
      color: $color-text;
      cursor: pointer;

      @include tablet-down {
        padding: $spacing-md; // Larger touch target for mobile
        font-size: $font-size-lg; // Prevent iOS zoom
      }

      &:focus {
        outline: 2px solid #0066cc;
        outline-offset: 2px;
      }
    }
  }

  .category-group {
    @include desktop {
      flex: 1.625;
      min-width: 20rem;
    }
  }

  .category-checkboxes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md $spacing-md;
    border: 1px solid $color-border-dark;
    border-radius: $radius-md;
    background: $color-bg-white;
    padding: $spacing-sm $spacing-md;

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
      gap: $spacing-md $spacing-xl;
    }
  }

  .category-checkbox {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    cursor: pointer;
    font-weight: normal;

    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      accent-color: $color-link;
    }

    span {
      font-size: inherit;
      white-space: nowrap;
    }

    @include tablet-down {
      padding: $spacing-xs 0;

      span {
        white-space: normal; // Allow wrapping on narrow screens
      }
    }
  }

  .mode-toggle-group {
    position: relative;

    .group-header {
      position: relative;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
    }

    .mode-toggle-info {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      border: 0;
      background: $color-bg-white;
      font-size: $font-size-sm;
      font-weight: 600;
      color: $color-text-light;
      cursor: pointer;
      @include hover-transition(background);
    }

    .mode-toggle-info:hover,
    .mode-toggle-info:focus {
      background: $color-bg-light;
      color: $color-text;
      border-color: $color-border;
      outline: none;
    }

    .mode-toggle-tooltip {
      position: absolute;
      top: calc(100% + $spacing-xs);
      left: 0;
      padding: $spacing-xs + 0.125rem $spacing-sm + 0.125rem;
      max-width: 20rem;
      font-size: $font-size-sm;
      line-height: 1.3;
      color: $color-text;
      background: $color-bg-white;
      border: 1px solid $color-border-dark;
      border-radius: $radius-md;
      box-shadow: 0 2px 8px rgba(16, 24, 40, 0.15);
      z-index: 10;
    }

    @include desktop {
      flex: 0 0 auto;
      min-width: auto;
    }
  }

  .clear-filters {
    @include desktop {
      margin-top: $spacing-lg + 0.125rem;
    }
    padding: $spacing-sm + 0.125rem $spacing-md + 0.25rem;
    background: $color-bg-white;
    border: 1px solid $color-border-dark;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: $font-size-base;
    color: $color-text-light;
    @include hover-transition(background);

    @include tablet-down {
      padding: $spacing-md; // Larger touch target for mobile
      font-size: $font-size-lg; // Better visibility on mobile
    }

    &:hover {
      background: $color-bg-light;
      color: $color-text;
    }

    @include desktop {
      margin-left: auto;
    }
  }
</style>
