import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Friends from './pages/Friends';
import MyDining from './pages/MyDining';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <YumProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/mydining" element={<MyDining />} />
          </Routes>
        </YumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
