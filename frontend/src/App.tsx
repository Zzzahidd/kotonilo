import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SearchResultPage } from './pages/SearchResultPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { AuthModal } from './components/auth/AuthModal';
import { AddPriceModal } from './components/post-wizard/AddPriceModal';
import { useAuthStore } from './context/authStore';
import { navigate } from './utils/navigation';

const queryClient = new QueryClient();

// Google Client ID from backend .env
const GOOGLE_CLIENT_ID = '657635095567-eat65278d28v24ld1ifec2deapbpq836.apps.googleusercontent.com';

export function App() {
  const { initAuth } = useAuthStore();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [addModalOpen, setAddModalOpen] = useState(false);

  useEffect(() => {
    initAuth();

    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // Global click listener to intercept internal link clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (
        target &&
        target.href &&
        target.origin === window.location.origin &&
        !target.hasAttribute('download') &&
        target.target !== '_blank' &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const path = target.pathname + target.search;
        e.preventDefault();
        navigate(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const renderPage = () => {
    if (currentPath.startsWith('/search')) {
      return <SearchResultPage />;
    }
    if (currentPath.startsWith('/categories')) {
      return <CategoriesPage />;
    }
    if (currentPath.startsWith('/my-reports')) {
      return <MyReportsPage />;
    }
    return <HomePage />;
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen bg-[#F5F3F5] text-[#191923]">
          {/* Header Navbar */}
          <Navbar
            onOpenAddModal={() => setAddModalOpen(true)}
            onOpenSearchModal={() => {
              navigate('/search');
            }}
          />

          {/* Main Page View */}
          <main className="flex-1">
            {renderPage()}
          </main>

          {/* Global Modals */}
          <AuthModal />
          <AddPriceModal
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSuccess={() => {
              // Refresh query cache and stay on current page seamlessly
              queryClient.invalidateQueries();
            }}
          />

          {/* Footer */}
          <Footer />
        </div>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
export default App;
