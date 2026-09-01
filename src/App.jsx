import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BusinessCardMaker } from './pages/BusinessCardMaker';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { isAdminAuthenticated, setAdminAuthenticated } from './utils/storage';

export function App() {
  const [currentTab, setCurrentTab] = useState('landing'); // 'landing' | 'admin' | 'cardMaker'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  // 브라우저 해시 또는 히스토리 감지 (선택적)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin' || hash === 'card-maker') {
        const target = hash === 'card-maker' ? 'cardMaker' : 'admin';
        if (isAdminAuthenticated()) {
          setCurrentTab(target);
        } else {
          setPendingTab(target);
          setIsAuthModalOpen(true);
        }
      } else {
        setCurrentTab('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab) => {
    if (tab === 'admin' || tab === 'cardMaker') {
      if (isAdminAuthenticated()) {
        setCurrentTab(tab);
        window.location.hash = tab === 'cardMaker' ? 'card-maker' : 'admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPendingTab(tab);
        setIsAuthModalOpen(true);
      }
      return;
    }

    setCurrentTab(tab);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    const target = pendingTab || 'admin';
    setCurrentTab(target);
    window.location.hash = target === 'cardMaker' ? 'card-maker' : 'admin';
    setPendingTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
    setPendingTab(null);
    if (currentTab === 'admin' || currentTab === 'cardMaker') {
      setCurrentTab('landing');
      window.location.hash = '';
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setCurrentTab('landing');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      
      {/* Universal Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange} 
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'landing' && <LandingPage />}
        {currentTab === 'admin' && (
          <AdminDashboard 
            onBackToLanding={() => handleTabChange('landing')} 
            onOpenCardMaker={() => handleTabChange('cardMaker')}
            onLogout={handleAdminLogout}
          />
        )}
        {currentTab === 'cardMaker' && (
          <BusinessCardMaker onBackToAdmin={() => handleTabChange('admin')} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer setCurrentTab={handleTabChange} />

      {/* Admin Password Authentication Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onSuccess={handleAuthSuccess}
        onClose={handleAuthClose}
      />

    </div>
  );
}

export default App;
