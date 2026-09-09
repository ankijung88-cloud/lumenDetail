import React, { useState } from 'react';
import { SERVICES, WORK_PROCESS, PRICING_DATA } from '../data/servicesData';
import { 
  Sparkles, ShieldCheck, Car, Droplets, Search, Wrench, 
  Layers, Shield, CheckCircle2, ArrowRight, MapPin, Tag, 
  Users, X, ChevronRight, Calculator, Check, Flame, HelpCircle
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  ShieldCheck: ShieldCheck,
  Car: Car,
  Droplets: Droplets,
  Search: Search,
  Wrench: Wrench,
  Layers: Layers,
  Shield: Shield,
  CheckCircle2: CheckCircle2,
};

export const ServiceProcess = ({ onSelectService, onFindTechnician, highlightedServiceId }) => {
  // Modal States
  const [selectedServiceForModal, setSelectedServiceForModal] = useState(null);
  const [isTravelFeeModalOpen, setIsTravelFeeModalOpen] = useState(false);

  const zones = PRICING_DATA.travelZones?.zones || [];

  const handleAction = (serviceTitle) => {
    if (onFindTechnician) {
      onFindTechnician(serviceTitle);
    } else if (onSelectService) {
      onSelectService(serviceTitle);
    } else {
      const el = document.getElementById('technicians');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
          Custom Partial Detailing & Spot Care
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
          원하는 부위만 쏙! <span className="text-cyan-400">맞춤형 부분케어 솔루션</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          차량 전체 광택이 부담스러우신가요? 본넷, 도어, 범퍼, 휀다, 트렁크 등 흠집이나 스월마크가 심한 특정 부위만 
          선택하여 <strong className="text-white font-semibold">차종별 정해진 표준 정찰 가격</strong>으로 투명하게 시공받으실 수 있습니다.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
        {SERVICES.map((service) => {
          const IconComponent = iconMap[service.icon] || Sparkles;
          const isHighlighted = highlightedServiceId === service.id;
          return (
            <div 
              key={service.id}
              id={`service-${service.id}`}
              className={`glass-card p-6 sm:p-8 rounded-3xl border transition-all duration-500 relative group overflow-hidden flex flex-col justify-between ${
                isHighlighted
                  ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/50 bg-slate-900/95 scale-[1.02] -translate-y-2 z-20 animate-pulse'
                  : `${service.borderColor} hover:border-cyan-400/60 hover:-translate-y-1`
              }`}
            >
              {/* Top Accent Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.bgGradient}`} />

              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-slate-900/90 border border-white/10 ${service.accentColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-cyan-500/20">
                        {service.badge}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{service.title}</h3>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/5 shrink-0">
                    {service.duration}
                  </span>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Integrated Standard Price & Travel Fee Box with Aligned Structure */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 mb-5 space-y-2.5">
                  
                  {/* Row 1: Price */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                        <Tag className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>정찰 시공가</span>
                      </span>
                      {service.discountBadge && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                          {service.discountBadge}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono truncate">
                        {service.standardPrice || '정찰제'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedServiceForModal(service)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white text-[11px] font-bold border border-cyan-500/30 flex items-center justify-center gap-1 transition-all shrink-0 min-w-[95px]"
                      title="차종별 세부 정찰가 확인"
                    >
                      <span>차종별 금액</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Row 2: Travel Fee */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>출장비</span>
                      </span>
                      <span className="text-xs text-emerald-300 font-semibold truncate">
                        1권역 0원 무료 (수도권 정찰제)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsTravelFeeModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white text-[11px] font-bold border border-emerald-500/30 flex items-center justify-center gap-1 transition-all shrink-0 min-w-[95px]"
                      title="권역별 출장비 확인"
                    >
                      <span>권역별 안내</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

                {/* Feature Points */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Find Technician with Fixed Price */}
              <button
                onClick={() => handleAction(service.title)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950 hover:to-blue-950 text-cyan-300 hover:text-white text-xs sm:text-sm font-bold border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-cyan-500/10"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>이 정찰가로 전문 기사 찾기</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Work Process Section */}
      <div id="process" className="relative pt-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
            Standard Operating Procedure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
            빈틈없는 <span className="text-cyan-400">6단계 표준 시공 프로세스</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            어떤 현장에서도 타협 없는 공정을 거쳐 신차 출고 당시의 감동을 그대로 재현합니다.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORK_PROCESS.map((step) => {
            const StepIcon = iconMap[step.icon] || CheckCircle2;
            return (
              <div 
                key={step.step}
                className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/40 transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-800 group-hover:text-cyan-500/20 transition-colors font-mono">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* ==================== MODAL 1: VEHICLE CATEGORY PRICE BREAKDOWN MODAL ==================== */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0d121f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>차량 크기별 표준 정찰 가격표</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {selectedServiceForModal.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedServiceForModal.shortDesc}
              </p>
            </div>

            {/* Vehicle Size Table */}
            <div className="space-y-3 mb-6">
              {(selectedServiceForModal.categoryPrices || [
                { catId: 'compact', name: '경차 / 소형', example: '모닝, 레이, 아반떼, 캐스퍼', original: 80000, price: 40000, discount: '50% OFF' },
                { catId: 'mid', name: '준중형 / 중형', example: '쏘나타, K5, G70, BMW 3/5', original: 90000, price: 45000, discount: '50% OFF' },
                { catId: 'large_suv', name: '대형 / 준대형 / 중형SUV', example: '그랜저, G80, 싼타페, 쏘렌토', original: 110000, price: 55000, discount: '50% OFF' },
                { catId: 'van_large', name: '대형SUV / RV / 수입대형', example: '카니발, GV80, 팰리세이드, S클래스', original: 130000, price: 65000, discount: '50% OFF' }
              ]).map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/40 flex items-center justify-between transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {item.discount}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.example}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 line-through font-mono block">
                      {item.original?.toLocaleString()}원
                    </span>
                    <span className="text-base sm:text-lg font-black text-cyan-300 font-mono">
                      {item.price?.toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Transparency Note */}
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-2 text-xs text-cyan-300 mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>현장에서 차종 크기에 따른 추가금 없이 위 정찰 가격 그대로 시공됩니다.</span>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedServiceForModal(null)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  const svcTitle = selectedServiceForModal.title;
                  setSelectedServiceForModal(null);
                  handleAction(svcTitle);
                }}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
              >
                <Users className="w-4 h-4" />
                <span>이 정찰가로 전문 기사 찾기</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== MODAL 2: TRAVEL FEE & REGIONAL ZONE MODAL ==================== */}
      {isTravelFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0d121f] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Close Button */}
            <button
              onClick={() => setIsTravelFeeModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>인천 청라 거점 기준 권역별 출장비 정찰 안내</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                투명한 거리 정찰제 출장비
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                출발 거점(인천 청라국제도시) 기준으로 거리에 따른 정찰 출장비가 투명하게 적용됩니다.
              </p>
            </div>

            {/* 30만원 이상 무료 프로모션 배너 */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 mb-5 flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>🔥 30만원 이상 패키지 시공 시 1·2·3권역 출장비 전액 0원 무료 지원!</span>
            </div>

            {/* Zones Grid */}
            <div className="space-y-3 mb-6">
              {zones.map((z, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">{z.zone}</span>
                      <span className="text-[11px] text-cyan-400 font-mono">({z.distance})</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded border ${z.badgeColor}`}>
                      {z.feeText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {z.areas}
                  </p>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-xs text-slate-400 mb-6">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>출장 시공 필수 환경 안내</span>
              </div>
              <p>• 지하주차장 또는 비가림 실내 공간과 220V 일반 전원 콘센트 연결이 필요합니다.</p>
              <p>• 영종도 등 도서지역의 경우 영종대교 유료 톨비 실비가 추가될 수 있습니다.</p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsTravelFeeModalOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              확인 완료
            </button>

          </div>
        </div>
      )}

    </section>
  );
};
