import { Home, LogOut } from 'lucide-react';
import GimibokLogo from '../../assets/gimibok-logo.svg.webp';

const Header = ({ user, loginWithGoogle, logout, navigate }) => {
  // ✅ [수정] 로그인한 사용자의 이름에서 성을 제외한 이름만 추출하거나 전체 이름을 가져옵니다.
  // user.displayName이 있으면 그 값을 사용하고, 없으면 기본값 '유저'를 보여줍니다.
  const userName = user?.displayName ? user.displayName.slice(-2) : "유저";

  return (
    <nav className="fixed top-2 left-0 right-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-full max-w-md mx-4 h-14 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg px-6 flex items-center justify-between pointer-events-auto">
        
        {/* 왼쪽: 홈 버튼 */}
        <div className="w-12 flex justify-start">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 hover:bg-orange-50 rounded-xl transition-colors flex items-center justify-center cursor-pointer group"
          >
            <Home size={24} className="text-[#F05A28] group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* 중앙: 로고 */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={GimibokLogo}
            alt="GIMIBOK 로고"
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>

        {/* 오른쪽: 사용자 정보 영역 */}
        <div className="min-w-[48px] flex justify-end items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              {/* ✅ [수정] 고정된 '영재' 대신 userName 변수를 출력하도록 변경 */}
              <div className="min-w-[28px] h-7 px-2 rounded-full bg-[#ff5722] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                {userName}
              </div>
              <button
                onClick={logout}
                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="text-[#F05A28] text-[13px] font-bold hover:underline"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;