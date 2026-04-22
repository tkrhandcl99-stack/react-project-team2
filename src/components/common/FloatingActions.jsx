import { ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AiChatBot from '../AiChatBot';

const FloatingActions = ({ onKeyword }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyword = (keyword) => {
    if (!keyword?.trim()) return;

    if (location.pathname === '/') {
      onKeyword?.(keyword);
      return;
    }

    navigate(`/?chatKeyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-40">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="p-3 bg-white shadow-xl rounded-full text-slate-400 hover:text-slate-900 border border-gray-100 active:scale-90 transition-all cursor-pointer"
        title="맨 위로"
      >
        <ChevronUp size={24} />
      </button>

      <AiChatBot onKeyword={handleKeyword} />
    </div>
  );
};

export default FloatingActions;
