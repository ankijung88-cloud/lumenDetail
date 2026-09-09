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
  const [highlightedServiceId, setHighlightedServiceId] = useState(null);

  const handleSelectSingleServiceFromPrice = (serviceId) => {
    setHighlightedServiceId(serviceId);
    
    // Smooth scroll to the corresponding service card in ServiceProcess
    setTimeout(() => {
      const el = document.getElementById(`service-${serviceId}`) || document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);

    // Automatically remove highlight glow after 3.5 seconds
    setTimeout(() => {
      setHighlightedServiceId(null);
    }, 3500);
  };

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



      {/* 2. Pricing & Vehicle Category Table (Standard Price & Travel Fee) */}
      <PriceTable 
        onSelectPackage={(pkgName, price) => scrollToBooking(pkgName, price)}
        onSelectSingleService={handleSelectSingleServiceFromPrice}
      />

      {/* 3. Professional Services & 6-Step Process */}
      <ServiceProcess 
        highlightedServiceId={highlightedServiceId}
        onFindTechnician={(svc) => {
          const el = document.getElementById('technicians');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectService={(svc) => scrollToBooking(svc)}
      />

      {/* 4. Verified Technicians Section */}
      <TechnicianExplorer 
        technicians={technicians}
        onRequestToTech={(tech) => {
          if (onRequestToTech) onRequestToTech(tech);
          scrollToBooking();
        }}
        onOpenRegisterModal={onOpenRegisterModal}
      />

      {/* 5. Interactive Before / After Transformation Slider */}
      <BeforeAfterSlider />

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
