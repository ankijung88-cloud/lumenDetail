import React from 'react';
import { 
  Search, MapPin, Sparkles, Star, ChevronRight, ShieldCheck, 
  Car, Wrench, Award, Clock, ArrowRight, Zap, Bell, CheckCircle2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: '전체 광택', icon: '✨', color: 'from-cyan-500/30 to-blue-500/20' },
  { id: 'coating', name: '9H 유리막', icon: '🛡️', color: 'from-emerald-500/30 to-teal-500/20' },
  { id: 'part', name: '부분/스크래치', icon: '🚗', color: 'from-amber-500/30 to-orange-500/20' },
  { id: 'glass', name: '유막·발수', icon: '🌧️', color: 'from-blue-500/30 to-indigo-500/20' },
  { id: 'vip', name: 'VIP 풀케어', icon: '👑', color: 'from-purple-500/30 to-pink-500/20' },
  { id: 'tech', name: '기사 직접선택', icon: '👨‍🔧', color: 'from-rose-500/30 to-red-500/20' }
];

const POPULAR_PACKAGES = [
  {
    id: 'pkg-1',
    title: '3스텝 수성광택 + 9H 세라믹 코팅',
    price: 343000,
    originalPrice: 490000,
    discount: '30% OFF',
    tag: '인기 1위',
    desc: '신차급 맑은 도장면 복원 & 1년 발수 지속',
    rating: 4.98,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pkg-2',
    title: 'VIP 올인원 풀케어 패키지',
    price: 525000,
    originalPrice: 750000,
    discount: '30% OFF',
    tag: '프리미엄',
    desc: '광택+유리막+전면발수+엔진룸+실내살균',
    rating: 5.0,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pkg-3',
    title: '본넷(후드) 집중 수성 광택',
    price: 40000,
    originalPrice: 60000,
    discount: '특가',
    tag: '가성비',
    desc: '돌빵/스크래치가 많은 본넷만 집중 복원',
    rating: 4.95,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
  }
];

export const MobileHomeTab = ({ 
  currentLocation, 
  onLocationChange, 
  technicians, 
  matchRequests,
  onOpenQuickBooking,
  onGoToTechnicians,
  onGoToOrders
}) => {
  const activeOrders = matchRequests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');
  const closestTech = technicians[0] || {
    name: '김태진',
    badge: '마스터 디테일러',
    rating: 4.98,
    baseLocation: '인천 서구 청라국제도시',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  };

  return (
    <div className="pb-24 space-y-5 animate-fadeIn">
      
      {/* 1. Top Search Bar */}
      <div className="px-4 pt-1">
        <div 
          onClick={onOpenQuickBooking}
          className="relative w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-slate-400 shadow-md cursor-pointer hover:border-cyan-500/60"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="flex-grow">어떤 출장 광택/코팅이 필요하신가요?</span>
          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full">
            간편 견적
          </span>
        </div>
      </div>

      {/* 2. Ongoing Order Alert Floating Banner */}
      {activeOrders.length > 0 && (
        <div className="px-4">
          <div 
            onClick={onGoToOrders}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-cyan-950/50 to-slate-900 border border-emerald-500/50 flex items-center justify-between shadow-lg shadow-emerald-500/10 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                  실시간 진행중 의뢰 {activeOrders.length}건
                </span>
                <p className="text-white font-black mt-0.5 truncate max-w-[210px]">
                  {activeOrders[0].carModel} ({activeOrders[0].matchedTechName || '기사 배정중'})
                </p>
              </div>
            </div>
            <span className="text-[11px] text-cyan-300 font-bold flex items-center gap-0.5">
              조회 <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* 3. Event Promotion Banner */}
      <div className="px-4">
        <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-500/30 shadow-lg">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                LUMEN PRO 특별 혜택
              </span>
              <h4 className="text-sm font-black text-white mt-1.5 leading-snug">
                20만원 이상 패키지 시공 시<br />
                <span className="text-emerald-400">수도권 전지역 출장비 0원 무료!</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">플랫폼 제도화 표준 정찰가로 오버차지 0원 보증</p>
            </div>
            <button
              onClick={onOpenQuickBooking}
              className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black shrink-0 shadow-md shadow-cyan-500/30"
            >
              지금 예약
            </button>
          </div>
        </div>
      </div>

      {/* 4. Circular Category Grid */}
      <div className="px-4">
        <h4 className="text-xs font-extrabold text-slate-300 mb-3 flex items-center gap-1.5">
          <span>시공 카테고리</span>
        </h4>
        <div className="grid grid-cols-3 gap-2.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'tech') onGoToTechnicians();
                else onOpenQuickBooking();
              }}
              className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 group"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Closest 1st-Priority Technician Spotlight */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>내 주변 최단거리 1순위 전담 기술자</span>
          </h4>
          <button onClick={onGoToTechnicians} className="text-[11px] text-cyan-400 font-semibold flex items-center gap-0.5">
            전체보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0c121e] border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={closestTech.avatar} 
                alt={closestTech.name} 
                className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-sm font-black text-white">{closestTech.name} 프로</h5>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    📍 1순위
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">거점: {closestTech.baseLocation || '인천 청라'}</p>
                <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{closestTech.rating || 4.98}</span>
                  <span className="text-slate-500">({closestTech.reviewCount || 140}개 후기)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenQuickBooking}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              1:1 매칭
            </button>
          </div>

          <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
            💬 "수성 듀얼 광택 & 9H 유리막 코팅 전문! 전면 유리 유막제거 무료 서비스 함께 시공해 드립니다."
          </p>
        </div>
      </div>

      {/* 6. Popular Packages List */}
      <div className="px-4">
        <h4 className="text-xs font-extrabold text-white mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>실시간 인기 시공 패키지</span>
        </h4>

        <div className="space-y-3">
          {POPULAR_PACKAGES.map(pkg => (
            <div 
              key={pkg.id}
              className="glass-card rounded-2xl border border-white/10 p-3.5 flex gap-3.5 hover:border-cyan-500/40 transition-all cursor-pointer"
              onClick={onOpenQuickBooking}
            >
              <img 
                src={pkg.image} 
                alt={pkg.title}
                className="w-24 h-24 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {pkg.tag}
                    </span>
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      ★ {pkg.rating} ({pkg.reviews})
                    </span>
                  </div>
                  <h5 className="text-xs font-black text-white mt-1 leading-snug">{pkg.title}</h5>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{pkg.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500 line-through mr-1.5">{pkg.originalPrice.toLocaleString()}원</span>
                    <strong className="text-sm font-black text-cyan-400">{pkg.price.toLocaleString()}원</strong>
                  </div>
                  <button className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 text-[11px] font-bold transition-colors">
                    의뢰하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
