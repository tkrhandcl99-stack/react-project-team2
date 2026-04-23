import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FriendCard from '../components/Friends/FriendCard';
import FloatingActions from '../components/common/FloatingActions';
import { useAuth } from '../contexts/AuthContext';

// ✅ 시스템 전체 사용자 데이터베이스
const USER_POOL = [
  { name: '김태환', userCode: 'ELENA123', image: 'https://i.pravatar.cc/150?u=1' },
  { name: '이재원', userCode: 'MARCUS99', image: 'https://i.pravatar.cc/150?u=2' },
  { name: '복영재', userCode: 'WZ9S22EM', image: 'https://i.pravatar.cc/150?u=3' },
  { name: '박지민', userCode: 'JIMIN_P', image: 'https://i.pravatar.cc/150?u=4' },
  { name: '최유진', userCode: 'YUJIN_CHOI', image: 'https://i.pravatar.cc/150?u=5' },
  { name: '정민수', userCode: 'MINSOO_K', image: 'https://i.pravatar.cc/150?u=6' },
  { name: '한소희', userCode: 'SOHEE_H', image: 'https://i.pravatar.cc/150?u=7' },
  { name: '강하늘', userCode: 'SKY_KANG', image: 'https://i.pravatar.cc/150?u=8' },
];

const Friends = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const [query, setQuery] = useState('');
  const [myFriends, setMyFriends] = useState([]);
  const inputRef = useRef(null);

  // 1. 로그인한 유저의 UID 기반 고유 시드 생성 함수
  const getSeedFromUid = (uid) => {
    return uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };

  // 2. 초기 고유 친구 목록 생성 로직 (첫 로그인 시 3명 자동 할당)
  const generateFixedFriends = (uid) => {
    const seed = getSeedFromUid(uid);
    const shuffled = [...USER_POOL].sort((a, b) => {
      const hashA = (getSeedFromUid(a.userCode) * seed) % 100;
      const hashB = (getSeedFromUid(b.userCode) * seed) % 100;
      return hashA - hashB;
    });

    return shuffled.slice(0, 3).map((friend, index) => {
      const tasteSeed = seed + index;
      return {
        ...friend,
        id: `friend-${uid}-${index}`,
        tasteProfile: {
          spicy: (tasteSeed % 5) + 1,
          texture: ((tasteSeed * 2) % 5) + 1,
          saltiness: ((tasteSeed * 3) % 5) + 1,
          sweetness: ((tasteSeed * 4) % 5) + 1,
          umami: ((tasteSeed * 5) % 5) + 1,
        },
        tags: ['GIMIBOK 인증', '미식 메이트'],
      };
    });
  };

  useEffect(() => {
    if (user) {
      setMyFriends(generateFixedFriends(user.uid));
      if (inputRef.current) inputRef.current.focus();
    }
  }, [user]);

  // ✅ 3. [핵심] 친구 추가 기능 (ID 또는 닉네임 검색)
  const handleAddFriendById = () => {
    const target = query.trim().toUpperCase();
    if (!target) {
      alert("추가할 친구의 고유 ID 또는 닉네임을 입력해주세요.");
      return;
    }

    // USER_POOL에서 검색
    const foundUser = USER_POOL.find(
      (u) => u.userCode.toUpperCase() === target || u.name === target
    );

    if (!foundUser) {
      alert("해당 사용자를 찾을 수 없습니다.");
      return;
    }

    // 중복 추가 방지
    if (myFriends.some((f) => f.userCode === foundUser.userCode)) {
      alert("이미 추가된 친구입니다.");
      return;
    }

    // 친구 목록에 추가 (맛 데이터는 랜덤 생성)
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
      tags: ['새로 추가됨'],
    };

    setMyFriends((prev) => [newFriend, ...prev]);
    setQuery('');
    alert(`${foundUser.name} 님이 친구 목록에 추가되었습니다!`);
  };

  // 내 친구 목록 내에서 실시간 검색 필터
  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myFriends;
    return myFriends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(q) ||
        friend.userCode?.toLowerCase().includes(q)
    );
  }, [myFriends, query]);

  const handleDelete = (friendId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setMyFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    }
  };

  const handleViewProfile = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
        <Header loginWithGoogle={loginWithGoogle} navigate={navigate} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#ff5722] mb-6 shadow-sm">
            <UserPlus size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            로그인하시면 회원님만의 고유한<br />친구 목록을 확인할 수 있습니다.
          </p>
          <button onClick={loginWithGoogle} className="w-full py-4 bg-[#ff5722] text-white rounded-2xl font-bold shadow-lg shadow-orange-100">
            구글로 로그인하기
          </button>
        </main>
        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-900 pb-24">
      <Header user={user} loginWithGoogle={loginWithGoogle} logout={logout} navigate={navigate} />
      <main className="max-w-md mx-auto px-5 pt-20 pb-8">
        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900">내 친구 목록</h2> 
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="ID 또는 닉네임 입력..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFriendById()} // 엔터키 지원
                  className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff5722] outline-none transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={handleAddFriendById} 
                className="bg-[#ff5722] text-white px-6 rounded-xl font-bold active:scale-95 transition-all shadow-md"
              >
                추가
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <FriendCard 
                key={friend.id} 
                friend={friend} 
                onDelete={() => handleDelete(friend.id)} 
                onViewProfile={() => handleViewProfile(friend)} 
              />
            ))
          ) : (
            <div className="py-20 text-center text-slate-400 text-sm bg-white rounded-3xl border border-dashed border-gray-200">
              친구가 없습니다. 새로운 친구를 추가해보세요!
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