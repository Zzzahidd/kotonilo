import React, { useState, useRef } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { useLanguageStore } from '../../context/languageStore';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onSearchSubmit: () => void;
  autoFocus?: boolean;
  onFocus?: () => void;
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
  "Cox's Bazar",
  'Rajshahi',
  'Khulna',
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  onSearchSubmit,
  autoFocus = false,
  onFocus,
}) => {
  const { t, language } = useLanguageStore();
  const [locDropdownOpen, setLocDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const locations = language === 'bn' ? LOCATIONS_BN : LOCATIONS_EN;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleClear = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-2">
      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white rounded-2xl border transition-all duration-200 p-2 shadow-sm flex flex-col sm:flex-row items-center gap-2 ${
          isFocused
            ? 'border-[#191923] ring-4 ring-[#191923]/5 shadow-md'
            : 'border-[#E3E2E3] hover:border-[#848389]/50'
        }`}
      >
        {/* Left: Search input */}
        <div className="relative flex-1 flex items-center w-full px-3 py-1.5">
          <Search className={`w-4.5 h-4.5 mr-3 shrink-0 transition-colors ${isFocused ? 'text-[#191923]' : 'text-[#848389]'}`} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            autoFocus={autoFocus}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
            }}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-transparent text-sm sm:text-base text-[#191923] placeholder-[#848389] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-[#848389] hover:text-[#191923] hover:bg-[#F5F3F5] transition-colors shrink-0 ml-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Middle: Location Dropdown */}
        <div className="relative w-full sm:w-auto sm:min-w-[190px] border-t sm:border-t-0 sm:border-l border-[#EFEDEF] px-3 py-1.5 sm:py-0">
          <button
            type="button"
            onClick={() => setLocDropdownOpen(!locDropdownOpen)}
            className="w-full flex items-center justify-between text-xs sm:text-sm text-[#191923] font-medium py-1.5 px-1 hover:text-[#55555C] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#848389] shrink-0" />
              {selectedLocation || t('allBangladesh')}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#848389] ml-1.5 shrink-0 transition-transform duration-200 ${locDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {locDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setLocDropdownOpen(false)}
              />
              <div className="absolute left-0 sm:right-0 top-full mt-2 w-full sm:w-56 bg-white rounded-2xl shadow-xl border border-[#E3E2E3] py-2 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                {locations.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      onLocationChange(loc);
                      setLocDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                      selectedLocation === loc
                        ? 'bg-[#191923] font-semibold text-white'
                        : 'text-[#55555C] hover:bg-[#FAFAF8] hover:text-[#191923]'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Submit Button */}
        <div className="w-full sm:w-auto shrink-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#191923] hover:bg-[#2A2A35] active:scale-98 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t('search')}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
