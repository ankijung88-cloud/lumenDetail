import React, { useState, useMemo } from 'react';
import { 
  Star, Award, ShieldCheck, MapPin, Wrench, ChevronRight, 
  CheckCircle2, Filter, Search, Calendar, Phone, Sparkles, X, 
  Layers, ExternalLink, ThumbsUp, UserCheck
} from 'lucide-react';
import { SPECIALTY_CATEGORIES, REGION_CATEGORIES } from '../data/techniciansData';

export const TechnicianExplorer = ({ technicians, onRequestToTech, onOpenRegisterModal }) => {
  const [selectedRegion, setSelectedRegion] = useState('전체 지역');
  const [selectedSpecialty, setSelectedSpecialty] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'jobs' | 'reviews'

  const filteredTechnicians = useMemo(() => {
    return technicians.filter(tech => {
      const matchRegion = selectedRegion === '전체 지역' || tech.region.includes(selectedRegion.replace('전체 지역', '')) || tech.activeZones.some(z => z.includes(selectedRegion.split('/')[0]));
      const matchSpecialty = selectedSpecialty === '전체' || tech.specialties.includes(selectedSpecialty);
      const matchSearch = searchQuery === '' || 
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRegion && matchSpecialty && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'jobs') return b.completedJobs - a.completedJobs;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [technicians, selectedRegion, selectedSpecialty, searchQuery, sortBy]);

  return (
    <section id="technicians" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold mb-4">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>엄격한 실기 검증을 통과한 1급 디테일러</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          내 지역 <span className="text-gradient">검증된 디테일러 프로</span> 찾기
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          실제 시공 포트폴리오와 고객 평점을 확인하고, 원하는 전문가에게 1:1 맞춤 출장 시공을 직접 의뢰하세요.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/10 mb-8 space-y-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="기사명, 시공분야, 활동지역 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {REGION_CATEGORIES.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-xs text-slate-400">정렬:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="rating">평점 높은 순</option>
              <option value="jobs">시공 건수 많은 순</option>
              <option value="reviews">리뷰 많은 순</option>
            </select>
          </div>

        </div>

        {/* Specialty Filter Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5 scrollbar-none">
          <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> 시공 분야:
          </span>
          {SPECIALTY_CATEGORIES.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/40 hover:bg-slate-900'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTechnicians.map(tech => (
          <div 
            key={tech.id}
            className="glass-card rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col overflow-hidden group hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
          >
            {/* Top Cover Image / Badge */}
            <div className="relative h-28 bg-slate-800 overflow-hidden">
              <img 
                src={tech.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'} 
                alt={tech.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e17] via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>{tech.badge}</span>
              </div>

              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                예약 가능
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-5 flex-grow flex flex-col -mt-10 relative z-10">
              
              <div className="flex items-end justify-between mb-3">
                <div className="relative">
                  <img 
                    src={tech.avatar} 
                    alt={tech.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg" 
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    ✓
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{tech.rating}</span>
                    <span className="text-slate-400 text-xs font-normal">({tech.reviewCount})</span>
                  </div>
                  <span className="text-[11px] text-slate-400">누적 시공 {tech.completedJobs}건</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {tech.name} <span className="text-xs text-slate-400 font-medium">프로 ({tech.experienceYears}년차)</span>
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{tech.region} ({tech.activeZones.slice(0, 2).join(', ')})</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-white/5">
                "{tech.introduction}"
              </p>

              {/* Specialties */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tech.specialties.map((spec, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-white/5 font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={() => setSelectedTech(tech)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <span>상세 프로필</span>
                </button>
                <button
                  onClick={() => onRequestToTech(tech)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1:1 의뢰하기</span>
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">조건에 맞는 디테일러 프로를 찾지 못했습니다.</p>
          <p className="text-xs text-slate-500 mt-1">지역 또는 시공 분야 필터를 변경해 보세요.</p>
        </div>
      )}

      {/* Partner Registration Banner */}
      <div className="mt-14 glass-card rounded-2xl border border-cyan-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>디테일러 파트너 모집 중</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            실력 있는 출장 광택 & 디테일링 전문가이신가요?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            루멘 프로 매치 파트너로 등록하시고, 원하는 지역의 고단가 프리미엄 오더를 실시간으로 수주하세요.
          </p>
        </div>
        <button
          onClick={onOpenRegisterModal}
          className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>기사 파트너 지원하기</span>
        </button>
      </div>

      {/* Technician Detail Modal */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#0d121f] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedTech(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-white/10">
              <img 
                src={selectedTech.avatar} 
                alt={selectedTech.name} 
                className="w-24 h-24 rounded-3xl object-cover border-2 border-cyan-500 shadow-xl"
              />
              <div className="text-center sm:text-left flex-grow">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                    {selectedTech.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                    경력 {selectedTech.experienceYears}년차
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">{selectedTech.name} 프로</h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>주 활동권역: {selectedTech.activeZones.join(', ')}</span>
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{selectedTech.rating}</span>
                    <span className="text-slate-400 text-xs font-normal">({selectedTech.reviewCount}개 리뷰)</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    누적 시공 <strong className="text-cyan-400">{selectedTech.completedJobs}건</strong> 완료
                  </div>
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="py-5 border-b border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">전문가 소개</h4>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-white/5">
                {selectedTech.introduction}
              </p>
            </div>

            {/* Equipment & Tools */}
            <div className="py-5 border-b border-white/10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-cyan-400" />
                보유 전문 장비 및 약재
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTech.equipment.map((eq, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{eq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            {selectedTech.portfolio && selectedTech.portfolio.length > 0 && (
              <div className="py-5 border-b border-white/10">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  실제 시공 포트폴리오
                </h4>
                <div className="space-y-4">
                  {selectedTech.portfolio.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/60 rounded-xl p-3 border border-white/5">
                      <p className="text-xs font-bold text-cyan-300 mb-2">{item.title}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-rose-400 font-bold block mb-1">시공 전 (BEFORE)</span>
                          <img src={item.before} alt="before" className="w-full h-28 object-cover rounded-lg" />
                        </div>
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold block mb-1">시공 후 (AFTER)</span>
                          <img src={item.after} alt="after" className="w-full h-28 object-cover rounded-lg" />
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 italic">"{item.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-6 flex items-center gap-3">
              <button
                onClick={() => setSelectedTech(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  const tech = selectedTech;
                  setSelectedTech(null);
                  onRequestToTech(tech);
                }}
                className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>{selectedTech.name} 프로에게 1:1 맞춤 견적 의뢰하기</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
