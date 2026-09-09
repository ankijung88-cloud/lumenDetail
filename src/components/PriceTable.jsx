import React, { useState, useMemo } from 'react';
import { PRICING_DATA } from '../data/servicesData';
import { Check, Sparkles, ShieldCheck, HelpCircle, ArrowRight, MapPin, Flame, Tag, Car, Navigation, Calculator } from 'lucide-react';

export const PriceTable = ({ onSelectPackage, onSelectSingleService }) => {
  const [selectedCategory, setSelectedCategory] = useState('mid');
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0); // 0: 1권역, 1: 2권역, 2: 3권역, 3: 4권역

  const zones = PRICING_DATA.travelZones?.zones || [];
  const activeZone = zones[selectedZoneIndex] || zones[0];

  const formatPrice = (num) => {
    const val = num / 10000;
    return (Number.isInteger(val) ? val.toLocaleString() : val.toFixed(1)) + '만원';
  };

  // Calculate actual travel fee considering promotion (30만원 이상 1·2·3권역 무료, 40만원 이상 1~4권역 지원 등)
  const calculateEffectiveFee = (servicePrice, zoneIdx) => {
    const baseFee = zones[zoneIdx]?.fee || 0;
    if (zoneIdx === 0) return 0; // 1권역 항상 무료
    if (servicePrice >= 400000 && zoneIdx <= 3) return 0; // 40만원 이상 1~4권역(65km 이내) 전액 무료 지원
    if (servicePrice >= 300000 && zoneIdx <= 2) return 0; // 30만원 이상 1·2·3권역 무료
    return baseFee;
  };

  const selectedCategoryObj = PRICING_DATA.categories.find(c => c.id === selectedCategory);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span>시공 표준 가격 & 권역별 출장비 통합 안내</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          거품 없는 <span className="text-cyan-400">정찰제 표준 가격표 & 출장비</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          차종 크기와 출장 권역을 선택하시면 시공비와 출장비, 무료 프로모션이 결합된 <strong className="text-white font-semibold">최종 정찰제 결제 금액</strong>을 실시간으로 확인하실 수 있습니다.
        </p>
      </div>

      {/* 30% Promotion Banner */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-cyan-500/20 border border-rose-500/40 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 shrink-0 animate-pulse" />
          <span className="text-xs sm:text-sm font-extrabold text-white">
            🔥 [시즌 한정 특가] 전 패키지 정찰가 기준 <span className="text-rose-400 font-black underline decoration-rose-400 decoration-2 underline-offset-4">30% 특별 할인</span> + <span className="text-cyan-300 font-bold">30만원 이상 시공 시 출장비 무료 지원!</span>
          </span>
        </div>
      </div>

      {/* ==================== INTEGRATED STEP SELECTOR (Vehicle + Travel Zone) ==================== */}
      <div className="glass-card p-5 sm:p-7 rounded-3xl border border-white/10 mb-12 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          
          {/* 1. Vehicle Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>STEP 1. 내 차량 크기(차종) 선택</span>
              </span>
              <span className="text-[11px] text-cyan-300 font-semibold">{selectedCategoryObj?.name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {PRICING_DATA.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm">{cat.name}</span>
                    {selectedCategory === cat.id && <span className="text-cyan-400 text-xs">✓</span>}
                  </div>
                  <p className={`text-[10px] mt-0.5 truncate ${selectedCategory === cat.id ? 'text-cyan-200' : 'text-slate-500'}`}>
                    {cat.example.split(',').slice(0, 2).join(', ')} 등
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Travel Zone Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>STEP 2. 출장 희망 지역(권역) 선택</span>
              </span>
              <span className="text-[11px] text-emerald-300 font-semibold">거점: 인천 청라</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {zones.map((z, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedZoneIndex(idx)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    selectedZoneIndex === idx
                      ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 border-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  } ${idx === 4 ? 'col-span-2' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm truncate">{z.zone.split('(')[0]}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${z.badgeColor}`}>
                      {z.fee === 0 ? '무료' : `+${(z.fee / 10000).toFixed(1)}만${idx === 4 ? '~' : ''}`}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-0.5 truncate ${selectedZoneIndex === idx ? 'text-emerald-200' : 'text-slate-500'}`}>
                    {z.distance} · {z.areas.split(',')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Zone Tip Bar */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              선택 권역: <strong className="text-white font-bold">[{activeZone.zone}]</strong> ({activeZone.areas.split(',').slice(0, 3).join(', ')} 등)
            </span>
          </div>
          <div className="text-emerald-400 font-semibold text-[11px]">
            {activeZone.fee === 0 ? (
              <span>✨ 1권역 기본 출장비 0원 무료 권역입니다.</span>
            ) : (
              <span>✨ 30만원 이상 패키지 시공 시 출장비 전액 0원 무료 지원!</span>
            )}
          </div>
        </div>

      </div>

      {/* ==================== MAIN PACKAGES (Integrated Price + Travel Fee) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
        {PRICING_DATA.packages.map((pkg) => {
          const originalPrice = pkg.prices[selectedCategory];
          const discountedPrice = Math.round(originalPrice * 0.7);
          const effectiveFee = calculateEffectiveFee(discountedPrice, selectedZoneIndex);
          const isFeeFree = activeZone.fee > 0 && effectiveFee === 0;
          const totalPrice = discountedPrice + effectiveFee;
          const isRec = pkg.recommended;

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                isRec 
                  ? 'bg-gradient-to-b from-slate-800/95 to-slate-900/95 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 lg:-translate-y-2' 
                  : 'glass-card border border-white/10 hover:border-slate-600'
              }`}
            >
              {isRec && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{pkg.badge || '가장 인기 있는 시공'}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  {pkg.badge && !isRec && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 min-h-[32px]">{pkg.desc}</p>

                {/* Price Display with 30% OFF */}
                <div className="my-5 py-4 border-y border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">시공 정찰가</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {originalPrice.toLocaleString()}원
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        30% OFF
                      </span>
                      <span className="text-sm font-bold text-slate-200">
                        {discountedPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <span>출장비 ({activeZone.zone.split('(')[0].trim()})</span>
                    </span>
                    <div>
                      {isFeeFree ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 line-through font-mono">+{activeZone.fee.toLocaleString()}원</span>
                          <span className="text-emerald-400 font-extrabold bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                            무료 지원 (0원)
                          </span>
                        </div>
                      ) : activeZone.fee === 0 ? (
                        <span className="text-emerald-400 font-bold">0원 (기본 무료)</span>
                      ) : (
                        <span className="text-cyan-300 font-semibold">+{effectiveFee.toLocaleString()}원</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                    <span className="text-xs font-bold text-cyan-400">예상 총 결제액</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                        {totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">원 (VAT포함)</span>
                    </div>
                  </div>
                </div>

                {/* Included items */}
                <div className="space-y-2.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">포함 시공 공정</span>
                  {pkg.includes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${isRec ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-cyan-400'}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPackage(pkg.name, totalPrice)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isRec
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/30 hover:scale-[1.02]'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <span>이 패키지로 간편 예약</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ==================== PARTIAL CARE & SPOT OPTIONS (50% OFF) ==================== */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.15)] max-w-5xl mx-auto mb-12 relative overflow-hidden">
        
        {/* Top Floating Promo Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">맞춤형 부위별 부분케어 & 단품 옵션</h3>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 shadow-md">
                  50% 반값 파격 할인
                </span>
              </div>
              <p className="text-xs text-rose-300/90 mt-0.5 font-medium">
                흠집이나 스월마크가 심한 특정 부위만 쏙 골라 50% 할인된 합리적인 가격으로 시공 받으실 수 있습니다.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-bold shrink-0 self-start sm:self-auto">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>단품 전 품목 50% DC</span>
          </div>
        </div>

        {/* Services Grid with Original vs 50% OFF Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {PRICING_DATA.singleServices.map((single, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                if (onSelectSingleService) {
                  onSelectSingleService(single.id);
                } else {
                  const el = document.getElementById(`service-${single.id}`) || document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400 hover:bg-slate-800/90 hover:scale-[1.01] flex items-center justify-between transition-all group cursor-pointer shadow-sm hover:shadow-cyan-500/15"
              title="클릭 시 맞춤형 부분케어 솔루션 상세 안내로 이동"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm text-slate-200 font-semibold group-hover:text-cyan-300 transition-colors">
                    {single.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    상세보기 →
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">소요시간 약 40분~1시간 · 클릭 시 상세 설명</span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 ml-2">
                {single.originalPrice && (
                  <span className="text-[11px] text-slate-500 line-through font-mono hidden xs:inline">
                    {single.originalPrice}
                  </span>
                )}
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {single.discount || '50% OFF'}
                </span>
                <span className="text-xs sm:text-sm font-black text-cyan-300 font-mono">
                  {single.priceRange}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>원하는 부위만 복수 선택하여 복합 패키지로 맞춤 시공도 가능합니다. (권장 최소 시공비 10만원)</span>
          </div>
          <button
            onClick={() => onSelectPackage('맞춤형 부위별 부분케어 (단품)', 100000)}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4"
          >
            단품 맞춤 견적 요청하기 →
          </button>
        </div>

      </div>

      {/* ==================== TRAVEL ZONE DETAILS & TRANSPARENCY ==================== */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/20 max-w-5xl mx-auto relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white">인천 청라 거점 기준 권역별 출장비 상세 안내</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  거리 정찰제
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                투명한 거리 정찰제 기반으로 출장비를 공개하며 현장에서 별도의 부당한 추가금을 청구하지 않습니다.
              </p>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30만원 이상 시공 시 1·2·3권역 출장비 전액 0원 지원!</span>
          </div>
        </div>

        {/* Zones Grid with Quick Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {zones.map((zoneItem, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedZoneIndex(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedZoneIndex === idx
                  ? 'bg-slate-900/95 border-emerald-400/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-slate-900/70 border-white/5 hover:border-cyan-500/30'
              } ${idx === 4 ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    {selectedZoneIndex === idx && <span className="text-emerald-400">●</span>}
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

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">클릭하여 이 권역으로 견적 계산</span>
                <span className={`font-semibold ${selectedZoneIndex === idx ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {selectedZoneIndex === idx ? '✓ 선택됨' : '선택하기'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Win-Win Distance-based Policy Explainer Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-rose-950/40 border border-purple-500/30 mb-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              고객 & 기사 상생 거리 정찰제
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">4권역 거리 제한(45~65km) 및 초장거리 거리별 개별 책정 기준</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            • <strong className="text-purple-300 font-semibold">4권역 (경기 외곽)</strong>: 청라 거점 기준 <strong className="text-white">반경 45km ~ 65km 이내</strong>에 한정하여 정찰 출장비 50,000원이 적용됩니다.<br />
            • <strong className="text-rose-300 font-semibold">5권역 (65km 초과 초장거리/타지역)</strong>: 65km 초과 시 <strong className="text-cyan-300">10km당 10,000원의 거리 비례 출장비가 개별 책정</strong>됩니다. (예: 75km 이동 시 약 8만원, 85km 이동 시 약 9만원 등 사전 안내)<br />
            • 장거리 출장 시 기사의 이동 시간과 유류비·톨게이트 비용을 공정하게 보상하고, 고객님께는 현장 부당 요구 없는 투명한 사전 정찰 견적을 제공합니다.
          </p>
        </div>

        {/* Footnote */}
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>영종도 등 도서지역의 경우 유료 통행료(영종대교 톨비 실비)가 반영될 수 있습니다.</span>
          </div>
          <span className="text-cyan-300 font-medium">※ 작업 공간: 아파트/빌라/오피스텔/회사 주차장 및 220V 전원 연결 필요</span>
        </div>
      </div>

    </section>
  );
};
