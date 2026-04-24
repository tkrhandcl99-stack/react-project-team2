import React from 'react';
import { User, Edit2, Copy, Lock } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

const ProfileCard = ({
  user,
  userProfile,
  tasteProfile,
  onEditTasteProfile,
}) => {
  // byj: 태그별 툴팁 설명
  const tagDescriptions = {
    '#매운맛고수': '스트레스 풀리는 매운맛을 가장 즐겨요 🌶️',
    '#식감마스터': '꼬들함과 바삭함 등 입안의 즐거움을 찾아요 ✨',
    '#단짠천재': '멈출 수 없는 중독적인 단짠의 조화를 선호해요 🧂',
    '#달콤처돌이': '지친 하루를 달래줄 달콤한 디저트에 진심이에요 🍭',
    '#감칠맛박사': '재료 본연의 깊고 진한 풍미를 중요하게 생각해요 🍜',
    '#미식가': '기미복이 인증하는 균형 잡힌 입맛의 소유자입니다',
  };

  // byj: tasteProfile 수치 기반 태그 자동 생성
  const getTasteTags = (profile) => {
    if (!profile || !user) return [];
    const tags = [];
    if (profile.spicy >= 4) tags.push('#매운맛고수');
    if (profile.texture >= 4) tags.push('#식감마스터');
    if (profile.saltiness >= 4) tags.push('#단짠천재');
    if (profile.sweetness >= 4) tags.push('#달콤처돌이');
    if (profile.umami >= 4) tags.push('#감칠맛박사');
    return tags.length > 0 ? tags : ['#미식가'];
  };

  const myTags = getTasteTags(tasteProfile);

  const handleCopyId = () => {
    if (!user) return;
    navigator.clipboard.writeText(userProfile?.userCode || '').then(() => {
      alert('ID가 복사되었습니다!');
    });
  };

  return (
    <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 transition-all">
      <div className="flex items-start gap-8">
        {/* 좌측: 프로필 */}
        <div className="flex flex-col items-center gap-4 w-[120px] flex-shrink-0">
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

          <div className="text-center w-full px-1">
            {user ? (
              <span className="text-[10px] font-black text-[#F05A28] uppercase tracking-tighter bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                {userProfile?.level || 'Expert'}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-0.5 rounded-full">
                로그인이 필요합니다
              </span>
            )}

            <h2 className="text-lg font-black mt-2 text-slate-900 leading-tight whitespace-nowrap">
              {user ? user.displayName : '미식탐험가'}
            </h2>

            {/* 고유 ID + 태그 영역 */}
            <div
              className={`mt-2 flex flex-col items-center gap-1 transition-all ${
                !user ? 'opacity-30 grayscale blur-[1px]' : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
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

              {/* byj: 태그 + 툴팁 */}
              <div className="flex flex-wrap justify-center gap-1 mt-1.5 w-full">
                {myTags.map((tag) => (
                  <div key={tag} className="group relative cursor-help">
                    <span className="text-[11px] font-black text-[#F05A28] transition-all duration-200 inline-block group-hover:scale-110 group-hover:drop-shadow-sm">
                      {tag}
                    </span>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-50">
                      <div className="bg-slate-800 text-white text-[10px] p-2.5 rounded-xl shadow-xl text-center leading-relaxed font-medium">
                        {tagDescriptions[tag]}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 우측: Taste Profile */}
        <div className="flex-1 relative bg-[#fcfcfc] rounded-[32px] p-5 border border-gray-100/50">
          <div className="flex items-center mb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full animate-pulse"></span>
              Taste Profile
            </h3>
          </div>

          <span className="absolute top-4 right-4 text-[9px] sm:text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md z-10">
            AI Analyzed
          </span>

          <div className="relative w-full flex items-center justify-center">
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
              <TasteRadar profile={tasteProfile} size={180} showLabels />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileCard;
