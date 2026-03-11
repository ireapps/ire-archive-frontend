<script lang="ts">
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";
  import { onMount } from "svelte";
  import { getResourceById, getSimilarResources, ApiError } from "$lib/api";
  import type { ResourceDetail, SimilarResource } from "$lib/types";
  import { getDisplayTitle } from "$lib/utils";
  import BackButton from "$lib/components/BackButton.svelte";
  import SkeletonResourceDetail from "$lib/components/SkeletonResourceDetail.svelte";
  import MetadataSection from "$lib/components/MetadataSection.svelte";
  import DescriptionSection from "$lib/components/DescriptionSection.svelte";
  import DownloadsSection from "$lib/components/DownloadsSection.svelte";
  import ContactCallout from "$lib/components/ContactCallout.svelte";
  import SimilarResources from "$lib/components/SimilarResources.svelte";
  import { SITE_METADATA } from "$lib/config";

  // Get ID from URL parameter - reactive to route changes
  let id = $derived($page.params.id);

  let resource = $state<ResourceDetail | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Similar resources state
  let similarResources = $state<SimilarResource[]>([]);
  let similarLoading = $state(false);
  let similarError = $state<string | null>(null);

  // Track if user navigated from within the app (for back button visibility)
  // We use a two-part check:
  // 1. isInitialMount tracks whether the component has completed its first mount
  // 2. afterNavigate only sets hasInternalNavigation=true AFTER initial mount
  // This distinguishes direct page load (where afterNavigate fires before/during mount)
  // from SPA navigation (where afterNavigate fires after the component is already mounted)
  let isInitialMount = $state(true);
  let hasInternalNavigation = $state(false);

  // Mark initial mount as complete after component mounts
  onMount(() => {
    // Use a microtask to ensure afterNavigate has already fired for initial load
    queueMicrotask(() => {
      isInitialMount = false;
    });
  });

  // AbortController for canceling pending requests
  let abortController: AbortController | null = null;

  // Use getDisplayTitle to handle numeric-only titles intelligently
  let displayTitle = $derived(
    resource ? getDisplayTitle(resource.title, resource.metadata) : ""
  );
  let pageTitle = $derived(
    displayTitle && displayTitle.trim().length > 0
      ? displayTitle
      : SITE_METADATA.title
  );

  // Use afterNavigate to detect if user came from within the app
  // Only set hasInternalNavigation=true if:
  // 1. This is NOT the initial page load (isInitialMount is false)
  // 2. AND navigation.from is not null (meaning we came from within the app)
  afterNavigate((navigation) => {
    // On initial page load, afterNavigate fires but we ignore it
    // On subsequent SPA navigations, we check if user came from within the app
    if (!isInitialMount && navigation.from !== null) {
      hasInternalNavigation = true;
    }
    // If it's a direct page load (isInitialMount=true), hasInternalNavigation stays false
  });

  // Load resource data whenever ID changes
  $effect(() => {
    // Cancel any pending requests from previous navigation
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    // Reset state when navigating to a new resource
    loading = true;
    error = null;
    resource = null;
    similarResources = [];
    similarError = null;

    // Load the resource with the current abort signal
    loadResource(id, abortController.signal);

    // Cleanup function to abort on unmount or re-run
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  });

  async function loadResource(resourceId: string, signal: AbortSignal) {
    try {
      const result = await getResourceById(resourceId);

      // Check if request was aborted before updating state
      if (signal.aborted) return;

      resource = result;

      // Load similar resources after main resource loads
      loadSimilarResources(resourceId, signal);
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") return;
      if (signal.aborted) return;

      if (err instanceof ApiError) {
        error = err.message;
      } else {
        error = "Failed to load resource";
      }
      console.error("Error loading resource:", err);
    } finally {
      if (!signal.aborted) {
        loading = false;
      }
    }
  }

  async function loadSimilarResources(resourceId: string, signal: AbortSignal) {
    similarLoading = true;
    similarError = null;

    try {
      const response = await getSimilarResources(resourceId);

      // Check if request was aborted before updating state
      if (signal.aborted) return;

      similarResources = response.similar_resources;
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") return;
      if (signal.aborted) return;

      if (err instanceof ApiError) {
        similarError = err.message;
      } else {
        similarError = "Failed to load similar resources";
      }
      console.error("Error loading similar resources:", err);
    } finally {
      if (!signal.aborted) {
        similarLoading = false;
      }
    }
  }

  function goBack() {
    // Using native history.back() - SvelteKit doesn't provide a "go back" alternative
    // This preserves the previous page's state (including URL params) naturally
    window.history.back();
  }
</script>

<svelte:head>
  <!-- Mirror the visible heading so browser history reflects resource titles -->
  <title>{pageTitle}</title>
</svelte:head>

<div class="resource-detail">
  <BackButton visible={hasInternalNavigation} onClick={goBack} label="← Back" />
  {#if loading}
    <SkeletonResourceDetail />
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
    </div>
  {:else if resource}
    <article>
      <h1>{displayTitle}</h1>
      <MetadataSection metadata={resource.metadata} />
      <DescriptionSection description={resource.metadata.description} />
      <DownloadsSection downloads={resource.metadata.downloads || []} />
    </article>
    <SimilarResources
      resources={similarResources}
      loading={similarLoading}
      error={similarError}
    />
    <ContactCallout />
  {/if}
</div>

<style lang="scss">
  @use "../../../lib/styles/variables" as *;

  .resource-detail {
    padding: 0;
  }

  article {
    padding: 0;
  }

  h1 {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--color-headline);
    line-height: 1.3;
    @include tablet-down {
      font-size: var(--font-size-2xl);
    }
  }

  .error-state {
    padding: var(--spacing-3xl) 0;
    text-align: center;

    p {
      color: var(--color-error);
      font-size: var(--font-size-base);
    }
  }
</style>
