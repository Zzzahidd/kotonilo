import React from 'react';
import { ShieldCheck, Clock, MapPin } from 'lucide-react';
import { PriceSummary } from '../../types';
import { useLanguageStore } from '../../context/languageStore';
import { formatPrice } from '../../utils/bangla';

interface PriceSummaryCardProps {
  summary: PriceSummary;
  itemTitle?: string;
  location?: string;
}

export const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  summary,
  itemTitle,
  location,
}) => {
  const { t, language } = useLanguageStore();

  if (!summary.hasData) return null;

  const typicalPrice = formatPrice(summary.typicalPrice, language);
  const minRange = formatPrice(summary.minRange, language);
  const maxRange = formatPrice(summary.maxRange, language);

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E3E2E3] p-6 sm:p-8 shadow-card mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Typical Price & Range */}
        <div>
          {itemTitle && (
            <h2 className="text-xl sm:text-2xl font-bold text-[#191923] mb-2">
              {itemTitle}
            </h2>
          )}
          <span className="text-xs font-medium text-[#848389] uppercase tracking-wider block mb-1">
            {t('typicalPrice')}
          </span>
          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191923] tracking-tight mb-2">
            {typicalPrice}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F3F5] rounded-full text-xs sm:text-sm font-medium text-[#55555C]">
            <span>{t('normalRange')}</span>
            <span className="font-semibold text-[#191923]">
              {minRange} – {maxRange}
            </span>
          </div>
        </div>

        {/* Right: Confidence & Freshness Evidence */}
        <div className="flex flex-col gap-3 bg-[#FAFAF8] rounded-2xl p-4 sm:p-5 border border-[#E3E2E3]/60 md:min-w-[260px]">
          <div className="flex items-center gap-2 text-xs text-[#191923] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#168A55] shrink-0" />
            <span>{summary.confidenceText}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#55555C]">
            <Clock className="w-4 h-4 text-[#848389] shrink-0" />
            <span>{t('lastUpdated')} {summary.lastUpdatedBn}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#55555C]">
            <MapPin className="w-4 h-4 text-[#848389] shrink-0" />
            <span>{t('location')} {location || t('allBangladesh')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

