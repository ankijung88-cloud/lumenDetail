// 플랫폼 수익 및 3.3% 원천징수 세무 정산 계산 유틸리티

/**
 * 시공 매출액 기준 플랫폼 수수료 및 3.3% 세무 공제 정산 계산
 * @param {number} totalAmount - 총 시공 매출액 (GMV)
 * @returns {object} 정산 상세 명세 객체
 */
export const calculateSettlement = (totalAmount) => {
  const gmv = Number(totalAmount) || 0;
  
  // 1. 플랫폼 중개 수수료 10%
  const platformFee = Math.round(gmv * 0.10);
  
  // 2. 기사 지급 기준 총액 (매출의 90%)
  const techGross = gmv - platformFee;
  
  // 3. 사업소득세 원천징수 3.3% (국세 3.0% + 지방소득세 0.3%)
  const incomeTax = Math.floor((techGross * 0.03) / 10) * 10; // 10원 단위 절사
  const localTax = Math.floor((techGross * 0.003) / 10) * 10;  // 10원 단위 절사
  const withholdingTax = incomeTax + localTax; // 총 3.3% 세금
  
  // 4. 기사 최종 실입금액 (Net Payout)
  const techNetPayout = techGross - withholdingTax;

  return {
    gmv,
    platformFeeRate: 0.10,
    platformFeeRateText: '10%',
    platformFee,
    techGross,
    techGrossRateText: '90%',
    taxRateText: '3.3%',
    incomeTax,
    localTax,
    withholdingTax,
    techNetPayout
  };
};

/**
 * 정산 상태 라벨 및 뱃지 스타일
 */
export const SETTLEMENT_STATUS = {
  PENDING: { label: '정산 대기', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  PROCESSING: { label: '지급 처리중', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  SETTLED: { label: '정산 완료 (입금완료)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
};
