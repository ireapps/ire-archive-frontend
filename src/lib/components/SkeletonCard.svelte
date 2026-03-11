<script lang="ts">
  let { size = 'normal' }: { size?: 'normal' | 'compact' } = $props();
</script>

<div class="skeleton-card" class:compact={size === 'compact'}>
  <div class="skeleton-title"></div>
  <div class="skeleton-byline"></div>
  <div class="skeleton-description">
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  </div>
  <div class="skeleton-badge"></div>
</div>

<style lang="scss">
  @use '../styles/mixins' as *;

  .skeleton-card {
    @include card-item(var(--spacing-lg));
  }

  /* Base skeleton element styles */
  .skeleton-title,
  .skeleton-byline,
  .skeleton-line,
  .skeleton-badge {
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

  .skeleton-title {
    height: 1.5rem;
    width: 65%;
    margin-bottom: var(--spacing-md);

    .compact & {
      height: 1.125rem;
      width: 75%;
      margin-bottom: var(--spacing-sm);
    }
  }

  .skeleton-byline {
    height: 0.875rem;
    width: 35%;
    margin-bottom: var(--spacing-md);
    opacity: 0.7;

    .compact & {
      height: 0.75rem;
      width: 30%;
      margin-bottom: var(--spacing-sm);
    }
  }

  .skeleton-description {
    margin-bottom: var(--spacing-md);

    .compact & {
      margin-bottom: var(--spacing-sm);
    }
  }

  .skeleton-line {
    height: 0.875rem;
    width: 100%;
    margin-bottom: var(--spacing-xs);

    &:last-child {
      margin-bottom: 0;
    }

    &.short {
      width: 80%;
    }
  }

  .skeleton-badge {
    height: 1.375rem;
    width: 5rem;
    border-radius: 3px;
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
