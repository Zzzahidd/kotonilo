import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { CategoryPills } from '../components/categories/CategoryPills';
import { SearchBar } from '../components/search/SearchBar';
import { RecentReportsGrid } from '../components/reports/RecentReportsGrid';
import { ReportDetailModal } from '../components/reports/ReportDetailModal';
import { AddPriceModal } from '../components/post-wizard/AddPriceModal';
import { pricesApi } from '../api/client';
import { PriceReport } from '../types';
import { useAuthStore } from '../context/authStore';

export const HomePage: React.FC = () => {
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const [reports, setReports] = useState<PriceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('সারা বাংলাদেশ');

  // Modals
  const [selectedReport, setSelectedReport] = useState<PriceReport | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await pricesApi.getPrices({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        location: selectedLocation !== 'সারা বাংলাদেশ' ? selectedLocation : undefined,
        search: searchQuery || undefined,
        limit: 8,
      });
      if (res.success && res.data) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedCategory, selectedLocation]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&loc=${encodeURIComponent(selectedLocation)}`;
    } else {
      fetchReports();
    }
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

        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport((prev) =>
            prev
              ? {
                  ...prev,
                  positiveVotesCount: res.data.positiveVotesCount,
                  negativeVotesCount: res.data.negativeVotesCount,
                  positivePercentage: res.data.positivePercentage,
                  negativePercentage: res.data.negativePercentage,
                  userVote: res.data.userVote,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full pb-16">
      {/* Hero with exact Dhaka skyline background & watermark badges */}
      <HeroSection onOpenAddModal={() => setAddModalOpen(true)} />

      {/* Popular Categories */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Search & Location Bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Recent Price Reports Grid */}
      <RecentReportsGrid
        reports={reports}
        loading={loading}
        onVote={handleVote}
        onSelectReport={(report) => setSelectedReport(report)}
      />

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onVote={handleVote}
      />

      {/* Add Price Multi-Step Wizard Modal */}
      <AddPriceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchReports}
      />
    </div>
  );
};
