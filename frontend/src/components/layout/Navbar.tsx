import React, { useState, useEffect } from 'react';
import { Search, Plus, User as UserIcon, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { useLanguageStore } from '../../context/languageStore';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenSearchModal?: () => void;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, onOpenSearchModal }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuthStore();
  const { t } = useLanguageStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHomeActive = currentPath === '/';
  const isCategoriesActive = currentPath === '/categories';
  const isPriceListActive = currentPath === '/search';

  return (
    <header className="w-full bg-[#F5F3F5] sticky top-0 z-40 border-b border-[#E3E2E3]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo + Desktop Nav Links */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="flex items-center gap-2 group transition-transform active:scale-95 select-none shrink-0"
          >
            <span className="font-brand text-2xl sm:text-3xl font-normal text-[#191923] tracking-tight whitespace-nowrap">
              কত নিলো?
            </span>
          </a>

          {/* Desktop Navigation Links (md+ screen sizes) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 shrink-0">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className={`text-xs sm:text-sm py-1 transition-all whitespace-nowrap ${
                isHomeActive
                  ? 'font-semibold text-[#191923] border-b-2 border-[#191923]'
                  : 'font-medium text-[#55555C] hover:text-[#191923] border-b-2 border-transparent'
              }`}
            >
              {t('home')}
            </a>
            <a
              href="/categories"
              onClick={(e) => {
                e.preventDefault();
                navigate('/categories');
              }}
              className={`text-xs sm:text-sm py-1 transition-all whitespace-nowrap ${
                isCategoriesActive
                  ? 'font-semibold text-[#191923] border-b-2 border-[#191923]'
                  : 'font-medium text-[#55555C] hover:text-[#191923] border-b-2 border-transparent'
              }`}
            >
              {t('categories')}
            </a>
            <a
              href="/search"
              onClick={(e) => {
                e.preventDefault();
                navigate('/search');
              }}
              className={`text-xs sm:text-sm py-1 transition-all whitespace-nowrap ${
                isPriceListActive
                  ? 'font-semibold text-[#191923] border-b-2 border-[#191923]'
                  : 'font-medium text-[#55555C] hover:text-[#191923] border-b-2 border-transparent'
              }`}
            >
              {t('priceList')}
            </a>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher (Desktop) */}
          <div className="hidden sm:flex items-center">
            <LanguageSwitcher />
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => {
              if (onOpenSearchModal) onOpenSearchModal();
              else navigate('/search');
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#191923] hover:bg-black/5 active:scale-95 transition-colors cursor-pointer"
            title={t('search')}
            aria-label={t('search')}
          >
            <Search className="w-4 h-4 text-[#191923]" />
          </button>

          {/* User Profile / Login (Desktop only) */}
          {isAuthenticated && user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#E3E2E3] hover:border-[#191923] transition-all text-xs font-medium text-[#191923] cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#191923] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.displayName ? user.displayName[0] : 'U'}
                </div>
                <span className="max-w-[90px] truncate text-xs">{user.displayName}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E3E2E3] py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-[#EFEDEF]">
                    <p className="text-xs font-semibold text-[#191923] truncate">{user.displayName}</p>
                    <p className="text-[10px] text-[#848389]">@{user.username}</p>
                  </div>

                  <a
                    href="/my-reports"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/my-reports');
                    }}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#191923] hover:bg-[#F0EFF0] transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5" /> {t('myReports')}
                  </a>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-[#D94A45] hover:bg-[#FDEEEE] transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="text-xs font-medium text-[#55555C] hover:text-[#191923] px-2.5 py-1.5 rounded-lg transition-colors hidden md:inline-block cursor-pointer"
            >
              {t('login')}
            </button>
          )}

          {/* Primary CTA (Tablet & Desktop: text button, Mobile: icon button) */}
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#191923] hover:bg-[#2A2A35] active:scale-98 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-[6px] shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="whitespace-nowrap hidden lg:inline">{t('sharePrice')}</span>
            <span className="whitespace-nowrap lg:hidden">{t('sharePriceShort')}</span>
          </button>

          {/* Mobile-only CTA Icon Button */}
          <button
            onClick={onOpenAddModal}
            className="sm:hidden w-9 h-9 rounded-full bg-[#191923] hover:bg-[#2A2A35] active:scale-95 text-white flex items-center justify-center shadow-sm transition-all cursor-pointer"
            aria-label={t('sharePriceShort')}
            title={t('sharePriceShort')}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#191923] hover:bg-black/5 active:scale-95 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer & Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Drawer Sheet */}
          <div className="md:hidden fixed top-16 right-0 left-0 bg-white border-b border-[#E3E2E3] shadow-xl z-50 px-5 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Top row in drawer: Language Switcher */}
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#EFEDEF]">
              <LanguageSwitcher />
            </div>

            {/* Full-width CTA inside drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAddModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#191923] hover:bg-[#2A2A35] active:scale-98 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('sharePrice')}</span>
            </button>

            {/* Navigation links */}
            <nav className="space-y-1">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isHomeActive
                    ? 'bg-[#191923] text-white'
                    : 'text-[#55555C] hover:text-[#191923] hover:bg-[#F0EFF0]'
                }`}
              >
                <span>{t('home')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isHomeActive ? 'text-white' : 'text-[#848389]'}`} />
              </a>
              <a
                href="/categories"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/categories');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isCategoriesActive
                    ? 'bg-[#191923] text-white'
                    : 'text-[#55555C] hover:text-[#191923] hover:bg-[#F0EFF0]'
                }`}
              >
                <span>{t('categories')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isCategoriesActive ? 'text-white' : 'text-[#848389]'}`} />
              </a>
              <a
                href="/search"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/search');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isPriceListActive
                    ? 'bg-[#191923] text-white'
                    : 'text-[#55555C] hover:text-[#191923] hover:bg-[#F0EFF0]'
                }`}
              >
                <span>{t('priceList')}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isPriceListActive ? 'text-white' : 'text-[#848389]'}`} />
              </a>
              {isAuthenticated && (
                <a
                  href="/my-reports"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/my-reports');
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    currentPath === '/my-reports'
                      ? 'bg-[#191923] text-white'
                      : 'text-[#55555C] hover:text-[#191923] hover:bg-[#F0EFF0]'
                  }`}
                >
                  <span>{t('myReports')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${currentPath === '/my-reports' ? 'text-white' : 'text-[#848389]'}`} />
                </a>
              )}
            </nav>

            {/* Auth section */}
            <div className="pt-3 border-t border-[#EFEDEF]">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-[#F5F3F5] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#191923] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {user.displayName ? user.displayName[0] : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#191923] truncate">{user.displayName}</p>
                      <p className="text-[10px] text-[#848389]">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-[#D94A45] hover:bg-[#FDEEEE] rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full text-xs"
                  >
                    {t('login')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('anonymous');
                    }}
                    className="w-full text-xs"
                  >
                    {t('anonymousAccount')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

