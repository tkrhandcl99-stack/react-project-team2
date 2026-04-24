import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.password || !form.passwordConfirm) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (form.name.length < 2) {
      setError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const result = register(form.name, form.password);
    if (result.success) {
      setSuccess(result.user);
    } else {
      setError(result.message);
    }
  };

  // 회원가입 성공 화면
  if (success) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            가입 완료!
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            회원가입이 완료되었어요.
            <br />
            아래 고유 ID를 기억해두세요!
          </p>

          {/* 고유 ID 표시 */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 mb-6">
            <p className="text-xs text-slate-400 mb-1">나의 고유 ID</p>
            <p className="text-2xl font-black text-[#F05A28] tracking-widest">
              {success.id}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              친구에게 이 ID를 알려주세요!
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-[#F05A28] text-white rounded-xl font-bold active:scale-95 transition-all"
          >
            시작하기
          </button>
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-slate-900 mb-6">회원가입</h2>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="닉네임 (2자 이상)"
              value={form.name}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F05A28] text-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (4자 이상)"
              value={form.password}
              onChange={handleChange}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#F05A28] text-sm"
            />
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              value={form.passwordConfirm}
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
            회원가입
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-slate-400">
              이미 계정이 있으신가요?{' '}
            </span>
            <Link to="/login" className="text-sm font-bold text-[#F05A28]">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
