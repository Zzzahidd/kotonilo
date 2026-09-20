import React, { useState, useEffect } from 'react';
import { Filter, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { PriceSummaryCard } from '../components/search/PriceSummaryCard';
import { CheckMyPriceWidget } from '../components/search/CheckMyPriceWidget';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportDetailModal } from '../components/reports/ReportDetailModal';
import { AddPriceModal } from '../components/post-wizard/AddPriceModal';
import { Button } from '../components/ui/Button';
import { pricesApi } from '../api/client';
import { PriceReport, PriceSummary } from '../types';
import { useAuthStore } from '../context/authStore';
import { useLanguageStore } from '../context/languageStore';
import { toBanglaNumber } from '../utils/bangla';

export const SearchResultPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { t, language } = useLanguageStore();
  
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialCategory = urlParams.get('cat') || 'all';
  const initialLocation = urlParams.get('loc') || (language === 'bn' ? 'সারা বাংলাদেশ' : 'All Bangladesh');

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState<'recent' | 'lowest' | 'highest' | 'votes'>('recent');

  const [reports, setReports] = useState<PriceReport[]>([]);
  const [summary, setSummary] = useState<PriceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedReport, setSelectedReport] = useState<PriceReport | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const isAllLocation = selectedLocation === 'সারা বাংলাদেশ' || selectedLocation === 'All Bangladesh';
      const [reportsRes, summaryRes] = await Promise.all([
        pricesApi.getPrices({
          search: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: !isAllLocation ? selectedLocation : undefined,
          sort: sortBy,
          limit: 20,
        }),
        pricesApi.getSummary({
          q: searchQuery || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          location: !isAllLocation ? selectedLocation : undefined,
        }),
      ]);

      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data.reports);
      }
      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedLocation, sortBy]);

  const handleSearchSubmit = () => {
    fetchData();
  };

  const handleVote = async (reportId: string, type: 'positive' | 'negative') => {
    if (!isAuthenticated) {
      openAuthModal('anonymous');
      return;
    }

    try {
      const res = await pricesApi.voteReport(reportId, type);
      if (res.success && res.data) {
        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? {
                  ...r,
                  positiveVotesCount: res.data.positiveVotesCount,
                  negativeVotesCount: res.data.negativeVotesCount,
                  positivePercentage: res.data.positivePercentage,
                  negativePercentage: res.data.negativePercentage,
                  userVote: res.data.userVote,
                }
              : r
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Search Input Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Aggregate Price Intelligence Card */}
      {summary && summary.hasData && (
        <PriceSummaryCard
          summary={summary}
          itemTitle={searchQuery || undefined}
          location={selectedLocation}
        />
      )}

      {/* Check My Price Widget */}
      <CheckMyPriceWidget
        itemTitle={searchQuery || undefined}
        categorySlug={selectedCategory !== 'all' ? selectedCategory : undefined}
      />

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6 bg-white p-4 rounded-2xl border border-[#E3E2E3] shadow-card">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#848389]" />
          <span className="text-xs font-semibold text-[#191923]">{t('sortBy')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAFAF8] border border-[#E3E2E3] text-xs text-[#191923] rounded-xl px-3 py-1.5 focus:outline-none"
          >
            <option value="recent">{t('sortRecent')}</option>
            <option value="lowest">{t('sortLowest')}</option>
            <option value="highest">{t('sortHighest')}</option>
            <option value="votes">{t('sortVotes')}</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#55555C]">
            {t('totalFoundPrefix')}{' '}
            <strong>{language === 'bn' ? toBanglaNumber(reports.length) : reports.length}</strong>{' '}
            {t('totalPricesFound')}
          </span>
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            iconPosition="left"
            className="rounded-full text-xs"
          >
            {t('addPrice')}
          </Button>
        </div>
      </div>

      {/* Report Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="w-full h-48 bg-white rounded-3xl border border-[#E3E2E3] p-5 animate-pulse" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onVote={handleVote}
              onClick={() => setSelectedReport(report)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E3E2E3] p-8 space-y-4">
          <h3 className="text-lg font-bold text-[#191923]">
            {t('noReportsFound')}
          </h3>
          <p className="text-xs text-[#55555C] max-w-sm mx-auto">
            {t('noReportsFoundSub')}
          </p>
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="primary"
            size="md"
            className="rounded-xl"
          >
            {t('addFirstPrice')}
          </Button>
        </div>
      )}

      {/* Modals */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onVote={handleVote}
      />

      <AddPriceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

