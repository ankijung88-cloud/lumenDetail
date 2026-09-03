import React, { useState } from 'react';
import { 
  Star, Award, ShieldCheck, MapPin, Wrench, ChevronRight, 
  Search, Filter, Sparkles, Phone, CheckCircle2
} from 'lucide-react';

export const MobileTechniciansTab = ({ technicians, onSelectTechForBooking }) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('proximity'); // 'proximity' | 'rating' | 'jobs'

  const filtered = technicians.filter(tech => {
    const matchRegion = selectedRegion === 'ALL' || tech.region.includes(selectedRegion);
    const matchSearch = searchQuery === '' || 
      tech.name.includes(searchQuery) ||
      tech.region.includes(searchQuery) ||
      tech.specialties?.some(s => s.includes(searchQuery));
    return matchRegion && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'jobs') return (b.completedJobs || 0) - (a.completedJobs || 0);
    return 0; // proximity default
  });

  return (
    <div className="pb-24 space-y-4 animate-fadeIn">
      
      {/* 1. Header & Search */}
      <div className="px-4 pt-1 space-y-3">
        <div>
          <h3 className="text-lg font-black text-white">검증된 1급 디테일러</h3>
          <p className="text-xs text-slate-400 mt-0.5">내 위치와 가장 가까운 장인을 비교하고 직접 지정하세요.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기사 성함, 지역, 전문분야 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Region & Sort Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <div className="flex items-center gap-1.5">
            {['ALL', '인천', '서울', '경기'].map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedRegion === r
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 border border-white/5'
                }`}
              >
                {r === 'ALL' ? '전체' : r}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-[11px] text-slate-300 font-bold focus:outline-none"
          >
            <option value="proximity">거리순 (기본)</option>
            <option value="rating">평점 높은순</option>
            <option value="jobs">시공 많은순</option>
          </select>
        </div>
      </div>

      {/* 2. Technicians Baemin-style List Cards */}
      <div className="px-4 space-y-3.5">
        {filtered.map((tech, idx) => {
          const isClosest = idx === 0;

          return (
            <div 
              key={tech.id}
              className="glass-card rounded-2xl border border-white/10 p-4 space-y-3 hover:border-cyan-500/40 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <img 
                    src={tech.avatar} 
                    alt={tech.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0" 
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-sm font-black text-white">{tech.name} 프로</h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                        {tech.badge || '인증 파트너'}
                      </span>
                      {isClosest && (
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 animate-pulse">
                          📍 최단거리
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {tech.rating}
                      </span>
                      <span>({tech.reviewCount || 120}개 리뷰)</span>
                      <span>• 경력 {tech.experienceYears}년</span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5">
                      거점: <strong className="text-slate-200">{tech.baseLocation || tech.region}</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTechForBooking(tech)}
                  className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 active:scale-95 shrink-0"
                >
                  지정 의뢰
                </button>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1">
                {(tech.specialties || ['수성광택', '유리막코팅']).slice(0, 3).map((spec, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-white/5">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Intro quote */}
              <p className="text-[11px] text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                "{tech.introduction}"
              </p>

              {/* Regulated Price Guarantee Banner */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  플랫폼 표준 정찰제 적용
                </span>
                <span className="text-emerald-400 font-bold">오버차지 0원 보증</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 glass-card rounded-2xl border border-white/10 text-slate-400 text-xs">
            조건에 맞는 기술자가 없습니다. 검색어를 변경해 보세요.
          </div>
        )}
      </div>

    </div>
  );
};
