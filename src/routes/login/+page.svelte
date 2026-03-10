<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/auth.svelte";
  import { SITE_METADATA } from "$lib/config";
  import logoHeader from "../../assets/ire-square-logo.svg";

  // Use $derived for immediate reactivity (not onMount)
  let returnTo = $derived($page.url.searchParams.get("returnTo") || "/");

  // Layout will redirect authenticated users, but show message just in case
  let showAlreadyLoggedIn = $derived(auth.isAuthenticated);

  async function handleLogin() {
    await auth.login(returnTo);
  }
</script>

<svelte:head>
  <title>Log In | IRE Resource Center</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <img src={logoHeader} alt="IRE Logo" class="site-logo" width="60" height="60" />
      <h1>Resource Center</h1>
    </div>

    {#if showAlreadyLoggedIn}
      <div class="notice info">
        You're already logged in. <a href="/search">Go to search</a>
      </div>
    {:else}
      {#if auth.error}
        <div class="notice error">
          {#if auth.errorType === "logout_failed"}
            <strong>Logout incomplete:</strong>
            {auth.error}
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">
              If on a shared computer, clear your browser cookies or close all
              browser windows.
            </p>
          {:else if auth.errorType === "network"}
            <strong>Connection error:</strong> {auth.error}
          {:else}
            {auth.error}
          {/if}
        </div>
      {/if}

      <p class="description">
        {SITE_METADATA.description}
      </p>

      <button
        class="login-button"
        onclick={handleLogin}
        disabled={auth.isLoading}
      >
        {#if auth.isLoading}
          <span class="button-content">
            <span class="button-spinner"></span>
            Connecting...
          </span>
        {:else}
          Log in with IRE membership
        {/if}
      </button>

      <p class="membership-note">
        Not a member?
        <a href="https://www.ire.org/join-ire/" target="_blank" rel="noopener">
          Join now.
        </a>
      </p>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../../lib/styles/variables" as *;
  @use "sass:color";

  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;

    @include tablet-down {
      align-items: flex-start;
      margin-top: $spacing-xl;
    }
  }

  .login-card {
    background: white;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    padding: $spacing-2xl;
    max-width: 600px;
    width: 100%;

    @include mobile {
      padding: $spacing-xl $spacing-lg * 1.2;
    }
  }

  .login-header {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    border-bottom: 2px solid $color-headline;
    padding-bottom: $spacing-sm;
    margin-bottom: $spacing-lg;

    @include mobile {
      margin-bottom: $spacing-md;
    }
  }

  .site-logo {
    height: 60px;
    width: auto;

    @include tablet {
      height: 38px;
    }
    @include mobile {
      height: 30px;
      gap: $spacing-sm;
    }
  }

  h1 {
    font-family: "Mogan", serif;
    font-weight: 700;
    margin: 0;
    color: $color-headline;
    line-height: 1.1;
    text-align: left;

    // Mobile-first: base size for smallest screens (0-400px)
    font-size: $font-size-3xl * 0.85;

    // Small screens (401px-500px)
    @media (min-width: 401px) and (max-width: 500px) {
      font-size: $font-size-4xl * 0.75;
    }

    // Tablet range (501px-767px)
    @media (min-width: 501px) and (max-width: 767px) {
      font-size: $font-size-4xl * 0.9;
    }

    // Desktop (768px-959px)
    @include desktop {
      font-size: $font-size-4xl * 1.1;
    }
  }

  .description {
    color: $color-text-light;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
    line-height: 1.45;
    text-align: left;

    @include tablet {
      font-size: $font-size-md;
    }
    @include mobile {
      font-size: $font-size-sm;
      margin-bottom: $spacing-md;
    }
  }

  .notice {
    padding: $spacing-lg;
    border-radius: $radius-md;
    margin-bottom: $spacing-xl;
    font-size: $font-size-md;
    text-align: left;
  }

  .notice.info {
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }

  .notice.error {
    background: $color-error;
    color: white;
    border: 1px solid color.adjust($color-error, $lightness: -10%);
  }

  .notice a {
    color: $color-link;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .login-button {
    width: 100%;
    padding: $spacing-lg $spacing-2xl;
    font-size: $font-size-lg;
    font-weight: 600;
    color: white;
    background: $color-headline;
    border: none;
    border-radius: $radius-md;
    cursor: pointer;
    transition: background $transition-fast;

    @include tablet {
      padding: $spacing-md $spacing-xl;
      font-size: $font-size-md;
    }
    @include mobile {
      padding: $spacing-lg $spacing-lg;
      font-size: $font-size-sm;
    }

    &:hover:not(:disabled) {
      background: color.adjust($color-headline, $lightness: 20%);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .membership-note {
    margin-top: $spacing-lg;
    font-size: $font-size-base;
    color: $color-text-light;
    line-height: 1.5;
    text-align: center;

    @include mobile {
      font-size: $font-size-sm;
    }

    a {
      color: $color-link;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
