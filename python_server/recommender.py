from review_analyzer import analyze_review
from concurrent.futures import ThreadPoolExecutor, as_completed

def average(values):
    return round(sum(values) / len(values), 2) if values else 0

def get_match_score(user_profile, restaurant_profile):
    diffs = []
    for key in ["spicy", "texture", "saltiness", "sweetness", "umami"]:
        diffs.append(abs(user_profile.get(key, 3) - restaurant_profile.get(key, 3)))

    total_diff = sum(diffs)
    max_diff = 5 * 4
    score = round((1 - total_diff / max_diff) * 100)
    return max(0, min(100, score))

def aggregate_restaurant(restaurant, user_profile=None):
    reviews = restaurant.get("reviews", [])

    # 리뷰 분석을 병렬로 처리
    analyzed_reviews = []
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {
            executor.submit(analyze_review, r["content"], r["rating"]): r
            for r in reviews
        }
        for future, r in futures.items():
            try:
                analyzed = future.result(timeout=20)
                analyzed_reviews.append({
                    "rating": r["rating"],
                    "content": r["content"],
                    **analyzed,
                })
            except Exception as e:
                print(f"리뷰 분석 실패 (fallback): {e}")
                # 실패한 리뷰는 기본값으로 처리
                analyzed_reviews.append({
                    "rating": r["rating"],
                    "content": r["content"],
                    "trustScore": 50,
                    "trustLabel": "medium",
                    "flags": [],
                    "tasteProfile": {"spicy": 3, "texture": 3, "saltiness": 3, "sweetness": 3, "umami": 3},
                    "summary": "분석 불가",
                    "source": "default",
                })

    trust_scores = [r["trustScore"] for r in analyzed_reviews]
    raw_ratings = [r["rating"] for r in analyzed_reviews]

    weighted_rating_sum = 0
    weight_sum = 0

    for r in analyzed_reviews:
        weight = max(r["trustScore"], 1)
        weighted_rating_sum += r["rating"] * weight
        weight_sum += weight

    trusted_rating = round(weighted_rating_sum / weight_sum, 2) if weight_sum else 0

    restaurant_profile = {
        "spicy": round(average([r["tasteProfile"]["spicy"] for r in analyzed_reviews])),
        "texture": round(average([r["tasteProfile"]["texture"] for r in analyzed_reviews])),
        "saltiness": round(average([r["tasteProfile"]["saltiness"] for r in analyzed_reviews])),
        "sweetness": round(average([r["tasteProfile"]["sweetness"] for r in analyzed_reviews])),
        "umami": round(average([r["tasteProfile"]["umami"] for r in analyzed_reviews])),
    }

    suspicious_ratio = round(
        len([r for r in analyzed_reviews if r["trustLabel"] == "low"]) / len(analyzed_reviews) * 100,
        2
    ) if analyzed_reviews else 0

    result = {
        "id": restaurant["id"],
        "name": restaurant["name"],
        "category": restaurant.get("category", ""),
        "rawAverageRating": average(raw_ratings),
        "trustedAverageRating": trusted_rating,
        "averageTrustScore": average(trust_scores),
        "suspiciousReviewRatio": suspicious_ratio,
        "restaurantTasteProfile": restaurant_profile,
        "reviews": analyzed_reviews,
    }

    if user_profile:
        result["matchScore"] = get_match_score(user_profile, restaurant_profile)

    return result