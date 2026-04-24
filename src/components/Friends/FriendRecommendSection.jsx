import React from 'react';
import { Quote, Utensils } from 'lucide-react';

const FriendRecommendSection = ({
  friendName,
  tasteAnalysis,
  recommendedPlaces,
}) => {
  return (
    <>
      {/* AI 맛 분석 코멘트 */}
      <section className="bg-[#fff9f0] p-6 rounded-2xl border border-[#ffe9cc]">
        <div className="flex items-center gap-2 mb-3">
          <Quote size={18} className="text-[#ff5722] fill-[#ff5722]" />
          <h3 className="font-bold text-slate-800">AI 맛 분석 코멘트</h3>
        </div>
        <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
          "{tasteAnalysis}"
        </p>
      </section>

      {/* 추천 식당 */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2 px-1">
          🤝 <span className="text-[#ff5722]">{friendName}</span> 님과 같이
          가볼만한 곳
        </h3>
        <div className="grid gap-3">
          {recommendedPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#ff5722] transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                    <Utensils size={14} className="text-[#ff5722]" />
                  </div>
                  <span className="font-bold text-slate-800 text-md">
                    {place.name}
                  </span>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-500 font-bold">
                  {place.category}
                </span>
              </div>
              <p className="text-[13px] text-slate-500 leading-snug">
                {place.reason}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FriendRecommendSection;
