// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // 로그인 엔진 추가
import { getFirestore } from 'firebase/firestore'; // 데이터 창고 추가

const firebaseConfig = {
  apiKey: 'AIzaSyBNRZuMo1qnf5J9MUK7lhEJmsS66CcVsLw',
  authDomain: 'yumpick-5cddd.firebaseapp.com',
  projectId: 'yumpick-5cddd',
  storageBucket: 'yumpick-5cddd.firebasestorage.app',
  messagingSenderId: '872421974678',
  appId: '1:872421974678:web:819bc92b539638e93518b7',
  measurementId: 'G-HNMQ7NFQFQ',
};

// 1. Firebase 초기화
const app = initializeApp(firebaseConfig);

// 2. 서비스들 불러오기
export const auth = getAuth(app); // 'auth'라는 이름으로 내보냄
export const db = getFirestore(app); // 'db'라는 이름으로 내보냄

export default app;
