<script lang="ts">
  // Beta announcement banner - displayed at the top of all pages
</script>

<div class="beta-banner">
  <span class="beta-text">
    This is an early release. Report problems to
    <a href="mailto:help@ire.org">help@ire.org</a>.
  </span>
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .beta-banner {
    background: $color-link;
    color: white;
    text-align: center;
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-sm;
    line-height: 1.4;
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    position: relative;
  }

  .beta-text {
    display: inline-block;

    a {
      color: white;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
