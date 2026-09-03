// 검증된 전문 디테일러(기술자) 파트너 마스터 데이터

export const INITIAL_TECHNICIANS = [
  {
    id: 'TECH-001',
    name: '김태진',
    badge: '마스터 디테일러',
    verified: true,
    rating: 4.98,
    reviewCount: 142,
    completedJobs: 218,
    experienceYears: 9,
    region: '인천/서부권',
    baseLocation: '인천 서구 청라국제도시',
    activeZones: ['인천 전역(서구/청라/송도/부평/계양)', '김포', '부천', '서울 강서/양천'],
    zoneKey: 'zone1',
    specialties: ['수성 듀얼 광택', '9H 세라믹 코팅', '도장면 딥샌딩'],
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    phone: '010-8472-1928',
    introduction: '수성 듀얼 폴리싱 9년차 1급 마스터 디테일러입니다. 도막 두께 측정 기반으로 클리어층 손실을 최소화하는 안전한 비파괴 광택을 지향합니다.',
    equipment: [
      'Rupes BigFoot 21mm/15mm 듀얼 광택기',
      'Flex PXE80 미니 샌딩 & 폴리셔',
      '도막 두께 정밀 측정기 (Elcometer)',
      '3000루멘 이동식 고색재현 검사 조명'
    ],
    portfolio: [
      {
        title: '제네시스 G80 수성 듀얼 광택 & 9H 코팅',
        before: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
        comment: '자동세차 스월마크 98% 제거 및 깊은 채도 복원'
      },
      {
        title: '포르쉐 카이엔 유리막 코팅 & 발수',
        before: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
        comment: '초발수 비딩각 형성 및 방오 피막 시공'
      }
    ],
    status: 'ACTIVE',
    acceptingOrders: true,
    minPrice: 250000
  },
  {
    id: 'TECH-002',
    name: '박성호',
    badge: '광택 수석 엔지니어',
    verified: true,
    rating: 4.95,
    reviewCount: 98,
    completedJobs: 165,
    experienceYears: 7,
    region: '서울/강남권',
    baseLocation: '서울 강남구 역삼동',
    activeZones: ['서울 전역(강남/서초/송파/용산/마포)', '성남/분당', '과천', '안양'],
    zoneKey: 'zone3',
    specialties: ['수입차 전문 광택', '유막제거 및 초발수', '생활스크래치 완화'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    phone: '010-3918-5521',
    introduction: '독일 3사(벤츠, BMW, 아우디) 및 프리미엄 수입차 전담 시공 7년 경력. 어두운 계열 차량의 홀로그램 없는 완벽한 거울 광택을 자부합니다.',
    equipment: [
      'Makita 싱글 로터리 광택기',
      'Shinemate EX620 듀얼 폴리셔',
      '고압 스팀기 & 디테일링 블로워',
      '초정밀 LED 스월 파인더 조명'
    ],
    portfolio: [
      {
        title: 'BMW 530i 소피스토그레이 스월 제거',
        before: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        comment: '측면 문콕 주변 딥스크래치 완화 및 피니쉬 글레이징'
      }
    ],
    status: 'ACTIVE',
    acceptingOrders: true,
    minPrice: 280000
  },
  {
    id: 'TECH-003',
    name: '이진우',
    badge: '실내크리닝 & 외장 스페셜리스트',
    verified: true,
    rating: 4.92,
    reviewCount: 84,
    completedJobs: 130,
    experienceYears: 6,
    region: '경기/남부권',
    baseLocation: '경기 수원시 영통구 / 화성 동탄',
    activeZones: ['수원', '화성/동탄', '용인/수지', '평택/오산', '안산'],
    zoneKey: 'zone3',
    specialties: ['실내 고온스팀 크리닝', '가죽코팅 & 냄새제거', '세미 광택'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    phone: '010-7261-9043',
    introduction: '패밀리카와 중고차 구매 후 리프레시 시공 전문! 외장 광택과 실내 딥클렌징을 한번에 완벽하게 해결해 드립니다.',
    equipment: [
      '150도 고온 고압 살균 스팀기',
      'Karcher 습식 엑스트랙터(흡입기)',
      'Rupes Mini 듀얼 광택기',
      '가죽 전용 에어스프레이 코팅건'
    ],
    portfolio: [
      {
        title: '카니발 하이리무진 실내 딥클리닝 & 외장광택',
        before: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
        comment: '가죽시트 찌든때 100% 제거 및 외장 발수 코팅'
      }
    ],
    status: 'ACTIVE',
    acceptingOrders: true,
    minPrice: 230000
  },
  {
    id: 'TECH-004',
    name: '최원영',
    badge: '부분 맞춤패널 장인',
    verified: true,
    rating: 4.96,
    reviewCount: 76,
    completedJobs: 115,
    experienceYears: 8,
    region: '경기/북부권',
    baseLocation: '경기 고양시 일산동구',
    activeZones: ['고양/일산', '파주', '김포 한강신도시', '서울 은평/마포/서대문'],
    zoneKey: 'zone2',
    specialties: ['본넷/범퍼 부분집중 광택', '워터스팟 샌딩제거', 'PPF 엣지 광택'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    phone: '010-6184-7732',
    introduction: '전체 광택이 부담스러우신 분들을 위해 흠집이 집중된 본넷, 범퍼, 도어만 정밀하게 복원하는 가성비 맞춤 시공을 제공합니다.',
    equipment: [
      'Festool 로텍스 폴리셔',
      '3M 트라이잭트 3000/5000 마이크로 샌딩',
      'Gyeon 세라믹 쿼츠 코팅 시스템'
    ],
    portfolio: [
      {
        title: '아반떼 N 본넷 워터스팟 에칭 복원',
        before: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
        after: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
        comment: '지하주차장 석회물 자국 샌딩 및 2스텝 폴리싱 완벽 복구'
      }
    ],
    status: 'ACTIVE',
    acceptingOrders: true,
    minPrice: 150000
  }
];

export const SPECIALTY_CATEGORIES = [
  '전체',
  '수성 듀얼 광택',
  '9H 세라믹 코팅',
  '수입차 전문 광택',
  '실내 고온스팀 크리닝',
  '본넷/범퍼 부분집중 광택',
  '유막제거 및 초발수'
];

export const REGION_CATEGORIES = [
  '전체 지역',
  '인천/서부권',
  '서울/강남권',
  '경기/남부권',
  '경기/북부권'
];

/**
 * 고객의 출장 권역 및 주소에 따라 가장 가까운 기술자 순서로 정렬하여 반환
 */
export const getTechniciansByProximity = (travelZone = 'zone1', address = '', technicians = INITIAL_TECHNICIANS) => {
  const zoneWeights = {
    zone1: { 'TECH-001': 1, 'TECH-004': 2, 'TECH-002': 3, 'TECH-003': 4 },
    zone2: { 'TECH-004': 1, 'TECH-001': 2, 'TECH-002': 3, 'TECH-003': 4 },
    zone3: { 'TECH-002': 1, 'TECH-003': 2, 'TECH-001': 3, 'TECH-004': 4 },
    zone4: { 'TECH-003': 1, 'TECH-002': 2, 'TECH-001': 3, 'TECH-004': 4 }
  };

  const weights = zoneWeights[travelZone] || zoneWeights.zone1;

  return [...technicians].sort((a, b) => {
    // 1. 주소 문자열 매칭 가산점
    const aMatch = address && a.activeZones.some(z => address.includes(z.split('/')[0])) ? -10 : 0;
    const bMatch = address && b.activeZones.some(z => address.includes(z.split('/')[0])) ? -10 : 0;
    
    const rankA = (weights[a.id] || 99) + aMatch;
    const rankB = (weights[b.id] || 99) + bMatch;

    return rankA - rankB;
  });
};
