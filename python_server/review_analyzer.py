import json
import re
import requests
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"

# Ollama 사용 여부
USE_OLLAMA = False

EVENT_PATTERNS = [
    r"리뷰\s*이벤트",
    r"서비스\s*받",
    r"서비스로",
    r"이벤트\s*참여",
    r"체험단",
    r"협찬",
    r"영수증\s*리뷰",
    r"포인트\s*적립",
    r"방문\s*인증",
]

# 정보가 없는 짧고 단순한 리뷰 패턴
LOW_INFO_PATTERNS = [
    r"^맛있어요\.?$",
    r"^좋아요\.?$",
    r"^굿\.?$",
    r"^추천\.?$",
    r"^최고예요\.?$",
    r"^맛있습니다\.?$",
    r"^또 올게요\.?$",
    r"^강추\.?$",
    r"^완전 맛있어요\.?$",
    r"^맛집이에요\.?$",
    r"^맛있어요\s*맛있어요",
    r"^👍+$",
    r"^[ㅎㅋ😊👍⭐]+$",
]

SPICY_WORDS = ["맵", "매콤", "얼큰", "칼칼", "자극적"]
TEXTURE_WORDS = ["바삭", "아삭", "쫄깃", "부드럽", "식감"]
SALTY_WORDS = ["짜", "짭짤", "싱겁", "담백", "간이 세"]
SWEET_WORDS = ["달", "달콤", "단맛", "디저트"]
UMAMI_WORDS = ["감칠", "진하", "풍부", "불향", "고소", "깊은 맛"]

SERVICE_WORDS = ["친절", "응대", "서비스", "직원"]
WAITING_WORDS = ["웨이팅", "대기", "줄", "기다"]
HYGIENE_WORDS = ["청결", "깔끔", "위생"]

def contains_any(text, words):
    return any(word in text for word in words)

def clamp(value, min_value=1, max_value=5):
    return max(min_value, min(max_value, value))

def extract_taste_profile_rule_based(content: str):
    text = content.strip()

    spicy = 3
    texture = 3
    saltiness = 3
    sweetness = 3
    umami = 3

    if contains_any(text, SPICY_WORDS):
        spicy += 1
    if "아주 매" in text or "엄청 맵" in text:
        spicy += 1
    if "안 맵" in text or "맵지 않" in text:
        spicy -= 1

    if contains_any(text, ["바삭", "아삭", "쫄깃"]):
        texture += 1
    if contains_any(text, ["부드럽", "물컹"]):
        texture -= 1

    if contains_any(text, ["짜", "짭짤", "간이 세"]):
        saltiness += 1
    if contains_any(text, ["싱겁", "담백", "간이 약"]):
        saltiness -= 1

    if contains_any(text, SWEET_WORDS):
        sweetness += 1
    if "안 달" in text:
        sweetness -= 1

    if contains_any(text, UMAMI_WORDS):
        umami += 1

    return {
        "spicy": clamp(spicy),
        "texture": clamp(texture),
        "saltiness": clamp(saltiness),
        "sweetness": clamp(sweetness),
        "umami": clamp(umami),
    }

def analyze_review_rule_based(review: str, rating: int):
    text = review.strip()

    trust_score = 50
    flags = []

    # ① 리뷰 길이 기반 점수
    if len(text) < 6:
        trust_score -= 35
        flags.append("too_short")
    elif len(text) < 15:
        trust_score -= 20
        flags.append("short_review")
    elif len(text) >= 50:
        trust_score += 15  # 충분히 긴 리뷰는 더 신뢰
    elif len(text) >= 30:
        trust_score += 8

    # ② 이벤트성 리뷰 감지 → 강하게 감점
    if any(re.search(pattern, text) for pattern in EVENT_PATTERNS):
        trust_score -= 40
        flags.append("event_review_suspected")

    # ③ 정보없는 단순 리뷰 → 감점
    if any(re.search(pattern, text) for pattern in LOW_INFO_PATTERNS):
        trust_score -= 25
        flags.append("low_information")

    # ④ 별점 5점 + 짧은 리뷰 조합 → 의심
    if rating == 5 and len(text) < 15:
        trust_score -= 20
        flags.append("high_rating_low_detail")

    # ⑤ 별점 5점 + 이벤트 패턴 → 매우 강하게 의심
    if rating == 5 and any(re.search(pattern, text) for pattern in EVENT_PATTERNS):
        trust_score -= 20
        flags.append("suspicious_perfect_score")

    # ⑥ 구체적인 맛 언급 → 신뢰 상승
    taste_mentioned = contains_any(text, SPICY_WORDS + TEXTURE_WORDS + SALTY_WORDS + SWEET_WORDS + UMAMI_WORDS)
    if taste_mentioned:
        trust_score += 15

    # ⑦ 서비스, 위생, 웨이팅 언급 → 신뢰 상승
    if contains_any(text, SERVICE_WORDS):
        trust_score += 8
    if contains_any(text, WAITING_WORDS + HYGIENE_WORDS):
        trust_score += 8

    # ⑧ 부정적 경험 구체 언급 → 신뢰 상승 (나쁜 리뷰도 신뢰할 수 있음)
    negative_words = ["별로", "실망", "맛없", "노맛", "눅눅", "비쌈", "불친절", "더럽", "위생 별로"]
    if contains_any(text, negative_words) and len(text) >= 20:
        trust_score += 10
        flags.append("detailed_negative")

    trust_score = max(0, min(100, trust_score))

    taste_profile = extract_taste_profile_rule_based(text)

    if trust_score >= 70:
        trust_label = "high"
    elif trust_score >= 40:
        trust_label = "medium"
    else:
        trust_label = "low"

    summary = (
        "구체적인 정보가 담긴 신뢰할 수 있는 리뷰입니다." if trust_label == "high" else
        "일부 정보는 있으나 신뢰도는 보통입니다." if trust_label == "medium" else
        "정보가 부족하거나 이벤트성으로 의심되는 리뷰입니다."
    )

    return {
        "trustScore": trust_score,
        "trustLabel": trust_label,
        "flags": flags,
        "tasteProfile": taste_profile,
        "summary": summary,
        "source": "rule-based",
    }

def analyze_review_with_ollama(review: str, rating: int):
    prompt = f"""
너는 맛집 리뷰 신뢰도 분석기다.
반드시 JSON만 반환해라. 설명 문장 금지.
아래 형식 그대로 반환해라.

{{
  "trustScore": 0~100 정수,
  "trustLabel": "high" 또는 "medium" 또는 "low",
  "flags": ["문자열"],
  "tasteProfile": {{
    "spicy": 1~5 정수,
    "texture": 1~5 정수,
    "saltiness": 1~5 정수,
    "sweetness": 1~5 정수,
    "umami": 1~5 정수
  }},
  "summary": "한 줄 요약"
}}

분석 기준:
- 리뷰 이벤트, 서비스 제공 언급, 과도하게 짧은 리뷰는 신뢰도 낮춤
- 별점 5점 + 짧은 리뷰 조합은 의심
- 맛, 식감, 서비스, 웨이팅, 위생 등 구체성이 높으면 신뢰도 높임

별점: {rating}
리뷰: {review}
""".strip()

    response = requests.post(
        OLLAMA_URL,
        json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False, "format": "json"},
        timeout=15,
    )
    response.raise_for_status()
    parsed = json.loads(response.json()["response"])
    parsed["source"] = "ollama"
    return parsed

def analyze_review(review: str, rating: int):
    if not USE_OLLAMA:
        return analyze_review_rule_based(review, rating)
    try:
        return analyze_review_with_ollama(review, rating)
    except Exception as error:
        print("ollama analyze failed -> fallback:", error)
        return analyze_review_rule_based(review, rating)