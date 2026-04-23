import { User, Edit2 } from 'lucide-react';
import TasteRadar from '../common/TasteRadar';

<<<<<<< HEAD
const ProfileCard = ({ user, userProfile, chartData, chartOptions }) => (
  <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          {user ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-50"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-orange-50 text-slate-400">
              <User size={48} />
            </div>
          )}
          <button className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 border border-gray-100 hover:text-[#F05A28] cursor-pointer">
            <Edit2 size={14} />
          </button>
        </div>
        <div className="text-center">
          <span className="text-[10px] font-bold text-[#F05A28] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">
            {user ? 'Expert' : 'Guest'}
          </span>
          <h2 className="text-xl font-bold mt-1">
            {user ? user.displayName : userProfile.nickname}
          </h2>
=======
const ProfileCard = ({
  user,
  userProfile,
  tasteProfile,
  onEditTasteProfile,
}) => {
  return (
    <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            {user ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-orange-50 shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center border-4 border-orange-50 text-slate-400">
                <User size={48} />
              </div>
            )}

            <button
              onClick={onEditTasteProfile}
              className="absolute bottom-0 right-0 p-1.5 bg-white shadow-md rounded-full text-slate-400 border border-gray-100 hover:text-[#F05A28] transition-colors cursor-pointer"
            >
              <Edit2 size={14} />
            </button>
          </div>

          <div className="text-center min-w-max px-1">
            <span className="text-[10px] font-bold text-[#F05A28] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">
              {user ? 'Expert' : userProfile.level}
            </span>

            <h2 className="text-xl font-bold mt-1 whitespace-nowrap text-slate-900">
              {user ? user.displayName : userProfile.nickname}
            </h2>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="flex items-center mb-2">
            <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full"></span>
              Taste Profile
            </h3>
          </div>

          <span className="absolute top-0 right-0 text-[9px] sm:text-[10px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md z-10">
            AI Analyzed
          </span>

          <div className="w-full aspect-square flex items-center justify-center pt-4 overflow-hidden">
            <TasteRadar profile={tasteProfile} size={220} showLabels />
          </div>
>>>>>>> c278fb9df2eb3c37725e22bb490455ce4947fa76
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="flex items-center mb-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#F05A28] rounded-full"></span>Taste
            Profile
          </h3>
        </div>
        <span className="absolute top-0 right-0 text-[9px] font-medium text-[#F05A28] bg-orange-50 px-2 py-0.5 rounded-md">
          AI Analyzed
        </span>
        <div className="w-full aspect-square flex items-center justify-center pt-4">
          <Radar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  </section>
);

export default ProfileCard;
