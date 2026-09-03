import React, { useState, useEffect } from 'react';
import { 
  Home, Users, ClipboardList, User, Sparkles, MapPin, 
  Plus, ChevronDown, Wrench, ShieldCheck, Briefcase, Car, Search, ArrowLeft
} from 'lucide-react';
import { MobileHomeTab } from './MobileHomeTab';
import { MobileTechniciansTab } from './MobileTechniciansTab';
import { MobileOrdersTab } from './MobileOrdersTab';
import { MobileMyPageTab } from './MobileMyPageTab';
import { MobileQuickBookingSheet } from './MobileQuickBookingSheet';
import { TechnicianRegisterModal } from '../TechnicianRegisterModal';
import { PartnerPortal } from '../../pages/PartnerPortal';

export const MobileApp = ({ 
  technicians, 
  matchRequests, 
  onRefreshData,
  onOpenCustomerAuth
}) => {
  // Mobile Portal Switcher: 'customer' | 'partner'
  const [mobilePortalMode, setMobilePortalMode] = useState(() => {
    return window.location.hash.includes('partner') ? 'partner' : 'customer';
  });
  const [mobileTab, setMobileTab] = useState('home'); // 'home' | 'technicians' | 'orders' | 'mypage'
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [selectedTechForBooking, setSelectedTechForBooking] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('인천 서구 청라동');

  // Hash listener for direct #partner link on mobile
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'partner' || hash === 'pro' || hash === 'technician' || hash === 'market') {
        setMobilePortalMode('partner');
      } else {
        setMobilePortalMode('customer');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSwitchToPartner = () => {
    setMobilePortalMode('partner');
    window.location.hash = 'partner';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToCustomer = () => {
    setMobilePortalMode('customer');
    window.location.hash = 'customer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingWithTech = (tech) => {
    setSelectedTechForBooking(tech);
    setIsQuickBookingOpen(true);
  };

  const handleLocationSwitch = () => {
    const locations = ['인천 서구 청라동', '인천 연수구 송도동', '서울 강남구 역삼동', '경기 성남시 분당구'];
    const nextIdx = (locations.indexOf(currentLocation) + 1) % locations.length;
    setCurrentLocation(locations[nextIdx]);
  };

  // ==================== [MODE 2] MOBILE PARTNER PORTAL VIEW ====================
  if (mobilePortalMode === 'partner') {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-slate-950 font-sans">
        <div className="w-full max-w-md min-h-screen bg-[#090d16] border-x border-white/5 relative flex flex-col shadow-2xl">
          
          {/* Mobile Top Bar to Return Back to Customer */}
          <div className="sticky top-0 z-50 bg-[#0a0f1d]/95 backdrop-blur-md border-b border-emerald-500/20 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-extrabold text-white text-xs block leading-tight">기사 파트너 모드</span>
                <span className="text-[10px] text-emerald-400 font-semibold">오더 수주 & 정산 관리</span>
              </div>
            </div>
            
            <button
              onClick={handleSwitchToCustomer}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1 transition-colors text-[11px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>고객 홈으로</span>
            </button>
          </div>

          <PartnerPortal
            matchRequests={matchRequests}
            technicians={technicians}
            onRefreshData={onRefreshData}
            onSwitchToCustomer={handleSwitchToCustomer}
          />
        </div>
      </div>
    );
  }

  // ==================== [MODE 1] MOBILE CUSTOMER PORTAL VIEW ====================
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex justify-center selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Mobile App Frame */}
      <div className="w-full max-w-md min-h-screen bg-[#090d16] border-x border-white/5 relative flex flex-col shadow-2xl pb-16">
        
        {/* Sticky Top App Header (100% Clean Customer View) */}
        <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
          
          {/* Location Selector */}
          <button
            onClick={handleLocationSwitch}
            className="flex items-center gap-1.5 text-xs font-black text-white hover:text-cyan-400 transition-colors py-1.5 px-3 rounded-xl bg-slate-900/90 border border-white/10 shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentLocation}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Right: Brand Title / Logo Tag (Clean & Professional) */}
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-wider text-white">LUMEN</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              PRO MATCH
            </span>
          </div>

        </header>

        {/* Dynamic Tab Body Content */}
        <main className="flex-grow">
          {mobileTab === 'home' && (
            <MobileHomeTab
              currentLocation={currentLocation}
              onLocationChange={handleLocationSwitch}
              technicians={technicians}
              matchRequests={matchRequests}
              onOpenQuickBooking={() => {
                setSelectedTechForBooking(null);
                setIsQuickBookingOpen(true);
              }}
              onGoToTechnicians={() => setMobileTab('technicians')}
              onGoToOrders={() => setMobileTab('orders')}
            />
          )}

          {mobileTab === 'technicians' && (
            <MobileTechniciansTab
              technicians={technicians}
              onSelectTechForBooking={handleOpenBookingWithTech}
            />
          )}

          {mobileTab === 'orders' && (
            <MobileOrdersTab
              matchRequests={matchRequests}
              onRefresh={onRefreshData}
            />
          )}

          {mobileTab === 'mypage' && (
            <MobileMyPageTab
              onOpenRegisterModal={() => setIsRegisterOpen(true)}
              onSwitchToPartner={handleSwitchToPartner}
              onOpenCustomerAuth={onOpenCustomerAuth}
            />
          )}
        </main>

        {/* Floating Center Order Button (FAB) */}
        <div className="fixed bottom-20 right-6 sm:right-auto sm:left-1/2 sm:translate-x-28 z-40">
          <button
            onClick={() => {
              setSelectedTechForBooking(null);
              setIsQuickBookingOpen(true);
            }}
            className="w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-xl shadow-cyan-500/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
            title="간편 시공 의뢰"
          >
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Baemin-style Fixed Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 flex justify-center">
          <div className="w-full max-w-md grid grid-cols-4 py-2 px-1 text-[10px] font-bold">
            
            {/* Tab 1: Home */}
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                mobileTab === 'home' ? 'text-cyan-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${mobileTab === 'home' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>홈</span>
            </button>

            {/* Tab 2: Technicians */}
            <button
              onClick={() => setMobileTab('technicians')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                mobileTab === 'technicians' ? 'text-cyan-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className={`w-5 h-5 mb-0.5 ${mobileTab === 'technicians' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>기사찾기</span>
            </button>

            {/* Tab 3: Orders */}
            <button
              onClick={() => setMobileTab('orders')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                mobileTab === 'orders' ? 'text-cyan-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className={`w-5 h-5 mb-0.5 ${mobileTab === 'orders' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>주문내역</span>
            </button>

            {/* Tab 4: My Page */}
            <button
              onClick={() => setMobileTab('mypage')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                mobileTab === 'mypage' ? 'text-cyan-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className={`w-5 h-5 mb-0.5 ${mobileTab === 'mypage' ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>MY</span>
            </button>

          </div>
        </nav>

        {/* 3-Step Instant Quick Booking Sheet */}
        <MobileQuickBookingSheet
          isOpen={isQuickBookingOpen}
          onClose={() => setIsQuickBookingOpen(false)}
          technicians={technicians}
          selectedTech={selectedTechForBooking}
          currentLocation={currentLocation}
          onBookingCreated={() => {
            if (onRefreshData) onRefreshData();
            setMobileTab('orders');
          }}
        />

        {/* Partner Registration Modal */}
        <TechnicianRegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegistered={() => {
            if (onRefreshData) onRefreshData();
          }}
        />

      </div>
    </div>
  );
};
export default MobileApp;
