import React, { useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Utensils,
  Quote,
  MessageCircle,
  ArrowUp,
} from 'lucide-react';
import TasteRadar from '../components/common/TasteRadar';
import NavigationBar from '../components/Dashboard/NavigationBar';

// byj: tagTranslation 제거 → 동적 태그 설명으로 교체
const tagDescriptions = {
  '#매운맛 고수 🌶️': '스트레스 풀리는 매운맛을 가장 즐겨요 🌶️',
  '#식감 마스터 ✨': '꼬들함과 바삭함 등 입안의 즐거움을 찾아요 ✨',
  '#단짠 천재 🧂': '멈출 수 없는 중독적인 단짠의 조화를 선호해요 🧂',
  '#달콤 처돌이 🍭': '지친 하루를 달래줄 달콤한 디저트에 진심이에요 🍭',
  '#감칠맛 박사 🍜': '재료 본연의 깊고 진한 풍미를 중요하게 생각해요 🍜',
  '#미식 탐험가': '기미복이 인증하는 균형 잡힌 입맛의 소유자입니다',
};

const FriendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const friend = location.state?.friend;

  // byj: 동적 태그 생성 함수 추가
  const getTasteTags = (profile) => {
    if (!profile) return ['#미식 탐험가'];
    const tags = [];
    if (profile.spicy >= 4) tags.push('#매운맛 고수 🌶️');
    if (profile.texture >= 4) tags.push('#식감 마스터 ✨');
    if (profile.saltiness >= 4) tags.push('#단짠 천재 🧂');
    if (profile.sweetness >= 4) tags.push('#달콤 처돌이 🍭');
    if (profile.umami >= 4) tags.push('#감칠맛 박사 🍜');
    return tags.length > 0 ? tags : ['#미식 탐험가'];
  };

  const myTags = useMemo(() => getTasteTags(friend?.tasteProfile), [friend]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { recommendedPlaces, tasteAnalysis } = useMemo(() => {
    if (!friend || !friend.tasteProfile)
      return { recommendedPlaces: [], tasteAnalysis: '' };

    const maxTaste = Object.keys(friend.tasteProfile).reduce((a, b) =>
      friend.tasteProfile[a] > friend.tasteProfile[b] ? a : b,
    );

    const tasteDatabase = {
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

    const selectedData = tasteDatabase[maxTaste] || tasteDatabase.umami;
    return {
      recommendedPlaces: selectedData.recommended,
      tasteAnalysis: selectedData.analysis,
    };
  }, [friend]);

  if (!friend)
    return <div className="p-10 text-center">정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-32 relative">
      <div className="fixed top-2 left-0 right-0 z-50 flex justify-center px-5">
        <div className="w-full max-w-md h-14 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50 rounded-2xl flex items-center justify-between px-2 border border-gray-100">
          <div className="w-10 flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-600"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
          <h1 className="text-[16px] font-bold text-slate-800">친구 프로필</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-md mx-auto pt-20 px-5 space-y-6">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-[#ff5722] mb-4 overflow-hidden shadow-md">
            <img
              src={friend.image}
              alt={friend.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold">{friend.name}</h2>
          <span className="text-[#ff5722] font-semibold text-sm mb-6">
            ID: {friend.userCode}
          </span>

          <div className="w-full py-6 bg-gray-50 rounded-3xl flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-400 mb-4 tracking-widest">
              TASTE PALETTE
            </span>
            <TasteRadar profile={friend.tasteProfile} size={220} />

            {/* byj: 동적 태그 + 툴팁 */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
              {myTags.map((tag) => (
                <div key={tag} className="group relative cursor-help">
                  <span className="px-1 py-0.5 text-[14px] font-black text-[#F05A28] transition-all duration-200 inline-block group-hover:scale-110">
                    {tag}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-50">
                    <div className="bg-slate-800 text-white text-[10px] p-2.5 rounded-xl shadow-xl text-center leading-relaxed font-medium">
                      {tagDescriptions[tag]}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fff9f0] p-6 rounded-2xl border border-[#ffe9cc]">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={18} className="text-[#ff5722] fill-[#ff5722]" />
            <h3 className="font-bold text-slate-800">AI 맛 분석 코멘트</h3>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
            "{tasteAnalysis}"
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2 px-1">
            🤝 <span className="text-[#ff5722]">{friend.name}</span> 님과 같이
            가볼만한 곳
          </h3>
          <div className="grid gap-3">
            {recommendedPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#ff5722] transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                      <Utensils size={14} className="text-[#ff5722]" />
                    </div>
                    <span className="font-bold text-slate-800 text-md">
                      {place.name}
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-bold">
                    {place.category}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 leading-snug">
                  {place.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 flex justify-center">
        <div className="w-full max-w-md relative h-screen">
          <div className="absolute bottom-24 right-5 flex flex-col gap-3 items-center pointer-events-auto">
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-[#ff5722] transition-colors"
            >
              <ArrowUp size={20} />
            </button>
            <button className="w-14 h-14 bg-[#ff5722] rounded-full shadow-xl shadow-orange-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all">
              <MessageCircle size={28} fill="white" />
            </button>
          </div>
        </div>
      </div>

      <NavigationBar activeTab="friends" navigate={navigate} />
    </div>
  );
};

export default FriendDetail;
