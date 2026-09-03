import React from 'react';
import { Car, Briefcase, LayoutDashboard } from 'lucide-react';

export const PortalSwitcher = ({ currentPortal, onSelectPortal }) => {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-slate-900/90 border border-white/10 rounded-2xl shadow-inner text-xs font-bold backdrop-blur-md">
      {/* 1. Customer Portal */}
      <button
        onClick={() => onSelectPortal('customer')}
        className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
          currentPortal === 'customer'
            ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/25'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Car className="w-3.5 h-3.5" />
        <span>고객용</span>
      </button>

      {/* 2. Partner Portal */}
      <button
        onClick={() => onSelectPortal('partner')}
        className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
          currentPortal === 'partner'
            ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <Briefcase className="w-3.5 h-3.5" />
        <span>기사용</span>
      </button>

      {/* 3. Admin Portal */}
      <button
        onClick={() => onSelectPortal('admin')}
        className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
          currentPortal === 'admin'
            ? 'bg-purple-500 text-slate-950 font-black shadow-md shadow-purple-500/25'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        <span>관리자</span>
      </button>
    </div>
  );
};
