import React, { useState } from 'react';
import { Bookmark, MapPin, ThumbsUp, ThumbsDown, ImageOff } from 'lucide-react';
import { PriceReport } from '../../types';
import { toBanglaNumber, formatPrice, getRelativeTime } from '../../utils/bangla';
import { useLanguageStore } from '../../context/languageStore';

interface ReportCardProps {
  report: PriceReport;
  onVote?: (reportId: string, type: 'positive' | 'negative') => void;
  onClick?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onVote, onClick }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { t, language } = useLanguageStore();

  const handleVoteClick = (e: React.MouseEvent, type: 'positive' | 'negative') => {
    e.stopPropagation();
    if (onVote) {
      onVote(report.id, type);
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const categoryNameMapBn: Record<string, string> = {
    phone: 'ইলেকট্রনিক্স',
    laptop: 'ইলেকট্রনিক্স',
    gadget: 'ইলেকট্রনিক্স',
    electronics: 'ইলেকট্রনিক্স',
    transport: 'যাতায়াত',
    services: 'সেবা',
    food: 'খাবার',
    hotel: 'হোটেল',
    bike: 'বাইক',
    furniture: 'আসবাব',
    watch: 'ঘড়ি',
    other: 'অন্যান্য',
  };

  const categoryNameMapEn: Record<string, string> = {
    phone: 'Electronics',
    laptop: 'Electronics',
    gadget: 'Electronics',
    electronics: 'Electronics',
    transport: 'Transport',
    services: 'Services',
    food: 'Food',
    hotel: 'Hotel',
    bike: 'Bikes',
    furniture: 'Furniture',
    watch: 'Watches',
    other: 'Other',
  };

  const displayCategory = language === 'bn'
    ? (categoryNameMapBn[report.categorySlug] || 'সাধারণ')
    : (categoryNameMapEn[report.categorySlug] || 'General');

  const relativeTime = getRelativeTime(report.createdAt, language);
  const priceDisplay = formatPrice(report.price, language);
  const posPct = language === 'bn' ? `${toBanglaNumber(report.positivePercentage)}%` : `${report.positivePercentage}%`;
  const negPct = language === 'bn' ? `${toBanglaNumber(report.negativePercentage)}%` : `${report.negativePercentage}%`;

  return (
    <div
      onClick={onClick}
      className="w-full bg-white rounded-2xl border border-[#E3E2E3] p-4 shadow-sm hover:border-[#191923]/30 transition-all duration-150 cursor-pointer flex flex-col justify-between group"
    >
      {/* Top Bar: Author & Bookmark */}
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-2.5 py-0.5 bg-[#F5F3F5] text-[#55555C] text-[11px] rounded-full font-normal">
          {t('postedBy')} {report.authorName}
        </span>
        <button
          type="button"
          onClick={handleBookmarkClick}
          className="text-[#848389] hover:text-[#191923] p-0.5 transition-colors cursor-pointer"
          aria-label="Bookmark"
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#191923] text-[#191923]' : ''}`}
          />
        </button>
      </div>

      {/* Middle Body: Image + Info */}
      <div className="flex gap-3 sm:gap-4 mb-3">
        {/* Left: Thumbnail Image or Placeholder */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-[#F5F3F5] border border-[#E3E2E3]/60 flex items-center justify-center">
          {report.imageUrl ? (
            <img
              src={report.imageUrl}
              alt={report.itemTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#848389] p-2 text-center">
              <ImageOff className="w-5 h-5 mb-0.5 text-[#848389]" />
              <span className="text-[10px] font-medium">{t('noImage')}</span>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <span className="text-[11px] font-normal text-[#848389] mb-0.5">
            {displayCategory}
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-[#191923] truncate leading-tight mb-0.5">
            {report.itemTitle}
          </h3>
          <div className="text-lg sm:text-xl font-bold text-[#191923] tracking-tight mb-1">
            {priceDisplay}
          </div>

          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {report.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 bg-[#F5F3F5] text-[#55555C] text-[10px] rounded font-normal"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Location & Time */}
          <div className="flex items-center gap-1 text-[11px] text-[#848389] truncate">
            {report.location?.fullAddress && (
              <>
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{report.location.fullAddress}</span>
                <span>•</span>
              </>
            )}
            <span className="shrink-0">{relativeTime}</span>
          </div>
        </div>
      </div>

      {/* Bottom Vote Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EFEDEF]/80">
        <button
          type="button"
          onClick={(e) => handleVoteClick(e, 'positive')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95 ${
            report.userVote === 'positive'
              ? 'bg-[#168A55] text-white shadow-sm'
              : 'bg-[#EAF7F0] hover:bg-[#DCF2E5] text-[#168A55] border border-[#CDECDE]'
          }`}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>{t('goodPrice')} {posPct}</span>
        </button>

        <button
          type="button"
          onClick={(e) => handleVoteClick(e, 'negative')}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-95 ${
            report.userVote === 'negative'
              ? 'bg-[#D94A45] text-white shadow-sm'
              : 'bg-[#FDEEEE] hover:bg-[#FADBD9] text-[#D94A45] border border-[#F5D2D0]'
          }`}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          <span>{t('highPrice')} {negPct}</span>
        </button>
      </div>
    </div>
  );
};
