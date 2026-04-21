import Dashboard from './pages/Dashboard'; // Dashboard 파일 경로 확인!
import './index.css'; // 테일윈드가 들어있는 CSS 불러오기
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
