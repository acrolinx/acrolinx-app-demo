export interface ExtractedTextEvent {
  languageId: string;
  text: string;
}

export interface ExtractedTextLinkEvent {
  languageId: string;
  url: string;
}

export interface AcrolinxSidebarApp {
  appSignature: string;
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
  extractedText = 'extractedText'
}

interface SidebarAddonConfig {
  title: string;
  button?: AddonButtonConfig;
  requiredReportLinks: readonly ReportType[];
  requiredReportContent: readonly ReportType[];
  appSignature: string;
}

export type ReportsForAddon = {
  [P in ReportType]?: ReportForAddon;
};

interface ReportForAddon {
  url?: string;
  content?: string;
}

interface AnalysisResult {
  type: 'analysisResult';
  languageId: string;
  reports: ReportsForAddon;
}

export function createAcrolinxApp<T extends AcrolinxSidebarApp>(app: T): T {
  configureAddon({
    appSignature: app.appSignature,
    title: app.title,
    button: app.button,
    requiredReportLinks: (app.onTextExtractedLink) ? [ReportType.extractedText] : [],
    requiredReportContent: (app.onTextExtracted) ? [ReportType.extractedText] : []
  });

  window.addEventListener('message', event => {
    console.log('Got message from sidebar', event);
    if (event.data && event.data.type === 'analysisResult') {
      // TODO: Error handling if analysisResult is not like expected.

      const analysisResult: AnalysisResult = event.data;
      const reports = analysisResult.reports;
      const textExtractedReport = reports[ReportType.extractedText] || {};

      if (app.onTextExtractedLink && textExtractedReport.url) {
        app.onTextExtractedLink({url: textExtractedReport.url, languageId: analysisResult.languageId});
      }

      if (app.onTextExtracted && typeof textExtractedReport.content === 'string') {
        app.onTextExtracted({text: textExtractedReport.content, languageId: analysisResult.languageId});
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
