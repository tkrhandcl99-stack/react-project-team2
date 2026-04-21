import { createContext, useState, useContext } from 'react';

const YumContext = createContext();

export const YumProvider = ({ children }) => {
  // 찜한 맛집 리스트를 담을 전역 상태
  const [favorites, setFavorites] = useState([]);

  // 찜 추가 함수 (C)
  const addFavorite = (shop) => {
    setFavorites((prev) => [...prev, shop]);
  };

  // 찜 삭제 함수 (D)
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((shop) => shop.id !== id));
  };

  return (
    <YumContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </YumContext.Provider>
  );
};

// 다른 곳에서 편하게 쓰기 위한 커스텀 훅
export const useYum = () => useContext(YumContext);
