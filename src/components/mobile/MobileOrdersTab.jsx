import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, Clock, Car, User, Phone, MapPin, 
  Star, Send, ShieldCheck, DollarSign, CreditCard, FileText,
  ChevronRight, RefreshCw, Sparkles, Navigation, AlertCircle, Lock
} from 'lucide-react';
import { 
  switchMatchedTechnician, getTechnicians, updateMatchPayment, 
  getLoggedInCustomer, deleteMatchRequest, updateMatchStatus
} from '../../utils/storage';
import { PaymentModal } from '../PaymentModal';
import { SettlementModal } from '../SettlementModal';
import confetti from 'canvas-confetti';

const STATUS_STEPS = [
  { key: 'OPEN', label: '의뢰접수', desc: '의뢰가 정상 접수되었습니다.' },
  { key: 'BIDDING', label: '기사배정', desc: '담당 마스터 기술자 배정 중입니다.' },
  { key: 'MATCHED', label: '매칭완료', desc: '기사 매칭 및 방문 일정이 확정되었습니다.' },
  { key: 'IN_PROGRESS', label: '출장시공', desc: '현장 방문 정밀 시공 진행 중입니다.' },
  { key: 'COMPLETED', label: '시공완료', desc: '시공 및 품질 검수가 완료되었습니다.' }
];

export const MobileOrdersTab = ({ matchRequests, onRefresh, onOpenCustomerAuth }) => {
  const customer = getLoggedInCustomer();
  const allTechnicians = getTechnicians();

  // Strict Filter: ONLY show this logged-in customer's orders
  const customerOrders = customer
    ? matchRequests.filter(req => {
        const cleanCustPhone = (customer.phone || '').replace(/\D/g, '');
        const cleanReqPhone = (req.phone || '').replace(/\D/g, '');
        return (cleanCustPhone && cleanCustPhone === cleanReqPhone) || req.customerName === customer.name;
      })
    : [];

  const [selectedReq, setSelectedReq] = useState(() => customerOrders[0] || null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);

  useEffect(() => {
    if (customerOrders.length > 0) {
      if (!selectedReq || !customerOrders.find(o => o.id === selectedReq.id)) {
        setSelectedReq(customerOrders[0]);
      }
    } else {
      setSelectedReq(null);
    }
  }, [matchRequests, customer]);

  // 1. If not logged in as a customer: Show Security Login Gate
  if (!customer) {
    return (
      <div className="px-4 py-20 text-center animate-fadeIn space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">로그인이 필요합니다</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
            고객님의 개인정보 보호를 위해 실시간 시공 진행 상태 및 주문 내역은 로그인 후 본인의 내역만 조회하실 수 있습니다.
          </p>
        </div>
        <button
          onClick={onOpenCustomerAuth}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
        >
          고객 로그인 / 간편 회원가입
        </button>
      </div>
    );
  }

  const handleSwitchTech = (techId, techName) => {
    if (!selectedReq) return;
    if (window.confirm(`[${techName}] 프로님으로 기술자를 변경 및 확정하시겠습니까? (플랫폼 정찰가 동일 적용)`)) {
      switchMatchedTechnician(selectedReq.id, techId);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      if (onRefresh) onRefresh();
      alert(`🎉 [${techName}] 프로님과의 매칭이 확정되었습니다!`);
    }
  };

  const handleCancelOrder = (reqId) => {
    if (window.confirm('이 시공 의뢰를 취소하시겠습니까?')) {
      deleteMatchRequest(reqId);
      if (onRefresh) onRefresh();
      alert('시공 의뢰가 취소되었습니다.');
    }
  };

  const handleStepClick = (stepKey) => {
    if (!selectedReq) return;
    if (selectedReq.status === stepKey) return;

    updateMatchStatus(selectedReq.id, stepKey);

    if (stepKey === 'COMPLETED') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    setSelectedReq(prev => ({
      ...prev,
      status: stepKey
    }));

    if (onRefresh) onRefresh();
  };

  const currentStepIdx = selectedReq ? STATUS_STEPS.findIndex(s => s.key === selectedReq.status) : 0;
  const standardPrice = selectedReq ? Number(selectedReq.matchedPrice || selectedReq.budget || selectedReq.estimatedPrice || 343000) : 0;

  return (
    <div className="pb-24 space-y-4 animate-fadeIn">
      
      {/* 1. Header with Customer Name Badge */}
      <div className="px-4 pt-1 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white">내 주문 및 시공 현황</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            <strong className="text-cyan-300 font-bold">{customer.name}</strong> 고객님의 진행 중인 시공 내역입니다.
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
          총 {customerOrders.length}건
        </span>
      </div>

      {/* 2. Order Selector Pills (if multiple orders for this customer) */}
      {customerOrders.length > 1 && (
        <div className="px-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {customerOrders.map(req => (
            <button
              key={req.id}
              onClick={() => setSelectedReq(req)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedReq?.id === req.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
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
                  const isPassed = idx < currentStepIdx;
                  const isCur = idx === currentStepIdx;

                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => handleStepClick(s.key)}
                      className="flex flex-col items-center group focus:outline-none transition-all"
                      title={`클릭하여 '${s.label}' 상태로 변경`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-md group-hover:scale-110 ${
                        isCur 
                          ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/30 font-black scale-110' 
                          : (isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500 hover:text-white')
                      }`}>
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[10px] mt-1 font-medium ${isCur ? 'text-cyan-300 font-bold' : (isPassed ? 'text-slate-300' : 'text-slate-600')}`}>
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>{STATUS_STEPS[Math.max(0, currentStepIdx)]?.desc}</span>
              <span className="text-[10px] text-cyan-400 font-medium shrink-0 ml-2">터치하여 상태 변경</span>
            </div>
          </div>

          {/* 4. Order Information Card */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  {selectedReq.serviceName}
                </span>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {selectedReq.carModel}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedReq.location}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">정찰제 확정가</span>
                <span className="text-base font-black text-emerald-400">
                  {standardPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Matched Technician Details */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">담당 배정 디테일러</span>
                    <h5 className="font-extrabold text-white text-xs">
                      {selectedReq.matchedTechName || '최단거리 기사 배정 대기'}
                    </h5>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">오버차지 0원 보증</span>
              </div>

              {/* Action Buttons: Payment & Settlement */}
              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsSettlementOpen(true)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-bold border border-cyan-500/20 flex items-center justify-center gap-1"
                >
                  <DollarSign className="w-3 h-3 text-cyan-400" />
                  <span>정산/영수증</span>
                </button>

                {selectedReq.isPaid ? (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>결제완료 (전자영수증)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-500/25 active:scale-95"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>안심 결제하기</span>
                  </button>
                )}

                <button
                  onClick={() => handleCancelOrder(selectedReq.id)}
                  className="py-2 px-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 transition-colors"
                >
                  의뢰 취소
                </button>
              </div>
            </div>
          </div>

          {/* 5. Real-time Technician Proposal Feed */}
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
          <p className="font-bold text-slate-300">[{customer.name}] 고객님의 진행 중인 시공 의뢰가 없습니다.</p>
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
          setSelectedReq(prev => prev ? ({
            ...prev,
            isPaid: true,
            paidAt: new Date().toISOString(),
            paymentReceipt: receipt,
            status: 'COMPLETED'
          }) : prev);
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
