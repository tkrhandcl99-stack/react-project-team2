import { Home, Heart, MapPin, User } from 'lucide-react';

const NavigationBar = ({ activeTab, setActiveTab, navigate }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-40">
    <div className="flex justify-around items-end px-2 pt-1.5 pb-4 max-w-md mx-auto">
      <button
        onClick={() => {
          setActiveTab('home');
          navigate('/');
        }}
        className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
      >
        <Home
          size={24}
          color={activeTab === 'home' ? '#F05A28' : '#94a3b8'}
          strokeWidth={1.5}
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'home' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          홈
        </span>
        {activeTab === 'home' && (
          <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      <button
        onClick={() => {
          setActiveTab('save');
          navigate('/favorites');
        }}
        className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
      >
        <Heart
          size={24}
          color={activeTab === 'save' ? '#F05A28' : '#94a3b8'}
          fill={activeTab === 'save' ? '#F05A28' : 'transparent'}
          strokeWidth={1.5}
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'save' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          찜
        </span>
        {activeTab === 'save' && (
          <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      <button
        onClick={() => {
          setActiveTab('mydining');
          navigate('/mydining');
        }}
        className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
      >
        <MapPin
          size={24}
          color={activeTab === 'mydining' ? '#F05A28' : '#94a3b8'}
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'mydining' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          마이다이닝
        </span>
        {activeTab === 'mydining' && (
          <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>

      <button
        onClick={() => {
          setActiveTab('friends');
          navigate('/friends');
        }}
        className="flex flex-col items-center gap-1 px-4 pt-2 pb-1 min-w-[64px] cursor-pointer"
      >
        <User
          size={24}
          color={activeTab === 'friends' ? '#F05A28' : '#94a3b8'}
        />
        <span
          className={`text-[10px] font-bold ${activeTab === 'friends' ? 'text-[#F05A28]' : 'text-[#94a3b8]'}`}
        >
          친구
        </span>
        {activeTab === 'friends' && (
          <div className="w-1 h-1 rounded-full bg-[#F05A28]" />
        )}
      </button>
    </div>
  </nav>
);

export default NavigationBar;
