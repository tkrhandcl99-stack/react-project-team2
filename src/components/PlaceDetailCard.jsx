import React from 'react';

const PlaceDetailCard = ({ place, onClose }) => {
  if (!place) return null;

  return (
    <div
      className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] flex items-center bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-slate-100 animate-in fade-in zoom-in duration-300"
      style={{ width: '340px', height: '80px' }} // 폭을 좁히고 높이도 컴팩트하게 조절
    >
      {/* 식당 이미지 (작게) */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={place.imageUrl}
          alt={place.place_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 정보 영역 */}
      <div className="ml-3 flex-1 flex flex-col justify-center overflow-hidden">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="text-sm font-black text-slate-800 truncate">
            {place.place_name}
          </h3>
          <span className="text-[8px] font-bold text-[#F05A28] bg-orange-50 px-1 py-0.5 rounded flex-shrink-0">
            {place.category_group_name || '맛집'}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 truncate mb-1">
          {place.road_address_name || place.address_name}
        </p>

        <div className="flex items-center justify-between pr-1">
          <span className="text-[9px] text-slate-500">
            {place.phone || '연락처 없음'}
          </span>
          <button
            onClick={() => window.open(place.place_url, '_blank')}
            className="text-[9px] font-extrabold text-[#F05A28] hover:underline"
          >
            상세보기 →
          </button>
        </div>
      </div>

      {/* 우측 상단 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-white text-slate-400 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md border border-slate-50 hover:text-slate-600"
      >
        ✕
      </button>
    </div>
  );
};

export default PlaceDetailCard;
