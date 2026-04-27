import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';

const useFriends = (user) => {
  const { findUserById } = useAuth();
  const [myFriends, setMyFriends] = useState([]);
  const [query, setQuery] = useState('');

  const storageKey = user ? `gimibok_friends_${user.id}` : null;

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      setMyFriends(saved ? JSON.parse(saved) : []);
    }
  }, [storageKey]);

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(myFriends));
    }
  }, [myFriends, storageKey]);

  const handleAdd = () => {
    const target = query.trim().toUpperCase();
    if (!target) {
      alert('추가할 친구의 고유 ID를 입력해주세요.');
      return;
    }

    // 자기 자신 추가 방지
    if (user && user.id === target) {
      alert('자기 자신은 추가할 수 없습니다.');
      return;
    }

    // localStorage에서 고유 ID로 유저 검색
    const foundUser = findUserById(target);

    if (!foundUser) {
      alert('해당 ID의 사용자를 찾을 수 없습니다.');
      return;
    }

    if (myFriends.some((f) => f.id === foundUser.id)) {
      alert('이미 추가된 친구입니다.');
      return;
    }

    const newFriend = {
      ...foundUser,
      friendId: `friend-${Date.now()}`,
      tasteProfile: {
        spicy: Math.floor(Math.random() * 5) + 1,
        texture: Math.floor(Math.random() * 5) + 1,
        saltiness: Math.floor(Math.random() * 5) + 1,
        sweetness: Math.floor(Math.random() * 5) + 1,
        umami: Math.floor(Math.random() * 5) + 1,
      },
    };

    setMyFriends((prev) => [newFriend, ...prev]);
    setQuery('');
    alert(`${foundUser.name} 님이 친구 목록에 추가되었습니다!`);
  };

  const handleDelete = (friendId) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setMyFriends((prev) => prev.filter((f) => f.friendId !== friendId));
    }
  };

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myFriends;
    return myFriends.filter(
      (f) =>
        f.name.toLowerCase().includes(q) || f.id?.toLowerCase().includes(q),
    );
  }, [myFriends, query]);

  return { filteredFriends, query, setQuery, handleAdd, handleDelete };
};

export default useFriends;
