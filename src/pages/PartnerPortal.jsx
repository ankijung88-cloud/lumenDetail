import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Send, Clock, MapPin, Car, Sparkles, CheckCircle2, 
  AlertCircle, DollarSign, Filter, Search, Zap, Building2, User,
  Calendar, Check, X, ShieldCheck, TrendingUp, Phone, ChevronRight,
  FileText, ArrowLeft, RefreshCw, Award, LogOut, Printer, Lock,
  KeyRound, UserCheck, ShieldAlert
} from 'lucide-react';
import { 
  submitTechnicianBid, updateMatchStatus, getTechnicians, 
  getLoggedInTechnician, getLoggedInTechId, setLoggedInTechnician,
  loginTechnician, logoutTechnician, updateTechnician
} from '../utils/storage';
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
  
  // Authentication State for Technician
  const [loggedInTech, setLoggedInTech] = useState(() => getLoggedInTechnician());
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  
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

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: '',
    pin: '',
    baseLocation: '',
    region: '',
    specialties: '',
    introduction: ''
  });

  useEffect(() => {
    const current = getLoggedInTechnician();
    if (current) {
      setLoggedInTech(current);
      setProfileForm({
        phone: current.phone || '',
        pin: current.pin || current.password || '1234',
        baseLocation: current.baseLocation || '',
        region: current.region || '',
        specialties: current.specialties ? current.specialties.join(', ') : '',
        introduction: current.introduction || ''
      });
    }
  }, [technicians]);

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginPhone.trim()) {
      setLoginError('휴대폰 번호 또는 기사 이름을 입력해주세요.');
      return;
    }

    const res = loginTechnician(loginPhone, loginPin, rememberMe);
    if (res.success) {
      setLoggedInTech(res.tech);
      setLoginPhone('');
      setLoginPin('');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setLoginError(res.message || '인증에 실패했습니다.');
    }
  };

  // Fast Demo Login
  const handleFastDemoLogin = (tech) => {
    setLoggedInTechnician(tech.id, rememberMe);
    setLoggedInTech(tech);
    setLoginError('');
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  // Handle Logout
  const handleLogout = () => {
    logoutTechnician();
    setLoggedInTech(null);
    alert('기사 파트너 계정에서 완전히 로그아웃되었습니다. (자동로그인이 해제되었습니다)');
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!loggedInTech) return;
    
    const updated = updateTechnician(loggedInTech.id, {
      phone: profileForm.phone,
      pin: profileForm.pin,
      baseLocation: profileForm.baseLocation,
      region: profileForm.region,
      specialties: profileForm.specialties.split(',').map(s => s.trim()),
      introduction: profileForm.introduction
    });
    
    if (onRefreshData) onRefreshData();
    const refreshed = updated.find(t => t.id === loggedInTech.id);
    if (refreshed) setLoggedInTech(refreshed);
    setIsEditingProfile(false);
    alert('프로필 및 보안 PIN 설정이 성공적으로 저장되었습니다.');
  };

  // ==================== AUTH GATE: If Not Logged In ====================
  if (!loggedInTech) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center p-4 font-sans selection:bg-emerald-500 selection:text-slate-950">
        
        {/* Top Back Nav */}
        <div className="w-full max-w-md flex justify-between items-center mb-6">
          <button
            onClick={onSwitchToCustomer}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>고객 포털로 돌아가기</span>
          </button>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            기사 전용 보안 게이트
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md glass-card border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl bg-[#090e1a]/95">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 mb-3">
              <KeyRound className="w-6 h-6 text-slate-950" />
            </div>
            <h2 className="text-2xl font-black text-white">기사 파트너 전용 로그인</h2>
            <p className="text-xs text-slate-400 mt-1">
              각 기술자는 본인의 수주 오더, 시공 일정, 정산 명세서에만 접근할 수 있습니다.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">등록된 휴대폰 번호 또는 기사명</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="예: 010-8472-1928 또는 김태진"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">비밀번호 / PIN 번호</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="기본: 1234 (또는 핸드폰 뒤 4자리)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Auto Login Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer accent-emerald-500"
                />
                <span className="text-slate-300 text-xs font-semibold">자동 로그인 유지</span>
              </label>
              <span className="text-[10px] text-slate-500">(체크 해제 시 창 닫거나 로그아웃 시 해제)</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>기사 파트너 로그인</span>
            </button>
          </form>

          {/* 1-Click Demo Profiles for Evaluation */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-bold block mb-2 text-center">
              ⚡ 빠른 체험용 원클릭 파트너 로그인 (권한 분리 테스트)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {technicians.slice(0, 3).map(tech => (
                <button
                  key={tech.id}
                  onClick={() => handleFastDemoLogin(tech)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col items-center text-center group"
                >
                  <img 
                    src={tech.avatar} 
                    alt={tech.name} 
                    className="w-8 h-8 rounded-full object-cover border border-emerald-400/50 mb-1 group-hover:scale-105 transition-transform" 
                  />
                  <span className="text-xs font-bold text-white block">{tech.name} 프로</span>
                  <span className="text-[10px] text-emerald-400 block">{tech.region?.split('/')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Partner Registration Trigger */}
          <div className="mt-5 text-center">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-xs text-cyan-300 hover:text-cyan-200 underline"
            >
              아직 파트너 기사로 등록되지 않으셨나요? [기사 지원 신청]
            </button>
          </div>
        </div>

        {/* Modal */}
        <TechnicianRegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegistered={() => {
            if (onRefreshData) onRefreshData();
          }}
        />
      </div>
    );
  }

  // ==================== AUTHENTICATED PARTNER VIEW ====================

  // 1. Available Open Market Orders (Filtered by relevance)
  const availableOrders = matchRequests.filter(req => {
    const matchRegion = selectedRegion === 'ALL' || (req.location && req.location.includes(selectedRegion));
    const matchSearch = searchTerm === '' ||
      req.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRegion && matchSearch;
  });

  // 2. Strict Filter: My Assigned Jobs & Proposals Only
  const myAssignedJobs = matchRequests.filter(req => 
    req.matchedTechId === loggedInTech.id || 
    req.matchedTechName?.includes(loggedInTech.name) ||
    (req.bids && req.bids.some(b => b.techId === loggedInTech.id))
  );

  // 3. Strict Filter: Settlement Statistics for Authenticated Technician Only
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
    if (!biddingRequest || !loggedInTech) return;

    setIsSubmitting(true);
    try {
      submitTechnicianBid(biddingRequest.id, {
        techId: loggedInTech.id,
        techName: loggedInTech.name,
        techAvatar: loggedInTech.avatar,
        techRating: loggedInTech.rating,
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
      alert(`[${biddingRequest.carModel}] 의뢰에 [${loggedInTech.name} 프로] 명의로 맞춤 제안이 성공적으로 전달되었습니다!`);
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
              <p className="text-[10px] text-slate-400">출장 디테일러 실시간 오더 수주 및 개별 정산 관리 시스템</p>
            </div>
          </div>

          {/* Authenticated Tech Profile Info & Switcher */}
          <div className="flex items-center gap-3">
            {/* Logged in Tech Pill */}
            <div className="flex items-center gap-2 bg-slate-900/90 py-1.5 px-3 rounded-2xl border border-emerald-500/30 shadow-md">
              <img 
                src={loggedInTech.avatar} 
                alt={loggedInTech.name} 
                className="w-7 h-7 rounded-full object-cover border-2 border-emerald-400"
              />
              <div>
                <span className="text-xs font-black text-white flex items-center gap-1">
                  {loggedInTech.name} 프로
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-normal">
                    {loggedInTech.region}
                  </span>
                </span>
                <span className="text-[9px] text-slate-400 block">{loggedInTech.phone}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>

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
            <span>내 정산 장부 (10% 수수료/3.3% 세무)</span>
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
            <span>내 프로필 & 보안 PIN 관리</span>
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
                const hasMyBid = req.bids && req.bids.some(b => b.techId === loggedInTech.id);
                const isAssignedToMe = req.matchedTechId === loggedInTech.id;
                const standardPrice = Number(req.budget || req.estimatedPrice || 350000);
                const settlement = calculateSettlement(standardPrice);

                return (
                  <div
                    key={req.id}
                    className={`glass-card rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-xl ${
                      isAssignedToMe 
                        ? 'border-cyan-500/50 bg-cyan-950/20' 
                        : (hasMyBid ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10 hover:border-emerald-500/40')
                    }`}
                  >
                    <div>
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                          {req.id}
                        </span>
                        
                        {isAssignedToMe ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            ★ 나에게 배정 확정됨
                          </span>
                        ) : hasMyBid ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ✓ 내 제안 발송 완료
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                            신규 의뢰 접수
                          </span>
                        )}
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
                          <span className="text-[10px] text-emerald-400 font-bold block">기사 실수령액</span>
                          <strong className="text-base font-black text-emerald-400">
                            {settlement.techNetPayout.toLocaleString()}원
                          </strong>
                          <span className="text-[9px] text-slate-500 block">(10% 수수료 / 3.3% 원천세 공제)</span>
                        </div>
                      </div>

                      {isMatched && !isAssignedToMe ? (
                        <span className="block text-center py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold">
                          매칭 완료됨
                        </span>
                      ) : hasMyBid ? (
                        <button
                          onClick={() => handleOpenBidModal(req)}
                          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>제안 수정 및 재발송</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenBidModal(req)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>[{loggedInTech.name} 프로] 명의로 제안서 발송</span>
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
                <p className="font-bold text-slate-300">현재 조건에 맞는 의뢰가 없습니다.</p>
              </div>
            )}

          </div>
        )}

        {/* ==================== TAB 2: MY JOBS (본인 배정 수주 & 시공 일정) ==================== */}
        {partnerTab === 'myJobs' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">[{loggedInTech.name} 프로] 본인 배정 시공 일정</h3>
                <p className="text-xs text-slate-400 mt-0.5">본인에게 매칭 확정된 의뢰만 표시되며, 고객 연락처 확인 및 시공 완료 처리를 진행할 수 있습니다.</p>
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
                            시공 완료 처리됨
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
                  <p className="font-bold text-slate-300">현재 [{loggedInTech.name} 프로] 님에게 배정된 시공 일정이 없습니다.</p>
                  <p className="text-slate-500 mt-1">오더 마켓 탭에서 새로운 의뢰에 맞춤 제안을 제출해 보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SETTLEMENT LEDGER (본인 전용 정산 장부) ==================== */}
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
                  <span>[{loggedInTech.name} 프로] 본인 건별 정산 지급 명세서</span>
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

        {/* ==================== TAB 4: PROFILE & SECURITY PIN SETTINGS ==================== */}
        {partnerTab === 'profile' && (
          <div className="space-y-6 max-w-3xl animate-fadeIn">
            
            <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <img 
                    src={loggedInTech.avatar} 
                    alt={loggedInTech.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-white">{loggedInTech.name} 프로</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                        {loggedInTech.badge || '마스터 디테일러'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{loggedInTech.phone} | 경력 {loggedInTech.experienceYears}년차</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 self-start sm:self-auto"
                >
                  {isEditingProfile ? '취소' : '프로필 & PIN 수정'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="space-y-3 text-xs bg-slate-900/60 p-5 rounded-2xl border border-white/5">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-bold">활동 거점 주소</span>
                    <strong className="text-white">{loggedInTech.baseLocation || '인천 서구 청라국제도시'}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-bold">활동 권역 (Zone)</span>
                    <span className="text-cyan-300 font-semibold">{loggedInTech.region}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-bold">전문 시공 분야</span>
                    <span className="text-slate-200">{loggedInTech.specialties?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-bold">고객 평점 / 리뷰</span>
                    <span className="text-amber-400 font-bold">★ {loggedInTech.rating} ({loggedInTech.reviewCount}건)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400 font-bold">보안 PIN (로그인용)</span>
                    <span className="text-emerald-400 font-mono font-bold">•••• (설정됨)</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-400 font-bold block mb-1">한줄 소개</span>
                    <p className="text-slate-300 leading-relaxed">{loggedInTech.introduction}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs bg-slate-900/60 p-5 rounded-2xl border border-cyan-500/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">휴대폰 번호 (로그인 ID)</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">로그인 비밀번호 / PIN</label>
                      <input
                        type="password"
                        value={profileForm.pin}
                        onChange={(e) => setProfileForm({ ...profileForm, pin: e.target.value })}
                        placeholder="새 비밀번호 입력"
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">활동 거점 주소</label>
                      <input
                        type="text"
                        value={profileForm.baseLocation}
                        onChange={(e) => setProfileForm({ ...profileForm, baseLocation: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">활동 권역</label>
                      <input
                        type="text"
                        value={profileForm.region}
                        onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">전문 시공 분야 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={profileForm.specialties}
                      onChange={(e) => setProfileForm({ ...profileForm, specialties: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">소개글</label>
                    <textarea
                      rows="3"
                      value={profileForm.introduction}
                      onChange={(e) => setProfileForm({ ...profileForm, introduction: e.target.value })}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/25"
                    >
                      변경사항 저장
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>파트너 계정 로그아웃</span>
                </button>
                <button
                  onClick={onSwitchToCustomer}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10"
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
                <label className="block font-bold text-slate-300 mb-1">제안 기술자 (인증된 본인 계정)</label>
                <input
                  type="text"
                  value={`${loggedInTech.name} 프로 (${loggedInTech.badge || '1급 디테일러'})`}
                  readOnly
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 mb-1 flex items-center gap-1">
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
