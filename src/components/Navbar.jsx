import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Phone, ShieldCheck, Menu, X, CreditCard, 
  LayoutDashboard, Calendar, Search, Briefcase, UserCheck
} from 'lucide-react';

export const Navbar = ({ 
  currentTab, 
  setCurrentTab, 
  onOpenTracker, 
  onOpenRegisterModal,
  onSwitchToMobileApp 
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
      isScrolled ? 'bg-[#07090e]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white font-sans">LUMEN</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">PRO MATCH</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">출장 디테일링 전문가 중개 플랫폼</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button 
            onClick={() => handleNavClick('landing')} 
            className={`hover:text-cyan-400 transition-colors ${currentTab === 'landing' ? 'text-cyan-400 font-bold' : ''}`}
          >
            홈 & 서비스
          </button>
          
          <button 
            onClick={() => handleNavClick('technicians')} 
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1 ${currentTab === 'technicians' ? 'text-cyan-400 font-bold' : ''}`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>전문가 찾기</span>
          </button>

          <button 
            onClick={() => handleNavClick('orderMarket')} 
            className={`hover:text-cyan-400 transition-colors flex items-center gap-1 ${currentTab === 'orderMarket' ? 'text-emerald-400 font-bold' : ''}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>오더 마켓 <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">기사용</span></span>
          </button>

          <button 
            onClick={() => handleNavClick('landing', 'pricing')} 
            className="hover:text-cyan-400 transition-colors"
          >
            가격표
          </button>

          <button 
            onClick={() => handleNavClick('landing', 'before-after')} 
            className="hover:text-cyan-400 transition-colors"
          >
            시공 갤러리
          </button>
        </nav>

        {/* Action Buttons & Tabs */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Track Quotes / My Requests */}
          <button
            onClick={onOpenTracker}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 flex items-center gap-1.5 transition-all"
            title="내 의뢰 견적 비교 및 진행상황"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>내 의뢰 조회</span>
          </button>

          {/* Partner Registration */}
          <button
            onClick={onOpenRegisterModal}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 flex items-center gap-1.5 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>기사 파트너 등록</span>
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>관리자</span>
          </button>

          {/* Mobile App Mode Switcher */}
          <button
            onClick={onSwitchToMobileApp}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            title="배달의민족 스타일 전용 모바일 앱으로 전환"
          >
            <span>📱 모바일 앱 버전</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('landing', 'booking')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>스마트 견적 의뢰</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => handleNavClick('landing', 'booking')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-extrabold"
          >
            견적의뢰
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c101a] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 mt-3 animate-fadeIn">
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
            <button
              onClick={() => { setMobileMenuOpen(false); if (onSwitchToMobileApp) onSwitchToMobileApp(); }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md"
            >
              <span>📱 모바일 앱 버전 실행</span>
            </button>
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
            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-white/10"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              관리자 모드 (중개/오더관리)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
