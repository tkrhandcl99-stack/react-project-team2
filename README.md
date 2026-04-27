# 🍽️ YumPick — 취향 기반 맛집 추천 서비스

## ✨ 프로젝트 기획 의도

> **"별점만 보고 갔다가 실망한 적 있으신가요?"**

기존 맛집 앱(카카오맵, 네이버 지도 등)을 쓰면서 공통적으로 느낀 불편함이 있었습니다.

- ❌ 리뷰 이벤트로 작성된 **가짜 리뷰**가 평점을 올려놓는 구조
- ❌ 모든 사람에게 **같은 식당을 추천**하는 개인화 부재
- ❌ **단순 평점 평균**만으로는 진짜 맛집을 가려낼 수 없음

그래서 저희는 다음과 같은 기능을 갖춘 웹앱을 기획했습니다:

- ✅ **리뷰 신뢰도 AI 분석** — 이벤트성·단순 리뷰를 필터링한 신뢰반영 평점 계산
- ✅ **입맛 프로필 기반 맞춤 추천** — 맵기·식감·염도·단맛·감칠맛 5축으로 개인화
- ✅ **친구 입맛 비교** — 함께 가기 좋은 식당 추천
- ✅ **카카오맵 연동** — 내 위치 기반 주변 맛집 탐색

> 별점이 아닌 **나의 취향**이 기준이 되는 맛집 탐색 서비스를 만들었습니다.

---

## 👥 팀원 & 역할 분담

| 이름 | 역할 |
| --- | --- |
| **이재원** | 로그인 기능, 카카오맵 API 연동, 지도 마커 상세 카드, AI 리뷰 분석 시스템, 입맛 일치도 계산, 이미지 크롤링, 성능 최적화, 코드 스플리팅 |
| **복영재** | 전체 UI/UX 구조 설계, 프로필 시스템, 레이더 차트 ①, 친구 기능 전담, TasteProfileContext 전역 상태 관리 |
| **김태환** | AI 챗봇 기능, 마이다이닝, 하단 UI, 푸터 영역, 전체 QA |

> ① **레이더 차트**: 맵기·식감·염도·단맛·감칠맛 5가지 입맛 수치를 오각형 형태로 시각화한 그래프입니다. SVG로 직접 구현했으며, 수치가 높을수록 해당 꼭짓점이 바깥쪽으로 넓어지는 구조입니다.
---

## 🛠️ 핵심 기능

| 기능 | 설명 |
| --- | --- |
| **📌 CRUD** | 찜 추가/삭제/메모수정, 방문기록 추가, 친구 추가/삭제 |
| **🚀 SPA + 라우터** | React Router 기반 단일 페이지 애플리케이션 |
| **🧩 코드 스플리팅** | React `lazy` + `Suspense` 적용 — 번들 449KB → 184KB (59% 감소) |
| **⚡ 성능 최적화** | `useRef` 무한루프 방지, `useMemo` 의존성 최적화 — 렌더링 2,745회 → 8회 |
| **🗺️ 외부 API 연동** | Kakao Map API (위치 기반 맛집 마커), Geolocation API |
| **🤖 AI 분석** | Python rule-based 리뷰 신뢰도 분석 + Ollama 로컬 LLM 챗봇 |
| **👤 입맛 프로필** | 5축 레이더 차트 시각화, localStorage 연동으로 새로고침 후에도 유지 |
| **👫 친구 기능** | 고유 ID 기반 친구 추가, 입맛 비교, 함께 가기 좋은 식당 추천 |
| **🔍 이미지 크롤링** | Flask + Selenium으로 카카오맵 식당 이미지 자동 수집 |

---

## 📦 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| **Frontend** | React (Vite), Tailwind CSS, React Router, Lucide React |
| **Backend** | Python Flask, Selenium, Express.js |
| **AI / 분석** | Ollama (llama3 로컬 LLM), rule-based 리뷰 분석 |
| **외부 API** | Kakao Map API, Geolocation API |
| **상태 관리** | Context API (AuthContext, YumContext, TasteProfileContext) |
| **데이터 저장** | localStorage |

---

## 🛠️ 사용 라이브러리

```bash
# React 관련
yarn add axios react-router-dom sass classnames react-icons react-virtualized styled-components

# Firebase / UI
npm install firebase lucide-react axios express cors

# Python 서버
pip install flask flask-cors selenium webdriver-manager requests
```

---

## ▶️ 실행 방법

### 사전 설치

1. [Ollama](https://ollama.com/) 설치 후 실행
2. `ollama pull llama3` 명령어로 모델 다운로드
3. 위 라이브러리 전체 설치

### 서버 실행 (터미널 4개 필요)

```bash
# 터미널 1 — Ollama AI 서버 (재부팅 후 아이콘 없을 때만)
ollama serve

# 터미널 2 — Express 챗봇 서버
node server.js

# 터미널 3 — React 앱
npm run dev

# 터미널 4 — Python 분석 서버
cd python_server
python app.py
```

> ⚠️ 재부팅 후 시스템 트레이에 Ollama 아이콘이 있으면 터미널 1은 생략해도 됩니다.

---

## 🏗️ 컴포넌트 구조

```
컴포넌트 분리 구조

Dashboard
├── ProfileCard            → 사용자 프로필 + 레이더 차트
├── AiRecommendationPanel  → AI 입맛 분석 추천
├── KakaoMap               → 지도 + 마커 + 상세 카드
└── RestaurantList         → 근처 맛집 리스트

Custom Hook 분리
├── useKakaoMap            → 지도 초기화 로직
├── useCurrentLocation     → 내 위치 마커 렌더링
├── usePlaceImage          → Flask 이미지 크롤링 요청
├── usePlaceSearch         → 키워드/위치 기반 장소 검색
└── useInputs              → useReducer 기반 입력 상태 관리

Context 분리
├── AuthContext            → 로그인 상태
├── YumContext             → 찜 / 방문기록 / 친구
└── TasteProfileContext    → 입맛 프로필 5축 전역 관리
```

---

## 🛣️ 라우팅 구조

```
/ → Dashboard (홈)
/favorites → 찜 목록
/friends → 친구 페이지
/friends/:id → 친구 상세 프로필
/mydining → 마이다이닝
/profile/taste → 입맛 설정
/login → 로그인
/register → 회원가입
```

---

## ⚡ 성능 최적화

### 1. 무한 렌더링 방지 (useRef + 의존성 최적화)

AI 분석 완료 후 `onAnalyzed` 콜백 실행 시 무한 재렌더링이 발생하는 문제를 발견하고 해결했습니다.

```jsx
// Before — onAnalyzed를 의존성에 직접 포함 → 무한 루프
}, [tasteProfile, nearbyWithin5km, currentLocation, onAnalyzed]);

// After — useRef로 감싸서 의존성 제외 + ID 문자열로만 비교
const onAnalyzedRef = useRef(onAnalyzed);
const restaurantIds = nearbyRestaurants.map(r => r.id).join(',');
}, [restaurantIds, currentLocation, tasteProfile]);
```

> React Profiler 기준 렌더링 횟수 **2,745회 → 8회** 감소

### 2. 코드 스플리팅 (lazy / Suspense)

모든 페이지를 `lazy()`로 분리하여 필요한 시점에만 로드합니다.

```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Friends   = lazy(() => import('./pages/Friends'));
// ...
```
before
<img width="581" height="376" alt="image" src="https://github.com/user-attachments/assets/eedbae38-d701-4a1e-8776-1ede1d2e9aa2" />
after
<img width="579" height="248" alt="image" src="https://github.com/user-attachments/assets/47240108-9ab9-441a-8a2e-bd538e3e5c49" />

> 초기 번들 크기 **449KB → 184KB** (약 59% 감소)

---

## 🤖 AI 리뷰 신뢰도 분석 시스템

단순 별점이 아닌 리뷰 품질을 분석해 신뢰반영 평점을 계산하는 rule-based 시스템입니다.

| 리뷰 유형 | 신뢰 점수 변화 |
| --- | --- |
| 기본값 | 50점 |
| `"맛있어요"` (6자 미만 단순 리뷰) | -35점 |
| 별점 5점 + 짧은 리뷰 조합 | 추가 -20점 |
| `"리뷰 이벤트 참여"` 포함 | -40점 |
| 맛/식감 구체적 언급 | +15점 |
| 서비스/위생 언급 | +8점 |
| 구체적인 부정 리뷰 | +10점 |

---

## 📊 입맛 일치도 계산 방식

입맛 일치도(%)는 사용자의 입맛 프로필과 식당의 리뷰 기반 맛 프로필을 **5개 축별로 비교**해 계산합니다.

```python
def get_match_score(user_profile, restaurant_profile):
    diffs = []
    for key in ["spicy", "texture", "saltiness", "sweetness", "umami"]:
        diffs.append(abs(user_profile.get(key, 3) - restaurant_profile.get(key, 3)))

    total_diff = sum(diffs)
    max_diff = 5 * 4  # 각 축 최대 차이 4점 × 5개 = 20
    score = round((1 - total_diff / max_diff) * 100)
    return max(0, min(100, score))
```

예를 들어 사용자의 맵기가 5, 식당의 맵기 프로필이 3이면 차이가 2점입니다. 5개 축의 차이를 모두 합산한 뒤 최대 가능한 차이(20점)와 비교해 **차이가 적을수록 높은 퍼센트**가 나옵니다. 식당의 맛 프로필은 리뷰 텍스트를 분석해 추출한 값을 평균낸 것입니다.

### 리뷰에서 맛 수치를 뽑는 방식

리뷰 텍스트 1개당 5개 축의 수치를 추출하고, 전체 리뷰의 평균을 내서 식당의 맛 프로필을 만듭니다.
모든 항목은 기본값 **3**에서 시작하고 키워드 포함 여부에 따라 +1 / -1 조정됩니다.

| 항목 | 수치 올라가는 키워드 | 수치 내려가는 키워드 |
| --- | --- | --- |
| 맵기 | 맵, 매콤, 얼큰, 칼칼, 자극적 | 안 맵, 맵지 않 |
| 식감 | 바삭, 아삭, 쫄깃 | 부드럽, 물컹 |
| 염도 | 짜, 짭짤, 간이 세 | 싱겁, 담백 |
| 단맛 | 달, 달콤, 단맛, 디저트 | 안 달 |
| 감칠맛 | 감칠, 진하, 풍부, 불향, 고소 | (없음) |

예를 들어 `"쫄깃하고 얼큰한 국물"` 리뷰라면 맵기 4, 식감 4, 나머지 3이 됩니다.
식당 전체 리뷰에서 이 값들을 평균 내어 식당의 최종 맛 프로필로 사용합니다.

---

## 🔧 주요 트러블슈팅

| 문제 | 원인 | 해결 |
| --- | --- | --- |
| 카카오맵 팝업 차단 | `window.open` 브라우저 차단 정책 | `<a>` 태그 동적 생성 방식으로 교체 |
| AI 추천 항상 같은 점수 | 카테고리 구분 없이 단일 샘플 리뷰 사용 | 카테고리별 샘플 리뷰 분리 (중식/일식/카페/고기 등) |

---

## 📅 개발 일지

| 날짜 | 주요 작업 |
| --- | --- |
| 04.21 (월) | 프로젝트 킥오프, 역할 분담 확정, Vite 초기 세팅, Ollama(llama3) 연동 확인, 각자 담당 영역 첫 구현 시작 |
| 04.22 (화) | UI 고도화 및 레이아웃 충돌 해결, Python Flask 서버 구축, Selenium 이미지 크롤링 설계, AI 챗봇 대화창 UI 구현, 로그인·비로그인 분기 처리 |
| 04.23 (수) | AI 리뷰 신뢰도 분석 rule-based 시스템 구현, 입맛 일치도 계산 로직 구현, 친구 탭 1차 구현 (목록·레이더 비교·추천), 마이다이닝 구현 (최대 10개 최신순) |
| 04.24 (목) | 브랜치 통합 및 충돌 해결, 무한 렌더링 문제 발견 및 해결, React Profiler Before/After 캡처, 코드 스플리팅 적용, 신뢰반영 별점 찜·마이다이닝 전체 적용 |
| 04.25 (금) | 지도 마커 상세보기 클릭 시 마이다이닝 자동 저장 수정, 입맛 분석 카테고리별 차등 적용, 프로필 태그 overflow 버그 수정, 전체 기능 QA 및 발표 자료 준비 |
| 04.27 (월) | 최종 버그 수정 (찜 메모 저장, 친구 삭제, 기본 아바타), AI 분석 대상 식당 수 최적화 (가까운 10개), 고유 ID 표시 수정, GitHub README 작성 및 최종 푸시 |

---

플로우 이미지
```mermaid
flowchart TD
    A([앱 시작 main.jsx]) --> B[Provider 세팅 App.jsx\nAuthProvider / YumiProvider / TasteProfileProvider]
    B --> C{로그인 상태 확인\nPrivate Route - useAuth}
    C -->|미로그인| D[/login\nLogin 페이지]
    C -->|로그인됨| E[세션 복원\nlocalStorage → yumpick_current_user]
    D --> F[/register\nRegister 페이지]
    F --> G[회원 가입] --> H[고유 번호 8자리 생성]
    E --> I[React Router 라우팅]
    C -->|바로가기 시 로그인 유도| I

    I --> J[Dashboard]
    I --> K[Friends]
    I --> L[TasteProfile]
    I --> M[Favorites]
    I --> N[MyDining]

    J --> J1[Header / ProfileCard\nKakaoMap / RestaurantList\nFloatingActions / NavigationBar]
    J1 --> J2[위치 획득\nnavigator.geolocation → lat/lng]
    J2 --> J3[장소 추천\nKakao Places API]
    J3 --> J4[최시 목록 표시]
    J4 --> J5[백그라운드 이미지]
    J1 --> BOT[AIChatbox 열기]
    BOT --> MAP[카드 → 지도 연동]
    MAP --> JS[카카오 js API 호출]

    K --> K1[일괄처리\nAIRecommendationPanel]
    K1 --> K2[Python Flask API 호출]
    K2 --> K3[Selenium 크롤링]
    K3 --> K4[신뢰 랭킹 분석]
    K --> K5[Friends 목록\nuserFriends(user) → localStorage]
    K5 --> K6[친구 ID 검색\nFriendSearchBar → handleAdd...]
    K6 --> K7[findUserById]
    K7 --> K8[친구 추가 성공\ntasteProfile 생성 + 저장]

    M --> M1[/friendsList]
    M1 --> M2[FriendProfileCard\nTasteRadar 레이더 차트 표시]
    M2 --> M3[FriendRecommendSection\ntasteDatabase → 음식 추천]

    N --> N1[visitHistory 최대 30개 표시] --> N2[방문 기록]
    N --> N3[팀 목록 + 배열판업]
    N3 --> N4[팀 관리]

    L --> L1[TasteProfileSettings]
    L1 --> L2[form제출 슬롯 표시]
    L2 --> L3[TasteSlider x5]
    L3 --> L4[TasteRadar 실시간 미리보기]
    L4 --> L5[설명 완료 버튼\nupdateTasteProfile(form)]
    L5 --> L6[useEffect → localStorage]
    L1 --> L7[초기화 버튼\nresetTasteProfile]
```




## 🙌 마무리

YumPick은 단순히 맛집을 보여주는 것을 넘어, **리뷰의 신뢰도**와 **개인의 입맛 데이터**를 결합해 진짜 나에게 맞는 식당을 찾아주는 서비스입니다.

현재는 localStorage 기반으로 동작하지만, Firebase 연동을 통해 실제 멀티유저 환경에서도 친구 추가·입맛 공유가 가능하도록 확장 가능한 구조로 설계되어 있습니다.

앞으로 친구 두 명의 입맛을 동시에 고려한 AI 상황 맞춤 추천 기능으로 발전시킬 계획입니다. 🍽️
