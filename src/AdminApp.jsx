import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './pages/AdminDashboard';
import { BusinessCardMaker } from './pages/BusinessCardMaker';
import { AdminAuthModal } from './components/AdminAuthModal';
import { isAdminAuthenticated, setAdminAuthenticated } from './utils/storage';
import { ShieldCheck, ArrowLeft, LogOut, LayoutDashboard, Sparkles } from 'lucide-react';

export function AdminApp() {
  const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard' | 'cardMaker'
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !isAdminAuthenticated());

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      setIsAuthModalOpen(true);
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Top Admin HQ Security Bar */}
      <header className="sticky top-0 z-40 bg-[#080b14]/95 backdrop-blur-md border-b border-purple-500/20 shadow-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">LUMEN HQ MASTER</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                  본사 관제 콘솔
                </span>
              </div>
              <p className="text-[10px] text-slate-400">플랫폼 총괄 중개 관제, 기사 파트너 승인, 10%/3.3% 정산 세무 장부</p>
            </div>
          </div>

          {/* Controls */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
                title="일반 고객/기사 서비스 홈으로 이동"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>서비스 홈 가기</span>
              </a>

              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>관리자 로그아웃</span>
              </button>
            </div>
          )}

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {isAuthenticated ? (
          <>
            {currentTab === 'dashboard' && (
              <AdminDashboard
                onBackToLanding={() => { window.location.href = '/'; }}
                onOpenCardMaker={() => setCurrentTab('cardMaker')}
                onLogout={handleLogout}
              />
            )}

            {currentTab === 'cardMaker' && (
              <BusinessCardMaker onBackToAdmin={() => setCurrentTab('dashboard')} />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">보안 관리자 인증이 필요합니다</h2>
            <p className="text-xs text-slate-400 mb-5 max-w-sm">
              이 페이지는 루멘 본사 운영자 전용 페이지입니다. 승인된 암호를 입력하여 로그인하세요.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
            >
              관리자 암호 입력
            </button>
          </div>
        )}
      </main>

      {/* Admin Auth Modal Gate */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          if (!isAdminAuthenticated()) {
            window.location.href = '/';
          } else {
            setIsAuthModalOpen(false);
          }
        }}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
export default AdminApp;
