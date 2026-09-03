// 로컬 스토리지 데이터 관리 유틸리티 (중개 플랫폼 확장)
import { INITIAL_TECHNICIANS, getTechniciansByProximity } from '../data/techniciansData';

const BOOKINGS_KEY = 'lumen_polish_bookings';
const TECHNICIANS_KEY = 'lumen_polish_technicians';
const MATCH_REQUESTS_KEY = 'lumen_polish_match_requests';
const GOOGLE_WEBHOOK_KEY = 'lumen_polish_google_webhook';
const CARD_PROFILE_KEY = 'lumen_polish_card_profile';
const ADMIN_PW_KEY = 'lumen_polish_admin_pw';
const ADMIN_SESSION_KEY = 'lumen_polish_admin_session';
const DEFAULT_ADMIN_PW = '1234';

// ==================== 초기 샘플 중개 의뢰 & 매칭 데이터 ====================
const INITIAL_MATCH_REQUESTS = [
  {
    id: 'REQ-20260901-101',
    createdAt: '2026-09-01T10:30:00.000Z',
    customerName: '김민준',
    phone: '010-3849-2918',
    carModel: '제네시스 G80 (2024년형)',
    carColor: '우유니 화이트',
    serviceName: '3스텝 광택 + 9H 유리막 코팅',
    location: '서울 강남구 역삼동 741-2 지하 2층 주차장 B구역',
    travelZone: 'zone3',
    preferredDate: '2026-09-04',
    preferredTime: '10:00',
    notes: '본넷에 고양이 발톱 스크래치와 자동세차 기스가 심합니다. 220V 콘센트 가까이 있습니다.',
    hasOutlet: true,
    isIndoor: true,
    budget: 490000,
    isStandardPrice: true, // 플랫폼 제도화 표준 정찰제 적용
    status: 'MATCHED', // OPEN | BIDDING | MATCHED | IN_PROGRESS | COMPLETED | CANCELLED
    targetTechId: null,
    targetTechName: null,
    closestTechId: 'TECH-002',
    matchedTechId: 'TECH-002',
    matchedTechName: '박성호 마스터',
    matchedPrice: 490000,
    adminMemo: '고객 위치(강남) 기반 최단거리 박성호 마스터 1순위 자동 매칭 확정.',
    bids: [
      {
        bidId: 'BID-001',
        techId: 'TECH-002',
        techName: '박성호 마스터',
        techAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        techRating: 4.95,
        bidPrice: 490000,
        isClosest: true,
        distanceText: '출장 예상거리 ~4.2km (최단거리 1순위)',
        estimatedHours: '약 5시간',
        message: '고객님 댁과 가장 가까운 강남 거점 마스터입니다. 제도화된 표준 정찰가로 안전 시공해 드립니다. (전면 발수 무료 서비스)',
        createdAt: '2026-09-01T10:35:00.000Z',
        isAccepted: true
      },
      {
        bidId: 'BID-002',
        techId: 'TECH-001',
        techName: '김태진 마스터',
        techAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        techRating: 4.98,
        bidPrice: 490000,
        isClosest: false,
        distanceText: '출장 예상거리 ~18km',
        estimatedHours: '약 5.5시간',
        message: '도막 측정 기반 수성 듀얼 폴리싱 9년차 마스터입니다. 표준 정찰가로 완벽 시공을 약속드립니다.',
        createdAt: '2026-09-01T10:45:00.000Z',
        isAccepted: false
      }
    ]
  },
  {
    id: 'REQ-20260902-102',
    createdAt: '2026-09-02T14:15:00.000Z',
    customerName: '이서연',
    phone: '010-9182-4411',
    carModel: 'BMW 520d (소피스토 그레이)',
    carColor: '다크 그레이',
    serviceName: 'VIP 올인원 풀케어 패키지',
    location: '경기 성남시 분당구 정자동 파크뷰 지하 1층',
    travelZone: 'zone3',
    preferredDate: '2026-09-05',
    preferredTime: '13:00',
    notes: '실내 가죽시트 얼룩 제거 및 전체 발수코팅 부탁드립니다.',
    hasOutlet: true,
    isIndoor: true,
    budget: 750000,
    isStandardPrice: true,
    status: 'BIDDING',
    targetTechId: null,
    targetTechName: null,
    closestTechId: 'TECH-002',
    matchedTechId: 'TECH-002',
    matchedTechName: '박성호 마스터 (최단거리 자동추천)',
    matchedPrice: 750000,
    adminMemo: '최단거리 기사 자동 연결됨. 고객 직접 변경 가능.',
    bids: [
      {
        bidId: 'BID-003',
        techId: 'TECH-002',
        techName: '박성호 마스터',
        techAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        techRating: 4.95,
        bidPrice: 750000,
        isClosest: true,
        distanceText: '출장 예상거리 ~8.5km (최단거리 1순위)',
        estimatedHours: '약 6시간',
        message: '분당/판교 전담 시공팀입니다. 표준 정찰가 고정으로 완벽 복원해 드립니다.',
        createdAt: '2026-09-02T14:20:00.000Z',
        isAccepted: true
      },
      {
        bidId: 'BID-004',
        techId: 'TECH-003',
        techName: '이진우 스페셜리스트',
        techAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        techRating: 4.92,
        bidPrice: 750000,
        isClosest: false,
        distanceText: '출장 예상거리 ~14km',
        estimatedHours: '약 6시간',
        message: '150도 고온 살균 스팀 및 가죽 코팅 장비를 보유하고 있어 실내외 완벽 복원이 가능합니다.',
        createdAt: '2026-09-02T14:30:00.000Z',
        isAccepted: false
      }
    ]
  },
  {
    id: 'REQ-20260903-103',
    createdAt: '2026-09-03T09:00:00.000Z',
    customerName: '박준혁',
    phone: '010-5512-8874',
    carModel: '아반떼 N 라인',
    carColor: '사이버 그레이',
    serviceName: '본넷(후드) 집중 수성 광택 & 케어',
    location: '인천 서구 청라동 제일풍경채 지하 주차장',
    travelZone: 'zone1',
    preferredDate: '2026-09-06',
    preferredTime: '14:00',
    notes: '워터스팟과 잔기스가 심해 본넷만 집중적으로 시공받고 싶습니다.',
    hasOutlet: true,
    isIndoor: true,
    budget: 40000,
    isStandardPrice: true,
    status: 'MATCHED',
    targetTechId: null,
    targetTechName: null,
    closestTechId: 'TECH-001',
    matchedTechId: 'TECH-001',
    matchedTechName: '김태진 마스터',
    matchedPrice: 40000,
    adminMemo: '청라 거점 김태진 마스터 최단거리 자동 매칭 완료.',
    bids: [
      {
        bidId: 'BID-005',
        techId: 'TECH-001',
        techName: '김태진 마스터',
        techAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        techRating: 4.98,
        bidPrice: 40000,
        isClosest: true,
        distanceText: '출장 예상거리 ~2.1km (인천 청라 거점 최단거리)',
        estimatedHours: '약 1.5시간',
        message: '청라국제도시 전담 1급 마스터입니다. 본넷 집중 케어 표준 정찰가로 깨끗하게 복원해 드립니다.',
        createdAt: '2026-09-03T09:05:00.000Z',
        isAccepted: true
      }
    ]
  }
];

// ==================== 기술자(디테일러) 파트너 관리 ====================
export const getTechnicians = () => {
  try {
    const raw = localStorage.getItem(TECHNICIANS_KEY);
    if (!raw) {
      localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(INITIAL_TECHNICIANS));
      return INITIAL_TECHNICIANS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get technicians', e);
    return INITIAL_TECHNICIANS;
  }
};

export const saveTechnician = (techData) => {
  const current = getTechnicians();
  const newTech = {
    id: `TECH-${String(current.length + 1).padStart(3, '0')}`,
    badge: '인증 파트너',
    verified: true,
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    status: 'ACTIVE',
    acceptingOrders: true,
    portfolio: [],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    ...techData
  };
  const updated = [newTech, ...current];
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(updated));
  return newTech;
};

export const updateTechnician = (id, updates) => {
  const current = getTechnicians();
  const updated = current.map(tech => tech.id === id ? { ...tech, ...updates } : tech);
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteTechnician = (id) => {
  const current = getTechnicians();
  const updated = current.filter(tech => tech.id !== id);
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(updated));
  return updated;
};

// ==================== 고객 전용 로그인 & 자동로그인 관리 ====================
const CUSTOMER_SESSION_KEY = 'lumen_polish_cust_session';
const CUSTOMER_REMEMBER_KEY = 'lumen_polish_cust_remember';

export const getLoggedInCustomer = () => {
  try {
    // 1. Check temporary session storage first
    const sessionData = sessionStorage.getItem(CUSTOMER_SESSION_KEY);
    if (sessionData) return JSON.parse(sessionData);

    // 2. Check persistent remember-me storage
    const rememberData = localStorage.getItem(CUSTOMER_REMEMBER_KEY);
    if (rememberData) {
      const parsed = JSON.parse(rememberData);
      sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(parsed));
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const loginCustomer = (name, phone, rememberMe = false) => {
  const cleanPhone = phone.trim().replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  const customer = {
    name: name.trim() || '고객님',
    phone: cleanPhone,
    loggedInAt: new Date().toISOString()
  };

  // Always store in current session
  sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer));

  // If user selected rememberMe, store in localStorage for auto-login
  if (rememberMe) {
    localStorage.setItem(CUSTOMER_REMEMBER_KEY, JSON.stringify(customer));
  } else {
    localStorage.removeItem(CUSTOMER_REMEMBER_KEY);
  }

  return customer;
};

export const logoutCustomer = () => {
  sessionStorage.removeItem(CUSTOMER_SESSION_KEY);
  localStorage.removeItem(CUSTOMER_REMEMBER_KEY);
};

// ==================== 기사 개별 로그인 & 자동로그인 관리 ====================
const TECH_SESSION_KEY = 'lumen_polish_tech_session_id';
const TECH_REMEMBER_KEY = 'lumen_polish_tech_remember_id';

export const getLoggedInTechId = () => {
  try {
    // 1. Check session first
    const sId = sessionStorage.getItem(TECH_SESSION_KEY);
    if (sId) return sId;

    // 2. Check persistent remember-me storage
    const rId = localStorage.getItem(TECH_REMEMBER_KEY);
    if (rId) {
      sessionStorage.setItem(TECH_SESSION_KEY, rId);
      return rId;
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const getLoggedInTechnician = () => {
  const techId = getLoggedInTechId();
  if (!techId) return null;
  const allTechs = getTechnicians();
  return allTechs.find(t => t.id === techId) || null;
};

export const setLoggedInTechnician = (techId, rememberMe = false) => {
  if (!techId) {
    sessionStorage.removeItem(TECH_SESSION_KEY);
    localStorage.removeItem(TECH_REMEMBER_KEY);
  } else {
    sessionStorage.setItem(TECH_SESSION_KEY, techId);
    if (rememberMe) {
      localStorage.setItem(TECH_REMEMBER_KEY, techId);
    } else {
      localStorage.removeItem(TECH_REMEMBER_KEY);
    }
  }
};

export const loginTechnician = (phoneOrId, passwordOrPin = '', rememberMe = false) => {
  const allTechs = getTechnicians();
  const cleanInput = phoneOrId.trim().replace(/-/g, '');
  
  const tech = allTechs.find(t => {
    const cleanPhone = (t.phone || '').replace(/-/g, '');
    return t.id === phoneOrId.trim() || cleanPhone === cleanInput || t.name === phoneOrId.trim();
  });

  if (!tech) {
    return { success: false, message: '등록된 기사 파트너를 찾을 수 없습니다.' };
  }

  // Check PIN (default: '1234' or last 4 digits of phone)
  const phoneDigits = (tech.phone || '').replace(/-/g, '');
  const defaultLast4 = phoneDigits.length >= 4 ? phoneDigits.slice(-4) : '1234';
  const expectedPin = tech.pin || tech.password || '1234';

  const inputPin = passwordOrPin.trim();
  // Allow login with tech PIN, '1234', or last 4 digits of phone
  if (!inputPin || inputPin === expectedPin || inputPin === defaultLast4 || inputPin === '1234') {
    setLoggedInTechnician(tech.id, rememberMe);
    return { success: true, tech };
  }

  return { success: false, message: '비밀번호(PIN)가 일치하지 않습니다.' };
};

export const logoutTechnician = () => {
  sessionStorage.removeItem(TECH_SESSION_KEY);
  localStorage.removeItem(TECH_REMEMBER_KEY);
};

// ==================== 중개 의뢰 & 매칭 관리 ====================
export const getMatchRequests = () => {
  try {
    const raw = localStorage.getItem(MATCH_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(INITIAL_MATCH_REQUESTS));
      return INITIAL_MATCH_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get match requests', e);
    return INITIAL_MATCH_REQUESTS;
  }
};

/**
 * 신규 의뢰 생성 (표준 정찰가 및 고객 최단거리 기술자 자동 1순위 연결)
 */
export const saveMatchRequest = (requestData) => {
  const current = getMatchRequests();
  const technicians = getTechnicians();

  // 1. 고객 위치/권역 기준 가장 가까운 기술자 목록 계산
  const proximityTechs = getTechniciansByProximity(requestData.travelZone, requestData.location, technicians);
  const closestTech = proximityTechs[0] || technicians[0];
  
  // 지정 기사가 있으면 지정 기사 우선, 없으면 최단거리 기사 자동 배정
  const targetTech = requestData.targetTechId 
    ? technicians.find(t => t.id === requestData.targetTechId) 
    : closestTech;

  // 2. 제도화된 표준 정찰가 고정 (오버차지 방지)
  const standardPrice = Number(requestData.estimatedPrice || requestData.budget || 343000);

  // 3. 근접도 순위 기반 자동 후보 견적 목록 생성 (모두 동일 표준 정찰가 적용)
  const generatedBids = proximityTechs.slice(0, 3).map((tech, idx) => ({
    bidId: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
    techId: tech.id,
    techName: `${tech.name} ${tech.badge || '프로'}`,
    techAvatar: tech.avatar,
    techRating: tech.rating,
    bidPrice: standardPrice, // 제도화된 표준 정찰가 일치
    isClosest: idx === 0,
    distanceText: idx === 0 ? '고객님과 최단거리 1순위 추천' : `인접 권역 (${tech.region})`,
    estimatedHours: requestData.serviceName?.includes('VIP') ? '약 6~7시간' : (requestData.serviceName?.includes('3스텝') ? '약 5시간' : '약 2~3시간'),
    message: idx === 0 
      ? `고객님 주소지와 가장 인접한 전담 마스터입니다. 플랫폼 제도화 표준 정찰가(${standardPrice.toLocaleString()}원)로 과다 청구 없이 완벽 시공해 드립니다.` 
      : `표준 작업 공정 및 정찰 가격 준수 시공을 보증합니다.`,
    createdAt: new Date().toISOString(),
    isAccepted: tech.id === targetTech.id
  }));

  const newRequest = {
    id: `REQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    status: 'BIDDING',
    isStandardPrice: true,
    adminMemo: requestData.targetTechId 
      ? `고객 직접 지정: ${targetTech.name} 프로` 
      : `최단거리 1순위 자동 추천: ${closestTech.name} 프로 (${closestTech.region})`,
    bids: generatedBids,
    closestTechId: closestTech.id,
    matchedTechId: targetTech.id,
    matchedTechName: targetTech.name,
    matchedPrice: standardPrice,
    budget: standardPrice,
    ...requestData,
    estimatedPrice: standardPrice
  };

  const updated = [newRequest, ...current];
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  
  // 기존 bookings 데이터와도 동기화
  saveBooking({
    id: newRequest.id,
    customerName: newRequest.customerName,
    phone: newRequest.phone,
    carModel: newRequest.carModel,
    serviceName: newRequest.serviceName,
    location: newRequest.location,
    preferredDate: newRequest.preferredDate,
    preferredTime: newRequest.preferredTime,
    notes: newRequest.notes,
    estimatedPrice: standardPrice,
    status: '접수대기',
    adminMemo: `[표준정찰가] 매칭기사: ${targetTech.name}`
  });

  return newRequest;
};

// 기사가 견적 수락/확인 제출 (표준 정찰제 기반)
export const submitTechnicianBid = (requestId, bidData) => {
  const current = getMatchRequests();
  const updated = current.map(req => {
    if (req.id === requestId) {
      const existingBids = req.bids || [];
      const standardPrice = req.budget || req.estimatedPrice || 350000;
      const newBid = {
        bidId: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        isAccepted: false,
        bidPrice: standardPrice, // 플랫폼 제도화 표준 정찰가 고정
        ...bidData,
        bidPrice: standardPrice
      };
      return {
        ...req,
        status: req.status === 'OPEN' ? 'BIDDING' : req.status,
        bids: [newBid, ...existingBids]
      };
    }
    return req;
  });
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// 고객이 특정 기사를 직접 선택/변경하여 매칭 확정
export const switchMatchedTechnician = (requestId, newTechId) => {
  const current = getMatchRequests();
  const technicians = getTechnicians();
  const selectedTech = technicians.find(t => t.id === newTechId);

  const updated = current.map(req => {
    if (req.id === requestId && selectedTech) {
      const updatedBids = (req.bids || []).map(b => ({
        ...b,
        isAccepted: b.techId === newTechId
      }));

      return {
        ...req,
        status: 'MATCHED',
        matchedTechId: selectedTech.id,
        matchedTechName: selectedTech.name,
        matchedPrice: req.budget || req.estimatedPrice,
        bids: updatedBids,
        adminMemo: `고객 선택으로 [${selectedTech.name}] 기사 매칭 확정 (정찰가 ${req.budget?.toLocaleString()}원)`
      };
    }
    return req;
  });

  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// 고객 또는 관리자가 기사 견적 수락(매칭 확정)
export const acceptMatchBid = (requestId, bidId) => {
  const current = getMatchRequests();
  const updated = current.map(req => {
    if (req.id === requestId) {
      const selectedBid = req.bids.find(b => b.bidId === bidId);
      const updatedBids = req.bids.map(b => ({
        ...b,
        isAccepted: b.bidId === bidId
      }));
      return {
        ...req,
        status: 'MATCHED',
        matchedTechId: selectedBid ? selectedBid.techId : req.matchedTechId,
        matchedTechName: selectedBid ? selectedBid.techName : req.matchedTechName,
        matchedPrice: req.budget || req.estimatedPrice, // 정찰가 유지
        bids: updatedBids,
        adminMemo: `${selectedBid ? selectedBid.techName : '기사'} 매칭 확정 (${new Date().toLocaleDateString('ko-KR')})`
      };
    }
    return req;
  });
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateMatchStatus = (requestId, newStatus) => {
  const current = getMatchRequests();
  const updated = current.map(req => req.id === requestId ? { ...req, status: newStatus } : req);
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// 결제 완료 처리
export const updateMatchPayment = (requestId, receiptData) => {
  const current = getMatchRequests();
  const updated = current.map(req => {
    if (req.id === requestId) {
      return {
        ...req,
        status: 'COMPLETED',
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentReceipt: receiptData,
        settlementStatus: req.settlementStatus || 'PENDING',
        adminMemo: `${req.adminMemo || ''} [결제완료: ${Number(receiptData?.amount || req.budget).toLocaleString()}원]`.trim()
      };
    }
    return req;
  });
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// 기사 정산 완료/대기 상태 토글
export const updateMatchSettlementStatus = (requestId, isSettled) => {
  const current = getMatchRequests();
  const updated = current.map(req => {
    if (req.id === requestId) {
      return {
        ...req,
        settlementStatus: isSettled ? 'SETTLED' : 'PENDING',
        settledAt: isSettled ? new Date().toISOString() : null
      };
    }
    return req;
  });
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateMatchMemo = (requestId, memo) => {
  const current = getMatchRequests();
  const updated = current.map(req => req.id === requestId ? { ...req, adminMemo: memo } : req);
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteMatchRequest = (requestId) => {
  const current = getMatchRequests();
  const updated = current.filter(req => req.id !== requestId);
  localStorage.setItem(MATCH_REQUESTS_KEY, JSON.stringify(updated));
  return updated;
};

// ==================== 기존 예약 호환 API ====================
export const getBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      return getMatchRequests().map(m => ({
        id: m.id,
        createdAt: m.createdAt,
        customerName: m.customerName,
        phone: m.phone,
        carModel: m.carModel,
        serviceName: m.serviceName,
        location: m.location,
        preferredDate: m.preferredDate,
        preferredTime: m.preferredTime,
        notes: m.notes,
        status: m.status === 'MATCHED' ? '확정' : (m.status === 'IN_PROGRESS' ? '시공중' : (m.status === 'COMPLETED' ? '완료' : '접수대기')),
        adminMemo: m.adminMemo || (m.matchedTechName ? `매칭: ${m.matchedTechName}` : ''),
        estimatedPrice: m.matchedPrice || m.budget || 350000
      }));
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveBooking = (bookingData) => {
  const current = getBookings();
  const newBooking = {
    id: bookingData.id || `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    status: '접수대기',
    adminMemo: '',
    ...bookingData
  };
  const updated = [newBooking, ...current.filter(b => b.id !== newBooking.id)];
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return newBooking;
};

export const updateBookingStatus = (id, newStatus) => {
  const current = getBookings();
  const updated = current.map(item => item.id === id ? { ...item, status: newStatus } : item);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateBookingMemo = (id, memo) => {
  const current = getBookings();
  const updated = current.map(item => item.id === id ? { ...item, adminMemo: memo } : item);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteBooking = (id) => {
  const current = getBookings();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
  return updated;
};

export const setAllBookings = (bookings) => {
  if (!Array.isArray(bookings)) return getBookings();
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return bookings;
};

export const mergeRemoteBookings = (remoteBookings) => {
  if (!Array.isArray(remoteBookings) || remoteBookings.length === 0) {
    return getBookings();
  }
  
  const local = getBookings();
  const map = new Map();
  
  local.forEach(b => {
    if (b && b.id) map.set(b.id, b);
  });
  
  remoteBookings.forEach(rb => {
    if (rb && rb.id) {
      const existing = map.get(rb.id) || {};
      map.set(rb.id, {
        ...existing,
        ...rb,
        adminMemo: existing.adminMemo || rb.adminMemo || ''
      });
    }
  });
  
  const merged = Array.from(map.values()).sort((a, b) => {
    const timeA = new Date(a.createdAt || a.preferredDate || 0).getTime();
    const timeB = new Date(b.createdAt || b.preferredDate || 0).getTime();
    return timeB - timeA;
  });
  
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(merged));
  return merged;
};

export const getGoogleWebhookUrl = () => {
  return localStorage.getItem(GOOGLE_WEBHOOK_KEY) || '';
};

export const saveGoogleWebhookUrl = (url) => {
  localStorage.setItem(GOOGLE_WEBHOOK_KEY, url.trim());
};

// ==================== 명함 프로필 정보 ====================
export const getCardProfile = () => {
  const saved = localStorage.getItem(CARD_PROFILE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return {
    shopName: '루멘 프로 매치',
    englishName: 'LUMEN PRO MATCH & DETAILING',
    ownerName: '김태진 마스터 디테일러',
    title: '수도권 수성 듀얼 광택 & 유리막 코팅 전문가',
    phone: '010-8472-1928',
    email: 'lumenpro@gmail.com',
    location: '수도권 전지역 출장 (인천/서울/경기)',
    services: '수성듀얼광택 · 9H유리막코팅 · 실내크리닝 · 유막제거',
    instagram: '@lumen_detailing',
    bankAccount: '국민은행 123456-04-123456 (루멘)',
    qrType: 'url',
    qrCustomText: window.location.origin,
    theme: 'carbon-dark',
    accentTag: '검증된 1:1 맞춤 출장 디테일링 전문가 매칭'
  };
};

export const saveCardProfile = (profile) => {
  localStorage.setItem(CARD_PROFILE_KEY, JSON.stringify(profile));
};

// ==================== 관리자 비밀번호 & 세션 ====================
export const getAdminPassword = () => {
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_ADMIN_PW;
};

export const setAdminPassword = (newPassword) => {
  if (!newPassword || newPassword.trim().length === 0) return false;
  localStorage.setItem(ADMIN_PW_KEY, newPassword.trim());
  return true;
};

export const checkAdminPassword = (inputPassword) => {
  const currentPw = getAdminPassword();
  return inputPassword === currentPw;
};

export const isAdminAuthenticated = () => {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const setAdminAuthenticated = (isAuth) => {
  try {
    if (isAuth) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error(e);
  }
};
