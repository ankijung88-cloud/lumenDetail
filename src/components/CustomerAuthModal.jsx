import React, { useState } from 'react';
import { User, Phone, ShieldCheck, CheckCircle2, Lock, X, Sparkles, ArrowRight, UserPlus } from 'lucide-react';
import { loginCustomer } from '../utils/storage';
import confetti from 'canvas-confetti';

export const CustomerAuthModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "고객 회원가입 및 간편 로그인",
  subtitle = "견적 의뢰 진행 및 1:1 맞춤 기사 매칭을 위해 본인 정보를 입력해 주세요."
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true); // default true for convenience
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('성함 또는 닉네임을 입력해주세요.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setError('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    const customer = loginCustomer(name, phone, rememberMe);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    if (onSuccess) onSuccess(customer);
  };

  const handleQuickDemoLogin = (demoName, demoPhone) => {
    const customer = loginCustomer(demoName, demoPhone, rememberMe);
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    if (onSuccess) onSuccess(customer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0d121f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30 mb-3">
            <UserPlus className="w-6 h-6 text-slate-950" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{title}</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">고객 성함 (실명 또는 닉네임)</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김민준"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">휴대폰 번호 (견적 알림 및 기사 확인용)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="예: 010-3849-2918"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Auto Login Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-500"
              />
              <span className="text-slate-300 text-xs font-semibold">자동 로그인 유지</span>
            </label>
            <span className="text-[10px] text-slate-500">(체크 해제 시 창 닫거나 로그아웃 시 해제)</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>회원가입/로그인 완료 후 견적 진행</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Customer Accounts */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <span className="text-[11px] text-slate-400 font-bold block mb-2 text-center">
            ⚡ 빠른 체험용 원클릭 데모 고객 계정
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('김민준', '010-3849-2918')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-left transition-all text-xs group"
            >
              <strong className="text-white block group-hover:text-cyan-400">김민준 고객님</strong>
              <span className="text-[10px] text-cyan-400/90">010-3849-2918 (G80)</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('이서연', '010-9182-4411')}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-left transition-all text-xs group"
            >
              <strong className="text-white block group-hover:text-cyan-400">이서연 고객님</strong>
              <span className="text-[10px] text-cyan-400/90">010-9182-4411 (BMW)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
