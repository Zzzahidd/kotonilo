import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
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
  HelpCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../context/authStore';
import { useLanguageStore } from '../../context/languageStore';
import { pricesApi, uploadApi } from '../../api/client';
import { formatPrice } from '../../utils/bangla';

interface AddPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddPriceModal: React.FC<AddPriceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, isAuthenticated, createAnonymous } = useAuthStore();
  const { t, language } = useLanguageStore();

  const CATEGORY_OPTIONS = [
    { slug: 'phone', name: t('cat_phone'), icon: <Smartphone className="w-5 h-5" /> },
    { slug: 'laptop', name: t('cat_laptop'), icon: <Laptop className="w-5 h-5" /> },
    { slug: 'gadget', name: t('cat_gadget'), icon: <Box className="w-5 h-5" /> },
    { slug: 'watch', name: t('cat_watch'), icon: <Watch className="w-5 h-5" /> },
    { slug: 'bike', name: t('cat_bike'), icon: <Bike className="w-5 h-5" /> },
    { slug: 'furniture', name: t('cat_furniture'), icon: <Armchair className="w-5 h-5" /> },
    { slug: 'food', name: t('cat_food'), icon: <UtensilsCrossed className="w-5 h-5" /> },
    { slug: 'transport', name: t('cat_transport'), icon: <Bus className="w-5 h-5" /> },
    { slug: 'services', name: t('cat_services'), icon: <Settings className="w-5 h-5" /> },
    { slug: 'hotel', name: t('cat_hotel'), icon: <Hotel className="w-5 h-5" /> },
    { slug: 'other', name: t('cat_other'), icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const [step, setStep] = useState<number>(1);
  const [categorySlug, setCategorySlug] = useState('phone');
  
  // Dynamic Form Fields
  const [itemTitle, setItemTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('মিরপুর, ঢাকা');
  const [condition, setCondition] = useState('ব্যবহৃত');
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  
  // Optional Details
  const [batteryHealth, setBatteryHealth] = useState('');
  const [warranty, setWarranty] = useState('');
  const [hasBox, setHasBox] = useState(false);
  const [hasCharger, setHasCharger] = useState(false);
  const [notes, setNotes] = useState('');

  // Image Upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      setUploadingImage(true);
      try {
        const uploadRes = await uploadApi.uploadFile(file);
        if (uploadRes.success && uploadRes.data) {
          setImageUrl(uploadRes.data.url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleCategorySelect = (slug: string) => {
    setCategorySlug(slug);
    setStep(2);
  };

  const handleDynamicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !price) {
      setError(language === 'bn' ? 'পণ্যের নাম এবং দাম অবশ্যই দিতে হবে' : 'Item name and price are required');
      return;
    }
    setError('');
    setStep(3); // Go to optional details / review
  };

  const handleFinalSubmit = async () => {
    const numPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
    if (!numPrice || numPrice <= 0) {
      setError(language === 'bn' ? 'সঠিক দাম লিখুন' : 'Please enter a valid price');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        itemTitle,
        categorySlug,
        price: numPrice,
        location: {
          division: 'ঢাকা',
          district: 'ঢাকা',
          area: location.split(',')[0]?.trim() || location,
          fullAddress: location,
        },
        condition,
        tags: [condition, categorySlug],
        attributes,
        extraDetails: {
          batteryHealth: batteryHealth || undefined,
          warranty: warranty || undefined,
          box: hasBox,
          charger: hasCharger,
          notes: notes || undefined,
        },
        imageUrl: imageUrl || imagePreview || '',
        isAnonymous: user?.isAnonymous ?? true,
      };

      const res = await pricesApi.createReport(payload);
      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setStep(5); // Success step
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'bn' ? 'রিপোর্ট জমা দিতে সমস্যা হয়েছে' : 'Failed to submit price report'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setItemTitle('');
    setPrice('');
    setLocation(language === 'bn' ? 'মিরপুর, ঢাকা' : 'Mirpur, Dhaka');
    setCondition(language === 'bn' ? 'ব্যবহৃত' : 'Used');
    setBatteryHealth('');
    setWarranty('');
    setHasBox(false);
    setHasCharger(false);
    setNotes('');
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setTimeout(resetForm, 300);
      }}
      title={
        step === 5
          ? t('wizardTitleStep5')
          : step === 4
          ? t('wizardTitleStep4')
          : step === 3
          ? t('wizardTitleStep3')
          : step === 2
          ? t('wizardTitleStep2')
          : t('wizardTitleStep1')
      }
      subtitle={
        step === 5
          ? t('wizardSubStep5')
          : step === 1
          ? t('wizardSubStep1')
          : undefined
      }
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-[#FDEEEE] border border-[#F5D2D0] rounded-xl text-xs text-[#D94A45]">
          {error}
        </div>
      )}

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all hover:border-[#191923] hover:shadow-subtle cursor-pointer ${
                  categorySlug === cat.slug
                    ? 'bg-[#191923] text-white border-[#191923]'
                    : 'bg-[#FAFAF8] border-[#E3E2E3] text-[#191923]'
                }`}
              >
                <div className={categorySlug === cat.slug ? 'text-white' : 'text-[#55555C]'}>
                  {cat.icon}
                </div>
                <span className="text-sm font-semibold">{cat.name}</span>
              </button>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="pt-3 border-t border-[#EFEDEF] flex items-center justify-between text-xs text-[#55555C]">
              <span>{t('anonPromptInWizard')}</span>
              <button
                type="button"
                onClick={createAnonymous}
                className="font-semibold text-[#191923] underline cursor-pointer"
              >
                {t('anonOneClick')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Essential Category-Specific Form */}
      {step === 2 && (
        <form onSubmit={handleDynamicSubmit} className="space-y-4">
          <Input
            label={
              categorySlug === 'transport'
                ? t('itemTitleTransport')
                : categorySlug === 'services'
                ? t('itemTitleServices')
                : categorySlug === 'food'
                ? t('itemTitleFood')
                : categorySlug === 'hotel'
                ? t('itemTitleHotel')
                : t('itemTitlePhone')
            }
            value={itemTitle}
            onChange={(e) => setItemTitle(e.target.value)}
            placeholder={
              categorySlug === 'phone'
                ? t('itemTitlePhonePlh')
                : categorySlug === 'laptop'
                ? t('itemTitleLaptopPlh')
                : categorySlug === 'bike'
                ? t('itemTitleBikePlh')
                : t('itemTitleGeneralPlh')
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('priceInputLabel')}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t('priceInputPlh')}
              required
            />

            <div>
              <label className="block text-xs font-medium text-[#55555C] mb-1.5">
                {t('conditionLabel')}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-white border border-[#E3E2E3] rounded-xl text-sm text-[#191923] h-11 px-3 focus:outline-none focus:border-[#191923]"
              >
                <option value="নতুন">{t('conditionNew')}</option>
                <option value="ব্যবহৃত">{t('conditionUsed')}</option>
                <option value="ব্যবহৃত (সাধারণ)">{t('conditionUsedFair')}</option>
                <option value="সার্ভিস">{t('conditionService')}</option>
              </select>
            </div>
          </div>

          <Input
            label={t('locationInputLabel')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t('locationInputPlh')}
            required
          />

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-medium text-[#55555C] mb-1.5">
              {t('photoUploadLabel')}
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#FAFAF8] border border-dashed border-[#E3E2E3] rounded-xl hover:bg-[#F0EFF0] cursor-pointer transition-colors text-xs text-[#55555C]">
                <Upload className="w-4 h-4" />
                <span>{imageFile ? imageFile.name : t('chooseOrDropPhoto')}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#E3E2E3] shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            {uploadingImage && <p className="text-[11px] text-[#848389] mt-1">{t('uploadingPhoto')}</p>}
          </div>

          <div className="flex justify-between pt-3 border-t border-[#EFEDEF]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(1)}
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
            >
              {t('backBtn')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {t('nextBtn')}
            </Button>
          </div>
        </form>
      )}

      {/* Step 3: Optional Progressive Disclosure */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-[#55555C]">
            {t('optionalInfoSubtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('batteryHealthOptional')}
              value={batteryHealth}
              onChange={(e) => setBatteryHealth(e.target.value)}
              placeholder={t('batteryHealthPlh')}
            />
            <Input
              label={t('warrantyOptional')}
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder={t('warrantyPlh')}
            />
          </div>

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#191923] font-medium">
              <input
                type="checkbox"
                checked={hasBox}
                onChange={(e) => setHasBox(e.target.checked)}
                className="rounded border-[#E3E2E3] text-[#191923] focus:ring-[#191923]"
              />
              <span>{t('originalBoxIncluded')}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#191923] font-medium">
              <input
                type="checkbox"
                checked={hasCharger}
                onChange={(e) => setHasCharger(e.target.checked)}
                className="rounded border-[#E3E2E3] text-[#191923] focus:ring-[#191923]"
              />
              <span>{t('originalChargerIncluded')}</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#55555C] mb-1.5">
              {t('notesOptional')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlh')}
              className="w-full h-20 p-3 text-xs bg-white border border-[#E3E2E3] text-[#191923] rounded-xl focus:outline-none focus:border-[#191923]"
            />
          </div>

          <div className="flex justify-between pt-3 border-t border-[#EFEDEF]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(2)}
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
            >
              {t('backBtn')}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setStep(4)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {t('reviewBtn')}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review Before Submission */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-[#FAFAF8] rounded-2xl p-5 border border-[#E3E2E3] space-y-3">
            <div>
              <span className="text-xs text-[#848389]">{t('itemTitle')}</span>
              <p className="text-base font-bold text-[#191923]">{itemTitle}</p>
            </div>
            <div>
              <span className="text-xs text-[#848389]">{t('paidPrice')}</span>
              <p className="text-2xl font-extrabold text-[#191923]">
                {formatPrice(parseInt(price || '0', 10), language)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#EFEDEF]">
              <div>
                <span className="text-[#848389]">{t('location')}</span>
                <p className="font-semibold text-[#191923]">{location}</p>
              </div>
              <div>
                <span className="text-[#848389]">{t('conditionLabel')}:</span>
                <p className="font-semibold text-[#191923]">{condition}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-[#EFEDEF]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(3)}
            >
              {t('changeInfo')}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              loading={submitting}
              onClick={handleFinalSubmit}
              className="px-8"
            >
              {t('submitPriceBtn')}
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Success Celebration */}
      {step === 5 && (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 bg-[#EAF7F0] text-[#168A55] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#191923]">
              {t('wizardTitleStep5')}
            </h3>
            <p className="text-sm text-[#55555C] max-w-sm mx-auto mt-1">
              {t('wizardSubStep5')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="rounded-xl"
            >
              {t('okGotIt')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                resetForm();
                setStep(1);
              }}
              className="rounded-xl"
            >
              {t('addAnotherPrice')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

