import { describe, it, expect } from "vitest";
import { getAuthors, getAffiliations, getYear } from "./byline";

describe("getAuthors", () => {
  it("should extract and clean authors", () => {
    const result = getAuthors({
      metadata: {
        authors: "<p>John <strong>Doe</strong></p>",
      },
    });
    expect(result).toBe("John Doe");
  });

  it("should return null when no authors", () => {
    const result = getAuthors({ metadata: {} });
    expect(result).toBeNull();
  });
});

describe("getAffiliations", () => {
  it("should extract and clean affiliations", () => {
    const result = getAffiliations({
      metadata: {
        affiliations: "<div>The <em>Journal</em></div>",
      },
    });
    expect(result).toBe("The Journal");
  });

  it("should return null when no affiliations", () => {
    const result = getAffiliations({ metadata: {} });
    expect(result).toBeNull();
  });
});

describe("getYear", () => {
  it("should return year when available", () => {
    const result = getYear({
      metadata: {
        resource_year: 2023,
      },
    });
    expect(result).toBe(2023);
  });

  it("should return null when no year", () => {
    const result = getYear({ metadata: {} });
    expect(result).toBeNull();
  });
});
