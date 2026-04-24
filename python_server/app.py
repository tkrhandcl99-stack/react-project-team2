from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

from review_analyzer import analyze_review
from recommender import aggregate_restaurant
from sample_data import sample_restaurants

app = Flask(__name__)
CORS(app)


def make_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1400,1200")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    )

    return webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=chrome_options
    )


def normalize_url(url: str):
    if not url:
        return None
    if url.startswith("http://"):
        return url.replace("http://", "https://")
    return url


def is_bad_image(url: str):
    if not url:
        return True

    lowered = url.lower()

    bad_keywords = [
        "logo",
        "icon",
        "svg",
        "profile",
        "marker",
        "favicon",
        "blank",
        "default",
        "ico",
        "localimages",
        "map_",
        "thumb_s",
        "storyicon",
        "emoticon",
        "badge",
    ]

    if any(keyword in lowered for keyword in bad_keywords):
        return True

    good_ext = [".jpg", ".jpeg", ".png", ".webp"]
    if not any(ext in lowered for ext in good_ext):
        return True

    return False


def get_visible_images(driver):
    script = """
    return Array.from(document.images).map((img) => {
      const rect = img.getBoundingClientRect();
      const style = window.getComputedStyle(img);

      return {
        src: img.currentSrc || img.src || "",
        x: rect.x || 0,
        y: rect.y || 0,
        width: Math.round(rect.width || img.naturalWidth || 0),
        height: Math.round(rect.height || img.naturalHeight || 0),
        naturalWidth: img.naturalWidth || 0,
        naturalHeight: img.naturalHeight || 0,
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
      };
    });
    """
    return driver.execute_script(script)


def score_image(img):
    src = img.get("src", "")
    x = img.get("x", 99999)
    y = img.get("y", 99999)
    width = max(img.get("width", 0), img.get("naturalWidth", 0))
    height = max(img.get("height", 0), img.get("naturalHeight", 0))

    if not src or is_bad_image(src):
        return None

    if width < 120 or height < 120:
        return None

    if img.get("display") == "none" or img.get("visibility") == "hidden":
        return None

    try:
        if float(img.get("opacity", 1)) == 0:
            return None
    except Exception:
        pass

    area = width * height
    score = area
    score += max(0, 3000 - (y * 3))
    score += max(0, 2000 - (x * 2))

    return {
        "src": src,
        "score": score,
        "width": width,
        "height": height,
        "x": x,
        "y": y,
    }


def get_best_image_from_page(driver):
    try:
        images = get_visible_images(driver)
        candidates = []

        for img in images:
            scored = score_image(img)
            if scored:
                candidates.append(scored)

        if not candidates:
            return None

        candidates.sort(key=lambda item: item["score"], reverse=True)
        return candidates[0]["src"]

    except Exception as e:
        print(f"[에러] 이미지 후보 분석 실패: {e}")
        return None


def get_og_image(driver):
    try:
        og = driver.execute_script("""
            const meta = document.querySelector('meta[property="og:image"]');
            return meta ? meta.content : null;
        """)
        if og and not is_bad_image(og):
            return og
    except Exception:
        pass
    return None


def get_kakao_first_photo(driver):
    """
    카카오맵 장소 페이지 대표(첫 번째) 사진을 직접 셀렉터로 추출.
    카카오맵은 동적 렌더링이므로 여러 셀렉터를 순서대로 시도.
    """
    selectors = [
        "div.photo_area img",
        "div.inner_photo img",
        "div.bg_photo img",
        "div.info_main img",
        "div.wrap_photo img",
        "div.thumb_g img",
        "ul.list_photo li:first-child img",
        "div.list_photo img",
        "section img",
    ]

    for selector in selectors:
        try:
            result = driver.execute_script(f"""
                const el = document.querySelector('{selector}');
                if (!el) return null;
                const src = el.currentSrc || el.src || el.getAttribute('data-src') || '';
                return src || null;
            """)
            if result and not is_bad_image(result):
                print(f"[셀렉터 성공] {selector} -> {result[:80]}")
                return result
        except Exception:
            continue

    return None


def get_kakao_image(place_url):
    place_url = normalize_url(place_url)
    if not place_url:
        return None

    driver = make_driver()

    try:
        driver.get(place_url)
        time.sleep(4)

        # 1순위: 카카오맵 대표(첫 번째) 사진 직접 타겟팅
        first_photo = get_kakao_first_photo(driver)
        if first_photo:
            return first_photo

        # 2순위: og:image 메타태그
        og_image = get_og_image(driver)
        if og_image:
            return og_image

        # 3순위: 페이지 전체에서 가장 큰 이미지 (기존 방식 fallback)
        best_image = get_best_image_from_page(driver)
        if best_image:
            return best_image

        return None

    except Exception as e:
        print(f"[에러] 이미지 추출 실패: {e}")
        return None

    finally:
        driver.quit()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "ok": True,
        "message": "python ai server running"
    })


@app.route("/api/get-image", methods=["GET"])
def get_image():
    url = request.args.get("url")
    url = normalize_url(url)

    print(f"[요청] place url: {url}")

    image_url = get_kakao_image(url)

    print(f"[응답] image url: {image_url}")

    return jsonify({
        "imageUrl": image_url
    })


@app.route("/api/analyze-review", methods=["POST"])
def api_analyze_review():
    data = request.get_json(silent=True) or {}

    review = data.get("review", "")
    rating = int(data.get("rating", 5))

    result = analyze_review(review, rating)
    return jsonify(result)


@app.route("/api/analyze-restaurant", methods=["POST"])
def api_analyze_restaurant():
    data = request.get_json(silent=True) or {}

    restaurant = data.get("restaurant")
    user_profile = data.get("userProfile")

    if not restaurant:
        return jsonify({
            "error": "restaurant 데이터가 필요합니다."
        }), 400

    result = aggregate_restaurant(restaurant, user_profile)
    return jsonify(result)


@app.route("/api/analyze-restaurants", methods=["POST"])
def api_analyze_restaurants():
    data = request.get_json(silent=True) or {}

    restaurants = data.get("restaurants", [])
    user_profile = data.get("userProfile")

    if not restaurants:
        return jsonify([])

    analyzed = [
        aggregate_restaurant(restaurant, user_profile)
        for restaurant in restaurants
    ]

    analyzed.sort(
        key=lambda x: (
            x.get("matchScore", 0),
            x["trustedAverageRating"],
            x["averageTrustScore"],
        ),
        reverse=True,
    )

    return jsonify(analyzed)


@app.route("/api/sample-restaurants", methods=["GET", "POST"])
def api_sample_restaurants():
    data = request.get_json(silent=True) or {}
    user_profile = data.get("userProfile")

    analyzed = [
        aggregate_restaurant(restaurant, user_profile)
        for restaurant in sample_restaurants
    ]

    analyzed.sort(
        key=lambda x: (
            x.get("matchScore", 0),
            x["trustedAverageRating"],
            x["averageTrustScore"],
        ),
        reverse=True,
    )

    return jsonify(analyzed)


def crawl_kakao_reviews(place_url: str, max_reviews: int = 10):
    """
    카카오맵 장소 페이지에서 후기 탭의 리뷰 텍스트와 별점을 크롤링.
    최대 max_reviews개 수집.
    """
    place_url = normalize_url(place_url)
    if not place_url:
        return []

    driver = make_driver()

    try:
        driver.get(place_url)
        time.sleep(3)

        # 후기 탭 클릭 시도 (카카오맵 후기 탭 셀렉터)
        tab_selectors = [
            "a[data-tab='comment']",
            "button[data-tab='comment']",
            "a.link_tab:nth-child(4)",
            "li.tab_item:nth-child(4) a",
            "[aria-label='후기']",
        ]

        for selector in tab_selectors:
            try:
                tab = driver.find_element("css selector", selector)
                tab.click()
                time.sleep(2)
                break
            except Exception:
                continue

        # 리뷰 텍스트 + 별점 추출
        reviews_data = driver.execute_script("""
            const results = [];

            // 카카오맵 리뷰 컨테이너 셀렉터들
            const selectors = [
                '.comment_item',
                '.review_item',
                '.list_review li',
                '.inner_review',
                '[data-testid="review-item"]',
            ];

            let items = [];
            for (const sel of selectors) {
                const found = document.querySelectorAll(sel);
                if (found.length > 0) {
                    items = Array.from(found);
                    break;
                }
            }

            for (const item of items.slice(0, 15)) {
                // 리뷰 텍스트
                const textEl = item.querySelector(
                    '.txt_comment, .review_text, .comment_text, p, span.txt'
                );
                const text = textEl ? textEl.innerText.trim() : '';

                // 별점 (aria-label, 클래스, 텍스트 등에서 추출)
                let rating = 5;
                const ratingEl = item.querySelector(
                    '[class*="star"], [class*="rating"], [aria-label*="점"]'
                );
                if (ratingEl) {
                    const label = ratingEl.getAttribute('aria-label') || '';
                    const match = label.match(/(\\d+(\\.\\d+)?)/);
                    if (match) rating = parseFloat(match[1]);

                    // 별 개수로 추정
                    const filled = item.querySelectorAll(
                        '[class*="fill"], [class*="on"], [class*="active"]'
                    ).length;
                    if (filled > 0 && filled <= 5) rating = filled;
                }

                if (text.length > 0) {
                    results.push({ content: text, rating: rating });
                }
            }
            return results;
        """)

        print(f"[리뷰 크롤링] {place_url} → {len(reviews_data)}개 수집")
        return reviews_data[:max_reviews]

    except Exception as e:
        print(f"[에러] 리뷰 크롤링 실패: {e}")
        return []
    finally:
        driver.quit()


@app.route("/api/crawl-and-analyze", methods=["POST"])
def api_crawl_and_analyze():
    """
    카카오맵 URL로 실제 리뷰를 크롤링한 뒤 신뢰도 분석하여 신뢰반영 평점 반환.
    크롤링 실패 시 샘플 리뷰로 fallback.
    """
    data = request.get_json(silent=True) or {}

    place_url = data.get("placeUrl", "")
    place_name = data.get("name", "")
    category = data.get("category", "맛집")
    user_profile = data.get("userProfile")

    # 실제 리뷰 크롤링 시도
    crawled_reviews = crawl_kakao_reviews(place_url, max_reviews=10)

    # 크롤링 실패 또는 리뷰 없으면 샘플 fallback
    if not crawled_reviews:
        print(f"[fallback] 크롤링 실패, 샘플 리뷰 사용: {place_name}")
        crawled_reviews = [
            {"rating": 5, "content": "맛있어요"},
            {"rating": 5, "content": "리뷰 이벤트 참여해서 방문했어요. 서비스 받았습니다."},
            {"rating": 4, "content": f"{place_name} 다녀왔어요. 식감이 쫄깃하고 감칠맛이 진해서 만족스러웠습니다. 직원도 친절하고 매장도 깔끔했어요."},
            {"rating": 3, "content": "맛은 담백하고 짜지 않아서 좋은데 웨이팅이 길어요. 가격 대비 양이 적은 편입니다."},
        ]

    restaurant = {
        "id": place_url,
        "name": place_name,
        "category": category,
        "reviews": crawled_reviews,
    }

    result = aggregate_restaurant(restaurant, user_profile)
    result["reviewCount"] = len(crawled_reviews)
    result["crawled"] = len(crawled_reviews) > 0

    return jsonify(result)


if __name__ == "__main__":
    app.run(port=5001, debug=True)