import React, { useState } from 'react';
import { PRICING_DATA } from '../data/servicesData';
import { Check, Sparkles, ShieldCheck, HelpCircle, ArrowRight, MapPin } from 'lucide-react';

export const PriceTable = ({ onSelectPackage }) => {
  const [selectedCategory, setSelectedCategory] = useState('mid');

  const formatPrice = (num) => {
    return (num / 10000).toLocaleString() + '만원';
  };

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
          Transparent Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
          거품 없는 <span className="text-cyan-400">정찰제 시공 안내표 & 가격표</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          현장에서 부당한 추가금을 요구하지 않습니다. 차종 크기에 따른 정직한 정찰제 가격을 확인해 보세요.
        </p>
      </div>

      {/* Vehicle Category Selector Tabs */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md">
          {PRICING_DATA.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-3 px-3 rounded-xl text-center transition-all flex flex-col items-center justify-center ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
              }`}
            >
              <span className="text-xs sm:text-sm">{cat.name}</span>
              <span className={`text-[10px] mt-0.5 truncate max-w-full ${
                selectedCategory === cat.id ? 'text-cyan-100' : 'text-slate-500'
              }`}>
                {cat.example.split(',')[0]} 등
              </span>
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-2.5">
          * 선택 차종 예시: <span className="text-cyan-300">{PRICING_DATA.categories.find(c => c.id === selectedCategory)?.example}</span>
        </p>
      </div>

      {/* Main Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
        {PRICING_DATA.packages.map((pkg) => {
          const currentPrice = pkg.prices[selectedCategory];
          const isRec = pkg.recommended;

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isRec 
                  ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 lg:-translate-y-2' 
                  : 'glass-card border border-white/10 hover:border-slate-600'
              }`}
            >
              {isRec && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{pkg.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  {pkg.badge && !isRec && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 min-h-[32px]">{pkg.desc}</p>

                {/* Price Display */}
                <div className="my-6 py-4 border-y border-white/10 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-xs text-slate-400">/ 1대 기준 (VAT 포함)</span>
                </div>

                {/* Included items */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">포함 시공 항목</span>
                  {pkg.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${isRec ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-cyan-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPackage(pkg.name, currentPrice)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isRec
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/30 hover:scale-[1.02]'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
                }`}
              >
                <span>이 패키지로 예약 신청</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Single / Additional Service Table */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 max-w-4xl mx-auto mb-10">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">단품 및 부위별 추가 옵션</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRICING_DATA.singleServices.map((single, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
              <span className="text-xs sm:text-sm text-slate-300">{single.name}</span>
              <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">{single.priceRange}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
          <span>단품 시공만 원하실 경우에도 자유롭게 출장 상담 및 예약이 가능합니다. (최소 시공 권장 10만원)</span>
        </div>
      </div>

      {/* Travel Fee & Regional Zone Guide */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/20 max-w-4xl mx-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">인천 청라 거점 기준 출장비 & 권역 안내</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  출발 거점: 인천 청라
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                투명한 거리 정찰제 기반으로 출장비를 투명하게 공개합니다.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30만원 이상 패키지 시공 시 출장비 무료 지원!</span>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {PRICING_DATA.travelZones?.zones.map((zoneItem, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {zoneItem.zone}
                  </span>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded border ${zoneItem.badgeColor}`}>
                    {zoneItem.feeText}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-400/80 font-mono mb-2">
                  거리 기준: {zoneItem.distance}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {zoneItem.areas}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>영종도 등 도서지역의 경우 유료 통행료(영종대교 톨비 실비)가 반영될 수 있습니다.</span>
          </div>
          <span className="text-cyan-300 font-medium">지하주차장/비가림 공간 및 220V 전원 필수</span>
        </div>
      </div>

    </section>
  );
};
