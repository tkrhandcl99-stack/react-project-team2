import React from 'react';
import { Heart } from 'lucide-react';

const RestaurantList = ({
  restaurants,
  addFavorite,
  removeFavorite,
  isFavorite,
  navigate,
}) => {
  // 💡 찜 버튼 클릭 시 상태에 따라 추가 또는 삭제를 실행하는 토글 함수
  const handleFavoriteClick = (res) => {
    if (isFavorite(res.id)) {
      // 이미 즐겨찾기에 있다면 삭제
      removeFavorite(res.id);
    } else {
      // 없다면 즐겨찾기에 추가
      addFavorite(res);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold">Recommended Nearby</h3>
        <button
          className="text-xs font-bold text-[#F05A28] cursor-pointer"
          onClick={() => navigate('/favorites')}
        >
          찜 목록 ▶
        </button>
      </div>
      <div className="space-y-6">
        {restaurants.map((res) => (
          <div key={res.id} className="group relative">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
              <img
                src={res.img}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={res.name}
              />
              <div className="absolute top-3 left-3 bg-[#F05A28] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                {res.match}% MATCH
              </div>
            </div>
            <div className="mt-3 flex justify-between items-start">
              <div className="text-left">
                <h4 className="text-lg font-bold group-hover:text-[#F05A28] transition-colors">
                  {res.name}
                </h4>
                <div className="flex gap-2 mt-1">
                  {res.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 💡 onClick 로직을 handleFavoriteClick으로 교체했습니다 */}
              <button
                onClick={() => handleFavoriteClick(res)}
                className="p-2 transition-all active:scale-125 cursor-pointer"
              >
                <Heart
                  size={24}
                  color={isFavorite(res.id) ? '#F05A28' : '#cbd5e1'}
                  fill={isFavorite(res.id) ? '#F05A28' : 'transparent'}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
