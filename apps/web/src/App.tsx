import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';
import AuthPage from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { InsightDetailPage } from './pages/InsightDetailPage';
import { InsightsPage } from './pages/InsightsPage';
import LandingPage from './pages/LandingPage';
import { UploadsPage } from './pages/UploadsPage';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('app');
      return;
    }

    if (currentPage === 'app') {
      setCurrentPage('landing');
    }
  }, [currentPage, isAuthenticated]);

  if (isLoading && currentPage !== 'auth') {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#5c8bf7] border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Restoring secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (currentPage === 'auth') {
      return <AuthPage setCurrentPage={setCurrentPage} authMode={authMode} setAuthMode={setAuthMode} />;
    }

    return <LandingPage setCurrentPage={setCurrentPage} setAuthMode={setAuthMode} isAuthenticated={false} />;
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/uploads" element={<UploadsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:id" element={<InsightDetailPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
