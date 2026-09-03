import React from 'react';
import { 
  X, DollarSign, TrendingUp, ShieldCheck, Printer, 
  FileText, CheckCircle2, Building, User, Calendar, Percent
} from 'lucide-react';
import { calculateSettlement, SETTLEMENT_STATUS } from '../utils/settlement';

export const SettlementModal = ({ isOpen, onClose, request, onToggleSettled }) => {
  if (!isOpen || !request) return null;

  const totalAmount = Number(request.matchedPrice || request.budget || request.estimatedPrice || 350000);
  const settlement = calculateSettlement(totalAmount);
  const isSettled = request.settlementStatus === 'SETTLED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0d121f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            <span>플랫폼 수수료 10% & 3.3% 원천징수 정산</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            기술자 정산 지급 명세서
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            시공 완료 건에 대한 플랫폼 중개 수수료 및 원천징수 공제 내역입니다.
          </p>
        </div>

        {/* Order Brief */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2 text-xs text-slate-300 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400">의뢰 번호</span>
            <span className="font-mono text-cyan-400 font-bold">{request.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">시공 차종 / 서비스</span>
            <span className="text-white font-semibold">{request.carModel} ({request.serviceName})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">담당 기술자</span>
            <strong className="text-white">{request.matchedTechName || '루멘 인증 마스터'}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">시공/결제 일시</span>
            <span>{request.preferredDate} ({request.preferredTime})</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <span className="text-slate-400">정산 상태</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
              isSettled 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {isSettled ? '정산 완료 (지급완료)' : '정산 대기 (미지급)'}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="bg-[#07090e] p-5 rounded-2xl border border-cyan-500/30 space-y-3.5">
          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-white/10">
            <FileText className="w-4 h-4 text-cyan-400" />
            정산 항목별 상세 내역 (세무 기준)
          </h4>

          {/* 1. Total GMV */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">① 총 시공 결제 매출 (GMV 100%)</span>
            <span className="font-bold text-white text-sm">
              +{settlement.gmv.toLocaleString()}원
            </span>
          </div>

          {/* 2. Platform Commission */}
          <div className="flex justify-between items-center text-xs bg-cyan-950/20 p-2 rounded-lg border border-cyan-500/20">
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-300 font-bold">② 플랫폼 중개 수수료 (10%)</span>
              <span className="text-[10px] text-cyan-400/80 bg-cyan-500/20 px-1.5 py-0.2 rounded">플랫폼 수익</span>
            </div>
            <span className="font-bold text-cyan-400">
              -{settlement.platformFee.toLocaleString()}원
            </span>
          </div>

          {/* 3. Tech Gross */}
          <div className="flex justify-between items-center text-xs pl-2">
            <span className="text-slate-400">↳ 기사 지급 기준액 (90%)</span>
            <span className="font-semibold text-slate-200">
              {settlement.techGross.toLocaleString()}원
            </span>
          </div>

          {/* 4. Withholding Tax (3.3%) */}
          <div className="bg-rose-950/20 p-2.5 rounded-lg border border-rose-500/20 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-rose-300 font-bold">③ 사업소득 원천징수세 (3.3%)</span>
                <span className="text-[10px] text-rose-400/80 bg-rose-500/20 px-1.5 py-0.2 rounded">국세청 납부예정</span>
              </div>
              <span className="font-bold text-rose-400">
                -{settlement.withholdingTax.toLocaleString()}원
              </span>
            </div>
            
            <div className="flex justify-between text-[11px] text-slate-400 pl-3">
              <span>• 사업소득세 (3.0%)</span>
              <span>-{settlement.incomeTax.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pl-3">
              <span>• 지방소득세 (0.3%)</span>
              <span>-{settlement.localTax.toLocaleString()}원</span>
            </div>
          </div>

          {/* 5. Final Net Payout */}
          <div className="flex justify-between items-baseline bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40">
            <div>
              <span className="text-xs font-bold text-emerald-300 block">기사 최종 실입금액 (Net Payout)</span>
              <span className="text-[10px] text-slate-400">수수료 10% 및 3.3% 세무 공제 후 실수령액</span>
            </div>
            <span className="text-2xl font-black text-emerald-400">
              {settlement.techNetPayout.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Bank & Tax Compliance Info */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-slate-300">💡 세무 및 정산 안내</p>
          <p>• 플랫폼 중개 수수료(10%)에 대해서는 사업자 매입세금계산서 또는 현금영수증이 발급됩니다.</p>
          <p>• 기사 지급액은 소득세법 제127조에 따라 3.3% 원천징수 후 매월 10일 국세청 신고 및 기사 등록 계좌로 정산 입금됩니다.</p>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>명세서 인쇄</span>
          </button>

          {onToggleSettled && (
            <button
              onClick={() => onToggleSettled(request.id, !isSettled)}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                isSettled
                  ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSettled ? '정산 대기로 되돌리기' : '기사 입금완료 처리'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
