// 친구 입맛 기반 추천 데이터 — FriendDetail에서 분리
export const tasteDatabase = {
  spicy: {
    recommended: [
      {
        id: 101,
        name: '진진 마라탕',
        category: '중식',
        reason: '매운맛 사냥꾼들이 좋아할 화끈한 곳이에요.',
      },
      {
        id: 102,
        name: '틈새라면',
        category: '분식',
        reason: '강렬한 맵기를 선호하는 분들께 추천합니다.',
      },
    ],
    analysis:
      '이 친구는 스트레스 풀리는 매운맛을 가장 즐겨요. 함께 땀 흘리며 스트레스 풀 준비 되셨나요?',
  },
  umami: {
    recommended: [
      {
        id: 103,
        name: '우와 오코노미야키',
        category: '일식',
        reason: '두 분 다 깊은 감칠맛을 선호하시네요!',
      },
      {
        id: 104,
        name: '멘야하나비',
        category: '일식',
        reason: '풍부한 마제소바의 감칠맛을 느껴보세요.',
      },
    ],
    analysis:
      '깊고 진한 풍미를 중요하게 생각하는 미식가 친구예요. 재료 본연의 감칠맛이 살아있는 곳이 최고의 선택지!',
  },
  sweetness: {
    recommended: [
      {
        id: 105,
        name: '누데이크 성수',
        category: '디저트',
        reason: '달콤한 디저트 비평가들이 모이는 핫플입니다.',
      },
      {
        id: 106,
        name: '올드페리도넛',
        category: '디저트',
        reason: '당 충전이 필요한 날 최적의 선택지예요.',
      },
    ],
    analysis:
      "달콤한 디저트에 진심인 친구예요. 밥 먹은 뒤 '디저트 배'가 따로 있는 분이라면 최고의 메이트!",
  },
  saltiness: {
    recommended: [
      {
        id: 107,
        name: '길버트 버거',
        category: '양식',
        reason: '정통 아메리칸 스타일의 짭짤함을 즐겨보세요.',
      },
      {
        id: 108,
        name: '미즈컨테이너',
        category: '양식',
        reason: '짭짤한 치즈와 베이컨의 조화가 완벽합니다.',
      },
    ],
    analysis:
      '간이 확실하고 짭조름한 매력의 음식을 선호해요. 시원한 맥주 한 잔 곁들이기 좋은 맛을 좋아하네요.',
  },
  texture: {
    recommended: [
      {
        id: 109,
        name: '을지로 촙촙',
        category: '아시안',
        reason: '다양한 식감과 감칠맛을 한 번에 잡은 곳입니다.',
      },
      {
        id: 110,
        name: '성수 족발',
        category: '한식',
        reason: '쫀득하고 찰진 식감을 사랑하는 분들께 추천해요.',
      },
    ],
    analysis:
      '음식의 씹는 맛을 가장 중요하게 생각해요. 쫀득하거나 바삭한 식감이 살아있는 요리에 감동받는 편!',
  },
};

export const tagDescriptions = {
  '#매운맛 고수 🌶️': '스트레스 풀리는 매운맛을 가장 즐겨요 🌶️',
  '#식감 마스터 ✨': '꼬들함과 바삭함 등 입안의 즐거움을 찾아요 ✨',
  '#단짠 천재 🧂': '멈출 수 없는 중독적인 단짠의 조화를 선호해요 🧂',
  '#달콤 처돌이 🍭': '지친 하루를 달래줄 달콤한 디저트에 진심이에요 🍭',
  '#감칠맛 박사 🍜': '재료 본연의 깊고 진한 풍미를 중요하게 생각해요 🍜',
  '#미식 탐험가': '기미복이 인증하는 균형 잡힌 입맛의 소유자입니다',
};

export const getTasteTags = (profile) => {
  if (!profile) return ['#미식 탐험가'];
  const tags = [];
  if (profile.spicy >= 4) tags.push('#매운맛 고수 🌶️');
  if (profile.texture >= 4) tags.push('#식감 마스터 ✨');
  if (profile.saltiness >= 4) tags.push('#단짠 천재 🧂');
  if (profile.sweetness >= 4) tags.push('#달콤 처돌이 🍭');
  if (profile.umami >= 4) tags.push('#감칠맛 박사 🍜');
  return tags.length > 0 ? tags : ['#미식 탐험가'];
};
