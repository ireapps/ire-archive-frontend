/**
 * Utility functions for the application
 */

/**
 * Strip HTML tags and decode HTML entities from a string
 * This is a browser-safe implementation that uses the DOM to parse and clean HTML
 *
 * @param html - String that may contain HTML tags and entities
 * @returns Plain text with tags removed and entities decoded
 */
export function stripHtml(html: string): string {
  if (!html) return "";

  // Create a temporary div element
  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  // Get the text content, which automatically strips tags and decodes entities
  return tmp.textContent || tmp.innerText || "";
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Capitalize the first letter of a string
 *
 * @param str - String to capitalize
 * @returns String with first letter capitalized
 */
export function capFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format description text by stripping HTML and converting newlines to <br> tags
 * This handles literal \n characters in text and converts them to HTML line breaks
 *
 * @param text - Text that may contain HTML and literal \n characters
 * @returns HTML string with newlines converted to <br> tags
 */
export function formatDescription(text: string): string {
  if (!text) return "";

  // First strip any HTML tags
  let cleanText = stripHtml(text);

  // Convert literal \n characters (the two-character sequence) to <br> tags
  // Handle double newlines (paragraph breaks) and single newlines (line breaks)
  // Also handle actual newline characters in case they exist
  cleanText = cleanText
    .replace(/\\n\\n+/g, "<br><br>") // Multiple literal \n become paragraph breaks
    .replace(/\\n/g, "<br>") // Single literal \n becomes line break
    .replace(/\n\n+/g, "<br><br>") // Multiple actual newlines become paragraph breaks
    .replace(/\n/g, "<br>"); // Single actual newlines become line breaks

  // Strip any leading or trailing whitespace, newlines or <br> tags
  cleanText = cleanText.replace(/^(<br>\s*)+|(\s*<br>)+$/g, "").trim();

  // If we have any cases of more than two <br> in a row, reduce to just two
  cleanText = cleanText.replace(/(<br>\s*){3,}/g, "<br><br>");

  // Return what's left
  return cleanText;
}

/**
 * Check if a download URL or filename is a PDF
 *
 * @param urlOrName - URL or filename to check
 * @returns True if the file is a PDF
 */
export function isPdf(urlOrName: string): boolean {
  if (!urlOrName) return false;
  return urlOrName.toLowerCase().endsWith(".pdf");
}

/**
 * Check if a download URL or filename is an audio file
 *
 * @param urlOrName - URL or filename to check
 * @returns True if the file is an audio file (MP3)
 */
export function isAudio(urlOrName: string): boolean {
  if (!urlOrName) return false;
  const lower = urlOrName.toLowerCase();
  return (
    lower.endsWith(".mp3") ||
    lower.endsWith(".wav") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".mp2")
  );
}

/**
 * Check if a download URL or filename is an image file
 *
 * @param urlOrName - URL or filename to check
 * @returns True if the file is an image file
 */
export function isImage(urlOrName: string): boolean {
  if (!urlOrName) return false;
  const lower = urlOrName.toLowerCase();
  return (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp")
  );
}

/**
 * Check if a download URL or filename is a video file
 *
 * @param urlOrName - URL or filename to check
 * @returns True if the file is a video file
 */
export function isVideo(urlOrName: string): boolean {
  if (!urlOrName) return false;
  const lower = urlOrName.toLowerCase();
  return (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".avi")
  );
}

/**
 * Check if a download URL or filename is a Microsoft Office document
 *
 * @param urlOrName - URL or filename to check
 * @returns True if the file is an Office document
 */
export function isOfficeDoc(urlOrName: string): boolean {
  if (!urlOrName) return false;
  const lower = urlOrName.toLowerCase();
  return (
    lower.endsWith(".docx") ||
    lower.endsWith(".pptx") ||
    lower.endsWith(".xlsx") ||
    lower.endsWith(".doc") ||
    lower.endsWith(".ppt") ||
    lower.endsWith(".xls")
  );
}

/**
 * Format number with locale-aware comma separators
 *
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format number with locale-aware comma separators (alias for formatNumber)
 *
 * @param num - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatCount(num: number): string {
  return formatNumber(num);
}

/**
 * Extract year from a date string
 * Handles various date formats: YYYY-MM-DD, YYYY, timestamps, etc.
 *
 * @param dateString - Date string to extract year from
 * @returns Year as string (YYYY) or null if not found
 */
export function extractYear(dateString?: string): string | null {
  if (!dateString) return null;

  // Try to match a 4-digit year (YYYY)
  const yearMatch = dateString.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : null;
}

/**
 * Compose a contest title from available metadata
 * Format: {contestName} {year} - {subject}
 * Gracefully handles missing pieces
 *
 * @param contestName - Name of the contest
 * @param subject - Subject/topic of the entry
 * @param year - Year of the contest
 * @param numericId - Numeric ID to use as fallback
 * @returns Composed contest title
 */
export function composeContestTitle(
  contestName?: string,
  subject?: string,
  year?: string | null,
  numericId?: string
): string {
  const parts: string[] = [];

  // Start with contest name or default
  const baseName = contestName || "Contest Entry";
  parts.push(baseName);

  // Add year if available
  if (year) {
    parts.push(year);
  }

  // Build the title so far
  let title = parts.join(" ");

  // Add subject if available
  if (subject) {
    title += ` - ${subject}`;
  }

  // If we only have the default name and no other info, add the numeric ID
  if (!contestName && !year && !subject && numericId) {
    title = `Contest Entry #${numericId}`;
  }

  return title;
}

/**
 * Get a display-friendly title for a resource
 * Handles special case of numeric-only titles by composing better alternatives
 *
 * @param title - Original title
 * @param metadata - Resource metadata containing contest info, dates, etc.
 * @returns Display-friendly title
 */
/**
 * Extract filename from a URL
 *
 * @param url - URL to extract filename from
 * @param fallbackName - Optional fallback if extraction fails
 * @returns Filename (e.g., "tipsheet.pdf") or fallback
 */
export function getFilenameFromUrl(url: string, fallbackName?: string): string {
  if (!url) return fallbackName || "";
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() || fallbackName || "";
  } catch {
    return url.split("/").pop() || fallbackName || "";
  }
}

export function getDisplayTitle(
  title: string,
  metadata?: {
    contest_name?: string;
    subject?: string;
    description?: string;
    category?: string;
    published?: string;
    date_created?: string;
    date_updated?: string;
    [key: string]: any;
  }
): string {
  // If title is not numeric-only, return as-is
  if (!title || !/^\d+$/.test(title)) {
    return title || "Untitled";
  }

  // Title is numeric-only, need to compose a better one
  const numericId = title;

  // For contest entries, compose from contest_name, subject, and year
  if (metadata?.category === "contest") {
    // Try published field first, then fall back to date_created/date_updated
    const year = extractYear(
      metadata.published || metadata.date_created || metadata.date_updated
    );
    return composeContestTitle(
      metadata.contest_name,
      metadata.subject,
      year,
      numericId
    );
  }

  // For non-contest entries, try other fallbacks
  // 1. Try first sentence from description
  if (metadata?.description) {
    const cleanDesc = stripHtml(metadata.description);
    const firstSentence = cleanDesc.split(/[.!?]/)[0].trim();
    if (firstSentence && firstSentence.length > 10) {
      return truncateText(firstSentence, 100);
    }
  }

  // 2. Try subject
  if (metadata?.subject) {
    return metadata.subject;
  }

  // 3. Last resort: format the numeric ID
  return `Resource #${numericId}`;
}
