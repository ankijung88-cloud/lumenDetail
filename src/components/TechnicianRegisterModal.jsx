import React, { useState, useRef } from 'react';
import { 
  X, ShieldCheck, Sparkles, User, Phone, MapPin, 
  Wrench, FileText, CheckCircle2, Award, Camera, Lock,
  Upload, Image as ImageIcon, Trash2, RefreshCw
} from 'lucide-react';
import { saveTechnician } from '../utils/storage';
import confetti from 'canvas-confetti';

const AVATAR_PRESETS = [
  { id: 'av1', label: '마스터 A', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { id: 'av2', label: '마스터 B', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'av3', label: '마스터 C', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'av4', label: '마스터 D', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'av5', label: '마스터 E', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80' }
];

export const TechnicianRegisterModal = ({ isOpen, onClose, onRegistered }) => {
  const fileInputRef = useRef(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [photoTab, setPhotoTab] = useState('upload'); // 'upload' | 'preset' | 'url'
  const [customUrlInput, setCustomUrlInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pin: '',
    experienceYears: 5,
    region: '인천/서부권',
    baseLocation: '인천 서구 청라국제도시',
    activeZonesText: '인천 서구, 청라, 부평, 김포 남부, 부천',
    specialtiesText: '수성 듀얼 광택, 9H 세라믹 코팅, 유리막 코팅',
    introduction: '',
    equipmentText: 'Rupes BigFoot 듀얼 광택기, Elcometer 도막 측정기, 고색재현 LED 조명',
    minPrice: 200000,
    avatar: AVATAR_PRESETS[0].url
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Compress & resize image to light base64
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WEBP 등)만 업로드할 수 있습니다.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCustomAvatar(compressedDataUrl);
          setFormData(prev => ({ ...prev, avatar: compressedDataUrl }));
          setIsUploadingImage(false);
        };
        img.onerror = () => {
          alert('이미지를 불러오는데 실패했습니다.');
          setIsUploadingImage(false);
        };
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('이미지 처리 중 오류가 발생했습니다.');
      setIsUploadingImage(false);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setCustomAvatar(customUrlInput.trim());
    setFormData(prev => ({ ...prev, avatar: customUrlInput.trim() }));
  };

  const handleRemoveCustomAvatar = () => {
    setCustomAvatar(null);
    setFormData(prev => ({ ...prev, avatar: AVATAR_PRESETS[0].url }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.introduction.trim()) {
      alert('성함, 연락처, 자기소개를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activeZones = formData.activeZonesText.split(',').map(s => s.trim()).filter(Boolean);
      const specialties = formData.specialtiesText.split(',').map(s => s.trim()).filter(Boolean);
      const equipment = formData.equipmentText.split(',').map(s => s.trim()).filter(Boolean);
      const phoneDigits = formData.phone.replace(/\D/g, '');
      const last4 = phoneDigits.slice(-4) || '1234';

      const newTech = saveTechnician({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        pin: formData.pin.trim() || last4,
        experienceYears: Number(formData.experienceYears) || 3,
        region: formData.region,
        baseLocation: formData.baseLocation.trim() || formData.region,
        activeZones: activeZones.length > 0 ? activeZones : [formData.region],
        specialties: specialties.length > 0 ? specialties : ['수성 듀얼 광택', '유리막 코팅'],
        equipment: equipment.length > 0 ? equipment : ['수성 전용 듀얼 광택기', '도막 측정기'],
        introduction: formData.introduction.trim(),
        minPrice: Number(formData.minPrice) || 200000,
        badge: '인증 파트너 프로',
        avatar: formData.avatar || AVATAR_PRESETS[0].url,
        coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });

      alert(`🎉 [${formData.name}] 프로님! 파트너 등록이 정상 완료되었습니다.\n• 로그인 계정: ${formData.phone} (또는 ${formData.name})\n• 로그인 PIN: ${formData.pin.trim() || last4}\n\n등록된 프로필 사진 및 정보가 고객 기사 탐색 및 실시간 매칭에 즉시 반영됩니다.`);
      
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
            등록 즉시 고객에게 프로필과 사진이 노출되며, 출장 시공 의뢰 수주 및 기사 포털 로그인이 가능합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ==================== Profile Photo Section ==================== */}
          <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>프로필 사진 등록 / 선택</span>
              </label>

              {/* Photo Mode Switcher Tabs */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPhotoTab('upload')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    photoTab === 'upload'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  내 사진 업로드
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('preset')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    photoTab === 'preset'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  추천 프로필
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoTab('url')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    photoTab === 'url'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  URL 입력
                </button>
              </div>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* 1. Direct File Upload View */}
            {photoTab === 'upload' && (
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                {/* Current Avatar Preview */}
                <div className="relative group">
                  <img
                    src={formData.avatar || AVATAR_PRESETS[0].url}
                    alt="프로필 미리보기"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black shadow">
                    ✓
                  </div>
                </div>

                <div className="flex-grow space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingImage ? '사진 압축 처리 중...' : '내 기기에서 사진 선택 (직접 업로드)'}</span>
                    </button>

                    {customAvatar && (
                      <button
                        type="button"
                        onClick={handleRemoveCustomAvatar}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-bold transition-colors flex items-center gap-1"
                        title="업로드 사진 초기화"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>삭제</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    JPG, PNG, WEBP 지원 (모바일 갤러리 또는 PC 파일에서 본인 시공 사진/프로필을 바로 등록할 수 있습니다).
                  </p>
                </div>
              </div>
            )}

            {/* 2. Preset Avatars Selection View */}
            {photoTab === 'preset' && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {AVATAR_PRESETS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        setCustomAvatar(null);
                        setFormData(prev => ({ ...prev, avatar: item.url }));
                      }}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 shrink-0 ${
                        formData.avatar === item.url 
                          ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-500/20' 
                          : 'border-white/10 hover:border-slate-500 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.label} className="w-14 h-14 rounded-xl object-cover" />
                      {formData.avatar === item.url && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">추천된 1급 마스터 디테일러 프로필 아이콘 중 선택할 수 있습니다.</p>
              </div>
            )}

            {/* 3. Image URL Input View */}
            {photoTab === 'url' && (
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-grow px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0"
                  >
                    적용
                  </button>
                </div>
                {formData.avatar && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <img src={formData.avatar} alt="적용된 사진" className="w-8 h-8 rounded-lg object-cover border border-cyan-400" />
                    <span>현재 이미지 URL이 적용되었습니다.</span>
                  </div>
                )}
              </div>
            )}

          </div>

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
                연락처 (휴대폰 번호) <span className="text-cyan-400">*</span>
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

            {/* Base Location */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                거점 상세 위치 <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                name="baseLocation"
                value={formData.baseLocation}
                onChange={handleChange}
                placeholder="예: 인천 서구 청라국제도시"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Login PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                기사 포털 로그인 PIN (미입력 시 휴대폰 뒤 4자리)
              </label>
              <input
                type="password"
                name="pin"
                maxLength="6"
                value={formData.pin}
                onChange={handleChange}
                placeholder="예: 1234 (4~6자리)"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
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
              placeholder="예: 수성 듀얼 광택, 9H 세라믹 코팅, 실내 스팀 크리닝"
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
