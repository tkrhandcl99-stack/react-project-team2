//   TasteQuest: Premium Main Dashboard (GIMIBOK)
//   React + Tailwind CSS
//   Features: Profile, Taste Radar Chart, Map API Integration, AI Recommendation List

import React, { useState, useReducer, Suspense, lazy } from 'react';
<<<<<<< HEAD
import AiChatBot from '../components/AiChatBot'; //추가 부분
=======
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
import {
  Home,
  Search,
  User,
  MapPin,
  Edit2,
<<<<<<< HEAD
=======
  MessageCircle,
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
  ChevronUp,
  LogIn,
  UserPlus,
} from 'lucide-react';

// Lazy load Map component for performance optimization (Code Splitting)
<<<<<<< HEAD
// const KakaoMap = lazy(() => import('../components/KakaoMap'));
=======
const KakaoMap = lazy(() => import('../components/KakaoMap'));
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9

// Reducer for complex state management (Taste Profile)
const tasteReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROFILE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const Dashboard = () => {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('home'); //추가 부분
=======
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
  const [userProfile, dispatch] = useReducer(tasteReducer, {
    nickname: '미식탐험가',
    level: 'Expert',
    spicy: 3,
    sweet: 4,
    savory: 5,
    sour: 2,
    crunchy: 4,
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
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
=======
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-20">
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 h-16 flex items-center justify-between shadow-sm">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Home size={24} className="text-[#F05A28]" />
        </button>
        <h1 className="text-2xl font-black tracking-tighter text-slate-900">
          GIMIBOK
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900">
            회원가입
          </button>
          <button className="flex items-center gap-1 bg-[#F05A28] text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all">
            로그인
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Profile & Taste Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-50"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 hover:text-[#F05A28] transition-colors border border-gray-100">
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-[#F05A28] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">
                  Expert
                </span>
                <h2 className="text-xl font-bold mt-1">
                  {userProfile.nickname}
                </h2>
              </div>
            </div>

            {/* Radar Chart Placeholder (Implementation via Canvas/SVG) */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full"></span>
                  Taste Profile
                </h3>
                <span className="text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md">
                  AI Analyzed
                </span>
              </div>
              <div className="aspect-square w-full bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                {/* Visual Placeholder for the Radar Chart */}
                <div className="relative w-3/4 h-3/4 border border-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 font-medium">
                    Radar Chart View
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">주변 맛집 지도</h3>
            <span className="text-xs font-bold text-slate-500 bg-gray-100 px-3 py-1 rounded-full">
              반경 1KM
            </span>
          </div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-64 relative group">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                  지도를 불러오는 중...
                </div>
              }
            >
              {/* Mock Map Image for preview, real implementation uses Google/Kakao API */}
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover grayscale opacity-80"
                alt="Map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-ping"></div>
                <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </Suspense>
          </div>
        </section>

        {/* Recommended List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Recommended Nearby</h3>
            <button className="text-xs font-bold text-[#F05A28] flex items-center gap-1">
              전체보기 <span className="text-[10px]">▶</span>
            </button>
          </div>
          <div className="space-y-6">
            {restaurants.map((res) => (
              <div key={res.id} className="group relative">
                <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={res.img}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={res.name}
                  />
                  <div className="absolute top-3 left-3 bg-[#F05A28] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                    {res.match}% MATCH
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold group-hover:text-[#F05A28] transition-colors">
                      {res.name}
                    </h4>
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
                  <button className="p-2 text-slate-300 hover:text-orange-500 transition-colors">
                    <User size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
<<<<<<< HEAD
        {/* 추가 부분 */}
        <footer className="mt-6 px-2 pb-6 text-[11px] text-slate-400 space-y-2 leading-relaxed border-t border-gray-100 pt-6">
          <div className="space-y-1">
            <p>
              <span className="font-bold text-slate-500">(주)GIMIBOK</span>
            </p>
            <p>대표 : 김기복</p>
          </div>

          <p className="text-[10px] text-slate-300 pt-1">
            © 2024 GIMIBOK. All rights reserved.
          </p>
        </footer>
=======
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
      </main>

      {/* Floating Actions */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={scrollToTop}
<<<<<<< HEAD
          className="p-3 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 border border-gray-100 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronUp size={24} />
        </button>

        <AiChatBot />
      </div>

      {/* // 추가 부분 */}
      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50">
        <div className="flex justify-around items-end px-2 pt-1.5 pb-4 max-w-md mx-auto">
          {/* 홈 */}
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

          {/* 저장 */}
          <button
            onClick={() => setActiveTab('save')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                stroke={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
              />
              <path
                d="M8 21h8M12 16v5"
                stroke={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 9h8M8 12h5"
                stroke={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
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

          {/* 마이다이닝 */}
          <button
            onClick={() => setActiveTab('mydining')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="8"
                r="3.5"
                fill={activeTab === 'mydining' ? '#F05A28' : 'transparent'}
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
              />
              <path
                d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7"
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M17 9l1.5 1.5L21 8"
                stroke={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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

          {/* 친구 */}
          <button
            onClick={() => setActiveTab('friends')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
          >
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="9"
                  cy="8"
                  r="3"
                  fill={activeTab === 'friends' ? '#F05A28' : 'transparent'}
                  stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                  strokeWidth="1.5"
                />
                <circle
                  cx="16.5"
                  cy="8"
                  r="2.5"
                  fill={activeTab === 'friends' ? '#F05A28' : 'transparent'}
                  fillOpacity={activeTab === 'friends' ? 0.5 : 1}
                  stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                  strokeWidth="1.5"
                />
                <path
                  d="M2 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
                  stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M18 14c1.5 0 4 .8 4 3"
                  stroke={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* 알림 배지 */}
              <span className="absolute -top-0.5 -right-0.5 w-[7px] h-[7px] bg-[#F05A28] rounded-full border-[1.5px] border-white" />
            </div>
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
=======
          className="p-3 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 border border-gray-100 active:scale-90 transition-all"
        >
          <ChevronUp size={24} />
        </button>
        <button className="p-4 bg-[#F05A28] shadow-xl shadow-orange-200 rounded-full text-white active:scale-95 transition-all">
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Bottom Nav Bar (Quick Access) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center h-20 px-6 pb-6 z-50">
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Home size={22} />
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#F05A28] bg-orange-50 px-4 py-2 rounded-2xl">
          <User size={22} />
          <span className="text-[10px] font-bold">Taste</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <MapPin size={22} />
          <span className="text-[10px] font-bold">Map</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <User size={22} />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
>>>>>>> 4103ee2e3d66886f17ea3dbc592055b338eadee9
      </nav>
    </div>
  );
};

export default Dashboard;
