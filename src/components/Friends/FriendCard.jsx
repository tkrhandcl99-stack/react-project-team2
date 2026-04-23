import React from 'react';
import { Trash2 } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

const FriendCard = ({ friend, onDelete, onViewProfile }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={friend.image}
          alt={friend.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#ff5722]"
        />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{friend.name}</h3>
          <p className="text-sm text-slate-400 font-medium">
            @{friend.username}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center py-3 bg-gray-50 rounded-xl">
        <span className="text-[12px] tracking-wide font-semibold text-slate-400 mb-2">
          TASTE PALETTE
        </span>

        <TasteRadar
          profile={friend.tasteProfile}
          size={150}
          showLabels={false}
        />

        <div className="flex flex-wrap justify-center gap-2 mt-3 px-2">
          {friend.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-200 text-[11px] font-medium rounded-full text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onViewProfile(friend)}
          className="flex-1 h-10 bg-[#ff5722] text-white text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-transform"
        >
          View Profile
        </button>

        <button
          onClick={() => onDelete(friend.id)}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 text-red-500 rounded-full hover:bg-red-50 active:scale-95 transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default FriendCard;
