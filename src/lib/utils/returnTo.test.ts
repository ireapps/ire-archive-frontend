import { describe, it, expect } from "vitest";
import { isValidReturnTo, sanitizeReturnTo } from "./returnTo";

describe("isValidReturnTo", () => {
  it.each(["/", "/search", "/resource/abc", "/search?q=test"])(
    "accepts %s",
    (url) => {
      expect(isValidReturnTo(url)).toBe(true);
    }
  );

  it.each(["https://evil.com", "//evil.com", "/../etc", "", null])(
    "rejects %s",
    (url) => {
      expect(isValidReturnTo(url)).toBe(false);
    }
  );
});

describe("sanitizeReturnTo", () => {
  it("passes valid URLs through", () => {
    expect(sanitizeReturnTo("/search")).toBe("/search");
  });

  it("returns default for invalid", () => {
    expect(sanitizeReturnTo("https://evil.com")).toBe("/");
    expect(sanitizeReturnTo("https://evil.com", "/home")).toBe("/home");
  });
});
