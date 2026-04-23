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
