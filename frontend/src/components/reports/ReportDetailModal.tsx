import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Flag,
  CheckCircle2,
  XCircle,
  Share2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PriceReport } from '../../types';
import { toBanglaNumber, formatPrice, getRelativeTime } from '../../utils/bangla';
import { pricesApi } from '../../api/client';
import { useLanguageStore } from '../../context/languageStore';

interface ReportDetailModalProps {
  report: PriceReport | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (reportId: string, type: 'positive' | 'negative') => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
  onVote,
}) => {
  const { t, language } = useLanguageStore();
  const [reportingProblem, setReportingProblem] = useState(false);
  const [problemReason, setProblemReason] = useState('ভুল দাম');
  const [problemDetails, setProblemDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submittingFlag, setSubmittingFlag] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFlag(true);
    try {
      await pricesApi.reportProblem(report.id, problemReason, problemDetails);
      setReportSubmitted(true);
      setTimeout(() => {
        setReportingProblem(false);
        setReportSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFlag(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedPrice = formatPrice(report.price, language);
  const relativeTime = getRelativeTime(report.createdAt, language);

  const problemReasons = [
    { key: 'wrongPrice', label: t('wrongPrice') },
    { key: 'wrongInfo', label: t('wrongInfo') },
    { key: 'duplicateReport', label: t('duplicateReport') },
    { key: 'irrelevant', label: t('irrelevant') },
    { key: 'otherReason', label: t('otherReason') },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={report.itemTitle}
      subtitle={`${t('postedBy')} ${report.authorName || (report.isAnonymous ? t('anonymous') : '')}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Main Price & Image Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {report.imageUrl && (
            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#F5F3F5] border border-[#E3E2E3]">
              <img
                src={report.imageUrl}
                alt={report.itemTitle}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#848389] uppercase tracking-wider block mb-1">
                {t('paidPrice')}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#191923] tracking-tight">
                {displayedPrice}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-[#F5F3F5] text-[#191923] text-xs font-medium rounded-full">
                  {report.condition}
                </span>
                {report.tags?.map((tStr, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#F0EFF0] text-[#55555C] text-xs rounded-full"
                  >
                    {tStr}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 bg-[#FAFAF8] p-3.5 rounded-2xl border border-[#E3E2E3]/60 text-xs">
              <div className="flex items-center gap-2 text-[#55555C]">
                <MapPin className="w-4 h-4 text-[#848389] shrink-0" />
                <span>{t('location')} <strong className="text-[#191923]">{report.location?.fullAddress || report.location?.area || 'ঢাকা'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-[#55555C]">
                <Clock className="w-4 h-4 text-[#848389] shrink-0" />
                <span>{t('postedAt')} <strong className="text-[#191923]">{relativeTime}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Attributes / Details */}
        {report.extraDetails && Object.keys(report.extraDetails).length > 0 && (
          <div className="border-t border-[#EFEDEF] pt-4">
            <h4 className="text-sm font-semibold text-[#191923] mb-3">
              {t('additionalInfo')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {report.extraDetails.batteryHealth && (
                <div className="bg-[#F5F3F5] p-3 rounded-xl">
                  <span className="text-[11px] text-[#848389] block">{t('batteryHealth')}</span>
                  <span className="text-xs font-medium text-[#191923]">{report.extraDetails.batteryHealth}</span>
                </div>
              )}
              {report.extraDetails.warranty && (
                <div className="bg-[#F5F3F5] p-3 rounded-xl">
                  <span className="text-[11px] text-[#848389] block">{t('warranty')}</span>
                  <span className="text-xs font-medium text-[#191923]">{report.extraDetails.warranty}</span>
                </div>
              )}
              {report.extraDetails.box !== undefined && (
                <div className="bg-[#F5F3F5] p-3 rounded-xl flex items-center gap-2">
                  {report.extraDetails.box ? <CheckCircle2 className="w-4 h-4 text-[#168A55]" /> : <XCircle className="w-4 h-4 text-[#848389]" />}
                  <span className="text-xs font-medium text-[#191923]">
                    {t('originalBox')} {report.extraDetails.box ? t('has') : t('hasNot')}
                  </span>
                </div>
              )}
              {report.extraDetails.charger !== undefined && (
                <div className="bg-[#F5F3F5] p-3 rounded-xl flex items-center gap-2">
                  {report.extraDetails.charger ? <CheckCircle2 className="w-4 h-4 text-[#168A55]" /> : <XCircle className="w-4 h-4 text-[#848389]" />}
                  <span className="text-xs font-medium text-[#191923]">
                    {t('originalCharger')} {report.extraDetails.charger ? t('has') : t('hasNot')}
                  </span>
                </div>
              )}
              {report.extraDetails.notes && (
                <div className="col-span-2 sm:col-span-3 bg-[#F5F3F5] p-3 rounded-xl">
                  <span className="text-[11px] text-[#848389] block">{t('notes')}</span>
                  <span className="text-xs text-[#191923]">{report.extraDetails.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Voting & Community Reaction */}
        <div className="border-t border-[#EFEDEF] pt-4">
          <h4 className="text-sm font-semibold text-[#191923] mb-3">
            {t('howIsThisPrice')}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onVote && onVote(report.id, 'positive')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                report.userVote === 'positive'
                  ? 'bg-[#168A55] text-white shadow-md'
                  : 'bg-[#EAF7F0] hover:bg-[#DCF2E5] text-[#168A55] border border-[#CDECDE]'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>
                {t('goodPrice')}{' '}
                {language === 'bn'
                  ? `${toBanglaNumber(report.positivePercentage)}% (${toBanglaNumber(report.positiveVotesCount)})`
                  : `${report.positivePercentage}% (${report.positiveVotesCount})`}
              </span>
            </button>

            <button
              onClick={() => onVote && onVote(report.id, 'negative')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                report.userVote === 'negative'
                  ? 'bg-[#D94A45] text-white shadow-md'
                  : 'bg-[#FDEEEE] hover:bg-[#FADBD9] text-[#D94A45] border border-[#F5D2D0]'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span>
                {t('highPrice')}{' '}
                {language === 'bn'
                  ? `${toBanglaNumber(report.negativePercentage)}% (${toBanglaNumber(report.negativeVotesCount)})`
                  : `${report.negativePercentage}% (${report.negativeVotesCount})`}
              </span>
            </button>
          </div>
        </div>

        {/* Action Row: Share & Report Problem */}
        <div className="flex items-center justify-between border-t border-[#EFEDEF] pt-4 text-xs">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-[#55555C] hover:text-[#191923] transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? t('linkCopied') : t('shareReport')}</span>
          </button>

          <button
            onClick={() => setReportingProblem(!reportingProblem)}
            className="flex items-center gap-1.5 text-[#848389] hover:text-[#D94A45] transition-colors cursor-pointer"
          >
            <Flag className="w-4 h-4" />
            <span>{t('hasProblemWithReport')}</span>
          </button>
        </div>

        {/* Problem Reporting Form */}
        {reportingProblem && (
          <form onSubmit={handleFlagSubmit} className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E3E2E3] space-y-3 animate-in fade-in">
            <h5 className="text-xs font-semibold text-[#191923]">{t('selectProblemReason')}</h5>
            <div className="flex flex-wrap gap-2">
              {problemReasons.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setProblemReason(item.label)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                    problemReason === item.label
                      ? 'bg-[#191923] text-white border-[#191923]'
                      : 'bg-white text-[#55555C] border-[#E3E2E3]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <textarea
              value={problemDetails}
              onChange={(e) => setProblemDetails(e.target.value)}
              placeholder={t('additionalDetailsOptional')}
              className="w-full h-20 p-2.5 text-xs bg-white border border-[#E3E2E3] text-[#191923] rounded-xl focus:outline-none focus:border-[#191923]"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReportingProblem(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submittingFlag}
              >
                {reportSubmitted ? t('reportSubmitted') : t('submit')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

