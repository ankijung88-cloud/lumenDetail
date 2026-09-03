import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { PartnerPortal } from './pages/PartnerPortal';
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
  // 3-Portal Mode State: 'customer' | 'partner' | 'admin' | 'cardMaker' | 'card'
  const [portalMode, setPortalMode] = useState('customer');
  const [customerSubTab, setCustomerSubTab] = useState('landing'); // 'landing' | 'technicians'
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingPortal, setPendingPortal] = useState(null);

  // Mobile App View Mode State (Auto-enabled on mobile screen or user preference for customer portal)
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

  // Browser hash routing sync for 3 Portals
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // 1. Partner Portal Routing (#partner, #pro, #technician, #market)
      if (hash === 'partner' || hash === 'pro' || hash === 'technician' || hash === 'market' || hash === 'orders') {
        setPortalMode('partner');
      } 
      // 2. Admin Portal Routing (#admin, #card-maker)
      else if (hash === 'admin' || hash === 'card-maker') {
        const target = hash === 'card-maker' ? 'cardMaker' : 'admin';
        if (isAdminAuthenticated()) {
          setPortalMode(target);
        } else {
          setPendingPortal(target);
          setIsAuthModalOpen(true);
        }
      } 
      // 3. Digital Card Routing
      else if (hash === 'card' || hash === 'mycard' || hash === 'mobile-card') {
        setPortalMode('card');
      } 
      // 4. Mobile App view shortcut
      else if (hash === 'mobile' || hash === 'app') {
        setPortalMode('customer');
        setIsMobileAppMode(true);
      } 
      // 5. Customer Portal Sub-routes
      else if (hash === 'technicians' || hash === 'pros') {
        setPortalMode('customer');
        setCustomerSubTab('technicians');
      } 
      // 6. Default Customer Portal
      else {
        setPortalMode('customer');
        setCustomerSubTab('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Portal Switcher Handler
  const handleSelectPortal = (targetPortal) => {
    if (targetPortal === 'admin' || targetPortal === 'cardMaker') {
      if (isAdminAuthenticated()) {
        setPortalMode(targetPortal);
        window.location.hash = targetPortal === 'cardMaker' ? 'card-maker' : 'admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setPendingPortal(targetPortal);
        setIsAuthModalOpen(true);
      }
      return;
    }

    if (targetPortal === 'partner') {
      setPortalMode('partner');
      window.location.hash = 'partner';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetPortal === 'card') {
      setPortalMode('card');
      window.location.hash = 'card';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default: Customer Portal
    setPortalMode('customer');
    setCustomerSubTab('landing');
    window.location.hash = 'customer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomerTabChange = (tab) => {
    if (tab === 'technicians') {
      setCustomerSubTab('technicians');
      window.location.hash = 'technicians';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tab === 'orderMarket') {
      handleSelectPortal('partner');
      return;
    }

    if (tab === 'admin') {
      handleSelectPortal('admin');
      return;
    }

    setCustomerSubTab('landing');
    window.location.hash = 'customer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    const target = pendingPortal || 'admin';
    setPortalMode(target);
    window.location.hash = target === 'cardMaker' ? 'card-maker' : 'admin';
    setPendingPortal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClose = () => {
    setIsAuthModalOpen(false);
    setPendingPortal(null);
    if (portalMode === 'admin' || portalMode === 'cardMaker') {
      setPortalMode('customer');
      window.location.hash = 'customer';
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setPortalMode('customer');
    window.location.hash = 'customer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestToTech = (tech) => {
    setTargetTech(tech);
    setPortalMode('customer');
    setCustomerSubTab('landing');
    setTimeout(() => {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ==================== [PORTAL 2] PARTNER / TECHNICIAN PORTAL ====================
  if (portalMode === 'partner') {
    return (
      <>
        <PartnerPortal
          matchRequests={matchRequests}
          technicians={technicians}
          onRefreshData={refreshData}
          onSwitchToCustomer={() => handleSelectPortal('customer')}
          onGoToAdmin={() => handleSelectPortal('admin')}
        />
        <AdminAuthModal
          isOpen={isAuthModalOpen}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // ==================== [PORTAL 3] ADMIN CONSOLE PORTAL ====================
  if (portalMode === 'admin') {
    return (
      <>
        <AdminDashboard 
          onBackToLanding={() => handleSelectPortal('customer')} 
          onOpenCardMaker={() => handleSelectPortal('cardMaker')}
          onLogout={handleAdminLogout}
        />
        <AdminAuthModal
          isOpen={isAuthModalOpen}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (portalMode === 'cardMaker') {
    return (
      <BusinessCardMaker onBackToAdmin={() => handleSelectPortal('admin')} />
    );
  }

  if (portalMode === 'card') {
    return (
      <DigitalBusinessCard onGoToBooking={() => handleSelectPortal('customer')} />
    );
  }

  // ==================== [PORTAL 1] CUSTOMER PORTAL (MOBILE APP MODE) ====================
  if (isMobileAppMode && portalMode === 'customer') {
    return (
      <MobileApp
        technicians={technicians}
        matchRequests={matchRequests}
        onRefreshData={refreshData}
        onSwitchToWeb={() => handleToggleMobileAppMode(false)}
        onGoToAdmin={() => handleSelectPortal('admin')}
      />
    );
  }

  // ==================== [PORTAL 1] CUSTOMER PORTAL (DESKTOP WEB) ====================
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Universal 2-Row Top Navigation with 3-Portal Switcher Hub */}
      <Navbar 
        currentTab={customerSubTab} 
        setCurrentTab={handleCustomerTabChange}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onSwitchToMobileApp={() => handleToggleMobileAppMode(true)}
        portalMode="customer"
        onSelectPortal={handleSelectPortal}
      />

      {/* Customer Main Content */}
      <main className="flex-grow">
        {customerSubTab === 'landing' && (
          <LandingPage 
            technicians={technicians}
            targetTech={targetTech}
            onClearTargetTech={() => setTargetTech(null)}
            onRequestToTech={handleRequestToTech}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onGoToTechnicians={() => handleCustomerTabChange('technicians')}
            onGoToOrderMarket={() => handleSelectPortal('partner')}
            onSwitchToMobileApp={() => handleToggleMobileAppMode(true)}
          />
        )}

        {customerSubTab === 'technicians' && (
          <div className="pt-24">
            <TechnicianExplorer 
              technicians={technicians}
              onRequestToTech={handleRequestToTech}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Universal Footer */}
      <Footer 
        setCurrentTab={handleCustomerTabChange} 
        onSelectPortal={handleSelectPortal}
      />

      {/* Modals */}
      <TechnicianRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegistered={() => refreshData()}
      />

      <MatchTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        matchRequests={matchRequests}
        onBidAccepted={refreshData}
      />

      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;
