import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 1. 라우터 컴포넌트 임포트
import Dashboard from './pages/Dashboard';
<<<<<<< HEAD
import Favorites from './pages/Favorites'; // 2. 찜 목록 페이지 임포트
=======
import Favorites from './pages/Favorites';
import Friends from './pages/Friends';
import MyDining from './pages/MyDining';
import TasteProfileSettings from './pages/TasteProfileSettings';
>>>>>>> c278fb9df2eb3c37725e22bb490455ce4947fa76
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import { TasteProfileProvider } from './contexts/TasteProfileContext';

function App() {
  return (
    <Router>
      {' '}
      {/* 3. 앱 전체를 Router로 감싸야 useNavigate를 쓸 수 있습니다 */}
      <AuthProvider>
        <YumProvider>
<<<<<<< HEAD
          <Routes>
            {/* 메인 대시보드 주소 */}
            <Route path="/" element={<Dashboard />} />

            {/* 찜 목록 페이지 주소 (태환님 추가분) */}
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
=======
          <TasteProfileProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/mydining" element={<MyDining />} />
              <Route path="/profile/taste" element={<TasteProfileSettings />} />
            </Routes>
          </TasteProfileProvider>
>>>>>>> c278fb9df2eb3c37725e22bb490455ce4947fa76
        </YumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
