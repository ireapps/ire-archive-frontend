<script lang="ts">
  // Skeleton loader for resource detail page
</script>

<div class="skeleton-resource-detail">
  <!-- Title skeleton -->
  <div class="skeleton-title"></div>

  <!-- Metadata section skeleton -->
  <div class="skeleton-metadata">
    <div class="skeleton-meta-item"></div>
    <div class="skeleton-meta-item short"></div>
    <div class="skeleton-meta-item"></div>
  </div>

  <!-- Description section skeleton -->
  <div class="skeleton-section">
    <div class="skeleton-section-title"></div>
    <div class="skeleton-content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  </div>

  <!-- Downloads section skeleton -->
  <div class="skeleton-section">
    <div class="skeleton-section-title"></div>
    <div class="skeleton-download"></div>
    <div class="skeleton-download"></div>
  </div>
</div>

<style lang="scss">
  @use '../styles/variables' as *;

  .skeleton-resource-detail {
    padding: 0;
  }

  /* Base skeleton element styles */
  .skeleton-title,
  .skeleton-meta-item,
  .skeleton-section-title,
  .skeleton-line,
  .skeleton-download {
    background: linear-gradient(
      90deg,
      var(--color-skeleton-base) 0%,
      var(--color-skeleton-shine) 20%,
      var(--color-skeleton-shine) 40%,
      var(--color-skeleton-base) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
    border-radius: 4px;
  }

  /* Title skeleton - large and prominent */
  .skeleton-title {
    height: 2.5rem;
    width: 70%;
    margin: 0 0 var(--spacing-lg) 0;
  }

  /* Metadata section */
  .skeleton-metadata {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
  }

  .skeleton-meta-item {
    height: 0.875rem;
    width: 45%;

    &.short {
      width: 30%;
    }
  }

  /* Section containers */
  .skeleton-section {
    margin-bottom: var(--spacing-2xl);
  }

  .skeleton-section-title {
    height: 1.25rem;
    width: 25%;
    margin-bottom: var(--spacing-md);
  }

  .skeleton-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .skeleton-line {
    height: 1rem;
    width: 100%;

    &.short {
      width: 75%;
    }
  }

  .skeleton-download {
    height: 2.5rem;
    width: 100%;
    margin-bottom: var(--spacing-sm);
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
</style>
