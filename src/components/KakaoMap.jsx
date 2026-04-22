import React, { useEffect, useState, useRef } from 'react';
import { LocateFixed } from 'lucide-react';
import SearchBar from './SearchBar';
import MapControls from './MapControls';
import PlaceDetailCard from './PlaceDetailCard';

const KakaoMap = ({ externalKeyword = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [keyword, setKeyword] = useState('식당');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const currentLocationCircleRef = useRef(null);

  const fetchPlaceImage = async (place) => {
    try {
      if (!place?.place_url) return null;

      const encodedUrl = encodeURIComponent(place.place_url);
      const response = await fetch(
        `http://localhost:5000/api/get-image?url=${encodedUrl}`,
      );

      if (!response.ok) {
        throw new Error('이미지 요청 실패');
      }

      const data = await response.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error('가게 이미지 불러오기 실패:', error);
      return null;
    }
  };

  const createCurrentLocationMarkerImage = () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 3C12.477 3 8 7.477 8 13c0 7.2 10 18 10 18s10-10.8 10-18C28 7.477 23.523 3 18 3z" fill="#ef4444"/>
          <circle cx="18" cy="13" r="4.5" fill="white"/>
        </g>
      </svg>
    `;

    const imageSrc = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    const imageSize = new window.kakao.maps.Size(36, 36);
    const imageOption = {
      offset: new window.kakao.maps.Point(18, 36),
    };

    return new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  };

  const clearCurrentLocationOverlay = () => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
      currentLocationMarkerRef.current = null;
    }

    if (currentLocationCircleRef.current) {
      currentLocationCircleRef.current.setMap(null);
      currentLocationCircleRef.current = null;
    }
  };

  const renderCurrentLocation = (lat, lng, accuracy = 0) => {
    if (!mapRef.current) return;

    const currentPosition = new window.kakao.maps.LatLng(lat, lng);

    clearCurrentLocationOverlay();

    currentLocationMarkerRef.current = new window.kakao.maps.Marker({
      position: currentPosition,
      image: createCurrentLocationMarkerImage(),
    });

    currentLocationMarkerRef.current.setMap(mapRef.current);

    if (accuracy > 0) {
      currentLocationCircleRef.current = new window.kakao.maps.Circle({
        center: currentPosition,
        radius: Math.min(accuracy, 300),
        strokeWeight: 2,
        strokeColor: '#ef4444',
        strokeOpacity: 0.35,
        strokeStyle: 'solid',
        fillColor: '#ef4444',
        fillOpacity: 0.08,
      });

      currentLocationCircleRef.current.setMap(mapRef.current);
    }

    mapRef.current.setCenter(currentPosition);

    if (accuracy <= 30) {
      mapRef.current.setLevel(2);
    } else if (accuracy <= 80) {
      mapRef.current.setLevel(3);
    } else {
      mapRef.current.setLevel(4);
    }
  };

  const moveToCurrentLocation = () => {
    if (!mapRef.current) return;

    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (firstPosition) => {
        const firstLat = firstPosition.coords.latitude;
        const firstLng = firstPosition.coords.longitude;
        const firstAccuracy = firstPosition.coords.accuracy || 0;

        // 일단 1차 위치 표시
        renderCurrentLocation(firstLat, firstLng, firstAccuracy);

        // 정확도가 충분히 좋으면 그대로 종료
        if (firstAccuracy > 0 && firstAccuracy <= 50) {
          return;
        }

        // 부정확하면 한 번 더 시도
        navigator.geolocation.getCurrentPosition(
          (secondPosition) => {
            const secondLat = secondPosition.coords.latitude;
            const secondLng = secondPosition.coords.longitude;
            const secondAccuracy = secondPosition.coords.accuracy || 0;

            // 2차가 더 정확할 때만 갱신
            if (
              secondAccuracy > 0 &&
              (firstAccuracy === 0 || secondAccuracy < firstAccuracy)
            ) {
              renderCurrentLocation(secondLat, secondLng, secondAccuracy);
            }
          },
          (secondError) => {
            console.error('2차 위치 보정 실패:', secondError);
          },
          {
            enableHighAccuracy: true,
            timeout: 12000,
            maximumAge: 0,
          },
        );
      },
      (error) => {
        console.error('현재 위치 가져오기 실패:', error);
        alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
  };

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
    if (externalKeyword && externalKeyword.trim()) {
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
          markers.forEach((marker) => marker.setMap(null));

          const newMarkers = [];
          const bounds = new window.kakao.maps.LatLngBounds();

          data.forEach((place) => {
            const marker = new window.kakao.maps.Marker({
              map: mapRef.current,
              position: new window.kakao.maps.LatLng(place.y, place.x),
            });

            window.kakao.maps.event.addListener(marker, 'click', async () => {
              setSelectedPlace({
                ...place,
                imageUrl: null,
                isImageLoading: true,
              });

              const imageUrl = await fetchPlaceImage(place);

              setSelectedPlace({
                ...place,
                imageUrl,
                isImageLoading: false,
              });
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

      <button
        onClick={moveToCurrentLocation}
        className="absolute bottom-4 right-4 z-[1002] w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 active:scale-95 transition-all cursor-pointer"
        title="내 위치 찾기"
      >
        <LocateFixed size={20} />
      </button>

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
