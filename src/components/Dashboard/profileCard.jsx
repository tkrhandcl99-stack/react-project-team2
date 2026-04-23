import React from 'react';
import { User, Edit2, Copy, Lock } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

const ProfileCard = ({
  user,
  userProfile,
  tasteProfile,
  onEditTasteProfile,
}) => {
  const handleCopyId = () => {
    if (!user) return;
    const idToCopy = userProfile?.userCode || '';
    navigator.clipboard.writeText(idToCopy).then(() => {
      alert('ID가 복사되었습니다!');
    });
  };

  return (
    <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-6">
        {/* 좌측: 프로필 섹션 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {user ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-50 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-orange-50 text-slate-400">
                <User size={48} />
              </div>
            )}
            {user && (
              <button
                onClick={onEditTasteProfile}
                className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 border border-gray-100 hover:text-[#F05A28] transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>

          <div className="text-center min-w-max px-1">
            {user ? (
              <span className="text-[10px] font-bold text-[#F05A28] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">
                {userProfile?.level || 'Expert'}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-full">
                로그인이 필요합니다
              </span>
            )}

            <h2 className="text-xl font-bold mt-1 whitespace-nowrap text-slate-900">
              {user ? user.displayName : '미식탐험가'}
            </h2>

            {/* 고유 ID - 비로그인 시 blur 처리 */}
            <div
              className={`mt-1 flex items-center justify-center gap-1.5 transition-all ${
                !user ? 'opacity-30 grayscale blur-[1px]' : ''
              }`}
            >
              <span className="text-[9px] font-bold text-[#F05A28]/60 uppercase">
                ID:
              </span>
              <span className="text-[11px] font-bold text-[#F05A28] tracking-tight font-mono">
                {user ? userProfile?.userCode || 'N/A' : '••••••••'}
              </span>
              {user && (
                <button
                  onClick={handleCopyId}
                  className="p-1 text-[#F05A28]/40 hover:text-[#F05A28] transition-colors cursor-pointer"
                  title="ID 복사"
                >
                  <Copy size={10} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 맛 프로필 섹션 */}
        <div className="flex-1 relative">
          <div className="flex items-center mb-2">
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full"></span>
              Taste Profile
            </h3>
          </div>

          <span className="absolute top-0 right-0 text-[9px] sm:text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md z-10">
            AI Analyzed
          </span>

          {/* 비로그인 시 blur + lock 처리 */}
          <div className="relative w-full aspect-square flex items-center justify-center pt-4 overflow-hidden">
            {!user && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[3px] rounded-xl">
                <Lock size={20} className="text-slate-400 mb-1" />
                <span className="text-[9px] text-slate-500 font-medium text-center px-4">
                  로그인 후<br />
                  확인 가능합니다
                </span>
              </div>
            )}
            <div
              className={
                !user ? 'opacity-20 grayscale transition-all' : 'transition-all'
              }
            >
              <TasteRadar profile={tasteProfile} size={220} showLabels />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
