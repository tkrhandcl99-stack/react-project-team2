import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { useYum } from '../contexts/YumContext';
import { crawlAndAnalyze } from '../api/ai';
import { useTasteProfile } from '../contexts/TasteProfileContext';

const PlaceDetailCard = ({ place, onClose }) => {
  const { addToHistory, updateHistoryRating } = useYum();
  const { tasteProfile } = useTasteProfile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!place) return null;

  const handleDetailClick = (e) => {
    e.stopPropagation();

    // ✅ 1단계: 카카오맵 페이지 즉시 열기 (기다리지 않음)
    if (place.place_url) {
      const a = document.createElement('a');
      a.href = place.place_url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // ✅ 2단계: 마이다이닝에 일단 저장 (trustedRating 없이)
    addToHistory({
      ...place,
      imageUrl: place.imageUrl || null,
      trustedRating: null,
    });

    // ✅ 3단계: AI 분석은 백그라운드에서 진행 → 완료되면 rating 업데이트
    setIsAnalyzing(true);
    crawlAndAnalyze(
      place.place_url,
      place.place_name,
      place.category_group_name || '맛집',
      tasteProfile,
    )
      .then((result) => {
        const trustedRating = result?.trustedAverageRating ?? null;
        if (trustedRating !== null) {
          updateHistoryRating(place.id || place.place_name, trustedRating);
        }
      })
      .catch((err) => console.error('AI 분석 실패:', err))
      .finally(() => setIsAnalyzing(false));
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] w-[320px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl pt-3 pb-2 px-3 border border-slate-100 animate-in fade-in zoom-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 shadow-sm flex items-center justify-center cursor-pointer"
      >
        ✕
      </button>

      <div className="flex gap-3">
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
        {isAnalyzing ? '분석중...' : '상세보기'}
      </button>
    </div>
  );
};

export default PlaceDetailCard;
