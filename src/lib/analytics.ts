export interface ResourceDownloadDetails {
  downloadId: string;
  fileName: string;
  resourceId: string;
  resourceTitle: string;
}

export interface PageViewDetails {
  pageLocation: string;
  pagePath: string;
  pageTitle: string;
}

type GtagArguments =
  | ["js", Date]
  | ["config", string, { send_page_view: boolean }]
  | ["event", string, Record<string, string>];

type Gtag = (...arguments_: GtagArguments) => void;

declare global {
  interface Window {
    dataLayer?: GtagArguments[];
    gtag?: Gtag;
  }
}

export function initializeGoogleAnalytics(measurementId?: string): void {
  if (typeof window === "undefined" || !measurementId || window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...arguments_) => {
    window.dataLayer?.push(arguments_);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });
}

export function trackPageView(details: PageViewDetails): void {
  window.gtag?.("event", "page_view", {
    page_location: details.pageLocation,
    page_path: details.pagePath,
    page_title: details.pageTitle,
  });
}

export function trackResourceDownload(details: ResourceDownloadDetails): void {
  window.gtag?.("event", "resource_download", {
    download_id: details.downloadId,
    file_name: details.fileName,
    resource_id: details.resourceId,
    resource_title: details.resourceTitle,
  });
}
