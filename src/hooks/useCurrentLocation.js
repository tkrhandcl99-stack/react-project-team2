import { useRef } from 'react';

const useCurrentLocation = (mapRef) => {
  const currentLocationMarkerRef = useRef(null);
  const currentLocationCircleRef = useRef(null);

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

        renderCurrentLocation(firstLat, firstLng, firstAccuracy);

        if (firstAccuracy > 0 && firstAccuracy <= 50) return;

        navigator.geolocation.getCurrentPosition(
          (secondPosition) => {
            const secondLat = secondPosition.coords.latitude;
            const secondLng = secondPosition.coords.longitude;
            const secondAccuracy = secondPosition.coords.accuracy || 0;

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

  return { moveToCurrentLocation };
};

export default useCurrentLocation;
