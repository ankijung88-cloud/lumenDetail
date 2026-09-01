import React, { useState, useEffect, useRef } from 'react';
import { 
  getBookings, updateBookingStatus, updateBookingMemo, deleteBooking, 
  getGoogleWebhookUrl, saveGoogleWebhookUrl 
} from '../utils/storage';
import { 
  sendToGoogleSheet, fetchFromGoogleSheet, 
  updateGoogleSheetStatus, deleteFromGoogleSheet 
} from '../utils/googleSheet';
import { GoogleSheetGuideModal } from '../components/GoogleSheetGuideModal';
import { AdminPasswordChangeModal } from '../components/AdminPasswordChangeModal';
import { 
  LayoutDashboard, Search, Filter, Download, Printer, 
  Trash2, Edit3, CheckCircle, Clock, AlertTriangle, 
  Save, Sparkles, RefreshCw, ChevronLeft, Calendar, 
  Phone, MapPin, Car, ExternalLink, HelpCircle, CreditCard,
  Lock, KeyRound, LogOut, Check, ArrowDownUp
} from 'lucide-react';

export const AdminDashboard = ({ onBackToLanding, onOpenCardMaker, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [memoText, setMemoText] = useState('');
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  // 양방향 실시간 동기화 상태
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    loadData();
    const url = getGoogleWebhookUrl();
    setWebhookUrl(url);

    // 구글 시트 URL이 있으면 즉시 실시간 동기화 실행
    if (url) {
      handleSyncGoogleSheet(false);
    }
  }, []);

  // 20초마다 주기적 자동 동기화 (새로운 시트 변경사항 실시간 감지)
  useEffect(() => {
    if (!autoSync || !webhookUrl) return;

    const interval = setInterval(() => {
      handleSyncGoogleSheet(true); // background silent sync
    }, 20000);

    return () => clearInterval(interval);
  }, [autoSync, webhookUrl]);

  const loadData = () => {
    setBookings(getBookings());
  };

  // 구글 스프레드시트와 양방향 동기화 실행
  const handleSyncGoogleSheet = async (isSilent = false) => {
    if (!isSilent) setIsSyncing(true);
    try {
      const res = await fetchFromGoogleSheet();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
        setLastSyncTime(new Date().toLocaleTimeString('ko-KR'));
        setSyncStatusMsg(`구글 시트 동기화 완료 (${res.bookings.length}건)`);
      } else {
        if (!isSilent) {
          setSyncStatusMsg(res.message || '동기화 실패');
        }
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setSyncStatusMsg('동기화 통신 오류');
    } finally {
      if (!isSilent) setIsSyncing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = updateBookingStatus(id, newStatus);
    setBookings(updated);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }

    // 구글 시트에 실시간 상태 변경 전송 (양방향 반영)
    if (webhookUrl) {
      await updateGoogleSheetStatus(id, newStatus);
    }
  };

  const handleSaveMemo = (id) => {
    const updated = updateBookingMemo(id, memoText);
    setBookings(updated);
    setEditingMemoId(null);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, adminMemo: memoText });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 이 신청 내역을 삭제하시겠습니까? (구글 스프레드시트에서도 함께 삭제됩니다)')) {
      const updated = deleteBooking(id);
      setBookings(updated);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null);
      }

      // 구글 시트에서도 실시간 행 삭제 (양방향 반영)
      if (webhookUrl) {
        await deleteFromGoogleSheet(id);
      }
    }
  };

  const handleSaveWebhook = () => {
    saveGoogleWebhookUrl(webhookUrl);
    alert('구글 스프레드시트 웹훅 URL이 저장되었습니다. 이제 양방향 동기화가 활성화됩니다.');
    handleSyncGoogleSheet(false);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      alert('먼저 구글 웹훅 URL을 입력해 주세요.');
      return;
    }
    setTestStatus('testing');
    const dummy = {
      id: `TEST-${Date.now()}`,
      customerName: '연동테스트 고객',
      phone: '010-0000-0000',
      carModelOnly: '포르쉐 911 카레라',
      carModel: '포르쉐 911 카레라 GT실버 (2024년식)',
      carColor: 'GT실버',
      carYear: '2024년식',
      serviceName: '연동 테스트 시공',
      location: '서울시 강남구 테스트로 1',
      preferredDate: '2026-09-01',
      preferredTime: '10:00',
      estimatedPrice: 500000,
      notes: '구글 시트 실시간 연동 테스트용 데이터입니다.',
      status: '접수대기'
    };

    const res = await sendToGoogleSheet(dummy);
    if (res.success) {
      setTestStatus('success');
      alert('구글 시트 테스트 데이터가 성공적으로 전송되었습니다! 구글 스프레드시트에서 14개 열로 새 행이 추가되었는지 확인해 보세요.');
    } else {
      setTestStatus('error');
      alert('구글 시트 전송 실패. 웹앱 URL 배포 권한("모든 사용자")을 다시 확인해 주세요.');
    }
  };

  // CSV 다운로드 (14개 열)
  const handleExportCSV = () => {
    const headers = [
      '접수일시', '접수번호', '고객명', '연락처', 
      '차종(모델)', '차량색상', '차량연식', 
      '시공항목', '출장주소', '희망일자', '시간', 
      '예상견적', '진행상태', '고객요청사항', '관리자메모'
    ];
    const rows = bookings.map(b => [
      `"${new Date(b.createdAt).toLocaleString('ko-KR')}"`,
      `"${b.id}"`,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      `"${b.carModelOnly || b.carModel}"`,
      `"${b.carColor || ''}"`,
      `"${b.carYear || ''}"`,
      `"${b.serviceName}"`,
      `"${b.location.replace(/"/g, '""')}"`,
      `"${b.preferredDate}"`,
      `"${b.preferredTime}"`,
      b.estimatedPrice || 0,
      `"${b.status}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${(b.adminMemo || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `루멘디테일링_신청접수내역_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 통계 계산
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === '접수대기').length;
  const confirmedCount = bookings.filter(b => b.status === '확정').length;
  const completedCount = bookings.filter(b => b.status === '완료').length;
  const totalRevenue = bookings.filter(b => b.status === '완료' || b.status === '확정')
    .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);

  // 필터링된 목록
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone?.includes(searchTerm) ||
      b.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>랜딩페이지로 돌아가기</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">출장 차량관리 예약 & 신청 관리자</h1>
                <p className="text-xs text-slate-400 mt-0.5">실시간 고객 접수 현황 모니터링 및 구글 스프레드시트 동기화</p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenCardMaker}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>출장 명함 제작기 열기</span>
            </button>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>구글 시트 연동 가이드</span>
            </button>

            <button
              onClick={() => setIsPwModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="관리자 비밀번호 변경"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>비밀번호 변경</span>
            </button>

            <button
              onClick={() => handleSyncGoogleSheet(false)}
              disabled={isSyncing}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                isSyncing 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
              }`}
              title="구글 스프레드시트 최신 데이터 실시간 불러오기"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? '동기화 중...' : '구글 시트 동기화'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>CSV 다운로드</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="관리자 세션 종료 및 잠금"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>로그아웃</span>
              </button>
            )}
          </div>
        </div>

        {/* Google Sheet Webhook Setting Card (Bidirectional Sync) */}
        <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-slate-900/60">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Google 스프레드시트 양방향 실시간 동기화</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  webhookUrl ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {webhookUrl ? '양방향 연동 활성화됨' : 'URL 미설정 (로컬 저장 모드)'}
                </span>
                {lastSyncTime && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">
                    마지막 동기화: {lastSyncTime}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                웹에서 상태 변경/삭제 시 구글 시트에 즉시 반영되며, 구글 스프레드시트에서 직접 수정한 내용도 실시간으로 웹에 동기화됩니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto shrink-0">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-xs text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveWebhook}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-all"
                >
                  저장
                </button>
                <button
                  onClick={handleTestWebhook}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-semibold text-xs shrink-0 transition-all"
                >
                  전송 테스트
                </button>
              </div>
            </div>
          </div>

          {/* Sync status & Auto-sync bar */}
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <ArrowDownUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>{syncStatusMsg || (webhookUrl ? '양방향 동기화 대기 중' : '구글 시트 연동 후 양방향 동기화가 지원됩니다')}</span>
            </div>
            
            {webhookUrl && (
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={autoSync} 
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-cyan-500 cursor-pointer"
                  />
                  <span>20초 주기 자동 감지</span>
                </label>

                <button
                  onClick={() => handleSyncGoogleSheet(false)}
                  disabled={isSyncing}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>지금 새로고침</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium">총 접수 건수</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{totalCount}건</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <span className="text-xs text-amber-300 font-medium">신규 접수대기</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-mono">{pendingCount}건</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
            <span className="text-xs text-cyan-300 font-medium">예약 확정</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 font-mono">{confirmedCount}건</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <span className="text-xs text-emerald-300 font-medium">시공 완료</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{completedCount}건</p>
          </div>

          <div className="col-span-2 lg:col-span-1 glass-card p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-slate-400 font-medium">확정 예상 매출</span>
            <p className="text-xl sm:text-2xl font-extrabold text-cyan-400 mt-1 font-mono truncate">
              {(totalRevenue / 10000).toLocaleString()}만원
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10 w-full sm:w-auto overflow-x-auto">
            {['ALL', '접수대기', '확정', '시공중', '완료', '취소'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL' ? '전체보기' : st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="고객명, 연락처, 차종 검색"
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

        </div>

        {/* Bookings Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4 font-bold">접수번호 / 일시</th>
                  <th className="py-3.5 px-4 font-bold">고객명 / 연락처</th>
                  <th className="py-3.5 px-4 font-bold">차종 / 시공항목</th>
                  <th className="py-3.5 px-4 font-bold">출장지 주소</th>
                  <th className="py-3.5 px-4 font-bold">희망 일정</th>
                  <th className="py-3.5 px-4 font-bold">상태 관리</th>
                  <th className="py-3.5 px-4 font-bold text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      신청 접수 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const statusColors = {
                      '접수대기': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      '확정': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
                      '시공중': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                      '완료': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      '취소': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
                    };

                    return (
                      <tr 
                        key={b.id} 
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <td className="py-4 px-4 font-mono">
                          <span className="font-bold text-cyan-300">{b.id}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {new Date(b.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-white text-sm">{b.customerName}</span>
                          <span className="block text-slate-400 font-mono mt-0.5">{b.phone}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-200">{b.carModel}</span>
                          <span className="block text-cyan-400 text-[11px] truncate max-w-[200px]">{b.serviceName}</span>
                        </td>

                        <td className="py-4 px-4 max-w-[220px]">
                          <span className="truncate block text-slate-300">{b.location}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-white">{b.preferredDate}</span>
                          <span className="block text-[11px] text-slate-400 font-mono">{b.preferredTime}</span>
                        </td>

                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              statusColors[b.status] || 'bg-slate-800 text-slate-300'
                            } bg-slate-900 focus:outline-none`}
                          >
                            <option value="접수대기">접수대기</option>
                            <option value="확정">확정</option>
                            <option value="시공중">시공중</option>
                            <option value="완료">완료</option>
                            <option value="취소">취소</option>
                          </select>
                        </td>

                        <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="glass-card bg-[#0e1422] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-cyan-400 font-mono font-bold">{selectedBooking.id}</span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">
                    {selectedBooking.customerName} 고객님 상세 접수 내역
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
                >
                  닫기
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <span className="text-slate-400 block mb-1">연락처</span>
                  <a href={`tel:${selectedBooking.phone}`} className="text-cyan-300 font-bold font-mono text-sm hover:underline">
                    {selectedBooking.phone}
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <span className="text-slate-400 block mb-1">차종 및 연식</span>
                  <span className="text-white font-bold text-sm">{selectedBooking.carModel}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 col-span-2">
                  <span className="text-slate-400 block mb-1">신청 시공 항목</span>
                  <span className="text-cyan-300 font-bold">{selectedBooking.serviceName}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 col-span-2">
                  <span className="text-slate-400 block mb-1">출장 희망 장소</span>
                  <span className="text-white">{selectedBooking.location}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <span className="text-slate-400 block mb-1">희망 시공 일시</span>
                  <span className="text-white font-bold">{selectedBooking.preferredDate} ({selectedBooking.preferredTime})</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5">
                  <span className="text-slate-400 block mb-1">예상 시공 견적</span>
                  <span className="text-cyan-300 font-bold font-mono text-sm">
                    {(selectedBooking.estimatedPrice || 0).toLocaleString()}원
                  </span>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 col-span-2">
                    <span className="text-slate-400 block mb-1">고객 요청사항</span>
                    <p className="text-slate-300 leading-relaxed">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              {/* Admin Memo Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>관리자 메모 (방문 전 준비사항, 특이사항, 콘센트 위치 등)</span>
                </label>
                <textarea
                  defaultValue={selectedBooking.adminMemo}
                  id="modal-memo-input"
                  rows="2"
                  placeholder="예: 220V 콘센트 지하 2층 기둥에 있음. 10시 정시 방문."
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const input = document.getElementById('modal-memo-input');
                      if (input) {
                        handleSaveMemo(selectedBooking.id);
                        alert('메모가 저장되었습니다.');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>메모 저장</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>작업 지시서 인쇄</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                >
                  확인 완료
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Guide Modal */}
        <GoogleSheetGuideModal
          isOpen={isGuideOpen}
          onClose={() => setIsGuideOpen(false)}
        />

        {/* Admin Password Change Modal */}
        <AdminPasswordChangeModal
          isOpen={isPwModalOpen}
          onClose={() => setIsPwModalOpen(false)}
        />

      </div>
    </div>
  );
};
