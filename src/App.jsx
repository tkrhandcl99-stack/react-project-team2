import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <YumProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </BrowserRouter>
      </YumProvider>
    </AuthProvider>
  );
}

export default App;
