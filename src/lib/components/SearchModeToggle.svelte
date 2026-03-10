<script lang="ts">
  import type { SearchMode } from "$lib/types";

  interface Props {
    searchMode: SearchMode;
    submitOnChange?: boolean;
  }

  let { searchMode, submitOnChange = false }: Props = $props();

  let isSemantic = $derived(searchMode === "hybrid");

  function handleToggle(event: Event) {
    const target = event.currentTarget as HTMLInputElement | null;
    const form = target?.form;
    if (!form) return;

    const newMode: SearchMode = target?.checked ? "hybrid" : "keyword";

    if (submitOnChange) {
      // Update the hidden input value before submitting
      const hiddenInput = form.querySelector(
        'input[name="mode"]'
      ) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = newMode;
      }
      form.requestSubmit();
    }
  }
</script>

<div class="search-mode-toggle" role="group" aria-label="Search mode selection">
  <!-- Hidden input that always submits the current mode -->
  <input type="hidden" name="mode" value={searchMode} />

  <label class="switch">
    <input
      type="checkbox"
      role="switch"
      checked={isSemantic}
      aria-checked={isSemantic}
      onchange={handleToggle}
      aria-label={isSemantic
        ? "Disable AI-powered semantic search"
        : "Enable AI-powered semantic search"}
    />
    <span class="switch-slider" aria-hidden="true"></span>
  </label>
  <span class="mode-status" aria-live="polite">{isSemantic ? "On" : "Off"}</span
  >
</div>

<style lang="scss">
  .search-mode-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  .switch-slider {
    position: relative;
    display: block;
    width: 2.5rem;
    height: 1.25rem;
    background: var(--color-border-light, #ddd);
    border-radius: 1rem;
    transition: background-color 0.2s ease;
  }

  .switch-slider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0.125rem;
    width: 1rem;
    height: 1rem;
    background: var(--color-bg-white, #fff);
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(16, 24, 40, 0.12);
    transform: translate(0, -50%);
    transition: transform 0.2s ease;
  }

  .switch input:checked + .switch-slider {
    background: var(--color-accent, #1b7ae0);
  }

  .switch input:checked + .switch-slider::before {
    transform: translate(1.2rem, -50%);
  }

  .switch input:focus-visible + .switch-slider {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }

  .mode-status {
    font-size: 0.875rem;
    color: var(--color-text-light, #666);
    min-width: 2rem;
  }

  @media (max-width: 767px) {
    .search-mode-toggle {
      gap: 0.5rem;
    }

    .mode-status {
      font-size: 1rem;
    }
  }
</style>
