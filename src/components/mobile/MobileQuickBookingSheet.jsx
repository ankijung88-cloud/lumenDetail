import React, { useState } from 'react';
import { 
  X, Sparkles, Navigation, Calendar, Clock, Car, Phone, 
  User, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Zap, Building2, ChevronRight, Lock
} from 'lucide-react';
import { saveMatchRequest, getTechnicians, getLoggedInCustomer } from '../../utils/storage';
import { getTechniciansByProximity } from '../../data/techniciansData';
import { CustomerAuthModal } from '../CustomerAuthModal';
import confetti from 'canvas-confetti';

const SERVICE_OPTIONS = [
  { id: '3step', name: '3스텝 광택 + 9H 유리막 코팅', price: 343000, desc: '신차급 광택 복원 & 1년 지속 보호막 (인기 1위)', badge: 'BEST' },
  { id: 'vip', name: 'VIP 올인원 풀케어 패키지', price: 525000, desc: '광택+유리막+전면발수+엔진룸+실내살균 풀코스', badge: 'VIP' },
  { id: 'basic', name: '베이직 수성 광택', price: 210000, desc: '스월마크 제거 및 도장면 딥클렌징', badge: '기본' },
  { id: 'hood', name: '본넷(후드) 집중 수성 광택', price: 40000, desc: '가장 눈에 띄는 본넷 스크래치 집중 복원', badge: '부분' },
  { id: 'rain', name: '유막제거 + 초발수 코팅', price: 30000, desc: '우천 시 완벽한 시야 확보', badge: '케어' }
];

const ZONE_OPTIONS = [
  { id: 'zone1', name: '인천 서구/청라/부평/계양/김포남부', fee: 0, tag: '출장비 0원' },
  { id: 'zone2', name: '인천 송도/영종/남동, 서울서부/마곡/일산', fee: 15000, tag: '+1.5만 (20만이상 무료)' },
  { id: 'zone3', name: '서울 전역(강남/서초/분당/수원/용인)', fee: 30000, tag: '+3만 (20만이상 무료)' },
  { id: 'zone4', name: '경기 외곽 및 기타 장거리', fee: 50000, tag: '협의 출장' }
];

export const MobileQuickBookingSheet = ({ isOpen, onClose, preselectedTech, onBookingComplete }) => {
  const [step, setStep] = useState(1); // 1: 서비스선택, 2: 차량/주소/일정, 3: 최단거리기사확인
  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0]);
  const [selectedZone, setSelectedZone] = useState('zone1');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [customerName, setCustomerName] = useState(() => getLoggedInCustomer()?.name || '김민준');
  const [phone, setPhone] = useState(() => getLoggedInCustomer()?.phone || '010-3849-2918');
  const [carModel, setCarModel] = useState('제네시스 G80');
  const [carColor, setCarColor] = useState('우유니 화이트');
  const [location, setLocation] = useState('인천 서구 청라커낼로 123');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const allTechs = getTechnicians();
  const closestTechs = getTechniciansByProximity(selectedZone, location, allTechs);
  const matchedTech = preselectedTech || closestTechs[0] || allTechs[0];

  const zoneFee = (selectedService.price >= 200000 || selectedZone === 'zone1') ? 0 : (ZONE_OPTIONS.find(z => z.id === selectedZone)?.fee || 0);
  const totalPrice = selectedService.price + zoneFee;

  const executeMobileOrder = (custName, custPhone) => {
    setIsSubmitting(true);

    try {
      const finalName = custName || customerName;
      const finalPhone = custPhone || phone;

      const newReq = saveMatchRequest({
        customerName: finalName,
        phone: finalPhone,
        carModel: `${carModel} (${carColor})`,
        carColor,
        serviceName: selectedService.name,
        travelZone: selectedZone,
        location,
        preferredDate,
        preferredTime,
        budget: totalPrice,
        estimatedPrice: totalPrice,
        targetTechId: matchedTech.id,
        targetTechName: `${matchedTech.name} 프로`,
        hasOutlet: true,
        isIndoor: true,
        notes: '모바일 간편 의뢰 접수'
      });

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });

      if (onBookingComplete) onBookingComplete(newReq);
      onClose();
      alert(`🎉 [${selectedService.name}] 출장 시공 의뢰가 접수되었습니다!\n담당 기사 [${matchedTech.name} 프로]님과 1순위로 자동 매칭되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('주문 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = () => {
    const cust = getLoggedInCustomer();
    if (!cust) {
      setIsAuthModalOpen(true);
      return;
    }
    executeMobileOrder(cust.name, cust.phone);
  };

  const handleAuthSuccess = (cust) => {
    setIsAuthModalOpen(false);
    setCustomerName(cust.name);
    setPhone(cust.phone);
    executeMobileOrder(cust.name, cust.phone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0d121f] border-t sm:border border-cyan-500/40 rounded-t-3xl sm:rounded-3xl p-6 max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Handle Bar & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-black text-white">
              {step === 1 ? '1. 시공 패키지 담기' : (step === 2 ? '2. 출장 주소 & 일정 입력' : '3. 매칭 기사 & 정찰가 확인')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 mb-5">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-cyan-500' : 'bg-slate-800'
              }`} 
            />
          ))}
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-3 flex-grow">
            <p className="text-xs text-slate-400 mb-2">원하시는 출장 디테일링 시공 항목을 선택해 주세요.</p>
            {SERVICE_OPTIONS.map(svc => (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedService.id === svc.id
                    ? 'border-cyan-500 bg-cyan-500/15 ring-2 ring-cyan-500/30'
                    : 'border-white/10 bg-slate-900/80 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{svc.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                      {svc.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{svc.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-cyan-400">{svc.price.toLocaleString()}원</span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">정찰가</span>
                </div>
              </button>
            ))}

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>다음: 주소 & 일정 입력</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Address & Schedule */}
        {step === 2 && (
          <div className="space-y-3.5 flex-grow text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">차종 및 색상</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="예: 제네시스 G80"
                  className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
                <input
                  type="text"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  placeholder="예: 화이트 / 블랙"
                  className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">출장 권역 선택</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                {ZONE_OPTIONS.map(z => (
                  <option key={z.id} value={z.id}>{z.name} ({z.tag})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">상세 출장 주소</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 인천 서구 청라동 루멘아파트 지하주차장"
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">희망 시공일</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">희망 시간</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="09:00">오전 09:00</option>
                  <option value="10:00">오전 10:00</option>
                  <option value="13:00">오후 13:00</option>
                  <option value="15:00">오후 15:00</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">예약자 성함</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">연락처</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold"
              >
                이전
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
              >
                다음: 최단거리 기사 확인
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Auto 1st-Priority Matched Tech & Regulated Price Confirmation */}
        {step === 3 && (
          <div className="space-y-4 flex-grow text-xs">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>고객님 위치 기준 1순위 최단거리 기사 자동 연결</span>
              </div>

              <div className="flex items-center gap-3">
                <img 
                  src={matchedTech.avatar} 
                  alt={matchedTech.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400"
                />
                <div>
                  <h4 className="font-extrabold text-white text-sm">{matchedTech.name} 프로</h4>
                  <p className="text-[11px] text-slate-300">거점: {matchedTech.baseLocation} (경력 {matchedTech.experienceYears}년)</p>
                  <p className="text-[10px] text-amber-400 font-bold">★ {matchedTech.rating} (후기 {matchedTech.reviewCount}개)</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 bg-slate-900/70 p-2.5 rounded-xl border border-white/5">
                💬 "{matchedTech.introduction}"
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>시공 항목</span>
                <strong className="text-white">{selectedService.name}</strong>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>차량 / 출장지</span>
                <span className="text-slate-200">{carModel} | {location}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>출장비 프로모션</span>
                <span className="text-emerald-400 font-bold">{zoneFee === 0 ? '무료 (0원)' : `+${zoneFee.toLocaleString()}원`}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-bold text-white text-sm">제도화 표준 정찰가 (오버차지 0원)</span>
                <span className="text-xl font-black text-emerald-400">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold"
              >
                수정하기
              </button>
              <button
                onClick={handleCompleteOrder}
                disabled={isSubmitting}
                className="flex-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? '의뢰 접수 중...' : '원클릭 출장 의뢰 완료'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Customer Login / Signup Gate Modal */}
        <CustomerAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          title="견적 의뢰를 위해 로그인이 필요합니다"
          subtitle="간편 회원가입/로그인 후 1:1 담당 기사 매칭 및 견적 접수가 즉시 완료됩니다."
        />

      </div>
    </div>
  );
};
