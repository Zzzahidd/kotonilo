import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Filter,
  Search,
  SearchX,
  Plus,
  RefreshCw,
  Sparkles,
  Smartphone,
  Laptop,
  Box,
  Watch,
  Bike,
  Armchair,
  UtensilsCrossed,
  Bus,
  Settings,
  Hotel,
  Layers,
} from 'lucide-react';
import { SearchBar } from '../components/search/SearchBar';
import { PriceSummaryCard } from '../components/search/PriceSummaryCard';
import { CheckMyPriceWidget } from '../components/search/CheckMyPriceWidget';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportCardSkeleton } from '../components/reports/ReportCardSkeleton';
import { ReportDetailModal } from '../components/reports/ReportDetailModal';
import { AddPriceModal } from '../components/post-wizard/AddPriceModal';
import { Button } from '../components/ui/Button';
import { pricesApi } from '../api/client';
import { PriceReport, PriceSummary } from '../types';
import { useAuthStore } from '../context/authStore';
import { useLanguageStore } from '../context/languageStore';
import { toBanglaNumber } from '../utils/bangla';

const CATEGORY_CHIPS = [
  { slug: 'all', nameBn: 'সকল ক্যাটাগরি', nameEn: 'All Categories', icon: Layers },
  { slug: 'phone', nameBn: 'ফোন', nameEn: 'Phones', icon: Smartphone },
  { slug: 'laptop', nameBn: 'ল্যাপটপ', nameEn: 'Laptops', icon: Laptop },
  { slug: 'gadget', nameBn: 'গ্যাজেট', nameEn: 'Gadgets', icon: Box },
  { slug: 'watch', nameBn: 'ঘড়ি', nameEn: 'Watches', icon: Watch },
  { slug: 'bike', nameBn: 'বাইক', nameEn: 'Bikes', icon: Bike },
  { slug: 'furniture', nameBn: 'আসবাব', nameEn: 'Furniture', icon: Armchair },
  { slug: 'food', nameBn: 'খাবার', nameEn: 'Food', icon: UtensilsCrossed },
  { slug: 'transport', nameBn: 'যাতায়াত', nameEn: 'Transport', icon: Bus },
  { slug: 'services', nameBn: 'সার্ভিস', nameEn: 'Services', icon: Settings },
  { slug: 'hotel', nameBn: 'হোটেল', nameEn: 'Hotels', icon: Hotel },
];

export const SearchResultPage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { t, language } = useLanguageStore();

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialCategory = urlParams.get('cat') || 'all';
  const initialLocation =
    urlParams.get('loc') || (language === 'bn' ? 'সারা বাংলাদেশ' : 'All Bangladesh');

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [sortBy, setSortBy] = useState<'recent' | 'lowest' | 'highest' | 'votes'>('recent');

  const [reports, setReports] = useState<PriceReport[]>([]);
  const [summary, setSummary] = useState<PriceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Modals
  const [selectedReport, setSelectedReport] = useState<PriceReport | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Debounce ref to cancel previous pending searches
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestController = useRef<AbortController | null>(null);

  // Fetch prices implementation
  const fetchData = useCallback(
    async (queryText: string, cat: string, loc: string, sort: string) => {
      setLoading(true);
      setIsSearching(true);

      const isAllLocation =
        loc === 'সারা বাংলাদেশ' || loc === 'All Bangladesh' || loc === 'all';

      try {
        const [reportsRes, summaryRes] = await Promise.all([
          pricesApi.getPrices({
            search: queryText.trim() || undefined,
            category: cat !== 'all' ? cat : undefined,
            location: !isAllLocation ? loc : undefined,
            sort: sort,
            limit: 24,
          }),
          pricesApi.getSummary({
            q: queryText.trim() || undefined,
            category: cat !== 'all' ? cat : undefined,
            location: !isAllLocation ? loc : undefined,
          }),
        ]);

        if (reportsRes.success && reportsRes.data) {
          setReports(reportsRes.data.reports || []);
        } else {
          setReports([]);
        }

        if (summaryRes.success && summaryRes.data) {
          setSummary(summaryRes.data);
        } else {
          setSummary(null);
        }
      } catch (err) {
        console.error('Fetch prices error:', err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    []
  );

  // Trigger search on live keystroke or filter change
  useEffect(() => {
    // Show immediate skeleton while typing
    setLoading(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Update URL query parameters smoothly without reloading
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'all') params.set('cat', selectedCategory);
    if (
      selectedLocation &&
      selectedLocation !== 'সারা বাংলাদেশ' &&
      selectedLocation !== 'All Bangladesh'
    ) {
      params.set('loc', selectedLocation);
    }
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${window.location.pathname}${newSearch}`;
    window.history.replaceState({}, '', newUrl);

    // Debounce for 220ms for instant butter-smooth typing response
    debounceTimerRef.current = setTimeout(() => {
      fetchData(searchQuery, selectedCategory, selectedLocation, sortBy);
    }, 220);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, selectedCategory, selectedLocation, sortBy, fetchData]);

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
    <div className="w-full min-h-[calc(100vh-4rem)] max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Top Search & Filter Bar */}
      <div className="sticky top-16 z-30 bg-[#F5F3F5]/95 backdrop-blur-md pt-1 pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-all">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          onSearchSubmit={() => {
            fetchData(searchQuery, selectedCategory, selectedLocation, sortBy);
          }}
          autoFocus={true}
        />

        {/* Category Filter Chips Bar */}
        <div className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none px-1">
          {CATEGORY_CHIPS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#191923] text-white shadow-sm'
                    : 'bg-white text-[#55555C] hover:text-[#191923] hover:bg-[#EAE8EA] border border-[#E3E2E3]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#848389]'}`} />
                <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggregate Price Intelligence Summary Card (when available) */}
      {summary && summary.hasData && (
        <div className="mt-4 animate-in fade-in duration-200">
          <PriceSummaryCard
            summary={summary}
            itemTitle={searchQuery || undefined}
            location={selectedLocation}
          />
        </div>
      )}

      {/* Check My Price Widget */}
      <div className="mt-4">
        <CheckMyPriceWidget
          itemTitle={searchQuery || undefined}
          categorySlug={selectedCategory !== 'all' ? selectedCategory : undefined}
        />
      </div>

      {/* Results Header & Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E3E2E3] shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#848389]" />
          <span className="text-xs font-semibold text-[#191923]">{t('sortBy')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAFAF8] border border-[#E3E2E3] text-xs text-[#191923] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#191923] cursor-pointer"
          >
            <option value="recent">{t('sortRecent')}</option>
            <option value="lowest">{t('sortLowest')}</option>
            <option value="highest">{t('sortHighest')}</option>
            <option value="votes">{t('sortVotes')}</option>
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-[#55555C]">
            {t('totalFoundPrefix')}{' '}
            <strong className="text-[#191923] font-bold">
              {language === 'bn' ? toBanglaNumber(reports.length) : reports.length}
            </strong>{' '}
            {t('totalPricesFound')}
          </span>
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            iconPosition="left"
            className="rounded-full text-xs shrink-0"
          >
            {t('addPrice')}
          </Button>
        </div>
      </div>

      {/* Live Results Grid / Skeleton / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 transition-opacity duration-150">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ReportCardSkeleton key={n} />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-in fade-in duration-200">
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
        /* Empty State Screen in Bangla Matching the Mobile Account Screen */
        <div className="w-full max-w-md mx-auto py-16 px-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#F0EFF0] border border-[#E3E2E3] flex items-center justify-center mx-auto text-[#191923] shadow-inner">
            <SearchX className="w-9 h-9 sm:w-10 sm:h-10 text-[#191923]" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#191923] tracking-tight">
              {language === 'bn' ? 'কোনো দাম রিপোর্ট পাওয়া যায়নি' : 'No Price Reports Found'}
            </h2>
            <p className="text-xs sm:text-sm text-[#55555C] leading-relaxed max-w-sm mx-auto">
              {searchQuery ? (
                language === 'bn' ? (
                  <>
                    <strong className="text-[#191923]">"{searchQuery}"</strong> এর জন্য কোনো দামের
                    তথ্য পাওয়া যায়নি। আপনি সম্প্রতি এটি কিনে থাকলে প্রথম দামটি যুক্ত করুন!
                  </>
                ) : (
                  <>
                    No price reports found for{' '}
                    <strong className="text-[#191923]">"{searchQuery}"</strong>. If you recently
                    bought this item, be the first to report its price!
                  </>
                )
              ) : language === 'bn' ? (
                'নির্বাচিত ফিল্টারের আওতায় কোনো রিপোর্ট পাওয়া যায়নি। অন্য ক্যাটাগরি বেছে নিন বা প্রথম দামটি যুক্ত করুন।'
              ) : (
                'No reports found matching selected filters. Try choosing a different category or add the first price!'
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => setAddModalOpen(true)}
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
              className="w-full sm:w-auto rounded-xl px-6"
            >
              {language === 'bn' ? 'প্রথম দামটি যোগ করুন' : 'Add First Price'}
            </Button>

            {(searchQuery || selectedCategory !== 'all') && (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                variant="outline"
                size="md"
                className="w-full sm:w-auto rounded-xl"
              >
                {language === 'bn' ? 'সকল দাম দেখুন' : 'View All Prices'}
              </Button>
            )}
          </div>
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
        onSuccess={() => {
          fetchData(searchQuery, selectedCategory, selectedLocation, sortBy);
        }}
      />
    </div>
  );
};
