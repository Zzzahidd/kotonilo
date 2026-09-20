import React, { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useLanguageStore } from '../../context/languageStore';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onSearchSubmit: () => void;
}

const LOCATIONS_BN = [
  'সারা বাংলাদেশ',
  'ঢাকা',
  'মিরপুর, ঢাকা',
  'ধানমন্ডি, ঢাকা',
  'গুলশান, ঢাকা',
  'উত্তরা, ঢাকা',
  'বনানী, ঢাকা',
  'মোহাম্মদপুর, ঢাকা',
  'চট্টগ্রাম',
  'সিলেট',
  'কক্সবাজার',
  'রাজশাহী',
  'খুলনা',
];

const LOCATIONS_EN = [
  'All Bangladesh',
  'Dhaka',
  'Mirpur, Dhaka',
  'Dhanmondi, Dhaka',
  'Gulshan, Dhaka',
  'Uttara, Dhaka',
  'Banani, Dhaka',
  'Mohammadpur, Dhaka',
  'Chittagong',
  'Sylhet',
  'Cox\'s Bazar',
  'Rajshahi',
  'Khulna',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  onSearchSubmit,
}) => {
  const { t, language } = useLanguageStore();
  const [locDropdownOpen, setLocDropdownOpen] = useState(false);

  const locations = language === 'bn' ? LOCATIONS_BN : LOCATIONS_EN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-2">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-xl border border-[#E3E2E3] p-1.5 shadow-sm flex flex-col sm:flex-row items-center gap-1.5"
      >
        {/* Left: Search input */}
        <div className="relative flex-1 flex items-center w-full px-3 py-1">
          <Search className="w-4 h-4 text-[#848389] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-xs sm:text-sm text-[#191923] placeholder-[#848389] focus:outline-none"
          />
        </div>

        {/* Middle: Location Dropdown */}
        <div className="relative w-full sm:w-auto sm:min-w-[180px] border-t sm:border-t-0 sm:border-l border-[#EFEDEF] px-3 py-1 sm:py-0">
          <button
            type="button"
            onClick={() => setLocDropdownOpen(!locDropdownOpen)}
            className="w-full flex items-center justify-between text-xs sm:text-sm text-[#191923] font-medium py-1.5 px-1 hover:text-[#55555C] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#848389] shrink-0" />
              {selectedLocation || t('allBangladesh')}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#848389] ml-1.5 shrink-0" />
          </button>

          {locDropdownOpen && (
            <div className="absolute left-0 sm:right-0 top-full mt-2 w-full sm:w-52 bg-white rounded-xl shadow-lg border border-[#E3E2E3] py-1.5 z-50 max-h-56 overflow-y-auto">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    onLocationChange(loc);
                    setLocDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedLocation === loc
                      ? 'bg-[#F0EFF0] font-semibold text-[#191923]'
                      : 'text-[#55555C] hover:bg-[#FAFAF8] hover:text-[#191923]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Submit Button */}
        <div className="w-full sm:w-auto shrink-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#191923] hover:bg-[#2A2A35] active:scale-98 text-white text-xs sm:text-sm font-medium px-6 py-2 rounded-[6px] shadow-sm transition-all cursor-pointer"
          >
            {t('search')}
          </button>
        </div>
      </form>
    </section>
  );
};
