import { afterEach, describe, expect, it, vi } from "vitest";
import {
  initializeGoogleAnalytics,
  trackPageView,
  trackResourceDownload,
} from "./analytics";

describe("initializeGoogleAnalytics", () => {
  afterEach(() => {
    document.head.querySelector('script[src*="googletagmanager.com"]')?.remove();
    delete window.dataLayer;
    delete window.gtag;
  });

  it("loads and configures Google Analytics when an ID is provided", () => {
    initializeGoogleAnalytics("G-5SZLKG0S6S");

    const script = document.head.querySelector<HTMLScriptElement>(
      'script[src*="googletagmanager.com"]'
    );
    expect(script?.src).toBe(
      "https://www.googletagmanager.com/gtag/js?id=G-5SZLKG0S6S"
    );
    expect(window.dataLayer?.[0]?.[0]).toBe("js");
    expect(window.dataLayer?.[1]).toEqual([
      "config",
      "G-5SZLKG0S6S",
      { send_page_view: false },
    ]);
  });

  it("does not load Google Analytics without an ID", () => {
    initializeGoogleAnalytics();

    expect(
      document.head.querySelector('script[src*="googletagmanager.com"]')
    ).toBeNull();
    expect(window.gtag).toBeUndefined();
  });
});

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
