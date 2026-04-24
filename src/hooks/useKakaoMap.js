import { useEffect, useRef, useState } from 'react';

const useKakaoMap = (isExpanded) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (!window.kakao?.maps) return;
      clearInterval(checkInterval);

      const container = document.getElementById('map');
      if (!container) return;

      const initMap = (lat, lng) => {
        mapRef.current = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3,
        });

        // 내 위치 마커 표시
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.25)"/></filter></defs><g filter="url(#shadow)"><path d="M18 3C12.477 3 8 7.477 8 13c0 7.2 10 18 10 18s10-10.8 10-18C28 7.477 23.523 3 18 3z" fill="#ef4444"/><circle cx="18" cy="13" r="4.5" fill="white"/></g></svg>`;
        const markerImage = new window.kakao.maps.MarkerImage(
          `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
          new window.kakao.maps.Size(36, 36),
          { offset: new window.kakao.maps.Point(18, 36) },
        );

        new window.kakao.maps.Marker({
          map: mapRef.current,
          position: new window.kakao.maps.LatLng(lat, lng),
          image: markerImage,
        });

        setIsLoaded(true);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => initMap(pos.coords.latitude, pos.coords.longitude),
          () => initMap(37.5665, 126.978),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        );
      } else {
        initMap(37.5665, 126.978);
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.relayout(), 300);
    }
  }, [isExpanded]);

  return { mapRef, isLoaded };
};

export default useKakaoMap;
