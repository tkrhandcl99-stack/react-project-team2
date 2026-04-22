// TasteQuest: Premium Main Dashboard (재원 & 영재 & 태환 최종 통합본)
import React, { useState, useReducer, Suspense } from 'react';
import {
  Home,
  User,
  Edit2,
  ChevronUp,
  LogOut,
  MapPin,
  Heart,
} from 'lucide-react';

// 컴포넌트 Import
import KakaoMap from '../components/KakaoMap';
import AiChatBot from '../components/AiChatBot';

// 영재님 상단 로고 이미지
import GimibokLogo from '../assets/gimibok-logo.svg.webp';

// 로그인 정보 가져오기
import { useAuth } from '../contexts/AuthContext';

// ★ 영재: 차트 관련 Import 및 설정
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

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

  // ★ 영재: 6가지 항목으로 구성된 유저 프로필 상태
  const [userProfile] = useReducer(tasteReducer, {
    nickname: '미식탐험가',
    level: 'Expert',
    lessSpicy: 4, // 덜맵기
    moreSpicy: 2, // 매움
    lessSalty: 3, // 덜짜게
    moreSalty: 1, // 짜게
    softness: 5, // 부드러움
    crunchyTexture: 4, // 식감
  });

  // ★ 영재: 차트 데이터 및 옵션 설정
  const chartData = {
    labels: ['덜맵기', '매움', '덜짜게', '짜게', '부드러움', '식감'],
    datasets: [
      {
        label: '내 맛 프로필',
        data: [
          userProfile.lessSpicy,
          userProfile.moreSpicy,
          userProfile.lessSalty,
          userProfile.moreSalty,
          userProfile.softness,
          userProfile.crunchyTexture,
        ],
        backgroundColor: 'rgba(240, 90, 40, 0.2)',
        borderColor: '#F05A28',
        borderWidth: 2,
        pointBackgroundColor: '#F05A28',
        pointBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 1,
        suggestedMax: 5,
        ticks: { stepSize: 1, display: false },
        pointLabels: {
          font: { size: 11, weight: 'bold' },
          color: '#F05A28',
        },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
  };

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
      {/* 1. 상단 네비게이션 (영재: 중앙 로고 정렬 / 재원: 회원가입 제거) */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 shadow-sm">
        <div className="max-w-md mx-auto h-full px-4 flex items-center relative">
          <div className="absolute left-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Home size={22} className="text-[#F05A28]" />
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src={GimibokLogo}
              alt="GIMIBOK 로고"
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="absolute right-4 flex items-center">
            {user ? (
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-[11px] font-bold text-slate-700">
                  {user.displayName}님
                </span>
                <button
                  onClick={logout}
                  className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="bg-[#F05A28] text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-md shadow-orange-100 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* 2. 프로필 섹션 (영재: 레이더 차트 적용) */}
        <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative group">
                {user ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-orange-50 text-slate-400">
                    <User size={48} />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 border border-gray-100 hover:text-[#F05A28] transition-colors cursor-pointer">
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

            <div className="flex-1 relative">
              <div className="flex items-center mb-2">
                <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full"></span>
                  Taste Profile
                </h3>
              </div>
              <span className="absolute top-0 right-0 text-[9px] sm:text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md">
                AI Analyzed
              </span>

              {/* 육각형 차트 영역 */}
              <div className="w-full aspect-square flex items-center justify-center overflow-hidden pt-4">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </section>

        {/* 3. 지도 섹션 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">주변 맛집 지도</h3>
            <span className="text-xs font-bold text-slate-500 bg-gray-100 px-3 py-1 rounded-full">
              반경 2KM
            </span>
          </div>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
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
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Recommended Nearby</h3>
            <button className="text-xs font-bold text-[#F05A28] cursor-pointer">
              전체보기 ▶
            </button>
          </div>
          <div className="space-y-6">
            {restaurants.map((res) => (
              <div key={res.id} className="group relative text-left">
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
                  <button className="p-2 text-slate-300 hover:text-orange-500 transition-colors cursor-pointer">
                    <User size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

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

      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={scrollToTop}
          className="p-3 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 border border-gray-100 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronUp size={24} />
        </button>
        <AiChatBot />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40">
        <div className="flex justify-around items-end px-2 pt-1.5 pb-4 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer transition-all"
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
              className={`text-[10px] font-bold ${activeTab === 'home' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
            >
              홈
            </span>
            {activeTab === 'home' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer transition-all"
          >
            <Heart
              size={24}
              color={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
              fill={activeTab === 'save' ? '#F05A28' : 'transparent'}
              strokeWidth="1.5"
            />
            <span
              className={`text-[10px] font-bold ${activeTab === 'save' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
            >
              찜
            </span>
            {activeTab === 'save' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('mydining')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer transition-all"
          >
            <MapPin
              size={24}
              color={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
              fill={activeTab === 'mydining' ? '#F05A28' : 'transparent'}
            />
            <span
              className={`text-[10px] font-bold ${activeTab === 'mydining' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
            >
              마이다이닝
            </span>
            {activeTab === 'mydining' && (
              <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer transition-all"
          >
            <User
              size={24}
              color={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
              fill={activeTab === 'friends' ? '#F05A28' : 'transparent'}
            />
            <span
              className={`text-[10px] font-bold ${activeTab === 'friends' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
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
