import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, ShieldCheck, Menu, X, CreditCard, LayoutDashboard, Calendar } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (currentTab !== 'landing') {
      setCurrentTab('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-[#07090e]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => { setCurrentTab('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-wider text-white font-sans">LUMEN</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">DETAIL</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">프리미엄 1:1 출장 자동차 광택케어</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => scrollToSection('services')} 
            className="hover:text-cyan-400 transition-colors"
          >
            시공 안내
          </button>
          <button 
            onClick={() => scrollToSection('process')} 
            className="hover:text-cyan-400 transition-colors"
          >
            작업 공정
          </button>
          <button 
            onClick={() => scrollToSection('before-after')} 
            className="hover:text-cyan-400 transition-colors"
          >
            전후 갤러리
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="hover:text-cyan-400 transition-colors"
          >
            가격표
          </button>
          <button 
            onClick={() => scrollToSection('reviews')} 
            className="hover:text-cyan-400 transition-colors"
          >
            고객 후기
          </button>
        </nav>

        {/* Action Buttons & Tabs */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentTab === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            관리자 모드
          </button>

          <button
            onClick={() => scrollToSection('booking')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            간편 출장 예약
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => scrollToSection('booking')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-bold"
          >
            예약신청
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c101a] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 mt-3 animate-fadeIn">
          <button 
            onClick={() => scrollToSection('services')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            시공 안내
          </button>
          <button 
            onClick={() => scrollToSection('process')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            작업 공정
          </button>
          <button 
            onClick={() => scrollToSection('before-after')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            전후 갤러리
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            가격표
          </button>
          <button 
            onClick={() => scrollToSection('reviews')} 
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-cyan-400"
          >
            고객 후기
          </button>
          
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => { setCurrentTab('admin'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 border border-white/10"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              관리자 모드 (명함/예약관리)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
