import React, { useState, useEffect } from 'react';
import { 
  getMatchRequests, updateMatchStatus, updateMatchMemo, deleteMatchRequest,
  getTechnicians, updateTechnician, deleteTechnician, saveTechnician,
  getGoogleWebhookUrl, saveGoogleWebhookUrl, updateMatchSettlementStatus 
} from '../utils/storage';
import { 
  fetchFromGoogleSheet, updateGoogleSheetStatus, deleteFromGoogleSheet 
} from '../utils/googleSheet';
import { calculateSettlement } from '../utils/settlement';
import { GoogleSheetGuideModal } from '../components/GoogleSheetGuideModal';
import { AdminPasswordChangeModal } from '../components/AdminPasswordChangeModal';
import { SettlementModal } from '../components/SettlementModal';
import { 
  Search, Download, Trash2, CheckCircle, RefreshCw,
  MapPin, Car, CreditCard, KeyRound, LogOut, Users, 
  Briefcase, TrendingUp, DollarSign, Plus, X, Sparkles,
  FileText, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';

export const AdminDashboard = ({ onBackToLanding: _onBackToLanding, onOpenCardMaker, onLogout }) => {
  const [adminTab, setAdminTab] = useState('orders'); // 'orders' | 'technicians' | 'analytics' | 'settings'
  
  // Orders State
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReq, setSelectedReq] = useState(null);
  const [memoText, setMemoText] = useState('');
  const [settlementModalReq, setSettlementModalReq] = useState(null);

  // Technicians State
  const [technicians, setTechnicians] = useState([]);
  const [techSearch, setTechSearch] = useState('');
  const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);
  const [newTechForm, setNewTechForm] = useState({
    name: '',
    phone: '',
    region: '인천/서부권',
    experienceYears: 5,
    specialties: '수성 듀얼 광택, 9H 세라믹 코팅',
    introduction: '',
    minPrice: 200000
  });

  // Settings & Sync State
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    loadData();
    const url = getGoogleWebhookUrl();
    setWebhookUrl(url);

    if (url) {
      handleSyncGoogleSheet(true);
    }
  }, []);

  // 20-second background sync
  useEffect(() => {
    if (!autoSync || !webhookUrl) return;
    const interval = setInterval(() => {
      handleSyncGoogleSheet(true);
    }, 20000);
    return () => clearInterval(interval);
  }, [autoSync, webhookUrl]);

  const loadData = () => {
    setRequests(getMatchRequests());
    setTechnicians(getTechnicians());
  };

  const handleSyncGoogleSheet = async (isSilent = false) => {
    if (!isSilent) setIsSyncing(true);
    try {
      const res = await fetchFromGoogleSheet();
      if (res.success && res.bookings) {
        setRequests(getMatchRequests());
        setLastSyncTime(new Date().toLocaleTimeString('ko-KR'));
        setSyncStatusMsg(`구글 시트 동기화 완료 (${res.bookings.length}건)`);
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) setSyncStatusMsg('동기화 통신 오류');
    } finally {
      if (!isSilent) setIsSyncing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = updateMatchStatus(id, newStatus);
    setRequests(updated);
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, status: newStatus });
    }
    if (webhookUrl) {
      await updateGoogleSheetStatus(id, newStatus);
    }
  };

  const handleSaveMemo = (id) => {
    const updated = updateMatchMemo(id, memoText);
    setRequests(updated);
    setEditingMemoId(null);
  };

  const handleDeleteRequest = async (id) => {
    if (window.confirm('이 의뢰 내역을 완전히 삭제하시겠습니까?')) {
      const updated = deleteMatchRequest(id);
      setRequests(updated);
      if (selectedReq?.id === id) setSelectedReq(null);
      if (webhookUrl) {
        await deleteFromGoogleSheet(id);
      }
    }
  };

  const handleTechStatusToggle = (techId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const updated = updateTechnician(techId, { status: newStatus });
    setTechnicians(updated);
  };

  const handleDeleteTech = (techId) => {
    if (window.confirm('이 파트너 기사를 목록에서 삭제하시겠습니까?')) {
      const updated = deleteTechnician(techId);
      setTechnicians(updated);
    }
  };

  const handleAddTechSubmit = (e) => {
    e.preventDefault();
    if (!newTechForm.name || !newTechForm.phone) return;
    saveTechnician({
      name: newTechForm.name,
      phone: newTechForm.phone,
      region: newTechForm.region,
      experienceYears: Number(newTechForm.experienceYears) || 3,
      specialties: newTechForm.specialties.split(',').map(s => s.trim()),
      introduction: newTechForm.introduction || '검증된 1급 디테일러 프로',
      minPrice: Number(newTechForm.minPrice) || 200000,
      activeZones: [newTechForm.region]
    });
    setTechnicians(getTechnicians());
    setIsAddTechModalOpen(false);
    setNewTechForm({
      name: '',
      phone: '',
      region: '인천/서부권',
      experienceYears: 5,
      specialties: '수성 듀얼 광택, 9H 세라믹 코팅',
      introduction: '',
      minPrice: 200000
    });
    alert('새로운 파트너 기사가 등록되었습니다.');
  };

  const handleSaveWebhook = () => {
    saveGoogleWebhookUrl(webhookUrl);
    alert('구글 웹훅 URL이 저장되었습니다.');
  };

  const handleExportCSV = () => {
    if (requests.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const headers = ['의뢰번호', '접수일시', '고객명', '연락처', '차종', '시공항목', '출장지', '희망일', '희망시간', '예상금액', '매칭기사', '상태', '관리자메모'];
    const rows = requests.map(r => [
      r.id,
      r.createdAt ? new Date(r.createdAt).toLocaleString('ko-KR') : '',
      r.customerName,
      r.phone,
      `"${r.carModel}"`,
      `"${r.serviceName}"`,
      `"${r.location}"`,
      r.preferredDate,
      r.preferredTime,
      r.matchedPrice || r.budget || 0,
      r.matchedTechName || '',
      r.status,
      `"${(r.adminMemo || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `루멘프로_중개의뢰목록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    const matchStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchSearch = searchTerm === '' ||
      req.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.phone?.includes(searchTerm) ||
      req.carModel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.matchedTechName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Analytics Computations
  const totalGMV = requests.reduce((acc, curr) => acc + (Number(curr.matchedPrice) || Number(curr.budget) || 0), 0);
  const platformFee = Math.round(totalGMV * 0.1); // 10% brokerage commission
  const completedCount = requests.filter(r => r.status === 'COMPLETED' || r.status === 'MATCHED').length;
  const matchRate = requests.length > 0 ? Math.round((completedCount / requests.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              PRO MATCH CONSOLE
            </span>
            <span className="text-xs text-slate-400">루멘 중개 플랫폼 통합 관리자</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            중개 오더 & 파트너 관리 콘솔
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPwModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>비밀번호 변경</span>
          </button>

          <button
            onClick={onOpenCardMaker}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span>기사 명함 관리</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Main Admin Tabs */}
      <div className="flex items-center gap-2 mt-6 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'orders'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>오더 & 매칭 관리 ({requests.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('technicians')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'technicians'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>기술자 파트너 관리 ({technicians.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'analytics'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>정산 & 매출 통계</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            adminTab === 'settings'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>구글시트 연동 & 설정</span>
        </button>
      </div>

      {/* ==================== TAB 1: ORDERS & MATCHING ==================== */}
      {adminTab === 'orders' && (
        <div className="mt-6 space-y-6">
          
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="의뢰번호, 고객명, 차종, 기사명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">모든 상태 전체</option>
                <option value="OPEN">접수 대기 (OPEN)</option>
                <option value="BIDDING">견적 제안중 (BIDDING)</option>
                <option value="MATCHED">매칭 확정 (MATCHED)</option>
                <option value="IN_PROGRESS">시공중 (IN_PROGRESS)</option>
                <option value="COMPLETED">시공 완료 (COMPLETED)</option>
                <option value="CANCELLED">취소됨 (CANCELLED)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CSV 다운로드</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">의뢰정보</th>
                    <th className="py-3.5 px-4">고객 / 연락처</th>
                    <th className="py-3.5 px-4">차종 / 시공항목</th>
                    <th className="py-3.5 px-4">출장지 / 희망일</th>
                    <th className="py-3.5 px-4">금액 / 매칭기사</th>
                    <th className="py-3.5 px-4">매칭상태</th>
                    <th className="py-3.5 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRequests.map(req => (
                    <tr 
                      key={req.id}
                      onClick={() => setSelectedReq(req)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        selectedReq?.id === req.id ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {req.id}
                        {req.targetTechName && (
                          <span className="block text-[10px] text-amber-300 font-normal">
                            지정: {req.targetTechName}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-white">{req.customerName}</div>
                        <div className="text-slate-400">{req.phone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white truncate max-w-[180px]">{req.carModel}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{req.serviceName}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="truncate max-w-[160px]">{req.location}</div>
                        <div className="text-slate-400 text-[11px]">{req.preferredDate} ({req.preferredTime})</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-emerald-400">
                          {(req.matchedPrice || req.budget || 0).toLocaleString()}원
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {req.matchedTechName ? `배정: ${req.matchedTechName}` : `제안 ${req.bids?.length || 0}건`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={req.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            req.status === 'MATCHED'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : (req.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : (req.status === 'BIDDING'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : 'bg-slate-800 text-slate-300 border-white/10'))
                          }`}
                        >
                          <option value="OPEN">접수대기</option>
                          <option value="BIDDING">제안비교중</option>
                          <option value="MATCHED">매칭확정</option>
                          <option value="IN_PROGRESS">시공중</option>
                          <option value="COMPLETED">시공완료</option>
                          <option value="CANCELLED">취소됨</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(req.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="py-12 text-center text-slate-500">
                조회된 의뢰 내역이 없습니다.
              </div>
            )}
          </div>

          {/* Selected Order Detail Panel */}
          {selectedReq && (
            <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 animate-fadeIn space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    {selectedReq.id}
                  </span>
                  <h3 className="font-extrabold text-white text-base">
                    {selectedReq.carModel} - {selectedReq.customerName} 고객님 의뢰 상세
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReq(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="space-y-1 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <p className="text-slate-400 font-bold">고객 연락처 & 위치</p>
                  <p>• 연락처: <strong className="text-white">{selectedReq.phone}</strong></p>
                  <p>• 출장지: {selectedReq.location}</p>
                  <p>• 권역: {selectedReq.travelZone}</p>
                </div>

                <div className="space-y-1 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <p className="text-slate-400 font-bold">일정 & 현장 환경</p>
                  <p>• 희망일시: <strong className="text-cyan-300">{selectedReq.preferredDate} ({selectedReq.preferredTime})</strong></p>
                  <p>• 220V 콘센트: {selectedReq.hasOutlet ? '사용 가능' : '협의 필요'}</p>
                  <p>• 주차 형태: {selectedReq.isIndoor ? '지하/실내' : '야외'}</p>
                </div>

                <div className="space-y-1 bg-slate-900/50 p-3 rounded-xl border border-white/5">
                  <p className="text-slate-400 font-bold">금액 & 매칭 정보</p>
                  <p>• 확정/희망가: <strong className="text-emerald-400">{(selectedReq.matchedPrice || selectedReq.budget || 0).toLocaleString()}원</strong></p>
                  <p>• 매칭 기사: <strong className="text-white">{selectedReq.matchedTechName || '미배정'}</strong></p>
                  <p>• 제안된 입찰: {selectedReq.bids?.length || 0}건</p>
                </div>
              </div>

              {/* Memo Editor */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  관리자 전용 진행 메모
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={selectedReq.adminMemo || ''}
                    onChange={(e) => setMemoText(e.target.value)}
                    placeholder="기사 배정 내역, 고객 유선상담 특이사항 입력..."
                    className="flex-grow px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handleSaveMemo(selectedReq.id)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
                  >
                    메모 저장
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 2: TECHNICIAN PARTNERS ==================== */}
      {adminTab === 'technicians' && (
        <div className="mt-6 space-y-6">
          
          <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="기사명, 활동지역 검색..."
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={() => setIsAddTechModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>신규 기사 파트너 직접 등록</span>
            </button>
          </div>

          {/* Technicians Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians
              .filter(t => techSearch === '' || t.name.includes(techSearch) || t.region.includes(techSearch))
              .map(tech => (
                <div key={tech.id} className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={tech.avatar} 
                          alt={tech.name} 
                          className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-white text-base">{tech.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                              {tech.badge || '인증 파트너'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{tech.phone} | 경력 {tech.experienceYears}년</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTechStatusToggle(tech.id, tech.status)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-all ${
                          tech.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {tech.status === 'ACTIVE' ? '활성 (수주가능)' : '비활성 (휴식)'}
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-slate-300 space-y-1 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                      <p><strong className="text-slate-400">활동 권역:</strong> {tech.region} ({tech.activeZones?.join(', ')})</p>
                      <p><strong className="text-slate-400">전문 분야:</strong> {tech.specialties?.join(', ')}</p>
                      <p className="line-clamp-2 text-slate-400 mt-1 italic">"{tech.introduction}"</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>평점: <strong className="text-amber-400">★ {tech.rating || 5.0}</strong> ({tech.reviewCount || 0}건)</span>
                      <span>누적 시공: <strong className="text-cyan-400">{tech.completedJobs || 0}건</strong></span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDeleteTech(tech.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

        </div>
      )}

      {/* ==================== TAB 3: REVENUE & ANALYTICS ==================== */}
      {adminTab === 'analytics' && (
        <div className="mt-6 space-y-6">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Total GMV */}
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>총 시공 매출액 (GMV 100%)</span>
                <DollarSign className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white mt-2">
                {totalGMV.toLocaleString()}원
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">누적 매칭 의뢰 {requests.length}건 기준</span>
            </div>

            {/* 2. Platform 10% Revenue */}
            <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
                <span>플랫폼 중개 수수료 수익 (10%)</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 mt-2">
                {platformFee.toLocaleString()}원
              </p>
              <span className="text-[11px] text-cyan-300/70 mt-1 block">플랫폼 순 중개매출</span>
            </div>

            {/* 3. Withholding Tax (3.3%) */}
            <div className="glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20">
              <div className="flex items-center justify-between text-rose-300 text-xs font-bold">
                <span>원천징수 예수금 합계 (3.3%)</span>
                <ShieldCheck className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-2">
                {Math.round(totalGMV * 0.9 * 0.033).toLocaleString()}원
              </p>
              <span className="text-[11px] text-rose-300/70 mt-1 block">국세청 원천징수 신고 대상</span>
            </div>

            {/* 4. Tech Net Payout */}
            <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center justify-between text-emerald-300 text-xs font-bold">
                <span>기사 최종 실지급액 (87.03%)</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
                {(totalGMV - platformFee - Math.round(totalGMV * 0.9 * 0.033)).toLocaleString()}원
              </p>
              <span className="text-[11px] text-emerald-300/70 mt-1 block">기사 정산 지급 대상 총액</span>
            </div>

          </div>

          {/* Detailed Settlement Ledger Table */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
              <div>
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>건별 기사 정산 지급 명세 및 세무 장부</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  매출액의 10% 플랫폼 수수료 공제 및 3.3% 사업소득세 원천징수 후 실입금액을 관리합니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">정산 대상: <strong className="text-emerald-400">{requests.length}건</strong></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-bold border-b border-white/10 text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">의뢰번호 / 시공일</th>
                    <th className="py-3.5 px-4">차종 / 시공항목</th>
                    <th className="py-3.5 px-4">담당 기술자</th>
                    <th className="py-3.5 px-4 text-right">총 결제매출</th>
                    <th className="py-3.5 px-4 text-right text-cyan-400">수수료(10%)</th>
                    <th className="py-3.5 px-4 text-right text-rose-400">원천세(3.3%)</th>
                    <th className="py-3.5 px-4 text-right text-emerald-400">기사 실지급액</th>
                    <th className="py-3.5 px-4 text-center">정산상태</th>
                    <th className="py-3.5 px-4 text-center">명세서 / 관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map(req => {
                    const price = Number(req.matchedPrice || req.budget || req.estimatedPrice || 350000);
                    const st = calculateSettlement(price);
                    const isSettled = req.settlementStatus === 'SETTLED';

                    return (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-200 whitespace-nowrap">
                          {req.id}
                          <span className="block text-[10px] text-slate-500 font-normal">
                            {req.preferredDate} ({req.preferredTime})
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white truncate max-w-[150px]">{req.carModel}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{req.serviceName}</div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">{req.matchedTechName || '최단거리 배정'}</div>
                          <div className="text-[10px] text-slate-500">{req.customerName} 고객님</div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-white whitespace-nowrap">
                          {st.gmv.toLocaleString()}원
                        </td>

                        <td className="py-3.5 px-4 text-right font-semibold text-cyan-400 whitespace-nowrap">
                          -{st.platformFee.toLocaleString()}원
                        </td>

                        <td className="py-3.5 px-4 text-right font-semibold text-rose-400 whitespace-nowrap">
                          -{st.withholdingTax.toLocaleString()}원
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-emerald-400 whitespace-nowrap text-sm">
                          {st.techNetPayout.toLocaleString()}원
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                            isSettled
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            {isSettled ? '정산 완료' : '정산 대기'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSettlementModalReq(req)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 transition-colors"
                            >
                              명세서
                            </button>
                            <button
                              onClick={() => {
                                const updated = updateMatchSettlementStatus(req.id, !isSettled);
                                setRequests(updated);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                                isSettled 
                                  ? 'bg-slate-800 text-slate-400 hover:text-white' 
                                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                              }`}
                            >
                              {isSettled ? '대기로 변경' : '입금 완료'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional & Package Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h3 className="font-extrabold text-white text-sm mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                권역별 오더 점유율
              </h3>
              <div className="space-y-3 text-xs">
                {['zone1 (인천/서구/부평/김포)', 'zone2 (송도/서울서부/일산)', 'zone3 (서울전역/분당/수원)', 'zone4 (기타 장거리)'].map((z, i) => {
                  const key = `zone${i+1}`;
                  const count = requests.filter(r => r.travelZone === key).length;
                  const pct = requests.length > 0 ? Math.round((count / requests.length) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>{z}</span>
                        <strong className="text-white">{count}건 ({pct}%)</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h3 className="font-extrabold text-white text-sm mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                인기 시공 항목 분포
              </h3>
              <div className="space-y-3 text-xs">
                {[
                  '3스텝 광택 + 9H 유리막 코팅',
                  'VIP 올인원 풀케어 패키지',
                  '베이직 수성 광택',
                  '본넷(후드) 집중 수성 광택'
                ].map((svc) => {
                  const count = requests.filter(r => r.serviceName?.includes(svc.slice(0, 5))).length;
                  const pct = requests.length > 0 ? Math.round((count / requests.length) * 100) : 0;
                  return (
                    <div key={svc}>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>{svc}</span>
                        <strong className="text-white">{count}건 ({pct}% )</strong>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 4: SETTINGS & GOOGLE SHEETS ==================== */}
      {adminTab === 'settings' && (
        <div className="mt-6 space-y-6 max-w-3xl">
          
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                구글 스프레드시트 양방향 연동 웹훅 설정
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Google Apps Script 배포 URL을 입력하면 웹사이트와 구글 시트 간 양방향 실시간 동기화가 활성화됩니다.
              </p>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveWebhook}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  웹훅 URL 저장
                </button>

                <button
                  onClick={() => handleSyncGoogleSheet(false)}
                  disabled={isSyncing || !webhookUrl}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? '동기화 중...' : '지금 즉시 동기화'}</span>
                </button>

                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-3 py-2.5 text-xs text-cyan-400 hover:underline"
                >
                  연동 가이드 보기
                </button>
              </div>

              {syncStatusMsg && (
                <p className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
                  ✓ {syncStatusMsg} {lastSyncTime && `(최근 동기화: ${lastSyncTime})`}
                </p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Add Tech Modal */}
      {isAddTechModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0d121f] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setIsAddTechModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">신규 파트너 기사 직접 등록</h3>
            <form onSubmit={handleAddTechSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">기사 성함</label>
                <input
                  type="text"
                  value={newTechForm.name}
                  onChange={(e) => setNewTechForm({ ...newTechForm, name: e.target.value })}
                  placeholder="예: 최동훈 마스터"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">연락처</label>
                <input
                  type="tel"
                  value={newTechForm.phone}
                  onChange={(e) => setNewTechForm({ ...newTechForm, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">활동 권역</label>
                <select
                  value={newTechForm.region}
                  onChange={(e) => setNewTechForm({ ...newTechForm, region: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="인천/서부권">인천/서부권</option>
                  <option value="서울/강남권">서울/강남권</option>
                  <option value="경기/남부권">경기/남부권</option>
                  <option value="경기/북부권">경기/북부권</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">경력 (년차)</label>
                <input
                  type="number"
                  value={newTechForm.experienceYears}
                  onChange={(e) => setNewTechForm({ ...newTechForm, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">전문 시공 분야 (쉼표 구분)</label>
                <input
                  type="text"
                  value={newTechForm.specialties}
                  onChange={(e) => setNewTechForm({ ...newTechForm, specialties: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTechModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guide & Password Modals */}
      <GoogleSheetGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <AdminPasswordChangeModal
        isOpen={isPwModalOpen}
        onClose={() => setIsPwModalOpen(false)}
      />

      {/* Technician Settlement Statement Modal */}
      <SettlementModal
        isOpen={Boolean(settlementModalReq)}
        onClose={() => setSettlementModalReq(null)}
        request={settlementModalReq}
        onToggleSettled={(reqId, isSettled) => {
          const updated = updateMatchSettlementStatus(reqId, isSettled);
          setRequests(updated);
          setSettlementModalReq(null);
        }}
      />

    </div>
  );
};
