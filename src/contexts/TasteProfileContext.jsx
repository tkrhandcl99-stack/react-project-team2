import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const TasteProfileContext = createContext();

const STORAGE_KEY = 'taste-profile';

const defaultTasteProfile = {
  spicy: 3,
  texture: 3,
  saltiness: 3,
  sweetness: 3,
  umami: 3,
};

export const TasteProfileProvider = ({ children }) => {
  const [tasteProfile, setTasteProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultTasteProfile;

    try {
      return { ...defaultTasteProfile, ...JSON.parse(saved) };
    } catch (error) {
      console.error('taste profile parse error:', error);
      return defaultTasteProfile;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasteProfile));
  }, [tasteProfile]);

  const updateTasteProfile = (nextProfile) => {
    setTasteProfile((prev) => ({
      ...prev,
      ...nextProfile,
    }));
  };

  const resetTasteProfile = () => {
    setTasteProfile(defaultTasteProfile);
  };

  const value = useMemo(
    () => ({
      tasteProfile,
      updateTasteProfile,
      resetTasteProfile,
      defaultTasteProfile,
    }),
    [tasteProfile],
  );

  return (
    <TasteProfileContext.Provider value={value}>
      {children}
    </TasteProfileContext.Provider>
  );
};

export const useTasteProfile = () => useContext(TasteProfileContext);
