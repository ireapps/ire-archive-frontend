<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { auth } from "$lib/auth.svelte";
  import { sanitizeReturnTo } from "$lib/utils/returnTo";
  import { SITE_METADATA } from "$lib/config";
  import { inject } from "@vercel/analytics";
  import "../app.scss";

  import logoHeader from "../assets/ire-square-logo.svg";
  import BetaBanner from "$lib/components/BetaBanner.svelte";

  let { children } = $props();

  const authBypassEnabled = import.meta.env.VITE_AUTH_BYPASS === "true";

  // Check if we're on the homepage (show centered layout)
  let isHomepage = $derived($page.url.pathname === "/");

  // Routes that require authentication
  const protectedRoutes = authBypassEnabled
    ? []
    : ["/", "/search", "/resource"];

  // Check if current route needs auth
  // Special handling: '/' should match exactly, others use startsWith
  let isProtectedRoute = $derived(
    !authBypassEnabled &&
      ($page.url.pathname === "/" ||
        protectedRoutes
          .slice(1)
          .some((route) => $page.url.pathname.startsWith(route)))
  );

  // Determine if we should show content (prevents flash on auth failure)
  // Show content if: (1) public route, OR (2) protected route + authenticated
  // Don't show content if: protected route + not authenticated (show spinner instead)
  let showContent = $derived(
    authBypassEnabled || !isProtectedRoute || auth.isAuthenticated
  );

  // EFFECT 1: Initial auth check on mount
  // Runs once when app loads to verify/restore session
  $effect(() => {
    if (authBypassEnabled) return;
    if (auth.isLoading && auth.lastCheckTime === 0) {
      auth.checkSession();
    }
  });

  // EFFECT 2: Route guarding after auth state is known
  $effect(() => {
    if (authBypassEnabled) return;
    // Prevent any redirects while auth check is in progress
    if (auth.isLoading) return;

    const currentPath = $page.url.pathname;

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !auth.isAuthenticated) {
      const currentUrl = $page.url.pathname + $page.url.search;
      const returnTo = encodeURIComponent(currentUrl);
      goto(`/login?returnTo=${returnTo}`);
    }

    // Redirect authenticated users away from login page
    if (currentPath === "/login" && auth.isAuthenticated) {
      const returnToParam = $page.url.searchParams.get("returnTo");
      const destination = sanitizeReturnTo(returnToParam, "/");
      goto(destination);
    }
  });

  // Debounced re-check on tab visibility (only if 5+ min since last check)
  function handleVisibilityChange() {
    if (authBypassEnabled) return;
    if (document.visibilityState === "visible" && auth.shouldRecheck) {
      auth.checkSession();
    }
  }

  async function handleLogout() {
    await auth.logout();

    // Show error if logout failed (but user still redirected to /login)
    if (auth.errorType === "logout_failed") {
      // Error message will be shown on login page
    }
  }

  // Global keyboard shortcuts
  onMount(() => {
    inject();

    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";

      // "/" key - Focus search input (when not already in an input)
      if (event.key === "/" && !isInputFocused) {
        event.preventDefault();
        const input = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }

      // "Ctrl/Cmd + K" - Alternative search focus shortcut
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "k" &&
        !isInputFocused
      ) {
        event.preventDefault();
        const input = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  });
</script>

<svelte:window onvisibilitychange={handleVisibilityChange} />

<svelte:head>
  <title>{SITE_METADATA.title}</title>
  <meta name="description" content={SITE_METADATA.description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={SITE_METADATA.title} />
  <meta property="og:description" content={SITE_METADATA.description} />
  <meta property="og:image" content={SITE_METADATA.image} />
  <meta property="og:image:alt" content="IRE Logo" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={SITE_METADATA.title} />
  <meta name="twitter:description" content={SITE_METADATA.description} />
  <meta name="twitter:image" content={SITE_METADATA.image} />
  <meta name="twitter:image:alt" content="IRE Logo" />

  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<BetaBanner />

{#if isHomepage}
  <main class="container homepage-container">
    {#if !showContent}
      <!-- Show nothing while auth is being verified or user is not authenticated -->
      <div class="homepage-loading"></div>
    {:else}
      {@render children()}
    {/if}
  </main>
{:else}
  <main class="container">
    {#if !showContent}
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Verifying membership...</p>
      </div>
    {:else}
      {#if $page.url.pathname !== "/login"}
        {#if auth.isAuthenticated}
          <div class="logout-header">
            <button class="logout-link" onclick={handleLogout}>Log out</button>
          </div>
        {/if}
        <header class="site-header">
          <div class="site-title">
            <a
              href="https://ire.org/"
              class="logo-link"
              aria-label="IRE Resource Center home (opens in new tab)"
            >
              <img src={logoHeader} alt="IRE Logo" class="site-logo" />
            </a>
            <a href="/"> Resource Center </a>
          </div>
        </header>
        <p class="subtitle">
          {SITE_METADATA.description}
        </p>
      {/if}
      {@render children()}
    {/if}
  </main>
{/if}

<style lang="scss">
  @use "../lib/styles/variables" as *;

  :global(body) {
    font-family: "Roboto", sans-serif;
    max-width: 70ch;
    margin: 0 auto;
    padding: 0 var(--spacing-lg) var(--spacing-md) var(--spacing-lg);
    background: var(--color-bg-light);
    color: var(--color-text);
    line-height: 1.6;
    font-size: 20px;
  }

  :global(a) {
    color: var(--color-link);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .container {
    padding: 0;

    &.homepage-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 50vh;

      @include tablet-down {
        align-items: flex-start;
        padding-top: var(--spacing-3xl);
      }
    }
  }

  .site-title {
    font-family: "Mogan", serif;
    color: var(--color-headline);
    font-size: var(--font-size-4xl);
    font-weight: 700;
    margin: 0;
    padding: var(--spacing-sm) 0 var(--spacing-sm) 0;
    border-bottom: 2px solid var(--color-headline);
    line-height: 1.1;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);

    a {
      color: inherit;
      text-decoration: none;

      &:not(.logo-link):hover {
        color: var(--color-link);
      }

      &:not(.logo-link):focus {
        color: var(--color-link-hover);
      }
    }

    @include tablet-down {
      font-size: var(--font-size-3xl);
    }
  }

  .logo-link {
    display: flex;
    align-items: center;
    transition: opacity var(--transition-fast);

    &:hover {
      opacity: 0.7;
    }
  }

  .site-logo {
    height: 60px;
    width: auto;

    @include tablet-down {
      height: 42px;
    }
  }

  .subtitle {
    color: var(--color-text-light);
    font-size: var(--font-size-xl);
    margin: var(--spacing-md) 0 var(--spacing-xl) 0;
    line-height: 1.45;

    @include tablet-down {
      font-size: var(--font-size-lg);
    }
  }

  .logout-header {
    display: flex;
    justify-content: flex-end;
    line-height: 1;
    margin-bottom: var(--spacing-xs);
    padding: var(--spacing-sm) 0;
  }

  .logout-link {
    @include button-reset;
    font-size: var(--font-size-xs);
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--color-text);
      text-decoration: underline;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    color: var(--color-text-light);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-border-light);
    border-top-color: var(--color-text);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
