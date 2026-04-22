import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft } from 'lucide-react';

const EditProfile = ({ userProfile, onUpdate }) => {
  const navigate = useNavigate();
  
  // 💡 부모로부터 받은 데이터를 안전하게 복사
  const [editData, setEditData] = useState({ 
    nickname: userProfile?.nickname || '',
    softness: userProfile?.softness || 3,
    crunchyTexture: userProfile?.crunchyTexture || 3,
    moreSpicy: userProfile?.moreSpicy || 3,
    moreSalty: userProfile?.moreSalty || 3,
    spices: userProfile?.spices || 3,
    photoURL: userProfile?.photoURL || null
  });

  const tasteLabels = {
    softness: "부드러움",
    crunchyTexture: "바삭함",
    moreSpicy: "매운단계",
    moreSalty: "간세기",
    spices: "향신료"
  };

  const handleSave = () => {
    onUpdate(editData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <main className="max-w-md mx-auto space-y-6">
        <input 
          type="text" 
          value={editData.nickname}
          onChange={(e) => setEditData({...editData, nickname: e.target.value})}
          className="w-full p-4 rounded-2xl bg-gray-50 outline-none"
        />

        <div className="bg-orange-50/30 p-6 rounded-3xl space-y-4">
          {Object.keys(tasteLabels).map((key) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>{tasteLabels[key]}</span>
                <span className="text-[#F05A28]">{editData[key]}단계</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={editData[key]} 
                onChange={(e) => setEditData({...editData, [key]: parseInt(e.target.value)})}
                className="w-full accent-[#F05A28]"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="w-full py-4 bg-[#F05A28] text-white rounded-2xl font-bold">
          수정 완료
        </button>
      </main>
    </div>
  );
};

export default EditProfile;