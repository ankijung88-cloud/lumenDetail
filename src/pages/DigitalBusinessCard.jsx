import React, { useState } from 'react';
import { getCardProfile } from '../utils/storage';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Phone, Mail, MapPin, Sparkles, Car, ShieldCheck, 
  Calendar, ArrowRight, Share2, Copy, Check, Download
} from 'lucide-react';

export const DigitalBusinessCard = ({ onGoToBooking }) => {
  const profile = getCardProfile();
  const [activeSide, setActiveSide] = useState('front'); // 'front' | 'back'
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getThemeStyles = () => {
    switch (profile.theme) {
      case 'gold-luxury':
        return {
          solidBg: '#141210',
          gradientBg: 'linear-gradient(135deg, #1c1917 0%, #141210 50%, #0c0a09 100%)',
          cardBg: 'bg-gradient-to-br from-[#1c1917] via-[#141210] to-[#0c0a09]',
          border: 'border border-amber-500/60 shadow-[0_0_30px_rgba(234,179,8,0.25)]',
          accentText: 'text-amber-400',
          accentBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          iconColor: 'text-amber-400',
          pattern: 'radial-gradient(ellipse at top right, rgba(234, 179, 8, 0.2), transparent 70%)'
        };
      case 'neon-blue':
        return {
          solidBg: '#050b17',
          gradientBg: 'linear-gradient(135deg, #081528 0%, #050b17 50%, #02050b 100%)',
          cardBg: 'bg-gradient-to-br from-[#081528] via-[#050b17] to-[#02050b]',
          border: 'border border-sky-400/70 shadow-[0_0_30px_rgba(56,189,248,0.3)]',
          accentText: 'text-sky-400',
          accentBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
          iconColor: 'text-sky-400',
          pattern: 'radial-gradient(ellipse at bottom left, rgba(56, 189, 248, 0.25), transparent 70%)'
        };
      case 'clean-silver':
        return {
          solidBg: '#121722',
          gradientBg: 'linear-gradient(135deg, #1e2430 0%, #121722 50%, #0a0d14 100%)',
          cardBg: 'bg-gradient-to-br from-[#1e2430] via-[#121722] to-[#0a0d14]',
          border: 'border border-slate-400/60 shadow-[0_0_25px_rgba(203,213,225,0.2)]',
          accentText: 'text-slate-100',
          accentBg: 'bg-slate-700/60 text-white border-slate-400/40',
          iconColor: 'text-slate-200',
          pattern: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1), transparent 70%)'
        };
      case 'carbon-dark':
      default:
        return {
          solidBg: '#090e17',
          gradientBg: 'linear-gradient(135deg, #0f172a 0%, #090e17 50%, #04060a 100%)',
          cardBg: 'bg-gradient-to-br from-[#0f172a] via-[#090e17] to-[#04060a]',
          border: 'border border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
          accentText: 'text-cyan-400',
          accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          iconColor: 'text-cyan-400',
          pattern: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.22), transparent 60%)'
        };
    }
  };

  const themeStyle = getThemeStyles();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pt-24 pb-20 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>공식 온라인 모바일 명함</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{profile.shopName}</h2>
          <p className="text-xs text-slate-400 font-mono tracking-wider">{profile.englishName}</p>
        </div>

        {/* Card Side Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveSide('front')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeSide === 'front' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              앞면 보기
            </button>
            <button
              onClick={() => setActiveSide('back')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeSide === 'back' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              뒷면 (시공항목 & QR)
            </button>
          </div>
        </div>

        {/* Interactive Online Card Container */}
        <div className="relative group transition-all duration-300">
          
          {/* Front Card */}
          {activeSide === 'front' && (
            <div
              className={`w-full aspect-[9/5] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between select-none ${themeStyle.cardBg} ${themeStyle.border} animate-in fade-in zoom-in-95 duration-200`}
              style={{ 
                backgroundColor: themeStyle.solidBg,
                backgroundImage: `${themeStyle.pattern}, ${themeStyle.gradientBg}` 
              }}
            >
              {/* Top Branding */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-white/10 ${themeStyle.iconColor}`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-black text-lg sm:text-xl tracking-wider text-white">
                      {profile.shopName}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-bold">
                    {profile.englishName}
                  </p>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${themeStyle.accentBg}`}>
                  {profile.accentTag}
                </span>
              </div>

              {/* Middle Info: Owner & Contact */}
              <div className="my-auto py-2">
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{profile.ownerName}</h4>
                  <span className={`text-xs sm:text-sm font-bold ${themeStyle.accentText}`}>{profile.title}</span>
                </div>
                <p className="text-sm sm:text-base font-extrabold text-white font-mono mt-1 tracking-wider">
                  {profile.phone}
                </p>
              </div>

              {/* Bottom Features & Location */}
              <div className="border-t border-white/10 pt-2.5 flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-1.5">
                  <MapPin className={`w-3.5 h-3.5 ${themeStyle.iconColor} shrink-0`} />
                  <span className="truncate max-w-[240px] font-medium">{profile.location}</span>
                </div>
                <span className={`text-xs font-sans font-bold tracking-normal ${themeStyle.accentText}`}>
                  1:1 맞춤 출장
                </span>
              </div>
            </div>
          )}

          {/* Back Card */}
          {activeSide === 'back' && (
            <div
              className={`w-full aspect-[9/5] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between select-none ${themeStyle.cardBg} ${themeStyle.border} animate-in fade-in zoom-in-95 duration-200`}
              style={{ 
                backgroundColor: themeStyle.solidBg,
                backgroundImage: `${themeStyle.pattern}, ${themeStyle.gradientBg}` 
              }}
            >
              {/* Top Services */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Car className={`w-4 h-4 ${themeStyle.iconColor}`} />
                  <span className="text-xs font-bold text-white tracking-wider">PROFESSIONAL SERVICES</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-white/10">
                  <p className="text-xs font-bold text-cyan-300 leading-relaxed">
                    {profile.services}
                  </p>
                </div>
              </div>

              {/* Middle: Details & QR Code */}
              <div className="flex items-center justify-between gap-4 my-1">
                <div className="space-y-1 text-xs text-slate-200 font-medium">
                  {profile.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <span className="text-slate-400">입금:</span>
                      <span className="font-mono text-white font-bold">{profile.bankAccount}</span>
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
              <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1">
                  <ShieldCheck className={`w-3.5 h-3.5 ${themeStyle.iconColor}`} />
                  <span>정품 정량 케미컬 100% 수성광택 시공보증</span>
                </div>
                <span className="font-mono font-bold text-slate-400">LUMEN</span>
              </div>
            </div>
          )}

        </div>

        {/* 1-Click Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <a
            href={`tel:${profile.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span>전화 상담하기</span>
          </a>

          <a
            href={`sms:${profile.phone.replace(/[^0-9]/g, '')}`}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10 transition-all active:scale-[0.98]"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>문자 문의하기</span>
          </a>

          <button
            onClick={onGoToBooking}
            className="col-span-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>1:1 출장 시공 예약 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Share & Copy Link */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>온라인 명함 링크 공유</span>
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>링크 복사</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
