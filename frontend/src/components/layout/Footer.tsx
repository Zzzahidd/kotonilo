import React from 'react';
import { useLanguageStore } from '../../context/languageStore';

export const Footer: React.FC = () => {
  const { t } = useLanguageStore();

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-[#E3E2E3] py-4 sm:py-5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center gap-2.5 text-[#848389]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="font-brand text-xl text-[#191923] tracking-tight hover:opacity-90 transition-opacity"
          >
            কত নিলো?
          </a>
          <span className="text-[#E3E2E3]">•</span>
          <span className="text-[11px] sm:text-xs">
            © {new Date().getFullYear()} {t('copyright')}
          </span>
        </div>

        {/* Right: Quick Links */}
        <nav className="flex items-center gap-5 text-xs text-[#55555C]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="hover:text-[#191923] transition-colors"
          >
            {t('home')}
          </a>
          <a
            href="/categories"
            onClick={(e) => {
              e.preventDefault();
              navigate('/categories');
            }}
            className="hover:text-[#191923] transition-colors"
          >
            {t('categories')}
          </a>
          <a
            href="/search"
            onClick={(e) => {
              e.preventDefault();
              navigate('/search');
            }}
            className="hover:text-[#191923] transition-colors"
          >
            {t('priceList')}
          </a>
          <a
            href="/my-reports"
            onClick={(e) => {
              e.preventDefault();
              navigate('/my-reports');
            }}
            className="hover:text-[#191923] transition-colors"
          >
            {t('myReports')}
          </a>
        </nav>
      </div>
    </footer>
  );
};

