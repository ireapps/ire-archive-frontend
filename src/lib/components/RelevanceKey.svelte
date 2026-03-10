<script lang="ts">
  // No props needed - this is a static display component
</script>

<div class="relevance-legend">
  <span class="legend-label">Relevance</span>
  <span class="legend-item-animated" title="Relevance indicator (high to low)">
    <span class="dot-level" data-level="5">●●●●●</span>
    <span class="dot-level" data-level="4">●●●●○</span>
    <span class="dot-level" data-level="3">●●●○○</span>
    <span class="dot-level" data-level="1">●○○○○</span>
  </span>
</div>

<style lang="scss">
  @use "../styles/variables" as *;

  .relevance-legend {
    display: flex;
    align-items: center;
    font-size: $font-size-sm;
    color: $color-text-light;
    flex-shrink: 0;
    margin-left: auto;

    @include mobile {
      font-size: $font-size-xs;
    }

    .legend-label {
      margin-right: $spacing-xs;

      @include mobile {
        margin-right: 2px;
      }
    }

    .legend-item-animated {
      cursor: help;
      display: grid;
      place-items: center;

      .dot-level {
        grid-area: 1 / 1;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;

        &[data-level="5"] {
          animation: show-level-5 6s ease-in-out infinite;
        }
        &[data-level="4"] {
          animation: show-level-4 6s ease-in-out infinite;
        }
        &[data-level="3"] {
          animation: show-level-3 6s ease-in-out infinite;
        }
        &[data-level="1"] {
          animation: show-level-1 6s ease-in-out infinite;
        }
      }
    }
  }

  @keyframes show-level-5 {
    0%,
    20% {
      opacity: 1;
    }
    25%,
    100% {
      opacity: 0;
    }
  }

  @keyframes show-level-4 {
    0%,
    20% {
      opacity: 0;
    }
    25%,
    45% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  @keyframes show-level-3 {
    0%,
    45% {
      opacity: 0;
    }
    50%,
    70% {
      opacity: 1;
    }
    75%,
    100% {
      opacity: 0;
    }
  }

  @keyframes show-level-1 {
    0%,
    70% {
      opacity: 0;
    }
    75%,
    95% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>
