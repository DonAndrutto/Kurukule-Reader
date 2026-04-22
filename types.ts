export interface AppSettings {
  fontSize: number;
  isDarkMode: boolean;
  showPhonetics: boolean;
  showTranslation: boolean;
  showTibetan: boolean;
}

export type BlockType = 'title' | 'subtitle' | 'verse' | 'instruction' | 'mantra' | 'dedication' | 'image';

export interface PrayerBlockData {
  id: string;
  type: BlockType;
  tibetan?: string;
  phonetics?: string;
  english?: string;
  instruction?: string; // For instructions that might appear mid-text
  src?: string; // For image blocks
}

export interface Section {
  title: string;
  blocks: PrayerBlockData[];
}