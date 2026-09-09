// 전국 주요 도시 및 기사 등록 거점 마스터 데이터

export const DEFAULT_HUBS = [
  // 1. 수도권
  {
    id: 'hub-incheon-cheongna',
    name: '인천 서구 (청라/검단)',
    regionGroup: '수도권',
    shortName: '인천 청라',
    address: '인천광역시 서구 청라동',
    technicianName: '안기정 프로 (출장전문)',
    isDefault: true,
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
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '경기 외곽(평택, 안성, 이천, 여주, 포천, 가평, 양평, 동두천, 화성 남부, 오산 등)'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '충청/강원/지방 등 65km 초과 원거리 (65km 초과 시 10km당 +10,000원 거리별 투명 개별 책정 및 기사 1:1 안심 조율)'
      }
    ]
  },
  {
    id: 'hub-incheon-songdo',
    name: '인천 연수구 (송도/남동)',
    regionGroup: '수도권',
    shortName: '인천 송도',
    address: '인천광역시 연수구 송도동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '인천 연수구(송도/동춘/옥련), 남동구(논현/구월/만수), 미추홀구, 중구 원도심, 시흥 배곧·정왕'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '인천 서구(청라/루원), 부평구, 계양구, 영종국제도시, 부천, 안산, 시흥 은계/목감, 광명'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '서울 전역(구로/영등포/강남/서초/마포), 안양, 군포, 의왕, 수원, 화성(봉담/향남/동탄), 김포'
      },
      {
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '평택, 오산, 용인 남부, 안성, 성남(분당), 고양(일산), 파주, 구리, 하남'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '충남(당진/서산/천안), 강원, 경기 북부 외곽 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-seoul-gangnam',
    name: '서울 강남/서초 (동남권)',
    regionGroup: '수도권',
    shortName: '서울 강남',
    address: '서울특별시 강남구 역삼동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '서울 강남구, 서초구, 송파구, 강동구, 성동구, 광진구, 용산구, 과천, 성남 수정/중원'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '서울 전역(영등포/마포/중구/동대문/노원/양천), 성남(분당/판교), 하남, 구리, 안양, 광명, 의왕'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '수원, 화성(동탄/병점), 용인(수지/기흥/처인), 안산, 시흥, 부천, 인천 부평/계양, 남양주, 고양(일산)'
      },
      {
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '인천 서구/송도, 김포, 파주, 평택, 오산, 이천, 안성, 양평, 가평, 동두천'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '충청(천안/아산/진천), 강원(원주/춘천) 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-seoul-mapo',
    name: '서울 마포/여의도 (서북권)',
    regionGroup: '수도권',
    shortName: '서울 마포',
    address: '서울특별시 마포구 공덕동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '서울 마포구, 영등포구(여의도), 용산구, 서대문구, 종로구, 은평구, 중구, 양천구(목동), 강서구'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '고양(일산/덕양), 부천, 광명, 구로구, 동작구, 서초구, 강남구, 성북구, 노원구, 김포 남부'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '인천 전지역(서구/부평/송도), 파주, 의정부, 양주, 안양, 과천, 성남(분당), 하남, 구리, 남양주'
      },
      {
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '수원, 화성(동탄), 용인, 안산, 시흥 남부, 평택, 포천, 동두천, 가평'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '충청/강원/경기 최외곽 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-gyeonggi-suwon',
    name: '경기 수원/동탄 (경기 남부권)',
    regionGroup: '수도권',
    shortName: '경기 수원/동탄',
    address: '경기도 수원시 영통구 이의동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '수원 전역(영통/팔달/권선/장안), 화성(동탄1·2신도시/병점/봉담), 오산, 용인(기흥/수지), 의왕 남부'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '성남(분당/판교), 안양, 군포, 안산, 평택 북부(송탄/고덕), 용인 처인구, 과천, 시흥'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '서울 남부(강남/서초/송파/관악/구로), 광명, 부천, 인천 남동/연수, 평택 시내, 안성, 이천, 하남, 광주(경기)'
      },
      {
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '서울 북부/마포/노원, 인천 서구/청라, 김포, 고양(일산), 구리, 남양주, 천안, 여주'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '충북/충남(아산/청주/세종), 파주, 강원 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-gyeonggi-goyang',
    name: '경기 고양/일산 (경기 북서권)',
    regionGroup: '수도권',
    shortName: '경기 고양/일산',
    address: '경기도 고양시 일산동구 장항동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '고양시 전역(일산동구/일산서구/덕양구/삼송/원흥/지축), 파주 운정·교하, 김포 한강신도시 일부'
      },
      {
        zone: '2권역 (인접 수도권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '서울 서북부(은평/마포/서대문/강서/양천), 파주 금촌·문산, 김포 전역, 양주, 부천, 인천 계양'
      },
      {
        zone: '3권역 (광역 수도권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '인천 서구(청라)/부평/송도, 서울 전역(종로/중구/강남/서초/영등포), 의정부, 광명, 안양, 구리, 남양주'
      },
      {
        zone: '4권역 (경기 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '성남(분당/판교), 수원, 화성, 시흥, 안산, 동두천, 포천, 하남, 가평'
      },
      {
        zone: '5권역 (65km 초과 원거리/지방)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '평택, 안성, 충청권, 강원 영서 등 65km 초과 원거리'
      }
    ]
  },

  // 2. 충청권 / 대전
  {
    id: 'hub-daejeon-yuseong',
    name: '대전 유성/서구 (대전 충청권)',
    regionGroup: '충청권',
    shortName: '대전 유성',
    address: '대전광역시 유성구 봉명동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '대전 전역(유성구/서구 둔산/중구/동구/대덕구), 세종 남부(보람/대평/소담동), 계룡시'
      },
      {
        zone: '2권역 (인접 충청권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '세종시 전역(나성/어진/아름/조치원), 공주시, 옥천군, 금산군, 청주 서원구/흥덕구 남부'
      },
      {
        zone: '3권역 (광역 충청권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '청주시 전역(오창/오송), 논산시, 부여군, 천안 동남구, 보은군, 영동군'
      },
      {
        zone: '4권역 (충청 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '천안 서북구, 아산시, 진천군, 음성군, 괴산군, 익산 북부, 당진 남부'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '수도권(평택/안성), 전북(전주/군산), 경북(김천/상주) 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-chungcheong-cheonan',
    name: '충남 천안/아산 (충남 북부권)',
    regionGroup: '충청권',
    shortName: '충남 천안/아산',
    address: '충청남도 천안시 서북구 불당동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '천안시 전역(서북구 불당/두정/백석, 동남구 신부/청수), 아산시(배방/탕정/온천)'
      },
      {
        zone: '2권역 (인접 권역)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '평택 남부(팽성/안중), 안성 공도/시내, 아산 둔포/인주, 세종 북부(조치원), 진천'
      },
      {
        zone: '3권역 (광역 권역)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '세종 전역, 청주(오창/오송/흥덕), 평택 고덕/송탄, 당진, 예산, 공주, 오산'
      },
      {
        zone: '4권역 (외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '대전 전역, 화성(동탄/남양), 수원, 서산, 홍성, 음성, 이천'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '서울/수도권 북부, 전북, 충북 동부 등 65km 초과 원거리'
      }
    ]
  },

  // 3. 영남권 / 부산 / 대구 / 울산
  {
    id: 'hub-busan-haeundae',
    name: '부산 해운대/서면 (부산 동남권)',
    regionGroup: '영남권',
    shortName: '부산 해운대',
    address: '부산광역시 해운대구 우동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '부산 전역(해운대구/수영구/남구/연제구/동래구/부산진구/중구/동구/금정구)'
      },
      {
        zone: '2권역 (인접 동남권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '부산 기장군(정관/일광), 강서구(명지/녹산), 사하구, 김해시(장유/율하/시내), 양산시(물금/동면)'
      },
      {
        zone: '3권역 (광역 영남권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '창원시 전역(성산/의창/마산/진해), 울산광역시(남구/중구/울주군), 밀양시, 거제 북부'
      },
      {
        zone: '4권역 (영남 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '경주시, 포항 남부, 청도군, 통영시, 진주시, 함안군'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '대구, 구미, 전남(여수/광양), 경북 북부 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-daegu-suseong',
    name: '대구 수성/중구 (대구 경북권)',
    regionGroup: '영남권',
    shortName: '대구 수성',
    address: '대구광역시 수성구 범어동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '대구 전역(수성구/중구/동구/서구/남구/북구/달서구), 경산시(하양/진량/시내)'
      },
      {
        zone: '2권역 (인접 경북권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '대구 달성군(다사/화원/현풍/구지), 칠곡군(왜관/북삼), 영천시, 청도군, 군위'
      },
      {
        zone: '3권역 (광역 경북권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '구미시 전역, 김천시 혁신도시, 성주군, 고령군, 창녕군, 밀양 북부'
      },
      {
        zone: '4권역 (경북 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '포항시, 경주시, 안동시 남부, 상주시, 의성군, 합천군'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '부산, 울산, 대전, 충북 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-ulsan-namgu',
    name: '울산 남구/삼산 (울산 동해권)',
    regionGroup: '영남권',
    shortName: '울산 남구',
    address: '울산광역시 남구 삼산동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '울산 전역(남구/중구/동구/북구 송정/울주군 범서·구영·언양 일부)'
      },
      {
        zone: '2권역 (인접 동해권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '울주군 남창/온산, 양산 웅상/덕계, 경주 남부(외동/불국사), 부산 기장 북부'
      },
      {
        zone: '3권역 (광역 영남권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '부산 해운대/동래/금정, 양산 물금, 경주시내, 포항 남구, 밀양 동부'
      },
      {
        zone: '4권역 (외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '부산 강서/사하, 김해, 창원, 포항 북구, 영천, 청도'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '대구, 구미, 거제, 통영 등 65km 초과 원거리'
      }
    ]
  },

  // 4. 호남권 / 광주 / 전북
  {
    id: 'hub-gwangju-sangmu',
    name: '광주 상무/서구 (광주 호남권)',
    regionGroup: '호남권',
    shortName: '광주 상무',
    address: '광주광역시 서구 치평동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '광주 전역(서구 상무/광산구 수완·첨단/북구/남구/동구), 나주 빛가람 혁신도시'
      },
      {
        zone: '2권역 (인접 호남권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '담양군, 장성군, 화순군, 함평군, 나주시내'
      },
      {
        zone: '3권역 (광역 호남권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '목포시, 무안군(남악신도시), 영광군, 곡성군, 보성군, 영암군'
      },
      {
        zone: '4권역 (호남 외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '순천시, 정읍시, 고창군, 장흥군, 해남 북부, 순창군'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '전주, 여수, 광양, 완도, 진도 등 65km 초과 원거리'
      }
    ]
  },
  {
    id: 'hub-jeonbuk-jeonju',
    name: '전북 전주/완산 (전북 중부권)',
    regionGroup: '호남권',
    shortName: '전북 전주',
    address: '전북특별자치도 전주시 완산구 효자동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '전주 전역(완산구 효자·서신, 덕진구 에코시티·혁신), 완주군(이서/삼례/봉동)'
      },
      {
        zone: '2권역 (인접 전북권)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '익산시(영등/모현/동산), 김제시, 완주군 상관/구이, 임실 북부'
      },
      {
        zone: '3권역 (광역 호남권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '군산시(수송/조촌/나운), 정읍시, 부안군, 논산 남부, 진안군, 순창'
      },
      {
        zone: '4권역 (외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '대전, 계룡, 공주, 남원시, 고창군, 서천, 장수'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '광주, 세종, 충청 북부, 영남권 등 65km 초과 원거리'
      }
    ]
  },

  // 5. 강원권
  {
    id: 'hub-gangwon-wonju',
    name: '강원 원주/혁신 (강원 영서권)',
    regionGroup: '강원권',
    shortName: '강원 원주',
    address: '강원특별자치도 원주시 반곡동',
    zones: [
      {
        zone: '1권역 (핵심 무료 권역)',
        fee: 0,
        feeText: '무료 (0원)',
        badge: '출장비 0원',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        distance: '반경 ~12km 이내',
        areas: '원주시 전역(혁신도시/기업도시/단계/무실/단구/반곡/태장/중앙동)'
      },
      {
        zone: '2권역 (인접 강원/경기)',
        fee: 15000,
        feeText: '+15,000원',
        badge: '인접 권역',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        distance: '반경 ~25km 이내',
        areas: '원주 문막/소초, 횡성군 횡성읍, 제천 북부(백운), 여주 동부'
      },
      {
        zone: '3권역 (광역 영서권)',
        fee: 30000,
        feeText: '+30,000원',
        badge: '광역 권역',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        distance: '반경 ~45km 이내',
        areas: '제천시내, 여주시내, 이천 동부(장호원), 양평 남부, 충주 북부, 평창 서부'
      },
      {
        zone: '4권역 (외곽 권역)',
        fee: 50000,
        feeText: '+50,000원',
        badge: '외곽 권역',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        distance: '반경 45km ~ 65km 이내',
        areas: '춘천시, 충주시내, 이천시내, 광주(경기), 단양군, 영월군, 홍천'
      },
      {
        zone: '5권역 (65km 초과 원거리/타지역)',
        fee: 70000,
        feeText: '+70,000원~ (거리별 책정)',
        badge: '거리별 개별 책정',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        distance: '반경 65km 초과 (거리별 산정)',
        areas: '서울/수도권 서부, 강릉/동해, 경북 북부 등 65km 초과 원거리'
      }
    ]
  }
];

/**
 * 기사가 직접 입력한 거점명을 바탕으로 1~5권역을 자동 생성하는 함수
 */
export const generateHubZones = (hubName, baseAddress = '', technicianName = '') => {
  const shortName = hubName.trim();
  const address = (baseAddress || hubName).trim();

  return [
    {
      zone: '1권역 (핵심 무료 권역)',
      fee: 0,
      feeText: '무료 (0원)',
      badge: '출장비 0원',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      distance: '반경 ~12km 이내',
      areas: `${shortName} 거점 인근 및 관할 반경 12km 이내 핵심 생활권`
    },
    {
      zone: '2권역 (인접 생활권)',
      fee: 15000,
      feeText: '+15,000원',
      badge: '인접 권역',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      distance: '반경 ~25km 이내',
      areas: `${shortName} 기준 인접 시/군/구 및 25km 이내 인접 권역`
    },
    {
      zone: '3권역 (광역 생활권)',
      fee: 30000,
      feeText: '+30,000원',
      badge: '광역 권역',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      distance: '반경 ~45km 이내',
      areas: `${shortName} 기준 반경 45km 이내 광역 도시권 및 인접 시도`
    },
    {
      zone: '4권역 (외곽 권역)',
      fee: 50000,
      feeText: '+50,000원',
      badge: '외곽 권역',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      distance: '반경 45km ~ 65km 이내',
      areas: `${shortName} 기준 반경 45km ~ 65km 이내 시 외곽 및 인접 도 지역`
    },
    {
      zone: '5권역 (65km 초과 원거리/타지역)',
      fee: 70000,
      feeText: '+70,000원~ (거리별 책정)',
      badge: '거리별 개별 책정',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      distance: '반경 65km 초과 (거리별 산정)',
      areas: `${shortName} 기준 반경 65km 초과 초장거리 (65km 초과 시 10km당 +10,000원 투명 개별 책정 및 기사 안심 1:1 조율)`
    }
  ];
};
