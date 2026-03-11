<script lang="ts">
  /**
   * PdfViewer Component
   *
   * A standalone component for displaying PDF files in an iframe.
   * Optimized for 8.5x11 inch documents with responsive behavior.
   *
   * Props:
   * - url: The URL of the PDF file to display
   * - title: Accessible title for the iframe
   * - downloadName: Name of the file for display in error messages
   */

  interface Props {
    url: string;
    title: string;
    downloadName: string;
  }

  let { url, title, downloadName }: Props = $props();

  let hasError = $state(false);
  let isLoading = $state(true);

  function handleLoad() {
    isLoading = false;
  }

  function handleError() {
    isLoading = false;
    hasError = true;
  }
</script>

<div class="pdf-viewer">
  {#if hasError}
    <div class="pdf-error">
      <p>Unable to display PDF. The file may be unavailable or your browser may not support embedded PDFs.</p>
      <p class="pdf-error-hint">
        Try <a href={url} target="_blank" rel="noopener noreferrer">downloading {downloadName}</a> instead.
      </p>
    </div>
  {:else}
    {#if isLoading}
      <div class="pdf-loading">
        <p>Loading PDF...</p>
      </div>
    {/if}
    <iframe
      src={url}
      {title}
      onload={handleLoad}
      onerror={handleError}
      class:loading={isLoading}
    ></iframe>
  {/if}
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .pdf-viewer {
    border: 1px solid var(--color-border-dark);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--color-bg);
    position: relative;

    @include tablet {
      display: none;
    }
  }

  iframe {
    width: 100%;
    height: 1100px; /* Optimized for 8.5x11 documents at ~850px width */
    border: none;
    display: block;
    background: var(--color-bg-white);

    &.loading {
      opacity: 0;
    }

    @include tablet-down {
      height: 800px;
    }
  }

  .pdf-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    color: var(--color-text-light);

    p {
      margin: 0;
      font-size: var(--font-size-md);
    }
  }

  .pdf-error {
    padding: var(--spacing-2xl);
    text-align: center;
    color: var(--color-text-light);

    p {
      margin: var(--spacing-sm) 0;
      font-size: var(--font-size-md);
    }

    a {
      color: var(--color-link);
      text-decoration: underline;
    }
  }

  .pdf-error-hint {
    font-size: var(--font-size-md);
    margin-top: var(--spacing-lg);
  }
</style>
