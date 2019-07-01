import * as _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactWordcloud from 'react-wordcloud';
import {initApi, ExtractedTextEvent, ApiEvents} from '@acrolinx/app-sdk';
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

function renderApp(extractedTextEvent: ExtractedTextEvent) {
  ReactDOM.render(
    <AppComponent acrolinxAnalysisResult={extractedTextEvent}/>, document.getElementById('root')
  );
}

const acrolinxAppApi = initApi({
  appSignature: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiV29yZENsb3VkIiwiaWQiOiI2NjZmNzc4OS0zNTliLTRlNzMtYjlkMi00YTFmMWNkNDlmNDkiLCJ0eXBlIjoiQVBQIiwiaWF0IjoxNTYxNjQ1NDYyfQ.zQs7rXYkvLVzkMAyhQsHTpr1q1O_F4XPB_N7QfBbasE',
  title: 'WordCloud',

  button: {
    text: 'Generate Word Cloud',
    tooltip: 'Generate a word cloud of your document content'
  },

  requiredEvents: [ApiEvents.textExtracted],
  requiredCommands: []
});

acrolinxAppApi.events.textExtracted.addEventListener(renderApp);

const useDummyData = _.includes(window.location.href, 'usedummydata');
renderApp({
  text: useDummyData ? DUMMY_TEXT : '',
  languageId: 'en'
});
