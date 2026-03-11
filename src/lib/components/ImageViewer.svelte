<script lang="ts">
  interface Props {
    url: string;
    alt: string;
  }

  let { url, alt }: Props = $props();
</script>

<div class="image-viewer">
  <img src={url} {alt} />
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .image-viewer {
    border: 1px solid var(--color-border);
    padding: var(--spacing-md);
    background: var(--color-bg);

    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
  }
</style>
