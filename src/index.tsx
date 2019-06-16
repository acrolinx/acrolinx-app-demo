import * as _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';
import {createAcrolinxApp, ExtractedTextEvent} from './acrolinx-sidebar-addon-sdk';
import {DUMMY_TEXT} from './dummy-data';
import './index.css';
import {STOPWORDS_BY_LANGUAGE} from './stop-words';

interface AppComponentProps {
  acrolinxAnalysisResult: ExtractedTextEvent;
}

function AppComponent({acrolinxAnalysisResult}: AppComponentProps) {
  if (_.isEmpty(acrolinxAnalysisResult.text)) {
    return <div className="message">{'Welcome to Word Cloud'}</div>
  }

  const stopWords = STOPWORDS_BY_LANGUAGE[acrolinxAnalysisResult.languageId] || new Set();

  const wordsWithFrequency = _.chain(acrolinxAnalysisResult.text.toLowerCase().split(/\W+/))
    .filter(word => word.length > 1 && !stopWords.has(word))
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

  button: {
    text: 'Generate Word Cloud',
    tooltip: 'Generate a word cloud of your document content'
  },

  onTextExtracted(event: ExtractedTextEvent) {
    ReactDOM.render(
      <AppComponent acrolinxAnalysisResult={event}/>,
      document.getElementById('root')
    );
  },
});

const useDummyData = _.includes(window.location.href, 'usedummydata');
acrolinxSidebarApp.onTextExtracted({
  text: useDummyData ? DUMMY_TEXT : '',
  languageId: 'en'
});
