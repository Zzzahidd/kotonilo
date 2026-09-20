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
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    if (currentPath === '/search') {
      return <SearchResultPage />;
    }
    if (currentPath === '/categories') {
      return <CategoriesPage />;
    }
    if (currentPath === '/my-reports') {
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
              window.location.href = '/search';
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
            onSuccess={() => window.location.reload()}
          />

          {/* Footer */}
          <Footer />
        </div>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
export default App;
