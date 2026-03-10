<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { base } from "$app/paths";

  let {
    count = 3,
    mobileCount = 2,
  }: {
    count?: number;
    mobileCount?: number;
  } = $props();

  // Mobile breakpoint in pixels
  const MOBILE_BREAKPOINT = 768;

  let isMobile = $state(false);

  // Curated list of investigative journalism topics
  const allSuggestions = [
    // Government & Politics
    "campaign finance",
    "lobbying",
    "political ads",
    "voting rights",
    "dark money",
    "government contracts",
    "municipal corruption",

    // Law Enforcement & Justice
    "police misconduct",
    "use of force",
    "asset forfeiture",
    "wrongful convictions",
    "prison conditions",
    "prosecutorial misconduct",
    "police shootings",

    // Public Records & Transparency
    "FOIA",
    "public records",
    "open meetings",
    "sunshine laws",

    // Data & Techniques
    "spreadsheets",
    "SQL",
    "mapping",
    "web scraping",
    "data visualization",
    "document state of mind",
    "python",
    "machine learning",
    "natural language processing",

    // Health & Safety
    "hospitals",
    "nursing homes",
    "drug prices",
    "environmental hazards",
    "workplace safety",
    "water quality",

    // Business & Finance
    "corporate fraud",
    "nonprofits",
    "tax evasion",
    "bankruptcy",
    "real estate",
    "housing discrimination",
    "financial crimes",

    // Education & Social Issues
    "school funding",
    "higher education",
    "immigration",
    "child welfare",
    "homelessness",

    // Media & Journalism
    "source protection",
    "collaboration",
    "interviewing",
    "fact-checking",
  ];

  let selectedSuggestions = $state<string[]>([]);
  let allSelectedSuggestions = $state<string[]>([]);

  // Fisher-Yates shuffle to randomly select suggestions
  function getRandomSuggestions(arr: string[], n: number): string[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  }

  function checkMobile() {
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  }

  // Update displayed suggestions based on screen size
  $effect(() => {
    const displayCount = isMobile ? mobileCount : count;
    selectedSuggestions = allSelectedSuggestions.slice(0, displayCount);
  });

  onMount(() => {
    // Check initial screen size
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Select suggestions (always select the max count, then slice based on screen size)
    allSelectedSuggestions = getRandomSuggestions(allSuggestions, count);
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", checkMobile);
    }
  });
</script>

<div class="suggested-searches">
  <p class="suggestions-content">
    <span class="hide-mobile">Not sure where to start?</span>
    <span class="show-mobile">Stumped?</span>
    Try{" "}
    {#each selectedSuggestions as suggestion, i}
      <a
        href="/search?q={encodeURIComponent(suggestion)}"
        data-sveltekit-preload-data="hover"
        class="suggestion-link"
        aria-label={`Search for ${suggestion}`}>{suggestion}</a
      >{#if i < selectedSuggestions.length - 2},{" "}{/if}{#if i === selectedSuggestions.length - 2}{" "}or{" "}{/if}
    {/each}.
  </p>
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .suggested-searches {
    margin-top: $spacing-md;
    @include tablet-down {
      margin-top: $spacing-sm;
    }
  }

  .suggestions-content {
    color: $color-text-light;
    font-size: $font-size-base;
    line-height: 1.5;
    margin: 0;
    @include tablet-down {
      font-size: $font-size-sm;
    }
  }

  .hide-mobile {
    @include tablet-down {
      display: none;
    }
  }

  .show-mobile {
    display: none;
    @include tablet-down {
      display: inline;
    }
  }

  .suggestion-link {
    @include button-reset;
    color: var(--color-link);
    font-size: inherit;
    text-decoration: none;
    @include hover-transition(text-decoration);
    display: inline;
    padding: 0;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      color: var(--color-link-hover);
    }

    &:focus {
      @include focus-outline($color-headline);
    }
  }
</style>
