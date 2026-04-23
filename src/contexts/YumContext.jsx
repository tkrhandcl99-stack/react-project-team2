import React, { createContext, useState, useContext } from 'react';

// 1. 컨텍스트 생성 (이게 누락되면 에러가 납니다)
const YumContext = createContext();

export const YumProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [friends, setFriends] = useState([]);

  const addFavorite = (shop) => {
    setFavorites((prev) => [...prev, shop]);
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((shop) => shop.id !== id));
  };

  const addFriend = (newFriend) => {
    setFriends((prev) => [newFriend, ...prev]);
  };

  return (
    <YumContext.Provider 
      value={{ 
        favorites, 
        addFavorite, 
        removeFavorite, 
        friends, 
        setFriends, 
        addFriend 
      }}
    >
      {children}
    </YumContext.Provider>
  );
};

// 2. 커스텀 훅 export (Dashboard.jsx 등에서 useYum을 쓸 수 있게 해줍니다)
export const useYum = () => {
  const context = useContext(YumContext);
  if (!context) {
    throw new Error('useYum은 YumProvider 안에서 사용되어야 합니다.');
  }
  return context;
};