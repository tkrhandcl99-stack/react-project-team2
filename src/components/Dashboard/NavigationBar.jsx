import { Home, Heart, MapPin, User } from 'lucide-react';

const NavigationBar = ({ activeTab, setActiveTab, navigate }) => (
  /* 1. 전체 영역을 감싸되 배경을 투명하게 하여 떠 있는 효과를 줍니다. */
  <nav className="fixed bottom-4 left-0 right-0 z-40 flex justify-center pointer-events-none">
    
    {/* 2. 실제 배경과 테두리가 있는 '칸' 부분입니다. 
           상단 헤더와 동일하게 max-w-md, mx-4를 적용하여 라인을 일치시켰습니다. */}
    <div className="w-full max-w-md mx-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg flex justify-around items-center px-4 h-16 pointer-events-auto">
      
      {/* 홈 버튼 */}
      <button
        onClick={() => {
          setActiveTab('home');
          navigate('/');
        }}
        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
      >
        <Home
          size={22}
          color={activeTab === 'home' ? '#F05A28' : '#94a3b8'}
          strokeWidth={activeTab === 'home' ? 2.5 : 1.5}
          className="transition-all group-active:scale-90"
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'home' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          홈
        </span>
        {activeTab === 'home' && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      {/* 찜 버튼 */}
      <button
        onClick={() => {
          setActiveTab('save');
          navigate('/favorites');
        }}
        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
      >
        <Heart
          size={22}
          color={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
          fill={activeTab === 'save' ? '#F05A28' : 'transparent'}
          strokeWidth={activeTab === 'save' ? 2.5 : 1.5}
          className="transition-all group-active:scale-90"
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'save' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          찜
        </span>
        {activeTab === 'save' && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      {/* 마이다이닝 버튼 */}
      <button
        onClick={() => {
          setActiveTab('mydining');
          navigate('/mydining');
        }}
        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
      >
        <MapPin
          size={22}
          color={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
          strokeWidth={activeTab === 'mydining' ? 2.5 : 1.5}
          className="transition-all group-active:scale-90"
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'mydining' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          마이다이닝
        </span>
        {activeTab === 'mydining' && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      {/* 친구 버튼 */}
      <button
        onClick={() => {
          setActiveTab('friends');
          navigate('/friends');
        }}
        className="flex flex-col items-center gap-1 min-w-[64px] cursor-pointer group"
      >
        <User
          size={22}
          color={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
          strokeWidth={activeTab === 'friends' ? 2.5 : 1.5}
          className="transition-all group-active:scale-90"
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'friends' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          친구
        </span>
        {activeTab === 'friends' && (
          <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>
    </div>
  </nav>
);

export default NavigationBar;