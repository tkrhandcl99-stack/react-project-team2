import { Heart, Star } from 'lucide-react';
import { useYum } from '../../contexts/YumContext';
import { useState, useRef, useCallback } from 'react';

const ITEMS_PER_PAGE = 3;

const RestaurantList = ({
  restaurants,
  isLoading = false,
  addFavorite,
  removeFavorite,
  isFavorite,
  navigate,
}) => {
  const { addToHistory } = useYum();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerRef = useRef(null);

  // IntersectionObserver로 스크롤 끝 감지
  const lastCardRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisibleCount((prev) =>
              Math.min(prev + ITEMS_PER_PAGE, restaurants.length),
            );
          }
        },
        { threshold: 0.5 },
      );
      if (node) observerRef.current.observe(node);
    },
    [restaurants.length],
  );

  const handleHeartClick = (e, restaurant) => {
    e.stopPropagation();
    if (isFavorite(restaurant.id)) {
      removeFavorite(restaurant.id);
    } else {
      addFavorite(restaurant);
    }
  };

  const handleCardClick = (res) => {
    addToHistory(res);
    if (res.placeUrl) {
      const a = document.createElement('a');
      a.href = res.placeUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const visibleRestaurants = restaurants.slice(0, visibleCount);
  const hasMore = visibleCount < restaurants.length;

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[32px] font-bold leading-none tracking-tight text-slate-900">
          근처 맛집
        </h3>
        {!isLoading && restaurants.length > 0 && (
          <span className="text-xs text-slate-400 font-medium">
            {visibleCount} / {restaurants.length}
          </span>
        )}
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
          {visibleRestaurants.map((res, index) => {
            const isLast = index === visibleRestaurants.length - 1;
            return (
              <div
                key={res.id}
                ref={isLast ? lastCardRef : null}
                onClick={() => handleCardClick(res)}
                className="cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={res.img}
                    alt={res.name}
                    className="w-full h-56 object-cover rounded-[28px] shadow-sm"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[22px] font-black text-slate-900 truncate">
                      {res.name}
                    </h4>

                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      {res.trustedRating != null ? (
                        <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
                          <Star
                            size={12}
                            className="text-[#F05A28] fill-[#F05A28]"
                          />
                          <span className="text-xs font-black text-[#F05A28]">
                            {res.trustedRating.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            신뢰반영
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-full animate-pulse">
                          <Star
                            size={12}
                            className="text-gray-300 fill-gray-300"
                          />
                          <span className="text-xs font-black text-gray-300">
                            -.-
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm text-slate-400 font-medium">
                        {res.tags?.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleHeartClick(e, res)}
                    className="pt-1 pr-1 cursor-pointer flex-shrink-0"
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
            );
          })}

          {/* 로딩 인디케이터 */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <div className="flex gap-1.5">
                <div
                  className="w-2 h-2 bg-[#F05A28] rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-[#F05A28] rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-[#F05A28] rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          )}
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
