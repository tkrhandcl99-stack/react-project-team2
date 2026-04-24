import { Heart, Star, Pencil, Check, X, BookHeart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import { useAuth } from '../contexts/AuthContext';
import { useYum } from '../contexts/YumContext';
import { useState } from 'react';

const Favorites = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const { favorites, removeFavorite, updateFavoriteMemo } = useYum();
  const [activeTab, setActiveTab] = useState('save');
  const [editingId, setEditingId] = useState(null);
  const [memoInput, setMemoInput] = useState('');

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setMemoInput(item.memo || '');
  };

  const handleEditSave = (id) => {
    updateFavoriteMemo(id, memoInput);
    setEditingId(null);
    setMemoInput('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setMemoInput('');
  };

  // 비로그인 화면
  if (!user) {
    return (
      <div className="h-dvh bg-[#f6f2ee] flex flex-col overflow-hidden">
        <Header loginWithGoogle={loginWithGoogle} navigate={navigate} />
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#ff5722] mb-6 shadow-sm">
            <BookHeart size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            로그인하시면 회원님만의
            <br />찜 목록을 확인할 수 있습니다.
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

                  {/* 연필 버튼 - 좌상단 */}
                  <button
                    onClick={() => handleEditStart(item)}
                    className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center active:scale-95 transition"
                  >
                    <Pencil size={16} className="text-slate-500" />
                  </button>

                  {/* 찜 해제 버튼 - 우상단 */}
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

                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-black text-slate-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-lg text-slate-400 mt-1">
                        {item.tags?.[1]?.replace('#', '') || '데이트코스'} •
                        $$$$
                      </p>

                      {/* 메모 영역 */}
                      {editingId === item.id ? (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={memoInput}
                            onChange={(e) => setMemoInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave(item.id);
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            placeholder="메모를 입력하세요..."
                            autoFocus
                            className="flex-1 text-sm text-slate-700 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-[#F05A28] placeholder:text-slate-300"
                          />
                          <button
                            onClick={() => handleEditSave(item.id)}
                            className="w-8 h-8 rounded-full bg-[#F05A28] flex items-center justify-center active:scale-95 transition flex-shrink-0"
                          >
                            <Check size={14} className="text-white" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition flex-shrink-0"
                          >
                            <X size={14} className="text-slate-400" />
                          </button>
                        </div>
                      ) : item.memo ? (
                        <p
                          onClick={() => handleEditStart(item)}
                          className="mt-2 text-sm text-slate-500 bg-orange-50 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-orange-100 transition"
                        >
                          📝 {item.memo}
                        </p>
                      ) : null}
                    </div>

                    <div className="bg-orange-50 rounded-full px-4 py-2 flex items-center gap-1 flex-shrink-0 ml-3">
                      <Star
                        size={16}
                        className="text-[#F05A28] fill-[#F05A28]"
                      />
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

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Favorites;
