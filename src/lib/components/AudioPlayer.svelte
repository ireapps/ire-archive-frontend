<script lang="ts">
  /**
   * AudioPlayer Component
   *
   * A standalone component for displaying audio files using HTML5 audio element.
   * Provides native browser controls with error handling.
   *
   * Props:
   * - url: The URL of the audio file to display
   * - title: Accessible title for the audio element
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

  function handleLoadedMetadata() {
    isLoading = false;
  }

  function handleError() {
    isLoading = false;
    hasError = true;
  }
</script>

<div class="audio-player">
  {#if hasError}
    <div class="audio-error">
      <p>Unable to load audio. The file may be unavailable or your browser may not support this audio format.</p>
      <p class="audio-error-hint">
        Try <a href={url} target="_blank" rel="noopener noreferrer">downloading {downloadName}</a> instead.
      </p>
    </div>
  {:else}
    {#if isLoading}
      <div class="audio-loading">
        <p>Loading audio...</p>
      </div>
    {/if}
    <audio
      controls
      preload="metadata"
      src={url}
      {title}
      onloadedmetadata={handleLoadedMetadata}
      onerror={handleError}
      class:loading={isLoading}
    >
      Your browser does not support the audio element.
    </audio>
  {/if}
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .audio-player {
    margin-top: var(--spacing-md);
    position: relative;
  }

  audio {
    width: 100%;
    display: block;

    &.loading {
      opacity: 0;
    }
  }

  .audio-loading {
    position: absolute;
    top: var(--spacing-md);
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: var(--color-text-light);

    p {
      margin: 0;
      font-size: var(--font-size-sm);
    }
  }

  .audio-error {
    padding: var(--spacing-sm) 0;
    color: var(--color-text-light);

    p {
      margin: var(--spacing-sm) 0;
      font-size: var(--font-size-base);
    }

    a {
      color: var(--color-link);
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  .audio-error-hint {
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-md);
  }
</style>
