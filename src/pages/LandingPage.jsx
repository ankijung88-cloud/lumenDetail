import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ServiceProcess } from '../components/ServiceProcess';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { PriceTable } from '../components/PriceTable';
import { BookingForm } from '../components/BookingForm';
import { Reviews } from '../components/Reviews';
import { Phone, MessageSquare, ArrowUp, Calendar } from 'lucide-react';

export const LandingPage = () => {
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
      />

      {/* 2. Professional Services & 6-Step Process */}
      <ServiceProcess 
        onSelectService={(svc) => scrollToBooking(svc)}
      />

      {/* 3. Interactive Before / After Transformation Slider */}
      <BeforeAfterSlider />

      {/* 4. Pricing & Vehicle Category Table */}
      <PriceTable 
        onSelectPackage={(pkgName, price) => scrollToBooking(pkgName, price)}
      />

      {/* 5. Online Reservation & Google Sheet Sync Form */}
      <BookingForm 
        preselectedService={selectedService}
        preselectedPrice={selectedPrice}
      />

      {/* 6. Customer Reviews & FAQ */}
      <Reviews />

      {/* Floating Action Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Quick Phone Call */}
        <a
          href="tel:010-1234-5678"
          className="w-12 h-12 rounded-full bg-slate-900/90 text-cyan-400 border border-cyan-500/40 shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all backdrop-blur-md"
          title="1:1 유선 상담 전화"
        >
          <Phone className="w-5 h-5" />
        </a>

        {/* Quick Booking Floating CTA */}
        <button
          onClick={() => scrollToBooking()}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">실시간 출장예약</span>
        </button>
      </div>

    </div>
  );
};
