import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FloatingActions from '../components/common/FloatingActions';
import { useAuth } from '../contexts/AuthContext';
import { useYum } from '../contexts/YumContext';
import { useState } from 'react';

const Favorites = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const { favorites, removeFavorite } = useYum();
  const [activeTab, setActiveTab] = useState('save');

  return (
    <div className="min-h-screen bg-[#f6f2ee] text-slate-900 pb-24">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />

      <main className="max-w-md mx-auto px-5 pt-24 pb-8">
        <div className="mb-8">
          <p className="text-sm text-[#F05A28] font-medium mb-1">
            나만의 컬렉션
          </p>
          <h1 className="text-4xl font-black text-slate-900 mb-2">찜한 맛집</h1>
          <p className="text-lg text-slate-400">
            나만의 맛집 컬렉션을 관리해보세요.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="space-y-6">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              >
                <div className="relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />

                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition"
                  >
                    <Heart
                      size={22}
                      className="text-[#F05A28] fill-[#F05A28]"
                    />
                  </button>

                  {item.tags?.[0] && (
                    <span className="absolute bottom-4 left-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {item.tags[0].replace('#', '')}
                    </span>
                  )}
                </div>

                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-lg text-slate-400 mt-1">
                      {item.tags?.[1]?.replace('#', '') || '데이트코스'} • $$$$
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-full px-4 py-2 flex items-center gap-1">
                    <Star size={16} className="text-[#F05A28] fill-[#F05A28]" />
                    {item.trustedRating != null ? (
                      <div className="flex flex-col items-center">
                        <span className="font-black text-[#F05A28] text-sm leading-none">
                          {item.trustedRating.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                          신뢰반영
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-400 text-sm">
                        -.-
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-[#F05A28] rounded-[28px] p-7 text-white">
              <h3 className="text-2xl font-black mb-2">
                새로운 맛집을 찾고 싶으신가요?
              </h3>
              <p className="text-lg opacity-90 mb-5">
                AI가 새로운 맛집을 추천해드릴게요.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-[#F05A28] px-6 py-3 rounded-full text-sm font-bold active:scale-95 transition"
              >
                탐색하기
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[28px] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              아직 찜한 맛집이 없어요
            </h3>
            <p className="text-slate-400 mb-6">
              홈에서 하트를 눌러 맛집을 찜해보세요.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#F05A28] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition"
            >
              홈으로 가기
            </button>
          </div>
        )}
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

export default Favorites;
