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
  ArrowRight,
} from 'lucide-react';
import { useLanguageStore } from '../../context/languageStore';
import { TranslationKey } from '../../i18n/translations';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

interface CategoryItem {
  slug: string;
  transKey: TranslationKey;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryItem[] = [
  { slug: 'phone', transKey: 'cat_phone', icon: <Smartphone className="w-5 h-5" /> },
  { slug: 'laptop', transKey: 'cat_laptop', icon: <Laptop className="w-5 h-5" /> },
  { slug: 'gadget', transKey: 'cat_gadget', icon: <Box className="w-5 h-5" /> },
  { slug: 'watch', transKey: 'cat_watch', icon: <Watch className="w-5 h-5" /> },
  { slug: 'bike', transKey: 'cat_bike', icon: <Bike className="w-5 h-5" /> },
  { slug: 'furniture', transKey: 'cat_furniture', icon: <Armchair className="w-5 h-5" /> },
  { slug: 'food', transKey: 'cat_food', icon: <UtensilsCrossed className="w-5 h-5" /> },
  { slug: 'transport', transKey: 'cat_transport', icon: <Bus className="w-5 h-5" /> },
  { slug: 'services', transKey: 'cat_services', icon: <Settings className="w-5 h-5" /> },
];

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useLanguageStore();

  return (
    <section id="categories" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
      <div className="bg-white rounded-2xl border border-[#E3E2E3] p-4 sm:p-5 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#191923]">
              {t('popularCategories')}
            </h2>
            <p className="text-xs text-[#55555C] mt-0.5">
              {t('popularCategoriesSubtitle')}
            </p>
          </div>
          <a
            href="/categories"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#191923] hover:text-[#55555C] transition-colors group self-start sm:self-auto"
          >
            {t('viewAllCategories')}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 sm:gap-2.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat.slug)}
                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all duration-150 cursor-pointer text-center group active:scale-95 ${
                  isSelected
                    ? 'bg-[#191923] border-[#191923] text-white shadow-sm'
                    : 'bg-white hover:bg-[#F5F3F5] border-[#E3E2E3]/80 text-[#191923]'
                }`}
              >
                <div
                  className={`mb-1.5 transition-transform group-hover:scale-105 ${
                    isSelected ? 'text-white' : 'text-[#55555C]'
                  }`}
                >
                  {cat.icon}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-medium leading-tight ${
                    isSelected ? 'text-white' : 'text-[#191923]'
                  }`}
                >
                  {t(cat.transKey)}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
