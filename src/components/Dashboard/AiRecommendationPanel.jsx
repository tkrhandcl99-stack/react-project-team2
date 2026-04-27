import React, { useEffect, useMemo, useRef, useState } from 'react';
import { analyzeRestaurants, crawlAndAnalyze } from '../../api/ai';
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

const AiRecommendationPanel = ({
  nearbyRestaurants = [],
  currentLocation,
  onAnalyzed,
}) => {
  const { tasteProfile } = useTasteProfile();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFallback, setIsFallback] = useState(false);

  // onAnalyzed를 ref로 감싸서 의존성 제외
  const onAnalyzedRef = useRef(onAnalyzed);
  useEffect(() => {
    onAnalyzedRef.current = onAnalyzed;
  }, [onAnalyzed]);

  // 분석 실행 여부를 id 목록으로만 판단 - trustedRating 변경은 무시
  const restaurantIds = useMemo(() => {
    return nearbyRestaurants.map((r) => r.id).join(',');
  }, [nearbyRestaurants.map((r) => r.id).join(',')]); // eslint-disable-line

  const restaurantsWithDistance = useMemo(() => {
    if (!currentLocation || nearbyRestaurants.length === 0) return [];
    return nearbyRestaurants.map((restaurant) => {
      const distanceKm = getDistanceKm(
        currentLocation.lat,
        currentLocation.lng,
        restaurant.lat,
        restaurant.lng,
      );
      return { ...restaurant, distanceKm };
    });
  }, [restaurantIds, currentLocation]); // nearbyRestaurants 대신 id 문자열 사용

  const nearbyWithin5km = useMemo(() => {
    return restaurantsWithDistance.filter(
      (restaurant) => restaurant.distanceKm <= MAX_DISTANCE_KM,
    );
  }, [restaurantsWithDistance]);

  useEffect(() => {
    // 식당 목록이 없거나 위치 없으면 스킵
    if (!currentLocation || restaurantIds === '') return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError('');
        setIsFallback(false);

        let targetRestaurants = nearbyWithin5km;
        let fallback = false;

        if (nearbyWithin5km.length === 0) {
          if (restaurantsWithDistance.length === 0) {
            setRestaurants([]);
            return;
          }
          targetRestaurants = restaurantsWithDistance;
          fallback = true;
        }

        // 각 식당별로 실제 리뷰 크롤링 후 신뢰도 분석 (병렬 처리)
        const data = await Promise.all(
          targetRestaurants.map((restaurant) =>
            crawlAndAnalyze(
              restaurant.placeUrl,
              restaurant.name,
              restaurant.category,
              tasteProfile,
            )
              .then((result) => ({
                ...result,
                id: restaurant.id,
                lat: restaurant.lat,
                lng: restaurant.lng,
                img: restaurant.img,
                placeUrl: restaurant.placeUrl,
                distanceKm: restaurant.distanceKm,
              }))
              .catch(() => ({
                id: restaurant.id,
                name: restaurant.name,
                matchScore: 0,
                trustedAverageRating: null,
                lat: restaurant.lat,
                lng: restaurant.lng,
              })),
          ),
        );

        const sorted = [...data].sort(
          (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0),
        );
        const top2 = sorted.slice(0, MAX_RESULTS);

        setRestaurants(top2);
        setIsFallback(fallback);

        // trustedRating 병합용 - 한 번만 실행됨
        if (onAnalyzedRef.current) onAnalyzedRef.current(data);
      } catch (err) {
        console.error(err);
        setError('AI 추천 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    // restaurantIds(id 문자열)가 바뀔 때만 실행 → trustedRating 병합으로는 재실행 안 됨
  }, [restaurantIds, currentLocation, tasteProfile]);

  return (
    <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">입맛 분석 추천</h3>
      </div>

      <p className="text-xs text-slate-500 mb-4">
        {isFallback
          ? `5km 이내 식당이 없어 주변 식당 중 입맛 일치도가 가장 높은 ${MAX_RESULTS}곳 추천`
          : `내 위치 기준 ${MAX_DISTANCE_KM}km 이내 식당 중 입맛 일치도가 높은 ${MAX_RESULTS}곳 추천`}
      </p>

      {loading && (
        <div className="text-sm text-slate-500">
          내 입맛을 기반으로 맛집을 분석 중입니다...
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
