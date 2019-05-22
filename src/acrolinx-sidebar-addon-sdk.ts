export interface ExtractedTextEvent {
  text: string;
}

export interface ExtractedTextLinkEvent {
  url: string;
}

export interface AcrolinxSidebarApp {
  button?: AddonButtonConfig;
  onTextExtractedLink?(event: ExtractedTextLinkEvent): void;
  onTextExtracted?(event: ExtractedTextEvent): void;
}

export interface AddonButtonConfig {
  text: string;
  tooltip?: string;
}

export enum ReportType {
  extractedText4App = 'extractedText4App'
}

interface SidebarAddonConfig {
  button?: AddonButtonConfig;
  reportTypes: readonly ReportType[];
}


export function createAcrolinxApp<T extends AcrolinxSidebarApp>(app: T): T {
  configureAddon({
    button: app.button,
    reportTypes: (app.onTextExtracted || app.onTextExtractedLink) ? [ReportType.extractedText4App] : []
  });

  window.addEventListener('message', event => {
    console.log('Got message from sidebar', event);
    if (event.data && event.data.command === 'updateData') {
      if (app.onTextExtractedLink) {
        app.onTextExtractedLink({url: event.data.data.links.extractedContent});
      }

      if (app.onTextExtracted) {
        fetch(event.data.data.links.extractedContent)
          .then(r => r.text())
          .then(text => {
            app.onTextExtracted!({text: text})
          });
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
