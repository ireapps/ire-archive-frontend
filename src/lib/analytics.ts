export interface ResourceDownloadDetails {
  downloadId: string;
  fileName: string;
  resourceId: string;
  resourceTitle: string;
}

type Gtag = (
  command: "event",
  eventName: string,
  parameters: Record<string, string>
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackResourceDownload(details: ResourceDownloadDetails): void {
  window.gtag?.("event", "resource_download", {
    download_id: details.downloadId,
    file_name: details.fileName,
    resource_id: details.resourceId,
    resource_title: details.resourceTitle,
  });
}
