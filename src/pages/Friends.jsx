import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FriendCard from '../components/Friends/FriendCard';
import FloatingActions from '../components/common/FloatingActions';
import { useAuth } from '../contexts/AuthContext';

const USER_POOL = [
  { name: '김태환', userCode: 'ELENA123', image: 'https://i.pravatar.cc/150?u=1' },
  { name: '이재원', userCode: 'MARCUS99', image: 'https://i.pravatar.cc/150?u=2' },
  { name: '이가인', userCode: 'WZ9S22EM', image: 'https://i.pravatar.cc/150?u=3' },
  { name: '황용현', userCode: 'JIMIN_P', image: 'https://i.pravatar.cc/150?u=4' },
  { name: '김지희', userCode: 'YUJIN_CHOI', image: 'https://i.pravatar.cc/150?u=5' },
  { name: '전시현', userCode: 'MINSOO_K', image: 'https://i.pravatar.cc/150?u=6' },
  { name: '권용익', userCode: 'SOHEE_H', image: 'https://i.pravatar.cc/150?u=7' },
  { name: '양정훈', userCode: 'SKY_KANG', image: 'https://i.pravatar.cc/150?u=8' },
  { name: '윤승진', userCode: 'SEOJUN_V', image: 'https://i.pravatar.cc/150?u=9' },
  { name: '이민주', userCode: 'YURI_STORY', image: 'https://i.pravatar.cc/150?u=10' },
  { name: '임대한', userCode: 'JIMIN_ALICE', image: 'https://i.pravatar.cc/150?u=11' },
  { name: '복영재', userCode: 'WOOSUNG_W', image: 'https://i.pravatar.cc/150?u=12' },
];

const Friends = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [query, setQuery] = useState('');
  const [myFriends, setMyFriends] = useState([]);
  const inputRef = useRef(null);

  // ✅ 1. 로그인한 사용자의 UID에 따른 고유 저장 키 생성
  const storageKey = user ? `gimibok_friends_${user.uid}` : null;

  // ✅ 2. 사용자가 바뀔 때마다 해당 사용자의 친구 목록을 로드
  useEffect(() => {
    if (storageKey) {
      const savedFriends = localStorage.getItem(storageKey);
      setMyFriends(savedFriends ? JSON.parse(savedFriends) : []);
    }
  }, [storageKey]);

  // ✅ 3. 친구 목록이 변경될 때마다 해당 사용자의 키로 저장
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(myFriends));
    }
  }, [myFriends, storageKey]);

  useEffect(() => {
    if (user && inputRef.current) {
      inputRef.current.focus();
    }
  }, [user]);

  const handleAddFriend = () => {
    const target = query.trim().toUpperCase();
    if (!target) {
      alert("고유 ID 또는 이름을 입력하세요.");
      return;
    }

    const foundUser = USER_POOL.find(
      (u) => u.userCode.toUpperCase() === target || u.name === target
    );

    if (!foundUser) {
      alert("해당 정보를 가진 사용자를 찾을 수 없습니다.");
      return;
    }

    if (myFriends.some((f) => f.userCode === foundUser.userCode)) {
      alert("이미 목록에 있는 사용자입니다.");
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
    alert(`${foundUser.name} 님이 추가되었습니다!`);
  };

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myFriends;
    return myFriends.filter(
      (f) => f.name.includes(q) || f.userCode?.toLowerCase().includes(q)
    );
  }, [myFriends, query]);

  const handleDelete = (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setMyFriends((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleViewProfile = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  if (!user) return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-6">로그인이 필요합니다.</h2>
      <button onClick={loginWithGoogle} className="w-full max-w-xs py-4 bg-[#ff5722] text-white rounded-2xl font-bold shadow-lg shadow-orange-100 transition-all active:scale-95">
        구글 로그인
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-900 pb-24">
      <Header user={user} loginWithGoogle={loginWithGoogle} logout={logout} navigate={navigate} />
      
      <main className="max-w-md mx-auto px-5 pt-24 pb-8">
        <section className="mb-10 text-center"> 
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">친구 목록</h2> 
          
          <div className="flex flex-col gap-3 items-center w-full">
            <div className="relative w-full shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="고유 ID 또는 이름을 입력하세요." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                className="w-full h-13 pl-11 pr-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#ff5722] outline-none transition-all placeholder:text-slate-300 text-sm"
              />
            </div>
            <button 
              onClick={handleAddFriend}
              className="w-full h-12 bg-[#ff5722] text-white rounded-xl font-bold active:scale-[0.98] transition-all shadow-md shadow-orange-100 text-sm"
            >
              추가
            </button>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-bold text-slate-400">내 친구 ({myFriends.length})</h3>
          </div>
          
          {filteredFriends.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredFriends.map((friend) => (
                <FriendCard 
                  key={friend.id} 
                  friend={friend} 
                  onDelete={() => handleDelete(friend.id)} 
                  onViewProfile={() => handleViewProfile(friend)} 
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-sm bg-white rounded-[32px] border border-dashed border-gray-200">
              등록된 친구가 없습니다.
            </div>
          )}
        </section>
      </main>

      <FloatingActions />
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
    </div>
  );
};

export default Friends;