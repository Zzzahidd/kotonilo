import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Trash2,
  Edit3,
  LogOut,
  Smartphone,
  Laptop,
  Shield,
  Plus,
  Clock,
  MapPin,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../context/authStore';
import { useLanguageStore } from '../context/languageStore';
import { pricesApi, authApi } from '../api/client';
import { PriceReport, SessionInfo } from '../types';
import { AddPriceModal } from '../components/post-wizard/AddPriceModal';
import { formatPrice, getRelativeTime, toBanglaNumber } from '../utils/bangla';

export const MyReportsPage: React.FC = () => {
  const { user, isAuthenticated, logout, logoutAll, openAuthModal } = useAuthStore();
  const { t, language } = useLanguageStore();

  const [reports, setReports] = useState<PriceReport[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingReport, setEditingReport] = useState<PriceReport | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Add Price Modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [reportsRes, sessionsRes] = await Promise.all([
        pricesApi.getMyReports(),
        authApi.getSessions(),
      ]);

      if (reportsRes.success && reportsRes.data) {
        setReports(reportsRes.data.reports);
      }
      if (sessionsRes.success && sessionsRes.data) {
        setSessions(sessionsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('deleteConfirm'))) return;
    try {
      await pricesApi.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (report: PriceReport) => {
    setEditingReport(report);
    setEditTitle(report.itemTitle);
    setEditPrice(report.price.toString());
    setEditLocation(report.location?.fullAddress || '');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;
    setEditLoading(true);
    try {
      await pricesApi.updateReport(editingReport.id, {
        itemTitle: editTitle,
        price: parseInt(editPrice, 10),
        location: {
          division: 'ঢাকা',
          district: 'ঢাকা',
          area: editLocation.split(',')[0] || editLocation,
          fullAddress: editLocation,
        },
      });
      setEditingReport(null);
      fetchUserData();
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await authApi.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F0EFF0] flex items-center justify-center mx-auto text-[#191923]">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#191923]">{t('loginRequired')}</h2>
        <p className="text-xs text-[#55555C]">
          {t('loginRequiredDesc')}
        </p>
        <Button onClick={() => openAuthModal('login')} variant="primary" size="md">
          {t('loginBtn')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-[#E3E2E3] p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#191923] text-white flex items-center justify-center text-xl font-bold">
            {user?.displayName ? user.displayName[0] : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#191923]">
                {user?.displayName}
              </h1>
              {user?.isAnonymous && (
                <span className="px-2.5 py-0.5 bg-[#F0EFF0] text-[#55555C] text-xs rounded-full font-medium">
                  {t('anonymousAccount')}
                </span>
              )}
            </div>
            <p className="text-xs text-[#848389]">@{user?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAddModalOpen(true)}
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            className="rounded-full"
          >
            {t('addNewPrice')}
          </Button>

          <Button
            onClick={logout}
            variant="secondary"
            size="md"
            icon={<LogOut className="w-4 h-4" />}
            iconPosition="left"
            className="rounded-full"
          >
            {t('logout')}
          </Button>
        </div>
      </div>

      {/* Submitted Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#191923]">
            {t('mySubmittedPrices')} ({language === 'bn' ? toBanglaNumber(reports.length) : reports.length})
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 bg-white rounded-2xl border border-[#E3E2E3] animate-pulse" />
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-[#E3E2E3] p-5 shadow-card flex flex-col justify-between"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#191923]">{report.itemTitle}</h3>
                    <p className="text-xl font-bold text-[#191923] mt-0.5">
                      {formatPrice(report.price, language)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(report)}
                      className="p-2 text-[#55555C] hover:text-[#191923] hover:bg-[#F0EFF0] rounded-lg transition-colors cursor-pointer"
                      title={t('editReport')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="p-2 text-[#848389] hover:text-[#D94A45] hover:bg-[#FDEEEE] rounded-lg transition-colors cursor-pointer"
                      title={t('cancel')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EFEDEF] text-xs text-[#848389]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {report.location?.fullAddress || report.location?.area || 'ঢাকা'}
                  </span>
                  <span>{getRelativeTime(report.createdAt, language)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E3E2E3] p-8 text-center space-y-3">
            <p className="text-xs text-[#55555C]">{t('noSubmittedPrices')}</p>
            <Button onClick={() => setAddModalOpen(true)} variant="secondary" size="sm">
              {t('addFirstPrice')}
            </Button>
          </div>
        )}
      </div>

      {/* Active Device Sessions & Security */}
      <div className="bg-white rounded-3xl border border-[#E3E2E3] p-6 sm:p-8 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#191923]" />
              <h2 className="text-lg font-bold text-[#191923]">{t('activeSessions')}</h2>
            </div>
            <p className="text-xs text-[#55555C] mt-0.5">
              {t('activeSessionsSub')}
            </p>
          </div>

          <Button
            onClick={logoutAll}
            variant="danger"
            size="sm"
            className="rounded-full self-start sm:self-auto text-xs"
          >
            {t('logoutAll')}
          </Button>
        </div>

        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3.5 bg-[#FAFAF8] rounded-xl border border-[#E3E2E3]/60 text-xs"
            >
              <div className="flex items-center gap-3">
                {s.deviceType === 'mobile' ? (
                  <Smartphone className="w-5 h-5 text-[#55555C]" />
                ) : (
                  <Laptop className="w-5 h-5 text-[#55555C]" />
                )}
                <div>
                  <p className="font-semibold text-[#191923]">
                    {s.browser} • {s.os} ({s.deviceType})
                  </p>
                  <p className="text-[#848389]">{t('ip')} {s.ipAddress}</p>
                </div>
              </div>

              <button
                onClick={() => handleRevokeSession(s.id)}
                className="text-xs text-[#D94A45] hover:underline cursor-pointer"
              >
                {t('revokeSession')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Report Modal */}
      <Modal
        isOpen={!!editingReport}
        onClose={() => setEditingReport(null)}
        title={t('editReport')}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label={t('itemTitle')}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <Input
            label={t('priceInputLabel')}
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            required
          />
          <Input
            label={t('locationInputLabel')}
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setEditingReport(null)}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={editLoading}
            >
              {t('updateBtn')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Price Modal */}
      <AddPriceModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={fetchUserData}
      />
    </div>
  );
};

