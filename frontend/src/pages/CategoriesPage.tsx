import React from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '../context/languageStore';

export const CategoriesPage: React.FC = () => {
  const { t, language } = useLanguageStore();

  const ALL_CATEGORIES = [
    {
      slug: 'phone',
      name: t('cat_phone'),
      description: t('cat_phone_desc'),
      icon: <Smartphone className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['iPhone 13 128GB', 'Samsung S22 Ultra', 'Pixel 7'] : ['iPhone 13 128GB', 'Samsung S22 Ultra', 'Pixel 7'],
    },
    {
      slug: 'laptop',
      name: t('cat_laptop'),
      description: t('cat_laptop_desc'),
      icon: <Laptop className="w-6 h-6" />,
      exampleQueries: ['MacBook Air M1', 'Dell Latitude', 'HP Pavilion Gaming'],
    },
    {
      slug: 'gadget',
      name: t('cat_gadget'),
      description: t('cat_gadget_desc'),
      icon: <Box className="w-6 h-6" />,
      exampleQueries: ['AirPods Pro 2', 'Sony WH-1000XM5', 'Anker PowerBank'],
    },
    {
      slug: 'watch',
      name: t('cat_watch'),
      description: t('cat_watch_desc'),
      icon: <Watch className="w-6 h-6" />,
      exampleQueries: ['Apple Watch Series 8', 'Casio Edifice', 'Amazfit GTR'],
    },
    {
      slug: 'bike',
      name: t('cat_bike'),
      description: t('cat_bike_desc'),
      icon: <Bike className="w-6 h-6" />,
      exampleQueries: ['Yamaha R15 V3', 'Suzuki Gixxer SF', 'Honda CB Shine'],
    },
    {
      slug: 'furniture',
      name: t('cat_furniture'),
      description: t('cat_furniture_desc'),
      icon: <Armchair className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['সেগুন কাঠের টেবিল', '৪ সিটের সোফা', 'অফিস চেয়ার'] : ['Teak Table', '4-Seat Sofa', 'Office Chair'],
    },
    {
      slug: 'food',
      name: t('cat_food'),
      description: t('cat_food_desc'),
      icon: <UtensilsCrossed className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['পদ্মার ইলিশ মাছ ১ কেজি', 'খাসির মাংস', 'কাচ্চি বিরিয়ানি'] : ['Hilsa Fish 1kg', 'Mutton', 'Kacchi Biryani'],
    },
    {
      slug: 'transport',
      name: t('cat_transport'),
      description: t('cat_transport_desc'),
      icon: <Bus className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['সিএনজি মিরপুর থেকে গুলশান', 'ফার্মগেট থেকে ধানমন্ডি', 'এয়ারপোর্ট উবার'] : ['CNG Mirpur to Gulshan', 'Farmgate to Dhanmondi', 'Airport Uber'],
    },
    {
      slug: 'services',
      name: t('cat_services'),
      description: t('cat_services_desc'),
      icon: <Settings className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['এসি ১.৫ টন গ্যাস রিফিল', 'মোবাইল ডিসপ্লে চেঞ্জ', 'সুটের দর্জি মজুরি'] : ['AC Gas Refill', 'Display Repair', 'Tailoring'],
    },
    {
      slug: 'hotel',
      name: t('cat_hotel'),
      description: t('cat_hotel_desc'),
      icon: <Hotel className="w-6 h-6" />,
      exampleQueries: ['Hotel Sea Crown Coxs Bazar', language === 'bn' ? 'সাজেক কটেজ ভাড়া' : 'Sajek Cottage', language === 'bn' ? 'সিলেট রিসোর্ট' : 'Sylhet Resort'],
    },
    {
      slug: 'other',
      name: t('cat_other'),
      description: t('cat_other_desc'),
      icon: <HelpCircle className="w-6 h-6" />,
      exampleQueries: language === 'bn' ? ['বইমেলা বই', 'জিম মেম্বারশিপ', 'ডাক্তারের ভিজিট'] : ['Book Fair Books', 'Gym Membership', 'Doctor Visit'],
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#191923]">
          {t('allCategoriesTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#55555C] mt-1">
          {t('allCategoriesSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ALL_CATEGORIES.map((cat) => (
          <a
            key={cat.slug}
            href={`/search?cat=${cat.slug}`}
            className="bg-white rounded-3xl border border-[#E3E2E3] p-6 shadow-card hover:border-[#191923] hover:shadow-float transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F5F3F5] text-[#191923] flex items-center justify-center mb-4 group-hover:bg-[#191923] group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h2 className="text-lg font-bold text-[#191923] mb-1">
                {cat.name}
              </h2>
              <p className="text-xs text-[#55555C] leading-relaxed mb-4">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EFEDEF]">
              <span className="text-[11px] text-[#848389] block mb-1.5">{t('popularSearches')}</span>
              <div className="flex flex-wrap gap-1.5">
                {cat.exampleQueries.map((q, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#FAFAF8] text-[#55555C] text-[10px] rounded-md border border-[#E3E2E3]/60"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

