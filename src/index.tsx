import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';
import * as _ from 'lodash';
import './index.css';
import {AcrolinxSidebarAddon, ExtractedTextEvent, initAcrolinxSidebarAddon} from './acrolinx-sidebar-addon-sdk';
import {DUMMY_TEXT} from './dummy-data';
import {STOP_WORDS_EN} from './stop-words';

interface AppComponentProps {
  text: string;
}

function AppComponent({text}: AppComponentProps) {
  const wordsWithFrequency = _.chain(text.toLowerCase().split(/\W+/))
    .filter(word => word.length > 1 && !STOP_WORDS_EN.has(word))
    .countBy()
    .map((freq, text) => ({text, value: freq}))
    .value();

  if (_.isEmpty(wordsWithFrequency)) {
    return <div className="message">{'Please check some text with non-stop-words to view it\'s word cloud.'}</div>
  }

  return <ReactWordcloud words={wordsWithFrequency}/>
}

const addon: AcrolinxSidebarAddon = {
  onTextExtracted(event: ExtractedTextEvent) {
    ReactDOM.render(<AppComponent text={event.text}/>, document.getElementById('root'));
  },
};

initAcrolinxSidebarAddon(addon);

const useDummyData = window.location.href.includes('usedummydata');
addon.onTextExtracted({text: useDummyData ? DUMMY_TEXT : ''});
