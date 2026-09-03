import React, { useState, useEffect } from 'react';
import { 
  User, Car, MapPin, Tag, ShieldCheck, Phone, MessageSquare, 
  ChevronRight, Wrench, Sparkles, LogOut, KeyRound, ExternalLink,
  Award, FileText, Briefcase
} from 'lucide-react';
import { getLoggedInCustomer, logoutCustomer } from '../../utils/storage';

export const MobileMyPageTab = ({ 
  onOpenRegisterModal,
  onSwitchToPartner,
  onOpenCustomerAuth
}) => {
  const [customer, setCustomer] = useState(() => getLoggedInCustomer());
  const [carInfo, setCarInfo] = useState({ model: '제네시스 G80', color: '우유니 화이트', year: '2023년식' });
  const [address, setAddress] = useState('인천 서구 청라동 루멘아파트 101동');

  useEffect(() => {
    setCustomer(getLoggedInCustomer());
  }, []);

  const handleLogout = () => {
    logoutCustomer();
    setCustomer(null);
    alert('고객 계정에서 로그아웃되었습니다. (자동로그인이 해제되었습니다)');
  };

  return (
    <div className="pb-24 space-y-4 animate-fadeIn">
      
      {/* 1. Profile Header Card */}
      <div className="px-4 pt-1">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-black text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              {customer ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-white text-sm">{customer.name} 고객님</h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      회원
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{customer.phone}</p>
                </>
              ) : (
                <>
                  <h3 className="font-extrabold text-white text-sm">로그인이 필요합니다</h3>
                  <button
                    onClick={onOpenCustomerAuth}
                    className="text-[11px] text-cyan-400 font-bold underline mt-0.5 block text-left"
                  >
                    고객 로그인 / 본인확인 하기
                  </button>
                </>
              )}
            </div>
          </div>

          {customer ? (
            <button
              onClick={handleLogout}
              className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 border border-white/10 font-bold transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              출장비 무료
            </span>
          )}
        </div>
      </div>

      {/* 2. Registered Car & Address Quick Cards */}
      <div className="px-4 grid grid-cols-2 gap-2.5">
        <div className="glass-card p-3.5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <Car className="w-3 h-3 text-cyan-400" /> 내 등록 차량
            </span>
          </div>
          <p className="text-xs font-black text-white truncate">{carInfo.model}</p>
          <p className="text-[10px] text-slate-400">{carInfo.color} ({carInfo.year})</p>
        </div>

        <div className="glass-card p-3.5 rounded-2xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <MapPin className="w-3 h-3 text-emerald-400" /> 기본 출장지
            </span>
          </div>
          <p className="text-xs font-black text-white truncate">인천 서구 청라동</p>
          <p className="text-[10px] text-slate-400 truncate">루멘아파트 101동</p>
        </div>
      </div>

      {/* 3. My Benefits & Coupons */}
      <div className="px-4">
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">보유 쿠폰 2장</p>
              <p className="text-[10px] text-slate-400">수도권 전지역 출장비 100% 무료 쿠폰</p>
            </div>
          </div>
          <span className="text-[11px] text-cyan-300 font-bold">혜택보기</span>
        </div>
      </div>

      {/* 4. Menu List */}
      <div className="px-4 space-y-2">
        <h4 className="text-xs font-extrabold text-slate-400 px-1">서비스 메뉴</h4>
        
        <div className="glass-card rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden text-xs">
          
          {/* Switch to Partner Mode on Mobile */}
          <button
            onClick={onSwitchToPartner}
            className="w-full p-3.5 flex items-center justify-between text-left bg-emerald-950/30 hover:bg-emerald-900/40 transition-colors text-emerald-300"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-300">👨‍🔧 기사 파트너 포털로 전환 (수주/정산)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-500" />
          </button>

          {/* Become Technician Partner */}
          <button
            onClick={onOpenRegisterModal}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-slate-300" />
              <span className="font-bold text-white">디테일러 기사 파트너 등록 지원</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              모집중
            </span>
          </button>

          {/* Pricing Policy Guarantee */}
          <div className="p-3.5 flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">플랫폼 표준 정찰제 보증</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">오버차지 0원</span>
          </div>

          {/* Customer Center Contact */}
          <a
            href="tel:010-8821-4920"
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-300" />
              <span className="font-bold text-white">고객센터 전화 연결 (010-8821-4920)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </a>

        </div>
      </div>

    </div>
  );
};
