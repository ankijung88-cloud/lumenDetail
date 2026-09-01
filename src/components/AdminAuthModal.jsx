import React, { useState } from 'react';
import { checkAdminPassword, setAdminAuthenticated } from '../utils/storage';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const AdminAuthModal = ({ isOpen, onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }

    if (checkAdminPassword(password)) {
      setAdminAuthenticated(true);
      setErrorMsg('');
      setPassword('');
      onSuccess();
    } else {
      setErrorMsg('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-white">관리자 전용 페이지 인증</h3>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            고객 예약 데이터 및 관리자 설정을 보호하기 위해 <br />
            관리자 비밀번호 인증이 필요합니다.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>관리자 비밀번호</span>
            </label>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="비밀번호 입력 (초기값: 1234)"
                autoFocus
                className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-2 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              기본 비밀번호는 <strong className="text-cyan-300 font-mono">1234</strong> 입니다. 
              로그인 후 관리자 대시보드에서 안전한 비밀번호로 변경하실 수 있습니다.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-all order-2 sm:order-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>메인으로 돌아가기</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] order-1 sm:order-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>인증 및 로그인</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
