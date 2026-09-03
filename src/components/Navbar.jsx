import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Phone, ShieldCheck, Menu, X, CreditCard, 
  LayoutDashboard, Calendar, Search, Briefcase, UserCheck,
  Smartphone, ChevronRight, Layers, Tag, Award, Car
} from 'lucide-react';
import { PortalSwitcher } from './PortalSwitcher';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenTracker, 
  onOpenRegisterModal,
  onSwitchToMobileApp,
  portalMode = 'customer',
  onSelectPortal,
  loggedInCustomer,
  onOpenCustomerAuth,
  onCustomerLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab, targetSectionId = null) => {
    setMobileMenuOpen(false);
    setCurrentTab(tab);
    if (targetSectionId) {
      setTimeout(() => {
        const el = document.getElementById(targetSectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#07090e]/95 backdrop-blur-md border-b border-white/10 shadow-2xl' 
        : 'bg-[#07090e]/80 backdrop-blur-sm border-b border-white/5'
    }`}>
      
      {/* ==================== 1행 (TOP ROW): Brand Logo & Portal Switcher & Actions ==================== */}
      <div className="border-b border-white/5 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-wider text-white font-sans">LUMEN</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">PRO MATCH</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">출장 디테일링 전문가 중개 플랫폼</p>
            </div>
          </div>

          {/* 3-Portal Switcher Hub (Desktop Center/Right) */}
          <div className="hidden md:flex items-center gap-2.5">
            <PortalSwitcher 
              currentPortal={portalMode} 
              onSelectPortal={(portal) => {
                if (onSelectPortal) onSelectPortal(portal);
              }} 
            />
          </div>

          {/* Top Right Action Buttons Group (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            
            {/* Customer Auth Button / User Badge */}
            {loggedInCustomer ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 py-1 px-2.5 rounded-xl border border-cyan-500/30 text-xs">
                <span className="font-bold text-cyan-300">{loggedInCustomer.name} 님</span>
                <button
                  onClick={onCustomerLogout}
                  className="text-[10px] text-slate-400 hover:text-rose-400 font-semibold underline ml-1"
                  title="고객 로그아웃 (자동로그인 해제)"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenCustomerAuth}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-white/10 flex items-center gap-1.5 transition-all"
              >
                <span>고객 로그인</span>
              </button>
            )}

            {/* Track Quotes */}
            <button
              onClick={onOpenTracker}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-white/10 flex items-center gap-1.5 transition-all"
              title="내 의뢰 견적 비교 및 진행상황"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>내 의뢰 조회</span>
            </button>

            {/* Main CTA */}
            <button
              onClick={() => handleNavClick('landing', 'booking')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all ml-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>스마트 견적 의뢰</span>
            </button>
          </div>

          {/* Mobile menu toggle & quick booking button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('landing', 'booking')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-extrabold"
            >
              견적의뢰
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ==================== 2행 (BOTTOM ROW): Navigation Menu Links ==================== */}
      <div className="hidden lg:block py-1.5 bg-[#090d16]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold text-slate-300">
          
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => handleNavClick('landing')} 
              className={`py-1 hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${
                currentTab === 'landing' ? 'text-cyan-400 font-extrabold border-b-2 border-cyan-400' : ''
              }`}
            >
              <span>홈 & 서비스 안내</span>
            </button>
            
            <button 
              onClick={() => handleNavClick('technicians')} 
              className={`py-1 hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${
                currentTab === 'technicians' ? 'text-cyan-400 font-extrabold border-b-2 border-cyan-400' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>전문가 찾기 (1급 디테일러)</span>
            </button>

            <button 
              onClick={() => handleNavClick('orderMarket')} 
              className={`py-1 hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${
                currentTab === 'orderMarket' ? 'text-emerald-400 font-extrabold border-b-2 border-emerald-400' : ''
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>오더 마켓 <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">기사용 일감</span></span>
            </button>

            <button 
              onClick={() => handleNavClick('landing', 'pricing')} 
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              표준 가격표 & 출장비
            </button>

            <button 
              onClick={() => handleNavClick('landing', 'before-after')} 
              className="py-1 hover:text-cyan-400 transition-colors"
            >
              시공 전후 갤러리
            </button>
          </nav>

          {/* Quick Trust Tagline */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-normal">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              과다청구 0원 표준정찰제 보증
            </span>
            <span>•</span>
            <span className="text-cyan-300 font-semibold">
              📍 최단거리 기사 1순위 자동 매칭
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c101a] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <button 
            onClick={() => handleNavClick('landing')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            홈 & 서비스 안내
          </button>
          <button 
            onClick={() => handleNavClick('technicians')} 
            className="block w-full text-left py-2 text-sm text-cyan-300 font-bold"
          >
            👨‍🔧 전문가 찾기 (디테일러 목록)
          </button>
          <button 
            onClick={() => handleNavClick('orderMarket')} 
            className="block w-full text-left py-2 text-sm text-emerald-400 font-bold"
          >
            📋 오더 마켓 (기사용 실시간 일감)
          </button>
          <button 
            onClick={() => handleNavClick('landing', 'pricing')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            가격표 & 권역별 출장비
          </button>
          <button 
            onClick={() => handleNavClick('landing', 'before-after')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            시공 전후 갤러리
          </button>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {onSwitchToMobileApp && (
              <button
                onClick={() => { setMobileMenuOpen(false); onSwitchToMobileApp(); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md"
              >
                <Smartphone className="w-4 h-4 text-slate-950" />
                <span>모바일 앱 버전 실행</span>
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 border border-cyan-500/30"
            >
              <Search className="w-4 h-4" />
              내 견적 의뢰 현황 조회
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRegisterModal(); }}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              기사 파트너 지원하기
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
