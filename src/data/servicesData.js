// 서비스 항목, 프로세스, 가격표, Before/After 이미지 데이터

export const SERVICES = [
  {
    id: 'bonnet',
    title: '본넷(후드) 집중 수성 광택 & 케어',
    shortDesc: '스톤칩, 워터스팟, 거미줄 스월마크가 가장 눈에 띄는 본넷의 클리어층을 연마하여 거울 같은 깊은 리플렉션과 채도를 살려냅니다.',
    badge: '인기 부위 No.1',
    icon: 'Sparkles',
    duration: '약 1~1.5시간 소요',
    features: [
      '본넷 전용 수성 듀얼 폴리싱 공정',
      '워터스팟, 낙진, 깊은 스월마크 집중 제거',
      '도막 두께 측정 기반의 안전한 클리어층 연마',
      '시공 부위 전용 고광택 실란트 및 초발수 코팅 마감'
    ],
    bgGradient: 'from-cyan-500/20 to-blue-600/10',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30'
  },
  {
    id: 'door',
    title: '도어(문짝) 흠집 & 스월마크 케어',
    shortDesc: '잦은 문콕, 승하차 손톱 흠집, 측면 주차 스크래치로 오염된 도어 패널을 신차급 깨끗한 컨디션으로 케어합니다.',
    badge: '생활기스 해결',
    icon: 'Layers',
    duration: '도어당 약 40분~1시간',
    features: [
      '도어 패널 스월마크 및 문콕 주변 스크래치 완화',
      '도어컵(손잡이 안쪽) 딥클렌징 & 잔기스 완벽 정리',
      '싱글 컷팅 + 듀얼 피니쉬 2스텝 맞춤 시공',
      '운전석/조수석 1열 또는 전좌석 도어 세트 선택 가능'
    ],
    bgGradient: 'from-blue-500/20 to-indigo-600/10',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/30'
  },
  {
    id: 'bumper',
    title: '앞·뒤 범퍼 & 코너 쓸림 집중 광택',
    shortDesc: '주차 코너 쓸림, 긁힘, 벌레 사체(버그) 고착 자국을 페인트 재도색 없이 수성 광택으로 말끔하게 완화합니다.',
    badge: '주차상처 케어',
    icon: 'ShieldCheck',
    duration: '범퍼당 약 1시간 소요',
    features: [
      '주차 쓸림, 미세 페인트 묻음(페인트 클렌징) 제거',
      '벌레 자국, 타르, 아스팔트 고착 오염 딥 샌딩/폴리싱',
      '범퍼 굴곡진 파츠 및 플라스틱 가니쉬 보호 마스킹',
      '고광택 완성 및 방오 발수 실런트 코팅 마감'
    ],
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'fender',
    title: '앞·뒤 휀다 & 필러 집중 케어',
    shortDesc: '타이어 비산 오염(타르/철분)과 좁은 길 스크래치가 많은 휀다 및 하이그로시 필러의 스월마크를 개선합니다.',
    badge: '디테일 케어',
    icon: 'Droplets',
    duration: '휀다당 약 40분~1시간',
    features: [
      '앞/뒤 휀다 아치 주변 타르·철분 딥클렌징 전처리',
      '좁은 틈새 및 휀다 엣지 라인 미니 폴리싱',
      'B/C필러 블랙 하이그로시 스월마크 미세 케어',
      '도장면 채도 극대화 및 실란트 프로텍션 마감'
    ],
    bgGradient: 'from-sky-500/20 to-cyan-600/10',
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/30'
  },
  {
    id: 'trunk_roof',
    title: '트렁크 & 루프(천장) 오염 케어',
    shortDesc: '짐 상하차로 긁힌 트렁크 리드와 새똥/나무수액/산성비로 얼룩진 루프의 산화 피막 및 오염을 완벽하게 제거합니다.',
    badge: '상판오염 해결',
    icon: 'Wrench',
    duration: '약 1~1.5시간 소요',
    features: [
      '트렁크 리드 짐 스크래치 완화 & 테일게이트 광택 케어',
      '루프(천장) 새똥, 나무 수액 파고듦 샌딩 & 폴리싱',
      '워터스팟 에칭(식각) 자국 단계별 맞춤 컷팅',
      '도장면 산화 방지 및 초발수 보호막 시공'
    ],
    bgGradient: 'from-purple-500/20 to-indigo-600/10',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'semi_polish',
    title: '2스텝 세미광택 (도장보호 & 광택 케어)',
    shortDesc: '클리어층의 연마(컷팅) 손실을 최소화하고, 싱글+듀얼 2단계 조합으로 얕은 스월마크를 정돈하여 맑고 깊은 본래의 광택감을 극대화합니다.',
    badge: '도장보호 케어',
    icon: 'Layers',
    duration: '약 2~3시간 소요',
    features: [
      '싱글 액션 1차 초벌 + 듀얼 액션 2차 피니쉬 2스텝 공정',
      '클리어층 손실을 최소화하는 비파괴형 안전 연마 기술',
      '생활 잔스크래치 및 미세 난반사 정리로 맑은 채도 회복',
      '수성 전용 패드 시공 및 고광택 실란트 코팅 마감'
    ],
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'custom_panel',
    title: '원하는 부위만 쏙! 맞춤 패널 선택 케어',
    shortDesc: '전체 광택이 부담스러울 때, 내가 원하는 부위(본넷+도어+범퍼 등)만 쏙 골라 합리적인 견적으로 시공 받으실 수 있습니다.',
    badge: '가성비 BEST',
    icon: 'Car',
    duration: '선택 부위별 맞춤 진행',
    features: [
      '1판(패널) 단위 단독 시공부터 다중 부위 묶음 시공 가능',
      '도장 손상도에 따른 1:1 맞춤형 공정 설계',
      '전체 광택 대비 최대 60% 이상 비용 절감 효과',
      '출장 현장에서 도장면 점검 후 추가 부위 자유 조율'
    ],
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30'
  }
];

export const WORK_PROCESS = [
  {
    step: '01',
    title: '현장 도착 및 차량 상태 진단',
    desc: '고객님 댁 주차장 또는 직장으로 방문하여 도장면 상태(스월마크, 딥스크래치, 도막 두께)를 꼼꼼하게 점검합니다.',
    icon: 'Search'
  },
  {
    step: '02',
    title: '디테일링 세차 & 철분/타르 전처리',
    desc: '무흠집 프리워시 후 표면에 박힌 철분, 아스팔트 타르, 낙진을 클레이바로 완벽하게 전처리 박리합니다.',
    icon: 'Wrench'
  },
  {
    step: '03',
    title: '틈새 및 고무 몰딩 풀 마스킹',
    desc: '광택기 마찰로 인한 고무 몰딩 및 엠블럼 훼손을 방지하기 위해 특수 보호 테이프로 빈틈없이 마스킹합니다.',
    icon: 'Layers'
  },
  {
    step: '04',
    title: '수성 듀얼 폴리싱 (광택)',
    desc: '약재로 기스를 덮는 유성이 아닌, 수성 컴파운드와 듀얼 액션 광택기로 도장면 본연의 광택을 완성합니다.',
    icon: 'Sparkles'
  },
  {
    step: '05',
    title: '완벽 탈지 & 유리막/세라믹 코팅',
    desc: '도장면 잔여 유분을 100% 제거(탈지)한 후 세라믹 코팅제를 균일하게 도포 및 버핑하여 보호막을 완성합니다.',
    icon: 'Shield'
  },
  {
    step: '06',
    title: '최종 검수 및 고객 인도',
    desc: '조명 아래에서 최종 리플렉션을 확인하고, 관리 요령 및 품질 보증 안내 후 차량을 기분 좋게 인도해 드립니다.',
    icon: 'CheckCircle2'
  }
];

export const BEFORE_AFTER_ITEMS = [
  {
    id: 1,
    title: '본넷 스월마크 & 난반사 케어 (제네시스 G80)',
    description: '자동세차로 발생한 수만 개의 거미줄 스월마크를 수성 듀얼 광택으로 98% 이상 제거하여 거울 같은 깊은 광택감 완성',
    beforeImg: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    tag: '수성 듀얼 광택',
    car: '제네시스 G80 블랙'
  },
  {
    id: 2,
    title: '측면 도어 생활 스크래치 & 페인트 케어 (BMW 5시리즈)',
    description: '문콕 및 주차 스크래치, 물때(워터스팟)를 샌딩 및 듀얼 폴리싱으로 클리어층 손상 없이 깨끗하게 제거',
    beforeImg: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    tag: '기스/물때 제거',
    car: 'BMW 520d 소피스토그레이'
  },
  {
    id: 3,
    title: '9H 세라믹 유리막 코팅 후 발수 비딩 효과',
    description: '물방울이 115도 이상 둥글게 맺히는 초발수 비딩각과 방오력으로 비가 온 뒤에도 오염이 손쉽게 씻겨 내려감',
    beforeImg: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    tag: '세라믹 코팅',
    car: '포르쉐 카이엔 화이트'
  }
];

export const PRICING_DATA = {
  categories: [
    { id: 'compact', name: '경차/소형', example: '모닝, 캐스퍼, 레이, 아반떼' },
    { id: 'mid', name: '중형/준대형', example: '쏘나타, K5, 그랜저, 3/5시리즈, C/E클래스' },
    { id: 'large_suv', name: '대형/중형SUV', example: 'G80, K8, 싼타페, 쏘렌토, GV70/80, X5, GLE' },
    { id: 'van_large', name: '대형SUV/미니밴', example: '카니발, 팰리세이드, 스타리아, 에스컬레이드' }
  ],
  packages: [
    {
      id: 'basic_polish',
      name: '베이직 수성 광택',
      desc: '스월마크 제거 + 광택도 회복 + 기초 발수코팅',
      recommended: false,
      prices: {
        compact: 250000,
        mid: 300000,
        large_suv: 350000,
        van_large: 420000
      },
      includes: [
        '기본 디테일링 세차 & 철분 제거',
        '2스텝 싱글 + 듀얼폴리싱',
        '고급 유리막 관리제 마감',
        '타이어 드레싱 & 휠 크리닝',
        '소요시간 3~4시간'
      ]
    },
    {
      id: 'premium_coating',
      name: '3스텝 광택 + 9H 유리막 코팅',
      desc: '신차급 광택 + 9H 유리막 + 전면 유막/발수',
      recommended: true,
      badge: '가장 인기 있는 시공',
      prices: {
        compact: 420000,
        mid: 490000,
        large_suv: 580000,
        van_large: 680000
      },
      includes: [
        '철분/타르/클레이 딥 클렌징 전처리',
        '풀 마스킹 & 수성 듀얼 광택',
        '알코올 100% 탈지 공정',
        '9H 유리막 코팅',
        '전면 유리 유막제거 & 발수 코팅 무료 시공'        
      ]
    },
    {
      id: 'all_in_one_vip',
      name: 'VIP 올인원 풀케어 패키지',
      desc: '외장 수성광택 + 유리막 + 전체 유리 발수',
      recommended: false,
      badge: '토탈 케어 종결',
      prices: {
        compact: 650000,
        mid: 750000,
        large_suv: 890000,
        van_large: 1050000
      },
      includes: [
        '수성 듀얼 광택',
        '9H 세라믹 유리막 코팅 (도장면 전체)',        
        '전체 유리(전면/측후면/썬루프) 유막제거 & 발수',
        '휠 & 플라스틱 트림 케어'        
      ]
    }
  ],
  singleServices: [
    { name: '본넷(후드) 집중 수성 광택 (단품)', originalPrice: '8만 ~ 13만원', priceRange: '4만 ~ 6.5만원', discount: '50% OFF' },
    { name: '도어(문짝 1판) 흠집 & 스월 케어', originalPrice: '5만 ~ 9만원', priceRange: '2.5만 ~ 4.5만원', discount: '50% OFF' },
    { name: '앞/뒤 범퍼(1개소) 코너 쓸림 광택', originalPrice: '7만 ~ 12만원', priceRange: '3.5만 ~ 6만원', discount: '50% OFF' },
    { name: '앞/뒤 휀다(1판) 및 필러 집중 케어', originalPrice: '5만 ~ 8만원', priceRange: '2.5만 ~ 4만원', discount: '50% OFF' },
    { name: '트렁크 리드 / 루프 상판 집중 케어', originalPrice: '7만 ~ 12만원', priceRange: '3.5만 ~ 6만원', discount: '50% OFF' },
    { name: '전면 유리 유막제거 + 초발수 코팅', originalPrice: '6만 ~ 9만원', priceRange: '3만 ~ 4.5만원', discount: '50% OFF' }
  ],
  travelZones: {
    hub: '인천 청라국제도시',
    promotion: '30만원 이상 패키지 시공 시 1·2권역 출장비 전액 무료 (40만원 이상 시 전권역 지원)',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '인천 서구(청라/루원/검단/가정/검암/석남), 부평구, 계양구, 김포 남부(풍무/고촌/사우), 부천(상동/중동/원미)'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '인천 송도·영종·연수·남동·미추홀구, 김포 한강신도시, 서울 서부(강서/마곡/양천/목동/구로/영등포/마포), 고양(일산), 광명, 시흥 북부'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '서울 전역(강남/서초/송파/용산/성동 등), 안양(평촌), 수원, 안산, 군포, 의왕, 화성(동탄), 성남(분당/판교), 하남, 구리, 남양주, 파주'
      },
      {
        zone: '4권역 (외곽 & 장거리)',
        fee: 50000,
        feeText: '+50,000원~ (협의)',
        badge: '장거리 협의',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km 초과',
        areas: '경기 외곽(평택, 안성, 이천, 여주, 포천, 양평 등), 충청/강원 북부 등 편도 1시간 이상 장거리'
      }
    ]
  }
};

export const REVIEWS = [
  {
    id: 1,
    name: '김*현 고객님',
    car: '제네시스 GV80 (블랙)',
    region: '경기 분당 출장 시공',
    rating: 5,
    date: '2026.08.24',
    content: '주차장까지 직접 오셔서 장비 다 세팅하시고 5시간 넘게 꼼꼼하게 작업해주셨습니다. 자동세차 기스로 엉망이었던 본넷이 새 차보다 더 번쩍거려요! 이 가격에 이 퀄리티면 무조건 추천합니다.',
    service: '3스텝 광택 + 9H 코팅'
  },
  {
    id: 2,
    name: '이*우 고객님',
    car: 'BMW 530i (소피스토 그레이)',
    region: '서울 강남구 출장 시공',
    rating: 5,
    date: '2026.08.19',
    content: '디테일링 샵에 차 맡기고 찾아오는 게 번거로웠는데, 회사 지하주차장에서 일하는 동안 시공해주시니 정말 편하네요. 전후 사진도 상세하게 보내주시고 설명도 친절하십니다.',
    service: 'VIP 올인원 풀케어'
  },
  {
    id: 3,
    name: '박*진 고객님',
    car: '아반떼 N 라인 (화이트)',
    region: '인천 송도 출장 시공',
    rating: 5,
    date: '2026.08.12',
    content: '실내 스팀 크리닝이랑 유막제거 받았는데 담배 냄새랑 시트 찌든때가 마법처럼 싹 사라졌습니다. 비 올 때 앞유리 빗방울 싹 날아가는 거 보고 감동했습니다!',
    service: '실내 크리닝 + 전체 유막발수'
  }
];

export const FAQS = [
  {
    q: '출장 시공 시 전기나 물 사용은 어떻게 되나요?',
    a: '기본적으로 고객님의 지하주차장 또는 아파트/빌라 주차장의 220V 콘센트 연결이 필요하며, 이동식 전용 조명과 특수 저소음 듀얼 광택기, 무선/스팀 장비를 구비하고 있어 협소한 공간에서도 주변 피해 없이 안전하게 시공 가능합니다.'
  },
  {
    q: '광택 작업 소요 시간은 얼마나 걸리나요?',
    a: '차종 및 도장 상태에 따라 상이하나, 베이직 광택은 3~4시간, 3스텝 광택+유리막 코팅은 5~6시간, 올인원 VIP 패키지는 약 6~8시간 정도 소요됩니다.'
  },
  {
    q: '비가 오거나 야외 주차장에서도 가능한가요?',
    a: '광택 및 코팅 작업 특성상 직사광선과 먼지, 비를 피할 수 있는 지하 주차장 또는 비가림 실내 공간에서 시공을 권장해 드립니다. 공간이 마땅치 않으실 경우 상담 시 최적의 장소를 조율해 드립니다.'
  },
  {
    q: '예약 및 결제는 어떻게 진행되나요?',
    a: '랜딩페이지에서 온라인 신청서를 남겨주시면 유선 상담 후 일정을 확정해 드립니다. 시공 완료 후 직접 검수하신 뒤 카드/계좌이체/현금영수증으로 결제하시면 됩니다.'
  }
];
