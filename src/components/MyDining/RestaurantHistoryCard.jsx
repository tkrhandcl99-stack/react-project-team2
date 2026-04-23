import React from 'react';
import { Star } from 'lucide-react';

const RestaurantHistoryCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col group transition-transform hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="flex items-center gap-1">
            <Star size={16} className="text-orange-500 fill-orange-500" />
            <span className="text-[11px] font-semibold">
              {restaurant.rating}
            </span>
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-3">
          <h3 className="text-lg font-bold text-slate-900">
            {restaurant.name}
          </h3>
          <span className="bg-gray-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
            {restaurant.category}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          {restaurant.reviews} reviews • {restaurant.price}
        </p>

        <div className="mt-auto bg-gray-50 p-3 rounded-lg border-l-4 border-[#F05A28]">
          <p className="italic text-sm text-slate-600 line-clamp-2">
            "{restaurant.quote}"
          </p>
          <p className="text-[10px] font-semibold text-slate-400 mt-2">
            — {restaurant.author}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHistoryCard;
