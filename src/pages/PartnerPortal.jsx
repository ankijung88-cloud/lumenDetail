import React, { useState } from 'react';
import { 
  Briefcase, Send, Clock, MapPin, Car, Sparkles, CheckCircle2, 
  AlertCircle, DollarSign, Filter, Search, Zap, Building2, User,
  Calendar, Check, X, ShieldCheck, TrendingUp, Phone, ChevronRight,
  FileText, ArrowLeft, RefreshCw, Award, LogOut, Printer
} from 'lucide-react';
import { submitTechnicianBid, updateMatchStatus, getTechnicians } from '../utils/storage';
import { calculateSettlement } from '../utils/settlement';
import { SettlementModal } from '../components/SettlementModal';
import { TechnicianRegisterModal } from '../components/TechnicianRegisterModal';
import confetti from 'canvas-confetti';

export const PartnerPortal = ({ 
  matchRequests, 
  technicians, 
  onRefreshData, 
  onSwitchToCustomer,
  onGoToAdmin 
}) => {
  const [partnerTab, setPartnerTab] = useState('market'); // 'market' | 'myJobs' | 'settlement' | 'profile'
  const [selectedTechId, setSelectedTechId] = useState(technicians[0]?.id || 'TECH-001');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [biddingRequest, setBiddingRequest] = useState(null);
  const [settlementModalReq, setSettlementModalReq] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Proposal State
  const [estimatedHours, setEstimatedHours] = useState('약 4~5시간');
  const [proposalMessage, setProposalMessage] = useState('수성 듀얼 광택 전용 장비와 9H 세라믹 코팅제로 신차급 퀄리티를 보증합니다. (전면 발수코팅 무료 서비스)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTech = technicians.find(t => t.id === selectedTechId) || technicians[0] || {
    id: 'TECH-001',
    name: '김태진',
    badge: '마스터 디테일러',
    rating: 4.98,
    reviewCount: 142,
    baseLocation: '인천 서구 청라국제도시',
    region: '인천/서부권',
    experienceYears: 9,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specialties: ['수성 듀얼 광택', '9H 세라믹 코팅', '유막제거 및 발수']
  };

  // 1. Available Open Market Orders
  const availableOrders = matchRequests.filter(req => {
    const matchRegion = selectedRegion === 'ALL' || (req.location && req.location.includes(selectedRegion));
    const matchSearch = searchTerm === '' ||
      req.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
  });

  // 2. My Assigned Jobs
  const myAssignedJobs = matchRequests.filter(req => 
    req.matchedTechId === currentTech.id || 
    req.matchedTechName?.includes(currentTech.name) ||
    (req.bids && req.bids.some(b => b.techId === currentTech.id))
  );

  // 3. Settlement Statistics for Current Tech
  const completedJobs = myAssignedJobs.filter(r => r.status === 'COMPLETED' || r.isPaid);
  const myTotalGrossSales = completedJobs.reduce((acc, cur) => acc + (Number(cur.matchedPrice || cur.budget || cur.estimatedPrice || 350000)), 0);
  const myTotalPlatformFee = Math.round(myTotalGrossSales * 0.10);
  const myTotalWithholdingTax = Math.round(myTotalGrossSales * 0.90 * 0.033);
  const myTotalNetPayout = myTotalGrossSales - myTotalPlatformFee - myTotalWithholdingTax;

  const handleOpenBidModal = (req) => {
    setBiddingRequest(req);
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    if (!biddingRequest) return;

    setIsSubmitting(true);
    try {
      submitTechnicianBid(biddingRequest.id, {
        techId: currentTech.id,
        techName: currentTech.name,
        techAvatar: currentTech.avatar,
        techRating: currentTech.rating,
        bidPrice: Number(biddingRequest.budget || biddingRequest.estimatedPrice || 350000),
        estimatedHours,
        message: proposalMessage
      });

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onRefreshData) onRefreshData();
      setBiddingRequest(null);
      alert(`[${biddingRequest.carModel}] 의뢰에 맞춤 제안이 성공적으로 전달되었습니다! 고객에게 알림이 전송됩니다.`);
    } catch (err) {
      console.error(err);
      alert('제안 제출 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateJobStatus = (reqId, newStatus) => {
    updateMatchStatus(reqId, newStatus);
    if (onRefreshData) onRefreshData();
    alert(`의뢰 상태가 [${newStatus === 'COMPLETED' ? '시공 완료' : '출장 시공중'}]으로 변경되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Partner Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f1d]/95 backdrop-blur-md border-b border-emerald-500/20 shadow-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Briefcase className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">LUMEN PARTNER</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  기사 전용 포털
                </span>
              </div>
              <p className="text-[10px] text-slate-400">출장 디테일러 실시간 오더 수주 및 정산 관리 시스템</p>
            </div>
          </div>

          {/* Current Tech Profile Selector & Switcher */}
          <div className="flex items-center gap-3">
            {/* Active Tech Selector */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 pr-3 rounded-xl border border-white/10">
              <img 
                src={currentTech.avatar} 
                alt={currentTech.name} 
                className="w-7 h-7 rounded-lg object-cover border border-emerald-400"
              />
              <select
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {technicians.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name} 프로 ({t.baseLocation || t.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Switch to Customer Portal Button */}
            <button
              onClick={onSwitchToCustomer}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
              title="고객용 화면으로 이동"
            >
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>고객 포털 가기</span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#090d18] border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2 text-xs font-bold">
          <button
            onClick={() => setPartnerTab('market')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              partnerTab === 'market'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>실시간 오더 마켓 ({availableOrders.length})</span>
          </button>

          <button
            onClick={() => setPartnerTab('myJobs')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              partnerTab === 'myJobs'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>내 수주 & 시공 일정 ({myAssignedJobs.length})</span>
          </button>

          <button
            onClick={() => setPartnerTab('settlement')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              partnerTab === 'settlement'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>정산 명세서 (10% 수수료/3.3% 세무)</span>
          </button>

          <button
            onClick={() => setPartnerTab('profile')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              partnerTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>내 프로필 & 거점 관리</span>
          </button>
        </div>
      </div>

      {/* Main Partner Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ==================== TAB 1: ORDER MARKET (오더 마켓) ==================== */}
        {partnerTab === 'market' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Market Top Filter Bar */}
            <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="차종, 시공항목, 출장지 검색..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  {['ALL', '인천', '서울', '경기'].map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedRegion === r
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r === 'ALL' ? '전체 권역' : r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
                <span className="text-slate-400">
                  수주 가능 오더: <strong className="text-emerald-400">{availableOrders.length}건</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  🛡️ 전 오더 표준 정찰가 (오버차지 0원 고정)
                </span>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableOrders.map(req => {
                const isMatched = req.status === 'MATCHED' || req.status === 'COMPLETED';
                const standardPrice = Number(req.budget || req.estimatedPrice || 350000);
                const settlement = calculateSettlement(standardPrice);

                return (
                  <div
                    key={req.id}
                    className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
                  >
                    <div>
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                          {req.id}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isMatched 
                            ? 'bg-slate-800 text-slate-400' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                        }`}>
                          {isMatched ? '매칭 완료' : '신규 의뢰 접수'}
                        </span>
                      </div>

                      {/* Car & Service */}
                      <h4 className="text-lg font-black text-white flex items-center gap-2">
                        <Car className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span>{req.carModel}</span>
                      </h4>
                      <p className="text-sm text-cyan-300 font-bold mt-1">{req.serviceName}</p>

                      {/* Location & Preferred Date */}
                      <div className="mt-4 space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-slate-300">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{req.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>희망일시: <strong className="text-white">{req.preferredDate} ({req.preferredTime})</strong></span>
                        </div>
                      </div>

                      {/* Environment Badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-medium">
                          <Zap className="w-2.5 h-2.5" /> {req.hasOutlet ? '220V 콘센트 지원' : '전기시설 협의'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5 flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" /> {req.isIndoor ? '지하/실내 주차장' : '야외 주차장'}
                        </span>
                      </div>
                    </div>

                    {/* Regulated Price & Payout Preview */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">정찰제 시공 매출</span>
                          <strong className="text-base font-black text-white">{standardPrice.toLocaleString()}원</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-400 font-bold block">기사 예상 실수령액</span>
                          <strong className="text-base font-black text-emerald-400">
                            {settlement.techNetPayout.toLocaleString()}원
                          </strong>
                          <span className="text-[9px] text-slate-500 block">(수수료 10% / 세금 3.3% 공제후)</span>
                        </div>
                      </div>

                      {isMatched ? (
                        <span className="block text-center py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
                          매칭 완료 ({req.matchedTechName})
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenBidModal(req)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>맞춤 제안서 발송하기</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {availableOrders.length === 0 && (
              <div className="text-center py-16 glass-card rounded-2xl border border-white/10 text-slate-400">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-slate-300">현재 등록된 의뢰가 없습니다.</p>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: MY JOBS (내 수주 일정 & 시공 관리) ==================== */}
        {partnerTab === 'myJobs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">[{currentTech.name} 프로] 배정 시공 일정</h3>
                <p className="text-xs text-slate-400 mt-0.5">매칭이 확정된 고객 시공 일정을 확인하고 시공 완료 처리를 진행하세요.</p>
              </div>
            </div>

            <div className="space-y-4">
              {myAssignedJobs.map(job => {
                const standardPrice = Number(job.matchedPrice || job.budget || job.estimatedPrice || 350000);
                const settlement = calculateSettlement(standardPrice);
                const isCompleted = job.status === 'COMPLETED';

                return (
                  <div key={job.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                          {job.id}
                        </span>
                        <h4 className="font-black text-white text-base">{job.carModel}</h4>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                        isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                      }`}>
                        {isCompleted ? '✓ 시공 및 결제 완료' : '출장 시공 대기/진행중'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div className="bg-slate-900/60 p-3 rounded-xl space-y-1">
                        <span className="text-slate-500 font-bold block">고객 정보</span>
                        <p className="font-bold text-white text-sm">{job.customerName}</p>
                        <p className="text-cyan-300 font-semibold">{job.phone}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl space-y-1">
                        <span className="text-slate-500 font-bold block">출장 주소 및 일정</span>
                        <p className="text-white font-semibold">{job.location}</p>
                        <p className="text-emerald-400 font-bold">{job.preferredDate} ({job.preferredTime})</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl space-y-1">
                        <span className="text-slate-500 font-bold block">정산 및 실수령액</span>
                        <p className="text-slate-400">총 시공비: {standardPrice.toLocaleString()}원</p>
                        <p className="text-emerald-400 font-black text-sm">실수령: {settlement.techNetPayout.toLocaleString()}원</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setSettlementModalReq(job)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>정산 명세서 확인</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {!isCompleted ? (
                          <button
                            onClick={() => handleUpdateJobStatus(job.id, 'COMPLETED')}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                          >
                            <Check className="w-4 h-4" />
                            <span>시공 완료 처리하기</span>
                          </button>
                        ) : (
                          <span className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
                            시공 완료 완료됨
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {myAssignedJobs.length === 0 && (
                <div className="text-center py-16 glass-card rounded-2xl border border-white/10 text-slate-400 text-xs">
                  <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-300">현재 배정된 시공 일정이 없습니다.</p>
                  <p className="text-slate-500 mt-1">오더 마켓 탭에서 새로운 의뢰에 맞춤 제안을 제출해 보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SETTLEMENT LEDGER (정산 장부) ==================== */}
        {partnerTab === 'settlement' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* KPI Cards for Current Tech */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-white/10">
                <span className="text-xs text-slate-400 font-bold block">누적 시공 완료 매출 (100%)</span>
                <p className="text-2xl font-black text-white mt-1.5">{myTotalGrossSales.toLocaleString()}원</p>
                <span className="text-[10px] text-slate-500 mt-1 block">완료 {completedJobs.length}건 기준</span>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
                <span className="text-xs text-cyan-300 font-bold block">플랫폼 중개 수수료 (10%)</span>
                <p className="text-2xl font-black text-cyan-400 mt-1.5">-{myTotalPlatformFee.toLocaleString()}원</p>
                <span className="text-[10px] text-cyan-300/70 mt-1 block">상생 중개 수수료</span>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20">
                <span className="text-xs text-rose-300 font-bold block">사업소득 원천세 (3.3%)</span>
                <p className="text-2xl font-black text-rose-400 mt-1.5">-{myTotalWithholdingTax.toLocaleString()}원</p>
                <span className="text-[10px] text-rose-300/70 mt-1 block">국세청 원천징수 납부액</span>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-xs text-emerald-300 font-bold block">기사 최종 실입금액 (Net)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1.5">{myTotalNetPayout.toLocaleString()}원</p>
                <span className="text-[10px] text-emerald-300/70 mt-1 block">매월 10일 등록 계좌 송금</span>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>[{currentTech.name} 프로] 건별 정산 지급 명세서</span>
                </h4>
                <span className="text-xs text-slate-400">정산 대상: <strong className="text-emerald-400">{completedJobs.length}건</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[11px]">
                    <tr>
                      <th className="py-3 px-4">의뢰번호 / 시공일</th>
                      <th className="py-3 px-4">시공차종 / 서비스</th>
                      <th className="py-3 px-4 text-right">총 매출액</th>
                      <th className="py-3 px-4 text-right text-cyan-400">수수료(10%)</th>
                      <th className="py-3 px-4 text-right text-rose-400">원천세(3.3%)</th>
                      <th className="py-3 px-4 text-right text-emerald-400">실지급액</th>
                      <th className="py-3 px-4 text-center">정산상태</th>
                      <th className="py-3 px-4 text-center">명세서</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {completedJobs.map(job => {
                      const standardPrice = Number(job.matchedPrice || job.budget || job.estimatedPrice || 350000);
                      const st = calculateSettlement(standardPrice);
                      const isSettled = job.settlementStatus === 'SETTLED';

                      return (
                        <tr key={job.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-white">{job.id}</td>
                          <td className="py-3 px-4">{job.carModel} ({job.serviceName})</td>
                          <td className="py-3 px-4 text-right font-bold text-white">{st.gmv.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-semibold">-{st.platformFee.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-right text-rose-400 font-semibold">-{st.withholdingTax.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-black text-sm">{st.techNetPayout.toLocaleString()}원</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                              isSettled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            }`}>
                              {isSettled ? '입금완료' : '정산대기'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSettlementModalReq(job)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold border border-cyan-500/30"
                            >
                              명세서
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: PROFILE & BASE SETTINGS ==================== */}
        {partnerTab === 'profile' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-5">
              <div className="flex items-center gap-4">
                <img 
                  src={currentTech.avatar} 
                  alt={currentTech.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{currentTech.name} 프로</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                      {currentTech.badge || '마스터 디테일러'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{currentTech.phone} | 경력 {currentTech.experienceYears}년차</p>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-slate-900/60 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">활동 거점 주소</span>
                  <strong className="text-white">{currentTech.baseLocation || '인천 서구 청라국제도시'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">활동 권역 (Zone)</span>
                  <span className="text-cyan-300 font-semibold">{currentTech.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">전문 시공 분야</span>
                  <span className="text-slate-200">{currentTech.specialties?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">고객 평점 / 리뷰</span>
                  <span className="text-amber-400 font-bold">★ {currentTech.rating} ({currentTech.reviewCount}건)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10"
                >
                  신규 기사 파트너 추가 등록
                </button>
                <button
                  onClick={onSwitchToCustomer}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20"
                >
                  고객 포털 확인하기
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Bidding Modal */}
      {biddingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#0d121f] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setBiddingRequest(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <Send className="w-3.5 h-3.5" />
                <span>디테일러 맞춤 견적 제안</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">[{biddingRequest.carModel}] 제안서 작성</h3>
              <p className="text-xs text-slate-400 mt-1">{biddingRequest.serviceName} | {biddingRequest.location}</p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">제안 기술자</label>
                <input
                  type="text"
                  value={`${currentTech.name} 프로 (${currentTech.badge})`}
                  readOnly
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>플랫폼 제도화 표준 정찰가 (오버차지 0원 고정)</span>
                </label>
                <input
                  type="text"
                  value={`${Number(biddingRequest.budget || biddingRequest.estimatedPrice || 350000).toLocaleString()}원 (정찰제 고정)`}
                  readOnly
                  className="w-full p-2.5 bg-slate-900 border border-emerald-500/40 rounded-xl text-emerald-400 font-black"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">예상 소요 시간</label>
                <input
                  type="text"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="예: 약 4~5시간"
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">고객 전달 메시지 및 시공 특전 (선택 유도)</label>
                <textarea
                  rows="3"
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBiddingRequest(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '전송 중...' : '맞춤 제안서 발송'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <SettlementModal
        isOpen={Boolean(settlementModalReq)}
        onClose={() => setSettlementModalReq(null)}
        request={settlementModalReq}
      />

      <TechnicianRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegistered={() => {
          if (onRefreshData) onRefreshData();
        }}
      />

    </div>
  );
};
