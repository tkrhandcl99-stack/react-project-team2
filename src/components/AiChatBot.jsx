import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const AiChatBot = ({ onKeyword }) => {
  // ✅ 부모(Dashboard)로부터 키워드 전달 함수 받음
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMsg = { role: 'user', text: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await res.json();

      // ✅ 태환님의 키워드 감지 로직 이식
      const keywords = [
        '맛집',
        '식당',
        '음식',
        '먹고싶',
        '가고싶',
        '추천',
        '카페',
        '국밥',
        '치킨',
        '파스타',
        '초밥',
      ];
      const hasKeyword = keywords.some((k) => currentInput.includes(k));

      if (hasKeyword && onKeyword) {
        onKeyword(currentInput); // ✅ 대시보드 지도로 키워드 전달
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: data.reply,
          // 키워드가 있으면 카카오맵 링크 제공
          mapUrl: hasKeyword
            ? `https://map.kakao.com/?q=${encodeURIComponent(currentInput)}`
            : null,
        },
      ]);
    } catch (error) {
      console.error('챗봇 연결 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="p-4 bg-[#F05A28] shadow-xl shadow-orange-200 rounded-full text-white active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={28} />
      </button>

      {chatOpen && (
        <div className="fixed bottom-28 right-6 w-80 h-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <h3 className="font-bold text-slate-900 text-sm">AI 맛집 추천</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 text-sm cursor-pointer hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#F05A28] text-white rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="px-4 py-2 rounded-2xl text-sm bg-white border border-slate-100 text-slate-400">
                  답변 생성 중...
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="어떤 맛집을 찾으세요?"
              className="flex-1 text-sm px-4 py-2 rounded-full bg-slate-100 outline-none focus:ring-1 focus:ring-orange-200"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-[#F05A28] text-white rounded-full text-xs font-bold cursor-pointer transition-colors hover:bg-orange-600"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatBot;
