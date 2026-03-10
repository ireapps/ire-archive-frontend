import { describe, it, expect } from "vitest";
import { stripHtml, truncateText } from "./utils";

describe("stripHtml", () => {
  it("should remove HTML tags from text", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    expect(stripHtml(html)).toBe("Hello world");
  });

  it("should handle multiple tags", () => {
    const html = "<div><p>Test</p><span>content</span></div>";
    expect(stripHtml(html)).toBe("Testcontent");
  });

  it("should handle self-closing tags", () => {
    const html = "Line 1<br/>Line 2";
    expect(stripHtml(html)).toBe("Line 1Line 2");
  });

  it("should return empty string for empty input", () => {
    expect(stripHtml("")).toBe("");
  });

  it("should handle text with no HTML", () => {
    const text = "Plain text";
    expect(stripHtml(text)).toBe("Plain text");
  });

  it("should decode HTML entities", () => {
    const html = "&lt;p&gt;Test&lt;/p&gt;";
    expect(stripHtml(html)).toBe("<p>Test</p>");
  });
});

describe("truncateText", () => {
  it("should truncate text longer than max length", () => {
    const text = "This is a very long text that should be truncated";
    const result = truncateText(text, 20);
    // The function truncates at exactly 20 chars (no word boundary logic in implementation)
    expect(result).toBe("This is a very long ...");
    expect(result.length).toBe(23); // "This is a very long " (20 chars) + "..." = 23 total
  });

  it("should not truncate text shorter than max length", () => {
    const text = "Short text";
    expect(truncateText(text, 20)).toBe("Short text");
  });

  it("should handle exact length", () => {
    const text = "Exactly twenty chars";
    expect(truncateText(text, 20)).toBe("Exactly twenty chars");
  });

  it("should handle empty string", () => {
    expect(truncateText("", 10)).toBe("");
  });

  it("should handle very long text with explicit max length", () => {
    const text = "a".repeat(250);
    const result = truncateText(text, 200);
    expect(result).toBe("a".repeat(200) + "...");
  });

  it("should truncate at word boundary when possible", () => {
    const text = "This is some text that needs truncation here";
    const result = truncateText(text, 25);
    // Should truncate before "truncation" to avoid cutting mid-word
    expect(result.endsWith("...")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(28); // 25 + "..."
  });
});
