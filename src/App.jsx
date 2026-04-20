import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import { YumProvider } from './contexts/YumContext';

function App() {
  return (
    <YumProvider>
      <Router>
        {/* 메뉴 바 - 나중에 예쁘게 바꿀 거니까 일단 작동 확인용! */}
        <nav style={{ padding: '10px', background: '#eee' }}>
          <Link to="/" style={{ marginRight: '10px' }}>
            지도
          </Link>
          <Link to="/favorites">찜 목록</Link>
        </nav>

        <Routes>
          {/* / 주소로 오면 Home 컴포넌트를 보여줘라 */}
          <Route path="/" element={<Home />} />
          {/* /favorites 주소로 오면 Favorites 컴포넌트를 보여줘라 */}
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </YumProvider>
  );
}

export default App;
