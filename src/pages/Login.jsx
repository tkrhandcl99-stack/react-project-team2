import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.password) {
      setError('닉네임과 비밀번호를 입력해주세요.');
      return;
    }

    const result = login(form.name, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#F05A28] mb-2">GIMIBOK</h1>
          <p className="text-slate-400 text-sm">취향 기반 맛집 추천 서비스</p>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6">로그인</h2>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="닉네임"
              value={form.name}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F05A28] text-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F05A28] text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full h-12 bg-[#F05A28] text-white rounded-xl font-bold active:scale-95 transition-all shadow-md shadow-orange-100"
          >
            로그인
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-slate-400">계정이 없으신가요? </span>
            <Link to="/register" className="text-sm font-bold text-[#F05A28]">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
