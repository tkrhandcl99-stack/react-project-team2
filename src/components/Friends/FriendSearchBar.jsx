import React from 'react';
import { Search } from 'lucide-react';

// 친구 검색/추가 입력창 — Friends.jsx에서 분리
const FriendSearchBar = ({ inputRef, query, onChange, onAdd, onKeyDown }) => {
  return (
    <section className="mb-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">내 친구 목록</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="고유 ID 입력..."
              value={query}
              onChange={onChange}
              onKeyDown={onKeyDown}
              className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff5722] outline-none transition-all shadow-sm"
            />
          </div>
          <button
            onClick={onAdd}
            className="bg-[#ff5722] text-white px-6 rounded-xl font-bold active:scale-95 transition-all shadow-md"
          >
            추가
          </button>
        </div>
      </div>
    </section>
  );
};

export default FriendSearchBar;
