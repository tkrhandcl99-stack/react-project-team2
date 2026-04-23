import { useNavigate } from 'react-router-dom';
import { useYum } from '../contexts/YumContext';

const Favorites = () => {
  const { favorites, removeFavorite } = useYum();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24"
      style={{ background: '#F5F0EB' }}
    >
      {/* 상단 헤더 */}
      <nav className="max-w-md mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#1a1a1a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="text-base font-bold text-slate-900">Wishlist</h2>
        <div className="w-8" />
      </nav>

      <div className="max-w-md mx-auto px-4 pt-2 pb-6">
        <p className="text-xs font-bold text-[#F05A28] tracking-widest uppercase mb-1">
          나만의 컬렉션
        </p>
        <h1 className="text-3xl font-black text-slate-900 leading-tight">
          찜한 맛집
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          나만의 맛집 컬렉션을 관리해보세요.
        </p>
      </div>

      <main className="max-w-md mx-auto px-4 space-y-5">
        {/* 찜 목록 없을 때 */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  stroke="#F05A28"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <p className="text-slate-500 font-bold text-sm">
              저장한 맛집이 없어요
            </p>
            <p className="text-slate-300 text-xs">
              마음에 드는 맛집을 저장해보세요!
            </p>
          </div>
        ) : (
          <>
            {favorites.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="relative">
                  <img
                    src={res.img}
                    alt={res.name}
                    className="w-full h-56 object-cover"
                  />
                  <button
                    onClick={() => removeFavorite(res.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#F05A28"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-black text-white bg-black/60 px-3 py-1 rounded-full tracking-widest uppercase">
                      {res.tags[0]?.replace('#', '')}
                    </span>
                  </div>
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {res.name}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {res.tags[1]?.replace('#', '')} · $$$$
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="#F05A28"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-bold text-slate-900">
                      {(res.match / 20).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* 하단 배너 */}
            <div className="bg-[#F05A28] rounded-3xl p-6 relative overflow-hidden">
              <h3 className="text-xl font-black text-white leading-tight">
                새로운 맛집을 찾고 싶으신가요?
              </h3>
              <p className="text-sm text-orange-100 mt-1 mb-4">
                AI가 새로운 맛집을 추천해드릴게요.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-[#F05A28] text-xs font-black px-5 py-2.5 rounded-full tracking-widest uppercase cursor-pointer"
              >
                탐색하기
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Favorites;
