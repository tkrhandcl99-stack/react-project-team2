import React, { useEffect, useState, useRef } from 'react';
import SearchBar from './SearchBar';
import MapControls from './MapControls';
import PlaceDetailCard from './PlaceDetailCard';

const KakaoMap = ({ externalKeyword }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [keyword, setKeyword] = useState('식당');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        };
        mapRef.current = new window.kakao.maps.Map(container, options);
        setIsLoaded(true);
      }
    };

    const checkInterval = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        initMap();
        clearInterval(checkInterval);
      }
    }, 500);
    return () => clearInterval(checkInterval);
  }, []);
  useEffect(() => {
    if (externalKeyword) {
      setKeyword(externalKeyword);
      setSelectedPlace(null);
    }
  }, [externalKeyword]);

  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;

    const ps = new window.kakao.maps.services.Places();
    const searchOptions = {
      location: mapRef.current.getCenter(),
      radius: 2000,
      size: 15,
    };

    ps.keywordSearch(
      keyword,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          markers.forEach((m) => m.setMap(null));
          const newMarkers = [];
          const bounds = new window.kakao.maps.LatLngBounds();

          data.forEach((place) => {
            const marker = new window.kakao.maps.Marker({
              map: mapRef.current,
              position: new window.kakao.maps.LatLng(place.y, place.x),
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              // [방법 B] 실제 이미지는 영재님이 크롤링해오기 전까지
              // 카테고리 기반 고화질 랜덤 이미지로 대체 (팀장님 시연용)
              const category =
                place.category_group_name === '카페' ? 'cafe' : 'restaurant';
              const randomImg = `https://loremflickr.com/400/400/${category}?lock=${place.id}`;

              setSelectedPlace({ ...place, imageUrl: randomImg });
            });

            newMarkers.push(marker);
            bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
          });

          setMarkers(newMarkers);
          mapRef.current.setBounds(bounds);
        }
      },
      searchOptions,
    );
  }, [keyword, isLoaded]);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.relayout(), 300);
    }
  }, [isExpanded]);

  return (
    <div
      className={`relative transition-all duration-500 shadow-lg overflow-hidden ${
        isExpanded
          ? 'fixed inset-0 z-[999] bg-white'
          : 'w-full h-80 rounded-3xl border-2 border-slate-100'
      }`}
    >
      <MapControls isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <SearchBar
        onSearch={(val) => {
          setKeyword(val);
          setSelectedPlace(null);
        }}
      />
      <PlaceDetailCard
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />

      <div
        id="map"
        style={{
          width: '100%',
          height: '100%',
          minHeight: isExpanded ? '100vh' : '320px',
        }}
      >
        {!isLoaded && (
          <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
            지도를 연결하는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;
