import React, { useState, useEffect } from 'react';
import { saveBooking } from '../utils/storage';
import { sendToGoogleSheet } from '../utils/googleSheet';
import confetti from 'canvas-confetti';
import { 
  Calendar, Clock, Car, Phone, User, MapPin, 
  FileText, Send, CheckCircle2, AlertCircle, Sparkles, ShieldAlert
} from 'lucide-react';

const ZONE_FEES = {
  zone1: { id: 'zone1', name: '1권역 (인천 청라/서구/부평/계양/김포남부/부천)', fee: 0, text: '무료 (0원)' },
  zone2: { id: 'zone2', name: '2권역 (인천 송도/영종/남동, 김포한강, 서울서부/마곡/목동, 일산, 광명)', fee: 15000, text: '+15,000원' },
  zone3: { id: 'zone3', name: '3권역 (서울 전역(강남/서초/송파 등), 수원, 안양, 화성, 분당, 파주)', fee: 30000, text: '+30,000원' },
  zone4: { id: 'zone4', name: '4권역 (경기 외곽/평택/이천 및 기타 장거리)', fee: 50000, text: '상담 후 협의' }
};

export const BookingForm = ({ preselectedService, preselectedPrice }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    carModel: '',
    carColor: '',
    carYear: '',
    serviceName: preselectedService || '3스텝 광택 + 9H 유리막 코팅',
    travelZone: 'zone1',
    location: '',
    preferredDate: '',
    preferredTime: '10:00',
    notes: '',
    basePrice: preselectedPrice || 343000,
    estimatedPrice: preselectedPrice || 343000
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Recalculate price when base price or zone changes
  useEffect(() => {
    let base = preselectedPrice || 343000;
    if (preselectedService) {
      if (preselectedService.includes('본넷')) base = 40000;
      else if (preselectedService.includes('도어')) base = 25000;
      else if (preselectedService.includes('범퍼')) base = 35000;
      else if (preselectedService.includes('휀다')) base = 25000;
      else if (preselectedService.includes('트렁크')) base = 35000;
      else if (preselectedService.includes('맞춤 패널')) base = 75000;
      else if (preselectedService.includes('세미광택')) base = 189000;
      else if (preselectedService.includes('베이직')) base = 210000;
      else if (preselectedService.includes('VIP')) base = 525000;
      else if (preselectedService.includes('유막')) base = 30000;
      else if (preselectedService.includes('3스텝')) base = 343000;
    }

    setFormData(prev => {
      const zone = ZONE_FEES[prev.travelZone] || ZONE_FEES.zone1;
      const isFreeTravel = base >= 200000 || zone.fee === 0;
      const travelFee = isFreeTravel ? 0 : zone.fee;
      return {
        ...prev,
        serviceName: preselectedService || prev.serviceName,
        basePrice: preselectedPrice || base,
        estimatedPrice: (preselectedPrice || base) + travelFee
      };
    });
  }, [preselectedService, preselectedPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'travelZone') {
      const zone = ZONE_FEES[value] || ZONE_FEES.zone1;
      setFormData(prev => {
        const isFreeTravel = prev.basePrice >= 200000 || zone.fee === 0;
        const travelFee = isFreeTravel ? 0 : zone.fee;
        return {
          ...prev,
          travelZone: value,
          estimatedPrice: prev.basePrice + travelFee
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceChange = (e) => {
    const val = e.target.value;
    let base = 343000;
    if (val.includes('본넷')) base = 40000;
    else if (val.includes('도어')) base = 25000;
    else if (val.includes('범퍼')) base = 35000;
    else if (val.includes('휀다')) base = 25000;
    else if (val.includes('트렁크')) base = 35000;
    else if (val.includes('맞춤 패널')) base = 75000;
    else if (val.includes('세미광택')) base = 189000;
    else if (val.includes('베이직')) base = 210000;
    else if (val.includes('VIP')) base = 525000;
    else if (val.includes('유막')) base = 30000;
    else if (val.includes('3스텝')) base = 343000;

    setFormData(prev => {
      const zone = ZONE_FEES[prev.travelZone] || ZONE_FEES.zone1;
      const isFreeTravel = base >= 200000 || zone.fee === 0;
      const travelFee = isFreeTravel ? 0 : zone.fee;
      return {
        ...prev,
        serviceName: val,
        basePrice: base,
        estimatedPrice: base + travelFee
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.carModel || !formData.carColor || !formData.location || !formData.preferredDate) {
      alert('필수 입력 항목(성함, 연락처, 차종, 색상, 출장지 주소, 희망일자)을 모두 작성해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const zoneInfo = ZONE_FEES[formData.travelZone]?.name || '';
      const fullCarInfo = `${formData.carModel} ${formData.carColor}${formData.carYear ? ' (' + formData.carYear + ')' : ''}`.trim();
      const payload = {
        ...formData,
        carModel: fullCarInfo,
        carModelOnly: formData.carModel,
        carColor: formData.carColor,
        carYear: formData.carYear,
        location: `[${zoneInfo}] ${formData.location}`
      };

      // 1. 로컬 스토리지에 저장
      const savedItem = saveBooking(payload);

      // 2. 구글 스프레드시트로 전송
      const syncResult = await sendToGoogleSheet(savedItem);

      // 3. 축하 효과
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitResult({
        success: true,
        bookingId: savedItem.id,
        syncMode: syncResult.mode,
        message: syncResult.message
      });

      // 폼 초기화
      setFormData({
        customerName: '',
        phone: '',
        carModel: '',
        carColor: '',
        carYear: '',
        serviceName: '3스텝 광택 + 9H 세라믹 코팅',
        travelZone: 'zone1',
        location: '',
        preferredDate: '',
        preferredTime: '10:00',
        notes: '',
        basePrice: 490000,
        estimatedPrice: 490000
      });
    } catch (err) {
      console.error(err);
      alert('신청 접수 중 문제가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/20">
          Online Reservation
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
          1분 <span className="text-cyan-400">간편 출장 견적 & 일정 신청</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          신청서를 작성해 주시면 담당 디테일러가 확인 후 즉시 유선 또는 문자로 일정을 확정해 드립니다.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {submitResult && submitResult.success ? (
          <div className="text-center py-12 px-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">출장 예약 신청이 완료되었습니다!</h3>
            <p className="text-cyan-300 font-mono text-sm font-semibold mb-4">접수번호: {submitResult.bookingId}</p>
            
            <p className="text-slate-300 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              기재해주신 연락처로 담당 디테일러가 차량 상태 및 출장 장소 점검을 위해 신속하게 연락드리겠습니다.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-400 max-w-md mx-auto mb-8 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>데이터 연동 상태</span>
              </div>
              <p>{submitResult.message}</p>
            </div>

            <button
              onClick={() => setSubmitResult(null)}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
            >
              추가 신청서 작성하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Customer Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>고객명 (성함) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="예: 홍길동"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>연락처 (휴대폰) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="예: 010-1234-5678"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              {/* Vehicle Information (Split Inputs: Model, Color, Year) */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-cyan-400" />
                    <span>차량 정보 (차종 / 색상 / 연식) <span className="text-rose-400">*</span></span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal">정확한 패드 및 케미컬 선정을 위한 필수 정보</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      placeholder="차종 (예: 제네시스 G80)"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="carColor"
                      value={formData.carColor}
                      onChange={handleChange}
                      placeholder="색상 (예: 블랙 / 화이트)"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleChange}
                      placeholder="연식 (예: 2024년식)"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>희망 시공 서비스 <span className="text-rose-400">*</span></span>
                </label>
                <select
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleServiceChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <optgroup label="[전체 차량 패키지 (🔥 30% 특별 할인 적용가)]">
                    <option value="3스텝 광택 + 9H 유리막 코팅">3스텝 광택 + 9H 유리막 코팅 (30% 특가 343,000원 / 추천)</option>
                    <option value="2스텝 세미광택 (도장보호 & 광택 케어)">2스텝 세미광택 (30% 특가 189,000원 / 컷팅 최소화)</option>
                    <option value="베이직 수성 광택">베이직 수성 광택 (30% 특가 210,000원)</option>
                    <option value="VIP 올인원 풀케어 패키지">VIP 올인원 풀케어 패키지 (30% 특가 525,000원 / 외장+유리막+발수)</option>
                    <option value="기타/상담 후 결정">기타 (현장 상담 후 결정)</option>
                  </optgroup>
                  <optgroup label="[부위별 부분케어 맞춤 시공 (🔥 50% 반값 특가 적용가)]">
                    <option value="본넷(후드) 집중 수성 광택 & 케어">본넷(후드) 집중 수성 광택 (50% 특가 40,000원)</option>
                    <option value="도어(문짝) 흠집 & 스월마크 케어">도어(문짝 1판) 흠집 케어 (50% 특가 25,000원)</option>
                    <option value="앞·뒤 범퍼 & 코너 쓸림 집중 광택">앞·뒤 범퍼 코너 쓸림 광택 (50% 특가 35,000원)</option>
                    <option value="앞·뒤 휀다 & 필러 집중 케어">앞·뒤 휀다 및 필러 케어 (50% 특가 25,000원)</option>
                    <option value="트렁크 & 루프(천장) 오염 케어">트렁크 / 루프 상판 케어 (50% 특가 35,000원)</option>
                    <option value="전면 유리 유막제거 + 초발수 코팅">전면 유리 유막제거 + 초발수 코팅 (50% 특가 30,000원)</option>
                    <option value="원하는 부위만 쏙! 맞춤 패널 선택 케어">원하는 부위만 쏙! 맞춤 패널 (50% 특가 75,000원~)</option>
                  </optgroup>
                </select>
              </div>

              {/* Travel Zone Selection */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>출장 희망 지역 권역 <span className="text-rose-400">*</span></span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-normal">
                    * 거점: 인천 청라국제도시 기준
                  </span>
                </label>
                <select
                  name="travelZone"
                  value={formData.travelZone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <option value="zone1">
                    1권역 : 인천 서구(청라/검단/루원), 부평, 계양, 김포남부, 부천 ──▶ 출장비 무료 (0원)
                  </option>
                  <option value="zone2">
                    2권역 : 인천 송도/영종/남동, 김포한강, 서울서부(강서/양천/마포), 일산, 광명 ──▶ +15,000원
                  </option>
                  <option value="zone3">
                    3권역 : 서울 전역(강남/서초/송파 등), 안양, 수원, 안산, 화성(동탄), 분당, 파주 ──▶ +30,000원
                  </option>
                  <option value="zone4">
                    4권역 : 경기 외곽(평택/이천/포천 등), 충청/강원 북부 등 장거리 ──▶ 출장비 상담 후 협의
                  </option>
                </select>
              </div>

              {/* Location Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>출장 상세 주소 (동/아파트/주차장 위치) <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="예: 인천 서구 청라커낼로 123 청라OO아파트 지하 2층 주차장"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              {/* Preferred Date */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>희망 시공 일자 <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>희망 시작 시간</span>
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-sm"
                >
                  <option value="09:00">오전 09:00</option>
                  <option value="10:00">오전 10:00 (추천)</option>
                  <option value="13:00">오후 01:00</option>
                  <option value="15:00">오후 03:00</option>
                  <option value="조율">디테일러와 조율</option>
                </select>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>차량 상태 및 특별 요청사항</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="예: 깊은 스크래치 부위, 주차장 내 220V 콘센트 유무, 특별히 신경 써주셨으면 하는 부분 등을 적어주세요."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm resize-none"
                />
              </div>

            </div>

            {/* Estimated Price & Submit Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400">
                    시공 특가: <strong className="text-rose-400 font-mono font-bold">{(formData.basePrice).toLocaleString()}원</strong>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-400">
                    출장비: {formData.basePrice >= 200000 ? (
                      <span className="text-emerald-400 font-bold font-mono">0원 (전액 무료 지원)</span>
                    ) : (
                      <span className="text-cyan-300 font-bold font-mono">{ZONE_FEES[formData.travelZone]?.text}</span>
                    )}
                  </span>
                </div>

                {formData.basePrice >= 200000 && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    <Sparkles className="w-3 h-3" />
                    <span>패키지 시공 프로모션 혜택으로 1·2권역 출장비 무료 적용!</span>
                  </div>
                )}

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-300">최종 예상 견적:</span>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-tight">
                    {(formData.estimatedPrice).toLocaleString()}원
                  </span>
                  <span className="text-[11px] text-rose-400 font-bold">* 특별 할인가 적용 기준</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full lg:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>접수 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>출장 견적 & 시공 예약 신청하기</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>

    </section>
  );
};
