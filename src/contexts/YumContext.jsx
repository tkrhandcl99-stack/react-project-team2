import { createContext, useState, useContext } from 'react';

const YumContext = createContext();

const MAX_HISTORY = 10;

const normalizeRestaurant = (data) => {
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
  return data;
};

export const YumProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [friends, setFriends] = useState([]);

  const addFavorite = (shop) => setFavorites((prev) => [...prev, shop]);
  const removeFavorite = (id) =>
    setFavorites((prev) => prev.filter((shop) => shop.id !== id));

  const addToHistory = (rawData) => {
    const restaurant = normalizeRestaurant(rawData);
    setVisitHistory((prev) => {
      const filtered = prev.filter((r) => r.id !== restaurant.id);
      return [restaurant, ...filtered].slice(0, MAX_HISTORY);
    });
  };

  const addFriend = (newFriend) => setFriends((prev) => [newFriend, ...prev]);

  return (
    <YumContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        visitHistory,
        addToHistory,
        friends,
        setFriends,
        addFriend,
      }}
    >
      {children}
    </YumContext.Provider>
  );
};

export const useYum = () => {
  const context = useContext(YumContext);
  if (!context)
    throw new Error('useYum은 YumProvider 안에서 사용되어야 합니다.');
  return context;
};
