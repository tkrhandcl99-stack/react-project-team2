import React from 'react';
import { Phone } from 'lucide-react';

const PlaceDetailCard = ({ place, onClose }) => {
  if (!place) return null;

  const handleDetailClick = (e) => {
    e.stopPropagation();

    if (place.place_url) {
      window.open(place.place_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] w-[320px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl pt-3 pb-2 px-3 border border-slate-100 animate-in fade-in zoom-in duration-300">
      {/* X 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm flex items-center justify-center cursor-pointer"
      >
        ✕
      </button>

      <div className="flex gap-3">
        {/* 이미지 */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-100">
          {place.isImageLoading ? (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-bold">
              LOADING
            </div>
          ) : place.imageUrl ? (
            <img
              src={place.imageUrl}
              alt={place.place_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-slate-300 font-bold">IMAGE</span>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-black text-slate-800 truncate">
            {place.place_name}
          </h3>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
            {place.address_name}
          </p>

          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
            <Phone size={10} />
            <span>{place.phone || '연락처 없음'}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDetailClick}
        className="absolute bottom-3 right-3 bg-[#F05A28] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-orange-600 active:scale-95 transition-all cursor-pointer"
      >
        상세보기
      </button>
    </div>
  );
};

export default PlaceDetailCard;
