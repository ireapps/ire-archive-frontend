import { afterEach, describe, expect, it, vi } from "vitest";
import { trackPageView, trackResourceDownload } from "./analytics";

describe("trackPageView", () => {
  afterEach(() => {
    delete window.gtag;
  });

  it("sends the current page details to Google Analytics", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackPageView({
      pageLocation: "https://archive.ire.org/search?q=data",
      pagePath: "/search?q=data",
      pageTitle: "Search results",
    });

    expect(gtag).toHaveBeenCalledWith("event", "page_view", {
      page_location: "https://archive.ire.org/search?q=data",
      page_path: "/search?q=data",
      page_title: "Search results",
    });
  });
});

describe("trackResourceDownload", () => {
  afterEach(() => {
    delete window.gtag;
  });

  it("sends a resource download event to Google Analytics", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackResourceDownload({
      downloadId: "download-123",
      fileName: "report.pdf",
      resourceId: "resource-456",
      resourceTitle: "Investigative reporting guide",
    });

    expect(gtag).toHaveBeenCalledWith("event", "resource_download", {
      download_id: "download-123",
      file_name: "report.pdf",
      resource_id: "resource-456",
      resource_title: "Investigative reporting guide",
    });
  });

  it("does not interrupt downloads when analytics is unavailable", () => {
    expect(() =>
      trackResourceDownload({
        downloadId: "download-123",
        fileName: "report.pdf",
        resourceId: "resource-456",
        resourceTitle: "Investigative reporting guide",
      })
    ).not.toThrow();
  });
});
