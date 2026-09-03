import React, { useState } from 'react';
import { 
  Briefcase, Send, Clock, MapPin, Car, Sparkles, CheckCircle2, 
  AlertCircle, DollarSign, Filter, Search, Zap, Building2, User,
  Calendar, Check, X, ShieldCheck
} from 'lucide-react';
import { submitTechnicianBid } from '../utils/storage';
import confetti from 'canvas-confetti';

export const OrderMarket = ({ matchRequests, technicians, onBidSubmitted, onOpenRegisterModal }) => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [biddingRequest, setBiddingRequest] = useState(null);

  // Bid Form State
  const [selectedTechId, setSelectedTechId] = useState(technicians[0]?.id || '');
  const [bidPrice, setBidPrice] = useState(350000);
  const [estimatedHours, setEstimatedHours] = useState('약 4~5시간');
  const [proposalMessage, setProposalMessage] = useState('수성 듀얼 광택 전용 장비와 9H 세라믹 코팅제로 신차급 퀄리티를 보증합니다. (전면 발수코팅 무료 서비스)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter requests that are open for bidding
  const activeRequests = matchRequests.filter(req => {
    const matchRegion = selectedRegion === 'ALL' || (req.location && req.location.includes(selectedRegion));
    const matchSearch = searchTerm === '' ||
      req.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
  });

  const handleOpenBidModal = (req) => {
    setBiddingRequest(req);
    setBidPrice(req.budget || 350000);
    if (technicians.length > 0) {
      setSelectedTechId(technicians[0].id);
    }
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (!biddingRequest) return;

    const tech = technicians.find(t => t.id === selectedTechId) || {
      name: '인증 파트너 디테일러',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    };

    setIsSubmitting(true);

    try {
      submitTechnicianBid(biddingRequest.id, {
        techId: tech.id || selectedTechId,
        techName: tech.name,
        techAvatar: tech.avatar,
        techRating: tech.rating,
        bidPrice: Number(bidPrice),
        estimatedHours,
        message: proposalMessage
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onBidSubmitted) onBidSubmitted();
      setBiddingRequest(null);
      alert(`[${biddingRequest.carModel}] 의뢰에 견적 제안(${Number(bidPrice).toLocaleString()}원)이 성공적으로 제출되었습니다! 고객에게 알림이 전송됩니다.`);
    } catch (err) {
      console.error(err);
      alert('견적 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-market" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-4">
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          <span>디테일러 파트너 전용 실시간 오더 마켓</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          실시간 <span className="text-gradient">출장 시공 의뢰 수주 & 견적 제안</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          고객이 등록한 최신 출장 디테일링 의뢰를 확인하고, 내 일정과 동선에 맞는 일감에 맞춤 견적을 제안하세요.
        </p>
      </div>

      {/* Filter & Actions Bar */}
      <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="차종, 시공항목, 지역 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['ALL', '인천', '서울', '경기'].map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {reg === 'ALL' ? '전체 권역' : reg}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-slate-400">
            실시간 등록 오더: <strong className="text-emerald-400">{activeRequests.length}건</strong>
          </span>
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>기사 파트너 신규 등록</span>
          </button>
        </div>

      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeRequests.map(req => {
          const isMatched = req.status === 'MATCHED' || req.status === 'COMPLETED';
          const bidCount = req.bids?.length || 0;

          return (
            <div 
              key={req.id}
              className={`glass-card rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isMatched 
                  ? 'border-slate-800 opacity-70 bg-slate-950/40' 
                  : 'border-white/10 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                    {req.id}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {req.targetTechName && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                        {req.targetTechName}
                      </span>
                    )}
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      isMatched 
                        ? 'bg-slate-800 text-slate-400' 
                        : (bidCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse')
                    }`}>
                      {isMatched ? '매칭 완료' : (bidCount > 0 ? `제안 ${bidCount}건 접수` : '신규 의뢰 접수')}
                    </span>
                  </div>
                </div>

                {/* Car & Service */}
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>{req.carModel}</span>
                  {req.carColor && <span className="text-xs font-normal text-slate-400">({req.carColor})</span>}
                </h3>
                
                <p className="text-sm text-cyan-300 font-bold mt-1">
                  {req.serviceName}
                </p>

                {/* Location & Preferred Date */}
                <div className="mt-4 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{req.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>희망일시: <strong className="text-white">{req.preferredDate} ({req.preferredTime})</strong></span>
                  </div>
                </div>

                {/* Requirements Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium ${
                    req.hasOutlet ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    <Zap className="w-2.5 h-2.5" /> {req.hasOutlet ? '220V 콘센트 지원' : '전기시설 협의'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5 flex items-center gap-1">
                    <Building2 className="w-2.5 h-2.5" /> {req.isIndoor ? '지하/실내 주차장' : '야외 주차장'}
                  </span>
                </div>

                {/* Customer Notes */}
                {req.notes && (
                  <p className="mt-3 text-xs text-slate-400 line-clamp-2 bg-slate-900/30 p-2 rounded-lg italic">
                    "{req.notes}"
                  </p>
                )}
              </div>

              {/* Price & Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">고객 희망 예산</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {req.budget ? `${req.budget.toLocaleString()}원` : '협의 희망'}
                  </span>
                </div>

                {isMatched ? (
                  <span className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-lg bg-slate-800">
                    매칭 완료 ({req.matchedTechName})
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenBidModal(req)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>견적 제안하기</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {activeRequests.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">현재 등록된 의뢰가 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">고객이 새로운 시공 견적을 요청하면 실시간으로 표시됩니다.</p>
        </div>
      )}

      {/* Bidding Modal */}
      {biddingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0d121f] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-500/20">
            
            {/* Close */}
            <button
              onClick={() => setBiddingRequest(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <Send className="w-3.5 h-3.5" />
                <span>디테일러 맞춤 견적 제안</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                [{biddingRequest.carModel}] 견적서 제출
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {biddingRequest.serviceName} | {biddingRequest.location}
              </p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              
              {/* Select Technician Profile */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  제안자(기술자) 프로필 선택
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {technicians.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} 프로 ({t.badge} / 평점 {t.rating})
                    </option>
                  ))}
                </select>
              </div>

              {/* Proposed Price - Platform Standard Fixed */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>플랫폼 제도화 표준 정찰가 (오버차지 방지 고정)</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    정찰제 적용
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={`${Number(biddingRequest.budget || biddingRequest.estimatedPrice || 350000).toLocaleString()}원 (정찰제 고정)`}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-emerald-500/40 rounded-xl text-sm font-black text-emerald-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  * 고객 신뢰를 위해 플랫폼에서 정한 표준 정찰 금액으로만 수주 접수가 가능합니다.
                </p>
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  예상 소요 시간
                </label>
                <input
                  type="text"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="예: 약 4~5시간"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Proposal Message & Perks */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  고객 전달 메시지 및 시공 특전 (선택 유도)
                </label>
                <textarea
                  rows="3"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="보유 장비, 약재, 추가 제공 서비스(유막제거 등)를 작성해 주세요."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  required
                />
              </div>

              {/* Fee Notice */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">💡 매칭 수수료 및 정산 안내</p>
                <p>• 고객이 견적을 수락하여 매칭이 확정되면 현장 출장 일정이 고정됩니다.</p>
                <p>• 플랫폼 중개 수수료는 시공 완료 후 정산됩니다 (상생 수수료 10%).</p>
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBiddingRequest(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '제출 중...' : '견적 제안 제출하기'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
