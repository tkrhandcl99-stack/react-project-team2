import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, UtensilsCrossed } from 'lucide-react';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import { useAuth } from '../contexts/AuthContext';
import { useYum } from '../contexts/YumContext';

const MyDining = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const { visitHistory } = useYum();
  const [activeTab, setActiveTab] = useState('mydining');

  // 비로그인 화면
  if (!user) {
    return (
      <div className="h-dvh bg-[#f9f9f9] flex flex-col overflow-hidden">
        <Header loginWithGoogle={loginWithGoogle} navigate={navigate} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#ff5722] mb-6 shadow-sm">
            <UtensilsCrossed size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            로그인하시면 회원님만의
            <br />
            마이다이닝 목록을 확인할 수 있습니다.
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

      <main className="max-w-md mx-auto px-5 pt-24 py-6 space-y-8">
        <section>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
            My Dining
          </h1>
          <p className="text-base text-slate-400">
            내가 찾아본 맛집들을 여기서 확인하세요.
          </p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-900">최근 본 맛집</h2>
            <span className="text-xs text-slate-400 font-medium">
              {visitHistory.length} / 10
            </span>
          </div>

          {visitHistory.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-[#F05A28]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                아직 기록이 없어요
              </h3>
              <p className="text-sm text-slate-400 mb-5">
                홈에서 맛집 카드를 눌러보세요!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#F05A28] text-white px-6 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all"
              >
                맛집 탐색하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visitHistory.map((res, index) => (
                <div
                  key={res.id}
                  onClick={() => {
                    if (res.placeUrl) {
                      const a = document.createElement('a');
                      a.href = res.placeUrl;
                      a.target = '_blank';
                      a.rel = 'noopener noreferrer';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex gap-4 p-3 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex-shrink-0 w-7 flex items-center justify-center">
                    <span className="text-xs font-black text-slate-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img
                      src={res.img}
                      alt={res.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-sm font-black text-slate-900 truncate">
                      {res.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {res.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-slate-400 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {res.trustedRating != null ? (
                    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-0.5">
                      <div className="flex items-center gap-0.5">
                        <span className="text-[#F05A28]">★</span>
                        <span className="text-sm font-black text-[#F05A28]">
                          {res.trustedRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">
                        신뢰반영
                      </span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default MyDining;
