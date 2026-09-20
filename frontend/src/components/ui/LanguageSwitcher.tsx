import React from 'react';
import { useLanguageStore } from '../../context/languageStore';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { language, setLanguage } = useLanguageStore();

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#E3E2E3] bg-white hover:border-[#191923] text-[#191923] transition-all cursor-pointer ${className}`}
        title={language === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
      >
        <Globe className="w-3.5 h-3.5 text-[#55555C]" />
        <span>{language === 'bn' ? 'EN' : 'বাংলা'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-[#EFEDEF]/80 p-0.5 rounded-full border border-[#E3E2E3]/80 ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('bn')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          language === 'bn'
            ? 'bg-white text-[#191923] shadow-xs'
            : 'text-[#55555C] hover:text-[#191923]'
        }`}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          language === 'en'
            ? 'bg-white text-[#191923] shadow-xs'
            : 'text-[#55555C] hover:text-[#191923]'
        }`}
      >
        EN
      </button>
    </div>
  );
};

