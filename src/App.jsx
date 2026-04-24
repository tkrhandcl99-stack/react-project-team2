import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { YumProvider } from './contexts/YumContext';
import { TasteProfileProvider } from './contexts/TasteProfileContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Friends = lazy(() => import('./pages/Friends'));
const FriendDetail = lazy(() => import('./pages/FriendDetail'));
const MyDining = lazy(() => import('./pages/MyDining'));
const TasteProfileSettings = lazy(() => import('./pages/TasteProfileSettings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

// 비로그인 시 로그인 페이지로 리다이렉트
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <YumProvider>
          <TasteProfileProvider>
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
                  <p className="text-sm text-slate-400 font-medium">
                    불러오는 중...
                  </p>
                </div>
              }
            >
              <Routes>
                {/* 공개 라우트 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 로그인 필요 라우트 */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <PrivateRoute>
                      <Favorites />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <PrivateRoute>
                      <Friends />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/friends/:id"
                  element={
                    <PrivateRoute>
                      <FriendDetail />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mydining"
                  element={
                    <PrivateRoute>
                      <MyDining />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile/taste"
                  element={
                    <PrivateRoute>
                      <TasteProfileSettings />
                    </PrivateRoute>
                  }
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
