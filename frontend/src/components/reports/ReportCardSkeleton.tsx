import React from 'react';

export const ReportCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E3E2E3] p-4 shadow-sm flex flex-col justify-between animate-pulse">
      {/* Top Bar: Author & Bookmark Placeholder */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 bg-[#F0EFF0] rounded-full" />
        <div className="w-4 h-4 bg-[#F0EFF0] rounded" />
      </div>

      {/* Middle Body: Thumbnail + Info */}
      <div className="flex gap-3 sm:gap-4 mb-3">
        {/* Left: Thumbnail skeleton */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-[#F0EFF0] border border-[#E3E2E3]/60 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Right: Text skeletons */}
        <div className="flex-1 flex flex-col justify-center min-w-0 space-y-1.5">
          {/* Category */}
          <div className="h-3 w-16 bg-[#F0EFF0] rounded" />
          
          {/* Title */}
          <div className="h-4.5 w-4/5 bg-[#E5E4E6] rounded" />

          {/* Price */}
          <div className="h-6 w-28 bg-[#DCDAE0] rounded" />

          {/* Tags */}
          <div className="flex gap-1">
            <div className="h-3.5 w-12 bg-[#F0EFF0] rounded" />
            <div className="h-3.5 w-14 bg-[#F0EFF0] rounded" />
          </div>

          {/* Location & Time */}
          <div className="h-3 w-36 bg-[#F0EFF0] rounded" />
        </div>
      </div>

      {/* Bottom Vote Buttons Skeleton */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EFEDEF]/80">
        <div className="h-8 bg-[#F0EFF0] rounded-lg border border-[#E3E2E3]/60" />
        <div className="h-8 bg-[#F0EFF0] rounded-lg border border-[#E3E2E3]/60" />
      </div>
    </div>
  );
};
