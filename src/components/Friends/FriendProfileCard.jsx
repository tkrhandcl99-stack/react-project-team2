import React from 'react';
import TasteRadar from '../common/TasteRadar';
import { tagDescriptions } from '../../data/tasteDatabase';

const FriendProfileCard = ({ friend, tags }) => {
  const getAvatarColor = (name) => {
    const hue = ((name?.charCodeAt(0) || 0) * 37) % 360;
    return `hsl(${hue}, 60%, 65%)`;
  };

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
      {/* 프로필 이미지 */}
      <div className="w-24 h-24 rounded-full border-4 border-[#ff5722] mb-4 overflow-hidden shadow-md">
        {friend.image ? (
          <img
            src={friend.image}
            alt={friend.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white text-3xl font-black"
            style={{ background: getAvatarColor(friend.name) }}
          >
            {friend.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-bold">{friend.name}</h2>
      <span className="text-[#ff5722] font-semibold text-sm mb-6">
        ID: {friend.userCode || friend.id}
      </span>

      {/* 레이더 차트 + 태그 */}
      <div className="w-full py-6 bg-gray-50 rounded-3xl flex flex-col items-center">
        <span className="text-[11px] font-bold text-slate-400 mb-4 tracking-widest">
          TASTE PALETTE
        </span>
        <TasteRadar profile={friend.tasteProfile} size={220} />

        <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
          {tags.map((tag) => (
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
  );
};

export default FriendProfileCard;
