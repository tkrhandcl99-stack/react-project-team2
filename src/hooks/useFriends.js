import { useState, useEffect, useMemo } from 'react';
import { USER_POOL } from '../data/userPool';

// 친구 추가/삭제/검색 로직 캡슐화 — Friends.jsx에서 분리
const useFriends = (user) => {
  const [myFriends, setMyFriends] = useState([]);
  const [query, setQuery] = useState('');

  const storageKey = user ? `gimibok_friends_${user.uid}` : null;

  // 로그인 시 localStorage에서 불러오기
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      setMyFriends(saved ? JSON.parse(saved) : []);
    }
  }, [storageKey]);

  // 변경 시 localStorage 저장
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(myFriends));
    }
  }, [myFriends, storageKey]);

  const handleAdd = () => {
    const target = query.trim().toUpperCase();
    if (!target) {
      alert('추가할 친구의 고유 ID 또는 닉네임을 입력해주세요.');
      return;
    }

    const foundUser = USER_POOL.find(
      (u) => u.userCode.toUpperCase() === target || u.name === target,
    );

    if (!foundUser) {
      alert('해당 사용자를 찾을 수 없습니다.');
      return;
    }

    if (myFriends.some((f) => f.userCode === foundUser.userCode)) {
      alert('이미 추가된 친구입니다.');
      return;
    }

    const newFriend = {
      ...foundUser,
      id: `manual-${Date.now()}`,
      tasteProfile: {
        spicy: Math.floor(Math.random() * 5) + 1,
        texture: Math.floor(Math.random() * 5) + 1,
        saltiness: Math.floor(Math.random() * 5) + 1,
        sweetness: Math.floor(Math.random() * 5) + 1,
        umami: Math.floor(Math.random() * 5) + 1,
      },
      tags: ['새로운 메이트'],
    };

    setMyFriends((prev) => [newFriend, ...prev]);
    setQuery('');
    alert(`${foundUser.name} 님이 친구 목록에 추가되었습니다!`);
  };

  const handleDelete = (friendId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setMyFriends((prev) => prev.filter((f) => f.id !== friendId));
    }
  };

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myFriends;
    return myFriends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.userCode?.toLowerCase().includes(q),
    );
  }, [myFriends, query]);

  return { filteredFriends, query, setQuery, handleAdd, handleDelete };
};

export default useFriends;
