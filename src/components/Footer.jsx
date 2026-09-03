import React from 'react';
import { 
  Sparkles, Phone, MessageSquare, ShieldCheck, MapPin, 
  CreditCard, LayoutDashboard, Users, Briefcase, UserCheck 
} from 'lucide-react';

export const Footer = ({ setCurrentTab, onSelectPortal }) => {
  return (
    <footer className="border-t border-white/10 bg-[#05070a] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-xl text-white tracking-wider">LUMEN PRO MATCH</span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
            루멘 프로 매치는 고객님이 계신 자택 및 직장 주차장으로 검증된 1급 디테일러를 연결해 드리는 
            프리미엄 출장 디테일링 & 수성 듀얼 광택 중개 플랫폼입니다.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>수도권 전지역 출장 (서울/경기/인천) 및 전국 거점 기술자 네트워크 지원</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">고객 전용 메뉴</h4>
          <ul className="space-y-2.5">
            <li>
              <button 
                onClick={() => { if (onSelectPortal) onSelectPortal('customer'); }}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>🚗 고객 포털 홈 (서비스 탐색)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setCurrentTab('technicians'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>검증된 전문가(기사) 찾기</span>
              </button>
            </li>
            <li>
              <a href="#pricing" className="hover:text-cyan-300 transition-colors">차종별 정찰 가격표</a>
            </li>
            <li>
              <a href="#booking" className="hover:text-cyan-300 transition-colors">실시간 스마트 견적 요청</a>
            </li>
          </ul>
        </div>

        {/* Portals & Admin */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">전용 독립 포털 바로가기</h4>
          <ul className="space-y-2.5">
            <li>
              <button 
                onClick={() => { if (onSelectPortal) onSelectPortal('partner'); }}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>👨‍🔧 기사 파트너 포털 (오더수주/정산)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { if (onSelectPortal) onSelectPortal('admin'); }}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>⚙️ 본사 관리자 콘솔 (총괄관제)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => { if (onSelectPortal) onSelectPortal('card'); }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>기사 모바일 디지털 명함</span>
              </button>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-1 text-slate-500">
            <p>플랫폼 고객센터: 010-8472-1928</p>
            <p>운영시간: 연중무휴 08:00 ~ 21:00</p>
            <p>100% 사전 예약 및 안심 결제 매칭</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
        <p>© 2026 LUMEN PRO MATCH. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span>디테일러 실기 검증 & 시공 품질 안심보증 지원</span>
        </p>
      </div>
    </footer>
  );
};
