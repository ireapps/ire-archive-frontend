/**
 * Focus and select the main search input
 */
export function focusSearchInput(): void {
  const input = document.querySelector(
    'input[type="text"]'
  ) as HTMLInputElement;
  if (input) {
    input.focus();
    input.select?.();
  }
}
