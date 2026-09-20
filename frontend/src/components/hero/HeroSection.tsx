import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '../../context/languageStore';

interface HeroSectionProps {
  onOpenAddModal: () => void;
  totalReportsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAddModal, totalReportsCount = 12532 }) => {
  const { t, language } = useLanguageStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#E7EDF3]">
      {/* Full-bleed edge-to-edge Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/Background image.png"
          alt="Dhaka Skyline"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle gradient overlay to guarantee crystal clear text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-transparent sm:from-white/80 sm:via-white/25 pointer-events-none" />
      </div>

      {/* Hero Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 min-h-[360px] sm:min-h-[420px] md:min-h-[440px] flex flex-col justify-between">
        
        {/* Top Right Floating Stat Card */}
        <div className="absolute top-6 right-4 sm:top-8 sm:right-6 hidden sm:block">
          <div className="bg-white/95 backdrop-blur-sm border border-white/80 rounded-xl p-3.5 sm:p-4 shadow-sm text-left min-w-[130px] sm:min-w-[145px]">
            <p className="text-[11px] text-[#55555C] font-normal">{t('heroStatPrefix')}</p>
            <p className="text-xl sm:text-2xl font-bold text-[#191923] tracking-tight my-0.5">
              {t('heroStatCount')}
            </p>
            <p className="text-[11px] text-[#848389]">{t('heroStatDesc')}</p>
          </div>
        </div>

        {/* Hero Left Content */}
        <div className="max-w-md sm:max-w-lg my-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#191923] tracking-tight leading-tight mb-2 sm:mb-3">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#191923] font-normal leading-relaxed mb-5 sm:mb-6">
            {t('heroSubtitle')}
          </p>

          <div>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 bg-[#191923] hover:bg-[#2A2A35] active:scale-98 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-[6px] shadow-sm transition-all group cursor-pointer"
            >
              <span>{t('sharePrice')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Bottom Right Watermark SVGs */}
        <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-6 flex flex-col items-end gap-1 pointer-events-none select-none opacity-90 drop-shadow-sm">
          <img
            src="/assets/সঠিক দাম.svg"
            alt="সঠিক দাম"
            className="h-5 sm:h-7 w-auto object-contain"
          />
          <img
            src="/assets/স্মার্ট সিদান্ত.svg"
            alt="স্মার্ট সিদ্ধান্ত"
            className="h-3 sm:h-4 w-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
};
