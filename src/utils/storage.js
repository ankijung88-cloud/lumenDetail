// 로컬 스토리지 데이터 관리 유틸리티 (중개 플랫폼 확장)
import { INITIAL_TECHNICIANS, getTechniciansByProximity } from '../data/techniciansData';
import { DEFAULT_HUBS, generateHubZones } from '../data/hubsData';

const BOOKINGS_KEY = 'lumen_polish_bookings';
const TECHNICIANS_KEY = 'lumen_polish_technicians';
const MATCH_REQUESTS_KEY = 'lumen_polish_match_requests';
const GOOGLE_WEBHOOK_KEY = 'lumen_polish_google_webhook';
const CARD_PROFILE_KEY = 'lumen_polish_card_profile';
const ADMIN_PW_KEY = 'lumen_polish_admin_pw';
const ADMIN_SESSION_KEY = 'lumen_polish_admin_session';
const CUSTOM_HUBS_KEY = 'lumen_polish_custom_hubs';
const SELECTED_HUB_KEY = 'lumen_polish_selected_hub_id';
const DEFAULT_ADMIN_PW = '1234';

// ==================== 초기 샘플 중개 의뢰 & 매칭 데이터 ====================
const INITIAL_MATCH_REQUESTS = [];

// ==================== 기술자(디테일러) 파트너 관리 ====================
export const getTechnicians = () => {
  try {
    const raw = localStorage.getItem(TECHNICIANS_KEY);
    if (!raw) {
      if (INITIAL_TECHNICIANS && INITIAL_TECHNICIANS.length > 0) {
        localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(INITIAL_TECHNICIANS));
        return INITIAL_TECHNICIANS;
      }
      localStorage.setItem(TECHNICIANS_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // 이전 더미 데이터(TECH-001~004 및 초기 테스트 이름) 자동 정리
    const cleaned = parsed.filter(t => 
      !['TECH-001', 'TECH-002', 'TECH-003', 'TECH-004'].includes(t.id) &&
      !['김태진', '박성호', '이진우', '최원영'].includes(t.name)
    );

    // 저장된 목록이 비어있고 INITIAL_TECHNICIANS가 정의되어 있다면 기본값으로 동기화
    if (cleaned.length === 0 && INITIAL_TECHNICIANS && INITIAL_TECHNICIANS.length > 0) {
      localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(INITIAL_TECHNICIANS));
      return INITIAL_TECHNICIANS;
    }

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.error('Failed to get technicians', e);
    return INITIAL_TECHNICIANS || [];
  }
};

export const saveTechnician = (techData) => {
  const current = getTechnicians();
  const phoneDigits = (techData.phone || '').replace(/\D/g, '');
  const last4 = phoneDigits.slice(-4) || '1234';

  const newTech = {
    id: `TECH-${Date.now().toString().slice(-6)}`,
    badge: '인증 파트너',
    verified: true,
    rating: 5.0,
    reviewCount: 0,
    completedJobs: 0,
    status: 'ACTIVE',
    acceptingOrders: true,
    portfolio: [],
    avatar: techData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    coverImage: techData.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    pin: techData.pin || last4,
    experienceYears: Number(techData.experienceYears) || 1,
    minPrice: Number(techData.minPrice) || 200000,
    activeZones: Array.isArray(techData.activeZones) && techData.activeZones.length > 0 ? techData.activeZones : ['수도권 전지역'],
    specialties: Array.isArray(techData.specialties) && techData.specialties.length > 0 ? techData.specialties : ['수성 듀얼 광택', '9H 세라믹 코팅'],
    equipment: Array.isArray(techData.equipment) && techData.equipment.length > 0 ? techData.equipment : ['수성 전용 듀얼 광택기', '도막 측정기'],
    baseLocation: techData.baseLocation || techData.region || '수도권',
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

// ==================== 고객 데이터 & 자동로그인 관리 ====================
const CUSTOMERS_KEY = 'lumen_polish_customers';
const CUSTOMER_SESSION_KEY = 'lumen_polish_cust_session';
const CUSTOMER_REMEMBER_KEY = 'lumen_polish_cust_remember';

const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: '김민준',
    phone: '010-3849-2918',
    carModel: '제네시스 G80 (우유니 화이트, 2023년식)',
    defaultLocation: '인천 서구 청라국제도시 커낼로 123',
    couponsCount: 2,
    role: 'VIP'
  },
  {
    id: 'CUST-002',
    name: '이서연',
    phone: '010-9182-4411',
    carModel: 'BMW 520d (카본 블랙, 2022년식)',
    defaultLocation: '인천 송도국제도시 센트럴로 456',
    couponsCount: 1,
    role: '우수'
  },
  {
    id: 'CUST-003',
    name: '박도현',
    phone: '010-4421-9981',
    carModel: '아반떼 N (퍼포먼스 블루, 2024년식)',
    defaultLocation: '서울 강남구 역삼동 테헤란로 789',
    couponsCount: 3,
    role: 'VIP'
  }
];

export const getCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CUSTOMERS;
  }
};

export const findOrCreateCustomer = (name, phone, additionalInfo = {}) => {
  const currentList = getCustomers();
  const cleanPhone = phone.trim().replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  const digitsOnly = cleanPhone.replace(/\D/g, '');

  const existing = currentList.find(c => (c.phone || '').replace(/\D/g, '') === digitsOnly);
  if (existing) {
    const updatedCustomer = { ...existing, name: name.trim() || existing.name, ...additionalInfo };
    const updatedList = currentList.map(c => c.id === existing.id ? updatedCustomer : c);
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updatedList));
    return updatedCustomer;
  }

  const newCust = {
    id: `CUST-${Date.now().toString().slice(-4)}`,
    name: name.trim() || '고객님',
    phone: cleanPhone,
    carModel: additionalInfo.carModel || '제네시스 G80 (우유니 화이트)',
    defaultLocation: additionalInfo.defaultLocation || '인천 서구 청라동 루멘아파트',
    couponsCount: 2,
    role: '일반회원',
    createdAt: new Date().toISOString()
  };

  const updated = [newCust, ...currentList];
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
  return newCust;
};

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

export const loginCustomer = (name, phone, rememberMe = false, additionalInfo = {}) => {
  const customer = findOrCreateCustomer(name, phone, additionalInfo);

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

export const updateCustomerProfile = (updatedInfo) => {
  const current = getLoggedInCustomer();
  if (!current) return null;
  const merged = { ...current, ...updatedInfo };
  findOrCreateCustomer(merged.name, merged.phone, merged);
  sessionStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(merged));
  if (localStorage.getItem(CUSTOMER_REMEMBER_KEY)) {
    localStorage.setItem(CUSTOMER_REMEMBER_KEY, JSON.stringify(merged));
  }
  return merged;
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
  const closestTech = proximityTechs[0] || technicians[0] || null;
  
  // 지정 기사가 있으면 지정 기사 우선, 없으면 최단거리 기사 자동 배정
  const targetTech = requestData.targetTechId 
    ? (technicians.find(t => t.id === requestData.targetTechId) || closestTech)
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
    isAccepted: targetTech ? tech.id === targetTech.id : idx === 0
  }));

  const newRequest = {
    id: `REQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    status: 'BIDDING',
    isStandardPrice: true,
    adminMemo: targetTech 
      ? (requestData.targetTechId ? `고객 직접 지정: ${targetTech.name} 프로` : `최단거리 1순위 자동 추천: ${targetTech.name} 프로 (${targetTech.region || ''})`)
      : '신규 의뢰 접수 완료 (파트너 기사 배정 대기)',
    bids: generatedBids,
    closestTechId: closestTech ? closestTech.id : null,
    matchedTechId: targetTech ? targetTech.id : null,
    matchedTechName: targetTech ? `${targetTech.name} 프로` : '배정 대기중',
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
    adminMemo: targetTech ? `[표준정찰가] 매칭기사: ${targetTech.name}` : '[표준정찰가] 신규 의뢰 접수'
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

  // Sync to bookings
  try {
    const statusMap = {
      'OPEN': '접수대기',
      'BIDDING': '접수대기',
      'MATCHED': '확정',
      'IN_PROGRESS': '시공중',
      'COMPLETED': '완료'
    };
    const rawBookings = localStorage.getItem(BOOKINGS_KEY);
    if (rawBookings) {
      const parsedBookings = JSON.parse(rawBookings);
      const updatedBookings = parsedBookings.map(b => b.id === requestId ? { ...b, status: statusMap[newStatus] || b.status } : b);
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    }
  } catch (e) {
    console.warn('Booking sync failed', e);
  }

  window.dispatchEvent(new Event('storage'));
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
  const loggedInTech = getLoggedInTechnician();
  if (loggedInTech) {
    return {
      shopName: `${loggedInTech.name} 마스터 디테일러`,
      englishName: 'LUMEN PRO CERTIFIED DETAIL',
      ownerName: `${loggedInTech.name} 프로`,
      title: loggedInTech.badge || '수도권 출장 광택 & 코팅 전문가',
      phone: loggedInTech.phone || '010-0000-0000',
      email: 'lumenpro@gmail.com',
      location: loggedInTech.region ? `${loggedInTech.region} (${(loggedInTech.activeZones || []).join(', ')})` : '수도권 전지역 출장',
      services: (loggedInTech.specialties || ['수성 듀얼 광택', '9H 세라믹 코팅']).join(' · '),
      instagram: '@lumen_detailing',
      bankAccount: '국민은행 123456-04-123456 (루멘)',
      qrType: 'url',
      qrCustomText: window.location.origin,
      theme: 'carbon-dark',
      accentTag: loggedInTech.introduction || '검증된 1:1 맞춤 출장 디테일링 전문가 매칭'
    };
  }

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
    ownerName: '루멘 공인 마스터 디테일러',
    title: '수도권 수성 듀얼 광택 & 유리막 코팅 전문가 매칭',
    phone: '1588-0000',
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

// ==================== 거점 (전국 주요 도시 & 기사 등록 거점) 관리 ====================

export const getCustomHubs = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_HUBS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to get custom hubs', e);
    return [];
  }
};

export const saveCustomHub = (hubData) => {
  const current = getCustomHubs();
  const hubId = hubData.id || `hub-custom-${Date.now()}`;
  const zones = hubData.zones && hubData.zones.length === 5 
    ? hubData.zones 
    : generateHubZones(hubData.name || hubData.shortName, hubData.address, hubData.technicianName);

  const newHub = {
    id: hubId,
    name: hubData.name.trim(),
    shortName: (hubData.shortName || hubData.name).trim(),
    regionGroup: hubData.regionGroup || '기사 등록 거점',
    address: (hubData.address || hubData.name).trim(),
    technicianName: hubData.technicianName ? hubData.technicianName.trim() : '인증 파트너 프로',
    isCustom: true,
    createdAt: new Date().toISOString(),
    zones
  };

  const existingIdx = current.findIndex(h => h.id === hubId || h.name === newHub.name);
  let updated;
  if (existingIdx >= 0) {
    updated = current.map((h, i) => i === existingIdx ? { ...h, ...newHub } : h);
  } else {
    updated = [newHub, ...current];
  }

  localStorage.setItem(CUSTOM_HUBS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('travel-hubs-updated', { detail: newHub }));
  return newHub;
};

export const deleteCustomHub = (hubId) => {
  const current = getCustomHubs();
  const updated = current.filter(h => h.id !== hubId);
  localStorage.setItem(CUSTOM_HUBS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('travel-hubs-updated'));
  return updated;
};

/**
 * 기본 마스터 거점 + 기사가 등록한 커스텀 거점 + 등록된 기사들의 baseLocation을 자동 통합하여 반환
 */
export const getTravelHubs = () => {
  const defaults = DEFAULT_HUBS || [];
  const custom = getCustomHubs();
  const technicians = getTechnicians();

  // 기사들의 baseLocation 중 아직 거점으로 등록되지 않은 것들을 자동 동적 거점으로 생성
  const techGeneratedHubs = [];
  technicians.forEach(tech => {
    if (!tech.baseLocation) return;
    const base = tech.baseLocation.trim();
    if (!base) return;

    // 이미 기본 또는 커스텀 거점에 유사한 이름이 있는지 확인
    const exists = defaults.some(d => d.name.includes(base) || d.shortName.includes(base) || base.includes(d.shortName)) ||
                   custom.some(c => c.name.includes(base) || c.shortName.includes(base) || base.includes(c.shortName)) ||
                   techGeneratedHubs.some(g => g.name === base);

    if (!exists) {
      techGeneratedHubs.push({
        id: `hub-tech-${tech.id}`,
        name: `${base} (${tech.name} 프로 거점)`,
        shortName: base,
        regionGroup: '기사 등록 거점',
        address: base,
        technicianName: `${tech.name} ${tech.badge || '프로'}`,
        isTechHub: true,
        zones: generateHubZones(base, base, tech.name)
      });
    }
  });

  return [...custom, ...techGeneratedHubs, ...defaults];
};

export const getSelectedHubId = () => {
  return localStorage.getItem(SELECTED_HUB_KEY) || 'hub-incheon-cheongna';
};

export const setSelectedHubId = (hubId) => {
  localStorage.setItem(SELECTED_HUB_KEY, hubId);
  window.dispatchEvent(new CustomEvent('travel-hub-selected', { detail: hubId }));
};

