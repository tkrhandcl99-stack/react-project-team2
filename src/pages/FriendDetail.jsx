import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ArrowUp, MessageCircle } from 'lucide-react';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FriendProfileCard from '../components/Friends/FriendProfileCard';
import FriendRecommendSection from '../components/Friends/FriendRecommendSection';
import { tasteDatabase, getTasteTags } from '../data/tasteDatabase';

const FriendDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const friend = location.state?.friend;

  const myTags = useMemo(() => getTasteTags(friend?.tasteProfile), [friend]);

  const { recommendedPlaces, tasteAnalysis } = useMemo(() => {
    if (!friend?.tasteProfile)
      return { recommendedPlaces: [], tasteAnalysis: '' };

    const maxTaste = Object.keys(friend.tasteProfile).reduce((a, b) =>
      friend.tasteProfile[a] > friend.tasteProfile[b] ? a : b,
    );

    const selected = tasteDatabase[maxTaste] || tasteDatabase.umami;
    return {
      recommendedPlaces: selected.recommended,
      tasteAnalysis: selected.analysis,
    };
  }, [friend]);

  if (!friend)
    return <div className="p-10 text-center">정보를 불러올 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-32 relative">
      {/* 헤더 */}
      <div className="fixed top-2 left-0 right-0 z-50 flex justify-center px-5">
        <div className="w-full max-w-md h-14 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50 rounded-2xl flex items-center justify-between px-2 border border-gray-100">
          <div className="w-10 flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-600"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
          <h1 className="text-[16px] font-bold text-slate-800">친구 프로필</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 본문 */}
      <main className="max-w-md mx-auto pt-24 px-5 space-y-6">
        <FriendProfileCard friend={friend} tags={myTags} />
        <FriendRecommendSection
          friendName={friend.name}
          tasteAnalysis={tasteAnalysis}
          recommendedPlaces={recommendedPlaces}
        />
      </main>

      {/* 플로팅 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-50 flex justify-center">
        <div className="w-full max-w-md relative h-screen">
          <div className="absolute bottom-24 right-5 flex flex-col gap-3 items-center pointer-events-auto">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-slate-400 hover:text-[#ff5722] transition-colors"
            >
              <ArrowUp size={20} />
            </button>
            <button className="w-14 h-14 bg-[#ff5722] rounded-full shadow-xl shadow-orange-200 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all">
              <MessageCircle size={28} fill="white" />
            </button>
          </div>
        </div>
      </div>

      <NavigationBar activeTab="friends" navigate={navigate} />
    </div>
  );
};

export default FriendDetail;
