import React, { useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 
import { YumProvider } from './contexts/YumContext'; 
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';

// App.jsx
function App() {
const [userProfile, dispatch] = useReducer(
  (state, action) => {
    if (action.type === 'UPDATE') {
      // 💡 새로운 객체를 생성하여 리턴함으로써 리액트가 변경을 감지하게 합니다.
      return { ...state, ...action.payload };
    }
    return state;
  },
  {
    nickname: '미식탐험가',
    moreSpicy: 3, 
    moreSalty: 3,
    softness: 3, 
    crunchyTexture: 3,
    spices: 3,
    photoURL: null
  }
);

const handleUpdate = (newData) => {
  console.log("데이터 업데이트 시도:", newData);
  dispatch({ type: 'UPDATE', payload: newData });
};

  return (
    <AuthProvider> 
      <YumProvider>
        <Router>
          <Routes>
          <Route path="/" element={<Dashboard userProfile={userProfile} onUpdate={handleUpdate} />} />
          <Route path="/dashboard" element={<Dashboard userProfile={userProfile} onUpdate={handleUpdate} />} />
          <Route path="/edit-profile" element={<EditProfile userProfile={userProfile} onUpdate={handleUpdate} />} />
        </Routes>
        </Router>
      </YumProvider>
    </AuthProvider>
  );
}

export default App;