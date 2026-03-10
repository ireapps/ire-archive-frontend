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
    border: 1px solid $color-border;
    padding: $spacing-md;
    background: $color-bg-light;

    img {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
    }
  }
</style>
