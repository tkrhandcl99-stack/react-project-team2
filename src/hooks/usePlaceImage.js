import { useCallback } from 'react';

// Python Flask 서버 포트 5001로 직접 요청
const usePlaceImage = () => {
  const fetchPlaceImage = useCallback(async (placeUrl) => {
    try {
      if (!placeUrl) return null;

      const encodedUrl = encodeURIComponent(placeUrl);
      const response = await fetch(
        `http://localhost:5001/api/get-image?url=${encodedUrl}`,
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
  }, []);

  return { fetchPlaceImage };
};

export default usePlaceImage;
