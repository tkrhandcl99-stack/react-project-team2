import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인 후 지도 생성
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 시청 중심
      level: 3,
    };
    new window.kakao.maps.Map(container, options);
  }, []);

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
};

export default KakaoMap;
