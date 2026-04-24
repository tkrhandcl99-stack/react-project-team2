import React, { useState, useEffect, useRef } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FriendCard from '../components/Friends/FriendCard';
import FriendSearchBar from '../components/Friends/FriendSearchBar';
import FloatingActions from '../components/common/FloatingActions';
import { useAuth } from '../contexts/AuthContext';
import useFriends from '../hooks/useFriends';

const Friends = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');
  const inputRef = useRef(null);

  const { filteredFriends, query, setQuery, handleAdd, handleDelete } =
    useFriends(user);

  useEffect(() => {
    if (user && inputRef.current) inputRef.current.focus();
  }, [user]);

  const handleViewProfile = (friend) => {
    navigate(`/friends/${friend.id}`, { state: { friend } });
  };

  // 비로그인 화면
  if (!user) {
    return (
      <div className="h-dvh bg-[#f9f9f9] flex flex-col overflow-hidden">
        <Header loginWithGoogle={loginWithGoogle} navigate={navigate} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#ff5722] mb-6 shadow-sm">
            <UserPlus size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            로그인하시면 회원님만의 고유한
            <br />
            친구 목록을 확인할 수 있습니다.
          </p>
          <button
            onClick={loginWithGoogle}
            className="w-64 py-4 bg-[#ff5722] text-white rounded-2xl font-bold shadow-lg shadow-orange-100"
          >
            구글로 로그인하기
          </button>
        </main>
        <NavigationBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigate={navigate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-900 pb-24">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />
      <main className="max-w-md mx-auto px-5 pt-24 pb-8">
        <FriendSearchBar
          inputRef={inputRef}
          query={query}
          onChange={(e) => setQuery(e.target.value)}
          onAdd={handleAdd}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />

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
      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Friends;
