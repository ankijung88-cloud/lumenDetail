import React from 'react';
import { 
  Sparkles, Shield, Clock, MapPin, ChevronRight, Star, 
  Award, CheckCircle, Users, Search, ShieldCheck 
} from 'lucide-react';

export const Hero = ({ onBookClick, onExploreClick, onGoToTechnicians }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Glows and Car Silhouette Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        
        {/* Top Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-6 sm:mb-8 shadow-inner backdrop-blur-md animate-bounce break-keep">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>검증된 1급 디테일러 맞춤 출장 중개 플랫폼</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 hidden sm:inline-block" />
          <span className="text-slate-400 font-normal hidden sm:inline-block">수도권 및 전국 출장</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-4 sm:mb-6 leading-tight break-keep">
          스월마크 없는 <span className="text-gradient">거울 광택 리플렉션</span>, <br className="hidden sm:inline" />
          검증된 프로 디테일러를 <br className="hidden sm:inline" />
          고객님의 주차장으로.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed font-normal break-keep px-2 sm:px-0">
          샵에 차를 맡기는 번거로움 없이, <strong className="text-cyan-300 font-semibold">실력과 평점이 검증된 기술자</strong>에게 
          <strong className="text-white font-semibold"> 1:1 수성 듀얼 광택 & 9H 유리막 코팅</strong>을 비교 견적으로 의뢰하세요.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-md sm:max-w-none mx-auto">
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group break-keep"
          >
            <span>실시간 스마트 비교견적 요청</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          <button
            onClick={onGoToTechnicians}
            className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all break-keep"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>내 지역 전문 기술자 찾기</span>
          </button>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">1급 검증 프로 디테일러</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">실기 심사 및 장비 검증 완료</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% 수성 비파괴 광택</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">도막 두께 측정 및 클리어층 보호</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">찾아가는 1:1 출장 시공</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">아파트/오피스텔/회사 주차장</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">투명한 비교견적 & 보증</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">시공 전후 검수 후 안심 정산</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
