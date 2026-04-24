import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Soup, Candy, Sparkles, Salad } from 'lucide-react';
import Header from '../components/Dashboard/Header';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FloatingActions from '../components/common/FloatingActions';
import TasteRadar from '../components/common/TasteRadar';
import { useAuth } from '../contexts/AuthContext';
import { useTasteProfile } from '../contexts/TasteProfileContext';

const sliderMeta = [
  {
    key: 'spicy',
    label: '맵기',
    left: '순한맛',
    right: '매운맛',
    icon: Flame,
    valueLabels: ['매우 순함', '순함', '보통', '매콤함', '아주 매움'],
  },
  {
    key: 'texture',
    label: '식감',
    left: '부드러움',
    right: '아삭함',
    icon: Salad,
    valueLabels: ['매우 부드러움', '부드러움', '보통', '아삭함', '아주 아삭함'],
  },
  {
    key: 'saltiness',
    label: '염도',
    left: '심심함',
    right: '짭짤함',
    icon: Soup,
    valueLabels: ['매우 담백', '저염', '보통', '짭짤함', '아주 짬'],
  },
  {
    key: 'sweetness',
    label: '단맛',
    left: '안 단맛',
    right: '달콤함',
    icon: Candy,
    valueLabels: ['전혀 안 달음', '덜 달음', '보통', '달콤함', '아주 달콤함'],
  },
  {
    key: 'umami',
    label: '감칠맛',
    left: '깔끔함',
    right: '진한 풍미',
    icon: Sparkles,
    valueLabels: ['매우 깔끔', '깔끔함', '보통', '풍부함', '아주 진함'],
  },
];

const TasteProfileSettings = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle, logout } = useAuth();
  const { tasteProfile, updateTasteProfile } = useTasteProfile();

  const [activeTab, setActiveTab] = useState('home');
  const [form, setForm] = useState(tasteProfile);

  const currentSummary = useMemo(() => {
    return sliderMeta.reduce((acc, item) => {
      acc[item.key] = item.valueLabels[(form[item.key] ?? 3) - 1];
      return acc;
    }, {});
  }, [form]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  const handleSave = () => {
    updateTasteProfile(form);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 pb-24">
      <Header
        user={user}
        loginWithGoogle={loginWithGoogle}
        logout={logout}
        navigate={navigate}
      />

      <main className="max-w-md mx-auto px-4 pt-24 pb-8 space-y-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Taste Profile Settings</h1>
            <p className="text-sm text-slate-500">
              내 입맛을 5가지 기준으로 설정해보세요.
            </p>
          </div>
        </div>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
              Preview
            </span>

            <TasteRadar profile={form} size={250} showLabels />

            <div className="grid grid-cols-2 gap-2 w-full">
              {sliderMeta.map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl bg-orange-50 px-3 py-2 text-center"
                >
                  <div className="text-[11px] text-slate-500">{item.label}</div>
                  <div className="text-sm font-bold text-[#F05A28]">
                    {currentSummary[item.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-6">
          {sliderMeta.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-semibold text-slate-800">
                    <Icon size={18} className="text-[#F05A28]" />
                    {item.label}
                  </label>

                  <span className="text-xs font-bold text-[#F05A28] bg-orange-50 px-3 py-1 rounded-full">
                    {currentSummary[item.key]}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={form[item.key]}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  className="w-full accent-[#F05A28] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>{item.left}</span>
                  <span>{item.right}</span>
                </div>
              </div>
            );
          })}
        </section>

        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-[#F05A28] text-white rounded-full font-bold shadow-md shadow-orange-100 active:scale-95 transition-all"
          >
            설정 완료
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full h-12 text-slate-500 font-medium"
          >
            취소
          </button>
        </div>
      </main>

      <FloatingActions />

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default TasteProfileSettings;
