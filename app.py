from flask import Flask, request, jsonify
from flask_cors import CORS
import urllib.parse

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    # AI의 기본 답변
    ai_response = f"안녕하세요! '{user_message}'에 대해 궁금하시군요. 제가 좋은 장소를 찾아드릴게요!"

    # 키워드 감지 범위 확장 (분위기, 술집, 고급 등 추가)
    keywords = [
        '맛집', '식당', '카페', '파스타', '국밥', '추천', 
        '술집', '분위기', '고급', '데이트', '조용한', '회식', '근처'
    ]
    has_keyword = any(k in user_message for k in keywords)
    
    # 기본 검색 URL (목록)
    kakao_url = None
    if has_keyword:
        encoded_keyword = urllib.parse.quote(user_message)
        kakao_url = f"https://map.kakao.com/link/search/{encoded_keyword}"
        # 프론트엔드에서 상세 페이지 URL로 치환할 수 있도록 플래그나 기본 구조를 유지합니다.
        ai_response += f"\n\n📍 검색하신 결과입니다:\n{kakao_url}"

    return jsonify({
        'message': ai_response,
        'kakaoUrl': kakao_url,
        'searchKeyword': user_message # 검색에 사용할 원본 메시지 전달
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)