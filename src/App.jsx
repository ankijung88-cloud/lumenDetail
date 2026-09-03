import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BusinessCardMaker } from './pages/BusinessCardMaker';
import { DigitalBusinessCard } from './pages/DigitalBusinessCard';
import { TechnicianExplorer } from './components/TechnicianExplorer';
import { OrderMarket } from './components/OrderMarket';
import { TechnicianRegisterModal } from './components/TechnicianRegisterModal';
import { MatchTrackerModal } from './components/MatchTrackerModal';
import { Footer } from './components/Footer';
import { AdminAuthModal } from './components/AdminAuthModal';
import { MobileApp } from './components/mobile/MobileApp';
import { 
  isAdminAuthenticated, setAdminAuthenticated, 
  getTechnicians, getMatchRequests 
} from './utils/storage';
import { Smartphone } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState('landing'); // 'landing' | 'technicians' | 'orderMarket' | 'admin' | 'cardMaker' | 'card'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  // Mobile App View Mode State (Auto-enabled on mobile screen or user preference)
  const [isMobileAppMode, setIsMobileAppMode] = useState(() => {
    const saved = localStorage.getItem('lumen_view_mode');
    if (saved) return saved === 'mobile';
    return window.innerWidth <= 768;
  });

  // Platform Data States
  const [technicians, setTechnicians] = useState([]);
  const [matchRequests, setMatchRequests] = useState([]);

  // Modals & Target States
  const [targetTech, setTargetTech] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setTechnicians(getTechnicians());
    setMatchRequests(getMatchRequests());
  };

  const handleToggleMobileAppMode = (enableMobile) => {
    setIsMobileAppMode(enableMobile);
    localStorage.setItem('lumen_view_mode', enableMobile ? 'mobile' : 'web');
    if (enableMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser hash routing sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'mobile' || hash === 'app') {
        setIsMobileAppMode(true);
        localStorage.setItem('lumen_view_mode', 'mobile');
      } else if (hash === 'web' || hash === 'pc') {
        setIsMobileAppMode(false);
        localStorage.setItem('lumen_view_mode', 'web');
      } else if (hash === 'card' || hash === 'mycard' || hash === 'mobile-card') {
        setCurrentTab('card');
      } else if (hash === 'technicians' || hash === 'pros') {
        setCurrentTab('technicians');
      } else if (hash === 'orders' || hash === 'market') {
        setCurrentTab('orderMarket');
      } else if (hash === 'admin' || hash === 'card-maker') {
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
    if (tab === 'card') {
      setCurrentTab('card');
      window.location.hash = 'card';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'technicians') {
      setCurrentTab('technicians');
      window.location.hash = 'technicians';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'orderMarket') {
      setCurrentTab('orderMarket');
      window.location.hash = 'market';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

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

    setCurrentTab('landing');
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

  const handleRequestToTech = (tech) => {
    setTargetTech(tech);
    setCurrentTab('landing');
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // If Mobile App mode is active and not on admin pages, render dedicated mobile app
  if (isMobileAppMode && currentTab !== 'admin' && currentTab !== 'cardMaker') {
    return (
      <MobileApp
        technicians={technicians}
        matchRequests={matchRequests}
        onRefreshData={refreshData}
        onSwitchToWeb={() => handleToggleMobileAppMode(false)}
        onGoToAdmin={() => handleTabChange('admin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Universal Top Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onSwitchToMobileApp={() => handleToggleMobileAppMode(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentTab === 'landing' && (
          <LandingPage 
            technicians={technicians}
            targetTech={targetTech}
            onClearTargetTech={() => setTargetTech(null)}
            onRequestToTech={handleRequestToTech}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onGoToTechnicians={() => handleTabChange('technicians')}
            onGoToOrderMarket={() => handleTabChange('orderMarket')}
          />
        )}

        {currentTab === 'technicians' && (
          <div className="pt-16">
            <TechnicianExplorer 
              technicians={technicians}
              onRequestToTech={handleRequestToTech}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'orderMarket' && (
          <div className="pt-16">
            <OrderMarket 
              matchRequests={matchRequests}
              technicians={technicians}
              onBidSubmitted={refreshData}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          </div>
        )}

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

        {currentTab === 'card' && (
          <DigitalBusinessCard onGoToBooking={() => handleTabChange('landing')} />
        )}
      </main>

      {/* Desktop Floating Mobile App Switcher Badge */}
      <aside aria-label="모바일 앱 전환" className="fixed bottom-6 right-6 z-40 hidden md:block">
        <button
          onClick={() => handleToggleMobileAppMode(true)}
          className="p-3.5 pr-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border border-white/20"
          title="모바일 앱 화면으로 전환"
        >
          <Smartphone className="w-5 h-5 text-slate-950" />
          <span>모바일 앱 모드</span>
        </button>
      </aside>

      {/* Universal Footer */}
      <Footer setCurrentTab={handleTabChange} />

      {/* Partner Registration Modal */}
      <TechnicianRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegistered={(newTech) => {
          refreshData();
        }}
      />

      {/* Match & Quote Comparison Tracker Modal */}
      <MatchTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        matchRequests={matchRequests}
        onBidAccepted={refreshData}
      />

      {/* Admin Password Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onSuccess={handleAuthSuccess}
        onClose={handleAuthClose}
      />

    </div>
  );
}

export default App;
