import { render, waitFor } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import SuggestedSearches from "./SuggestedSearches.svelte";

describe("SuggestedSearches", () => {
  it("separates suggested search links with natural spacing", async () => {
    const { container } = render(SuggestedSearches);

    await waitFor(() => {
      expect(container.querySelectorAll(".suggestion-link")).toHaveLength(3);
    });

    const suggestions = Array.from(
      container.querySelectorAll(".suggestion-link"),
      (link) => link.textContent
    );
    const text = container
      .querySelector(".suggestions-content")
      ?.textContent?.replace(/\s+/g, " ")
      .trim();

    expect(text).toContain(
      `Try ${suggestions[0]}, ${suggestions[1]} or ${suggestions[2]}.`
    );
  });
});
