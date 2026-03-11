<script lang="ts">
  interface Props {
    url: string;
    title: string;
  }

  let { url, title }: Props = $props();

  // Encode the URL for use in the Office viewer
  let viewerUrl = $derived(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`);
</script>

<div class="office-viewer">
  <iframe
    src={viewerUrl}
    {title}
    width="100%"
    height="600"
    frameborder="0"
  >
    This browser does not support iframes. Please download the file to view it.
  </iframe>
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .office-viewer {
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    background: var(--color-bg);

    iframe {
      display: block;
      width: 100%;
      border: none;
    }
  }
</style>
