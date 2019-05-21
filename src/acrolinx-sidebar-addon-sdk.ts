export interface ExtractedTextEvent {
  text: string;
}

export interface AcrolinxSidebarAddon {
  onTextExtracted(event: ExtractedTextEvent): void;
}

export function initAcrolinxSidebarAddon(addon: AcrolinxSidebarAddon) {
  window.addEventListener('message', event => {
    console.log('Got message', event);
    if (event.data && event.data.command === 'updateData') {
      if (addon.onTextExtracted) {
        fetch(event.data.data.links.extractedContent).then(r => r.text()).then(text => {
          // Remove tibetan special characters introduced by acrolinx.
          const cleanedText = text.replace(/[༒༎༖༗]/, '');
          addon.onTextExtracted({text: cleanedText})
        })
      }
    }
  }, false);
}
