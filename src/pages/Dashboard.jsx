import React, { useState, useReducer, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

// 분리한 컴포넌트들 Import
import Header from '../components/Dashboard/Header';
import ProfileCard from '../components/Dashboard/ProfileCard';
import RestaurantList from '../components/Dashboard/RestaurantList';
import NavigationBar from '../components/Dashboard/NavigationBar';
import KakaoMap from '../components/KakaoMap';
import AiChatBot from '../components/AiChatBot';

// Context & Chart Setting
import { useAuth } from '../contexts/AuthContext';
import { useYum } from '../contexts/YumContext';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const { addFavorite, favorites } = useYum();
  const [activeTab, setActiveTab] = useState('home');
  const [mapKeyword, setMapKeyword] = useState('');

  const [userProfile] = useReducer(
    (s, a) => (a.type === 'UPDATE' ? { ...s, ...a.p } : s),
    {
      nickname: '미식탐험가',
      level: 'Expert',
      lessSpicy: 4,
      moreSpicy: 2,
      lessSalty: 3,
      moreSalty: 1,
      softness: 5,
      crunchyTexture: 4,
    },
  );

  const chartData = {
    labels: ['덜맵기', '매움', '덜짜게', '짜게', '부드러움', '식감'],
    datasets: [
      {
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
      },
    ],
  };

  const restaurants = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />

      <main className="max-w-md mx-auto p-4 space-y-6">
        <ProfileCard
          user={user}
          userProfile={userProfile}
          chartData={chartData}
          chartOptions={{
            scales: {
              r: {
                angleLines: { display: false },
                suggestedMin: 1,
                suggestedMax: 5,
                ticks: { display: false },
                pointLabels: {
                  font: { size: 10, weight: 'bold' },
                  color: '#F05A28',
                },
              },
            },
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: true,
          }}
        />

        <section className="space-y-3 text-left">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">주변 맛집 지도</h3>
            <span className="text-xs font-bold text-slate-500 bg-gray-100 px-3 py-1 rounded-full">
              반경 2KM
            </span>
          </div>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative">
            <Suspense
              fallback={
                <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs">
                  지도를 불러오는 중...
                </div>
              }
            >
              <KakaoMap externalKeyword={mapKeyword} />
            </Suspense>
          </div>
        </section>

        <RestaurantList
          restaurants={restaurants}
          addFavorite={addFavorite}
          isFavorite={(id) => favorites.some((f) => f.id === id)}
          navigate={navigate}
        />

        <footer className="mt-6 px-2 pb-12 text-[11px] text-slate-400 space-y-2 border-t border-gray-100 pt-6 text-left">
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
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 border border-gray-100 active:scale-90 transition-all cursor-pointer"
        >
          <ChevronUp size={24} />
        </button>
        <AiChatBot onKeyword={setMapKeyword} />
      </div>

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Dashboard;
