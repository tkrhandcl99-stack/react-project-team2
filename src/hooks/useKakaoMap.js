import { useEffect, useRef, useState } from 'react';

const useKakaoMap = (isExpanded) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('map');
        if (!container) return;

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
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.relayout();
      }, 300);
    }
  }, [isExpanded]);

  return { mapRef, isLoaded };
};

export default useKakaoMap;
