import type { AppSettings, PrayerBlockData } from '../types';

function English({ data }: { data: PrayerBlockData }) {
  if (data.id === 'contact') return <a href={`mailto:${data.english}`}>{data.english}</a>;
  if (data.id === 'dedication') {
    const name = 'Gangteng Tulku Rinpoche';
    const [before, after] = data.english!.split(name);
    return <>{before}<a href="https://gangteng-rinpoche.org/about/" target="_blank" rel="noreferrer">{name}</a>{after}</>;
  }
  return <>{data.english}</>;
}

export default function PrayerBlock({ data, settings }: { data: PrayerBlockData; settings: AppSettings }) {
  if (data.type === 'image') return <figure data-block={data.id}><img src={data.src} alt={data.english} loading="lazy" /></figure>;
  const tib = settings.showTibetan && data.tibetan;
  const pho = settings.showPhonetics && data.phonetics;
  const eng = settings.showTranslation && data.english;
  if (!tib && !pho && !eng) return null;
  const Element = data.type === 'title' ? 'h1' : 'div';
  return <Element className={`block block-${data.type}`} data-block={data.id}>
    {tib && <span className="tib" lang="bo">{tib}</span>}
    {pho && <span className="pho">{pho}</span>}
    {eng && <span className="eng"><English data={data}/></span>}
  </Element>;
}
