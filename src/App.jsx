import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Friends from './pages/Friends';
import MyDining from './pages/MyDining';
import TasteProfileSettings from './pages/TasteProfileSettings';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import { TasteProfileProvider } from './contexts/TasteProfileContext';
import FriendDetail from './pages/FriendDetail';

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
              <Route path="/mydining" element={<MyDining />} />
              <Route path="/profile/taste" element={<TasteProfileSettings />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/friends/:id" element={<FriendDetail />} />
              
            </Routes>
          </TasteProfileProvider>
        </YumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
