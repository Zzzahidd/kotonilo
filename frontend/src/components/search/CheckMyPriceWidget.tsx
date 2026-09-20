import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { pricesApi } from '../../api/client';
import { CheckPriceResult } from '../../types';
import { useLanguageStore } from '../../context/languageStore';

interface CheckMyPriceWidgetProps {
  itemTitle?: string;
  categorySlug?: string;
}

export const CheckMyPriceWidget: React.FC<CheckMyPriceWidgetProps> = ({
  itemTitle,
  categorySlug,
}) => {
  const { t, language } = useLanguageStore();
  const [quotedPrice, setQuotedPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckPriceResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(quotedPrice.replace(/[^0-9]/g, ''), 10);
    if (!priceNum || priceNum <= 0) return;

    setLoading(true);
    try {
      const res = await pricesApi.checkPrice({
        quotedPrice: priceNum,
        itemTitle,
        categorySlug,
      });
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!result) return null;
    switch (result.status) {
      case 'good':
        return (
          <div className="bg-[#EAF7F0] border border-[#CDECDE] text-[#168A55] rounded-2xl p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{result.headlineBn}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#191923]">{result.descriptionBn}</p>
          </div>
        );
      case 'fair':
        return (
          <div className="bg-[#FFF8E6] border border-[#FEE29A] text-[#8C6200] rounded-2xl p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{result.headlineBn}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#191923]">{result.descriptionBn}</p>
          </div>
        );
      case 'high':
        return (
          <div className="bg-[#FDEEEE] border border-[#F5D2D0] text-[#D94A45] rounded-2xl p-4 sm:p-5 mt-4">
            <div className="flex items-center gap-2 font-bold text-base sm:text-lg mb-1">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{result.headlineBn}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#191923]">{result.descriptionBn}</p>
          </div>
        );
      default:
        return (
          <div className="bg-[#F5F3F5] text-[#55555C] rounded-2xl p-4 mt-4 text-xs">
            {result.descriptionBn}
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E3E2E3] p-6 sm:p-8 shadow-card mb-6">
      <div className="flex items-center gap-2.5 mb-2">
        <TrendingUp className="w-5 h-5 text-[#191923]" />
        <h3 className="text-lg sm:text-xl font-bold text-[#191923]">
          {t('checkMyPriceTitle')}
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-[#55555C] mb-4">
        {t('checkMyPriceSubtitle')}
      </p>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="number"
            value={quotedPrice}
            onChange={(e) => setQuotedPrice(e.target.value)}
            placeholder={t('quotedPricePlaceholder')}
            className="h-12 text-base font-medium"
            required
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="rounded-xl px-7 shrink-0"
        >
          {t('checkPriceBtn')}
        </Button>
      </form>

      {getStatusBadge()}
    </div>
  );
};

