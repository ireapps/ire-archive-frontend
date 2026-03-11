<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { focusSearchInput } from "$lib/utils/dom";
  import { SITE_METADATA } from "$lib/config";
  import SearchBox from "$lib/components/SearchBox.svelte";
  import SuggestedSearches from "$lib/components/SuggestedSearches.svelte";
  import logoHomepage from "../assets/ire-square-logo.svg";

  let query = $state("");

  onMount(() => {
    // Focus on search input when page loads
    focusSearchInput();
  });

  function handleSearchSubmit(event: SubmitEvent) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const searchParams = new URLSearchParams();
    const rawQuery = formData.get("q");
    const trimmedQuery = typeof rawQuery === "string" ? rawQuery.trim() : "";

    if (trimmedQuery.length > 0) {
      searchParams.set("q", trimmedQuery);
    }

    const searchUrl = searchParams.toString()
      ? `/search?${searchParams.toString()}`
      : "/search";

    goto(searchUrl);
  }
</script>

<div class="homepage-view">
  <div class="homepage-header">
    <a href="https://ire.org/"
      ><img
        src={logoHomepage}
        alt="IRE Resource Center"
        class="homepage-logo"
      /></a
    >
    <h1 class="homepage-title">Resource Center</h1>
  </div>
  <p class="homepage-description">
    {SITE_METADATA.description}
  </p>
  <div class="homepage-search-wrapper">
    <form method="get" action="/search" onsubmit={handleSearchSubmit}>
      <SearchBox bind:query />
    </form>
  </div>
  <div class="homepage-suggestions-wrapper">
    <SuggestedSearches />
  </div>
</div>

<style lang="scss">
  @use "../lib/styles/variables" as *;

  .homepage-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-xl) 0;
    width: 100%;
    @include tablet-down {
      padding: var(--spacing-xs) 0;
    }
  }

  .homepage-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);

    @include tablet-down {
      gap: var(--spacing-sm);
    }

    a {
      display: flex;
      align-items: center;
      transition: opacity var(--transition-fast);

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .homepage-logo {
    height: 60px;
    display: block;

    @include tablet {
      height: 38px;
    }
    @include mobile {
      height: 32px;
    }
  }

  .homepage-title {
    font-family: "Mogan", serif;
    color: var(--color-headline);
    line-height: 1;
    font-weight: 700;
    margin: 0;
    text-align: center;
    // Mobile-first: base size for smallest screens (0-400px)
    font-size: calc(var(--font-size-3xl) * 0.95);

    // Tablet range (401px-767px)
    @media (min-width: 401px) and (max-width: 767px) {
      font-size: calc(var(--font-size-4xl) * 0.9);
    }

    // Desktop (768px-959px)
    @include desktop {
      font-size: calc(var(--font-size-4xl) * 1.15);
    }

    // Wide screens (960px+)
    @include wide {
      font-size: var(--font-size-5xl);
    }
  }

  .homepage-description {
    color: var(--color-text-light);
    font-size: var(--font-size-lg);
    margin: var(--spacing-xs) 0 var(--spacing-lg) 0;
    text-align: center;
    max-width: 800px;
    line-height: 1.45;

    @include tablet {
      font-size: var(--font-size-md);
      margin: 0 0 var(--spacing-xs) 0;
      max-width: 95%;
    }
    @include mobile {
      font-size: var(--font-size-sm);
    }
  }

  .homepage-search-wrapper {
    margin: var(--spacing-lg) 0 0 0;
    width: 100%;
    max-width: 500px;

    @include desktop {
      max-width: 500px;
    }
    @include wide {
      max-width: 650px;
    }
    @include tablet {
      max-width: 400px;
    }
    @include mobile {
      max-width: 350px;
    }
  }

  .homepage-suggestions-wrapper {
    width: 100%;
    max-width: 800px;
    text-align: center;

    @include desktop {
      max-width: 500px;
    }
    @include wide {
      max-width: 650px;
    }
    @include tablet {
      max-width: 400px;
    }
    @include mobile {
      max-width: 350px;
    }
  }
</style>
