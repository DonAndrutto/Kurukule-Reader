import React from 'react';
import { PrayerBlockData, AppSettings } from '../types';

interface PrayerBlockProps {
  data: PrayerBlockData;
  settings: AppSettings;
}

const PrayerBlock: React.FC<PrayerBlockProps> = ({ data, settings }) => {
  const { showTibetan, showPhonetics, showTranslation, fontSize } = settings;

  // Font size calculations based on base size
  const tibetanSize = `${fontSize * 1.5}px`;
  const phoneticsSize = `${fontSize * 1.1}px`;
  const englishSize = `${fontSize}px`;
  const lineHeight = 1.5;

  // Render logic based on type
  if (data.type === 'title') {
    return (
      <div className="text-center mb-6 mt-4 animate-fade-in">
        {showTibetan && data.tibetan && (
          <h1 className="font-tibetan text-monk-red dark:text-monk-red text-3xl md:text-4xl mb-2 leading-relaxed">
            {data.tibetan}
          </h1>
        )}
        {showTranslation && data.english && (
          <h2 className="font-serif text-stone-800 dark:text-stone-100 text-xl md:text-2xl italic">
            {data.english}
          </h2>
        )}
      </div>
    );
  }

  if (data.type === 'subtitle') {
    return (
      <div className="text-center mb-6 opacity-80 animate-fade-in">
        {showTibetan && data.tibetan && <div className="font-tibetan text-xl mb-1">{data.tibetan}</div>}
        {showTranslation && data.english && <div className="font-serif italic">{data.english}</div>}
      </div>
    );
  }

  if (data.type === 'instruction') {
    return (
      <div className="text-center my-4 py-2 border-t border-b border-monk-saffron/30 dark:border-monk-saffron/20 animate-fade-in">
        {showTibetan && data.tibetan && (
          <div className="font-tibetan text-monk-saffron dark:text-monk-saffron text-xl mb-1">
            {data.tibetan}
          </div>
        )}
        {showTranslation && data.english && (
          <div className="font-sans text-sm tracking-wide uppercase text-stone-500 dark:text-stone-400 font-bold">
            {data.english}
          </div>
        )}
      </div>
    );
  }

  // Verse and Mantra
  const isMantra = data.type === 'mantra';
  const containerClass = isMantra 
    ? "my-4 p-4 bg-monk-red/5 dark:bg-monk-red/10 rounded-lg border-l-4 border-monk-red" 
    : "mb-3";

  return (
    <div className={`${containerClass} animate-fade-in`}>
      {showTibetan && data.tibetan && (
        <div 
          className="font-tibetan text-stone-900 dark:text-stone-100 mb-1"
          style={{ fontSize: tibetanSize, lineHeight: lineHeight }}
        >
          {data.tibetan}
        </div>
      )}
      
      {showPhonetics && data.phonetics && (
        <div 
          className={`font-sans mb-1 ${isMantra ? 'text-monk-red dark:text-monk-saffron font-bold' : 'text-monk-red dark:text-monk-saffron'}`}
          style={{ fontSize: phoneticsSize, lineHeight: lineHeight }}
        >
          {data.phonetics}
        </div>
      )}

      {showTranslation && data.english && (
        <div 
          className="font-serif text-stone-600 dark:text-stone-400"
          style={{ fontSize: englishSize, lineHeight: lineHeight }}
        >
          {data.english}
        </div>
      )}
    </div>
  );
};

export default PrayerBlock;