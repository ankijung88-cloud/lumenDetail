import React from 'react';
import { Sparkles, Phone, MessageSquare, ShieldCheck, MapPin, CreditCard, LayoutDashboard } from 'lucide-react';

export const Footer = ({ setCurrentTab }) => {
  return (
    <footer className="border-t border-white/10 bg-[#05070a] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-xl text-white tracking-wider">LUMEN DETAIL</span>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
            루멘 디테일링은 고객님이 계신 자택 및 직장 주차장으로 직접 방문하여 수성 듀얼 광택, 
            9H 세라믹 유리막 코팅, 실내 고온스팀 크리닝을 1:1로 시공해 드리는 맞춤 출장 차량관리 서비스입니다.
          </p>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>수도권 전지역 출장 (서울 전역, 경기, 인천) / 지방 출장 사전 협의 가능</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">서비스 바로가기</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="#services" className="hover:text-cyan-300 transition-colors">수성 듀얼 광택 시공</a>
            </li>
            <li>
              <a href="#process" className="hover:text-cyan-300 transition-colors">6단계 표준 시공 공정</a>
            </li>
            <li>
              <a href="#before-after" className="hover:text-cyan-300 transition-colors">시공 전후 갤러리</a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-cyan-300 transition-colors">차종별 정찰 가격표</a>
            </li>
            <li>
              <a href="#booking" className="hover:text-cyan-300 transition-colors">출장 견적 신청</a>
            </li>
          </ul>
        </div>

        {/* Admin & Tools */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4">사업자 & 관리 도구</h4>
          <ul className="space-y-2.5">
            <li>
              <button 
                onClick={() => { setCurrentTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>관리자 대시보드 (명함/예약관리)</span>
              </button>
            </li>
          </ul>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-1 text-slate-500">
            <p>상담문의: 010-1234-5678</p>
            <p>운영시간: 연중무휴 08:00 ~ 21:00</p>
            <p>100% 사전 예약제 운영</p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
        <p>© 2026 LUMEN DETAILING SERVICE. All rights reserved.</p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span>개인정보보호 및 1년 시공 안심보증 지원</span>
        </p>
      </div>
    </footer>
  );
};
