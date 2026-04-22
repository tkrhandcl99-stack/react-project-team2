import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';

const ProfileCard = ({ user, userProfile, chartData, chartOptions }) => {
  const [tags, setTags] = useState([]);

  // 💡 데이터가 변할 때마다 파이썬 서버에 물어보는 핵심 로직
  useEffect(() => {
    const fetchTags = async () => {
      if (!userProfile) return;
      try {
        const res = await axios.post('http://localhost:8000/api/tags', {
          softness: userProfile.softness,
          crunchyTexture: userProfile.crunchyTexture,
          moreSpicy: userProfile.moreSpicy,
          moreSalty: userProfile.moreSalty,
          spices: userProfile.spices
        });
        setTags(res.data.tags); // 파이썬이 보내준 태그로 변경
      } catch (e) {
        console.error("태그 요청 실패", e);
      }
    };
    fetchTags();
  }, [userProfile]); // 👈 유저 정보가 바뀔 때마다 실행

  return (
  <div className="text-center">
    {/* 💡 닉네임이 안 바뀌면 이 부분을 확인하세요 */}
    <h2 className="text-xl font-bold mt-1">
      {userProfile?.nickname || '미식탐험가'}
    </h2>
    <p className="text-[11px] text-slate-500 mt-1">
      {userProfile?.nickname || '미식탐험가'}님 안녕하세요!
    </p>

    {/* 💡 태그가 안 바뀌면 이 부분이 tags(상태값)를 쓰고 있는지 확인하세요 */}
    <div className="flex flex-wrap justify-center gap-1 mt-2">
      {tags && tags.length > 0 ? (
        tags.map((tag, i) => (
          <span key={i} className="text-[10px] text-[#F05A28] font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
            {tag}
          </span>
        ))
      ) : (
        <span className="text-[10px] text-slate-400">태그 분석 중...</span>
      )}
    </div>
  </div>
);
};

export default ProfileCard;