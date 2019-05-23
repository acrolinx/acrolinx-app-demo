export interface ExtractedTextEvent {
  text: string;
}

export interface ExtractedTextLinkEvent {
  url: string;
}

export interface AcrolinxSidebarApp {
  title: string;
  button?: AddonButtonConfig;
  onTextExtractedLink?(event: ExtractedTextLinkEvent): void;
  onTextExtracted?(event: ExtractedTextEvent): void;
}

export interface AddonButtonConfig {
  text: string;
  tooltip?: string;
}

enum ReportType {
  extractedText4App = 'extractedText4App'
}

interface SidebarAddonConfig {
  title: string;
  button?: AddonButtonConfig;
  requiredReportLinks: readonly ReportType[];
  requiredReportContent: readonly ReportType[];
}

export type ReportsForAddon = {
  [P in ReportType]?: ReportForAddon;
};

interface ReportForAddon {
  url?: string;
  content?: string;
}

export function createAcrolinxApp<T extends AcrolinxSidebarApp>(app: T): T {
  configureAddon({
    title: app.title,
    button: app.button,
    requiredReportLinks: (app.onTextExtractedLink) ? [ReportType.extractedText4App] : [],
    requiredReportContent: (app.onTextExtracted) ? [ReportType.extractedText4App] : []
  });

  window.addEventListener('message', event => {
    console.log('Got message from sidebar', event);
    if (event.data && event.data.type === 'analysisResult') {
      // TODO: Error handling if analysisResult is not like expected.

      const reports: ReportsForAddon = event.data.reports;
      const textExtractedReport = reports[ReportType.extractedText4App] || {};

      if (app.onTextExtractedLink && textExtractedReport.url) {
        app.onTextExtractedLink({url: textExtractedReport.url});
      }

      if (app.onTextExtracted && typeof textExtractedReport.content === 'string') {
        app.onTextExtracted({text: textExtractedReport.content});
      }
    }
  }, false);

  return app;
}

export function openWindow(url: string) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({command: 'acrolinx.sidebar.openWindow', url}, '*');
  } else {
    window.open(url);
  }
}

function configureAddon(config: SidebarAddonConfig) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({command: 'acrolinx.sidebar.configureAddon', config: config}, '*');
  } else {
    console.warn('configureAddon: Missing parent window with sidebar.')
  }
}
