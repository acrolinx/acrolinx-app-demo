/*
 * Copyright 2019-present Acrolinx GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, softwareq
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare module 'react-wordcloud' {
  type CloudWord = {};

  export type MinMaxPair = [number, number];

  export enum Scale {
    Linear = 'linear',
    Log = 'log',
    Sqrt = 'sqrt',
  }

  export enum Spiral {
    Archimedean = 'archimedean',
    Rectangular = 'rectangular',
  }

  export interface Callbacks {
    getWordColor?: (word: Word) => string;
    getWordTooltip?: (word: Word) => string;
    onWordClick?: (word: Word) => void;
    onWordMouseOut?: (word: Word) => void;
    onWordMouseOver?: (word: Word) => void;
  }

  export interface Options {
    colors: string[];
    enableTooltip: boolean;
    fontFamily: string;
    fontSizes: MinMaxPair;
    fontStyle: string;
    fontWeight: string;
    padding: number;
    rotationAngles: MinMaxPair;
    rotations?: number;
    scale: Scale;
    spiral: Spiral;
    transitionDuration: number;
  }

  export interface Word extends CloudWord {
    text: string;
    value: number;
  }

  export interface Props {
    callbacks?: Callbacks;
    minSize?: MinMaxPair;
    maxWords?: number;
    options?: Partial<Options>;
    size?: MinMaxPair;
    words: Word[];
  }

  function Wordcloud(options: Props): any;

  export = Wordcloud;
}
