import { useAuth } from './context/AuthContext';

const LoginButton = () => {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-3">
          <img
            src={user.photoURL}
            className="w-8 h-8 rounded-full"
            alt="profile"
          />
          <span className="text-sm font-bold">{user.displayName}님</span>
          <button onClick={logout} className="text-xs text-slate-400">
            로그아웃
          </button>
        </div>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="bg-[#F05A28] text-white px-4 py-2 rounded-xl font-bold text-sm"
        >
          구글로 시작하기
        </button>
      )}
    </div>
  );
};
