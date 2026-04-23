import { useState, useEffect } from 'react';
import { MessageCircle, Star, MessageSquare } from 'lucide-react';

const AiChatBot = ({ onKeyword }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // KakaoMap에서 찾은 상세 정보를 저장하고 메시지에 반영하기 위한 효과
  useEffect(() => {
    const handlePlaceInfo = (e) => {
      const { detailUrl, placeName, score, reviewCount } = e.detail;

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'ai') {
          // 별점 정보 텍스트 구성
          const scoreInfo = score
            ? `\n\n⭐ 별점: ${score}점\n💬 리뷰: ${reviewCount}개`
            : '';
          const updatedText =
            lastMsg.text.replace(
              /https?:\/\/map\.kakao\.com\/link\/search\/[^\s]+/g,
              detailUrl,
            ) + scoreInfo;

          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            text: updatedText,
            placeData: e.detail, // 장소 데이터를 따로 저장
          };
          return newMessages;
        }
        return prev;
      });
    };

    window.addEventListener('placeDetailFound', handlePlaceInfo);
    return () =>
      window.removeEventListener('placeDetailFound', handlePlaceInfo);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentInput = input;
    const userMsg = { role: 'user', text: currentInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await res.json();

      setMessages((prev) => [...prev, { role: 'ai', text: data.message }]);

      if (data.kakaoUrl && onKeyword) {
        onKeyword(currentInput);
      }
    } catch (error) {
      console.error('챗봇 에러:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '연결에 실패했습니다.' },
      ]);
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
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[90%] shadow-sm whitespace-pre-wrap break-all ${
                    msg.role === 'user'
                      ? 'bg-[#F05A28] text-white rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                  }`}
                >
                  {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                    if (part.match(/^https?:\/\/[^\s]+$/)) {
                      return (
                        <div
                          key={index}
                          className="mt-2 p-3 bg-orange-50 rounded-xl border border-orange-100"
                        >
                          {msg.placeData && (
                            <div className="mb-2">
                              <p className="font-bold text-slate-900 text-xs mb-1">
                                {msg.placeData.placeName}
                              </p>
                              <div className="flex gap-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-0.5">
                                  <Star
                                    size={10}
                                    className="text-orange-400 fill-orange-400"
                                  />{' '}
                                  {msg.placeData.score || '평점없음'}
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <MessageSquare
                                    size={10}
                                    className="text-slate-400"
                                  />{' '}
                                  리뷰 {msg.placeData.reviewCount || 0}
                                </span>
                              </div>
                            </div>
                          )}
                          <a
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center py-1.5 bg-[#F05A28] text-white rounded-lg font-bold text-[10px] hover:bg-orange-600 transition-colors"
                          >
                            상세 정보 및 리뷰 보기
                          </a>
                        </div>
                      );
                    }
                    return part;
                  })}
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
              className="px-4 py-2 bg-[#F05A28] text-white rounded-full text-xs font-bold cursor-pointer"
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
