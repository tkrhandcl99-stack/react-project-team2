import axios from 'axios';

const AI_BASE_URL = 'http://localhost:5001';

export const analyzeReview = async (review, rating = 5) => {
  const response = await axios.post(`${AI_BASE_URL}/api/analyze-review`, {
    review,
    rating,
  });
  return response.data;
};

export const analyzeRestaurant = async (restaurant, userProfile) => {
  const response = await axios.post(`${AI_BASE_URL}/api/analyze-restaurant`, {
    restaurant,
    userProfile,
  });
  return response.data;
};

export const analyzeRestaurants = async (restaurants, userProfile) => {
  const response = await axios.post(`${AI_BASE_URL}/api/analyze-restaurants`, {
    restaurants,
    userProfile,
  });
  return response.data;
};

// 카카오맵 실제 리뷰 크롤링 후 신뢰도 분석
export const crawlAndAnalyze = async (
  placeUrl,
  name,
  category,
  userProfile,
) => {
  const response = await axios.post(`${AI_BASE_URL}/api/crawl-and-analyze`, {
    placeUrl,
    name,
    category,
    userProfile,
  });
  return response.data;
};
