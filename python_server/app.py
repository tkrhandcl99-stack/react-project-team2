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


if __name__ == "__main__":
    app.run(port=5001, debug=True)