import { Heart } from 'lucide-react';
import { useYum } from '../../contexts/YumContext';

const RestaurantList = ({
  restaurants,
  isLoading = false,
  addFavorite,
  removeFavorite,
  isFavorite,
  navigate,
}) => {
  const { addToHistory } = useYum();

  const handleHeartClick = (e, restaurant) => {
    e.stopPropagation();

    if (isFavorite(restaurant.id)) {
      removeFavorite(restaurant.id);
    } else {
      addFavorite(restaurant);
    }
  };

  const handleCardClick = (res) => {
    // 마이다이닝 방문 기록에 추가
    addToHistory(res);

    if (res.placeUrl) {
      window.open(res.placeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[32px] font-bold leading-none tracking-tight text-slate-900">
          근처 맛집
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse">
              <div className="w-full h-56 bg-gray-200 rounded-[28px]" />
              <div className="mt-4 h-6 bg-gray-200 rounded w-40" />
              <div className="mt-3 flex gap-2">
                <div className="h-5 bg-gray-200 rounded w-20" />
                <div className="h-5 bg-gray-200 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : restaurants.length > 0 ? (
        <div className="space-y-6">
          {restaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => handleCardClick(res)}
              className="cursor-pointer"
            >
              <div className="relative">
                <img
                  src={res.img}
                  alt={res.name}
                  className="w-full h-56 object-cover rounded-[28px] shadow-sm"
                />

                <div className="absolute top-5 left-4 bg-[#F05A28] text-white text-sm font-black px-4 py-2 rounded-2xl shadow-md">
                  {res.match}% MATCH
                </div>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-[22px] font-black text-slate-900 truncate">
                    {res.name}
                  </h4>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400 font-medium">
                    {res.tags?.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => handleHeartClick(e, res)}
                  className="pt-1 pr-1 cursor-pointer"
                >
                  <Heart
                    size={28}
                    className={
                      isFavorite(res.id)
                        ? 'text-[#F05A28] fill-[#F05A28]'
                        : 'text-slate-300'
                    }
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm">
          <p className="text-slate-500 font-medium">
            근처 맛집을 아직 불러오지 못했어요.
          </p>
        </div>
      )}
    </section>
  );
};

export default RestaurantList;
