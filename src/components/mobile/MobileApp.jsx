import React, { useState } from 'react';
import { 
  Home, Users, ClipboardList, User, Sparkles, MapPin, 
  Bell, Monitor, Plus, ChevronDown, Wrench, ShieldCheck
} from 'lucide-react';
import { MobileHomeTab } from './MobileHomeTab';
import { MobileTechniciansTab } from './MobileTechniciansTab';
import { MobileOrdersTab } from './MobileOrdersTab';
import { MobileMyPageTab } from './MobileMyPageTab';
import { MobileQuickBookingSheet } from './MobileQuickBookingSheet';
import { TechnicianRegisterModal } from '../TechnicianRegisterModal';

export const MobileApp = ({ 
  technicians, 
  matchRequests, 
  onRefreshData,
  onSwitchToWeb,
  onGoToAdmin 
}) => {
  const [mobileTab, setMobileTab] = useState('home'); // 'home' | 'technicians' | 'orders' | 'mypage'
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [selectedTechForBooking, setSelectedTechForBooking] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('인천 서구 청라동');

  const activeOrdersCount = matchRequests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED').length;

  const handleOpenBookingWithTech = (tech) => {
    setSelectedTechForBooking(tech);
    setIsQuickBookingOpen(true);
  };

  const handleLocationSwitch = () => {
    const locations = ['인천 서구 청라동', '인천 연수구 송도동', '서울 강남구 역삼동', '경기 성남시 분당구'];
    const nextIdx = (locations.indexOf(currentLocation) + 1) % locations.length;
    setCurrentLocation(locations[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex justify-center selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Mobile App Frame */}
      <div className="w-full max-w-md min-h-screen bg-[#090d16] border-x border-white/5 relative flex flex-col shadow-2xl">
        
        {/* Sticky Top App Header */}
        <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between">
          
          {/* Location Selector */}
          <button
            onClick={handleLocationSwitch}
            className="flex items-center gap-1.5 text-xs font-black text-white hover:text-cyan-400 transition-colors py-1 px-2 rounded-xl bg-slate-900/80 border border-white/5"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{currentLocation}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Right Header Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToWeb}
              className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-white/10 flex items-center gap-1 transition-colors"
              title="PC 웹 버전으로 보기"
            >
              <Monitor className="w-3 h-3 text-cyan-400" />
              <span>PC웹 모드</span>
            </button>
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
              onGoToAdmin={onGoToAdmin}
              onGoToWebMode={onSwitchToWeb}
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

            {/* Tab 3: Orders / Deliveries */}
            <button
              onClick={() => setMobileTab('orders')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all relative ${
                mobileTab === 'orders' ? 'text-cyan-400 font-black' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <ClipboardList className={`w-5 h-5 mb-0.5 ${mobileTab === 'orders' ? 'text-cyan-400' : 'text-slate-400'}`} />
                {activeOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center animate-pulse">
                    {activeOrdersCount}
                  </span>
                )}
              </div>
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

        {/* Quick Booking Bottom Sheet */}
        <MobileQuickBookingSheet
          isOpen={isQuickBookingOpen}
          onClose={() => {
            setIsQuickBookingOpen(false);
            setSelectedTechForBooking(null);
          }}
          preselectedTech={selectedTechForBooking}
          onBookingComplete={(newReq) => {
            if (onRefreshData) onRefreshData();
            setMobileTab('orders');
          }}
        />

        {/* Technician Partner Register Modal */}
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
