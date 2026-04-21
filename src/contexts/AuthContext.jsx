import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase'; // 아까 만든 firebase.js에서 가져옴
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // AuthContext.jsx 안의 loginWithGoogle 함수
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    // 이 한 줄을 추가하면 항상 "어떤 계정으로 로그인할까요?" 창이 뜹니다.
    provider.setCustomParameters({
      prompt: 'select_account',
    });

    return signInWithPopup(auth, provider);
  };

  // 로그아웃 함수
  const logout = () => signOut(auth);

  // 로그인 상태 감시 (로그인했는지 안했는지 계속 체크)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
