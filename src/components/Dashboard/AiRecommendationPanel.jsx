import React, { useEffect, useMemo, useState } from 'react';
import { analyzeRestaurants } from '../../api/ai';
import { useTasteProfile } from '../../contexts/TasteProfileContext';

const MAX_DISTANCE_KM = 5;
const MAX_RESULTS = 2;

const toRad = (value) => (value * Math.PI) / 180;

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const AiRecommendationPanel = ({ nearbyRestaurants = [], currentLocation }) => {
  const { tasteProfile } = useTasteProfile();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const restaurantsWithDistance = useMemo(() => {
    if (!currentLocation || nearbyRestaurants.length === 0) return [];

    return nearbyRestaurants.map((restaurant) => {
      const distanceKm = getDistanceKm(
        currentLocation.lat,
        currentLocation.lng,
        restaurant.lat,
        restaurant.lng,
      );

      return {
        ...restaurant,
        distanceKm,
      };
    });
  }, [nearbyRestaurants, currentLocation]);

  const nearbyWithin5km = useMemo(() => {
    return restaurantsWithDistance.filter(
      (restaurant) => restaurant.distanceKm <= MAX_DISTANCE_KM,
    );
  }, [restaurantsWithDistance]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');

        if (!currentLocation) {
          setRestaurants([]);
          return;
        }

        if (nearbyWithin5km.length === 0) {
          setRestaurants([]);
          return;
        }

        // 5km 이내 식당만 분석
        const data = await analyzeRestaurants(nearbyWithin5km, tasteProfile);

        // 그 안에서 일치도 높은 순으로 2개만
        const top2 = data.slice(0, MAX_RESULTS);
        setRestaurants(top2);
      } catch (err) {
        console.error(err);
        setError('AI 추천 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [tasteProfile, nearbyWithin5km, currentLocation]);

  return (
    <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">AI 리뷰 분석 추천</h3>
        <span className="text-xs font-bold text-[#F05A28] bg-orange-50 px-2 py-1 rounded-full">
          Beta
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        내 위치 기준 {MAX_DISTANCE_KM}km 이내 식당 중 입맛 일치도가 높은{' '}
        {MAX_RESULTS}곳 추천
      </p>

      {loading && (
        <div className="text-sm text-slate-500">
          AI가 리뷰를 분석해서 추천 중입니다...
        </div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && restaurants.length === 0 && (
        <div className="text-sm text-slate-500">
          5km 이내에 추천할 식당 데이터가 없습니다.
        </div>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <div className="space-y-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {restaurant.category}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">입맛 일치도</div>
                  <div className="text-lg font-bold text-[#F05A28]">
                    {restaurant.matchScore ?? 0}%
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                거리: {restaurant.distanceKm?.toFixed(2)} km
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-[11px] text-slate-400">일반 평점</div>
                  <div className="font-bold">{restaurant.rawAverageRating}</div>
                </div>

                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-[11px] text-slate-400">
                    신뢰 반영 평점
                  </div>
                  <div className="font-bold text-[#F05A28]">
                    {restaurant.trustedAverageRating}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 text-center">
                  <div className="text-[11px] text-slate-400">
                    의심 리뷰 비율
                  </div>
                  <div className="font-bold">
                    {restaurant.suspiciousReviewRatio}%
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                평균 리뷰 신뢰도:{' '}
                <span className="font-semibold">
                  {restaurant.averageTrustScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AiRecommendationPanel;
