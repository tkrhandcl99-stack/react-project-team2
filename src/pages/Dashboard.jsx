import React, { useEffect, Suspense, useState, useCallback, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const KakaoMap = lazy(() => import('../components/KakaoMap'));
import Header from '../components/Dashboard/Header';
import ProfileCard from '../components/Dashboard/profileCard';
import RestaurantList from '../components/Dashboard/RestaurantList';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FloatingActions from '../components/common/FloatingActions';
import AiRecommendationPanel from '../components/Dashboard/AiRecommendationPanel';

import { useAuth } from '../contexts/AuthContext';
import { useYum } from '../contexts/YumContext';
import { useTasteProfile } from '../contexts/TasteProfileContext';
import usePlaceImage from '../hooks/usePlaceImage';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loginWithGoogle, logout } = useAuth();
  const { addFavorite, removeFavorite, favorites } = useYum();
  const { tasteProfile } = useTasteProfile();
  const { fetchPlaceImage } = usePlaceImage();

  const [activeTab, setActiveTab] = useState('home');
  const [mapKeyword, setMapKeyword] = useState('');
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [isNearbyLoading, setIsNearbyLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  const userProfile = {
    nickname: user?.displayName || '미식탐험가',
    level: 'Expert',
    userCode: user?.uid?.slice(0, 8).toUpperCase() || 'GUEST_01',
  };

  const handleAnalyzed = useCallback((analyzedList) => {
    if (!analyzedList || analyzedList.length === 0) return;
    setNearbyRestaurants((prev) =>
      prev.map((restaurant) => {
        const matched = analyzedList.find((a) => a.id === restaurant.id);
        if (!matched) return restaurant;
        return {
          ...restaurant,
          trustedRating: matched.trustedAverageRating ?? null,
          suspiciousRatio: matched.suspiciousReviewRatio ?? null,
        };
      }),
    );
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatKeyword = params.get('chatKeyword');
    if (chatKeyword) setMapKeyword(chatKeyword);
  }, [location.search]);

  useEffect(() => {
    const waitForKakaoAndSearch = (latitude, longitude) => {
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
          clearInterval(checkInterval);

          const ps = new window.kakao.maps.services.Places();
          const center = new window.kakao.maps.LatLng(latitude, longitude);

          ps.keywordSearch(
            '맛집',
            async (data, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const sliced = data.slice(0, 15);

                // ✅ 1단계: 이미지 없이 즉시 식당 목록 표시 (빠름)
                const initial = sliced.map((place, index) => ({
                  id: Number(place.id) || index + 1,
                  name: place.place_name,
                  category: place.category_group_name || '맛집',
                  img: `https://picsum.photos/seed/${place.id || index}/800/500`,
                  tags: [
                    `#${place.category_group_name || '맛집'}`,
                    `#${(
                      place.road_address_name ||
                      place.address_name ||
                      '근처'
                    )
                      .split(' ')
                      .slice(0, 2)
                      .join('')}`,
                  ],
                  address: place.road_address_name || place.address_name,
                  phone: place.phone,
                  placeUrl: place.place_url,
                  match: Math.max(80, 98 - index * 3),
                  lat: Number(place.y),
                  lng: Number(place.x),
                  trustedRating: null,
                  reviews: [],
                }));

                setNearbyRestaurants(initial);
                setIsNearbyLoading(false);

                // ✅ 2단계: 백그라운드에서 이미지 크롤링 후 업데이트
                sliced.forEach(async (place, index) => {
                  try {
                    const crawledImage = await fetchPlaceImage(place.place_url);
                    if (crawledImage) {
                      setNearbyRestaurants((prev) =>
                        prev.map((r) =>
                          r.id === (Number(place.id) || index + 1)
                            ? { ...r, img: crawledImage }
                            : r,
                        ),
                      );
                    }
                  } catch (e) {
                    // 이미지 크롤링 실패해도 기본 이미지 유지
                  }
                });
              } else {
                setNearbyRestaurants([]);
                setIsNearbyLoading(false);
              }
            },
            {
              location: center,
              radius: 5000,
              size: 15,
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            },
          );
        }
      }, 300);
    };

    const fallbackSearch = () => {
      const lat = 37.5665;
      const lng = 126.978;
      setCurrentLocation({ lat, lng });
      waitForKakaoAndSearch(lat, lng);
    };

    if (!navigator.geolocation) {
      fallbackSearch();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentLocation({ lat, lng });
        waitForKakaoAndSearch(lat, lng);
      },
      () => fallbackSearch(),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  }, [fetchPlaceImage]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24 text-left">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />

      {/* pt-24: 플로팅 헤더(h-16) + top-4 여백 고려 */}
      <main className="max-w-md mx-auto p-4 pt-24 space-y-6">
        <ProfileCard
          user={user}
          userProfile={userProfile}
          tasteProfile={tasteProfile}
          onEditTasteProfile={() => navigate('/profile/taste')}
        />

        <AiRecommendationPanel
          nearbyRestaurants={nearbyRestaurants}
          currentLocation={currentLocation}
          onAnalyzed={handleAnalyzed}
        />

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">주변 맛집 지도</h3>
          </div>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs">
                  지도를 불러오는 중...
                </div>
              }
            >
              <KakaoMap externalKeyword={mapKeyword} />
            </Suspense>
          </div>
        </section>

        <RestaurantList
          restaurants={nearbyRestaurants}
          isLoading={isNearbyLoading}
          addFavorite={addFavorite}
          removeFavorite={removeFavorite}
          isFavorite={(id) => favorites.some((f) => f.id === id)}
          navigate={navigate}
        />
      </main>

      <FloatingActions onKeyword={setMapKeyword} />

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Dashboard;
