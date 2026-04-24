import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'yumpick_users';
const CURRENT_USER_KEY = 'yumpick_current_user';

// 고유 ID 생성 (8자리 대문자+숫자)
const generateUniqueId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
};

// 전체 유저 목록 가져오기
const getUsers = () => {
  const saved = localStorage.getItem(USERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

// 전체 유저 목록 저장
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 로그인 상태 복원
  useEffect(() => {
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentId) {
      const users = getUsers();
      const found = users.find((u) => u.id === currentId);
      if (found) setUser(found);
    }
    setLoading(false);
  }, []);

  // 회원가입
  const register = (name, password) => {
    const users = getUsers();

    // 이름 중복 체크
    if (users.some((u) => u.name === name)) {
      return { success: false, message: '이미 사용 중인 닉네임입니다.' };
    }

    // 고유 ID 생성 (중복 없게)
    let uniqueId;
    do {
      uniqueId = generateUniqueId();
    } while (users.some((u) => u.id === uniqueId));

    const newUser = {
      id: uniqueId,
      name,
      password,
      photoURL: `https://api.dicebear.com/7.x/thumbs/svg?seed=${uniqueId}`,
      createdAt: Date.now(),
    };

    saveUsers([...users, newUser]);
    localStorage.setItem(CURRENT_USER_KEY, uniqueId);
    setUser(newUser);

    return { success: true, user: newUser };
  };

  // 로그인
  const login = (name, password) => {
    const users = getUsers();
    const found = users.find((u) => u.name === name && u.password === password);

    if (!found) {
      return { success: false, message: '닉네임 또는 비밀번호가 틀렸습니다.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, found.id);
    setUser(found);
    return { success: true, user: found };
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
  };

  // 고유 ID로 유저 검색 (친구 추가용)
  const findUserById = (uniqueId) => {
    const users = getUsers();
    return users.find((u) => u.id === uniqueId.toUpperCase()) || null;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, findUserById }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth는 AuthProvider 안에서 사용해야 합니다.');
  return context;
};
