import { Heart } from 'lucide-react';
import type { AppSettings } from '../types';

export const donationURL = 'https://www.paypal.com/donate/?business=JZS5LVZKPPY5J&no_recurring=0&item_name=Help+fund+Dharma+translation+projects.&currency_code=USD';

interface HeaderProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const layers = [
  ['showTibetan', 'TIB', 'Tibetan'],
  ['showPhonetics', 'PHO', 'Phonetics'],
  ['showTranslation', 'ENG', 'English translation'],
] as const;

export default function Header({ settings, updateSetting }: HeaderProps) {
  return <header className="reader-head">
    <div className="head-inner">
      <span className="reader-name">Rongzompa’s Kurukullé</span>
      <div className="layers" aria-label="Text layers">
        {layers.map(([key, label, title]) => <button key={key} title={title}
          aria-pressed={settings[key]} onClick={() => updateSetting(key, !settings[key])}>{label}</button>)}
      </div>
      <a className="donate" href={donationURL} target="_blank" rel="noreferrer" aria-label="Donate"><Heart size={18} /></a>
    </div>
  </header>;
}
