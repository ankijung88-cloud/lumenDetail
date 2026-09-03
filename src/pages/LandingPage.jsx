import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ServiceProcess } from '../components/ServiceProcess';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { PriceTable } from '../components/PriceTable';
import { BookingForm } from '../components/BookingForm';
import { Reviews } from '../components/Reviews';
import { TechnicianExplorer } from '../components/TechnicianExplorer';
import { 
  Phone, MessageSquare, ArrowUp, Calendar, ShieldCheck, 
  Search, Award, Sparkles, CheckCircle2, Users, Briefcase,
  Smartphone 
} from 'lucide-react';

export const LandingPage = ({ 
  technicians, 
  onRequestToTech, 
  targetTech, 
  onClearTargetTech,
  onOpenRegisterModal,
  onOpenTracker,
  onGoToTechnicians,
  onGoToOrderMarket,
  onSwitchToMobileApp
}) => {
  const [selectedService, setSelectedService] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);

  const scrollToBooking = (serviceName = '', price = 0) => {
    if (serviceName) {
      setSelectedService(serviceName);
      setSelectedPrice(price);
    }
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      
      {/* 1. Hero Visual */}
      <Hero 
        onBookClick={() => scrollToBooking()}
        onExploreClick={() => scrollToSection('before-after')}
        onGoToTechnicians={onGoToTechnicians}
      />

      {/* 2. Platform Trust & Matching Guarantee Banner */}
      <section className="py-12 bg-[#090c14] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">엄격한 기사 검증</h4>
                <p className="text-xs text-slate-400 mt-0.5">실기 테스트 및 장비 기준 통과</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">실시간 비교 견적</h4>
                <p className="text-xs text-slate-400 mt-0.5">복수 전문가 제안 비교 & 선택</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">현장 검수 후 안심 결제</h4>
                <p className="text-xs text-slate-400 mt-0.5">시공 퀄리티 직접 확인 후 결제</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">품질 보증 A/S 연계</h4>
                <p className="text-xs text-slate-400 mt-0.5">시공 후 사후 관리 가이드 제공</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Verified Technicians Section Preview */}
      <TechnicianExplorer 
        technicians={technicians}
        onRequestToTech={(tech) => {
          if (onRequestToTech) onRequestToTech(tech);
          scrollToBooking();
        }}
        onOpenRegisterModal={onOpenRegisterModal}
      />

      {/* 4. Professional Services & 6-Step Process */}
      <ServiceProcess 
        onSelectService={(svc) => scrollToBooking(svc)}
      />

      {/* 5. Interactive Before / After Transformation Slider */}
      <BeforeAfterSlider />

      {/* 6. Pricing & Vehicle Category Table */}
      <PriceTable 
        onSelectPackage={(pkgName, price) => scrollToBooking(pkgName, price)}
      />

      {/* 7. Online Reservation & Google Sheet Sync Form */}
      <BookingForm 
        preselectedService={selectedService}
        preselectedPrice={selectedPrice}
        targetTech={targetTech}
        onClearTargetTech={onClearTargetTech}
        onOpenTracker={onOpenTracker}
      />

      {/* 8. Customer Reviews & FAQ */}
      <Reviews />

      {/* Unified Floating Action Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
        {/* Track Quotes / My Requests Button */}
        <button
          onClick={onOpenTracker}
          className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xl flex items-center gap-2 text-xs font-bold backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          title="내 의뢰 견적 현황 조회"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span>내 의뢰 조회</span>
        </button>

        {/* Mobile App Mode Switcher */}
        {onSwitchToMobileApp && (
          <button
            onClick={onSwitchToMobileApp}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all border border-white/10"
            title="모바일 전용 앱 화면으로 전환"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>모바일 앱 모드</span>
          </button>
        )}

        {/* Quick Booking Floating CTA */}
        <button
          onClick={() => scrollToBooking()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-xl shadow-cyan-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>실시간 견적 의뢰</span>
        </button>
      </div>

    </div>
  );
};
