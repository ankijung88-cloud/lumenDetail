import React, { useState, useEffect } from 'react';
import { saveMatchRequest, getTechnicians } from '../utils/storage';
import { getTechniciansByProximity } from '../data/techniciansData';
import { sendToGoogleSheet } from '../utils/googleSheet';
import confetti from 'canvas-confetti';
import { 
  Calendar, Clock, Car, Phone, User, MapPin, 
  FileText, Send, CheckCircle2, AlertCircle, Sparkles, ShieldAlert,
  Zap, Building2, UserCheck, ShieldCheck, Navigation, ArrowRightLeft,
  DollarSign
} from 'lucide-react';

const ZONE_FEES = {
  zone1: { id: 'zone1', name: '1권역 (인천 청라/서구/부평/계양/김포남부/부천)', fee: 0, text: '무료 (0원)' },
  zone2: { id: 'zone2', name: '2권역 (인천 송도/영종/남동, 김포한강, 서울서부/마곡/목동, 일산, 광명)', fee: 15000, text: '+15,000원' },
  zone3: { id: 'zone3', name: '3권역 (서울 전역(강남/서초/송파 등), 수원, 안양, 화성, 분당, 파주)', fee: 30000, text: '+30,000원' },
  zone4: { id: 'zone4', name: '4권역 (경기 외곽/평택/이천 및 기타 장거리)', fee: 50000, text: '상담 후 협의' }
};

const DEFAULT_FALLBACK_TECH = {
  id: 'TECH-001',
  name: '김태진',
  phone: '010-8821-4920',
  region: '인천/서부권',
  baseLocation: '인천 서구 청라국제도시',
  badge: '마스터 디테일러',
  rating: 4.98,
  reviewCount: 142,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
};

export const BookingForm = ({ preselectedService, preselectedPrice, targetTech, onClearTargetTech, onOpenTracker }) => {
  const [technicians, setTechnicians] = useState(() => getTechnicians());
  const [selectedTechId, setSelectedTechId] = useState(targetTech?.id || 'AUTO_CLOSEST');

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
    hasOutlet: true,
    isIndoor: true,
    basePrice: preselectedPrice || 343000,
    estimatedPrice: preselectedPrice || 343000
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    const loaded = getTechnicians();
    if (loaded && loaded.length > 0) {
      setTechnicians(loaded);
    }
  }, []);

  useEffect(() => {
    if (targetTech) {
      setSelectedTechId(targetTech.id);
    }
  }, [targetTech]);

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

  // Calculate closest technician for live preview with safe fallbacks
  const closestTechnicians = getTechniciansByProximity(formData.travelZone, formData.location, technicians.length > 0 ? technicians : [DEFAULT_FALLBACK_TECH]);
  const primaryClosestTech = closestTechnicians[0] || technicians[0] || DEFAULT_FALLBACK_TECH;
  const activeAssignedTech = selectedTechId === 'AUTO_CLOSEST' 
    ? primaryClosestTech 
    : (technicians.find(t => t.id === selectedTechId) || primaryClosestTech);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
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
      const finalTech = activeAssignedTech;

      // 1. 중개 의뢰 데이터 로컬스토리지 저장 (표준 정찰가 + 최단거리/선택 기사 연결)
      const newRequest = saveMatchRequest({
        customerName: formData.customerName,
        phone: formData.phone,
        carModel: `${formData.carModel} (${formData.carColor}${formData.carYear ? `, ${formData.carYear}년식` : ''})`,
        carColor: formData.carColor,
        carYear: formData.carYear,
        serviceName: formData.serviceName,
        travelZone: formData.travelZone,
        location: formData.location,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes,
        hasOutlet: formData.hasOutlet,
        isIndoor: formData.isIndoor,
        budget: formData.estimatedPrice,
        estimatedPrice: formData.estimatedPrice,
        targetTechId: selectedTechId === 'AUTO_CLOSEST' ? null : finalTech.id,
        targetTechName: selectedTechId === 'AUTO_CLOSEST' ? `${finalTech.name} 프로 (최단거리 자동추천)` : `${finalTech.name} 프로 (고객직접선택)`
      });

      // 2. 구글 스프레드시트 웹훅 전송 시도
      try {
        await sendToGoogleSheet({
          ...formData,
          id: newRequest.id,
          targetTech: finalTech.name,
          estimatedPrice: formData.estimatedPrice
        });
      } catch (err) {
        console.warn('Google Sheet Sync Error (fallback local):', err);
      }

      // 3. 축하 콘페티 효과
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      setSubmitResult({
        success: true,
        requestId: newRequest.id,
        matchedTechName: finalTech.name,
        matchedTechAvatar: finalTech.avatar,
        isClosest: selectedTechId === 'AUTO_CLOSEST',
        finalPrice: formData.estimatedPrice
      });

    } catch (error) {
      console.error('Submission Error:', error);
      alert('견적 요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>플랫폼 제도화 표준 정찰제 · 최단거리 기사 자동 연결</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          실시간 <span className="text-gradient">출장 디테일링 견적 신청</span>
        </h2>
        
        <p className="mt-3 text-sm sm:text-base text-slate-300">
          오버차지(과다 청구) 없는 <strong className="text-cyan-400 font-bold">제도화된 표준 정찰 가격</strong>으로, 
          고객님 주소지와 가장 가까운 검증된 기술자와 즉시 매칭됩니다.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative z-10">
        
        {submitResult ? (
          <div className="py-12 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                의뢰 번호: {submitResult.requestId}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                표준 정찰가 견적 의뢰가 접수되었습니다!
              </h3>
              
              {/* Matched Tech Card */}
              <div className="max-w-md mx-auto bg-slate-900/80 p-4 rounded-2xl border border-cyan-500/30 flex items-center justify-between text-left mt-4">
                <div className="flex items-center gap-3">
                  <img src={submitResult.matchedTechAvatar} alt={submitResult.matchedTechName} className="w-12 h-12 rounded-xl object-cover border border-cyan-400" />
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      {submitResult.isClosest ? '📍 최단거리 1순위 자동 매칭' : '고객 직접 선택 매칭'}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">{submitResult.matchedTechName} 프로</h4>
                    <p className="text-[11px] text-slate-400">담당 기사가 고객님께 확인 전화를 드릴 예정입니다.</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">제도화 확정가</span>
                  <span className="text-sm font-black text-emerald-400">{submitResult.finalPrice?.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onOpenTracker && (
                <button
                  onClick={() => {
                    setSubmitResult(null);
                    onOpenTracker();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/30 transition-all"
                >
                  내 의뢰 진행상황 & 다른 기사 비교/변경
                </button>
              )}
              <button
                onClick={() => setSubmitResult(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                새로운 견적 의뢰 작성
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Vehicle & Service Selection */}
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Car className="w-5 h-5 text-cyan-400" />
                <span>1. 차량 정보 및 희망 시공 항목</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    차종 모델명 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    placeholder="예: 제네시스 G80, 쏘렌토"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    차량 색상 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleChange}
                    placeholder="예: 블랙(우유니화이트)"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    차량 연식 (선택)
                  </label>
                  <input
                    type="text"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleChange}
                    placeholder="예: 2024년식"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Service Select */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  희망 시공 패키지 / 부위 선택 (표준 정찰제) <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleServiceChange}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <optgroup label="[인기 종합 패키지]">
                    <option value="3스텝 광택 + 9H 유리막 코팅">3스텝 수성광택 + 9H 유리막 코팅 (가장 인기)</option>
                    <option value="베이직 수성 광택">베이직 2스텝 수성 광택 (도장면 정리)</option>
                    <option value="VIP 올인원 풀케어 패키지">VIP 올인원 풀케어 (외장광택+유리막+전체유리발수)</option>
                    <option value="2스텝 세미광택 (도장보호 & 광택 케어)">2스텝 세미광택 (클리어층 비파괴 보호 케어)</option>
                  </optgroup>
                  <optgroup label="[알뜰 부분별 맞춤 케어]">
                    <option value="원하는 부위만 쏙! 맞춤 패널 선택 케어">원하는 부위만 쏙! 맞춤 패널 선택 케어</option>
                    <option value="본넷(후드) 집중 수성 광택 & 케어">본넷(후드) 집중 수성 광택 & 케어</option>
                    <option value="도어(문짝) 흠집 & 스월마크 케어">도어(문짝) 흠집 & 스월마크 케어</option>
                    <option value="앞·뒤 범퍼 & 코너 쓸림 집중 광택">앞·뒤 범퍼 & 코너 쓸림 집중 광택</option>
                    <option value="앞·뒤 휀다 & 필러 집중 케어">앞·뒤 휀다 & 필러 집중 케어</option>
                    <option value="트렁크 & 루프(천장) 오염 케어">트렁크 & 루프(천장) 오염 케어</option>
                    <option value="전면 유리 유막제거 + 초발수 코팅">전면 유리 유막제거 + 초발수 코팅</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* 2. Customer & Location Info */}
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>2. 고객 정보 및 출장지 위치</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    예약자 성함 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="예: 홍길동"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    연락처 (휴대폰 번호) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              {/* Travel Zone */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  출장 권역 선택 <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="travelZone"
                  value={formData.travelZone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="zone1">1권역: 인천 서구(청라/루원/검단), 부평, 계양, 김포남부, 부천 (출장비 0원)</option>
                  <option value="zone2">2권역: 송도, 영종, 남동구, 김포한강, 서울서부(강서/마곡/목동/구로), 일산, 광명 (+15,000원)</option>
                  <option value="zone3">3권역: 서울 전역(강남/서초/송파/용산 등), 수원, 안양, 성남(분당), 화성, 파주 (+30,000원)</option>
                  <option value="zone4">4권역: 경기 외곽/평택/이천/안성 및 기타 장거리 (협의)</option>
                </select>
              </div>

              {/* Detailed Location Address */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  상세 출장 주소 & 주차 구역 <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="예: 서울 강남구 역삼동 741 아파트 지하 2층 주차장 B구역"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* 3. Proximity-based Technician Matching Box */}
            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-extrabold text-white">기술자 연결 방식 (최단거리 자동 or 직접 선택)</h4>
                </div>
                <span className="text-[11px] text-cyan-300 font-semibold bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                  어떤 기사를 선택해도 플랫폼 표준 정찰가 동일 적용
                </span>
              </div>

              {/* Technician Choice Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTechId('AUTO_CLOSEST')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedTechId === 'AUTO_CLOSEST'
                      ? 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/20'
                      : 'border-white/10 bg-slate-900/60 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      추천 1순위
                    </span>
                    <span className="text-xs text-cyan-400 font-bold">자동 연결</span>
                  </div>
                  <p className="text-xs font-extrabold text-white mt-1">📍 고객 위치 최단거리 기사</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    현재 1순위: <strong>{primaryClosestTech?.name || '김태진'} 프로</strong> ({primaryClosestTech?.region || '인천/서부권'})
                  </p>
                </button>

                {technicians.slice(0, 2).map(tech => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedTechId(tech.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                      selectedTechId === tech.id
                        ? 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/20'
                        : 'border-white/10 bg-slate-900/60 hover:bg-slate-900'
                    }`}
                  >
                    <img src={tech.avatar} alt={tech.name} className="w-9 h-9 rounded-lg object-cover border border-cyan-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">{tech.name}</span>
                        <span className="text-[10px] text-amber-400">★{tech.rating}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{tech.region}</p>
                      <p className="text-[10px] text-cyan-300 font-semibold">{tech.badge}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Connected Tech Summary Banner */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={activeAssignedTech?.avatar || DEFAULT_FALLBACK_TECH.avatar} alt={activeAssignedTech?.name || '디테일러'} className="w-8 h-8 rounded-full object-cover border border-cyan-500" />
                  <div>
                    <span className="text-slate-400">매칭 예정 기술자: </span>
                    <strong className="text-white">{activeAssignedTech?.name || '김태진'} 프로</strong>
                    <span className="text-slate-400 ml-1">({activeAssignedTech?.baseLocation || activeAssignedTech?.region || '인천 청라 거점'})</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">
                  🛡️ 오버차지 0원 보증
                </span>
              </div>
            </div>

            {/* 4. Schedule & Parking Environment */}
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>4. 희망 일정 및 현장 환경</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    희망 시공 일자 <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    희망 시작 시간
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="09:00">오전 09:00</option>
                    <option value="10:00">오전 10:00 (추천)</option>
                    <option value="11:00">오전 11:00</option>
                    <option value="13:00">오후 01:00</option>
                    <option value="14:00">오후 02:00</option>
                    <option value="15:00">오후 03:00</option>
                    <option value="시간협의">기사와 시간 협의</option>
                  </select>
                </div>
              </div>

              {/* Environment Checkboxes */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/40 p-4 rounded-xl border border-white/5">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    name="hasOutlet"
                    checked={formData.hasOutlet}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                  />
                  <span>주차장 인근 220V 콘센트 사용 가능 (또는 기사 이동전원 활용)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    name="isIndoor"
                    checked={formData.isIndoor}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-cyan-500"
                  />
                  <span>비/직사광선을 피할 수 있는 지하 또는 실내 주차 공간</span>
                </label>
              </div>

              {/* Special Requests */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  차량 손상 상태 및 특별 요청사항 (선택)
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="예: 조수석 도어에 문콕 스크래치가 깊습니다 / 석회물 자국 제거가 필요합니다"
                  className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Price Estimation & Submit Action */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>플랫폼 제도화 표준 정찰가 (오버차지 0원 보증)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                    {formData.estimatedPrice.toLocaleString()}원
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">
                    (정찰제 확정가 / 현장 검수 후 결제)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{isSubmitting ? '접수 처리 중...' : '표준 정찰가로 기사 매칭 신청하기'}</span>
              </button>
            </div>

          </form>
        )}

      </div>

    </section>
  );
};
