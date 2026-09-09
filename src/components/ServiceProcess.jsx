import React from 'react';
import { SERVICES, WORK_PROCESS } from '../data/servicesData';
import { Sparkles, ShieldCheck, Car, Droplets, Search, Wrench, Layers, Shield, CheckCircle2, ArrowRight, MapPin, Tag, Users } from 'lucide-react';

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

export const ServiceProcess = ({ onSelectService, onFindTechnician }) => {
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
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          차량 전체 광택이 부담스러우신가요? 본넷, 도어, 범퍼, 휀다, 트렁크 등 흠집이나 스월마크가 심한 특정 부위만 
          선택하여 <strong className="text-white font-semibold">정해진 표준 정찰 가격</strong>으로 투명하게 시공받으실 수 있습니다.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
        {SERVICES.map((service) => {
          const IconComponent = iconMap[service.icon] || Sparkles;
          return (
            <div 
              key={service.id}
              className={`glass-card p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative group overflow-hidden ${service.borderColor} hover:border-cyan-400/60 hover:-translate-y-1 flex flex-col justify-between`}
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

                {/* Integrated Standard Price & Travel Fee Box */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-white/10 mb-5 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-rose-400" />
                      <span>표준 정찰 시공가</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {service.originalPrice && (
                        <span className="text-[11px] text-slate-500 line-through font-mono">
                          {service.originalPrice}
                        </span>
                      )}
                      {service.discountBadge && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {service.discountBadge}
                        </span>
                      )}
                      <span className="text-sm sm:text-base font-black text-cyan-300 font-mono">
                        {service.standardPrice || '정찰제'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>출장비 안내:</span>
                    </span>
                    <span className="text-emerald-300 font-semibold text-right">
                      {service.travelFeeInfo || '1권역(인천/부천/김포) 0원 무료 · 거리정찰제'}
                    </span>
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

    </section>
  );
};
