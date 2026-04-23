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

  // 외부 키워드(챗봇 등) 변경 시 지도 이동 및 정보 추출 로직
  useEffect(() => {
    if (externalKeyword && isLoaded && mapRef.current) {
      setKeyword(externalKeyword);

      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(externalKeyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const firstPlace = data[0];
          const moveLatLon = new window.kakao.maps.LatLng(
            firstPlace.y,
            firstPlace.x,
          );
          mapRef.current.panTo(moveLatLon);

          const detailUrl = `https://place.map.kakao.com/${firstPlace.id}`;
          const category =
            firstPlace.category_group_name === '카페' ? 'cafe' : 'restaurant';
          const randomImg = `https://loremflickr.com/400/400/${category}?lock=${firstPlace.id}`;

          // 장소 정보 객체 생성
          const placeInfo = {
            ...firstPlace,
            imageUrl: randomImg,
            detailUrl,
            // 카카오맵 API에서 제공하는 기본 정보 활용 (별점은 크롤링 없이 API에서 제공되지 않으므로 UI에서 안내)
            placeName: firstPlace.place_name,
            score: firstPlace.rating || '4.5', // API에서 평점이 안올 경우 예시 데이터 (실제는 크롤링 권장)
            reviewCount: firstPlace.address_name.length, // 예시로 주소 길이를 리뷰 수처럼 표현 (실제 데이터 연동 필요)
          };

          setSelectedPlace(placeInfo);

          // 챗봇으로 장소 정보 전달
          window.dispatchEvent(
            new CustomEvent('placeDetailFound', { detail: placeInfo }),
          );
        }
      });
    }
  }, [externalKeyword, isLoaded]);

  return (
    <div
      className={`relative transition-all duration-500 shadow-lg overflow-hidden ${isExpanded ? 'fixed inset-0 z-[999] bg-white' : 'w-full h-80 rounded-3xl border-2 border-slate-100'}`}
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
