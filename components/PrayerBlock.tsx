import React from 'react';
import { PrayerBlockData, AppSettings } from '../types';
import { CornerOrnament, Dorje, Flourish } from './Ornaments';

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
  const lineHeight = 1.55;

  // Render logic based on type
  if (data.type === 'title') {
    return (
      <div className="text-center mb-8 mt-6 animate-fade-in">
        <Flourish size={120} className="mx-auto text-monk-gold/70 dark:text-monk-saffron/60 mb-3" />
        {showTibetan && data.tibetan && (
          <h1 className="font-tibetan text-monk-red dark:text-monk-red text-3xl md:text-4xl mb-3 leading-relaxed drop-shadow-sm">
            {data.tibetan}
          </h1>
        )}
        {showTranslation && data.english && (
          <h2 className="font-serif text-stone-800 dark:text-stone-100 text-xl md:text-2xl italic">
            {data.english}
          </h2>
        )}
        <Flourish size={120} flip className="mx-auto text-monk-gold/70 dark:text-monk-saffron/60 mt-3" />
      </div>
    );
  }

  if (data.type === 'subtitle') {
    return (
      <div className="text-center mb-8 opacity-80 animate-fade-in flex flex-col items-center gap-1">
        {showTibetan && data.tibetan && <div className="font-tibetan text-xl">{data.tibetan}</div>}
        {showTranslation && data.english && (
          <div className="font-serif italic text-stone-600 dark:text-stone-300 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-monk-gold/60 dark:bg-monk-saffron/50" />
            {data.english}
            <span className="inline-block w-6 h-px bg-monk-gold/60 dark:bg-monk-saffron/50" />
          </div>
        )}
      </div>
    );
  }

  if (data.type === 'instruction') {
    return (
      <div className="text-center my-5 py-3 relative animate-fade-in">
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-monk-saffron/50 to-transparent" />
        <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-monk-saffron/50 to-transparent" />
        {showTibetan && data.tibetan && (
          <div className="font-tibetan text-monk-saffron dark:text-monk-saffron text-xl mb-1">
            {data.tibetan}
          </div>
        )}
        {showTranslation && data.english && (
          <div className="font-sans text-xs tracking-[0.22em] uppercase text-stone-500 dark:text-stone-400 font-bold flex items-center justify-center gap-2">
            <Dorje size={12} className="text-monk-saffron/80" />
            {data.english}
            <Dorje size={12} className="text-monk-saffron/80" />
          </div>
        )}
      </div>
    );
  }

  if (data.type === 'image') {
    return (
      <div className="flex justify-center my-8 animate-fade-in">
        <img
          src={data.src}
          alt={data.english || 'Image'}
          className="max-w-2xl w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    );
  }

  // Verse and Mantra
  const isMantra = data.type === 'mantra';

  if (isMantra) {
    return (
      <div className="relative my-5 p-5 mantra-surface rounded-lg border border-monk-red/20 dark:border-monk-saffron/20 shadow-sm animate-fade-in overflow-hidden">
        {/* Left accent bar */}
        <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-gradient-to-b from-monk-gold/70 via-monk-red to-monk-gold/70 dark:from-monk-saffron/70 dark:via-monk-red dark:to-monk-saffron/70 rounded-full" aria-hidden="true" />
        {/* Corner ornaments */}
        <CornerOrnament size={14} className="absolute top-1.5 left-1.5 text-monk-gold/70 dark:text-monk-saffron/70" />
        <CornerOrnament size={14} className="absolute top-1.5 right-1.5 text-monk-gold/70 dark:text-monk-saffron/70 rotate-90" />
        <CornerOrnament size={14} className="absolute bottom-1.5 right-1.5 text-monk-gold/70 dark:text-monk-saffron/70 rotate-180" />
        <CornerOrnament size={14} className="absolute bottom-1.5 left-1.5 text-monk-gold/70 dark:text-monk-saffron/70 -rotate-90" />

        <div className="pl-3">
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
              className="font-sans mb-1 text-monk-red dark:text-monk-saffron font-bold tracking-wide"
              style={{ fontSize: phoneticsSize, lineHeight: lineHeight }}
            >
              {data.phonetics}
            </div>
          )}

          {showTranslation && data.english && (
            <div
              className="font-serif italic text-stone-600 dark:text-stone-400"
              style={{ fontSize: englishSize, lineHeight: lineHeight }}
            >
              {data.english}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 animate-fade-in">
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
          className="font-sans mb-1 text-monk-red dark:text-monk-saffron"
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
