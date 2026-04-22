import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Dashboard/NavigationBar';
import RestaurantHistoryCard from '../components/MyDining/RestaurantHistoryCard';

const restaurants = [
  {
    id: 1,
    name: "Trattoria L'Isola",
    category: 'ITALIAN',
    reviews: '1,240',
    price: '$$$',
    rating: 4.8,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPIx5_cM8dIfYESzuBB7F6ziobR1YNfe4YExaFaLxnuIRlNwnBpSpOSJ2Zc0Xv-d3nd09pE7F899OFPXI8NhItePKsmIzrnkOhafDZmNq--8z7rC_yUjALrdTPvCWJb9J0ok2jVE-9xZ-P86SoViTf9o_itJEuXFvjMfWWPevpI-FlJVgTlXl4Ot8QakhwwK7r8K5FDllMUYIs1zs26giivJctLtLNM1UdjbRmZ3igBH3e9sjV6Pa8EV_QS_Aa__yjTxK1nBJLqpj9',
    quote:
      'The handmade pappardelle was life-changing. Truly authentic Roman flavors in the heart of the city.',
    author: 'MARCO R.',
  },
  {
    id: 2,
    name: 'Mizu Omakase',
    category: 'JAPANESE',
    reviews: '850',
    price: '$$$$',
    rating: 4.9,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlyhOztn3c-ADtCP8XMYvo2jJRMp8w31U7zG_xwaf7GbYemtEiQO_iSS2RC0Ia_3KESDVkjrODY-bU-zbEeGkkbQB3ymE5zz-OspWVAbILzd8MetbVruTSh-5KAYmgCSnEe4DvmyZn90eRQaYQIq8WgpphSzrf5OHlmYiJkPpFT_wHDiHZepHZK9BDlkPN-QjlhOo5g2l0WJei_CrWeWjGGk3LkGs7SmRq0hPM2EHnuq3DvRtB4CfUZhFv_F2V-_zfZex3DV18MWFK',
    quote:
      'An incredible intimate experience. The chef explained every single piece of nigiri. High precision.',
    author: 'SARAH L.',
  },
  {
    id: 3,
    name: 'The Ember Pit',
    category: 'BBQ & GRILL',
    reviews: '2,100',
    price: '$$',
    rating: 4.6,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_qVPnQPUimi0lt-x_2Sy6OWmlAWesivafpXm2LCNGZ7Ko_5ITrSfLlyGvnynmh4dzRRfd8H4c1kfkkZ6vfwUv4lkOqJ9vno-4S6rgFVNdKje5z4Mk5x-sjG5-O3iGjy4dXb2iqN3Q30PDwR46ailxQkwPWYLONLzAk5kinlifRW0UDnrlb-4UpLg4qsiQBrTLMuWYBj3sHa-zXYuERpwBFvwRrkk8cVR-I2i2LQU5jIyOeZI363VBRAkBaCozlMVEKkS5NScMWuDV',
    quote:
      'Fall-off-the-bone tender. The smoky aroma hits you before you even enter the door. Great value!',
    author: 'DAVID K.',
  },
];

const statItems = [
  { label: 'Cuisine Variety', value: 85 },
  { label: 'Booking Reliability', value: 98 },
];

const MyDining = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mydining');

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

          <h1 className="text-xl font-extrabold text-[#F05A28]">My Dining</h1>

          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-6 space-y-8">
        <section>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
            My Dining
          </h1>
          <p className="text-base text-slate-400">
            Your personal flavor journey and history.
          </p>
        </section>

        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Recently Viewed Restaurants
            </h2>
            <button className="text-[#F05A28] text-xs font-semibold hover:underline">
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantHistoryCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Dining Statistics</h3>

            <div className="space-y-5">
              {statItems.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className="text-sm font-semibold text-[#F05A28]">
                      {item.value}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#F05A28] h-2 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F05A28] rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">Taste Profile</h3>
            <p className="text-sm opacity-90 mb-4 leading-6">
              You're exploring more Italian and Japanese spots this month than
              usual.
            </p>
            <button className="bg-white text-[#F05A28] px-6 py-3 rounded-full text-xs font-semibold w-fit active:scale-95 transition-transform">
              UNLOCK REWARDS
            </button>
          </div>
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

export default MyDining;
