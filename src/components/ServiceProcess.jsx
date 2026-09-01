import React from 'react';
import { SERVICES, WORK_PROCESS } from '../data/servicesData';
import { Sparkles, ShieldCheck, Car, Droplets, Search, Wrench, Layers, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

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

export const ServiceProcess = ({ onSelectService }) => {
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
          선택하여 합리적인 비용으로 깨끗하게 케어해 드립니다.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-28">
        {SERVICES.map((service) => {
          const IconComponent = iconMap[service.icon] || Sparkles;
          return (
            <div 
              key={service.id}
              className={`glass-card p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${service.borderColor} hover:border-cyan-400/60 hover:-translate-y-1`}
            >
              {/* Top Accent Gradient */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.bgGradient}`} />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-slate-900/80 border border-white/10 ${service.accentColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/20">
                      {service.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{service.title}</h3>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/5 shrink-0">
                  {service.duration}
                </span>
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                {service.shortDesc}
              </p>

              {/* Feature Points */}
              <div className="space-y-2.5 mb-6">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectService(service.title)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all group-hover:border-cyan-400"
              >
                <span>이 서비스로 견적 문의하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
