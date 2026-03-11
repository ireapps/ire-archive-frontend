<script lang="ts">
  import type { ComponentType } from "svelte";
  import Headphones from "lucide-svelte/icons/headphones";
  import Award from "lucide-svelte/icons/award";
  import Database from "lucide-svelte/icons/database";
  import BookOpen from "lucide-svelte/icons/book-open";
  import Lightbulb from "lucide-svelte/icons/lightbulb";
  import Presentation from "lucide-svelte/icons/presentation";

  const CATEGORY_ICONS: Record<string, ComponentType> = {
    audio: Headphones,
    "contest entry": Award,
    dataset: Database,
    journal: BookOpen,
    tipsheet: Lightbulb,
    webinar: Presentation,
  };

  interface Props {
    category: string | undefined;
    size?: "normal" | "compact";
  }

  let { category, size = "normal" }: Props = $props();

  const iconSize = $derived(size === "compact" ? 10 : 12);

  const sanitizedCategory = $derived(category?.trim());
  const Icon = $derived(
    sanitizedCategory
      ? (CATEGORY_ICONS[sanitizedCategory.toLowerCase()] ?? undefined)
      : undefined
  );
</script>

{#if sanitizedCategory}
  <span class="category-badge" class:compact={size === "compact"}>
    {#if Icon}
      <span class="category-badge__icon" aria-hidden="true">
        <Icon class="category-badge__svg" size={iconSize} strokeWidth={2} />
      </span>
    {/if}
    <span class="category-badge__label">{sanitizedCategory}</span>
  </span>
{/if}

<style lang="scss">
  .category-badge {
    display: inline-flex;
    align-items: center;
    column-gap: var(--spacing-xs);
    padding: calc(var(--spacing-xs) - 0.125rem) var(--spacing-sm);
    background-color: var(--color-badge-bg);
    color: var(--color-badge-text);
    font-size: var(--font-size-xs);
    font-weight: 500;
    border-radius: var(--radius-sm);
    &:hover {
      cursor: default;
    }

    &.compact {
      padding: 0.125rem var(--spacing-xs);
      font-size: 0.625rem;
      column-gap: 0.25rem;
    }
  }

  .category-badge__icon {
    line-height: 1;
  }

  .category-badge__label {
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
</style>
