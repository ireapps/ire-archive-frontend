<script lang="ts">
  import type { Download } from "$lib/types";
  import {
    isPdf,
    isAudio,
    isImage,
    isVideo,
    isOfficeDoc,
    getFilenameFromUrl,
  } from "$lib/utils";
  import PdfViewer from "./PdfViewer.svelte";
  import AudioPlayer from "./AudioPlayer.svelte";
  import ImageViewer from "./ImageViewer.svelte";
  import VideoViewer from "./VideoViewer.svelte";
  import OfficeViewer from "./OfficeViewer.svelte";

  interface Props {
    downloads: Download[];
  }

  let { downloads }: Props = $props();
</script>

{#if downloads && downloads.length > 0}
  <section class="downloads">
    <h3>Downloads</h3>
    <ul>
      {#each downloads as download (download.id)}
        <li>
          <a
            href={download.url}
            target="_blank"
            rel="noopener noreferrer"
            class="download-link"
          >
            {getFilenameFromUrl(download.url, download.name)}
          </a>

          {#if isPdf(download.url)}
            <PdfViewer
              url={download.url}
              title={`PDF viewer: ${download.name}`}
              downloadName={download.name}
            />
          {/if}

          {#if isAudio(download.url)}
            <AudioPlayer
              url={download.url}
              title={`Audio player: ${download.name}`}
              downloadName={download.name}
            />
          {/if}

          {#if isImage(download.url)}
            <ImageViewer url={download.url} alt={download.name} />
          {/if}

          {#if isVideo(download.url)}
            <VideoViewer
              url={download.url}
              title={`Video player: ${download.name}`}
            />
          {/if}

          {#if isOfficeDoc(download.url)}
            <OfficeViewer
              url={download.url}
              title={`Office document viewer: ${download.name}`}
            />
          {/if}
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style lang="scss">
  @use "../styles/variables" as *;

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
    color: var(--color-headline);
  }

  .downloads {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--color-bg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .download-link {
    display: inline-block;
    border: 1px solid var(--color-link);
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-base);
    color: var(--color-link);
    text-decoration: none;
    align-self: flex-start;
    @include hover-transition(background);

    &::before {
      content: "↓ ";
      margin-right: var(--spacing-xs);
    }

    &:hover {
      background: var(--color-bg);
      text-decoration: none;
    }
  }
</style>
