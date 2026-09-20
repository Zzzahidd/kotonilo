import { create } from 'zustand';
import { Language, translations, TranslationKey } from '../i18n/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'bn';
  const saved = localStorage.getItem('kotonilo_lang') as Language;
  const initial = (saved === 'en' || saved === 'bn') ? saved : 'bn';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = initial;
    document.documentElement.setAttribute('data-lang', initial);
  }
  return initial;
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: getInitialLanguage(),

  setLanguage: (language: Language) => {
    localStorage.setItem('kotonilo_lang', language);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    }
    set({ language });
  },

  toggleLanguage: () => {
    const current = get().language;
    const next: Language = current === 'bn' ? 'en' : 'bn';
    get().setLanguage(next);
  },

  t: (key: TranslationKey) => {
    const currentLang = get().language;
    const langDict = translations[currentLang] || translations.bn;
    return (langDict[key] || translations.bn[key] || key) as string;
  },
}));

