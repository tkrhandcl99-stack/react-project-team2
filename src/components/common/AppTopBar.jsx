import React from 'react';
import { Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AppTopBar = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#F05A28] hover:bg-orange-50 active:scale-95 transition"
          title="홈으로"
        >
          <Home size={20} />
        </button>

        <h1 className="text-2xl font-black text-[#F05A28] tracking-tight">
          김이보
        </h1>

        {user ? (
          <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-full pl-2 pr-3 py-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
              {user.displayName?.slice(0, 1) || '유'}
            </div>
            <span className="text-xs font-bold text-slate-700 max-w-[72px] truncate">
              {user.displayName}님
            </span>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-slate-800 active:scale-95 transition"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={loginWithGoogle}
            className="bg-[#F05A28] text-white px-3 py-1.5 rounded-full text-xs font-bold active:scale-95 transition"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};

export default AppTopBar;
