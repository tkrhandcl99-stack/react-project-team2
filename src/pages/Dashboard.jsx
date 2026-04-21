// TasteQuest: Premium Main Dashboard (재원 & 태환 완벽 통합본 - 푸터 복구)
import React, { useState, useReducer, Suspense } from 'react';
import { Home, User, Edit2, ChevronUp, LogOut } from 'lucide-react';

// 컴포넌트 Import
import KakaoMap from '../components/KakaoMap';
import AiChatBot from '../components/AiChatBot';

// 로그인 정보 가져오기 (폴더명 s 확인!)
import { useAuth } from '../contexts/AuthContext';

const tasteReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const Dashboard = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const [userProfile] = useReducer(tasteReducer, {
    nickname: '미식탐험가',
    level: 'Expert',
  });

  const [restaurants] = useState([
    {
      id: 1,
      name: '오스테리아 샘킴',
      match: 98,
      tags: ['#생면파스타', '#데이트코스'],
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      name: '스시 코우지',
      match: 92,
      tags: ['#오마카세', '#하이엔드'],
      img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      name: '런던 베이글 뮤지엄',
      match: 87,
      tags: ['#베이커리', '#웨이팅맛집'],
      img: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=800',
    },
  ]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
      {/* 1. 상단 네비게이션 */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Home size={24} className="text-[#F05A28]" />
        </button>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          GIMIBOK
        </h1>
        <div className="flex gap-2 items-center">
          {user ? (
            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
              <img
                src={user.photoURL}
                alt="profile"
                className="w-6 h-6 rounded-full"
              />
              <span className="text-xs font-bold text-slate-700">
                {user.displayName}님
              </span>
              <button
                onClick={logout}
                className="p-1 hover:text-red-500 transition-colors"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="bg-[#F05A28] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-200"
            >
              로그인
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* 2. 프로필 섹션 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <img
                  src={
                    user
                      ? user.photoURL
                      : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-50"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 border border-gray-100">
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#F05A28] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">
                  {user ? 'Expert' : 'Guest'}
                </span>
                <h2 className="text-xl font-bold mt-1">
                  {user ? user.displayName : userProfile.nickname}
                </h2>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Taste Profile
                </h3>
                <span className="text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md">
                  AI Analyzed
                </span>
              </div>
              <div className="aspect-square w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                <span className="text-[10px] text-slate-300 font-medium">
                  Radar Chart View
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 지도 섹션 */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold px-1">주변 맛집 지도</h3>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  지도를 불러오는 중...
                </div>
              }
            >
              <KakaoMap />
            </Suspense>
          </div>
        </section>

        {/* 4. 추천 리스트 */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-1">Recommended Nearby</h3>
          <div className="space-y-6">
            {restaurants.map((res) => (
              <div key={res.id} className="group relative">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={res.img}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    alt={res.name}
                  />
                  <div className="absolute top-3 left-3 bg-[#F05A28] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {res.match}% MATCH
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-left">{res.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {res.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 text-slate-300">
                    <User size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* [복구 완료] 푸터 영역 */}
        <footer className="mt-6 px-2 pb-12 text-[11px] text-slate-400 space-y-2 leading-relaxed border-t border-gray-100 pt-6 text-left">
          <div className="space-y-1">
            <p>
              <span className="font-bold text-slate-500">(주)GIMIBOK</span>
            </p>
            <p>대표 : 김기복 | 팀장 : 이재원</p>
          </div>
          <p className="text-[10px] text-slate-300 pt-1">
            © 2026 GIMIBOK. All rights reserved.
          </p>
        </footer>
      </main>

      {/* 5. 플로팅 액션 영역 */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={scrollToTop}
          className="p-3 bg-white shadow-xl rounded-full text-slate-400 border border-gray-100 cursor-pointer"
        >
          <ChevronUp size={24} />
        </button>
        <AiChatBot />
      </div>

      {/* 6. 하단 고정 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40">
        <div className="flex justify-around items-end px-2 pt-1.5 pb-4 max-w-md mx-auto">
          {/* 홈 버튼 */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                fill={activeTab === 'home' ? '#F05A28' : 'transparent'}
                stroke={activeTab === 'home' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
              />
              <path
                d="M9 21V12h6v9"
                fill={activeTab === 'home' ? '#fff' : 'transparent'}
                stroke={activeTab === 'home' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.4"
              />
            </svg>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'home' ? '#F05A28' : '#94a3b8' }}
            >
              홈
            </span>
            {activeTab === 'home' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          {/* 저장 버튼 */}
          <button
            onClick={() => setActiveTab('save')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 3h14a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z"
                fill={activeTab === 'save' ? '#F05A28' : 'transparent'}
                stroke={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'save' ? '#F05A28' : '#94a3b8' }}
            >
              저장
            </span>
            {activeTab === 'save' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          {/* 마이다이닝 버튼 */}
          <button
            onClick={() => setActiveTab('mydining')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 2v7a4 4 0 01-4 4v9"
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7 2v4M9 2v4"
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 2c0 0 2 2 2 6s-2 6-2 6v8"
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-[10px] font-bold"
              style={{
                color: activeTab === 'mydining' ? '#F05A28' : '#94a3b8',
              }}
            >
              마이다이닝
            </span>
            {activeTab === 'mydining' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          {/* 친구 버튼 */}
          <button
            onClick={() => setActiveTab('friends')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="9"
                cy="7"
                r="3"
                fill={activeTab === 'friends' ? '#F05A28' : 'transparent'}
                stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
              />
              <path
                d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
                stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle
                cx="17"
                cy="7"
                r="2.5"
                fill={activeTab === 'friends' ? '#F05A28' : 'transparent'}
                stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
              />
              <path
                d="M19 14c1.5 0 4 .8 4 3"
                stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'friends' ? '#F05A28' : '#94a3b8' }}
            >
              친구
            </span>
            {activeTab === 'friends' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
