/**
 * Client-side returnTo validation (defense-in-depth only).
 * Backend validation is the real security boundary.
 */

export function isValidReturnTo(url: string | null): boolean {
  if (!url) return false;
  if (!url.startsWith("/")) return false;
  if (url.startsWith("//")) return false;
  if (url.includes("\\")) return false;
  if (url.includes("..")) return false;
  if (url.includes("@")) return false;

  const lower = url.toLowerCase();
  if (lower.includes("%2f%2f") || lower.includes("%5c")) return false;

  return true;
}

export function sanitizeReturnTo(url: string | null, defaultUrl = "/"): string {
  return isValidReturnTo(url) ? url! : defaultUrl;
}
