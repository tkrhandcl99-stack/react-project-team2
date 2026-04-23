import json
import re
import requests
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"

# Ollama 사용 여부 (True: AI분석 시도 후 rule-based fallback / False: rule-based만 사용)
USE_OLLAMA = False

EVENT_PATTERNS = [
    r"리뷰\s*이벤트",
    r"서비스\s*받",
    r"서비스로",
    r"이벤트\s*참여",
    r"체험단",
    r"협찬",
]

LOW_INFO_PATTERNS = [
    r"맛있어요$",
    r"좋아요$",
    r"굿$",
    r"추천$",
    r"최고예요$",
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

    if len(text) < 6:
        trust_score -= 30
        flags.append("too_short")
    elif len(text) < 15:
        trust_score -= 15
        flags.append("short_review")
    elif len(text) >= 30:
        trust_score += 10

    if any(re.search(pattern, text) for pattern in EVENT_PATTERNS):
        trust_score -= 30
        flags.append("event_review_suspected")

    if any(re.search(pattern, text) for pattern in LOW_INFO_PATTERNS):
        trust_score -= 20
        flags.append("low_information")

    if contains_any(text, SPICY_WORDS + TEXTURE_WORDS + SALTY_WORDS + SWEET_WORDS + UMAMI_WORDS):
        trust_score += 15

    if contains_any(text, SERVICE_WORDS):
        trust_score += 8

    if contains_any(text, WAITING_WORDS + HYGIENE_WORDS):
        trust_score += 8

    if rating == 5 and len(text) < 10:
        trust_score -= 15
        flags.append("high_rating_low_detail")

    trust_score = max(0, min(100, trust_score))

    taste_profile = extract_taste_profile_rule_based(text)

    if trust_score >= 75:
        trust_label = "high"
    elif trust_score >= 45:
        trust_label = "medium"
    else:
        trust_label = "low"

    summary = "정보가 충분한 리뷰입니다." if trust_label == "high" else \
              "일부 정보는 있으나 신뢰도는 보통입니다." if trust_label == "medium" else \
              "정보량이 적거나 이벤트성일 수 있는 리뷰입니다."

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
  "flags": ["문자열", "문자열"],
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
- 메뉴, 맛, 식감, 서비스, 웨이팅, 위생 등 구체성이 높으면 신뢰도 높임
- tasteProfile은 리뷰 내용만 보고 추정

별점: {rating}
리뷰: {review}
""".strip()

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json",
        },
        timeout=15,  # 60초 → 15초로 단축
    )
    response.raise_for_status()

    raw = response.json()["response"]
    parsed = json.loads(raw)

    parsed["source"] = "ollama"
    return parsed

def analyze_review(review: str, rating: int):
    # USE_OLLAMA=False 면 즉시 rule-based 반환 (빠름)
    if not USE_OLLAMA:
        return analyze_review_rule_based(review, rating)

    # USE_OLLAMA=True 면 Ollama 시도, 실패/타임아웃 시 rule-based fallback
    try:
        return analyze_review_with_ollama(review, rating)
    except Exception as error:
        print("ollama analyze failed -> fallback:", error)
        return analyze_review_rule_based(review, rating)