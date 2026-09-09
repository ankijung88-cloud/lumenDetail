// 검증된 전문 디테일러(기술자) 파트너 마스터 데이터 (실제 등록 데이터 기반)

export const INITIAL_TECHNICIANS = [
  {
    id: 'TECH-MASTER-001',
    name: '안기정',
    phone: '010-7246-7211',
    pin: '7211',
    badge: '출장전문 디테일러',
    experienceYears: 5,
    region: '인천/서부권',
    baseLocation: '인천 청라',
    activeZones: ['인천 전지역', '수도권 일부지역', '서울 일부지역'],
    specialties: ['수성 듀얼 광택', '9H 세라믹 코팅'],
    equipment: ['싱글 및 듀얼 광택기', '도막 측정기'],
    introduction: '수성 광택 및 세라믹 코팅 전문 디테일러입니다.',
    minPrice: 100000,
    rating: 5.0,
    reviewCount: 38,
    completedJobs: 142,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
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
 * 고객의 출장 권역 및 주소에 따라 실제 등록된 기술자를 최적 근접 순서로 정렬하여 반환
 */
export const getTechniciansByProximity = (travelZone = 'zone1', address = '', technicians = []) => {
  if (!technicians || technicians.length === 0) return [];

  const zoneRegionMap = {
    zone1: ['인천', '청라', '송도', '부평', '계양', '김포', '부천', '서구'],
    zone2: ['송도', '영종', '김포', '강서', '양천', '마곡', '목동', '일산', '고양', '파주', '광명'],
    zone3: ['서울', '강남', '서초', '송파', '용산', '마포', '성남', '분당', '수원', '화성', '동탄', '안양', '과천'],
    zone4: ['평택', '오산', '안산', '이천', '용인', '경기']
  };

  const targetKeywords = zoneRegionMap[travelZone] || zoneRegionMap.zone1;

  return [...technicians].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // 1. 고객 입력 주소와 기사 활동지역/거점 상세 매칭 점수
    if (address) {
      if (a.activeZones?.some(z => address.includes(z.split('/')[0]) || z.includes(address))) scoreA += 50;
      if (b.activeZones?.some(z => address.includes(z.split('/')[0]) || z.includes(address))) scoreB += 50;
      if (a.baseLocation && address.includes(a.baseLocation.split(' ')[0])) scoreA += 30;
      if (b.baseLocation && address.includes(b.baseLocation.split(' ')[0])) scoreB += 30;
    }

    // 2. 권역 키워드 매칭 점수
    if (a.region && targetKeywords.some(kw => a.region.includes(kw))) scoreA += 20;
    if (b.region && targetKeywords.some(kw => b.region.includes(kw))) scoreB += 20;
    if (a.activeZones?.some(z => targetKeywords.some(kw => z.includes(kw)))) scoreA += 20;
    if (b.activeZones?.some(z => targetKeywords.some(kw => z.includes(kw)))) scoreB += 20;

    // 3. 평점 가산점
    scoreA += (a.rating || 5.0);
    scoreB += (b.rating || 5.0);

    return scoreB - scoreA;
  });
};

