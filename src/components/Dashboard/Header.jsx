import { Home, LogOut } from 'lucide-react';
import GimibokLogo from '../../assets/gimibok-logo.svg.webp';

const Header = ({ user, loginWithGoogle, logout, navigate }) => (
  <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 h-16 shadow-sm">
    <div className="max-w-md mx-auto h-full px-4 flex items-center relative">
      <div className="absolute left-4">
        <button
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center cursor-pointer"
        >
          <Home size={22} className="text-[#F05A28]" />
        </button>
      </div>
      <div className="flex-1 flex justify-center">
        <img
          src={GimibokLogo}
          alt="GIMIBOK 로고"
          className="h-14 w-auto object-contain cursor-pointer"
          onClick={() => navigate('/')}
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
);

export default Header;
