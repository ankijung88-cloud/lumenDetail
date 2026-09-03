import React, { useState } from 'react';
import { 
  X, CreditCard, ShieldCheck, CheckCircle2, Lock, 
  Smartphone, Building, Sparkles, Printer, ArrowRight
} from 'lucide-react';
import { calculateSettlement } from '../utils/settlement';
import confetti from 'canvas-confetti';

export const PaymentModal = ({ isOpen, onClose, request, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'kakaopay' | 'tosspay' | 'transfer'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen || !request) return null;

  const totalAmount = Number(request.matchedPrice || request.budget || request.estimatedPrice || 350000);
  const settlement = calculateSettlement(totalAmount);

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      const receipt = {
        receiptNo: `RC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        paidAt: new Date().toLocaleString('ko-KR'),
        amount: totalAmount,
        method: paymentMethod === 'card' ? '신용/체크카드 (안심결제)' : (paymentMethod === 'kakaopay' ? '카카오페이' : (paymentMethod === 'tosspay' ? '토스페이' : '실시간 계좌이체')),
        carModel: request.carModel,
        serviceName: request.serviceName,
        customerName: request.customerName,
        techName: request.matchedTechName || '루멘 전담 마스터'
      };

      setReceiptData(receipt);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });

      if (onPaymentSuccess) {
        onPaymentSuccess(request.id, receipt);
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0d121f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <div>
            {/* Modal Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>플랫폼 안심 에스크로 결제</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                출장 시공 대금 결제
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                시공 퀄리티 검수 완료 후 안심 결제를 진행해 주세요.
              </p>
            </div>

            {/* Service Summary Card */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2.5 mb-6 text-xs text-slate-300">
              <div className="flex justify-between items-center text-slate-400">
                <span>의뢰 번호</span>
                <span className="font-mono text-cyan-400 font-bold">{request.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">시공 차종</span>
                <strong className="text-white">{request.carModel}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">시공 패키지</span>
                <strong className="text-cyan-300">{request.serviceName}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">담당 기술자</span>
                <strong className="text-white">{request.matchedTechName || '루멘 인증 마스터'}</strong>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-200">최종 결제 금액 (표준정찰가)</span>
                <span className="text-2xl font-black text-emerald-400">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handleProcessPayment} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/30'
                        : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>신용 / 체크카드</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kakaopay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'kakaopay'
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300 ring-2 ring-amber-400/30'
                        : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>카카오페이</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tosspay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'tosspay'
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 ring-2 ring-blue-500/30'
                        : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>토스페이</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30'
                        : 'border-white/10 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>실시간 계좌이체</span>
                  </button>
                </div>
              </div>

              {/* Trust Security Notice */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p className="font-bold text-slate-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  SSL 256-bit 암호화 안심 결제
                </p>
                <p>• 결제 대금은 시공 검수 완료 후 기사님께 3.3% 원천징수 공제 후 안전하게 정산 지급됩니다.</p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>안심 결제 승인 중...</span>
                  ) : (
                    <>
                      <span>{totalAmount.toLocaleString()}원 결제 승인</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Receipt Screen */
          <div className="py-4 space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">결제가 완료되었습니다!</h3>
              <p className="text-xs text-slate-400">전자 영수증이 정상 발급되었습니다.</p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-dashed border-slate-700 space-y-3 font-mono text-xs text-slate-300">
              <div className="text-center pb-3 border-b border-dashed border-slate-800">
                <p className="font-extrabold text-white text-sm tracking-wider font-sans">LUMEN PRO MATCH 영수증</p>
                <p className="text-[10px] text-slate-500 mt-0.5">승인번호: {receiptData?.receiptNo}</p>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">결제일시</span>
                  <span>{receiptData?.paidAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">결제수단</span>
                  <span className="text-cyan-400">{receiptData?.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">시공차량</span>
                  <span className="text-white">{receiptData?.carModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">시공항목</span>
                  <span className="text-white">{receiptData?.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">담당기술자</span>
                  <span>{receiptData?.techName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-slate-800 flex justify-between items-baseline font-sans">
                <span className="font-bold text-white text-sm">승인 금액</span>
                <span className="text-xl font-black text-emerald-400">
                  {receiptData?.amount.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>영수증 인쇄/저장</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
              >
                확인 완료
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
