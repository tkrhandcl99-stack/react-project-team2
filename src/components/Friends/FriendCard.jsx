import React from 'react';
import { Trash2 } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

const FriendCard = ({ friend, onDelete, onViewProfile }) => {
  // byj: 태그별 툴팁 설명
  const tagDescriptions = {
    '#매운맛 고수 🌶️': '스트레스 풀리는 매운맛을 가장 즐겨요 🌶️',
    '#식감 마스터 ✨': '꼬들함과 바삭함 등 입안의 즐거움을 찾아요 ✨',
    '#단짠 천재 🧂': '멈출 수 없는 중독적인 단짠의 조화를 선호해요 🧂',
    '#달콤 처돌이 🍭': '지친 하루를 달래줄 달콤한 디저트에 진심이에요 🍭',
    '#감칠맛 박사 🍜': '재료 본연의 깊고 진한 풍미를 중요하게 생각해요 🍜',
    '#미식 탐험가': '기미복이 인증하는 균형 잡힌 입맛의 소유자입니다',
    '새로운 메이트': '새롭게 추가된 친구입니다!',
    'GIMIBOK 인증': '기미복이 인증하는 균형 잡힌 입맛의 소유자입니다',
    '미식 메이트': '함께 맛집을 탐험할 미식 파트너입니다',
  };

  // byj: tasteProfile 수치 기반 동적 태그 생성
  const getDynamicTasteTags = (profile) => {
    if (!profile) return ['#미식 탐험가'];
    const tags = [];
    if (profile.spicy >= 4) tags.push('#매운맛 고수 🌶️');
    if (profile.texture >= 4) tags.push('#식감 마스터 ✨');
    if (profile.saltiness >= 4) tags.push('#단짠 천재 🧂');
    if (profile.sweetness >= 4) tags.push('#달콤 처돌이 🍭');
    if (profile.umami >= 4) tags.push('#감칠맛 박사 🍜');
    return tags.length > 0 ? tags : ['#미식 탐험가'];
  };

  const dynamicTags = getDynamicTasteTags(friend.tasteProfile);

  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
      {/* 1. 상단 프로필 */}
      <div className="flex items-center gap-4">
        <img
          src={friend.image}
          alt={friend.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-50"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{friend.name}</h3>
          <span className="text-xs text-[#ff5722] font-bold uppercase">
            ID: {friend.userCode}
          </span>
        </div>
      </div>

      {/* 2. 맛 팔레트 */}
      <div className="flex flex-col items-center py-6 bg-[#fcfcfc] rounded-[24px]">
        <span className="text-[10px] tracking-widest font-bold text-slate-300 mb-4 uppercase">
          Taste Palette
        </span>
        <TasteRadar
          profile={friend.tasteProfile}
          size={180}
          showLabels={true}
        />

        {/* byj: 동적 태그 + 툴팁 */}
        <div className="flex flex-wrap justify-center gap-2 mt-5 px-2">
          {dynamicTags.map((tag, index) => {
            const cleanTag = tag.replace('#', '').trim();
            return (
              <div key={index} className="group relative cursor-help">
                <span className="px-1 py-0.5 text-[12px] font-black text-[#F05A28] transition-all duration-200 inline-block group-hover:scale-110">
                  {tag}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40 z-50">
                  <div className="bg-slate-800 text-white text-[9px] p-2 rounded-xl shadow-xl text-center leading-relaxed font-medium">
                    {tagDescriptions[tag] ||
                      tagDescriptions[cleanTag] ||
                      '기미복 유저입니다'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 버튼 */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onViewProfile(friend)}
          className="flex-1 h-12 bg-[#ff5722] text-white text-sm font-bold rounded-2xl shadow-md shadow-orange-100 cursor-pointer active:scale-95 transition-all duration-200"
        >
          프로필 보기
        </button>
        <button
          onClick={() => onDelete(friend.id)}
          className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all rounded-2xl"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
