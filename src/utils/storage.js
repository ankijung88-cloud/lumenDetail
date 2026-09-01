// 로컬 스토리지 데이터 관리 유틸리티

const BOOKINGS_KEY = 'lumen_polish_bookings';
const GOOGLE_WEBHOOK_KEY = 'lumen_polish_google_webhook';
const CARD_PROFILE_KEY = 'lumen_polish_card_profile';

// 초기 샘플 데이터
const INITIAL_BOOKINGS = [
  {
    id: 'BK-20260831-001',
    createdAt: '2026-08-31T09:30:00.000Z',
    customerName: '김민준',
    phone: '010-3849-2918',
    carModel: '제네시스 G80 (2024년형)',
    serviceName: '3스텝 광택 + 9H 유리막 코팅',
    location: '서울 강남구 역삼동 741-2 지하 2층 주차장 B구역',
    preferredDate: '2026-09-03',
    preferredTime: '10:00',
    notes: '본넷에 고양이 발톱 스크래치와 자동세차 기스가 심합니다.',
    status: '확정', // 접수대기 | 확정 | 시공중 | 완료 | 취소
    adminMemo: '9/3(수) 10시 방문 확정. 220V 콘센트 확인 완료.',
    estimatedPrice: 490000
  },
  {
    id: 'BK-20260830-002',
    createdAt: '2026-08-30T14:15:00.000Z',
    customerName: '이서연',
    phone: '010-9182-4411',
    carModel: 'BMW 520d (2021년형)',
    serviceName: 'VIP 올인원 풀케어 패키지',
    location: '경기 성남시 분당구 정자동 파크뷰 지하 1층',
    preferredDate: '2026-09-04',
    preferredTime: '13:00',
    notes: '실내 가죽시트 얼룩 제거 및 전체 발수코팅 부탁드립니다.',
    status: '접수대기',
    adminMemo: '고객 통화 후 견적 안내 예정.',
    estimatedPrice: 750000
  },
  {
    id: 'BK-20260828-003',
    createdAt: '2026-08-28T11:00:00.000Z',
    customerName: '박준혁',
    phone: '010-5512-8874',
    carModel: '카니발 하이리무진',
    serviceName: '베이직 수성 광택 + 실내 스팀',
    location: '인천 연수구 송도동 센트럴파크 푸르지오',
    preferredDate: '2026-08-29',
    preferredTime: '09:00',
    notes: '패밀리카로 타던 차량이라 외장 광택 및 내부 위생 신경 써주세요.',
    status: '완료',
    adminMemo: '8/29 시공 완료. 고객 만족도 매우 높음. 현금영수증 발행완료.',
    estimatedPrice: 620000
  }
];

export const getBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get bookings from localStorage', e);
    return INITIAL_BOOKINGS;
  }
};

export const saveBooking = (bookingData) => {
  const current = getBookings();
  const newBooking = {
    id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    createdAt: new Date().toISOString(),
    status: '접수대기',
    adminMemo: '',
    ...bookingData
  };
  const updated = [newBooking, ...current];
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
  
  // 먼저 로컬 데이터 맵핑
  local.forEach(b => {
    if (b && b.id) map.set(b.id, b);
  });
  
  // 구글 시트 원격 데이터로 갱신 및 신규 추가
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

// 명함 프로필 정보
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
    shopName: '루멘 디테일링',
    englishName: 'LUMEN DETAILING SERVICE',
    ownerName: '홍길동 대표',
    title: '출장 디테일링 & 광택 전문가',
    phone: '010-1234-5678',
    email: 'lumendetail@gmail.com',
    location: '수도권 전지역 출장 (서울/경기/인천)',
    services: '수성듀얼광택 · 9H유리막코팅 · 실내크리닝 · 유막제거',
    instagram: '@lumen_detailing',
    bankAccount: '국민은행 123456-04-123456 (루멘)',
    qrType: 'url', // 'url' | 'kakao' | 'custom'
    qrCustomText: window.location.origin,
    theme: 'carbon-dark', // 'carbon-dark' | 'gold-luxury' | 'neon-blue' | 'clean-silver'
    accentTag: '100% 예약제 맞춤 1:1 출장 시공'
  };
};

export const saveCardProfile = (profile) => {
  localStorage.setItem(CARD_PROFILE_KEY, JSON.stringify(profile));
};

// ==================== 관리자 비밀번호 & 세션 관리 ====================
const ADMIN_PW_KEY = 'lumen_polish_admin_pw';
const ADMIN_SESSION_KEY = 'lumen_polish_admin_session';
const DEFAULT_ADMIN_PW = '1234';

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
