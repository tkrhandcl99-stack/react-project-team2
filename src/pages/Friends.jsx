import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Dashboard/NavigationBar';
import FriendCard from '../components/Friends/FriendCard';

const initialFriends = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    username: 'foodie_elena',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdQTpncv7kzwX4EmENTvOTezpRGWe4DBpRrQlKSpYznzctu_PPP_-oGCnW8Ppe4HT51zjVh-IHMipswyplRl8dFC7yhJSXDQzY_K4ZYVDoK5EBKuv9aZolWxaKmpFu9iXSlvPd5hHNR_vugvZNOoMKutJwyG_0ZDCv995KTZpm4sftKNrN9Beg8m6eVdjx43GsbNPFaZCctbHEh8FAX5pwbPMcxBbstGHjtDCB1tnIsLX7-CQrmYK1zvZKb99BwNdtSnsDEPNp-TzV',
    radarPoints: '50,15 85,45 70,80 40,75 20,40',
    tags: ['Umami Expert', 'Spicy Hunter'],
  },
  {
    id: 2,
    name: 'Marcus Chen',
    username: 'marcus_eats',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAG8q4PIalMK9L96Iqz7pJTntY1NajB5quH6Ljrik5dPDZjns3y0-5Sc33BjalfBzaxq-Ldbb7mEwtTWvB6VGse2F7LqUiXfSzBvLnSHPtk1Ts1iUwfdLUUGjDzVl8JLnkrKdqd43rPoQ5fEQ4FVcxFZAQttD7TLN2J4Wcm4qkEP7l2wVcYsH2cz1vFMRXjM-7KjQ_OravneRNaZIzD803VpNM_n-Uy1BOzKZfYtUDEMDSG2NUSwfK2nUgcK2WZCgePkCFo8jbg18tN',
    radarPoints: '50,30 90,40 60,70 30,85 10,40',
    tags: ['Sweet Tooth', 'Pastry Critic'],
  },
  {
    id: 3,
    name: 'Sarah Jenkins',
    username: 'sarah_j_cooks',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBhWxa4t29IuP_vikzAdWtP1cbhA0twQ6CEnvAh2InpsmHI3HejvvmZx4qlPuW0Dpm88NfhH4VwfEStgWFSj9wu4HGM2SwRQ9Up46HdhbmAs03q7UwlUtRIjeDtK-hdccrS5BoU4eGPWU4L0UNjDPQv84zLfv8TM5LklufTaAeYGKUzqClWifdd-hJ6BhTKGIPojKIvmiBsUSBgWREWswCgw3kg6dzQV_sP0NBa784uofIo-w3rC55vfBzX3HuYgVKCsOuHddCLUH8h',
    radarPoints: '50,45 60,35 90,85 60,95 30,50',
    tags: ['Salty Snack Hero', 'Wine Taster'],
  },
];

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState(initialFriends);

  const filteredFriends = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return friends;

    return friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(q) ||
        friend.username.toLowerCase().includes(q),
    );
  }, [friends, query]);

  const handleDelete = (friendId) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
  };

  const handleViewProfile = (friend) => {
    alert(`${friend.name} 프로필은 나중에 연결하면 돼`);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-slate-900 pb-24">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-md mx-auto h-16 px-5 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 active:scale-95 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-xl font-extrabold text-[#ff5722]">
            Friends Circle
          </h1>

          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-6 pb-8">
        <section className="mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-900">Friends Circle</h2>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Find friends or invite by email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff5722] focus:border-[#ff5722] transition-all outline-none"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {filteredFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onDelete={handleDelete}
              onViewProfile={handleViewProfile}
            />
          ))}

          <button
            type="button"
            className="bg-[#ffefe8] rounded-2xl p-6 border-2 border-dashed border-[#ff5722] flex flex-col items-center justify-center text-center gap-4 hover:bg-[#ffe4d8] transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#ff5722] shadow-sm">
              <UserPlus size={30} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Find More Friends
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Connect with fellow foodies and share your dining secrets.
              </p>
            </div>
          </button>
        </section>
      </main>

      <NavigationBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Friends;
