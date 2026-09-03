import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Car, User, Phone, MapPin, 
  Star, Send, ShieldCheck, DollarSign, CreditCard, FileText,
  ChevronRight, RefreshCw, Sparkles, Navigation, AlertCircle
} from 'lucide-react';
import { switchMatchedTechnician, getTechnicians, updateMatchPayment } from '../../utils/storage';
import { PaymentModal } from '../PaymentModal';
import { SettlementModal } from '../SettlementModal';
import confetti from 'canvas-confetti';

const STATUS_STEPS = [
  { key: 'OPEN', label: '의뢰접수' },
  { key: 'BIDDING', label: '기사배정' },
  { key: 'MATCHED', label: '매칭완료' },
  { key: 'IN_PROGRESS', label: '출장시공' },
  { key: 'COMPLETED', label: '시공완료' }
];

export const MobileOrdersTab = ({ matchRequests, onRefresh }) => {
  const [selectedReq, setSelectedReq] = useState(matchRequests[0] || null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const allTechnicians = getTechnicians();

  const handleSwitchTech = (techId, techName) => {
    if (!selectedReq) return;
    if (window.confirm(`[${techName}] 프로님으로 기술자를 변경 및 확정하시겠습니까? (플랫폼 정찰가 동일 적용)`)) {
      switchMatchedTechnician(selectedReq.id, techId);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onRefresh) onRefresh();
      alert(`🎉 [${techName}] 프로님과의 매칭이 확정되었습니다!`);
    }
  };

  const currentStepIdx = selectedReq ? STATUS_STEPS.findIndex(s => s.key === selectedReq.status) : 0;
  const standardPrice = selectedReq ? Number(selectedReq.matchedPrice || selectedReq.budget || selectedReq.estimatedPrice || 343000) : 0;

  return (
    <div className="pb-24 space-y-4 animate-fadeIn">
      
      {/* 1. Header */}
      <div className="px-4 pt-1">
        <h3 className="text-lg font-black text-white">주문 및 시공 현황</h3>
        <p className="text-xs text-slate-400 mt-0.5">배달 현황처럼 실시간 출장 시공 상태를 확인하고 기사를 관리하세요.</p>
      </div>

      {/* 2. Order Selector Pills (if multiple orders) */}
      {matchRequests.length > 0 && (
        <div className="px-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {matchRequests.map(req => (
            <button
              key={req.id}
              onClick={() => setSelectedReq(req)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedReq?.id === req.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-white/5'
              }`}
            >
              <span>{req.carModel}</span>
              <span className="text-[10px] opacity-80">({req.id})</span>
            </button>
          ))}
        </div>
      )}

      {selectedReq ? (
        <div className="px-4 space-y-4">
          
          {/* 3. Baemin-style Delivery Status Timeline Bar */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {selectedReq.id}
              </span>
              <span className="text-emerald-400 font-bold">
                {STATUS_STEPS[Math.max(0, currentStepIdx)]?.label} 상태
              </span>
            </div>

            <div className="relative pt-2 pb-1">
              <div className="absolute top-1/2 left-3 right-3 h-1 bg-slate-800 -translate-y-1/2 rounded-full" />
              <div 
                className="absolute top-1/2 left-3 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIdx) / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              <div className="flex justify-between relative z-10">
                {STATUS_STEPS.map((s, idx) => {
                  const isPassed = idx <= currentStepIdx;
                  const isCur = idx === currentStepIdx;

                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCur 
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20' 
                          : (isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500')
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] font-bold mt-1.5 ${
                        isCur ? 'text-cyan-400' : (isPassed ? 'text-slate-300' : 'text-slate-600')
                      }`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Order Information Box */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
            <div className="flex justify-between items-baseline border-b border-white/10 pb-2.5">
              <div>
                <h4 className="font-black text-white text-sm">{selectedReq.carModel}</h4>
                <p className="text-cyan-300 font-semibold mt-0.5">{selectedReq.serviceName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">표준 정찰가</span>
                <span className="text-base font-black text-emerald-400">{standardPrice.toLocaleString()}원</span>
              </div>
            </div>

            <div className="space-y-1.5 text-slate-300 text-[11px]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>출장지: {selectedReq.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>희망일시: <strong className="text-white">{selectedReq.preferredDate} ({selectedReq.preferredTime})</strong></span>
              </div>
            </div>

            {/* Current Matched Technician Card */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded">
                      현재 배정된 담당 기사
                    </span>
                    <h5 className="font-extrabold text-white text-xs mt-0.5">
                      {selectedReq.matchedTechName || '최단거리 기사 배정 대기'}
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">오버차지 0원</span>
              </div>

              {/* Action Buttons: Payment & Settlement */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsSettlementOpen(true)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 text-cyan-300 text-[10px] font-bold border border-cyan-500/20 flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  <span>정산서 (수수료 10% / 3.3% 세무)</span>
                </button>

                {selectedReq.isPaid ? (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>결제완료 (영수증)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-500/25 active:scale-95"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>안심 결제하기</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 5. Real-time Technician Proposal Comparison & Selection Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>도착한 기사별 제안 & 특전 비교</span>
              </h4>
              <span className="text-[10px] text-cyan-300">정찰가 {standardPrice.toLocaleString()}원 동일</span>
            </div>

            <div className="space-y-3">
              {allTechnicians.map((tech, idx) => {
                const isCurrentlyMatched = selectedReq.matchedTechId === tech.id || selectedReq.matchedTechName?.includes(tech.name);
                const isClosest = idx === 0;

                return (
                  <div 
                    key={tech.id}
                    className={`glass-card p-3.5 rounded-2xl border transition-all ${
                      isCurrentlyMatched 
                        ? 'border-emerald-500/60 bg-emerald-950/20 ring-2 ring-emerald-500/20' 
                        : 'border-white/10 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={tech.avatar} 
                          alt={tech.name} 
                          className="w-11 h-11 rounded-xl object-cover border border-cyan-400 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-white text-xs">{tech.name} 프로</h5>
                            {isClosest && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                                📍 최단거리
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">거점: {tech.baseLocation || tech.region}</p>
                          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mt-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <span>{tech.rating}</span>
                            <span className="text-slate-500">({tech.reviewCount}개)</span>
                          </div>
                        </div>
                      </div>

                      {isCurrentlyMatched ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-[11px] shadow">
                          선택됨
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchTech(tech.id, tech.name)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 text-slate-200 hover:text-slate-950 font-bold text-[11px] transition-colors border border-white/10"
                        >
                          기사 변경
                        </button>
                      )}
                    </div>

                    <p className="mt-2.5 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-white/5">
                      💬 "{tech.introduction}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="px-4 py-16 text-center glass-card rounded-2xl border border-white/10 text-slate-400 text-xs">
          <Car className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="font-bold text-slate-300">현재 등록된 시공 의뢰가 없습니다.</p>
          <p className="text-[11px] text-slate-500 mt-1">홈에서 원하는 패키지를 선택해 간편 의뢰를 신청해 보세요.</p>
        </div>
      )}

      {/* Payment & Settlement Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        request={selectedReq}
        onPaymentSuccess={(reqId, receipt) => {
          updateMatchPayment(reqId, receipt);
          if (onRefresh) onRefresh();
        }}
      />

      <SettlementModal
        isOpen={isSettlementOpen}
        onClose={() => setIsSettlementOpen(false)}
        request={selectedReq}
      />

    </div>
  );
};
