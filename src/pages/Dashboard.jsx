import React, { useEffect, Suspense, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../components/Dashboard/Header';
import ProfileCard from '../components/Dashboard/profileCard';
import RestaurantList from '../components/Dashboard/RestaurantList';
import NavigationBar from '../components/Dashboard/NavigationBar';
import KakaoMap from '../components/KakaoMap';
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatKeyword = params.get('chatKeyword');

    if (chatKeyword) {
      setMapKeyword(chatKeyword);
    }
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
                const sliced = data.slice(0, 6);

                const mapped = await Promise.all(
                  sliced.map(async (place, index) => {
                    const crawledImage = await fetchPlaceImage(place.place_url);

                    return {
                      id: Number(place.id) || index + 1,
                      name: place.place_name,
                      category: place.category_group_name || '맛집',
                      img:
                        crawledImage ||
                        `https://picsum.photos/seed/${place.id || index}/800/500`,
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

                      // 임시 리뷰 데이터
                      reviews: [
                        {
                          rating: 5,
                          content: `${place.place_name}은 전체적으로 깔끔하고 무난하다는 평이 많아요.`,
                        },
                        {
                          rating: 4,
                          content: `${place.place_name}은 메뉴가 괜찮고 식감과 감칠맛이 좋다는 리뷰가 있습니다.`,
                        },
                      ],
                    };
                  }),
                );

                setNearbyRestaurants(mapped);
              } else {
                setNearbyRestaurants([]);
              }

              setIsNearbyLoading(false);
            },
            {
              location: center,
              radius: 5000,
              size: 6,
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            },
          );
        }
      }, 300);
    };

    const fallbackSearch = () => {
      const fallbackLat = 37.5665;
      const fallbackLng = 126.978;

      setCurrentLocation({ lat: fallbackLat, lng: fallbackLng });
      waitForKakaoAndSearch(fallbackLat, fallbackLng);
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
      () => {
        const fallbackLat = 37.5665;
        const fallbackLng = 126.978;

        setCurrentLocation({ lat: fallbackLat, lng: fallbackLng });
        waitForKakaoAndSearch(fallbackLat, fallbackLng);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [fetchPlaceImage]);

  const userProfile = {
    nickname: '미식탐험가',
    level: 'Expert',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24 text-left">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />

      <main className="max-w-md mx-auto p-4 pt-20 space-y-6">
        <ProfileCard
          user={user}
          userProfile={userProfile}
          tasteProfile={tasteProfile}
          onEditTasteProfile={() => navigate('/profile/taste')}
        />

        <AiRecommendationPanel
          nearbyRestaurants={nearbyRestaurants}
          currentLocation={currentLocation}
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
