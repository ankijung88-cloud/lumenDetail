import React, { useState } from 'react';
import { 
  X, Search, CheckCircle2, Clock, Car, User, Phone, 
  MapPin, Star, Send, ShieldCheck, ArrowRight, Sparkles, AlertCircle,
  Navigation, Check, RefreshCw, CreditCard, FileText, DollarSign
} from 'lucide-react';
import { acceptMatchBid, switchMatchedTechnician, getTechnicians, updateMatchPayment } from '../utils/storage';
import { calculateSettlement } from '../utils/settlement';
import { PaymentModal } from './PaymentModal';
import { SettlementModal } from './SettlementModal';
import confetti from 'canvas-confetti';

const STATUS_STEPS = [
  { key: 'OPEN', label: '의뢰 접수' },
  { key: 'BIDDING', label: '기사 배정중' },
  { key: 'MATCHED', label: '매칭 확정' },
  { key: 'IN_PROGRESS', label: '출장 시공중' },
  { key: 'COMPLETED', label: '시공 완료' }
];

export const MatchTrackerModal = ({ isOpen, onClose, matchRequests, onBidAccepted }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRequest, setActiveRequest] = useState(matchRequests[0] || null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const allTechnicians = getTechnicians();

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const found = matchRequests.find(req => 
      req.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      req.phone.replace(/[^0-9]/g, '').includes(searchQuery.replace(/[^0-9]/g, '')) ||
      req.customerName.includes(searchQuery.trim())
    );
    if (found) {
      setActiveRequest(found);
    } else {
      alert('일치하는 의뢰를 찾을 수 없습니다. 의뢰번호 또는 예약자 연락처를 확인해 주세요.');
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
      if (onBidAccepted) onBidAccepted();
      alert(`🎉 [${techName}] 프로님과의 매칭이 확정되었습니다! 담당 기사님이 확인 전화를 드릴 예정입니다.`);
    }
  };

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
                placeholder="의뢰번호(REQ-...) 또는 예약자 휴대폰 번호 입력"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
            >
              조회하기
            </button>
          </form>
        </div>

        {/* Quick Request Selector Tabs */}
        {matchRequests.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/10 scrollbar-none">
            <span className="text-xs text-slate-400 shrink-0">최근 의뢰:</span>
            {matchRequests.map(req => (
              <button
                key={req.id}
                onClick={() => setActiveRequest(req)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeRequest?.id === req.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{req.carModel}</span>
                <span className="text-[10px] opacity-70">({req.customerName})</span>
              </button>
            ))}
          </div>
        )}

        {activeRequest ? (
          <div className="space-y-6">
            
            {/* Status Progress Bar */}
            <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
                <div 
                  className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-500" 
                  style={{ width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                {STATUS_STEPS.map((step, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent 
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30' 
                          : (isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500')
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                        isCurrent ? 'text-cyan-400' : (isPassed ? 'text-slate-200' : 'text-slate-500')
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
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
                    <span>도착한 기사별 제안 및 메시지 실시간 비교 ({allTechnicians.length}명 대기중)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    기사별 제안 메시지와 시공 특전을 비교하신 후 마음에 드는 기사님을 선택(수락)해 주세요.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 shrink-0">
                  🛡️ 전 기사 제도화 정찰가 ({standardPrice.toLocaleString()}원) 동일 적용
                </span>
              </div>

              <div className="space-y-4">
                {allTechnicians.map((tech, idx) => {
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
                            src={tech.avatar} 
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
                                <span>{tech.rating}</span>
                                <span className="text-slate-500 font-normal">({tech.reviewCount}개 후기)</span>
                              </div>
                              <span>• 거점: {tech.baseLocation || tech.region}</span>
                              <span>• 경력: {tech.experienceYears}년</span>
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
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            조회할 의뢰를 선택해 주세요.
          </div>
        )}

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          request={activeRequest}
          onPaymentSuccess={(reqId, receipt) => {
            updateMatchPayment(reqId, receipt);
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
