import React, { useState, useEffect } from 'react';
import { 
  X, Search, CheckCircle2, Clock, Car, User, Phone, 
  MapPin, Star, Send, ShieldCheck, ArrowRight, Sparkles, AlertCircle,
  Navigation, Check, RefreshCw, CreditCard, FileText, DollarSign, Lock,
  RotateCcw
} from 'lucide-react';
import { 
  acceptMatchBid, switchMatchedTechnician, getTechnicians, 
  updateMatchPayment, getLoggedInCustomer, getMatchRequests, getBookings,
  updateMatchStatus
} from '../utils/storage';
import { calculateSettlement } from '../utils/settlement';
import { PaymentModal } from './PaymentModal';
import { SettlementModal } from './SettlementModal';
import confetti from 'canvas-confetti';

const STATUS_STEPS = [
  { key: 'OPEN', label: '의뢰 접수', desc: '고객님의 시공 견적 의뢰가 정상 접수되었습니다.' },
  { key: 'BIDDING', label: '기사 배정중', desc: '인근 1급 마스터 기술자에게 오더가 전달되어 매칭 진행 중입니다.' },
  { key: 'MATCHED', label: '매칭 확정', desc: '담당 기술자와 매칭이 확정되어 출장 시공 일정이 배정되었습니다.' },
  { key: 'IN_PROGRESS', label: '출장 시공중', desc: '기술자님이 고객님 주소지에 방문하여 정밀 수성 광택 시공을 진행 중입니다.' },
  { key: 'COMPLETED', label: '시공 완료', desc: '모든 시공 및 품질 검수가 완료되었습니다. 안심 결제가 가능합니다.' }
];

export const MatchTrackerModal = ({ isOpen, onClose, matchRequests = [], onBidAccepted }) => {
  const customer = getLoggedInCustomer();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null); // null when not searched, array when searched
  const [searchError, setSearchError] = useState('');
  const [allRequests, setAllRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [techniciansList, setTechniciansList] = useState([]);

  // Load fresh requests & technicians whenever modal is opened
  const loadFreshData = () => {
    const rawMatches = getMatchRequests() || [];
    const rawBookings = getBookings() || [];
    
    // Ensure all requests from matchRequests and bookings are unified
    const unifiedMap = new Map();
    rawMatches.forEach(req => unifiedMap.set(req.id, req));
    rawBookings.forEach(bk => {
      if (!unifiedMap.has(bk.id)) {
        unifiedMap.set(bk.id, {
          id: bk.id,
          createdAt: bk.createdAt || new Date().toISOString(),
          customerName: bk.customerName || '고객님',
          phone: bk.phone || '',
          carModel: bk.carModel || '차종 정보 없음',
          serviceName: bk.serviceName || '수성 듀얼 광택',
          location: bk.location || '출장지 미지정',
          preferredDate: bk.preferredDate || '',
          preferredTime: bk.preferredTime || '',
          notes: bk.notes || '',
          status: bk.status === '확정' ? 'MATCHED' : (bk.status === '완료' ? 'COMPLETED' : 'BIDDING'),
          matchedTechName: bk.adminMemo?.includes('매칭:') ? bk.adminMemo.replace('매칭:', '').trim() : null,
          matchedPrice: bk.estimatedPrice || 343000,
          budget: bk.estimatedPrice || 343000,
          estimatedPrice: bk.estimatedPrice || 343000,
          bids: []
        });
      }
    });

    const unifiedList = Array.from(unifiedMap.values());
    setAllRequests(unifiedList);
    setTechniciansList(getTechnicians() || []);
    return unifiedList;
  };

  useEffect(() => {
    if (isOpen) {
      const list = loadFreshData();

      // If search query is currently entered, automatically re-run search against fresh data
      if (searchQuery.trim()) {
        executeSearch(searchQuery.trim(), list);
      } else {
        // Compute default customer requests
        const currentCust = getLoggedInCustomer();
        if (currentCust) {
          const cleanCustPhone = (currentCust.phone || '').replace(/\D/g, '');
          const custReqs = list.filter(req => {
            const cleanReqPhone = (req.phone || '').replace(/\D/g, '');
            return (cleanCustPhone && cleanCustPhone === cleanReqPhone) || req.customerName === currentCust.name;
          });
          if (custReqs.length > 0) {
            setActiveRequest(prev => (prev && custReqs.find(r => r.id === prev.id)) ? prev : custReqs[0]);
          } else {
            setActiveRequest(list[0] || null);
          }
        } else {
          setActiveRequest(list[0] || null);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Search logic
  const executeSearch = (query, requestSource = allRequests) => {
    setSearchError('');
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    const trimmed = query.trim().toLowerCase();
    const cleanDigits = query.replace(/\D/g, '');

    const matches = requestSource.filter(req => {
      const reqId = (req.id || '').toLowerCase();
      const reqPhoneDigits = (req.phone || '').replace(/\D/g, '');
      const reqCustName = (req.customerName || '').toLowerCase();
      const reqCar = (req.carModel || '').toLowerCase();

      // 1. Phone matching (partial or full digit match)
      const phoneMatch = cleanDigits.length >= 4 && (
        reqPhoneDigits.includes(cleanDigits) || 
        cleanDigits.includes(reqPhoneDigits)
      );

      // 2. Request ID matching
      const idMatch = reqId.includes(trimmed);

      // 3. Customer name matching
      const nameMatch = reqCustName.includes(trimmed);

      // 4. Car model matching
      const carMatch = reqCar.includes(trimmed);

      return phoneMatch || idMatch || nameMatch || carMatch;
    });

    setSearchResults(matches);

    if (matches.length > 0) {
      setActiveRequest(matches[0]);
    } else {
      setActiveRequest(null);
      setSearchError(`'${query}'에 해당하는 등록된 의뢰를 찾을 수 없습니다. 휴대폰 번호 또는 의뢰 번호를 다시 확인해 주세요.`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const freshList = loadFreshData();
    executeSearch(searchQuery, freshList);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError('');
    const freshList = loadFreshData();
    const currentCust = getLoggedInCustomer();
    if (currentCust) {
      const cleanCustPhone = (currentCust.phone || '').replace(/\D/g, '');
      const custReqs = freshList.filter(req => {
        const cleanReqPhone = (req.phone || '').replace(/\D/g, '');
        return (cleanCustPhone && cleanCustPhone === cleanReqPhone) || req.customerName === currentCust.name;
      });
      setActiveRequest(custReqs[0] || freshList[0] || null);
    } else {
      setActiveRequest(freshList[0] || null);
    }
  };

  const handleSelectTech = (techId, techName) => {
    if (!activeRequest) return;
    if (window.confirm(`[${techName}] 프로님으로 기술자를 변경 및 확정하시겠습니까? (플랫폼 제도화 정찰가 동일 적용)`)) {
      switchMatchedTechnician(activeRequest.id, techId);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      
      // Update local state immediately
      const freshList = loadFreshData();
      const updatedReq = freshList.find(r => r.id === activeRequest.id);
      if (updatedReq) {
        setActiveRequest(updatedReq);
      } else {
        setActiveRequest(prev => ({
          ...prev,
          status: 'MATCHED',
          matchedTechId: techId,
          matchedTechName: `${techName} 프로`
        }));
      }

      if (onBidAccepted) onBidAccepted();
      alert(`🎉 [${techName}] 프로님과의 매칭이 확정되었습니다! 담당 기사님이 확인 전화를 드릴 예정입니다.`);
    }
  };

  const handleStepClick = (stepKey) => {
    if (!activeRequest) return;
    if (activeRequest.status === stepKey) return;

    updateMatchStatus(activeRequest.id, stepKey);

    if (stepKey === 'COMPLETED') {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    const updated = {
      ...activeRequest,
      status: stepKey
    };

    setActiveRequest(updated);
    setAllRequests(prev => prev.map(r => r.id === activeRequest.id ? updated : r));
    if (searchResults) {
      setSearchResults(prev => prev.map(r => r.id === activeRequest.id ? updated : r));
    }

    if (onBidAccepted) onBidAccepted();
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      handleStepClick(STATUS_STEPS[currentStepIdx - 1].key);
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < STATUS_STEPS.length - 1) {
      handleStepClick(STATUS_STEPS[currentStepIdx + 1].key);
    }
  };

  // Determine which list of requests to display as tabs
  const cleanCustPhone = customer ? (customer.phone || '').replace(/\D/g, '') : '';
  const customerRequests = customer
    ? allRequests.filter(req => {
        const cleanReqPhone = (req.phone || '').replace(/\D/g, '');
        return (cleanCustPhone && cleanCustPhone === cleanReqPhone) || req.customerName === customer.name;
      })
    : allRequests;

  const displayedRequests = searchResults !== null 
    ? searchResults 
    : (customerRequests.length > 0 ? customerRequests : allRequests);

  const currentStepIdx = activeRequest ? STATUS_STEPS.findIndex(s => s.key === activeRequest.status) : 0;
  const standardPrice = activeRequest ? (activeRequest.matchedPrice || activeRequest.budget || activeRequest.estimatedPrice || 343000) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0d121f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Search */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>플랫폼 표준 정찰가 제도 · 최단거리 자동 연결 및 직접 선택</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            내 의뢰 현황 & 담당 기술자 연결/변경
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            오버차지 없는 표준 정찰가로, 고객님 주소지 최단거리 기사가 1순위로 연결되며 원하시는 다른 기술자로도 자유롭게 변경하실 수 있습니다.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-4 flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="의뢰번호(REQ-...), 예약자 성함, 또는 휴대폰 번호 입력 (예: 010-7246-7211)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm transition-colors shrink-0 shadow-lg shadow-cyan-500/25"
            >
              조회하기
            </button>
            {searchResults !== null && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
                title="검색 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">초기화</span>
              </button>
            )}
          </form>
        </div>

        {/* Search Results / Status Alert */}
        {searchError && (
          <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Quick Request Selector Tabs */}
        {displayedRequests.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10 scrollbar-none">
            <span className="text-xs text-slate-400 shrink-0">
              {searchResults !== null 
                ? `🔍 검색 결과 (${searchResults.length}건):` 
                : (customer ? `${customer.name} 님의 의뢰:` : '최근 의뢰 목록:')}
            </span>
            {displayedRequests.map(req => (
              <button
                key={req.id}
                onClick={() => setActiveRequest(req)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeRequest?.id === req.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{req.carModel || '차량 의뢰'}</span>
                <span className="text-[10px] opacity-70">({req.id})</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 mb-6 rounded-2xl bg-slate-900/60 border border-white/10 text-center text-xs text-slate-400">
            {customer 
              ? `${customer.name} 고객님의 등록된 의뢰가 없습니다. 위 검색창에 휴대폰 번호(예: ${customer.phone || '010-XXXX-XXXX'})를 검색하시거나 스마트 견적을 신청해 보세요.` 
              : '등록된 의뢰가 없습니다. 위 검색창에 예약 시 입력하신 휴대폰 번호를 입력해 조회해 보세요.'}
          </div>
        )}

        {activeRequest ? (
          <div className="space-y-6">
            
            {/* Interactive Status Progress Bar */}
            <div className="bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-cyan-500/20 shadow-inner space-y-4">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-bold text-white">실시간 진행 단계 관리</span>
                  <span className="text-[11px] text-cyan-400 font-bold">({currentStepIdx + 1}/5 단계: {STATUS_STEPS[Math.max(0, currentStepIdx)]?.label})</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                  💡 단계를 직접 클릭하여 상태를 변경할 수 있습니다.
                </span>
              </div>

              <div className="flex items-center justify-between relative px-2 sm:px-4 py-2">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
                <div 
                  className="absolute top-1/2 left-6 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500 rounded-full shadow-lg shadow-cyan-500/40" 
                  style={{ width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 92}%` }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isPassed = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <button
                      key={step.key}
                      type="button"
                      onClick={() => handleStepClick(step.key)}
                      className="group flex flex-col items-center relative z-10 focus:outline-none transition-all"
                      title={`클릭하여 '${step.label}'(으)로 상태 변경`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-black transition-all transform group-hover:scale-110 cursor-pointer shadow-md ${
                        isCurrent 
                          ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/30 scale-110 shadow-lg shadow-cyan-500/40' 
                          : (isPassed ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/10')
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[11px] sm:text-xs font-bold mt-2 whitespace-nowrap transition-colors ${
                        isCurrent ? 'text-cyan-300 font-black' : (isPassed ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300')
                      }`}>
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Current Step Explanation & Step Controls */}
              <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start sm:items-center gap-2 text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold shrink-0">
                    단계 설명
                  </span>
                  <span className="text-slate-300 text-[11px] sm:text-xs">
                    {STATUS_STEPS[Math.max(0, currentStepIdx)]?.desc}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={currentStepIdx === 0}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 text-[11px] font-bold transition-all"
                  >
                    ◀ 이전
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={currentStepIdx === STATUS_STEPS.length - 1}
                    className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 text-[11px] font-extrabold transition-all shadow-md shadow-cyan-500/20"
                  >
                    다음 단계 ▶
                  </button>
                </div>
              </div>
            </div>

            {/* Request Details Box */}
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 mr-2">
                    {activeRequest.id}
                  </span>
                  <span className="text-sm font-extrabold text-white">
                    {activeRequest.carModel} ({activeRequest.carColor || '색상 미지정'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">제도화 표준 정찰가: </span>
                  <strong className="text-emerald-400 font-bold text-base">
                    {standardPrice.toLocaleString()}원
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">시공 항목:</span> <strong className="text-white">{activeRequest.serviceName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">출장 장소:</span> {activeRequest.location}
                </div>
                <div>
                  <span className="text-slate-400">희망 일시:</span> <strong className="text-cyan-300">{activeRequest.preferredDate} ({activeRequest.preferredTime})</strong>
                </div>
                <div>
                  <span className="text-slate-400">고객 성함:</span> {activeRequest.customerName} ({activeRequest.phone})
                </div>
              </div>

              {/* Current Matched Tech Banner & Payment Actions */}
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        현재 배정된 담당 기술자
                      </span>
                      <h5 className="text-sm font-black text-white mt-0.5">
                        {activeRequest.matchedTechName || '최단거리 기사 배정 대기'}
                      </h5>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 block">과다 청구 방지 확정가</span>
                    <span className="text-emerald-400 font-black text-base">{standardPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* Payment & Settlement Trigger Buttons */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setIsSettlementOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-cyan-300 text-[11px] font-semibold border border-cyan-500/20 flex items-center gap-1.5 transition-colors"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                    <span>정산 명세서 (수수료 10% / 세금 3.3% 투명 공개)</span>
                  </button>

                  {activeRequest.isPaid ? (
                    <button
                      onClick={() => setIsPaymentOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>결제 완료 (전자 영수증 보기)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPaymentOpen(true)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>시공 완료 안심 결제하기</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Technicians Real-time Proposal Comparison & Selection Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    <span>도착한 기사별 제안 및 메시지 실시간 비교 ({techniciansList.length}명 등록)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    기사별 제안 메시지와 시공 특전을 비교하신 후 마음에 드는 기사님을 선택(수락)해 주세요.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
                  🛡️ 전 기사 제도화 정찰가 ({standardPrice.toLocaleString()}원) 동일 적용
                </span>
              </div>

              {techniciansList.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-white/10 text-center space-y-2">
                  <p className="text-xs sm:text-sm text-slate-400">현재 등록된 파트너 기사가 없습니다.</p>
                  <p className="text-[11px] text-cyan-400">상단 메뉴의 '기사 파트너 등록'을 통해 파트너를 등록하시면 실시간 제안 비교가 활성화됩니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {techniciansList.map((tech, idx) => {
                    const existingBid = (activeRequest.bids || []).find(b => b.techId === tech.id);
                    const isCurrentlyMatched = activeRequest.matchedTechId === tech.id || activeRequest.matchedTechName?.includes(tech.name);
                    const isClosestFirst = idx === 0;

                    const message = existingBid?.message || 
                      (isClosestFirst 
                        ? `고객님 주소지와 가장 가까운 전담 마스터입니다. 1급 검증 수성 듀얼 광택 장비로 신차 이상의 광택을 보증하며, 전면 유리 유막제거 무료 서비스 함께 시공해 드립니다.`
                        : `수성 광택 표준 공정 및 9H 세라믹 코팅 전문 시공을 제공합니다. (타이어 드레싱 & 휠 세척 서비스 포함)`);

                    const estimatedHours = existingBid?.estimatedHours || 
                      (activeRequest.serviceName?.includes('VIP') ? '약 6~7시간' : (activeRequest.serviceName?.includes('3스텝') ? '약 5시간' : '약 2~3시간'));

                    return (
                      <div 
                        key={tech.id}
                        className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${
                          isCurrentlyMatched 
                            ? 'border-emerald-500/70 bg-gradient-to-r from-emerald-950/30 to-slate-900 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10' 
                            : 'border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* 1. Tech Profile Info */}
                          <div className="flex items-start gap-3.5">
                            <img 
                              src={tech.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'} 
                              alt={tech.name}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md shrink-0" 
                            />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-black text-white text-base">{tech.name} 프로</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-white/5">
                                  {tech.badge || '인증 디테일러'}
                                </span>
                                {isClosestFirst && (
                                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 animate-pulse">
                                    📍 고객님과 최단거리 1순위
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                <div className="flex items-center gap-1 text-amber-400 font-bold">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{tech.rating || '5.0'}</span>
                                  <span className="text-slate-500 font-normal">({tech.reviewCount || 0}개 후기)</span>
                                </div>
                                <span>• 거점: {tech.baseLocation || tech.region || '수도권'}</span>
                                <span>• 경력: {tech.experienceYears || 1}년</span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Standard Price & Selection Button */}
                          <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
                            <div className="text-left md:text-right">
                              <span className="text-[10px] text-slate-400 block">제도화 표준 제안 금액</span>
                              <span className="text-xl font-black text-cyan-400">
                                {standardPrice.toLocaleString()}원
                              </span>
                              <span className="text-[10px] text-emerald-400 block font-semibold">오버차지 0원 보증</span>
                            </div>

                            {isCurrentlyMatched ? (
                              <span className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                                <Check className="w-4 h-4" />
                                <span>선택(수락) 완료</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSelectTech(tech.id, tech.name)}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>이 기사님 선택(수락)</span>
                              </button>
                            )}
                          </div>

                        </div>

                        {/* 3. Tech Proposal Message & Special Perks Box */}
                        <div className="mt-3.5 bg-slate-950/70 p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="font-bold text-cyan-300 flex items-center gap-1">
                              💬 기사님의 맞춤 제안 메시지 & 시공 특전
                            </span>
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              예상 소요시간: <strong className="text-slate-200">{estimatedHours}</strong>
                            </span>
                          </div>
                          <p className="text-slate-200 leading-relaxed pl-1">
                            "{message}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 space-y-3">
            <p className="text-sm">조회할 의뢰를 선택하시거나 상단 검색창에 전화번호를 입력해 주세요.</p>
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          request={activeRequest}
          onPaymentSuccess={(reqId, receipt) => {
            updateMatchPayment(reqId, receipt);
            loadFreshData();
            setActiveRequest(prev => prev ? ({
              ...prev,
              isPaid: true,
              paidAt: new Date().toISOString(),
              paymentReceipt: receipt,
              status: 'COMPLETED'
            }) : prev);
            if (onBidAccepted) onBidAccepted();
          }}
        />

        {/* Settlement Modal */}
        <SettlementModal
          isOpen={isSettlementOpen}
          onClose={() => setIsSettlementOpen(false)}
          request={activeRequest}
        />

      </div>
    </div>
  );
};
