import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Friends from './pages/Friends';
import FriendDetail from './pages/FriendDetail';
import MyDining from './pages/MyDining';
import TasteProfileSettings from './pages/TasteProfileSettings';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import { TasteProfileProvider } from './contexts/TasteProfileContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <YumProvider>
          <TasteProfileProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/friends/:id" element={<FriendDetail />} />
              <Route path="/mydining" element={<MyDining />} />
              <Route path="/profile/taste" element={<TasteProfileSettings />} />
            </Routes>
          </TasteProfileProvider>
        </YumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
