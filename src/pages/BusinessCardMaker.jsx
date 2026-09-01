import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { getCardProfile, saveCardProfile } from '../utils/storage';
import { 
  CreditCard, Sparkles, Download, Printer, Save, RefreshCw, 
  ChevronLeft, Phone, Mail, MapPin, QrCode, Check, ShieldCheck, 
  RotateCcw, Eye, Palette, Car, Award, Image
} from 'lucide-react';

export const BusinessCardMaker = ({ onBackToAdmin }) => {
  const [profile, setProfile] = useState(getCardProfile());
  const [activeSide, setActiveSide] = useState('both'); // 'front' | 'back' | 'both'
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState('');

  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    setProfile(getCardProfile());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    saveCardProfile(profile);
    alert('명함 정보가 브라우저에 안전하게 저장되었습니다.');
  };

  const handleReset = () => {
    if (window.confirm('명함 설정을 초기 기본값으로 되돌리시겠습니까?')) {
      const defaultProf = {
        shopName: '루멘 디테일링',
        englishName: 'LUMEN DETAILING SERVICE',
        ownerName: '홍길동 대표',
        title: '출장 디테일링 & 광택 전문가',
        phone: '010-1234-5678',
        email: 'lumendetail@gmail.com',
        location: '수도권 전지역 출장 (서울/경기/인천)',
        services: '수성듀얼광택 · 9H유리막코팅 · 실내크리닝 · 유막제거',
        instagram: '@lumen_detailing',
        bankAccount: '국민은행 123456-04-123456 (루멘)',
        qrType: 'url',
        qrCustomText: window.location.origin,
        theme: 'carbon-dark',
        accentTag: '100% 예약제 맞춤 1:1 출장 시공'
      };
      setProfile(defaultProf);
      saveCardProfile(defaultProf);
    }
  };

  // QR코드 단독 고해상도 다운로드
  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-download-canvas');
    if (canvas) {
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${profile.shopName || '루멘디테일'}_QR코드.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setDownloadMsg('QR코드 이미지가 다운로드되었습니다.');
      setTimeout(() => setDownloadMsg(''), 3000);
    }
  };

  // 명함 이미지 개별 / 일괄 다운로드 (앞면 / 뒷면 / 양면)
  const handleDownloadImage = async (type) => {
    setIsDownloading(true);
    try {
      const theme = getThemeStyles();
      const exportOptions = {
        scale: 4, // 4배 초고화질 (300DPI급)
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme.solidBg, // 투명도 뭉개짐 방지: 테마 고유의 솔리드 배경색 적용
        logging: false,
        onclone: (clonedDoc, clonedElement) => {
          // html2canvas가 지원하지 못하는 텍스트 클리핑(-webkit-text-fill-color: transparent)을 솔리드 고선명 컬러로 자동 보정
          const textGradients = clonedElement.querySelectorAll('.text-gradient, .text-gradient-gold');
          textGradients.forEach(el => {
            el.style.background = 'none';
            el.style.webkitBackgroundClip = 'unset';
            el.style.webkitTextFillColor = 'initial';
            el.style.color = profile.theme === 'gold-luxury' ? '#f59e0b' : '#38bdf8';
            el.style.fontWeight = '900';
          });
        }
      };

      if (type === 'front' || type === 'both') {
        if (frontRef.current) {
          const canvas = await html2canvas(frontRef.current, exportOptions);
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.download = `${profile.shopName || '루멘디테일'}_명함_앞면.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      if (type === 'back' || type === 'both') {
        if (backRef.current) {
          const canvas = await html2canvas(backRef.current, exportOptions);
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          const link = document.createElement('a');
          link.download = `${profile.shopName || '루멘디테일'}_명함_뒷면.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }

      const msg = type === 'front' 
        ? '앞면 명함 고화질 이미지가 다운로드되었습니다.' 
        : type === 'back' 
        ? '뒷면 명함 고화질 이미지가 다운로드되었습니다.' 
        : '앞/뒷면 명함 고화질 이미지가 모두 다운로드되었습니다.';
      setDownloadMsg(msg);
      setTimeout(() => setDownloadMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 테마별 스타일 정의 (솔리드 베이스 컬러 포함)
  const getThemeStyles = () => {
    switch (profile.theme) {
      case 'gold-luxury':
        return {
          solidBg: '#141210',
          cardBg: 'bg-gradient-to-br from-[#1c1917] via-[#141210] to-[#0c0a09]',
          border: 'border border-amber-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]',
          accentText: 'text-amber-400',
          accentBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          gradientText: 'text-gradient-gold',
          iconColor: 'text-amber-400',
          pattern: 'radial-gradient(ellipse at top right, rgba(234, 179, 8, 0.15), transparent 70%)'
        };
      case 'neon-blue':
        return {
          solidBg: '#050b17',
          cardBg: 'bg-gradient-to-br from-[#081528] via-[#050b17] to-[#02050b]',
          border: 'border border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
          accentText: 'text-sky-400',
          accentBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
          gradientText: 'text-gradient',
          iconColor: 'text-sky-400',
          pattern: 'radial-gradient(ellipse at bottom left, rgba(56, 189, 248, 0.2), transparent 70%)'
        };
      case 'clean-silver':
        return {
          solidBg: '#121722',
          cardBg: 'bg-gradient-to-br from-[#1e2430] via-[#121722] to-[#0a0d14]',
          border: 'border border-slate-400/50 shadow-[0_0_15px_rgba(203,213,225,0.15)]',
          accentText: 'text-slate-100',
          accentBg: 'bg-slate-700/60 text-white border-slate-400/40',
          gradientText: 'text-gradient',
          iconColor: 'text-slate-200',
          pattern: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08), transparent 70%)'
        };
      case 'carbon-dark':
      default:
        return {
          solidBg: '#090e17',
          cardBg: 'bg-gradient-to-br from-[#0f172a] via-[#090e17] to-[#04060a]',
          border: 'border border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
          accentText: 'text-cyan-400',
          accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          gradientText: 'text-gradient',
          iconColor: 'text-cyan-400',
          pattern: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.2), transparent 60%)'
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
      <div className="max-w-7xl mx-auto space-y-8 no-print">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <button
              onClick={onBackToAdmin}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>관리자 대시보드로 돌아가기</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">출장차량관리 전용 디지털 명함 제작기</h1>
                <p className="text-xs text-slate-400 mt-0.5">실시간 QR코드 생성, 럭셔리 테마, 이미지 저장 및 A4 인쇄 지원</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveProfile}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>설정값 저장</span>
            </button>

            <div className="h-5 w-[1px] bg-white/10 mx-1 hidden sm:block" />

            <button
              onClick={() => handleDownloadImage('front')}
              disabled={isDownloading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="명함 앞면만 이미지로 다운로드"
            >
              <Image className="w-3.5 h-3.5 text-cyan-400" />
              <span>앞면 PNG</span>
            </button>

            <button
              onClick={() => handleDownloadImage('back')}
              disabled={isDownloading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="명함 뒷면만 이미지로 다운로드"
            >
              <Image className="w-3.5 h-3.5 text-cyan-400" />
              <span>뒷면 PNG</span>
            </button>

            <button
              onClick={handleDownloadQR}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="QR코드만 고해상도 단독 이미지로 다운로드"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>QR코드 PNG</span>
            </button>

            <button
              onClick={() => handleDownloadImage('both')}
              disabled={isDownloading}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="앞면과 뒷면 이미지를 둘 다 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? '생성 중...' : '앞/뒷면 일괄저장'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>A4 인쇄</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="기본값 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download Feedback Notification */}
        {downloadMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>{downloadMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Edit Fields (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">명함 스타일 & 테마 선택</h3>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'carbon-dark', name: '카본 다크', color: 'bg-[#0b0f17] border-cyan-500' },
                  { id: 'gold-luxury', name: '골드 럭셔리', color: 'bg-[#1c1917] border-amber-500' },
                  { id: 'neon-blue', name: '네온 블루', color: 'bg-[#081528] border-sky-400' },
                  { id: 'clean-silver', name: '실버 메탈', color: 'bg-[#1e2430] border-slate-400' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setProfile(prev => ({ ...prev, theme: th.id }))}
                    className={`p-2.5 rounded-xl text-center text-xs font-bold border transition-all ${
                      profile.theme === th.id
                        ? `${th.color} text-white ring-2 ring-cyan-400`
                        : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-4">
                
                {/* Shop Name & Eng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">상호명 (브랜드)</label>
                    <input
                      type="text"
                      name="shopName"
                      value={profile.shopName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">영문 상호명</label>
                    <input
                      type="text"
                      name="englishName"
                      value={profile.englishName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Owner Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">대표자명 (성함)</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={profile.ownerName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">직함 / 소개 문구</label>
                    <input
                      type="text"
                      name="title"
                      value={profile.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">대표 연락처</label>
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">이메일</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Location & Services */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">출장 가능 지역</label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">주요 전문 시공 품목</label>
                  <input
                    type="text"
                    name="services"
                    value={profile.services}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Bank & Instagram */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">입금 계좌번호 (뒷면용)</label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={profile.bankAccount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">인스타그램 / SNS</label>
                    <input
                      type="text"
                      name="instagram"
                      value={profile.instagram}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* QR Text */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      QR코드 연결 링크 (URL 또는 카톡아이디)
                    </label>
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>QR코드 다운로드</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    name="qrCustomText"
                    value={profile.qrCustomText}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* Right Live Preview: 90x50mm Standard Card (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">실시간 명함 프리뷰 (표준 규격: 90mm × 50mm)</h3>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setActiveSide('both')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeSide === 'both' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  앞/뒷면 동시보기
                </button>
                <button
                  onClick={() => setActiveSide('front')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeSide === 'front' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  앞면만
                </button>
                <button
                  onClick={() => setActiveSide('back')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    activeSide === 'back' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  뒷면만
                </button>
              </div>
            </div>

            <div className="space-y-8 flex flex-col items-center">
              
              {/* FRONT CARD PREVIEW */}
              {(activeSide === 'both' || activeSide === 'front') && (
                <div className="w-full max-w-[500px] flex flex-col items-center space-y-3">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      ▲ 명함 앞면 (Front Side)
                    </span>
                    <button
                      onClick={() => handleDownloadImage('front')}
                      disabled={isDownloading}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>앞면 이미지 다운로드</span>
                    </button>
                  </div>

                  <div
                    ref={frontRef}
                    className={`w-full aspect-[9/5] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between select-none ${themeStyle.cardBg} ${themeStyle.border}`}
                    style={{ backgroundImage: themeStyle.pattern }}
                  >
                    {/* Top Branding */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-white/10 ${themeStyle.iconColor}`}>
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <span className={`font-black text-lg tracking-wider ${themeStyle.gradientText}`}>
                            {profile.shopName}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                          {profile.englishName}
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${themeStyle.accentBg}`}>
                        {profile.accentTag}
                      </span>
                    </div>

                    {/* Middle Info: Owner & Contact */}
                    <div className="my-auto py-2">
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-xl sm:text-2xl font-black text-white">{profile.ownerName}</h4>
                        <span className={`text-xs font-semibold ${themeStyle.accentText}`}>{profile.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-200 font-mono mt-1 tracking-wide">
                        {profile.phone}
                      </p>
                    </div>

                    {/* Bottom Features & Location */}
                    <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-[11px] text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className={`w-3.5 h-3.5 ${themeStyle.iconColor} shrink-0`} />
                        <span className="truncate max-w-[280px]">{profile.location}</span>
                      </div>
                      <span className={`text-[10.5px] font-sans font-bold tracking-normal ${themeStyle.accentText}`}>
                        1:1 맞춤 출장
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {/* BACK CARD PREVIEW */}
              {(activeSide === 'both' || activeSide === 'back') && (
                <div className="w-full max-w-[500px] flex flex-col items-center space-y-3">
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      ▲ 명함 뒷면 (Back Side)
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDownloadQR}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR코드 다운로드</span>
                      </button>
                      <span className="text-slate-600">|</span>
                      <button
                        onClick={() => handleDownloadImage('back')}
                        disabled={isDownloading}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>뒷면 이미지 다운로드</span>
                      </button>
                    </div>
                  </div>

                  <div
                    ref={backRef}
                    className={`w-full aspect-[9/5] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between select-none ${themeStyle.cardBg} ${themeStyle.border}`}
                    style={{ backgroundImage: themeStyle.pattern }}
                  >
                    {/* Top Services */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Car className={`w-4 h-4 ${themeStyle.iconColor}`} />
                        <span className="text-xs font-bold text-white">PROFESSIONAL SERVICES</span>
                      </div>
                      <p className="text-xs font-semibold text-cyan-300 leading-relaxed bg-black/40 p-2 rounded-xl border border-white/5">
                        {profile.services}
                      </p>
                    </div>

                    {/* Middle: Details & QR Code */}
                    <div className="flex items-center justify-between gap-4 my-1">
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {profile.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{profile.email}</span>
                          </div>
                        )}
                        {profile.instagram && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-pink-400 text-xs">Insta</span>
                            <span>{profile.instagram}</span>
                          </div>
                        )}
                        {profile.bankAccount && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                            <span>입금:</span>
                            <span className="font-mono text-slate-300">{profile.bankAccount}</span>
                          </div>
                        )}
                      </div>

                      {/* QR Code Container */}
                      <div className="p-2 bg-white rounded-xl shadow-lg shrink-0 flex flex-col items-center">
                        <QRCodeSVG
                          value={profile.qrCustomText || window.location.origin}
                          size={64}
                          level="M"
                          includeMargin={false}
                        />
                        <span className="text-[8px] font-bold text-slate-900 mt-1 font-sans">예약 바로가기</span>
                      </div>
                    </div>

                    {/* Bottom Guarantee */}
                    <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className={`w-3.5 h-3.5 ${themeStyle.iconColor}`} />
                        <span>정품 정량 케미컬 100% 수성광택 시공보증</span>
                      </div>
                      <span className="font-mono text-slate-500">LUMEN</span>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Hidden High-Resolution QR Canvas for Direct Download */}
            <div className="hidden" aria-hidden="true">
              <QRCodeCanvas
                id="qr-download-canvas"
                value={profile.qrCustomText || window.location.origin}
                size={512}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Print Guide Message */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 space-y-1">
              <p className="text-cyan-300 font-bold flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" />
                <span>명함 다운로드 & 인쇄 안내</span>
              </p>
              <p>
                - <strong>[앞면 PNG] / [뒷면 PNG]</strong> : 명함 앞면 또는 뒷면만 개별 고화질(300DPI급) 이미지로 저장합니다.<br />
                - <strong>[QR코드 PNG]</strong> : 명함에 삽입된 QR코드만 512x512 고해상도 이미지로 단독 다운로드합니다.<br />
                - <strong>[A4 인쇄]</strong> : A4 한 장에 <strong>앞면 5매(좌측) + 뒷면 5매(우측) 총 10매</strong>가 표준 규격(90×50mm)으로 인쇄됩니다.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* A4 10-Card Print Imposition Sheet (5 Front Cards + 5 Back Cards)         */}
      {/* High-contrast paper-optimized design so all text is 100% sharp & visible */}
      {/* ========================================================================= */}
      <div className="print-only hidden">
        <div className="print-card-grid">
          {[0, 1, 2, 3, 4].map((idx) => (
            <React.Fragment key={idx}>
              {/* Left Column: Front Card (1 of 5) */}
              <div className="print-card-item bg-white text-slate-900">
                <div className="w-full h-full p-3.5 relative overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 border border-slate-200">
                  
                  {/* Top Branding */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="p-1 rounded bg-cyan-100 text-cyan-700 border border-cyan-300">
                          <Sparkles className="w-3 h-3" />
                        </div>
                        <span className="font-black text-sm tracking-wider text-slate-950">
                          {profile.shopName}
                        </span>
                      </div>
                      <p className="text-[7.5px] text-slate-500 font-mono tracking-widest uppercase mt-0.5 font-bold">
                        {profile.englishName}
                      </p>
                    </div>
                    <span className="text-[7.5px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                      {profile.accentTag}
                    </span>
                  </div>

                  {/* Center Name & Title (High Contrast Black) */}
                  <div className="my-auto py-1">
                    <div className="flex items-baseline gap-1.5">
                      <h4 className="text-base font-black text-slate-950 tracking-tight">{profile.ownerName}</h4>
                      <span className="text-[9px] font-bold text-cyan-700">{profile.title}</span>
                    </div>
                    <p className="text-[11px] font-extrabold text-slate-900 font-mono mt-0.5 tracking-wide">
                      {profile.phone}
                    </p>
                  </div>

                  {/* Bottom Footer */}
                  <div className="border-t border-slate-200 pt-1 flex items-center justify-between text-[8px] text-slate-700 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-cyan-700 shrink-0" />
                      <span className="truncate max-w-[180px]">{profile.location}</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-cyan-800 font-sans tracking-normal">1:1 맞춤 출장</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Back Card (1 of 5) */}
              <div className="print-card-item bg-white text-slate-900">
                <div className="w-full h-full p-3.5 relative overflow-hidden flex flex-col justify-between select-none bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 border border-slate-200">
                  
                  {/* Top Services */}
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Car className="w-3 h-3 text-cyan-700" />
                      <span className="text-[8.5px] font-black text-slate-950 tracking-wider">PROFESSIONAL SERVICES</span>
                    </div>
                    <p className="text-[8px] font-bold text-cyan-950 leading-tight bg-cyan-100/70 p-1.5 rounded border border-cyan-300/80">
                      {profile.services}
                    </p>
                  </div>

                  {/* Middle Contacts & QR */}
                  <div className="flex items-center justify-between gap-2 my-0.5">
                    <div className="space-y-0.5 text-[8px] text-slate-800 font-medium">
                      {profile.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                      {profile.instagram && (
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-pink-600 text-[8px]">Insta</span>
                          <span>{profile.instagram}</span>
                        </div>
                      )}
                      {profile.bankAccount && (
                        <div className="flex items-center gap-1 text-[7.5px] text-slate-700">
                          <span className="font-bold">입금:</span>
                          <span className="font-mono text-slate-900 font-bold">{profile.bankAccount}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-1 bg-white rounded shadow-sm border border-slate-300 shrink-0 flex flex-col items-center">
                      <QRCodeSVG
                        value={profile.qrCustomText || window.location.origin}
                        size={38}
                        level="M"
                        includeMargin={false}
                      />
                      <span className="text-[6.5px] font-extrabold text-slate-950 mt-0.5 font-sans tracking-tight">예약 바로가기</span>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="border-t border-slate-200 pt-1 flex items-center justify-between text-[7.5px] text-slate-700 font-medium">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-cyan-700" />
                      <span className="font-bold">100% 수성광택 시공보증</span>
                    </div>
                    <span className="font-mono font-bold text-slate-600">LUMEN</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
};
