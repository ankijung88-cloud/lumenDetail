import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../utils/googleSheet';
import { X, Copy, Check, ExternalLink, HelpCircle, Sparkles } from 'lucide-react';

export const GoogleSheetGuideModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card bg-[#0e1422] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">구글 스프레드시트 양방향 실시간 동기화 가이드</h3>
              <p className="text-xs text-slate-400">웹과 구글 시트 양방향에서 데이터 등록/상태 변경/삭제가 실시간으로 상호 반영됩니다.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Step list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">연동 5단계 순서</h4>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-semibold text-white">구글 스프레드시트 열기</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  구글 계정으로 새 구글 스프레드시트 문서를 생성합니다. (제목 예: 출장차량관리 신청접수부)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-semibold text-white">Apps Script 메뉴 실행</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  상단 메뉴에서 <strong className="text-cyan-300">[확장 프로그램] ➜ [Apps Script]</strong>를 클릭합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-semibold text-white">아래 스크립트 코드 복사 & 붙여넣기</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Apps Script 에디터에 기본으로 적혀있는 내용을 모두 지우고, 아래의 코드를 복사해서 붙여넣은 뒤 저장(Ctrl+S)합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">4</span>
              <div>
                <p className="font-semibold text-white">웹 앱으로 배포 (중요 설정)</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  우측 상단 <strong>[배포] ➜ [새 배포]</strong> 클릭 ➜ 톱니바퀴에서 <strong>[웹 앱]</strong> 선택 <br />
                  - 다음 사용자로 실행: <strong>나(내 계정)</strong><br />
                  - 액세스 권한: <strong className="text-amber-300">모든 사용자(Anyone)</strong> 선택 ➜ [배포] 클릭
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">5</span>
              <div>
                <p className="font-semibold text-white">웹 앱 URL 등록</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  생성된 <strong>웹 앱 URL(https://script.google.com/...)</strong>을 복사하여 관리자 대시보드의 '구글 웹훅 URL' 입력칸에 저장하면 끝납니다!
                </p>
              </div>
            </div>

          </div>

          {/* Script Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">Google Apps Script 자동 연동 코드</span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사 완료!' : '전체 코드 복사'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-cyan-300 font-mono overflow-x-auto max-h-56">
              {GOOGLE_APPS_SCRIPT_TEMPLATE}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
