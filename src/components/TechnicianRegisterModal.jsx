import React, { useState } from 'react';
import { 
  X, ShieldCheck, Sparkles, User, Phone, MapPin, 
  Wrench, FileText, CheckCircle2, Award, Camera
} from 'lucide-react';
import { saveTechnician } from '../utils/storage';
import confetti from 'canvas-confetti';

export const TechnicianRegisterModal = ({ isOpen, onClose, onRegistered }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    experienceYears: 5,
    region: '인천/서부권',
    activeZonesText: '인천 서구, 계양구, 김포, 부천',
    specialtiesText: '수성 듀얼 광택, 9H 세라믹 코팅, 유막제거',
    introduction: '',
    equipmentText: 'Rupes 듀얼 광택기, 도막 측정기, 이동식 조명',
    minPrice: 200000
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.introduction) {
      alert('성함, 연락처, 자기소개를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeZones = formData.activeZonesText.split(',').map(s => s.trim()).filter(Boolean);
      const specialties = formData.specialtiesText.split(',').map(s => s.trim()).filter(Boolean);
      const equipment = formData.equipmentText.split(',').map(s => s.trim()).filter(Boolean);

      const newTech = saveTechnician({
        name: formData.name,
        phone: formData.phone,
        experienceYears: Number(formData.experienceYears) || 3,
        region: formData.region,
        activeZones: activeZones.length > 0 ? activeZones : ['수도권 전지역'],
        specialties: specialties.length > 0 ? specialties : ['수성 듀얼 광택', '유리막 코팅'],
        equipment: equipment.length > 0 ? equipment : ['수성 전용 듀얼 광택기', '도막 측정기'],
        introduction: formData.introduction,
        minPrice: Number(formData.minPrice) || 200000,
        badge: '신규 인증 파트너'
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      alert(`[${formData.name}] 프로님! 파트너 등록이 완료되었습니다. 관리자 심사 후 즉시 오더 매칭이 활성화됩니다.`);
      if (onRegistered) onRegistered(newTech);
      onClose();
    } catch (err) {
      console.error(err);
      alert('파트너 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0d121f] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span>루멘 프로 매치 파트너 지원</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            디테일러 프로 파트너 간편 등록
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            등록 후 프로필이 고객에게 노출되며, 원하는 지역의 출장 시공 의뢰에 즉시 견적을 제안할 수 있습니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                기사 성함 / 상호명 <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 홍길동 마스터"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                연락처 (휴대폰) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Region */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                주 활동 권역 <span className="text-cyan-400">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="인천/서부권">인천/서부권 (청라/송도/부평/김포/부천)</option>
                <option value="서울/강남권">서울/강남권 (강남/서초/송파/성동/용산)</option>
                <option value="경기/남부권">경기/남부권 (수원/화성/동탄/분당/안양)</option>
                <option value="경기/북부권">경기/북부권 (고양/일산/파주/은평)</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                광택/디테일링 경력 (년차) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="number"
                name="experienceYears"
                min="1"
                max="30"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Active Zones Detail */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              상세 출장 가능 지역 (쉼표 구분)
            </label>
            <input
              type="text"
              name="activeZonesText"
              value={formData.activeZonesText}
              onChange={handleChange}
              placeholder="예: 인천 서구, 청라, 부평, 김포 남부, 부천 상동"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              주요 전문 시공 분야 (쉼표 구분)
            </label>
            <input
              type="text"
              name="specialtiesText"
              value={formData.specialtiesText}
              onChange={handleChange}
              placeholder="예: 수성 듀얼 광택, 9H 유리막 코팅, 실내 스팀 크리닝"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              보유 주요 장비 및 약재
            </label>
            <input
              type="text"
              name="equipmentText"
              value={formData.equipmentText}
              onChange={handleChange}
              placeholder="예: Rupes BigFoot 듀얼 광택기, 도막측정기, 이동식 조명"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              고객 소개글 & 시공 철학 <span className="text-cyan-400">*</span>
            </label>
            <textarea
              rows="3"
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              placeholder="자신만의 시공 강점, 클리어층 보호 철학, 보유 자격 등을 어필해 주세요."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
              required
            />
          </div>

          {/* Guarantee terms */}
          <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              파트너 서약 및 혜택
            </p>
            <p>• 수성 광택 표준 작업 공정을 준수하며 안전한 시공을 약속합니다.</p>
            <p>• 파트너 등록 시 모바일 디지털 명함 제작 및 QR 코드가 무료로 제공됩니다.</p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              닫기
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? '등록 처리 중...' : '파트너 등록 신청 완료'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
