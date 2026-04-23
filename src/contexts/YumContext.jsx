import { createContext, useState, useContext } from 'react';

const YumContext = createContext();

const MAX_HISTORY = 10;

// 카카오 place 데이터와 RestaurantList 데이터 형식을 통일
const normalizeRestaurant = (data) => {
  // 카카오맵 마커 클릭 시 오는 데이터 (place_name, place_url 등)
  if (data.place_name) {
    return {
      id: data.id || data.place_name,
      name: data.place_name,
      img: data.imageUrl || `https://picsum.photos/seed/${data.id}/800/500`,
      tags: [
        `#${data.category_group_name || '맛집'}`,
        `#${(data.road_address_name || data.address_name || '근처')
          .split(' ')
          .slice(0, 2)
          .join('')}`,
      ],
      address: data.road_address_name || data.address_name,
      phone: data.phone,
      placeUrl: data.place_url,
      match: null,
    };
  }

  // RestaurantList 카드 클릭 시 오는 데이터 (이미 정규화된 형태)
  return data;
};

export const YumProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);

  // 찜 추가
  const addFavorite = (shop) => {
    setFavorites((prev) => [...prev, shop]);
  };

  // 찜 삭제
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((shop) => shop.id !== id));
  };

  // 방문 기록 추가 (최대 10개, 중복 시 맨 앞으로, 넘으면 오래된 것 제거)
  const addToHistory = (rawData) => {
    const restaurant = normalizeRestaurant(rawData);

    setVisitHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== restaurant.id);
      const updated = [restaurant, ...filtered];
      return updated.slice(0, MAX_HISTORY);
    });
  };

  return (
    <YumContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        visitHistory,
        addToHistory,
      }}
    >
      {children}
    </YumContext.Provider>
  );
};

export const useYum = () => useContext(YumContext);
