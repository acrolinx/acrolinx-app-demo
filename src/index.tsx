import * as _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';
import {createAcrolinxApp, ExtractedTextEvent} from './acrolinx-sidebar-addon-sdk';
import {DUMMY_TEXT} from './dummy-data';
import './index.css';
import {STOP_WORDS_EN} from './stop-words';

interface AppComponentProps {
  text: string;
}

function AppComponent({text}: AppComponentProps) {
  if (_.isEmpty(text)) {
    return <div className="message">{'Welcome to Word Cloud'}</div>
  }

  const wordsWithFrequency = _.chain(text.toLowerCase().split(/\W+/))
    .filter(word => word.length > 1 && !STOP_WORDS_EN.has(word))
    .countBy()
    .map((freq, text) => ({text, value: freq}))
    .value();

  if (_.isEmpty(wordsWithFrequency)) {
    return <div className="message">{'Your document should contain some non-stop-words.'}</div>
  }

  return <ReactWordcloud words={wordsWithFrequency}/>
}


const acrolinxSidebarApp = createAcrolinxApp({
  title: 'WordCloud',

  button:  {
    text: 'Generate Word Cloud',
    tooltip: 'Generate a word cloud of your document content'
  },

  onTextExtracted(event: ExtractedTextEvent) {
    ReactDOM.render(<AppComponent text={event.text}/>, document.getElementById('root'));
  },
});

const useDummyData = window.location.href.includes('usedummydata');
acrolinxSidebarApp.onTextExtracted({text: useDummyData ? DUMMY_TEXT : ''});
