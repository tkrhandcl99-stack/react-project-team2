import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const AiChatBot = ({ onKeyword }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input; // ✅ 추가
    setInput('');
    setLoading(true);

    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: currentInput }),
    });

    const data = await res.json();

    const keywords = [
      '맛집',
      '식당',
      '음식',
      '먹고싶',
      '가고싶',
      '추천',
      '김밥',
      '라멘',
      '파스타',
      '초밥',
      '카페',
      '치킨',
      '피자',
      '햄버거',
      '국밥',
      '냉면',
    ];
    const hasKeyword = keywords.some((k) => currentInput.includes(k));

    if (hasKeyword && onKeyword) {
      onKeyword(currentInput); // ✅ 지도로 키워드 전달
    }

    setMessages((prev) => [
      ...prev,
      {
        // ✅ 주석 해제
        role: 'ai',
        text: data.reply,
        mapUrl: hasKeyword
          ? `https://map.kakao.com/?q=${encodeURIComponent(currentInput)}`
          : null,
      },
    ]);
    setLoading(false); // ✅ 주석 해제
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="p-4 bg-[#F05A28] shadow-xl shadow-orange-200 rounded-full text-white active:scale-95 transition-all cursor-pointer"
      >
        <MessageCircle size={28} />
      </button>

      {/* 챗봇 창 */}
      {chatOpen && (
        <div className="fixed bottom-28 right-6 w-80 h-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50">
          {/* 헤더 */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">AI 맛집 추천</h3>
            <button
              onClick={() => setChatOpen(false)}
              className="text-slate-400 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-[#F05A28] text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl text-sm bg-slate-100 text-slate-400">
                  답변 생성 중...
                </div>
              </div>
            )}
          </div>

          {/* 입력창 */}
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="맛집 추천 받기..."
              className="flex-1 text-sm px-4 py-2 rounded-full bg-slate-100 outline-none"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-[#F05A28] text-white rounded-full text-sm font-bold cursor-pointer"
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
