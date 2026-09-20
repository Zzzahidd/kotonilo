import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PriceReport } from '../../types';
import { ReportCard } from './ReportCard';
import { useLanguageStore } from '../../context/languageStore';

interface RecentReportsGridProps {
  reports: PriceReport[];
  loading?: boolean;
  onVote: (reportId: string, type: 'positive' | 'negative') => void;
  onSelectReport: (report: PriceReport) => void;
}

export const RecentReportsGrid: React.FC<RecentReportsGridProps> = ({
  reports,
  loading = false,
  onVote,
  onSelectReport,
}) => {
  const { t } = useLanguageStore();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-base sm:text-lg font-bold text-[#191923]">
          {t('recentReports')}
        </h2>
        <a
          href="/search"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#191923] hover:text-[#55555C] transition-colors group"
        >
          {t('seeMore')}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="w-full h-40 bg-white rounded-2xl border border-[#E3E2E3] p-4 animate-pulse"
            >
              <div className="w-24 h-4 bg-[#F0EFF0] rounded-full mb-3" />
              <div className="flex gap-3">
                <div className="w-24 h-24 bg-[#F0EFF0] rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="w-16 h-3 bg-[#F0EFF0] rounded" />
                  <div className="w-32 h-4 bg-[#F0EFF0] rounded" />
                  <div className="w-20 h-5 bg-[#F0EFF0] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onVote={onVote}
              onClick={() => onSelectReport(report)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-[#E3E2E3] p-6">
          <p className="text-[#55555C] text-xs sm:text-sm">{t('noReportsFound')}</p>
        </div>
      )}
    </section>
  );
};
