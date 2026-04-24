import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import { TasteProfileProvider } from './contexts/TasteProfileContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Friends = lazy(() => import('./pages/Friends'));
const FriendDetail = lazy(() => import('./pages/FriendDetail'));
const MyDining = lazy(() => import('./pages/MyDining'));
const TasteProfileSettings = lazy(() => import('./pages/TasteProfileSettings'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <YumProvider>
          <TasteProfileProvider>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-400 font-medium">
                      불러오는 중...
                    </p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/friends/:id" element={<FriendDetail />} />
                <Route path="/mydining" element={<MyDining />} />
                <Route
                  path="/profile/taste"
                  element={<TasteProfileSettings />}
                />
              </Routes>
            </Suspense>
          </TasteProfileProvider>
        </YumProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
