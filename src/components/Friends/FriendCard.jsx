import React from 'react';
import { Trash2 } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

// 영문 태그를 한글로 변환해주는 매핑 객체
const tagTranslation = {
  'Umami Expert': '감칠맛 전문가',
  'Spicy Hunter': '매운맛 사냥꾼',
  'Sweet Tooth': '단맛 매니아',
  'Pastry Critic': '디저트 비평가',
  'Salty Snack Hero': '짠맛 히어로',
  'Wine Taster': '와인 소믈리에',
};

const FriendCard = ({ friend, onDelete, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col gap-4">
      
      {/* 1. 상단 프로필 정보 (ID만 남기고 골뱅이 제거) */}
      <div className="flex items-center gap-4">
        <img
          src={friend.image}
          alt={friend.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#ff5722]"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{friend.name}</h3>
          <div className="flex flex-col">
            {/* 고유 ID 표시 (기존의 @ 표시 부분 삭제) */}
            <span className="text-xs text-[#ff5722] font-bold">ID: {friend.userCode}</span>
          </div>
        </div>
      </div>

      {/* 2. 중앙 맛 팔레트 (글씨가 보이도록 showLabels 수정) */}
      <div className="flex flex-col items-center py-5 bg-gray-50 rounded-xl">
        <span className="text-[12px] tracking-wide font-bold text-slate-400 mb-4">
          맛 팔레트
        </span>

        {/* showLabels를 true로 변경하고, 
          글자가 잘리지 않도록 size를 소폭 조정했습니다.
        */}
        <TasteRadar
          profile={friend.tasteProfile}
          size={180}
          showLabels={true}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
          {friend.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-white border border-gray-200 text-[11px] font-medium rounded-full text-slate-600 shadow-sm"
            >
              {tagTranslation[tag] || tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. 하단 버튼 섹션 */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onViewProfile(friend)}
          className="flex-1 h-12 bg-[#ff5722] text-white text-sm font-bold rounded-xl shadow-sm 
                   cursor-pointer hover:scale-105 active:scale-95 transition-all duration-200"
        >
          프로필 보기
        </button>
        <button
          onClick={() => onDelete(friend.id)}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 text-slate-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all rounded-full"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FriendCard;