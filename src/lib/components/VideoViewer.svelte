<script lang="ts">
  interface Props {
    url: string;
    title: string;
  }

  let { url, title }: Props = $props();

  // Determine video type based on file extension
  let videoType = $derived(() => {
    const lower = url.toLowerCase();
    if (lower.endsWith('.mov')) return 'video/quicktime';
    if (lower.endsWith('.webm')) return 'video/webm';
    if (lower.endsWith('.avi')) return 'video/x-msvideo';
    return 'video/mp4'; // default to mp4
  });
</script>

<div class="video-viewer">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video controls aria-label={title}>
    <source src={url} type={videoType()} />
    Your browser does not support the video tag.
  </video>
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .video-viewer {
    border: 1px solid $color-border;
    padding: $spacing-md;
    background: $color-bg-light;

    video {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
  }
</style>
