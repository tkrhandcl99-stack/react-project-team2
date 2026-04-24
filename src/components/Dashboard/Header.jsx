import { Home, LogOut } from 'lucide-react';
import GimibokLogo from '../../assets/gimibok-logo.svg.webp';

const Header = ({ user, logout, navigate }) => (
  <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
    <div className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg h-16 flex items-center px-4 relative pointer-events-auto">
      {/* 홈 버튼 */}
      <div className="absolute left-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        >
          <Home size={22} className="text-[#F05A28]" />
        </button>
      </div>

      {/* 로고 */}
      <div className="flex-1 flex justify-center">
        <img
          src={GimibokLogo}
          alt="GIMIBOK 로고"
          className="h-14 w-auto object-contain cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>

      {/* 유저 정보 / 로그아웃 */}
      <div className="absolute right-4 flex items-center">
        {user ? (
          <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
            <div className="w-6 h-6 rounded-full bg-[#F05A28] flex items-center justify-center text-white text-[10px] font-black">
              {user.name?.slice(0, 1)}
            </div>
            <span className="text-[11px] font-bold text-slate-700">
              {user.name}님
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
            onClick={() => navigate('/login')}
            className="bg-[#F05A28] text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-md shadow-orange-100 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            로그인
          </button>
        )}
      </div>
    </div>
  </nav>
);

export default Header;
